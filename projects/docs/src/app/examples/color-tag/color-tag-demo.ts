import { Component } from '@angular/core';
import { ColorTagColor, ColorTagComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-color-tag-demo',
  imports: [ColorTagComponent],
  template: `
    <ul class="flex flex-col gap-3 text-sm text-1">
      @for (client of clients; track client.code) {
        <li><oct-color-tag [color]="client.color" [label]="client.code + ' · ' + client.name" /></li>
      }
    </ul>
  `
})
export default class ColorTagDemo {
  readonly clients: { code: string; name: string; color: ColorTagColor | null }[] = [
    { code: 'HBL', name: 'Harbourline Freight', color: 'blue' },
    { code: 'MRG', name: 'Marina Retail Group', color: 'green' },
    { code: 'CAS', name: 'Changi Air Services', color: 'orange' },
    // No colour: the code still lines up with the others.
    { code: 'TPH', name: 'Tampines Polyclinic', color: null }
  ];
}
