import { Component } from '@angular/core';
import { ButtonComponent, TooltipDirective } from 'ngx-hr-ui';

@Component({
  selector: 'example-tooltip-demo',
  imports: [ButtonComponent, TooltipDirective],
  template: `
    <div class="flex items-center gap-2">
      <oct-button variant="outline" color="neutral" icon="Download" ariaLabel="Download payslip" octTooltip="Download payslip" />
      <oct-button variant="outline" color="neutral" icon="Mail" ariaLabel="Email payslip" octTooltip="Email payslip" />
      <oct-button variant="outline" color="neutral" icon="Printer" ariaLabel="Print payslip" octTooltip="Print payslip" />
    </div>
  `
})
export default class TooltipDemo {}
