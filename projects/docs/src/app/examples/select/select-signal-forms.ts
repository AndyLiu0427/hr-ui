import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { ButtonComponent, SelectComponent, SelectOption } from 'ngx-hr-ui';

@Component({
  selector: 'example-select-signal-forms',
  imports: [FormRoot, FormField, SelectComponent, ButtonComponent],
  host: { class: 'block w-full max-w-xs' },
  template: `
    <form [formRoot]="leaveForm" class="flex flex-col gap-2">
      <oct-select
        label="Leave type"
        placeholder="Select a leave type"
        [options]="leaveTypes"
        [fullWidth]="true"
        [formField]="leaveForm.type"
      />
      <div class="flex items-center gap-3">
        <oct-button type="submit">Request leave</oct-button>
        @if (sent()) {
          <span class="text-sm text-2">Request sent.</span>
        }
      </div>
    </form>
  `
})
export default class SelectSignalForms {
  readonly leaveTypes: SelectOption[] = [
    { value: 'annual', label: 'Annual leave' },
    { value: 'sick', label: 'Sick leave' },
    { value: 'childcare', label: 'Childcare leave' },
    { value: 'unpaid', label: 'Unpaid leave' }
  ];

  readonly request = signal<{ type: string | null }>({ type: null });
  readonly sent = signal(false);

  readonly leaveForm = form(
    this.request,
    path => required(path.type, { message: 'Select a leave type.' }),
    { submission: { action: async () => this.sent.set(true) } }
  );
}
