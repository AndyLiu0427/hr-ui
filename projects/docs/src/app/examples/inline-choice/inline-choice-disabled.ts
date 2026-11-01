import { Component } from '@angular/core';
import { IChoiceComponent, type IChoiceOption } from 'ngx-hr-ui';

@Component({
  selector: 'example-inline-choice-disabled',
  imports: [IChoiceComponent],
  template: `
    <p class="text-sm text-1">
      Childcare leave on days 4 to 6 is paid
      <oct-ichoice [options]="payers" value="employer" [disabled]="true" ariaLabel="Who pays childcare leave on days 4 to 6" />.
    </p>
  `
})
export default class InlineChoiceDisabled {
  readonly payers: IChoiceOption[] = [
    { value: 'government', label: "By Gov't" },
    { value: 'employer', label: 'By Employer' }
  ];
}
