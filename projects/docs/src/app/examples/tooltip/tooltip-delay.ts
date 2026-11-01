import { Component } from '@angular/core';
import { ButtonComponent, TooltipDirective } from 'ngx-hr-ui';

@Component({
  selector: 'example-tooltip-delay',
  imports: [ButtonComponent, TooltipDirective],
  template: `
    <div class="flex flex-wrap justify-center gap-3">
      <oct-button variant="outline" color="neutral" octTooltip="Shows at once" [octTooltipShowDelay]="0">No delay</oct-button>
      <oct-button variant="outline" color="neutral" octTooltip="Shows after 200 ms">Default</oct-button>
      <oct-button variant="outline" color="neutral" octTooltip="Shows after 1 second" [octTooltipShowDelay]="1000">1 second</oct-button>
    </div>
  `
})
export default class TooltipDelay {}
