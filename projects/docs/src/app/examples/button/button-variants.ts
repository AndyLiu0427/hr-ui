import { Component } from '@angular/core';
import { ButtonComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-button-variants',
  imports: [ButtonComponent],
  template: `
    <div class="flex flex-wrap items-center gap-3">
      <oct-button variant="solid">Solid</oct-button>
      <oct-button variant="outline">Outline</oct-button>
      <oct-button variant="ghost">Ghost</oct-button>
      <oct-button variant="link">Link</oct-button>
    </div>
  `
})
export default class ButtonVariants {}
