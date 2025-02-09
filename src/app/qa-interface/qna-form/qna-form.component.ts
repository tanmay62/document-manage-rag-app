import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MockApiService } from '../../services/mock-api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-qna-form',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './qna-form.component.html',
  styleUrls: ['./qna-form.component.css'],
})
export class QnaFormComponent implements OnInit {
  question: string = '';
  answer: string = '';
  documentExcerpt: string = '';
  userName: string = '';
  isLoading: boolean = false;

  constructor(private mockApiService: MockApiService, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['user']) {
        this.userName = params['user'];
        this.mockApiService.setCurrentUser(this.userName);
        this.loadDocumentCount();
      }
    });
  }

  submitQuestion(event: Event): void {
    event.preventDefault();

    if (!this.question.trim()) {
      alert('Please enter a question.');
      return;
    }

    this.isLoading = true;
    this.answer = '';
    this.documentExcerpt = '';

    this.mockApiService.askQuestion(this.question).subscribe({
      next: (response) => {
        this.answer = response.answer;
        this.documentExcerpt = response.documentExcerpt;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching answer:', err);
        this.answer = 'An error occurred. Please try again.';
        this.isLoading = false;
      },
    });
  }

  loadDocumentCount(): void {
    console.log(`Loading documents for user: ${this.userName}`);
  }
}
