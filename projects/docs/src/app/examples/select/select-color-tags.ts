import { Component, signal } from '@angular/core';
import { SelectComponent, SelectOption, SelectValue } from 'ngx-hr-ui';

@Component({
  selector: 'example-select-color-tags',
  imports: [SelectComponent],
  host: { class: 'block w-full max-w-xs' },
  template: `
    <oct-select label="Employment status" [options]="statuses" [fullWidth]="true" [(value)]="status" />
  `
})
export default class SelectColorTags {
  readonly status = signal<SelectValue>('probation');

  readonly statuses: SelectOption[] = [
    { value: 'active', label: 'Active', colorTag: 'green' },
    { value: 'probation', label: 'On probation', colorTag: 'blue' },
    { value: 'notice', label: 'Serving notice', colorTag: 'orange' },
    { value: 'suspended', label: 'Suspended', colorTag: 'red' }
  ];
}
