import { Component } from '@angular/core';
import { NoticeComponent, TextComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-showcase-notifications',
  imports: [NoticeComponent, TextComponent],
  template: `
    <div class="flex flex-col gap-3">
      <oct-text variant="md" color="1" weight="semibold">Activity</oct-text>
      <oct-notice variant="success">Payslips sent to 214 employees.</oct-notice>
      <oct-notice variant="info">Tax tables for 2027 are now in use.</oct-notice>
      <oct-notice variant="error">The bank file for October was rejected. Upload it again.</oct-notice>
    </div>
  `
})
export default class ShowcaseNotifications {}
