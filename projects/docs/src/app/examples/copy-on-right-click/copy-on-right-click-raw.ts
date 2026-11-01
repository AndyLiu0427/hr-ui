import { Component } from '@angular/core';
import { CopyOnRightClickDirective } from 'ngx-hr-ui';

@Component({
  selector: 'example-copy-on-right-click-raw',
  imports: [CopyOnRightClickDirective],
  template: `
    <p class="text-sm text-3">Net pay, November</p>
    <!-- Shows the formatted amount, copies the plain number for a spreadsheet. -->
    <p class="mt-1 cursor-copy text-2xl font-semibold tabular-nums text-1" [octCopyOnRightClick]="netPay">
      SGD {{ netPay.toLocaleString('en-SG', { minimumFractionDigits: 2 }) }}
    </p>
  `
})
export default class CopyOnRightClickRaw {
  readonly netPay = 5480.5;
}
