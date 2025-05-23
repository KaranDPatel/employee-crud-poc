import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { ColDef, GridReadyEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { Employee } from '../../models/employee.model';
import * as EmployeeActions from '../../store/employee.actions';
import { selectAllEmployees, selectEmployeesLoading, selectEmployeesError } from '../../store/employee.selectors';

@Component({
  selector: 'app-employee-list',
  standalone:false,
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  employees$: Observable<Employee[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  private destroy$ = new Subject<void>();
  formVisible = false;

  columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'id', tooltipField: 'id', width: 80, sortable: true, filter: 'agNumberColumnFilter' },
    { headerName: 'First Name', field: 'firstName', tooltipField: 'firstName', sortable: true, filter: 'agTextColumnFilter' },
    { headerName: 'Last Name', field: 'lastName', tooltipField: 'lastName', sortable: true, filter: 'agTextColumnFilter' },
    { headerName: 'Email', field: 'email', tooltipField: 'email', sortable: true, filter: 'agTextColumnFilter', width: 250 },
    { headerName: 'Department', field: 'department', tooltipField: 'department', sortable: true, filter: 'agSetColumnFilter' },
    { headerName: 'Position', field: 'position', tooltipField: 'position', sortable: true, filter: 'agTextColumnFilter' },
    {
      headerName: 'Salary',
      field: 'salary',
      sortable: true,
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(params.value)
    },
    {
      headerName: 'Hire Date',
      field: 'hireDate',
      sortable: true,
      filter: 'agDateColumnFilter',
      valueFormatter: (params) => new Date(params.value).toLocaleDateString('en-US')
    },
    {
      headerName: 'Status',
      field: 'isActive',
      sortable: true,
      filter: 'agSetColumnFilter',
      width: 100,
      cellRenderer: (params: any) => {
        const isActive = params.value;
        const statusClass = isActive ? 'status-active' : 'status-inactive';
        const statusText = isActive ? 'Active' : 'Inactive';
        return `<span class="status-badge ${statusClass}">${statusText}</span>`;
      }
    },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => `
        <div class="btn-group btn-group-sm" role="group">
          <button type="button" class="btn btn-outline-primary btn-edit" data-id="${params.data.id}">Edit</button>
          <button type="button" class="btn btn-outline-danger btn-delete" data-id="${params.data.id}">Delete</button>
        </div>
      `,
      width: 150,
      sortable: false,
      filter: false,
      pinned: 'right'
    }
  ];

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    flex: 1,
    minWidth: 100,
    tooltipComponentParams: { color: '#fff' }
  };

  constructor(private store: Store) {
    this.employees$ = this.store.select(selectAllEmployees);
    this.loading$ = this.store.select(selectEmployeesLoading);
    this.error$ = this.store.select(selectEmployeesError);
  }

  ngOnInit(): void {
    this.store.dispatch(EmployeeActions.loadEmployees());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onGridReady(params: GridReadyEvent): void {
    const eGridDiv = document.querySelector('.ag-theme-alpine') as HTMLElement;
    eGridDiv.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;

      if (target.classList.contains('btn-edit')) {
        const employeeId = parseInt(target.getAttribute('data-id') || '0');
        this.onEditEmployee(employeeId);
      } else if (target.classList.contains('btn-delete')) {
        const employeeId = parseInt(target.getAttribute('data-id') || '0');
        this.onDeleteEmployee(employeeId);
      }
    });
  }

  onRowDoubleClicked(event: RowDoubleClickedEvent): void {
    this.onEditEmployee(event.data.id);
  }

  onCancel(): void {
    this.formVisible = false;
    this.store.dispatch(EmployeeActions.clearSelectedEmployee());
  }

  onAddEmployee(): void {
    this.store.dispatch(EmployeeActions.clearSelectedEmployee());
    this.formVisible = true;
  }

  onEditEmployee(id: number): void {
    this.employees$.pipe(take(1)).subscribe(employees => {
      const employee = employees.find(emp => emp.id === id);
      if (employee) {
        this.store.dispatch(EmployeeActions.selectEmployee({ employee }));
        this.formVisible = true;
      }
    });
  }

  onDeleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      this.store.dispatch(EmployeeActions.deleteEmployee({ id }));
    }
  }
}
