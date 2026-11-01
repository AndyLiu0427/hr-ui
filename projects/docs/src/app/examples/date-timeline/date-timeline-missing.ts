import { Component } from '@angular/core';
import { DateTimelineComponent, DateTimelineNode } from 'ngx-hr-ui';

@Component({
  selector: 'example-date-timeline-missing',
  imports: [DateTimelineComponent],
  host: { class: 'w-full' },
  template: `
    <div class="mx-auto max-w-lg">
      <p class="mb-3 text-sm font-medium text-1">Contract, no revision yet</p>
      <oct-date-timeline [nodes]="contract" />
    </div>
  `
})
export default class DateTimelineMissing {
  // The revision has no date yet, so the strip shows only the start and the end.
  readonly contract: DateTimelineNode[] = [{ date: '2026-01-15' }, { date: null, emphasis: true }, { date: '2026-12-31' }];
}
