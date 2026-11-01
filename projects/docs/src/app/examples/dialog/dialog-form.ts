import { Component, signal } from '@angular/core';
import {
  ButtonComponent,
  DialogComponent,
  DialogContentComponent,
  DialogFooterComponent,
  DialogHeaderComponent,
  InputComponent
} from 'ngx-hr-ui';

@Component({
  selector: 'example-dialog-form',
  imports: [ButtonComponent, DialogComponent, DialogHeaderComponent, DialogContentComponent, DialogFooterComponent, InputComponent],
  template: `
    <oct-button icon="UserPlus" (buttonClick)="open.set(true)">Add employee</oct-button>

    <oct-dialog [isOpen]="open()" (dialogClose)="open.set(false)">
      <!-- display: contents keeps the dialog's layout, and Enter in a field submits the form. -->
      <form class="contents" (submit)="save($event)">
        <oct-dialog-header>Add employee</oct-dialog-header>
        <oct-dialog-content>
          <div class="flex flex-col gap-1">
            <oct-input label="Full name" [(value)]="name" [required]="true" />
            <oct-input label="Work email" type="email" [(value)]="email" [required]="true" />
            <oct-input label="Job title" [(value)]="jobTitle" />
          </div>
        </oct-dialog-content>
        <oct-dialog-footer>
          <oct-button class="ml-auto" variant="ghost" color="neutral" (buttonClick)="open.set(false)">Cancel</oct-button>
          <oct-button type="submit" [disabled]="!name() || !email()">Add employee</oct-button>
        </oct-dialog-footer>
      </form>
    </oct-dialog>
  `
})
export default class DialogForm {
  readonly open = signal(false);
  readonly name = signal('');
  readonly email = signal('');
  readonly jobTitle = signal('');

  save(event: Event): void {
    event.preventDefault();
    // Send the new employee to your API here.
    this.open.set(false);
    this.name.set('');
    this.email.set('');
    this.jobTitle.set('');
  }
}
