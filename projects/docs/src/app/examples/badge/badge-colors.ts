import { Component } from '@angular/core';
import { BadgeComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-badge-colors',
  imports: [BadgeComponent],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <oct-badge text="Draft" color="neutral" />
      <oct-badge text="Paid" color="success" />
      <oct-badge text="Pending" color="warning" />
      <oct-badge text="Rejected" color="error" />
      <oct-badge text="In review" color="info" />
    </div>
  `
})
export default class BadgeColors {}
