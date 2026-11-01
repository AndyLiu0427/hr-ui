import { Component, inject, signal } from '@angular/core';
import { ButtonComponent, PopupService } from 'ngx-hr-ui';

@Component({
  selector: 'example-dialog-confirm',
  imports: [ButtonComponent],
  template: `
    <div class="flex flex-col items-center gap-4">
      <div class="flex flex-wrap justify-center gap-3">
        <oct-button (buttonClick)="approve()">Approve pay run</oct-button>
        <oct-button variant="outline" color="error" (buttonClick)="remove()">Delete employee</oct-button>
      </div>
      <p class="min-h-5 text-sm text-2" aria-live="polite">{{ result() }}</p>
    </div>
  `
})
export default class DialogConfirm {
  private readonly popup = inject(PopupService);
  readonly result = signal('');

  async approve(): Promise<void> {
    const approved = await this.popup.confirm('Approve the October pay run?', '48 employees will be paid on 31 October.', 'Approve');
    this.result.set(approved ? 'Pay run approved.' : 'Approval cancelled.');
  }

  // confirmDanger() paints the confirm button red. Use it when the action cannot be undone.
  async remove(): Promise<void> {
    const deleted = await this.popup.confirmDanger(
      'Delete Amelia Chan?',
      'Her payslips and leave history are deleted too. This cannot be undone.',
      'Delete employee'
    );
    this.result.set(deleted ? 'Amelia Chan was deleted.' : 'Nothing was deleted.');
  }
}
