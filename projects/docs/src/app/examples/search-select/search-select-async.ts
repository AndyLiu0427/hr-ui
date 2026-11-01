import { Component, signal } from '@angular/core';
import {
  SearchSelectComponent,
  SearchSelectOption,
  SearchSelectPreloadConfig,
  SearchSelectSearchConfig,
  SearchSelectValue
} from 'ngx-hr-ui';

@Component({
  selector: 'example-search-select-async',
  imports: [SearchSelectComponent],
  host: { class: 'block w-full max-w-xs' },
  template: `
    <oct-search-select
      label="Employee"
      placeholder="Search the directory"
      [preloadConfig]="recent"
      [searchConfig]="search"
      [fullWidth]="true"
      [(value)]="employeeId"
    />
  `
})
export default class SearchSelectAsync {
  readonly employeeId = signal<SearchSelectValue>(null);

  // Shown before the user types: the people picked most recently.
  readonly recent: SearchSelectPreloadConfig = { loadFn: () => DIRECTORY.slice(0, 3) };

  // Runs 300 ms after the user stops typing, once the query has 2 characters.
  readonly search: SearchSelectSearchConfig = {
    searchFn: query => searchDirectory(query),
    minLength: 2,
    placeholder: 'Type a name',
    emptyText: 'Nobody in the directory matches.'
  };
}

const DIRECTORY: SearchSelectOption[] = [
  { value: 'E1031', label: 'Kenji Watanabe', description: 'Engineering' },
  { value: 'E1047', label: 'Priya Nair', description: 'Human Resources' },
  { value: 'E1052', label: 'Li Wei', description: 'Finance' },
  { value: 'E1068', label: 'Carlos Mendoza', description: 'Sales' },
  { value: 'E1075', label: 'Fatima Al-Sayed', description: 'Operations' },
  { value: 'E1083', label: 'Olusegun Adeyemi', description: 'Engineering' },
  { value: 'E1090', label: 'Emma Lindqvist', description: 'Human Resources' }
];

// Stands in for your API: answers after 600 ms.
function searchDirectory(query: string): Promise<SearchSelectOption[]> {
  const matches = DIRECTORY.filter(e => e.label.toLowerCase().includes(query.toLowerCase()));
  return new Promise(resolve => setTimeout(() => resolve(matches), 600));
}
