import { Component, signal } from '@angular/core';
import { ButtonComponent, NoticeComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-notice-dismissible',
  imports: [ButtonComponent, NoticeComponent],
  template: `
    <div class="w-full max-w-lg">
      @if (visible()) {
        <oct-notice variant="info" [dismissible]="true" (dismiss)="visible.set(false)">
          New: employees can now download their payslips from the mobile app.
        </oct-notice>
      } @else {
        <oct-button variant="outline" color="neutral" (buttonClick)="visible.set(true)">Show the notice again</oct-button>
      }
    </div>
  `
})
export default class NoticeDismissible {
  readonly visible = signal(true);
}
