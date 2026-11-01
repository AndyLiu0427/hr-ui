import { Component } from '@angular/core';
import { ChipComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-chip-icons',
  imports: [ChipComponent],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <oct-chip icon="Building2">Finance</oct-chip>
      <oct-chip icon="MapPin">Singapore</oct-chip>
      <oct-chip icon="Calendar">Oct 2026</oct-chip>
    </div>
  `
})
export default class ChipIcons {}
