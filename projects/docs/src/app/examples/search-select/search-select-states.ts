import { Component } from '@angular/core';
import { SearchSelectComponent, SearchSelectOption } from 'ngx-hr-ui';

@Component({
  selector: 'example-search-select-states',
  imports: [SearchSelectComponent],
  host: { class: 'grid w-full max-w-2xl gap-x-4 gap-y-2 sm:grid-cols-2' },
  template: `
    <oct-search-select
      label="Cost centre owner"
      placeholder="Search employees"
      [options]="employees"
      [fullWidth]="true"
      errorText="Every cost centre needs an owner."
    />
    <oct-search-select
      label="Payroll admin"
      value="E1024"
      [options]="employees"
      [disabled]="true"
      [fullWidth]="true"
      description="Only the account owner can change this."
    />
  `
})
export default class SearchSelectStates {
  readonly employees: SearchSelectOption[] = [
    { value: 'E1024', label: 'Aisha Rahman' },
    { value: 'E1052', label: 'Li Wei' }
  ];
}
