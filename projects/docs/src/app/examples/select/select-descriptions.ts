import { Component } from '@angular/core';
import { SelectComponent, SelectOption } from 'ngx-hr-ui';

@Component({
  selector: 'example-select-descriptions',
  imports: [SelectComponent],
  host: { class: 'block w-full max-w-xs' },
  template: `
    <oct-select label="Leave type" placeholder="Select a leave type" [options]="leaveTypes" [fullWidth]="true" />
  `
})
export default class SelectDescriptions {
  readonly leaveTypes: SelectOption[] = [
    { value: 'annual', label: 'Annual leave', description: '9 of 14 days left' },
    { value: 'sick', label: 'Sick leave', description: '12 of 14 days left' },
    { value: 'hospital', label: 'Hospitalisation leave', description: '60 of 60 days left' },
    { value: 'childcare', label: 'Childcare leave', description: 'Needs a child under 7', disabled: true }
  ];
}
