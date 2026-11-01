import { Component } from '@angular/core';
import { SettingsGroupComponent, SettingsItemComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-settings-item-no-chevron',
  imports: [SettingsGroupComponent, SettingsItemComponent],
  host: { class: 'w-full max-w-sm' },
  template: `
    <oct-settings-group>
      <oct-settings-item icon="Download" label="Download all payslips" [showChevron]="false" />
      <oct-settings-item icon="Mail" label="Email payslips to employees" [showChevron]="false" />
    </oct-settings-group>
  `
})
export default class SettingsItemNoChevron {}
