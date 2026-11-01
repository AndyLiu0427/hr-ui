import { Component } from '@angular/core';
import { SwitchComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-switch-disabled',
  imports: [SwitchComponent],
  template: `
    <div class="flex flex-col gap-4">
      <oct-switch label="Auto-approve sick leave" [disabled]="true" />
      <oct-switch label="Lock October payroll" [checked]="true" [disabled]="true" />
    </div>
  `
})
export default class SwitchDisabled {}
