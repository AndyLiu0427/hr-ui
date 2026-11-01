import { Component } from '@angular/core';
import { CodeCopyComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-code-copy-value',
  imports: [CodeCopyComponent],
  template: `
    <div class="relative w-full max-w-lg rounded-xl border border-primary bg-secondary p-4 pr-28">
      <p class="text-xs text-2">Bank file reference</p>
      <p class="mt-1 truncate font-mono text-sm text-1">{{ reference }}</p>
      <oct-code-copy [code]="reference" />
    </div>
  `
})
export default class CodeCopyValue {
  readonly reference = 'PAY-2026-10-000482';
}
