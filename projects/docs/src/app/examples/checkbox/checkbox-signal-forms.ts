import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { ButtonComponent, CheckboxComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-checkbox-signal-forms',
  imports: [FormRoot, FormField, CheckboxComponent, ButtonComponent],
  template: `
    <form [formRoot]="approvalForm" class="flex flex-col items-start gap-4">
      <oct-checkbox label="I checked the bank details of all 248 employees" [formField]="approvalForm.bankDetailsChecked" />
      <div class="flex items-center gap-3">
        <oct-button type="submit">Approve pay run</oct-button>
        @if (approved()) {
          <span class="text-sm text-2">October pay run approved.</span>
        }
      </div>
    </form>
  `
})
export default class CheckboxSignalForms {
  readonly approval = signal({ bankDetailsChecked: false });
  readonly approved = signal(false);

  readonly approvalForm = form(
    this.approval,
    // On a checkbox, required means it must be checked.
    path => required(path.bankDetailsChecked, { message: 'Confirm the bank details before you approve.' }),
    { submission: { action: async () => this.approved.set(true) } }
  );
}
