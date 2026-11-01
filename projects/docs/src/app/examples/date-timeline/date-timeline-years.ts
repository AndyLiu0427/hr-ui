import { Component } from '@angular/core';
import { DateTimelineComponent, DateTimelineNode } from 'ngx-hr-ui';

@Component({
  selector: 'example-date-timeline-years',
  imports: [DateTimelineComponent],
  host: { class: 'w-full' },
  template: `
    <div class="mx-auto max-w-lg">
      <p class="mb-3 text-sm font-medium text-1">Contract renewals</p>
      <oct-date-timeline [nodes]="renewals" />
    </div>
  `
})
export default class DateTimelineYears {
  readonly renewals: DateTimelineNode[] = [{ date: '2021-03-01' }, { date: '2023-03-01' }, { date: '2025-03-01', emphasis: true }, { date: '2027-02-28' }];
}
