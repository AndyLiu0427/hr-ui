import { Component } from '@angular/core';
import { DateTimelineComponent, DateTimelineNode } from 'ngx-hr-ui';

@Component({
  selector: 'example-date-timeline-align',
  imports: [DateTimelineComponent],
  host: { class: 'w-full' },
  template: `
    <div class="mx-auto max-w-lg">
      <p class="mb-3 text-sm font-medium text-1">Assignment period</p>
      <oct-date-timeline labelAlign="start" [nodes]="assignment" />
    </div>
  `
})
export default class DateTimelineAlign {
  readonly assignment: DateTimelineNode[] = [{ date: '2026-02-02' }, { date: '2026-08-31' }];
}
