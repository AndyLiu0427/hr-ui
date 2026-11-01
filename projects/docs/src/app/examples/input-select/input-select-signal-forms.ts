import { Component, signal } from '@angular/core';
import { form, FormRoot, pattern, required } from '@angular/forms/signals';
import { ButtonComponent, InputSelectComponent, SelectOption } from 'ngx-hr-ui';

@Component({
  selector: 'example-input-select-signal-forms',
  imports: [FormRoot, InputSelectComponent, ButtonComponent],
  host: { class: 'block w-full max-w-xs' },
  template: `
    <form [formRoot]="allowanceForm" class="flex flex-col gap-2">
      <oct-input-select
        label="Transport allowance (SGD)"
        unitPlaceholder="Period"
        [amountField]="allowanceForm.amount"
        [unitField]="allowanceForm.period"
        [unitOptions]="periods"
      />
      <div class="flex items-center gap-3">
        <oct-button type="submit">Save allowance</oct-button>
        @if (saved()) {
          <span class="text-sm text-2">Saved.</span>
        }
      </div>
    </form>
  `
})
export default class InputSelectSignalForms {
  readonly periods: SelectOption[] = [
    { value: 'day', label: 'per day' },
    { value: 'month', label: 'per month' }
  ];

  readonly allowance = signal({ amount: '', period: '' });
  readonly saved = signal(false);

  readonly allowanceForm = form(
    this.allowance,
    path => {
      required(path.amount, { message: 'Enter an amount.' });
      pattern(path.amount, /^\d+(\.\d{1,2})?$/, { message: 'Enter a number with up to 2 decimals.' });
      required(path.period, { message: 'Choose how often it is paid.' });
    },
    { submission: { action: async () => this.saved.set(true) } }
  );
}
