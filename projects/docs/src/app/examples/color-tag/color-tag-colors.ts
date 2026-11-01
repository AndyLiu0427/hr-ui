import { Component } from '@angular/core';
import { ColorTagColor, ColorTagComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-color-tag-colors',
  imports: [ColorTagComponent],
  template: `
    <div class="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-1 sm:grid-cols-3">
      @for (color of colors; track color) {
        <oct-color-tag [color]="color" [label]="color" />
      }
      <!-- null draws no mark, and the label keeps its place. -->
      <oct-color-tag [color]="null" label="none" />
    </div>
  `
})
export default class ColorTagColors {
  readonly colors = Object.values(ColorTagColor);
}
