import { Component } from '@angular/core';
import { DateTimelineComponent, DateTimelineNode } from 'ngx-hr-ui';

@Component({
  selector: 'example-date-timeline-demo',
  imports: [DateTimelineComponent],
  host: { class: 'w-full' },
  template: `
    <div class="mx-auto max-w-lg">
      <p class="mb-3 text-sm font-medium text-1">Contract with salary revision</p>
      <oct-date-timeline [nodes]="contract" />
    </div>
  `
})
export default class DateTimelineDemo {
  // Start, salary revision (emphasised), end.
  readonly contract: DateTimelineNode[] = [{ date: '2025-12-01' }, { date: '2026-03-16', emphasis: true }, { date: '2026-11-30' }];
}
