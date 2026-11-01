import { Component, signal } from '@angular/core';
import { SliderComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-slider-step',
  imports: [SliderComponent],
  host: { class: 'block w-full max-w-sm' },
  template: `
    <oct-slider
      leftLabel="Project Atlas"
      rightLabel="Project Borealis"
      [step]="5"
      [leftPercent]="atlasPercent()"
      (percentageChange)="atlasPercent.set($event.left)"
    />
  `
})
export default class SliderStep {
  readonly atlasPercent = signal(35);
}
