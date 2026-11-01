import { Component, inject } from '@angular/core';
import { ButtonComponent, SnackbarService } from 'ngx-hr-ui';

@Component({
  selector: 'example-snackbar-demo',
  imports: [ButtonComponent],
  template: `<oct-button icon="Send" (buttonClick)="send()">Send payslips</oct-button>`
})
export default class SnackbarDemo {
  private readonly snackbar = inject(SnackbarService);

  send(): void {
    this.snackbar.success('Payslips sent to 48 employees');
  }
}
