import { Component } from '@angular/core';
import { TableColumn, TableComponent } from 'ngx-hr-ui';

interface Employee {
  id: number;
  name: string;
  jobTitle: string;
  salary: number;
  status: string;
}

const amount = new Intl.NumberFormat('en-SG', { minimumFractionDigits: 2 });

@Component({
  selector: 'example-table-demo',
  imports: [TableComponent],
  host: { class: 'w-full min-w-0' },
  template: `<oct-table class="w-full" [columns]="columns" [data]="employees" />`
})
export default class TableDemo {
  readonly columns: TableColumn<Employee>[] = [
    { key: 'name', label: 'Employee', sortable: true },
    { key: 'jobTitle', label: 'Job title', sortable: true },
    { key: 'salary', label: 'Salary (SGD)', align: 'right', sortable: true, width: 140, render: value => amount.format(value) },
    { key: 'status', label: 'Status', sortable: true, width: 110 }
  ];

  readonly employees: Employee[] = [
    { id: 1, name: 'Tan Wei Ming', jobTitle: 'Payroll Analyst', salary: 5200, status: 'Active' },
    { id: 2, name: 'Priya Raman', jobTitle: 'HR Business Partner', salary: 7400, status: 'Active' },
    { id: 3, name: 'Muhammad Hafiz', jobTitle: 'Warehouse Supervisor', salary: 4100, status: 'Pending' },
    { id: 4, name: 'Chloe Lim', jobTitle: 'Account Executive', salary: 4650, status: 'Active' },
    { id: 5, name: 'Daniel Okafor', jobTitle: 'QA Engineer', salary: 6300, status: 'Inactive' },
    { id: 6, name: 'Sakura Yamamoto', jobTitle: 'Brand Manager', salary: 6900, status: 'Active' }
  ];
}
