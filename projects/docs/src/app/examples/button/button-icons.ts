import { Component } from '@angular/core';
import { ButtonComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-button-icons',
  imports: [ButtonComponent],
  template: `
    <div class="flex flex-wrap items-center gap-3">
      <oct-button icon="Send">Send payslips</oct-button>
      <oct-button variant="outline" color="neutral" icon="ArrowRight" iconPosition="right">Next step</oct-button>
      <!-- An icon-only button needs an accessible name. -->
      <oct-button variant="outline" color="neutral" icon="Settings" ariaLabel="Settings" />
      <oct-button variant="ghost" color="neutral" shape="square" icon="Ellipsis" ariaLabel="More actions" />
    </div>
  `
})
export default class ButtonIcons {}
