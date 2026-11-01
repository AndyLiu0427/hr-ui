import { Component, signal } from '@angular/core';
import { InputComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-input-clearable',
  imports: [InputComponent],
  host: { class: 'block w-full max-w-sm' },
  template: `
    <oct-input
      label="Last working day"
      type="date"
      [clearable]="true"
      [(value)]="lastDay"
      [helperText]="lastDay() ? 'The contract ends on this day.' : 'No end date. The contract is open-ended.'"
    />
  `
})
export default class InputClearable {
  readonly lastDay = signal('2026-12-31');
}
