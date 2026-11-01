import { Component } from '@angular/core';
import { CardComponent, CardContentComponent, type CardPadding } from 'ngx-hr-ui';

@Component({
  selector: 'example-card-padding',
  imports: [CardComponent, CardContentComponent],
  host: { class: 'w-full' },
  template: `
    <div class="grid items-start gap-4 sm:grid-cols-3">
      @for (padding of paddings; track padding) {
        <oct-card [padding]="padding">
          <oct-card-content>
            <p class="font-mono text-xs text-3">padding="{{ padding }}"</p>
            <p class="mt-2 text-2xl font-semibold tabular-nums text-1">214</p>
            <p class="text-sm text-3">Employees paid</p>
          </oct-card-content>
        </oct-card>
      }
    </div>
  `
})
export default class CardPaddingExample {
  readonly paddings: CardPadding[] = ['sm', 'md', 'lg'];
}
