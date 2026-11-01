import { Component } from '@angular/core';
import { TableColumn, TableComponent } from 'ngx-hr-ui';

interface Payslip {
  id: number;
  employee: string;
  grossPay: number;
  netPay: number;
}

const amount = new Intl.NumberFormat('en-SG', { minimumFractionDigits: 2 });

const PAYSLIPS: Payslip[] = [
  { id: 1, employee: 'Tan Wei Ming', grossPay: 5200, netPay: 4160 },
  { id: 2, employee: 'Priya Raman', grossPay: 7400, netPay: 5920 },
  { id: 3, employee: 'Chloe Lim', grossPay: 4650, netPay: 3720 },
  { id: 4, employee: 'Arjun Mehta', grossPay: 6800, netPay: 5440 }
];

@Component({
  selector: 'example-table-footer',
  imports: [TableComponent],
  host: { class: 'w-full min-w-0' },
  template: `
    <oct-table class="w-full" [columns]="columns" [data]="payslips">
      <!-- The footer gets a summary: totalRows, selectedRows, filteredData and more. -->
      <ng-template #footerTemplate let-summary>
        <div class="flex justify-between gap-4 px-1 text-sm">
          <span class="text-2">{{ summary.totalRows }} employees</span>
          <span class="font-medium text-1 tabular-nums">Total net pay: SGD {{ totalNetPay }}</span>
        </div>
      </ng-template>
    </oct-table>
  `
})
export default class TableFooter {
  readonly payslips = PAYSLIPS;
  readonly totalNetPay = amount.format(PAYSLIPS.reduce((sum, payslip) => sum + payslip.netPay, 0));

  readonly columns: TableColumn<Payslip>[] = [
    { key: 'employee', label: 'Employee' },
    { key: 'grossPay', label: 'Gross pay (SGD)', align: 'right', render: value => amount.format(value) },
    { key: 'netPay', label: 'Net pay (SGD)', align: 'right', render: value => amount.format(value) }
  ];
}
