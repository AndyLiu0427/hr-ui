import { Component } from '@angular/core';
import { KbdComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-kbd-variants',
  imports: [KbdComponent],
  template: `
    <div class="flex items-center gap-3">
      <oct-kbd>Tertiary</oct-kbd>
      <oct-kbd variant="secondary">Secondary</oct-kbd>
    </div>
  `
})
export default class KbdVariants {}
