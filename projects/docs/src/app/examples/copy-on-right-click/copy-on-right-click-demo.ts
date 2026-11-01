import { Component } from '@angular/core';
import { CopyOnRightClickDirective } from 'ngx-hr-ui';

@Component({
  selector: 'example-copy-on-right-click-demo',
  imports: [CopyOnRightClickDirective],
  host: { class: 'w-full max-w-sm' },
  template: `
    <dl class="grid gap-3 text-sm">
      @for (field of fields; track field.label) {
        <div class="flex justify-between gap-4">
          <dt class="text-3">{{ field.label }}</dt>
          <dd class="cursor-copy font-mono text-1" [octCopyOnRightClick]="field.value">{{ field.value }}</dd>
        </div>
      }
    </dl>
    <p class="mt-4 text-xs text-3">Right-click a value to copy it.</p>
  `
})
export default class CopyOnRightClickDemo {
  readonly fields = [
    { label: 'Employee code', value: 'EMP-01042' },
    { label: 'Pay run', value: 'PR-2026-11' },
    { label: 'Bank account', value: '012-345678-9' }
  ];
}
