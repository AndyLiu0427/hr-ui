import { Component } from '@angular/core';
import { ChipComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-chip-variants',
  imports: [ChipComponent],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <oct-chip variant="soft">Soft</oct-chip>
      <oct-chip variant="outline">Outline</oct-chip>
      <oct-chip variant="solid">Solid</oct-chip>
    </div>
  `
})
export default class ChipVariants {}
