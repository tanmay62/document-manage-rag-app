import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, delay, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MockApiService {
  private http = inject(HttpClient);

  private currentUserSubject = new BehaviorSubject<string | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userDocuments = new Map<string, any[]>();
  private ingestionStatus = new Map<string, string>();

  currentUser$ = this.currentUserSubject.asObservable();
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private mockQnAData: { question: string; answer: string; documentExcerpt: string }[] = [
    {
      question: "What is Angular?",
      answer: "Angular is a TypeScript-based web application framework developed by Google.",
      documentExcerpt: "Found in 'Angular Guide.pdf'."
    },
    {
      question: "What is TypeScript?",
      answer: "TypeScript is a superset of JavaScript that adds static typing and interfaces.",
      documentExcerpt: "Found in 'TypeScript Basics.docx'."
    },
    {
      question: "How does Dependency Injection work in Angular?",
      answer: "Dependency Injection (DI) in Angular allows components to receive services via providers.",
      documentExcerpt: "Found in 'Angular DI Explained.txt'."
    },
    {
      question: "What is a Service in Angular?",
      answer: "A Service in Angular is a class that provides reusable business logic and data handling.",
      documentExcerpt: "Found in 'Angular Services Overview.pdf'."
    }
  ];

  private apiUrl = 'http://localhost:3000/api/users';

  constructor() {
    console.log('MockApiService initialized');
  }

  setCurrentUser(username: string): void {
    console.log('Setting current user:', username);
    this.currentUserSubject.next(username);
    this.isLoggedInSubject.next(true);

    if (!this.userDocuments.has(username)) {
      this.userDocuments.set(username, []);
      this.ingestionStatus.set(username, 'Not Started');
    }
  }

  getDashboardData(): Observable<{ documentCount: number; ingestionStatus: string }> {
    const username = this.currentUserSubject.value;
    if (!username) {
      console.warn('getDashboardData() called with no logged-in user');
      return of({ documentCount: 0, ingestionStatus: 'Unknown' });
    }

    return of({
      documentCount: this.userDocuments.get(username)?.length || 0,
      ingestionStatus: this.ingestionStatus.get(username) || 'Not Started',
    }).pipe(delay(1000));
  }

  getUploadedDocuments(username: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      map(users => {
        const user = users.find(u => u.username === username);
        return user ? user.uploadedDocuments || [] : [];
      }),
      catchError(() => of([]))
    );
  }

  uploadDocument(formData: FormData): Promise<void> {
    return fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Failed to upload file: ${errorMessage}`);
        }
      })
      .catch((error) => {
        console.error('Upload error:', error);
        throw error;
      });
  }

  askQuestion(question: string): Observable<{ answer: string; documentExcerpt: string }> {
    const username = this.currentUserSubject.value;
    if (!username) {
      return of({ answer: 'User not found.', documentExcerpt: '' });
    }

    console.log(`User ${username} asked: "${question}"`);

    const match = this.mockQnAData.find(qna =>
      qna.question.toLowerCase().includes(question.toLowerCase())
    );

    return of({
      answer: match ? match.answer : 'No answer found. Try rephrasing your question.',
      documentExcerpt: match ? match.documentExcerpt : 'No related document found.',
    }).pipe(delay(1000));
  }

  uploadFile(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    return fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to upload file');
        }
        return response.json();
      });
  }

  getUserRole(username: string): Observable<string> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => {
        const user = users.find(u => u.username === username);
        return user ? user.role : 'User';
      })
    );
  }


  clearUserSession(): void {
    this.currentUserSubject.next(null);
  }

}
