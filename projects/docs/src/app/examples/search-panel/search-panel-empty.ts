import { Component, computed, signal } from '@angular/core';
import {
  AvatarComponent,
  ButtonComponent,
  SearchPanelComponent,
  SearchPanelEmptyDirective,
  SearchPanelItem,
  SearchPanelRowDirective
} from 'ngx-hr-ui';

interface Employee extends SearchPanelItem {
  name: string;
  jobTitle: string;
}

const EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Amelia Chan', jobTitle: 'Payroll lead' },
  { id: 'e2', name: 'Marcus Tan', jobTitle: 'Software engineer' },
  { id: 'e3', name: 'Priya Nair', jobTitle: 'HR business partner' },
  { id: 'e4', name: 'Wei Lin Ho', jobTitle: 'Accountant' }
];

@Component({
  selector: 'example-search-panel-empty',
  imports: [AvatarComponent, ButtonComponent, SearchPanelComponent, SearchPanelEmptyDirective, SearchPanelRowDirective],
  template: `
    <oct-button variant="outline" color="neutral" icon="Users" (buttonClick)="open.set(true)">Find an employee</oct-button>

    <oct-search-panel
      ariaLabel="Search employees"
      placeholder="Employee name"
      [isOpen]="open()"
      [items]="results()"
      [(query)]="query"
      (dialogClose)="open.set(false)"
    >
      <ng-template octSearchPanelRow let-employee>
        <oct-avatar [name]="employee.name" size="sm" />
        <span class="flex-1 truncate text-sm text-1">{{ employee.name }}</span>
        <span class="truncate text-xs text-3">{{ employee.jobTitle }}</span>
      </ng-template>

      <!-- Shown when items is empty. Its context is the query. -->
      <ng-template octSearchPanelEmpty let-query>
        <div class="px-4 py-10 text-center">
          <p class="text-sm font-medium text-1">No employee matches "{{ query }}"</p>
          <p class="mt-1 text-sm text-2">Check the spelling, or search by first name.</p>
        </div>
      </ng-template>
    </oct-search-panel>
  `
})
export default class SearchPanelEmpty {
  readonly open = signal(false);
  readonly query = signal('');
  readonly results = computed(() => EMPLOYEES.filter(e => e.name.toLowerCase().includes(this.query().trim().toLowerCase())));
}
