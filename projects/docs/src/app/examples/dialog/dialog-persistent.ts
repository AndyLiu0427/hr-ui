import { Component, signal } from '@angular/core';
import { ButtonComponent, DialogComponent, DialogContentComponent, DialogFooterComponent, DialogHeaderComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-dialog-persistent',
  imports: [ButtonComponent, DialogComponent, DialogHeaderComponent, DialogContentComponent, DialogFooterComponent],
  template: `
    <oct-button variant="outline" color="neutral" icon="Upload" (buttonClick)="open.set(true)">Import employees</oct-button>

    <!-- Clicking outside or pressing Escape shakes the dialog instead of closing it. -->
    <oct-dialog [isOpen]="open()" [persistent]="true" closeLabel="Stop import" (dialogClose)="open.set(false)">
      <oct-dialog-header>Importing employees</oct-dialog-header>
      <oct-dialog-content>
        <p class="text-sm leading-6 text-2">
          Adding 120 employees from october-hires.xlsx. If you close this window, the import stops and nothing is saved.
        </p>
      </oct-dialog-content>
      <oct-dialog-footer>
        <oct-button class="ml-auto" variant="outline" color="neutral" (buttonClick)="open.set(false)">Stop import</oct-button>
      </oct-dialog-footer>
    </oct-dialog>
  `
})
export default class DialogPersistent {
  readonly open = signal(false);
}
