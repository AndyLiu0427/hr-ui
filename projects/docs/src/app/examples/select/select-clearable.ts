import { Component, signal } from '@angular/core';
import { SelectComponent, SelectOption, SelectValue } from 'ngx-hr-ui';

@Component({
  selector: 'example-select-clearable',
  imports: [SelectComponent],
  host: { class: 'block w-full max-w-xs' },
  template: `
    <oct-select
      label="Cost centre"
      placeholder="No cost centre"
      [options]="costCentres"
      [clearable]="true"
      [fullWidth]="true"
      [(value)]="costCentre"
    />
  `
})
export default class SelectClearable {
  readonly costCentre = signal<SelectValue>('CC-2100');

  readonly costCentres: SelectOption[] = [
    { value: 'CC-1100', label: 'CC-1100 Head office' },
    { value: 'CC-2100', label: 'CC-2100 Singapore branch' },
    { value: 'CC-3200', label: 'CC-3200 Kuala Lumpur branch' }
  ];
}
