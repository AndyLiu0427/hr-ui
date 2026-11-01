import { Component } from '@angular/core';
import { AvatarComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-avatar-status',
  imports: [AvatarComponent],
  template: `
    <div class="flex flex-wrap items-center gap-4">
      <oct-avatar size="lg" name="Daniel Okafor" status="online" />
      <oct-avatar size="lg" name="Sakura Yamamoto" status="away" />
      <oct-avatar size="lg" name="Rizal Santos" status="busy" />
      <oct-avatar size="lg" name="Lukas Schneider" status="offline" />
    </div>
  `
})
export default class AvatarStatus {}
