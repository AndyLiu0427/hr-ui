import { Component } from '@angular/core';
import { NoticeComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-notice-icon',
  imports: [NoticeComponent],
  template: `
    <div class="flex w-full max-w-lg flex-col gap-3">
      <oct-notice variant="info" icon="CalendarClock">Public holiday on 25 December. Payroll closes a day early.</oct-notice>
      <oct-notice variant="info" [showDefaultIcon]="false">Your changes are saved as a draft until you submit them.</oct-notice>
    </div>
  `
})
export default class NoticeIcon {}
