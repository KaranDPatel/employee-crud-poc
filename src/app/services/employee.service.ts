import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employees: Employee[] = [
    {
      id: 1,
      firstName: 'Vikas',
      lastName: 'Verma',
      email: 'vikas@company.com',
      department: 'IT',
      position: 'HR',
      salary: 75000,
      hireDate: new Date('2022-01-15'),
      isActive: true
    },
    {
      id: 2,
      firstName: 'Karan',
      lastName: 'Patel',
      email: 'karan@company.com',
      department: 'IT',
      position: 'Developer',
      salary: 65000,
      hireDate: new Date('2021-08-20'),
      isActive: true
    },
    {
      id: 3,
      firstName: 'Abhishek',
      lastName: 'Ahuja',
      email: 'ahuja@company.com',
      department: 'HR',
      position: 'HR Specialist',
      salary: 55000,
      hireDate: new Date('2023-03-10'),
      isActive: true
    },
    {
      id: 4,
      firstName: 'Stephen',
      lastName: 'Agbor',
      email: 'agbor@company.com',
      department: 'Finance',
      position: 'Financial Analyst',
      salary: 60000,
      hireDate: new Date('2022-11-05'),
      isActive: false
    }
  ];

  private nextId = 5;

  getEmployees(): Observable<Employee[]> {
    return of([...this.employees]);
  }

  getEmployee(id: number): Observable<Employee | undefined> {
    const employee = this.employees.find(emp => emp.id === id);
    if (employee) {
      return of({ ...employee });
    }
    return throwError(() => new Error('Employee not found'));
  }

  addEmployee(employeeData: Omit<Employee, 'id'>): Observable<Employee> {
    const newEmployee: Employee = {
      ...employeeData,
      id: this.nextId++,
      hireDate: new Date(employeeData.hireDate)
    };
    
    // Check for duplicate email
    if (this.employees.some(emp => emp.email === newEmployee.email)) {
      return throwError(() => new Error('Employee with this email already exists'));
    }
    
    this.employees.push(newEmployee);
    return of({ ...newEmployee });
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    const index = this.employees.findIndex(emp => emp.id === employee.id);
    if (index === -1) {
      return throwError(() => new Error('Employee not found'));
    }
    
    // Check for duplicate email (excluding current employee)
    if (this.employees.some(emp => emp.email === employee.email && emp.id !== employee.id)) {
      return throwError(() => new Error('Employee with this email already exists'));
    }
    
    this.employees[index] = { ...employee, hireDate: new Date(employee.hireDate) };
    return of({ ...this.employees[index] });
  }

  deleteEmployee(id: number): Observable<void> {
    const index = this.employees.findIndex(emp => emp.id === id);
    if (index === -1) {
      return throwError(() => new Error('Employee not found'));
    }
    
    this.employees.splice(index, 1);
    return of(void 0);
  }
}