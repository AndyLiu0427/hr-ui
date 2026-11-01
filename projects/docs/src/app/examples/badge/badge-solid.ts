import { Component } from '@angular/core';
import { BadgeComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-badge-solid',
  imports: [BadgeComponent],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <oct-badge mode="solid" text="Draft" color="neutral" />
      <oct-badge mode="solid" text="Paid" color="success" />
      <oct-badge mode="solid" text="Pending" color="warning" />
      <oct-badge mode="solid" text="Rejected" color="error" />
      <oct-badge mode="solid" text="In review" color="info" />
    </div>
  `
})
export default class BadgeSolid {}
