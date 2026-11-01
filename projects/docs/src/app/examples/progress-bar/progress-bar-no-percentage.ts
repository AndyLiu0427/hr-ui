import { Component } from '@angular/core';
import { ProgressBarComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-progress-bar-no-percentage',
  imports: [ProgressBarComponent],
  host: { class: 'w-full' },
  template: `
    <div class="mx-auto max-w-md">
      <oct-progress-bar [progress]="75" label="Onboarding: 3 of 4 steps done" [showPercentage]="false" />
    </div>
  `
})
export default class ProgressBarNoPercentage {}
