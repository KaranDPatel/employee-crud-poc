import { createReducer, on } from '@ngrx/store';
import { EmployeeState } from '../models/employee.model';
import * as EmployeeActions from './employee.actions';

export const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
  selectedEmployee: null
};

export const employeeReducer = createReducer(
  initialState,
  
  // Load Employees
  on(EmployeeActions.loadEmployees, state => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(EmployeeActions.loadEmployeesSuccess, (state, { employees }) => ({
    ...state,
    employees,
    loading: false,
    error: null
  })),
  
  on(EmployeeActions.loadEmployeesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Add Employee
  on(EmployeeActions.addEmployee, state => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(EmployeeActions.addEmployeeSuccess, (state, { employee }) => ({
    ...state,
    employees: [...state.employees, employee],
    loading: false,
    error: null
  })),
  
  on(EmployeeActions.addEmployeeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Update Employee
  on(EmployeeActions.updateEmployee, state => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(EmployeeActions.updateEmployeeSuccess, (state, { employee }) => ({
    ...state,
    employees: state.employees.map(emp => 
      emp.id === employee.id ? employee : emp
    ),
    loading: false,
    error: null,
    // selectedEmployee: null
  })),
  
  on(EmployeeActions.updateEmployeeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Delete Employee
  on(EmployeeActions.deleteEmployee, state => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(EmployeeActions.deleteEmployeeSuccess, (state, { id }) => ({
    ...state,
    employees: state.employees.filter(emp => emp.id !== id),
    loading: false,
    error: null
  })),
  
  on(EmployeeActions.deleteEmployeeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Select Employee
  on(EmployeeActions.selectEmployee, (state, { employee }) => ({
    ...state,
    selectedEmployee: employee
  })),
  
  on(EmployeeActions.clearSelectedEmployee, state => ({
    ...state,
    selectedEmployee: null
  }))
);