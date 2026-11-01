import { Component, signal } from '@angular/core';
import { RadioComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-radio-demo',
  imports: [RadioComponent],
  template: `
    <fieldset class="flex flex-col gap-3">
      <legend class="mb-3 text-sm font-medium text-1">Pay frequency</legend>
      @for (option of frequencies; track option.value) {
        <oct-radio
          name="pay-frequency"
          [label]="option.label"
          [checked]="frequency() === option.value"
          (radioChange)="frequency.set(option.value)"
        />
      }
    </fieldset>
  `
})
export default class RadioDemo {
  readonly frequency = signal('monthly');

  readonly frequencies = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'semi-monthly', label: 'Twice a month' },
    { value: 'weekly', label: 'Weekly' }
  ];
}
