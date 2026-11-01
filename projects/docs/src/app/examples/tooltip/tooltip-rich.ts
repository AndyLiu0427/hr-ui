import { Component } from '@angular/core';
import { ButtonComponent, TooltipDirective } from 'ngx-hr-ui';

@Component({
  selector: 'example-tooltip-rich',
  imports: [ButtonComponent, TooltipDirective],
  template: `
    <div class="flex items-center gap-1 text-sm text-1">
      CPF contributions: S$2,220.00
      <oct-button variant="ghost" color="neutral" size="sm" icon="Info" ariaLabel="CPF breakdown" [octTooltipContent]="breakdown" />
    </div>

    <ng-template #breakdown>
      <dl class="grid grid-cols-[auto_auto] gap-x-6 gap-y-1 text-xs">
        <dt class="text-2">Employee (20%)</dt>
        <dd class="text-right text-1">S$1,200.00</dd>
        <dt class="text-2">Employer (17%)</dt>
        <dd class="text-right text-1">S$1,020.00</dd>
      </dl>
    </ng-template>
  `
})
export default class TooltipRich {}
