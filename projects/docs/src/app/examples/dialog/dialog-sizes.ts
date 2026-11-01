import { Component, signal } from '@angular/core';
import { ButtonComponent, DialogComponent, DialogContentComponent, DialogFooterComponent, DialogHeaderComponent } from 'ngx-hr-ui';

type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'example-dialog-sizes',
  imports: [ButtonComponent, DialogComponent, DialogHeaderComponent, DialogContentComponent, DialogFooterComponent],
  template: `
    <div class="flex flex-wrap justify-center gap-3">
      @for (option of sizes; track option) {
        <oct-button variant="outline" color="neutral" (buttonClick)="openAs(option)">{{ option }}</oct-button>
      }
    </div>

    <oct-dialog [size]="size()" [isOpen]="open()" (dialogClose)="open.set(false)">
      <oct-dialog-header>Dialog size: {{ size() }}</oct-dialog-header>
      <oct-dialog-content>
        <p class="text-sm leading-6 text-2">Use sm for a short question, md for most dialogs, and lg or xl for forms and tables.</p>
      </oct-dialog-content>
      <oct-dialog-footer>
        <oct-button class="ml-auto" variant="outline" color="neutral" (buttonClick)="open.set(false)">Close</oct-button>
      </oct-dialog-footer>
    </oct-dialog>
  `
})
export default class DialogSizes {
  readonly sizes: DialogSize[] = ['sm', 'md', 'lg', 'xl', 'full'];
  readonly size = signal<DialogSize>('md');
  readonly open = signal(false);

  openAs(size: DialogSize): void {
    this.size.set(size);
    this.open.set(true);
  }
}
