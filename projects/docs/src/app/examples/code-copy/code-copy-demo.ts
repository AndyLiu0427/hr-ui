import { Component } from '@angular/core';
import { CodeCopyComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-code-copy-demo',
  imports: [CodeCopyComponent],
  template: `
    <!-- The button sits in the top-right corner of the nearest positioned parent, so the box is "relative". -->
    <div class="relative w-full max-w-lg rounded-xl border border-primary bg-secondary">
      <p class="flex h-16 items-center border-b border-primary pr-28 pl-4 text-sm font-medium text-1">Fetch October payslips</p>
      <pre class="p-4 font-mono text-sm leading-6 whitespace-pre-wrap text-1 wrap-anywhere"><code>{{ request }}</code></pre>
      <oct-code-copy [code]="request" />
    </div>
  `
})
export default class CodeCopyDemo {
  readonly request = `curl https://api.example.com/v1/payslips \\
  -H "Authorization: Bearer $API_KEY" \\
  -d period=2026-10`;
}
