import { Component, signal } from '@angular/core';
import { FilterComponent, FilterOption } from 'ngx-hr-ui';

@Component({
  selector: 'example-filter-disabled-options',
  imports: [FilterComponent],
  template: `<oct-filter label="Cost centre" [options]="costCentres" [(selectedValues)]="selected" />`
})
export default class FilterDisabledOptions {
  readonly costCentres: FilterOption<string>[] = [
    { label: 'CC-110 Head office', value: 'CC-110' },
    { label: 'CC-120 Tampines branch', value: 'CC-120' },
    { label: 'CC-130 Changi depot', value: 'CC-130' },
    // Closed, so nobody can be filed under it any more.
    { label: 'CC-140 Jurong warehouse (closed)', value: 'CC-140', disabled: true }
  ];
  readonly selected = signal<string[]>([]);
}
