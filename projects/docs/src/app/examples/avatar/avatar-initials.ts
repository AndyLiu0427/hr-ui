import { Component } from '@angular/core';
import { AvatarComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-avatar-initials',
  imports: [AvatarComponent],
  template: `
    <ul class="flex flex-col gap-3">
      @for (name of names; track name) {
        <li class="flex items-center gap-3">
          <!-- The name is shown beside the avatar, so screen readers skip the avatar. -->
          <oct-avatar [name]="name" aria-hidden="true" />
          <span class="text-sm text-1">{{ name }}</span>
        </li>
      }
    </ul>
  `
})
export default class AvatarInitials {
  readonly names = ['Tan Wei Ming', 'Priya', 'Muhammad Hafiz bin Ismail', 'Nguyen Thi Lan'];
}
