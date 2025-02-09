import { Routes } from '@angular/router';
import { SignupComponent } from './user-management/signup/signup.component';
import { LoginComponent } from './user-management/login/login.component';
import { UploadComponent } from './document-management/upload/upload.component';
import { QnaFormComponent } from './qa-interface/qna-form/qna-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IngestionComponent } from './ingestion/ingestion.component';
import { UserManagementComponent } from './user-management/user-management.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'documents', component: UploadComponent },
  { path: 'ingestion', component: IngestionComponent },
  { path: 'qna', component: QnaFormComponent },
  { path: 'users', component: UserManagementComponent }
];
