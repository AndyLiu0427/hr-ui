import { Component } from '@angular/core';
import { BadgeComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-badge-icons',
  imports: [BadgeComponent],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <oct-badge text="Singapore" icon="MapPin" />
      <oct-badge text="Remote" icon="House" />
      <oct-badge text="Verified" icon="BadgeCheck" color="success" />
      <oct-badge text="Work pass expires in 14 days" icon="Clock" color="warning" />
    </div>
  `
})
export default class BadgeIcons {}
