import { Component, signal } from '@angular/core';
import { RowAction, TableColumn, TableComponent } from 'ngx-hr-ui';

interface PayrollLine {
  id: number;
  name: string;
  employeeCode: string;
  department: string;
  basicPay: number;
  allowances: number;
  overtime: number;
  cpfEmployee: number;
  netPay: number;
}

const amount = new Intl.NumberFormat('en-SG', { minimumFractionDigits: 2 });
const money = (value: number): string => amount.format(value);

@Component({
  selector: 'example-table-fixed-columns',
  imports: [TableComponent],
  host: { class: 'w-full min-w-0' },
  template: `
    <div class="flex w-full flex-col gap-3">
      <oct-table [columns]="columns" [data]="lines" [rowActions]="actions" />
      <p class="text-sm text-3">{{ opened() ? 'Opened the payslip of ' + opened() : 'Scroll sideways: the first and last columns stay in place.' }}</p>
    </div>
  `
})
export default class TableFixedColumns {
  readonly opened = signal('');

  // The first column sticks to the left edge, and the actions column to the right.
  readonly columns: TableColumn<PayrollLine>[] = [
    { key: 'name', label: 'Employee', width: 180, fixed: true },
    { key: 'employeeCode', label: 'Code', width: 110 },
    { key: 'department', label: 'Department', width: 140 },
    { key: 'basicPay', label: 'Basic pay', width: 130, align: 'right', render: money },
    { key: 'allowances', label: 'Allowances', width: 130, align: 'right', render: money },
    { key: 'overtime', label: 'Overtime', width: 130, align: 'right', render: money },
    { key: 'cpfEmployee', label: 'Employee CPF', width: 140, align: 'right', render: money },
    { key: 'netPay', label: 'Net pay', width: 130, align: 'right', render: money },
    { key: 'actions', label: '', fixed: true }
  ];

  readonly actions = (): RowAction<PayrollLine>[] => [
    { key: 'payslip', label: 'View payslip', icon: 'FileText', color: 'neutral', onClick: row => this.opened.set(row.name) }
  ];

  readonly lines: PayrollLine[] = [
    { id: 1, name: 'Tan Wei Ming', employeeCode: 'EMP-1001', department: 'Finance', basicPay: 5200, allowances: 300, overtime: 0, cpfEmployee: 1100, netPay: 4400 },
    { id: 2, name: 'Muhammad Hafiz', employeeCode: 'EMP-1003', department: 'Operations', basicPay: 4100, allowances: 250, overtime: 412.5, cpfEmployee: 952.5, netPay: 3810 },
    { id: 3, name: 'Chloe Lim', employeeCode: 'EMP-1004', department: 'Sales', basicPay: 4650, allowances: 400, overtime: 0, cpfEmployee: 1010, netPay: 4040 },
    { id: 4, name: 'Daniel Okafor', employeeCode: 'EMP-1007', department: 'Engineering', basicPay: 6300, allowances: 0, overtime: 0, cpfEmployee: 1260, netPay: 5040 }
  ];
}
