import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EmployeeState } from '../models/employee.model';

export const selectEmployeeState = createFeatureSelector<EmployeeState>('employees');

export const selectAllEmployees = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.employees
);

export const selectEmployeesLoading = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.loading
);

export const selectEmployeesError = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.error
);

export const selectSelectedEmployee = createSelector(
  selectEmployeeState,
  (state: EmployeeState) => state.selectedEmployee
);

export const selectEmployeeById = (id: number) => createSelector(
  selectAllEmployees,
  (employees) => employees.find(emp => emp.id === id)
);