import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'chip',
  title: 'Chip',
  description: 'Shows a value the user added, such as a skill or an applied filter, and lets them remove it.',
  imports: ['ChipComponent'],
  usage: `<oct-chip
  label="Payroll"
  removable
  (remove)="removeSkill('Payroll')"
/>`,
  examples: [
    { name: 'chip-demo', compact: true },
    { name: 'chip-variants', title: 'Variants', description: 'Soft is the default. Outline is quieter, and solid stands out the most.', compact: true },
    { name: 'chip-colors', title: 'Colors', compact: true },
    { name: 'chip-sizes', title: 'Sizes', compact: true },
    { name: 'chip-icons', title: 'With an icon', compact: true }
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves focus to the remove button of the next chip.' },
    { keys: ['Enter'], action: 'Removes the chip whose button has focus.' },
    { keys: ['Space'], action: 'Same as Enter.' }
  ],
  accessibility: [
    'With removable, the chip adds a native <button> named "Remove" and the label, such as "Remove Payroll", so screen reader users can tell the buttons apart. The text comes from the i18n files. Set removeAriaLabel to replace it.',
    'The remove button stops its click from reaching parent elements, so a chip inside a clickable row does not also open the row.'
  ],
  api: ['ChipComponent']
};
