import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent {
  users = signal<User[]>([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User' },
  ]);

  currentUser = signal<User>({ id: 1, name: 'Admin', email: 'admin@example.com', role: 'Admin' });

  constructor(private snackBar: MatSnackBar, private router: Router) {}

  isAdmin = computed(() => this.currentUser().role === 'Admin');

  changeRole(userId: number, newRole: 'Admin' | 'User') {
    this.users.update(users => {
      return users.map(user => (user.id === userId ? { ...user, role: newRole } : user));
    });
    this.snackBar.open('Role updated successfully!', 'Close', { duration: 3000 });
  }
}
