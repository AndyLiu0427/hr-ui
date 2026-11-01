import { Component, signal } from '@angular/core';
import { FilterComponent, FilterOption } from 'ngx-hr-ui';

@Component({
  selector: 'example-filter-demo',
  imports: [FilterComponent],
  template: `
    <div class="flex flex-col items-center gap-3">
      <oct-filter label="Department" [options]="departments" [(selectedValues)]="selected" />
      <p class="text-sm text-3">{{ selected().length ? 'Selected: ' + selected().join(', ') : 'All departments' }}</p>
    </div>
  `
})
export default class FilterDemo {
  readonly departments: FilterOption<string>[] = [
    { label: 'Finance', value: 'FIN' },
    { label: 'People', value: 'PPL' },
    { label: 'Operations', value: 'OPS' },
    { label: 'Engineering', value: 'ENG' },
    { label: 'Sales', value: 'SAL' }
  ];
  readonly selected = signal<string[]>([]);
}
