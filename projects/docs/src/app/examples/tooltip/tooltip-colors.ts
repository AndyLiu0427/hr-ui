import { Component } from '@angular/core';
import { ButtonComponent, TooltipColor, TooltipDirective } from 'ngx-hr-ui';

@Component({
  selector: 'example-tooltip-colors',
  imports: [ButtonComponent, TooltipDirective],
  template: `
    <div class="flex flex-wrap justify-center gap-3">
      @for (tip of tips; track tip.color) {
        <oct-button variant="outline" color="neutral" [octTooltip]="tip.text" [octTooltipColor]="tip.color">{{ tip.color }}</oct-button>
      }
    </div>
  `
})
export default class TooltipColors {
  readonly tips: { color: TooltipColor; text: string }[] = [
    { color: 'primary', text: 'Payroll is on track' },
    { color: 'default', text: 'Edited 2 days ago' },
    { color: 'blue', text: 'Paid on the 25th' },
    { color: 'red', text: 'Payment failed' },
    { color: 'purple', text: 'Contractor' },
    { color: 'amber', text: 'Awaiting approval' }
  ];
}
