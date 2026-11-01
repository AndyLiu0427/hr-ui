import { Component } from '@angular/core';
import { InputComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-input-states',
  imports: [InputComponent],
  host: { class: 'grid w-full max-w-xl gap-x-4 gap-y-2 sm:grid-cols-2' },
  template: `
    <oct-input label="Bank account number" value="0123-4567" errorText="Enter a 10-digit account number." />
    <oct-input label="Employee ID" value="EMP-00421" [disabled]="true" />
    <oct-input label="Pay grade" value="G7" [readonly]="true" helperText="Set by your HR admin." />
    <oct-input label="Postal code" value="238823" [loading]="true" helperText="Looking up the address…" />
  `
})
export default class InputStates {}
