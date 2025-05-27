import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Employee } from '../../models/employee.model';
import * as EmployeeActions from '../../store/employee.actions';
import { selectSelectedEmployee, selectEmployeesLoading } from '../../store/employee.selectors';
import { firstValueFrom } from 'rxjs';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-employee-form',
  standalone:false,
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  employeeForm: FormGroup;
  isEditMode = false;
  loading$: Observable<boolean>;
  private destroy$ = new Subject<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.employeeForm = this.createForm();
    this.loading$ = this.store.select(selectEmployeesLoading);
  }

  ngOnInit(): void {
    this.store.select(selectSelectedEmployee)
      .pipe(takeUntil(this.destroy$))
      .subscribe(employee => {
        if (employee) {
          this.isEditMode = true;
          this.populateForm(employee);
        } else {
          this.isEditMode = false;
          this.employeeForm.reset();
          this.employeeForm.patchValue({ isActive: true });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      position: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(1)]],
      hireDate: ['', Validators.required],
      isActive: [true]
    });
  }

  private populateForm(employee: Employee): void {
    const hireDate = new Date(employee.hireDate);
    const formattedDate = hireDate.toISOString().split('T')[0];

    this.employeeForm.patchValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      salary: employee.salary,
      hireDate: formattedDate,
      isActive: employee.isActive
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  async onSubmit(): Promise<void> {
  if (this.employeeForm.valid) {
    const formValue = this.employeeForm.value;
    const employeeData = {
      ...formValue,
      hireDate: new Date(formValue.hireDate)
    };

    if (this.isEditMode) {
      const selectedEmployee = await firstValueFrom(this.store.select(selectSelectedEmployee));
      if (selectedEmployee) {
        this.store.dispatch(EmployeeActions.updateEmployee({
          employee: { ...employeeData, id: selectedEmployee.id }
        }));
      }
    } else {
      this.store.dispatch(EmployeeActions.addEmployee({ employee: employeeData }));
    }

    this.resetForm();
  }
}

private resetForm(): void {
  this.employeeForm.reset();
  this.employeeForm.patchValue({ isActive: true }); // Set default active state
  this.isEditMode = false;
  this.store.dispatch(EmployeeActions.clearSelectedEmployee());
}

  onCancel(): void {
    this.store.dispatch(EmployeeActions.clearSelectedEmployee());
    this.employeeForm.reset();
    this.employeeForm.patchValue({ isActive: true });
    this.cancel.emit();
  }
}
