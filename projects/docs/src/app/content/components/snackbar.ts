import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'snackbar',
  title: 'Snackbar',
  description: 'A short message about the result of an action, such as payslips sent, shown at the edge of the screen for a few seconds.',
  imports: ['ButtonComponent', 'SnackbarService'],
  usage: `<!-- snackbar = inject(SnackbarService) -->
<oct-button (buttonClick)="snackbar.success('Payslips sent to 48 employees')">Send payslips</oct-button>`,
  examples: [
    { name: 'snackbar-demo', compact: true },
    {
      name: 'snackbar-types',
      title: 'Types',
      description:
        'success() closes itself after 3 seconds and info() after 5. error() and warning() stay until the user closes them. show() without a type gives a neutral snackbar at the bottom.',
      compact: true
    },
    {
      name: 'snackbar-description',
      title: 'With a description',
      description: 'A description adds a second, quieter line for the detail. Clicking a snackbar copies its text, so it can be pasted into a support ticket.',
      compact: true
    },
    {
      name: 'snackbar-action',
      title: 'With an action',
      description: 'Clicking the action runs its handler and closes the snackbar.',
      compact: true
    },
    {
      name: 'snackbar-positions',
      title: 'Positions',
      description: 'Pass position to move a snackbar. Snackbars at the same position stack.',
      compact: true
    },
    { name: 'snackbar-sizes', title: 'Sizes', description: 'md is the default.', compact: true },
    {
      name: 'snackbar-duration',
      title: 'Duration',
      description: 'duration is in milliseconds. 0 keeps the snackbar until it is closed, by the user or by dismiss() on the ref that every method returns.',
      compact: true
    }
  ],
  accessibility: [
    'Snackbars are live regions, so screen readers read them without moving focus. An error snackbar has role="alert" and interrupts.',
    'The close button is named "Dismiss notification". An error stays until it is closed, so there is time to read what to fix.'
  ],
  api: ['SnackbarService', 'SnackbarComponent']
};
