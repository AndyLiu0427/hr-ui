import { Component } from '@angular/core';
import { BadgeComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-badge-sizes',
  imports: [BadgeComponent],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <oct-badge size="sm" text="Small" />
      <oct-badge size="md" text="Medium" />
      <oct-badge size="lg" text="Large" />
    </div>
  `
})
export default class BadgeSizes {}
