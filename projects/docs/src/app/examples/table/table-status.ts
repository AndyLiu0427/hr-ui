import { Component } from '@angular/core';
import { TableColumn, TableComponent } from 'ngx-hr-ui';

interface Employee {
  id: number;
  name: string;
  startDate: string;
  employmentStatus: string;
}

@Component({
  selector: 'example-table-status',
  imports: [TableComponent],
  host: { class: 'w-full min-w-0' },
  template: `<oct-table class="w-full" [columns]="columns" [data]="employees" />`
})
export default class TableStatus {
  readonly columns: TableColumn<Employee>[] = [
    { key: 'name', label: 'Employee' },
    { key: 'startDate', label: 'Start date' },
    // The key contains "status", so each value shows as a coloured badge.
    { key: 'employmentStatus', label: 'Status' }
  ];

  readonly employees: Employee[] = [
    { id: 1, name: 'Grace Teo', startDate: '04 Jan 2021', employmentStatus: 'Active' },
    { id: 2, name: 'Ahmad Faizal', startDate: '02 Nov 2026', employmentStatus: 'New' },
    { id: 3, name: 'Lakshmi Pillai', startDate: '16 Nov 2026', employmentStatus: 'Pending' },
    { id: 4, name: 'Hiroshi Tanaka', startDate: '01 Mar 2019', employmentStatus: 'Inactive' },
    { id: 5, name: 'Mei Ling Chua', startDate: '07 Aug 2023', employmentStatus: 'Completed' }
  ];
}
