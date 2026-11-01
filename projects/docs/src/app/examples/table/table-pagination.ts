import { Component } from '@angular/core';
import { TableColumn, TableComponent, TablePagination } from 'ngx-hr-ui';

interface Employee {
  id: number;
  name: string;
  department: string;
  jobTitle: string;
}

@Component({
  selector: 'example-table-pagination',
  imports: [TableComponent],
  host: { class: 'w-full min-w-0' },
  template: `<oct-table class="w-full" [columns]="columns" [data]="employees" [pagination]="pagination" />`
})
export default class TablePaginationExample {
  // totalNumPages: 0 means the table has every row and makes the pages itself.
  readonly pagination: TablePagination = { page: 1, pageSize: 10, totalNums: 0, totalNumPages: 0 };

  readonly columns: TableColumn<Employee>[] = [
    { key: 'name', label: 'Employee', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'jobTitle', label: 'Job title', sortable: true }
  ];

  readonly employees: Employee[] = [
    { id: 1, name: 'Tan Wei Ming', department: 'Finance', jobTitle: 'Payroll Analyst' },
    { id: 2, name: 'Priya Raman', department: 'People', jobTitle: 'HR Business Partner' },
    { id: 3, name: 'Muhammad Hafiz', department: 'Operations', jobTitle: 'Warehouse Supervisor' },
    { id: 4, name: 'Chloe Lim', department: 'Sales', jobTitle: 'Account Executive' },
    { id: 5, name: 'Arjun Mehta', department: 'Engineering', jobTitle: 'Software Engineer' },
    { id: 6, name: 'Nurul Aisyah', department: 'Finance', jobTitle: 'Accounts Assistant' },
    { id: 7, name: 'Daniel Okafor', department: 'Engineering', jobTitle: 'QA Engineer' },
    { id: 8, name: 'Sakura Yamamoto', department: 'Marketing', jobTitle: 'Brand Manager' },
    { id: 9, name: 'Rizal Santos', department: 'Operations', jobTitle: 'Logistics Coordinator' },
    { id: 10, name: 'Mei Ling Chua', department: 'People', jobTitle: 'Recruiter' },
    { id: 11, name: 'Lukas Schneider', department: 'Engineering', jobTitle: 'Engineering Manager' },
    { id: 12, name: 'Siti Rahmah', department: 'Customer Success', jobTitle: 'Support Specialist' },
    { id: 13, name: 'Kavitha Subramaniam', department: 'Finance', jobTitle: 'Finance Manager' },
    { id: 14, name: 'Nguyen Thi Lan', department: 'Sales', jobTitle: 'Sales Coordinator' },
    { id: 15, name: 'Ethan Goh', department: 'Operations', jobTitle: 'Delivery Driver' },
    { id: 16, name: 'Fatimah Zahra', department: 'Legal', jobTitle: 'Legal Counsel' },
    { id: 17, name: 'Rajesh Kumar', department: 'Engineering', jobTitle: 'DevOps Engineer' },
    { id: 18, name: 'Amelia Wong', department: 'Marketing', jobTitle: 'Content Writer' },
    { id: 19, name: 'Joon-ho Park', department: 'Sales', jobTitle: 'Regional Sales Manager' },
    { id: 20, name: 'Grace Teo', department: 'People', jobTitle: 'Payroll Manager' },
    { id: 21, name: 'Ahmad Faizal', department: 'Operations', jobTitle: 'Forklift Operator' },
    { id: 22, name: 'Isabella Cruz', department: 'Customer Success', jobTitle: 'Team Lead' },
    { id: 23, name: 'Hiroshi Tanaka', department: 'Finance', jobTitle: 'Treasury Analyst' },
    { id: 24, name: 'Lakshmi Pillai', department: 'Legal', jobTitle: 'Paralegal' }
  ];
}
