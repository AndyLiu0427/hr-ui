import { Component, TemplateRef, computed, viewChild } from '@angular/core';
import { ColorTagColor, ColorTagComponent, TableColumn, TableComponent } from 'ngx-hr-ui';

interface Placement {
  id: number;
  employee: string;
  client: string;
  jobTitle: string;
  color: ColorTagColor | null;
}

@Component({
  selector: 'example-color-tag-table',
  imports: [ColorTagComponent, TableComponent],
  host: { class: 'w-full min-w-0' },
  template: `
    <ng-template #employeeCell let-row>
      <oct-color-tag variant="corner" [color]="row.color" [label]="row.employee" />
    </ng-template>

    <oct-table class="w-full" [columns]="columns()" [data]="placements" />
  `
})
export default class ColorTagTable {
  private readonly employeeCell = viewChild<TemplateRef<unknown>>('employeeCell');

  readonly columns = computed<TableColumn<Placement>[]>(() => [
    { key: 'employee', label: 'Employee', template: this.employeeCell() },
    { key: 'client', label: 'Client' },
    { key: 'jobTitle', label: 'Job title' }
  ]);

  readonly placements: Placement[] = [
    { id: 1, employee: 'Ahmad Faizal', client: 'Harbourline Freight', jobTitle: 'Forklift Operator', color: 'blue' },
    { id: 2, employee: 'Chloe Lim', client: 'Marina Retail Group', jobTitle: 'Retail Associate', color: 'green' },
    { id: 3, employee: 'Rizal Santos', client: 'Harbourline Freight', jobTitle: 'Logistics Coordinator', color: 'blue' },
    { id: 4, employee: 'Siti Rahmah', client: 'Tampines Polyclinic', jobTitle: 'Patient Service Associate', color: null },
    { id: 5, employee: 'Ethan Goh', client: 'Changi Air Services', jobTitle: 'Cargo Officer', color: 'orange' }
  ];
}
