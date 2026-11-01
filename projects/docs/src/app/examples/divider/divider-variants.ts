import { Component } from '@angular/core';
import { DividerComponent, type DividerVariant } from 'ngx-hr-ui';

@Component({
  selector: 'example-divider-variants',
  imports: [DividerComponent],
  host: { class: 'w-full max-w-xs' },
  template: `
    @for (variant of variants; track variant) {
      <p class="font-mono text-xs text-3">{{ variant }}</p>
      <oct-divider [variant]="variant" spacing="sm" />
    }
  `
})
export default class DividerVariants {
  readonly variants: DividerVariant[] = ['solid', 'dashed', 'dotted'];
}
