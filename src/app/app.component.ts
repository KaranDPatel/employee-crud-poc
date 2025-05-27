import { Component } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  template: `
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="d-flex align-items-center">
              <i class="bi bi-people-fill text-primary me-3" style="font-size: 2rem;"></i>
              <h1 class="mb-0">Employee Management System</h1>
            </div>
            <div *ngIf="isLoggedIn()">
              <button class="btn btn-outline-danger" (click)="logout()">Logout</button>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-8 mb-4">
          <app-employee-list></app-employee-list>
        </div>
        <div class="col-lg-4">
          <app-employee-form></app-employee-form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container-fluid {
      background-color: #f8f9fa;
      min-height: 100vh;
    }

    h1 {
      color: #495057;
      font-weight: 600;
    }

    .text-primary {
      color: #0d6efd !important;
    }

    .text-muted {
      color: #6c757d !important;
    }
  `]
})
export class AppComponent {
  title = 'Employee CRUD Application';

  constructor(private authService: MsalService) {}

  logout(): void {
    this.authService.logoutRedirect({ postLogoutRedirectUri: '/' });
  }

  isLoggedIn(): boolean {
    return this.authService.instance.getAllAccounts().length > 0;
  }
}
