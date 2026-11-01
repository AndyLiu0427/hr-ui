import { Component, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { InputSelectComponent, SelectOption } from 'ngx-hr-ui';

@Component({
  selector: 'example-input-select-demo',
  imports: [InputSelectComponent],
  host: { class: 'block w-full max-w-xs' },
  template: `
    <oct-input-select
      label="Notice period"
      helperText="How long the employee works after resigning."
      [amountField]="contractForm.noticeAmount"
      [unitField]="contractForm.noticeUnit"
      [unitOptions]="units"
    />
  `
})
export default class InputSelectDemo {
  readonly units: SelectOption[] = [
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' }
  ];

  readonly contract = signal({ noticeAmount: '1', noticeUnit: 'months' });
  readonly contractForm = form(this.contract);
}
