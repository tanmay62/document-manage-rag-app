import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app/app.routes';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MockApiService } from './app/services/mock-api.service';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    { provide: MockApiService, useClass: MockApiService },
    importProvidersFrom(RouterModule.forRoot(appRoutes)),
    provideAnimations()
  ],
}).catch((err) => console.error(err));
