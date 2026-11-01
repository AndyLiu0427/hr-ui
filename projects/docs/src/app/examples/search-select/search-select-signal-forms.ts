import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { ButtonComponent, SearchSelectComponent, SearchSelectOption } from 'ngx-hr-ui';

@Component({
  selector: 'example-search-select-signal-forms',
  imports: [FormRoot, FormField, SearchSelectComponent, ButtonComponent],
  host: { class: 'block w-full max-w-xs' },
  template: `
    <form [formRoot]="transferForm" class="flex flex-col gap-2">
      <oct-search-select
        label="New reporting manager"
        placeholder="Search employees"
        [options]="managers"
        [fullWidth]="true"
        [formField]="transferForm.managerId"
      />
      <div class="flex items-center gap-3">
        <oct-button type="submit">Transfer Kenji</oct-button>
        @if (done()) {
          <span class="text-sm text-2">Transfer saved.</span>
        }
      </div>
    </form>
  `
})
export default class SearchSelectSignalForms {
  readonly managers: SearchSelectOption[] = [
    { value: 'E1024', label: 'Aisha Rahman', description: 'Finance' },
    { value: 'E1047', label: 'Priya Nair', description: 'Human Resources' },
    { value: 'E1068', label: 'Carlos Mendoza', description: 'Sales' },
    { value: 'E1083', label: 'Olusegun Adeyemi', description: 'Engineering' }
  ];

  readonly transfer = signal<{ managerId: string | null }>({ managerId: null });
  readonly done = signal(false);

  readonly transferForm = form(
    this.transfer,
    path => required(path.managerId, { message: 'Choose who Kenji will report to.' }),
    { submission: { action: async () => this.done.set(true) } }
  );
}
