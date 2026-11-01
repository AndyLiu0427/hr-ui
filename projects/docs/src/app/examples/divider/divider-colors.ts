import { Component } from '@angular/core';
import { DividerComponent, type DividerColor } from 'ngx-hr-ui';

@Component({
  selector: 'example-divider-colors',
  imports: [DividerComponent],
  host: { class: 'w-full max-w-xs' },
  template: `
    @for (color of colors; track color) {
      <p class="font-mono text-xs text-3">{{ color }}</p>
      <oct-divider [color]="color" spacing="sm" />
    }
  `
})
export default class DividerColors {
  readonly colors: DividerColor[] = ['neutral', 'primary', 'success', 'warning', 'error'];
}
