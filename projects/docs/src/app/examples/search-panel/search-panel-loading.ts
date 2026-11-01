import { Component, signal } from '@angular/core';
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
}

const EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Amelia Chan' },
  { id: 'e2', name: 'Marcus Tan' },
  { id: 'e3', name: 'Priya Nair' },
  { id: 'e4', name: 'Wei Lin Ho' }
];

@Component({
  selector: 'example-search-panel-loading',
  imports: [AvatarComponent, ButtonComponent, SearchPanelComponent, SearchPanelEmptyDirective, SearchPanelRowDirective],
  template: `
    <oct-button variant="outline" color="neutral" icon="Search" (buttonClick)="open.set(true)">Search the directory</oct-button>

    <oct-search-panel
      ariaLabel="Search the employee directory"
      placeholder="Type at least 2 letters"
      [isOpen]="open()"
      [items]="results()"
      [loading]="loading()"
      [query]="query()"
      (queryChange)="search($event)"
      (dialogClose)="open.set(false)"
    >
      <ng-template octSearchPanelRow let-employee>
        <oct-avatar [name]="employee.name" size="sm" />
        <span class="flex-1 truncate text-sm text-1">{{ employee.name }}</span>
      </ng-template>
      <ng-template octSearchPanelEmpty let-query>
        <p class="px-4 py-10 text-center text-sm text-2">{{ query.length < 2 ? 'Type at least 2 letters.' : 'No one found.' }}</p>
      </ng-template>
    </oct-search-panel>
  `
})
export default class SearchPanelLoading {
  readonly open = signal(false);
  readonly query = signal('');
  readonly loading = signal(false);
  readonly results = signal<Employee[]>([]);
  private request?: ReturnType<typeof setTimeout>;

  // Stands in for a debounced API call.
  search(query: string): void {
    this.query.set(query);
    clearTimeout(this.request);
    this.results.set([]);
    this.loading.set(query.trim().length >= 2);
    if (!this.loading()) return;
    this.request = setTimeout(() => {
      this.results.set(EMPLOYEES.filter(e => e.name.toLowerCase().includes(query.trim().toLowerCase())));
      this.loading.set(false);
    }, 600);
  }
}
