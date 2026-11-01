import { Component, signal } from '@angular/core';
import { SelectComponent, SelectOption } from 'ngx-hr-ui';

@Component({
  selector: 'example-select-multiple',
  imports: [SelectComponent],
  host: { class: 'block w-full max-w-sm' },
  template: `
    <oct-select
      label="Departments in this pay run"
      placeholder="Select departments"
      [options]="departments"
      [multiple]="true"
      [maxDisplay]="2"
      [fullWidth]="true"
      [(value)]="selected"
      [helperText]="selected().length + ' of ' + departments.length + ' departments'"
    />
  `
})
export default class SelectMultiple {
  readonly selected = signal<(string | number)[]>(['eng', 'fin', 'ops']);

  readonly departments: SelectOption[] = [
    { value: 'eng', label: 'Engineering' },
    { value: 'fin', label: 'Finance' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'ops', label: 'Operations' },
    { value: 'sales', label: 'Sales' }
  ];
}
