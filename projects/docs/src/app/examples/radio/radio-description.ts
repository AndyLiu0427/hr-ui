import { Component, signal } from '@angular/core';
import { RadioComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-radio-description',
  imports: [RadioComponent],
  host: { class: 'block max-w-sm' },
  template: `
    <fieldset class="flex flex-col gap-4">
      <legend class="mb-3 text-sm font-medium text-1">Contract change</legend>
      @for (option of changes; track option.value) {
        <oct-radio
          name="contract-change"
          [label]="option.label"
          [description]="option.description"
          [checked]="change() === option.value"
          (radioChange)="change.set(option.value)"
        />
      }
    </fieldset>
  `
})
export default class RadioDescription {
  readonly change = signal('renewal');

  readonly changes = [
    { value: 'new', label: 'New contract', description: 'Starts a new employment period with new terms.' },
    { value: 'renewal', label: 'Renewal', description: 'Extends the current period on the same terms.' },
    { value: 'amendment', label: 'Amendment', description: 'Changes the terms from a date you choose.' }
  ];
}
