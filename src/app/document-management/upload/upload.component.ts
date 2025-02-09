import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MockApiService } from '../../services/mock-api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-upload',
  imports: [CommonModule, RouterModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit {
  username : string = '';
  uploadedDocuments: any[] = [];
  selectedFile: File | null = null;
  uploadMessage: string = '';

  constructor(private route: ActivatedRoute, private mockApiService: MockApiService, private http: HttpClient) {}

  private apiUrl = 'http://localhost:3000/api/users';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['user']) {
        this.username = params['user'];
        this.loadDocuments();
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file ? file : null;
  }

  async uploadDocument(event: Event) {
    event.preventDefault();

    if (!this.selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('username', this.username);

    try {
      const response: any = await this.mockApiService.uploadDocument(formData);
      if (response && response.uploadedDocuments) {
        this.uploadedDocuments = response.uploadedDocuments;
      }
      alert('File uploaded successfully!');
      this.selectedFile = null;
      this.loadDocuments();
    } catch (error) {
      console.error('File upload failed:', error);
      alert('File upload failed. Please try again.');
    }
  }

  viewDocument(doc: { name: string; url: string }) {
    window.open(doc.url, '_blank');
  }

  deleteDocument(documentId: number) {
    if (!this.username) return;

    if(confirm("Are you sure you want delete this document ?")){
      this.http.delete(`${this.apiUrl}/${this.username}/documents/${documentId}`)
      .subscribe({
        next: () => {
          this.uploadedDocuments = this.uploadedDocuments.filter(doc => doc.id !== documentId);
        },
        error: err => console.error('Error deleting document:', err)
      });
    }

  }

  loadDocuments(): void {
    if (!this.username) return;

    this.mockApiService.getUploadedDocuments(this.username).subscribe(user => {
      if (user) {
        this.uploadedDocuments = user || [];
      } else {
        this.uploadedDocuments = [];
      }
    });
  }
}
