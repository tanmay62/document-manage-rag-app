import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MockApiService } from '../services/mock-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  userRole: string = 'User';
  documentCount: number = 0;
  ingestionStatus: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private mockApiService: MockApiService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['user']) {
        this.userName = params['user'];
        this.loadDocumentCount();
      }
    });

    this.mockApiService.currentUser$.subscribe({
      next: (username) => {
        if (!this.userName && username) {
          this.userName = username;
          this.loadDocumentCount();
        }

        if (!this.userName) {
          console.log('No user found, redirecting to login...');
          this.router.navigate(['/login']);
        }
      },
      error: (err) => console.error('Error fetching current user:', err),
    });

    this.mockApiService.getDashboardData().subscribe({
      next: (data) => {
        console.log('Dashboard data received:', data);
        this.documentCount = data.documentCount;
        this.ingestionStatus = data.ingestionStatus;
      },
      error: (err) => console.error('Error fetching dashboard data:', err),
    });
  }

  loadDocumentCount(): void {
    if (!this.userName) return;

    this.mockApiService.getUploadedDocuments(this.userName).subscribe({
      next: (documents) => {
        this.documentCount = documents?.length || 0;
      },
      error: (err) => console.error('Error fetching uploaded documents:', err),
    });
  }

  loadUserRole(): void {
    this.mockApiService.getUserRole(this.userName).subscribe({
      next: (role) => {
        this.userRole = role;
      },
      error: (err) => console.error('Error fetching user role:', err),
    });
  }

  logout(): void {
    this.mockApiService.clearUserSession();
    this.router.navigate(['/login']);
  }
}
