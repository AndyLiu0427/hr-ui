import { Component, signal } from '@angular/core';
import { NoticeComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-notice-action',
  imports: [NoticeComponent],
  template: `
    <div class="w-full max-w-lg">
      <oct-notice variant="error" [showAction]="true" actionLabel="Send again" [actionLoading]="sending()" (actionClick)="resend()">
        The bank rejected the October payment file.
      </oct-notice>
    </div>
  `
})
export default class NoticeAction {
  readonly sending = signal(false);

  resend(): void {
    this.sending.set(true);
    // Stands in for the real request.
    setTimeout(() => this.sending.set(false), 1500);
  }
}
