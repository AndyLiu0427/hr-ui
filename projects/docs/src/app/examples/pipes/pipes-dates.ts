import { Component } from '@angular/core';
import { OctDatePipe, OctDateTimePipe, OctTimePipe } from 'ngx-hr-ui';

@Component({
  selector: 'example-pipes-dates',
  imports: [OctDatePipe, OctDateTimePipe, OctTimePipe],
  host: { class: 'w-full max-w-sm' },
  template: `
    <dl class="grid gap-3 text-sm">
      <div class="flex justify-between gap-4">
        <dt class="font-mono text-3">approvedAt | octDate</dt>
        <dd class="text-1">{{ approvedAt | octDate }}</dd>
      </div>
      <div class="flex justify-between gap-4">
        <dt class="font-mono text-3">approvedAt | octTime</dt>
        <dd class="text-1">{{ approvedAt | octTime }}</dd>
      </div>
      <div class="flex justify-between gap-4">
        <dt class="font-mono text-3">approvedAt | octDateTime</dt>
        <dd class="text-1">{{ approvedAt | octDateTime }}</dd>
      </div>
    </dl>
  `
})
export default class PipesDates {
  // 3:45 pm in Singapore, when the November pay run was approved.
  readonly approvedAt = '2026-11-26T07:45:00Z';
}
