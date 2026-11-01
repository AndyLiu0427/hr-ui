import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'radio',
  title: 'Radio',
  description: 'Lets the user pick exactly one option from a short list that is always visible, such as a pay frequency.',
  imports: ['RadioComponent'],
  usage: `<oct-radio
  name="pay-frequency"
  label="Monthly"
  [checked]="frequency() === 'monthly'"
  (radioChange)="frequency.set('monthly')"
/>`,
  examples: [
    { name: 'radio-demo' },
    { name: 'radio-description', title: 'With a description', description: 'A description explains each option under its label.' },
    { name: 'radio-disabled', title: 'Disabled', description: 'A disabled option stays visible, so the user knows it exists. Say in the label why it cannot be picked.' },
    { name: 'radio-table', title: 'In a table', description: 'Without a visible label, set ariaLabel. Name the row, not just the action.' }
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves focus into the group, to the checked radio.' },
    { keys: ['ArrowDown'], action: 'Checks the next radio in the group.' },
    { keys: ['ArrowUp'], action: 'Checks the previous radio in the group.' },
    { keys: ['Space'], action: 'Checks the focused radio.' }
  ],
  accessibility: [
    'Each radio is a native <input type="radio"> inside its <label>. The browser handles focus and arrow keys for radios that share a name.',
    'The radio does not track the group for you. Keep the value in a signal, bind checked, and set the value on radioChange.',
    'Wrap the group in a fieldset with a legend, so screen readers read the question with each option.'
  ],
  api: ['RadioComponent']
};
