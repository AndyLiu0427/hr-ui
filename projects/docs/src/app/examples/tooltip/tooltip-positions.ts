import { Component } from '@angular/core';
import { ButtonComponent, TooltipDirective, TooltipPosition } from 'ngx-hr-ui';

@Component({
  selector: 'example-tooltip-positions',
  imports: [ButtonComponent, TooltipDirective],
  template: `
    <div class="flex flex-wrap justify-center gap-3">
      @for (position of positions; track position) {
        <oct-button variant="outline" color="neutral" octTooltip="Approved by Amelia Chan" [octTooltipPosition]="position">
          {{ position }}
        </oct-button>
      }
    </div>
  `
})
export default class TooltipPositions {
  readonly positions: TooltipPosition[] = ['top', 'right', 'bottom', 'left'];
}
