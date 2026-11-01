import { Component, signal } from '@angular/core';
import { IChoiceComponent, type IChoiceOption } from 'ngx-hr-ui';

@Component({
  selector: 'example-inline-choice-brackets',
  imports: [IChoiceComponent],
  template: `
    <p class="text-sm text-1">
      Salary is paid
      <oct-ichoice [options]="frequencies" [(value)]="frequency" [brackets]="false" ariaLabel="Pay frequency" />
    </p>
  `
})
export default class InlineChoiceBrackets {
  readonly frequencies: IChoiceOption[] = [
    { value: 'monthly', label: 'monthly' },
    { value: 'semi-monthly', label: 'semi-monthly' }
  ];
  readonly frequency = signal<string | undefined>('monthly');
}
