import { Component, signal } from '@angular/core';
import { disabled, form, FormField } from '@angular/forms/signals';
import { CheckboxComponent, InputSelectComponent, SelectOption } from 'ngx-hr-ui';

@Component({
  selector: 'example-input-select-disabled',
  imports: [FormField, CheckboxComponent, InputSelectComponent],
  host: { class: 'flex w-full max-w-xs flex-col gap-3' },
  template: `
    <oct-checkbox label="No probation period" [formField]="hireForm.noProbation" />
    <oct-input-select
      label="Probation"
      [amountField]="hireForm.probationAmount"
      [unitField]="hireForm.probationUnit"
      [unitOptions]="units"
    />
  `
})
export default class InputSelectDisabled {
  readonly units: SelectOption[] = [
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' }
  ];

  readonly hire = signal({ noProbation: true, probationAmount: '3', probationUnit: 'months' });

  readonly hireForm = form(this.hire, path => {
    // Disable both halves. The shared box follows the fields.
    disabled(path.probationAmount, { when: ({ valueOf }) => valueOf(path.noProbation) });
    disabled(path.probationUnit, { when: ({ valueOf }) => valueOf(path.noProbation) });
  });
}
