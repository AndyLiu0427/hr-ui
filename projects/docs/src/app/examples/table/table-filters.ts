import { Component, computed, signal } from '@angular/core';
import { TableColumn, TableComponent, TableFiltersComponent, TableFiltersConfig } from 'ngx-hr-ui';

interface Employee {
  id: number;
  name: string;
  department: string;
  status: string;
}

const EMPLOYEES: Employee[] = [
  { id: 1, name: 'Tan Wei Ming', department: 'Finance', status: 'Active' },
  { id: 2, name: 'Priya Raman', department: 'People', status: 'Active' },
  { id: 3, name: 'Muhammad Hafiz', department: 'Operations', status: 'Pending' },
  { id: 4, name: 'Nurul Aisyah', department: 'Finance', status: 'Inactive' },
  { id: 5, name: 'Rizal Santos', department: 'Operations', status: 'Active' },
  { id: 6, name: 'Grace Teo', department: 'People', status: 'Pending' }
];

@Component({
  selector: 'example-table-filters',
  imports: [TableComponent, TableFiltersComponent],
  host: { class: 'w-full min-w-0' },
  template: `
    <div class="flex w-full flex-col gap-3">
      <oct-table-filters [filters]="filters" />
      <oct-table [columns]="columns" [data]="employees()" [hideEmptyIcon]="true" emptyMessage="No employees match these filters" />
    </div>
  `
})
export default class TableFiltersExample {
  readonly departments = signal<string[]>([]);
  readonly statuses = signal<string[]>([]);

  // Each filter writes its picks into its own signal.
  readonly filters: TableFiltersConfig<string>[] = [
    {
      key: 'department',
      label: 'Department',
      options: ['Finance', 'People', 'Operations'].map(value => ({ label: value, value })),
      selectedValues: this.departments
    },
    {
      key: 'status',
      label: 'Status',
      options: ['Active', 'Pending', 'Inactive'].map(value => ({ label: value, value })),
      selectedValues: this.statuses
    }
  ];

  readonly employees = computed(() =>
    EMPLOYEES.filter(
      e => (!this.departments().length || this.departments().includes(e.department)) && (!this.statuses().length || this.statuses().includes(e.status))
    )
  );

  readonly columns: TableColumn<Employee>[] = [
    { key: 'name', label: 'Employee' },
    { key: 'department', label: 'Department' },
    { key: 'status', label: 'Status' }
  ];
}
