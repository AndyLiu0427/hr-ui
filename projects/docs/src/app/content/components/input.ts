import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'input',
  title: 'Input',
  description: 'Lets the user enter one line of text, such as a name, an email address, an amount or a date.',
  imports: ['InputComponent'],
  usage: `<oct-input label="Work email" type="email" [(value)]="email" />`,
  examples: [
    { name: 'input-demo' },
    { name: 'input-signal-forms', title: 'With signal forms', description: 'Bind a field with [formField]. Errors show after the user leaves the field or submits the form.', align: 'start' },
    { name: 'input-adornments', title: 'Prefix and suffix', description: 'Put an icon or a short unit inside the field with leftIcon, leftText or rightText.' },
    { name: 'input-password', title: 'Password', description: 'showPasswordToggle adds a button that shows and hides the password.', compact: true },
    { name: 'input-clearable', title: 'Clearable', description: 'clearable adds an X once the field has a value. Chrome and Safari show no clear button on a date field.', compact: true },
    { name: 'input-states', title: 'Error, disabled, read-only and loading', description: 'A loading field is read-only until the work finishes.', align: 'start' }
  ],
  accessibility: [
    'The label is a native <label> linked to the input. A required field sets aria-required, and a field in the error state sets aria-invalid.',
    'The input points at the helper or error text under it with aria-describedby, so screen readers read that text. Set ariaDescribedBy only to choose its id.',
    'Without a visible label, set ariaLabel. The placeholder is the fallback name, but it disappears when the user types.'
  ],
  api: ['InputComponent']
};
