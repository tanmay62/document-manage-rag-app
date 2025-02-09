import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';
import { MockApiService } from '../services/mock-api.service';

@Component({
  selector: 'app-ingestion',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatButtonModule, MatIconModule],
  templateUrl: './ingestion.component.html',
  styleUrls: ['./ingestion.component.scss'],
})
export class IngestionComponent {
  isProcessing = signal(false);
  progress = signal(0);
  currentUser: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute, private mockServiceApi: MockApiService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.currentUser = params['user'];
      this.loadUserIngestionData();
    });
  }

  loadUserIngestionData() {
    if (!this.currentUser) return;

    const userIngestionData = JSON.parse(localStorage.getItem('ingestionData') || '{}');
    if (userIngestionData[this.currentUser]) {
      this.progress.set(userIngestionData[this.currentUser].progress);
      this.isProcessing.set(userIngestionData[this.currentUser].isProcessing);

      if (this.progress() === 100) {
        this.isProcessing.set(false);
      }
    }
  }

  saveUserIngestionData() {
    if (!this.currentUser) return;

    const userIngestionData = JSON.parse(localStorage.getItem('ingestionData') || '{}');
    userIngestionData[this.currentUser] = {
      progress: this.progress(),
      isProcessing: this.isProcessing(),
    };

    localStorage.setItem('ingestionData', JSON.stringify(userIngestionData));
  }

  startIngestion() {
    if (!this.currentUser) {
      setTimeout(() => {
        if (!this.currentUser) {
          alert('No user logged in!');
        }
      }, 500); // Delay to wait for queryParams to update
      return;
    }

    this.isProcessing.set(true);
    this.progress.set(0);
    this.saveUserIngestionData();

    const interval = setInterval(() => {
      if (this.progress() < 100) {
        this.progress.set(this.progress() + 10);
        this.saveUserIngestionData();
      } else {
        clearInterval(interval);
        this.progress.set(100);
        this.isProcessing.set(false);
        this.saveUserIngestionData();

        alert('Ingestion process completed successfully!');
        this.router.navigate(['/dashboard'], { queryParams: { user: this.currentUser } });
      }
    }, 500);
  }
}
