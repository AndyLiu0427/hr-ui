import { Component } from '@angular/core';
import { OctDatePipe, OctDateTimePipe, OctTimePipe } from 'ngx-hr-ui';

@Component({
  selector: 'example-pipes-formats',
  imports: [OctDatePipe, OctDateTimePipe, OctTimePipe],
  host: { class: 'w-full max-w-md' },
  template: `
    <dl class="grid gap-3 text-sm">
      <div class="flex justify-between gap-4">
        <dt class="font-mono text-3">octDate: 'dd/MM/yyyy'</dt>
        <dd class="text-1">{{ approvedAt | octDate: 'dd/MM/yyyy' }}</dd>
      </div>
      <div class="flex justify-between gap-4">
        <dt class="font-mono text-3">octDateTime: 'EEE d MMM, h:mm a'</dt>
        <dd class="text-1">{{ approvedAt | octDateTime: 'EEE d MMM, h:mm a' }}</dd>
      </div>
      <div class="flex justify-between gap-4">
        <dt class="font-mono text-3">octTime: 'HH:mm' : '+0000'</dt>
        <dd class="text-1">{{ approvedAt | octTime: 'HH:mm' : '+0000' }}</dd>
      </div>
    </dl>
  `
})
export default class PipesFormats {
  readonly approvedAt = '2026-11-26T07:45:00Z';
}
