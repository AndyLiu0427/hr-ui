import { Component } from '@angular/core';
import { ProgressBarComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-progress-bar-demo',
  imports: [ProgressBarComponent],
  host: { class: 'w-full' },
  template: `
    <div class="mx-auto max-w-md">
      <oct-progress-bar [progress]="64" label="Importing timesheets" />
    </div>
  `
})
export default class ProgressBarDemo {}
