import { Component } from '@angular/core';
import { SelectComponent, SelectOption } from 'ngx-hr-ui';

@Component({
  selector: 'example-select-states',
  imports: [SelectComponent],
  host: { class: 'grid w-full max-w-3xl gap-x-4 gap-y-2 sm:grid-cols-3' },
  template: `
    <oct-select
      label="Pay group"
      placeholder="Select a pay group"
      [options]="payGroups"
      [fullWidth]="true"
      errorText="Pick a pay group to run payroll."
    />
    <oct-select label="Pay group" [options]="payGroups" value="monthly" [disabled]="true" [fullWidth]="true" />
    <oct-select label="Pay group" placeholder="Loading pay groups" [options]="[]" [loading]="true" [fullWidth]="true" />
  `
})
export default class SelectStates {
  readonly payGroups: SelectOption[] = [
    { value: 'monthly', label: 'Monthly staff' },
    { value: 'hourly', label: 'Hourly staff' }
  ];
}
