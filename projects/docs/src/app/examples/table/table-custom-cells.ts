import { Component, TemplateRef, computed, viewChild } from '@angular/core';
import { AvatarComponent, BadgeComponent, TableColumn, TableComponent } from 'ngx-hr-ui';

interface Employee {
  id: number;
  name: string;
  email: string;
  jobTitle: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
}

@Component({
  selector: 'example-table-custom-cells',
  imports: [AvatarComponent, BadgeComponent, TableComponent],
  host: { class: 'w-full min-w-0' },
  template: `
    <!-- A cell template gets the row as $implicit. -->
    <ng-template #employeeCell let-row>
      <div class="flex min-w-0 items-center gap-3">
        <oct-avatar size="sm" [name]="row.name" aria-hidden="true" />
        <div class="min-w-0">
          <div class="truncate text-sm font-medium text-1">{{ row.name }}</div>
          <div class="truncate text-xs text-3">{{ row.email }}</div>
        </div>
      </div>
    </ng-template>

    <ng-template #typeCell let-row>
      <oct-badge [text]="row.employmentType" [color]="row.employmentType === 'Contract' ? 'info' : 'neutral'" />
    </ng-template>

    <oct-table class="w-full" [columns]="columns()" [data]="employees" />
  `
})
export default class TableCustomCells {
  private readonly employeeCell = viewChild<TemplateRef<unknown>>('employeeCell');
  private readonly typeCell = viewChild<TemplateRef<unknown>>('typeCell');

  readonly columns = computed<TableColumn<Employee>[]>(() => [
    { key: 'name', label: 'Employee', width: '40%', template: this.employeeCell() },
    { key: 'jobTitle', label: 'Job title' },
    { key: 'employmentType', label: 'Type', template: this.typeCell() }
  ]);

  readonly employees: Employee[] = [
    { id: 1, name: 'Kavitha Subramaniam', email: 'kavitha.s@example.com', jobTitle: 'Finance Manager', employmentType: 'Full-time' },
    { id: 2, name: 'Joon-ho Park', email: 'joonho.park@example.com', jobTitle: 'Regional Sales Manager', employmentType: 'Full-time' },
    { id: 3, name: 'Fatimah Zahra', email: 'fatimah.z@example.com', jobTitle: 'Legal Counsel', employmentType: 'Part-time' },
    { id: 4, name: 'Ethan Goh', email: 'ethan.goh@example.com', jobTitle: 'Delivery Driver', employmentType: 'Contract' }
  ];
}
