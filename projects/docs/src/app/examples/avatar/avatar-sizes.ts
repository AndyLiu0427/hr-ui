import { Component } from '@angular/core';
import { AvatarComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-avatar-sizes',
  imports: [AvatarComponent],
  template: `
    <div class="flex flex-wrap items-center gap-3">
      <oct-avatar size="xs" name="Grace Teo" />
      <oct-avatar size="sm" name="Grace Teo" />
      <oct-avatar size="md" name="Grace Teo" />
      <oct-avatar size="lg" name="Grace Teo" />
      <oct-avatar size="xl" name="Grace Teo" />
      <oct-avatar size="2xl" name="Grace Teo" />
    </div>
  `
})
export default class AvatarSizes {}
