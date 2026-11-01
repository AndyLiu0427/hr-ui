import { Component, computed, signal } from '@angular/core';
import { TableColumn, TableComponent, TableSelection, TableSelectionConfig } from 'ngx-hr-ui';

interface Claim {
  id: string;
  employee: string;
  type: string;
  amount: number;
}

const amount = new Intl.NumberFormat('en-SG', { minimumFractionDigits: 2 });

@Component({
  selector: 'example-table-selection',
  imports: [TableComponent],
  host: { class: 'w-full min-w-0' },
  template: `
    <div class="flex w-full flex-col gap-3">
      <oct-table [columns]="columns" [data]="claims" [selectionConfig]="selection" (selectionChange)="onSelect($event)" />
      <p class="text-sm text-2">{{ selected().length }} selected · SGD {{ selectedTotal() }}</p>
    </div>
  `
})
export default class TableSelectionExample {
  // Rows are told apart by their id. Use mode: 'single' to allow one row at a time.
  readonly selection: TableSelectionConfig = { mode: 'multiple', key: 'id' };
  readonly selected = signal<Claim[]>([]);
  readonly selectedTotal = computed(() => amount.format(this.selected().reduce((sum, claim) => sum + claim.amount, 0)));

  readonly columns: TableColumn<Claim>[] = [
    { key: 'employee', label: 'Employee' },
    { key: 'type', label: 'Claim type' },
    { key: 'amount', label: 'Amount (SGD)', align: 'right', render: value => amount.format(value) }
  ];

  readonly claims: Claim[] = [
    { id: 'CLM-3101', employee: 'Arjun Mehta', type: 'Transport', amount: 86.4 },
    { id: 'CLM-3102', employee: 'Siti Rahmah', type: 'Medical', amount: 120 },
    { id: 'CLM-3103', employee: 'Lukas Schneider', type: 'Training', amount: 650 },
    { id: 'CLM-3104', employee: 'Amelia Wong', type: 'Meals', amount: 42.8 },
    { id: 'CLM-3105', employee: 'Hiroshi Tanaka', type: 'Transport', amount: 23.5 }
  ];

  onSelect(selection: TableSelection<Claim>): void {
    this.selected.set(selection.selectedRows);
  }
}
