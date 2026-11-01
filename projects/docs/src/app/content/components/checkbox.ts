import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'checkbox',
  title: 'Checkbox',
  description: 'Lets the user turn one option on or off, or pick any number of options from a list.',
  imports: ['CheckboxComponent'],
  usage: `<oct-checkbox label="Email payslips to employees" [(checked)]="emailPayslips" />`,
  examples: [
    { name: 'checkbox-demo', compact: true },
    { name: 'checkbox-description', title: 'With a description', description: 'A description explains what the option does, under the label.', compact: true },
    { name: 'checkbox-group', title: 'Group', description: 'Wrap related checkboxes in a fieldset, and name the group with a legend.' },
    { name: 'checkbox-signal-forms', title: 'With signal forms', description: 'Bind [formField] to a boolean field. A required checkbox must be checked, and its error shows on submit or blur.', align: 'start', compact: true },
    { name: 'checkbox-disabled', title: 'Disabled', compact: true }
  ],
  keyboard: [{ keys: ['Space'], action: 'Checks or unchecks the focused checkbox.' }],
  accessibility: [
    'The checkbox is a native <input type="checkbox"> inside its <label>, so a click on the text toggles it and screen readers read the label.',
    'For a group, add a fieldset and a legend. Screen readers then read the group name with each option.'
  ],
  api: ['CheckboxComponent']
};
