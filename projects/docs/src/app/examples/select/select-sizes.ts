import { Component } from '@angular/core';
import { SelectComponent, SelectOption } from 'ngx-hr-ui';

@Component({
  selector: 'example-select-sizes',
  imports: [SelectComponent],
  host: { class: 'flex w-full max-w-xs flex-col gap-3' },
  template: `
    <oct-select size="sm" placeholder="Small" ariaLabel="Pay group" [options]="payGroups" [fullWidth]="true" [hideHelper]="true" />
    <oct-select size="md" placeholder="Medium" ariaLabel="Pay group" [options]="payGroups" [fullWidth]="true" [hideHelper]="true" />
    <oct-select size="lg" placeholder="Large" ariaLabel="Pay group" [options]="payGroups" [fullWidth]="true" [hideHelper]="true" />
  `
})
export default class SelectSizes {
  readonly payGroups: SelectOption[] = [
    { value: 'monthly', label: 'Monthly staff' },
    { value: 'hourly', label: 'Hourly staff' },
    { value: 'directors', label: 'Directors' }
  ];
}
