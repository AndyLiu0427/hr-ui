import { Component } from '@angular/core';
import { SearchSelectComponent, SearchSelectOption } from 'ngx-hr-ui';

@Component({
  selector: 'example-search-select-badges',
  imports: [SearchSelectComponent],
  host: { class: 'block w-full max-w-xs' },
  template: `
    <oct-search-select label="Cover during leave" placeholder="Search colleagues" [options]="colleagues" [fullWidth]="true" />
  `
})
export default class SearchSelectBadges {
  readonly colleagues: SearchSelectOption[] = [
    { value: 'E1024', label: 'Aisha Rahman', description: 'Payroll lead', badge: { text: 'On leave', color: 'warning' } },
    { value: 'E1052', label: 'Li Wei', description: 'Accounts payable' },
    { value: 'E1061', label: 'Mateus Oliveira', description: 'Payroll analyst', badge: { text: 'New joiner', color: 'info' } },
    { value: 'E1077', label: 'Hana Kim', description: 'Payroll analyst', badge: { text: 'Contractor', color: 'neutral' } }
  ];
}
