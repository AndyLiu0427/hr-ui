import { Component, signal } from '@angular/core';
import { IChoiceComponent, type IChoiceOption } from 'ngx-hr-ui';

@Component({
  selector: 'example-inline-choice-unset',
  imports: [IChoiceComponent],
  template: `
    <p class="text-sm text-1">
      Employee is a
      <oct-ichoice [options]="statuses" [(value)]="status" ariaLabel="Residency status" />
    </p>
    <p class="mt-2 font-mono text-xs text-3">value: {{ status() ?? 'undefined' }}</p>
  `
})
export default class InlineChoiceUnset {
  readonly statuses: IChoiceOption[] = [
    { value: 'citizen', label: 'Citizen' },
    { value: 'pr', label: 'PR' },
    { value: 'foreigner', label: 'Foreigner' }
  ];
  readonly status = signal<string | undefined>(undefined);
}
