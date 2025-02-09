import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MockApiService } from '../../services/mock-api.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private mockApiService = inject(MockApiService);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.loginForm.value)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        this.mockApiService.setCurrentUser(data.user.username);

        this.mockApiService.isLoggedIn$.subscribe((loggedIn) => {
          console.log('User is logged in:', loggedIn);
        });

        this.router.navigate(['/dashboard'], { queryParams: { user: data.user.username } });

      } catch (error: any) {
        alert(error.message);
      }
    }
  }
}
