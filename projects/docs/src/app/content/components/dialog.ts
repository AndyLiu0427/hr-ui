import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'dialog',
  title: 'Dialog',
  description: 'A modal window for one focused task or decision, such as approving a pay run or adding an employee.',
  imports: ['ButtonComponent', 'DialogComponent', 'DialogHeaderComponent', 'DialogContentComponent', 'DialogFooterComponent'],
  usage: `<oct-button (buttonClick)="open.set(true)">Review pay run</oct-button>

<oct-dialog [isOpen]="open()" (dialogClose)="open.set(false)">
  <oct-dialog-header>Approve the October pay run?</oct-dialog-header>
  <oct-dialog-content>48 employees will be paid on 31 October.</oct-dialog-content>
  <oct-dialog-footer>
    <oct-button (buttonClick)="open.set(false)">Approve</oct-button>
  </oct-dialog-footer>
</oct-dialog>`,
  examples: [
    { name: 'dialog-demo' },
    {
      name: 'dialog-form',
      title: 'With a form',
      description: 'Wrap the parts in a form, so Enter in a field submits it. The submit button stays disabled until the required fields are filled.'
    },
    {
      name: 'dialog-sizes',
      title: 'Sizes',
      description: 'md is the default. On a phone every size fills the screen width. For another width, set size="custom" and maxWidth.'
    },
    {
      name: 'dialog-persistent',
      title: 'Persistent',
      description: 'A persistent dialog closes only from its own buttons. Clicking outside or pressing Escape shakes it, so work in progress is not lost by accident.'
    },
    {
      name: 'dialog-scroll',
      title: 'Long content',
      description: 'Set maxHeight when the content can be taller than the screen. The content scrolls and the header and footer stay in view.'
    },
    {
      name: 'dialog-confirm',
      title: 'Confirm with PopupService',
      description: 'confirm() and confirmDanger() open a ready-made dialog and resolve to true when the user confirms. Use confirmDanger() when the action cannot be undone.',
      compact: true
    },
    {
      name: 'dialog-alerts',
      title: 'Alerts with PopupService',
      description: 'success(), error(), warning() and info() show a message with one OK button. The promise resolves when the dialog closes.',
      compact: true
    }
  ],
  keyboard: [
    { keys: ['Esc'], action: 'Closes the dialog, unless it is persistent.' },
    { keys: ['Tab'], action: 'Moves to the next control in the dialog. From the last control it wraps to the first.' },
    { keys: ['Shift', 'Tab'], action: 'Moves to the previous control in the dialog. From the first control it wraps to the last.' }
  ],
  accessibility: [
    'The dialog has role="dialog" and aria-modal="true". Opening it moves focus to its first control, and Tab cannot leave it. When isOpen becomes false, focus goes back to the element that opened it.',
    'The close button is named "Close dialog". Set closeLabel when closing means something else, as the persistent example does with "Stop import".'
  ],
  api: ['DialogComponent', 'DialogHeaderComponent', 'DialogContentComponent', 'DialogFooterComponent', 'PopupService']
};
