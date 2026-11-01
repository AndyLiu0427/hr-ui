import { Component } from '@angular/core';
import { AvatarComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-avatar-demo',
  imports: [AvatarComponent],
  template: `
    <div class="flex items-center gap-4">
      <oct-avatar size="lg" name="Sarah Lim" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces" />
      <oct-avatar size="lg" name="Arjun Mehta" />
      <oct-avatar size="lg" name="Nurul Aisyah" status="online" />
    </div>
  `
})
export default class AvatarDemo {}
