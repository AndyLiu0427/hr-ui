import { Component, signal } from '@angular/core';
import { ButtonComponent, TableColumn, TableComponent } from 'ngx-hr-ui';

interface Claim {
  id: string;
  employee: string;
  type: string;
}

const CLAIMS: Claim[] = [
  { id: 'CLM-3101', employee: 'Arjun Mehta', type: 'Transport' },
  { id: 'CLM-3102', employee: 'Siti Rahmah', type: 'Medical' },
  { id: 'CLM-3103', employee: 'Lukas Schneider', type: 'Training' }
];

@Component({
  selector: 'example-table-states',
  imports: [ButtonComponent, TableComponent],
  host: { class: 'w-full min-w-0' },
  template: `
    <div class="flex w-full flex-col gap-3">
      <div class="flex gap-2">
        <oct-button size="sm" variant="outline" color="neutral" icon="RefreshCw" [disabled]="loading()" (buttonClick)="load()">Load claims</oct-button>
        <oct-button size="sm" variant="ghost" color="neutral" [disabled]="loading()" (buttonClick)="claims.set([])">Clear</oct-button>
      </div>
      <oct-table [columns]="columns" [data]="claims()" [loading]="loading()" emptyMessage="No claims to review" />
    </div>
  `
})
export default class TableStates {
  readonly claims = signal<Claim[]>([]);
  readonly loading = signal(false);

  readonly columns: TableColumn<Claim>[] = [
    { key: 'id', label: 'Claim' },
    { key: 'employee', label: 'Employee' },
    { key: 'type', label: 'Claim type' }
  ];

  // Stands in for a request to your API.
  load(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.claims.set(CLAIMS);
      this.loading.set(false);
    }, 1200);
  }
}
