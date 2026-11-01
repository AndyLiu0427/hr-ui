import { Component, signal } from '@angular/core';
import { SearchSelectComponent, SearchSelectOption, SearchSelectValue } from 'ngx-hr-ui';

@Component({
  selector: 'example-search-select-demo',
  imports: [SearchSelectComponent],
  host: { class: 'block w-full max-w-xs' },
  template: `
    <oct-search-select
      label="Reporting manager"
      placeholder="Search by name or team"
      [options]="employees"
      [fullWidth]="true"
      [(value)]="managerId"
    />
  `
})
export default class SearchSelectDemo {
  readonly managerId = signal<SearchSelectValue>(null);

  readonly employees: SearchSelectOption[] = [
    { value: 'E1024', label: 'Aisha Rahman', description: 'Finance · Payroll lead' },
    { value: 'E1031', label: 'Kenji Watanabe', description: 'Engineering · Platform' },
    { value: 'E1047', label: 'Priya Nair', description: 'Human Resources · Business partner' },
    { value: 'E1052', label: 'Li Wei', description: 'Finance · Accounts payable' },
    { value: 'E1068', label: 'Carlos Mendoza', description: 'Sales · Regional manager' },
    { value: 'E1075', label: 'Fatima Al-Sayed', description: 'Operations · Facilities' },
    { value: 'E1083', label: 'Olusegun Adeyemi', description: 'Engineering · Data' },
    { value: 'E1090', label: 'Emma Lindqvist', description: 'Human Resources · Recruitment' }
  ];
}
