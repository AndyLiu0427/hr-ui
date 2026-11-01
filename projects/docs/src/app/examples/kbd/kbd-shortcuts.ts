import { Component } from '@angular/core';
import { KbdComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-kbd-shortcuts',
  imports: [KbdComponent],
  template: `
    <dl class="grid w-full max-w-xs grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 text-sm">
      @for (shortcut of shortcuts; track shortcut.action) {
        <dt class="text-2">{{ shortcut.action }}</dt>
        <dd><oct-kbd>{{ shortcut.keys }}</oct-kbd></dd>
      }
    </dl>
  `
})
export default class KbdShortcuts {
  readonly shortcuts = [
    { action: 'Search employees', keys: '⌘K' },
    { action: 'New leave request', keys: 'N' },
    { action: 'Approve selected', keys: 'A' },
    { action: 'Close panel', keys: 'Esc' }
  ];
}
