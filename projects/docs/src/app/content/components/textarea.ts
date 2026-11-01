import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'textarea',
  title: 'Textarea',
  description: 'Lets the user write several lines of text, such as a leave reason or review feedback. It grows as they type.',
  imports: ['TextareaComponent'],
  usage: `<oct-textarea label="Reason for leave" [(value)]="reason" />`,
  examples: [
    { name: 'textarea-demo' },
    { name: 'textarea-signal-forms', title: 'With signal forms', description: 'Bind the field with [formField]. The error shows after the user leaves the field or submits the form.', align: 'start' },
    { name: 'textarea-character-count', title: 'Character count', description: 'Bind [(value)] to show how much room is left. maxLength stops typing at the limit.' },
    { name: 'textarea-states', title: 'Read-only and disabled', description: 'A read-only value can still be selected and copied. A disabled one cannot.', align: 'start' }
  ],
  accessibility: [
    'The label is a native <label> linked to the textarea, and the field sets aria-invalid while it shows an error.',
    'Give every textarea a label. The placeholder is not a label, and it disappears when the user types.'
  ],
  api: ['TextareaComponent']
};
