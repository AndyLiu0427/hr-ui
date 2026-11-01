import { Component } from '@angular/core';
import { DateTimelineComponent, DateTimelineNode } from 'ngx-hr-ui';

@Component({
  selector: 'example-date-timeline-close-dates',
  imports: [DateTimelineComponent],
  host: { class: 'w-full' },
  template: `
    <div class="mx-auto max-w-lg">
      <p class="mb-3 text-sm font-medium text-1">Offer, start and end of probation</p>
      <oct-date-timeline [nodes]="milestones" />
    </div>
  `
})
export default class DateTimelineCloseDates {
  // The offer and the start date are a week apart, so their labels would overlap.
  readonly milestones: DateTimelineNode[] = [{ date: '2026-01-02' }, { date: '2026-01-09', emphasis: true }, { date: '2026-07-08' }];
}
