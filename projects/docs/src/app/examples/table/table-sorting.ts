import { Component, inject, signal } from '@angular/core';
import { DateService, TableColumn, TableComponent, TableSort } from 'ngx-hr-ui';

interface PayRun {
  id: number;
  period: string;
  payDate: string;
  employees: number;
  netPay: number;
}

const amount = new Intl.NumberFormat('en-SG', { minimumFractionDigits: 2 });

@Component({
  selector: 'example-table-sorting',
  imports: [TableComponent],
  host: { class: 'w-full min-w-0' },
  template: `
    <div class="flex w-full flex-col gap-3">
      <oct-table [columns]="columns" [data]="payRuns" (sortChange)="sort.set($event)" />
      <p class="text-sm text-3">Sorted by {{ sort().direction ? sort().key + ', ' + sort().direction : 'nothing' }}</p>
    </div>
  `
})
export default class TableSorting {
  private readonly dates = inject(DateService);
  readonly sort = signal<TableSort>({ key: '', direction: null });

  readonly columns: TableColumn<PayRun>[] = [
    { key: 'period', label: 'Pay period', sortable: true },
    // Sorts on the ISO date, shows "28 Oct 2026". Newest first when the table opens.
    { key: 'payDate', label: 'Pay date', sortable: true, defaultSort: 'desc', render: value => this.dates.formatDate(value) },
    { key: 'employees', label: 'Employees', align: 'right', sortable: true },
    { key: 'netPay', label: 'Net pay (SGD)', align: 'right', sortable: true, render: value => amount.format(value) }
  ];

  readonly payRuns: PayRun[] = [
    { id: 1, period: 'Jul 2026', payDate: '2026-07-28', employees: 204, netPay: 1018240 },
    { id: 2, period: 'Aug 2026', payDate: '2026-08-27', employees: 209, netPay: 1046915.5 },
    { id: 3, period: 'Sep 2026', payDate: '2026-09-28', employees: 211, netPay: 1052300 },
    { id: 4, period: 'Oct 2026', payDate: '2026-10-28', employees: 214, netPay: 1071560.25 },
    { id: 5, period: 'Jun 2026', payDate: '2026-06-26', employees: 198, netPay: 987410 }
  ];
}
