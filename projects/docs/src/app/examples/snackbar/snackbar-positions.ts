import { Component, inject } from '@angular/core';
import { ButtonComponent, SnackbarPosition, SnackbarService } from 'ngx-hr-ui';

@Component({
  selector: 'example-snackbar-positions',
  imports: [ButtonComponent],
  template: `
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      @for (position of positions; track position) {
        <oct-button variant="outline" color="neutral" (buttonClick)="show(position)">{{ position }}</oct-button>
      }
    </div>
  `
})
export default class SnackbarPositions {
  private readonly snackbar = inject(SnackbarService);
  readonly positions: SnackbarPosition[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];

  show(position: SnackbarPosition): void {
    this.snackbar.info('Leave balance updated', { position });
  }
}
