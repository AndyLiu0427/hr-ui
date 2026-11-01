import { Component } from '@angular/core';
import { KbdComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-kbd-combinations',
  imports: [KbdComponent],
  template: `
    <div class="flex flex-col items-center gap-4 text-sm text-3">
      <span class="flex items-center gap-1">
        <oct-kbd variant="secondary">Ctrl</oct-kbd>+<oct-kbd variant="secondary">Shift</oct-kbd>+<oct-kbd variant="secondary">P</oct-kbd>
      </span>
      <span class="flex items-center gap-0.5">
        <oct-kbd variant="secondary">↑</oct-kbd>
        <oct-kbd variant="secondary">↓</oct-kbd>
      </span>
    </div>
  `
})
export default class KbdCombinations {}
