import { Component, signal } from '@angular/core';
import { SliderComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-slider-colors',
  imports: [SliderComponent],
  host: { class: 'block w-full max-w-sm' },
  template: `
    <oct-slider
      leftLabel="Employee"
      rightLabel="Employer"
      leftColor="neutral"
      rightColor="primary"
      [leftPercent]="employeePercent()"
      [rightPercent]="100 - employeePercent()"
      (percentageChange)="employeePercent.set($event.left)"
    />
  `
})
export default class SliderColors {
  // How the cost of a training course is shared.
  readonly employeePercent = signal(30);
}
