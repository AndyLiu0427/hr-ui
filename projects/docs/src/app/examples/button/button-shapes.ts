import { Component } from '@angular/core';
import { ButtonComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-button-shapes',
  imports: [ButtonComponent],
  template: `
    <div class="flex flex-wrap items-center gap-3">
      <oct-button shape="round">Round</oct-button>
      <oct-button shape="square">Square</oct-button>
    </div>
  `
})
export default class ButtonShapes {}
