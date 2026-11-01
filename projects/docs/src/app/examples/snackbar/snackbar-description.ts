import { Component, inject } from '@angular/core';
import { ButtonComponent, SnackbarService } from 'ngx-hr-ui';

@Component({
  selector: 'example-snackbar-description',
  imports: [ButtonComponent],
  template: `<oct-button variant="outline" color="neutral" icon="Upload" (buttonClick)="importTimesheets()">Import timesheets</oct-button>`
})
export default class SnackbarDescription {
  private readonly snackbar = inject(SnackbarService);

  importTimesheets(): void {
    this.snackbar.warning('2 timesheets were skipped', {
      description: 'Marcus Tan and Priya Nair have no approved hours for October.'
    });
  }
}
