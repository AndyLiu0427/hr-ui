import { Component } from '@angular/core';
import { InputComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-input-adornments',
  imports: [InputComponent],
  host: { class: 'flex w-full max-w-sm flex-col gap-2' },
  template: `
    <oct-input label="Find an employee" leftIcon="Search" placeholder="Name or employee ID" />
    <oct-input label="Monthly base salary" leftText="SGD" inputMode="decimal" placeholder="0.00" />
    <oct-input label="Overtime this month" rightText="hours" inputMode="decimal" placeholder="0" />
  `
})
export default class InputAdornments {}
