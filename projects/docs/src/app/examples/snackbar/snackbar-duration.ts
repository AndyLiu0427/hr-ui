import { Component, inject } from '@angular/core';
import { ButtonComponent, SnackbarService } from 'ngx-hr-ui';

@Component({
  selector: 'example-snackbar-duration',
  imports: [ButtonComponent],
  template: `<oct-button variant="outline" color="neutral" icon="FileDown" (buttonClick)="exportPayroll()">Export payroll</oct-button>`
})
export default class SnackbarDuration {
  private readonly snackbar = inject(SnackbarService);

  exportPayroll(): void {
    // duration: 0 keeps it on screen. The returned ref closes it when the work is done.
    const progress = this.snackbar.info('Exporting October payroll…', { duration: 0, dismissible: false });

    // Stands in for the real export request.
    setTimeout(() => {
      progress.dismiss();
      this.snackbar.success('Payroll export is ready');
    }, 2500);
  }
}
