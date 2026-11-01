import { Component } from '@angular/core';
import { NoticeComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-notice-variants',
  imports: [NoticeComponent],
  template: `
    <div class="flex w-full max-w-lg flex-col gap-3">
      <oct-notice variant="info">Payslips for October will be ready on 31 October.</oct-notice>
      <oct-notice variant="success">All 48 employees have a bank account on file.</oct-notice>
      <oct-notice variant="warning">3 employees have no tax number. Add them before the run locks.</oct-notice>
      <oct-notice variant="error">The bank rejected the payment file. Check the account numbers and send it again.</oct-notice>
    </div>
  `
})
export default class NoticeVariants {}
