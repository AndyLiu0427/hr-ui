import { Component } from '@angular/core';
import { SwitchComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-switch-colors',
  imports: [SwitchComponent],
  template: `
    <div class="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
      <oct-switch label="Primary" color="primary" [checked]="true" />
      <oct-switch label="Success" color="success" [checked]="true" />
      <oct-switch label="Warning" color="warning" [checked]="true" />
      <oct-switch label="Error" color="error" [checked]="true" />
      <oct-switch label="Info" color="info" [checked]="true" />
      <oct-switch label="Neutral" color="neutral" [checked]="true" />
    </div>
  `
})
export default class SwitchColors {}
