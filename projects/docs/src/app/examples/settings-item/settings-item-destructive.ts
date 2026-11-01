import { Component } from '@angular/core';
import { SettingsGroupComponent, SettingsItemComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-settings-item-destructive',
  imports: [SettingsGroupComponent, SettingsItemComponent],
  host: { class: 'w-full max-w-sm' },
  template: `
    <oct-settings-group>
      <oct-settings-item icon="Archive" label="Archive pay group" [showChevron]="false" />
      <oct-settings-item icon="Trash2" label="Delete pay group" color="error" [showChevron]="false" />
    </oct-settings-group>
  `
})
export default class SettingsItemDestructive {}
