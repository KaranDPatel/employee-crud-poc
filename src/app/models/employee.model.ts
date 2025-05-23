export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  hireDate: Date;
  isActive: boolean;
}

export interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  selectedEmployee: Employee | null;
}