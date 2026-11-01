import { Component } from '@angular/core';
import { ButtonComponent, InputComponent, SelectComponent, SwitchComponent, TextComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-showcase-leave-request',
  imports: [ButtonComponent, InputComponent, SelectComponent, SwitchComponent, TextComponent],
  template: `
    <form class="flex flex-col gap-4" (submit)="$event.preventDefault()">
      <div>
        <oct-text variant="md" color="1" weight="semibold">Request leave</oct-text>
        <oct-text variant="sm" color="3" class="mt-1">12 days of annual leave left this year</oct-text>
      </div>
      <oct-select label="Leave type" [options]="types" value="annual" [hideHelper]="true" />
      <div class="grid grid-cols-2 gap-3">
        <oct-input label="From" type="date" value="2026-12-22" [hideHelper]="true" />
        <oct-input label="To" type="date" value="2026-12-24" [hideHelper]="true" />
      </div>
      <oct-switch label="Notify my manager" [checked]="true" />
      <div class="flex justify-end gap-2">
        <oct-button variant="ghost" color="neutral">Cancel</oct-button>
        <oct-button type="submit">Submit request</oct-button>
      </div>
    </form>
  `
})
export default class ShowcaseLeaveRequest {
  readonly types = [
    { value: 'annual', label: 'Annual leave' },
    { value: 'sick', label: 'Sick leave' },
    { value: 'unpaid', label: 'Unpaid leave' }
  ];
}
