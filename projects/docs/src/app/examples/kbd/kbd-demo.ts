import { Component } from '@angular/core';
import { KbdComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-kbd-demo',
  imports: [KbdComponent],
  template: `
    <p class="text-sm text-2">Press <oct-kbd>⌘K</oct-kbd> to search employees, or <oct-kbd>Esc</oct-kbd> to close.</p>
  `
})
export default class KbdDemo {}
