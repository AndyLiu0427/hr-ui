import { Component, computed, signal } from '@angular/core';
import { SearchSelectComponent, SearchSelectOption, SearchSelectValue } from 'ngx-hr-ui';

@Component({
  selector: 'example-search-select-multiple',
  imports: [SearchSelectComponent],
  host: { class: 'block w-full max-w-xs' },
  template: `
    <oct-search-select
      label="Leave approvers"
      placeholder="Add approvers"
      [options]="employees"
      [multiple]="true"
      [clearable]="true"
      [fullWidth]="true"
      [description]="approverNames()"
      [(value)]="approverIds"
    />
  `
})
export default class SearchSelectMultiple {
  readonly approverIds = signal<SearchSelectValue>(['E1024', 'E1047']);

  readonly employees: SearchSelectOption[] = [
    { value: 'E1024', label: 'Aisha Rahman', description: 'Finance' },
    { value: 'E1031', label: 'Kenji Watanabe', description: 'Engineering' },
    { value: 'E1047', label: 'Priya Nair', description: 'Human Resources' },
    { value: 'E1068', label: 'Carlos Mendoza', description: 'Sales' }
  ];

  readonly approverNames = computed(() => {
    const ids = this.approverIds();
    const names = this.employees.filter(e => Array.isArray(ids) && ids.includes(e.value)).map(e => e.label);
    return names.length ? names.join(', ') : 'Nobody yet. Requests go to HR.';
  });
}
