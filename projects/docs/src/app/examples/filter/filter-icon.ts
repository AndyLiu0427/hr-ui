import { Component, signal } from '@angular/core';
import { FilterComponent, FilterOption } from 'ngx-hr-ui';

@Component({
  selector: 'example-filter-icon',
  imports: [FilterComponent],
  template: `<oct-filter label="Pay group" icon="Wallet" [options]="payGroups" [(selectedValues)]="selected" />`
})
export default class FilterIcon {
  readonly payGroups: FilterOption<string>[] = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Semi-monthly', value: 'semi-monthly' },
    { label: 'Weekly', value: 'weekly' }
  ];
  readonly selected = signal<string[]>(['monthly']);
}
