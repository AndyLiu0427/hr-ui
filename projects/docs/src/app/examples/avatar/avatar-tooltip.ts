import { Component } from '@angular/core';
import { AvatarComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-avatar-tooltip',
  imports: [AvatarComponent],
  template: `
    <div class="flex items-center gap-2 pb-8">
      @for (name of approvers; track name) {
        <oct-avatar [name]="name" [showTooltip]="true" />
      }
    </div>
  `
})
export default class AvatarTooltip {
  readonly approvers = ['Kavitha Subramaniam', 'Joon-ho Park', 'Fatimah Zahra'];
}
