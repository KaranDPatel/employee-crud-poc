import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-12">
          <div class="d-flex align-items-center mb-4">
            <i class="bi bi-people-fill text-primary me-3" style="font-size: 2rem;"></i>
            <div>
              <h1 class="mb-0">Employee Management System</h1>
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
}