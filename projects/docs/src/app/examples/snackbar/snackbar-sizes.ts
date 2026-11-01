import { Component, inject } from '@angular/core';
import { ButtonComponent, SnackbarService, SnackbarSize } from 'ngx-hr-ui';

@Component({
  selector: 'example-snackbar-sizes',
  imports: [ButtonComponent],
  template: `
    <div class="flex flex-wrap justify-center gap-3">
      @for (size of sizes; track size) {
        <oct-button variant="outline" color="neutral" (buttonClick)="show(size)">{{ size }}</oct-button>
      }
    </div>
  `
})
export default class SnackbarSizes {
  private readonly snackbar = inject(SnackbarService);
  readonly sizes: SnackbarSize[] = ['sm', 'md', 'lg'];

  show(size: SnackbarSize): void {
    this.snackbar.success('Expense claim submitted', { size });
  }
}
