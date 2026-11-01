import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'file-input',
  title: 'File input',
  description: 'Lets the user pick files to upload, such as a company logo with a preview, or timesheets from a button.',
  imports: ['FileInputComponent'],
  usage: `<oct-file-input accept="image/png,image/jpeg" (filesSelected)="upload($event[0])" />`,
  examples: [
    { name: 'file-input-demo' },
    { name: 'file-input-button', title: 'As a button', description: 'mode="button" shows only a button, with your text as its label. It skips the preview and the type and size checks.' },
    { name: 'file-input-icon-only', title: 'Icon only', description: 'For a tight row, set iconOnly. An icon-only button needs ariaLabel.', compact: true },
    { name: 'file-input-validation', title: 'File type and size', description: 'In preview mode, a file of another type or over maxFileSize is rejected, and the error shows under the button. List exact MIME types in accept, and word the messages with labels.' },
    { name: 'file-input-states', title: 'Loading and disabled', description: 'A loading button shows a spinner and ignores clicks until the upload finishes.', compact: true }
  ],
  keyboard: [
    { keys: ['Enter'], action: 'Opens the file picker from the button, or from the empty preview area.' },
    { keys: ['Space'], action: 'Opens the file picker from the button, or from the empty preview area.' }
  ],
  accessibility: [
    'The picker opens from a native button. In preview mode, the empty preview area is a second button with the same name.',
    'Errors from the type and size checks have role="alert", so screen readers announce them at once.'
  ],
  api: ['FileInputComponent']
};
