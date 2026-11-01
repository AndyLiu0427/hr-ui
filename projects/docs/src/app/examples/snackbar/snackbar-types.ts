import { Component, inject } from '@angular/core';
import { ButtonComponent, SnackbarService } from 'ngx-hr-ui';

@Component({
  selector: 'example-snackbar-types',
  imports: [ButtonComponent],
  template: `
    <div class="flex flex-wrap justify-center gap-3">
      <oct-button variant="outline" color="success" (buttonClick)="snackbar.success('Leave request approved')">Success</oct-button>
      <oct-button variant="outline" color="error" (buttonClick)="snackbar.error('Bank file was not created')">Error</oct-button>
      <oct-button variant="outline" color="warning" (buttonClick)="snackbar.warning('3 employees have no tax number')">Warning</oct-button>
      <oct-button variant="outline" color="info" (buttonClick)="snackbar.info('Payroll locks at 6 pm today')">Info</oct-button>
      <oct-button variant="outline" color="neutral" (buttonClick)="snackbar.show({ message: 'Draft saved' })">Neutral</oct-button>
    </div>
  `
})
export default class SnackbarTypes {
  protected readonly snackbar = inject(SnackbarService);
}
