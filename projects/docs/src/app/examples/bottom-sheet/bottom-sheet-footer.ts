import { Component, signal } from '@angular/core';
import { BottomSheetComponent, ButtonComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-bottom-sheet-footer',
  imports: [BottomSheetComponent, ButtonComponent],
  template: `
    <oct-button variant="outline" color="neutral" (buttonClick)="open.set(true)">Review leave request</oct-button>

    <oct-bottom-sheet title="Leave request" [isOpen]="open()" (closed)="open.set(false)">
      <dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 p-4 text-sm">
        <dt class="text-2">Employee</dt>
        <dd class="text-1">Marcus Tan</dd>
        <dt class="text-2">Type</dt>
        <dd class="text-1">Annual leave</dd>
        <dt class="text-2">Dates</dt>
        <dd class="text-1">3 to 7 Nov 2026 (5 days)</dd>
        <dt class="text-2">Balance after</dt>
        <dd class="text-1">9 days</dd>
      </dl>

      <!-- The footer stays pinned below the content, clear of the phone's home indicator. -->
      <ng-template #footer>
        <div class="flex gap-3 px-4 pt-4">
          <oct-button class="flex-1" variant="outline" color="neutral" [fullWidth]="true" (buttonClick)="open.set(false)">Reject</oct-button>
          <oct-button class="flex-1" [fullWidth]="true" (buttonClick)="open.set(false)">Approve</oct-button>
        </div>
      </ng-template>
    </oct-bottom-sheet>
  `
})
export default class BottomSheetFooter {
  readonly open = signal(false);
}
