import { Component } from '@angular/core';
import { FilterComponent, FilterOption } from 'ngx-hr-ui';

@Component({
  selector: 'example-filter-sizes',
  imports: [FilterComponent],
  template: `
    <div class="flex flex-wrap items-center gap-3">
      <oct-filter size="sm" label="Small" [options]="statuses" />
      <oct-filter size="md" label="Medium" [options]="statuses" />
      <oct-filter size="lg" label="Large" [options]="statuses" />
    </div>
  `
})
export default class FilterSizes {
  readonly statuses: FilterOption<string>[] = [
    { label: 'Active', value: 'active' },
    { label: 'On leave', value: 'on-leave' },
    { label: 'Resigned', value: 'resigned' }
  ];
}
