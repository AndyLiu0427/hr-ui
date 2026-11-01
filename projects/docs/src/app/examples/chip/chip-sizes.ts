import { Component } from '@angular/core';
import { ChipComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-chip-sizes',
  imports: [ChipComponent],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <oct-chip size="sm">Small</oct-chip>
      <oct-chip size="md">Medium</oct-chip>
    </div>
  `
})
export default class ChipSizes {}
