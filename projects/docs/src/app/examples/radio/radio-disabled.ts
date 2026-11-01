import { Component, signal } from '@angular/core';
import { RadioComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-radio-disabled',
  imports: [RadioComponent],
  template: `
    <fieldset class="flex flex-col gap-3">
      <legend class="mb-3 text-sm font-medium text-1">Payment method</legend>
      <oct-radio name="payment-method" label="Bank transfer" [checked]="method() === 'bank'" (radioChange)="method.set('bank')" />
      <oct-radio name="payment-method" label="Cheque" [checked]="method() === 'cheque'" (radioChange)="method.set('cheque')" />
      <oct-radio name="payment-method" label="Cash (not allowed for this company)" [disabled]="true" />
    </fieldset>
  `
})
export default class RadioDisabled {
  readonly method = signal('bank');
}
