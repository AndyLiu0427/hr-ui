import { Component, computed, signal } from '@angular/core';
import { TableColumn, TableComponent, TablePagination } from 'ngx-hr-ui';

interface Payslip {
  id: number;
  employeeCode: string;
  period: string;
  netPay: number;
}

// Stands in for your API: 137 payslips, sent one page at a time.
const PAYSLIPS: Payslip[] = Array.from({ length: 137 }, (_, i) => ({
  id: i + 1,
  employeeCode: `EMP-${1001 + i}`,
  period: 'Oct 2026',
  netPay: 3200 + ((i * 1237) % 4800)
}));

const amount = new Intl.NumberFormat('en-SG', { minimumFractionDigits: 2 });

@Component({
  selector: 'example-table-server-pagination',
  imports: [TableComponent],
  host: { class: 'w-full min-w-0' },
  template: `
    <oct-table
      class="w-full"
      [columns]="columns"
      [data]="rows()"
      [pagination]="pagination()"
      (pageChange)="page.set($event)"
      (pageSizeChange)="pageSize.set($event)"
    />
  `
})
export default class TableServerPagination {
  readonly page = signal(1);
  readonly pageSize = signal(10);

  // totalNumPages above 0 tells the table that data is already one page.
  readonly pagination = computed<TablePagination>(() => ({
    page: this.page(),
    pageSize: this.pageSize(),
    totalNums: PAYSLIPS.length,
    totalNumPages: Math.ceil(PAYSLIPS.length / this.pageSize())
  }));

  // In your app, fetch this page from the server instead.
  readonly rows = computed(() => PAYSLIPS.slice((this.page() - 1) * this.pageSize(), this.page() * this.pageSize()));

  readonly columns: TableColumn<Payslip>[] = [
    { key: 'employeeCode', label: 'Employee code' },
    { key: 'period', label: 'Pay period' },
    { key: 'netPay', label: 'Net pay (SGD)', align: 'right', render: value => amount.format(value) }
  ];
}
