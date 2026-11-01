import { Component, signal } from '@angular/core';
import { SelectComponent, SelectOption, SelectValue } from 'ngx-hr-ui';

@Component({
  selector: 'example-select-demo',
  imports: [SelectComponent],
  host: { class: 'block w-full max-w-xs' },
  template: `
    <oct-select
      label="Department"
      placeholder="Select a department"
      [options]="departments"
      [fullWidth]="true"
      [(value)]="department"
    />
  `
})
export default class SelectDemo {
  readonly department = signal<SelectValue>(null);

  readonly departments: SelectOption[] = [
    { value: 'eng', label: 'Engineering' },
    { value: 'fin', label: 'Finance' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'ops', label: 'Operations' },
    { value: 'sales', label: 'Sales' }
  ];
}
