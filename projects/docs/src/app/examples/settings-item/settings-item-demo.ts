import { Component, signal } from '@angular/core';
import { SettingsGroupComponent, SettingsItemComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-settings-item-demo',
  imports: [SettingsGroupComponent, SettingsItemComponent],
  host: { class: 'w-full max-w-sm' },
  template: `
    <h3 class="mb-2 px-1 text-xs font-medium text-3">Payroll settings</h3>
    <oct-settings-group>
      @for (setting of settings; track setting.label) {
        <oct-settings-item [icon]="setting.icon" [label]="setting.label" (itemClick)="opened.set(setting.label)" />
      }
    </oct-settings-group>
    <p class="mt-3 px-1 text-sm text-3" aria-live="polite">{{ opened() ? 'Opened ' + opened() : 'Pick a setting to open it.' }}</p>
  `
})
export default class SettingsItemDemo {
  readonly settings = [
    { icon: 'CalendarClock', label: 'Pay schedule' },
    { icon: 'Clock', label: 'Overtime rules' },
    { icon: 'Landmark', label: 'Bank accounts' },
    { icon: 'FileText', label: 'Payslip template' }
  ];
  readonly opened = signal('');
}
