import { Component, signal } from '@angular/core';
import { SliderComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-slider-ticks',
  imports: [SliderComponent],
  host: { class: 'block w-full max-w-sm' },
  template: `
    <oct-slider
      leftLabel="Engineering"
      rightLabel="Product"
      [showTicks]="true"
      [step]="10"
      [leftPercent]="engineeringPercent()"
      [rightPercent]="100 - engineeringPercent()"
      (percentageChange)="engineeringPercent.set($event.left)"
    />
  `
})
export default class SliderTicks {
  // Share of Mei Ling Tan's salary charged to each cost centre.
  readonly engineeringPercent = signal(60);
}
