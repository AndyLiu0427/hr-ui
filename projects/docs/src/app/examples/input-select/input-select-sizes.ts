import { Component, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { InputSelectComponent, SelectOption } from 'ngx-hr-ui';

@Component({
  selector: 'example-input-select-sizes',
  imports: [InputSelectComponent],
  host: { class: 'flex w-full max-w-xs flex-col gap-3' },
  template: `
    @for (size of sizes; track size) {
      <oct-input-select
        [size]="size"
        [label]="'Hourly rate (' + size + ')'"
        [hideHelper]="true"
        [amountField]="rates[size].amount"
        [unitField]="rates[size].unit"
        [unitOptions]="units"
      />
    }
  `
})
export default class InputSelectSizes {
  readonly sizes = ['sm', 'md', 'lg'] as const;

  readonly units: SelectOption[] = [
    { value: 'hour', label: 'per hour' },
    { value: 'day', label: 'per day' }
  ];

  readonly rates = form(
    signal({
      sm: { amount: '18.50', unit: 'hour' },
      md: { amount: '18.50', unit: 'hour' },
      lg: { amount: '18.50', unit: 'hour' }
    })
  );
}
