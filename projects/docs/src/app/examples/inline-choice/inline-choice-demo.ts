import { Component, signal } from '@angular/core';
import { IChoiceComponent, type IChoiceOption } from 'ngx-hr-ui';

@Component({
  selector: 'example-inline-choice-demo',
  imports: [IChoiceComponent],
  template: `
    <ol class="flex list-decimal flex-col gap-3 pl-5 text-sm text-1">
      <li>
        Childcare leave on days 4 to 6 is paid
        <oct-ichoice [options]="payers" [(value)]="payer" ariaLabel="Who pays childcare leave on days 4 to 6" />.
      </li>
      <li>
        Overtime is paid at
        <oct-ichoice [options]="rates" [(value)]="rate" ariaLabel="Overtime rate" />
        the hourly rate.
      </li>
    </ol>
  `
})
export default class InlineChoiceDemo {
  readonly payers: IChoiceOption[] = [
    { value: 'government', label: "By Gov't" },
    { value: 'employer', label: 'By Employer' }
  ];
  readonly rates: IChoiceOption[] = [
    { value: '1.5', label: '1.5×' },
    { value: '2', label: '2×' }
  ];
  readonly payer = signal<string | undefined>('government');
  readonly rate = signal<string | undefined>('1.5');
}
