import { Component, signal } from '@angular/core';
import { ButtonComponent, DialogComponent, DialogContentComponent, DialogFooterComponent, DialogHeaderComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-dialog-demo',
  imports: [ButtonComponent, DialogComponent, DialogHeaderComponent, DialogContentComponent, DialogFooterComponent],
  template: `
    <oct-button (buttonClick)="open.set(true)">Review pay run</oct-button>

    <oct-dialog [isOpen]="open()" (dialogClose)="open.set(false)">
      <oct-dialog-header>Approve the October pay run?</oct-dialog-header>
      <oct-dialog-content>
        <p class="text-sm leading-6 text-2">Payslips go out when the bank confirms the transfer.</p>
        <dl class="mt-4 grid grid-cols-2 gap-y-2 text-sm">
          <dt class="text-2">Pay date</dt>
          <dd class="text-right text-1">31 Oct 2026</dd>
          <dt class="text-2">Employees</dt>
          <dd class="text-right text-1">48</dd>
          <dt class="text-2">Net pay</dt>
          <dd class="text-right font-medium text-1">S$212,480.00</dd>
        </dl>
      </oct-dialog-content>
      <oct-dialog-footer>
        <oct-button class="ml-auto" variant="ghost" color="neutral" (buttonClick)="open.set(false)">Cancel</oct-button>
        <oct-button (buttonClick)="open.set(false)">Approve</oct-button>
      </oct-dialog-footer>
    </oct-dialog>
  `
})
export default class DialogDemo {
  readonly open = signal(false);
}
