import { Component, signal } from '@angular/core';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { ButtonComponent, InputComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-input-signal-forms',
  imports: [FormRoot, FormField, InputComponent, ButtonComponent],
  host: { class: 'block w-full max-w-sm' },
  template: `
    <form [formRoot]="employeeForm" class="flex flex-col gap-2">
      <oct-input label="Full name" placeholder="Aisha Rahman" [formField]="employeeForm.name" />
      <oct-input label="Work email" type="email" placeholder="name@company.com" [formField]="employeeForm.email" />
      <div class="flex items-center gap-3">
        <oct-button type="submit">Add employee</oct-button>
        @if (saved()) {
          <span class="text-sm text-2">Added {{ employee().name }}.</span>
        }
      </div>
    </form>
  `
})
export default class InputSignalForms {
  readonly employee = signal({ name: '', email: '' });
  readonly saved = signal(false);

  readonly employeeForm = form(
    this.employee,
    path => {
      required(path.name, { message: 'Enter the employee’s full name.' });
      required(path.email, { message: 'Enter a work email.' });
      email(path.email, { message: 'Enter an email like name@company.com.' });
    },
    // The action runs only when every rule passes. Call your API here.
    { submission: { action: async () => this.saved.set(true) } }
  );
}
