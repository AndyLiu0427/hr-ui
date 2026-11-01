import { Component, signal } from '@angular/core';
import { FilterComponent, FilterOption } from 'ngx-hr-ui';

const LOCATIONS = [
  'Ang Mo Kio', 'Bedok', 'Bishan', 'Changi', 'Clementi', 'Jurong East', 'Jurong West', 'Orchard',
  'Paya Lebar', 'Punggol', 'Sengkang', 'Tampines', 'Toa Payoh', 'Woodlands', 'Yishun'
];

@Component({
  selector: 'example-filter-searchable',
  imports: [FilterComponent],
  template: `
    <oct-filter
      label="Work location"
      [options]="locations"
      [(selectedValues)]="selected"
      [searchable]="true"
      searchPlaceholder="Search locations"
    />
  `
})
export default class FilterSearchable {
  readonly locations: FilterOption<string>[] = LOCATIONS.map(location => ({ label: location, value: location }));
  readonly selected = signal<string[]>([]);
}
