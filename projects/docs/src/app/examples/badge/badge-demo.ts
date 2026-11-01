import { Component } from '@angular/core';
import { BadgeComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-badge-demo',
  imports: [BadgeComponent],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <oct-badge text="Full-time" />
      <oct-badge text="Approved" color="success" icon="Check" />
      <oct-badge text="Pending approval" color="warning" />
      <oct-badge text="3 new" color="info" mode="solid" />
    </div>
  `
})
export default class BadgeDemo {}
