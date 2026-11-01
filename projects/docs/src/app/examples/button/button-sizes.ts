import { Component } from '@angular/core';
import { ButtonComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-button-sizes',
  imports: [ButtonComponent],
  template: `
    <div class="flex flex-wrap items-center gap-3">
      <oct-button size="sm">Small</oct-button>
      <oct-button size="md">Medium</oct-button>
      <oct-button size="lg">Large</oct-button>
    </div>
  `
})
export default class ButtonSizes {}
