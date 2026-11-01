import { Component, inject } from '@angular/core';
import { ButtonComponent, PopupService } from 'ngx-hr-ui';

@Component({
  selector: 'example-dialog-alerts',
  imports: [ButtonComponent],
  template: `
    <div class="flex flex-wrap justify-center gap-3">
      <oct-button variant="outline" color="success" (buttonClick)="popup.success('Payslips were sent to 48 employees.')">Success</oct-button>
      <oct-button variant="outline" color="error" (buttonClick)="popup.error('The bank file was not created. 2 employees have no bank account.')">
        Error
      </oct-button>
      <oct-button variant="outline" color="warning" (buttonClick)="popup.warning('The pay run locks at 6 pm today. Submit claims before then.')">
        Warning
      </oct-button>
      <oct-button variant="outline" color="info" (buttonClick)="popup.info('Payroll is closed on 25 December. Payslips go out on 24 December.')">
        Info
      </oct-button>
    </div>
  `
})
export default class DialogAlerts {
  protected readonly popup = inject(PopupService);
}
