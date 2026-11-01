import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { ButtonComponent, SwitchComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-switch-signal-forms',
  imports: [FormRoot, FormField, SwitchComponent, ButtonComponent],
  template: `
    <form [formRoot]="securityForm" class="flex flex-col items-start gap-4">
      <oct-switch label="Two-factor sign-in" [formField]="securityForm.twoFactor" />
      <oct-switch label="Email me after each sign-in" [formField]="securityForm.signInAlerts" />
      <div class="flex items-center gap-3">
        <oct-button type="submit">Save settings</oct-button>
        @if (saved()) {
          <span class="text-sm text-2">Settings saved.</span>
        }
      </div>
    </form>
  `
})
export default class SwitchSignalForms {
  readonly settings = signal({ twoFactor: false, signInAlerts: true });
  readonly saved = signal(false);

  readonly securityForm = form(
    this.settings,
    // On a switch, required means it must be on.
    path => required(path.twoFactor, { message: 'Payroll admins must use two-factor sign-in.' }),
    { submission: { action: async () => this.saved.set(true) } }
  );
}
