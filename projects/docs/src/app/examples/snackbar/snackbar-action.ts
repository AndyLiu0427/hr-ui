import { Component, inject, signal } from '@angular/core';
import { ButtonComponent, SnackbarService } from 'ngx-hr-ui';

@Component({
  selector: 'example-snackbar-action',
  imports: [ButtonComponent],
  template: `
    <div class="flex flex-col items-center gap-4">
      <oct-button variant="outline" color="error" icon="Trash2" [disabled]="deleted()" (buttonClick)="remove()">Delete pay item</oct-button>
      <p class="text-sm text-2">{{ deleted() ? 'Transport allowance was deleted.' : 'Transport allowance' }}</p>
    </div>
  `
})
export default class SnackbarAction {
  private readonly snackbar = inject(SnackbarService);
  readonly deleted = signal(false);

  remove(): void {
    this.deleted.set(true);
    // The handler runs when the action is clicked, then the snackbar closes.
    this.snackbar.show({
      message: 'Pay item deleted',
      action: { text: 'Undo', handler: () => this.deleted.set(false) }
    });
  }
}
