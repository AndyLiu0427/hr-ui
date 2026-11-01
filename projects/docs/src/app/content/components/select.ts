import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'select',
  title: 'Select',
  description: 'Lets the user pick one option, or several, from a short list such as departments, leave types or pay groups.',
  imports: ['SelectComponent', 'SelectOption'],
  usage: `<oct-select label="Department" [options]="departments" [(value)]="department" />`,
  examples: [
    { name: 'select-demo' },
    { name: 'select-signal-forms', title: 'With signal forms', description: 'Bind the field with [formField]. The error shows after the list closes or the form is submitted.', align: 'start' },
    { name: 'select-multiple', title: 'Multiple', description: 'With multiple, the value is an array and the list stays open between picks. maxDisplay caps the badges, and a +N badge counts the rest.' },
    { name: 'select-descriptions', title: 'Descriptions and disabled options', description: 'A description adds a second line. A disabled option stays in the list, but nobody can pick it.' },
    { name: 'select-color-tags', title: 'Color tags', description: 'A colorTag marks an option in the list and on the closed select. Keep the label meaningful, because colour alone is not enough.' },
    { name: 'select-clearable', title: 'Clearable', description: 'clearable adds an X that sets the value back to null.', compact: true },
    { name: 'select-sizes', title: 'Sizes' },
    { name: 'select-states', title: 'Error, disabled and loading', align: 'start' }
  ],
  keyboard: [
    { keys: ['Enter'], action: 'Opens the list. In the list, picks the highlighted option.' },
    { keys: ['Space'], action: 'Opens the list. In the list, picks the highlighted option.' },
    { keys: ['ArrowDown'], action: 'Opens the list, or moves the highlight down.' },
    { keys: ['ArrowUp'], action: 'Opens the list, or moves the highlight up.' },
    { keys: ['Home'], action: 'Highlights the first option. In multiple mode, highlights Select All.' },
    { keys: ['End'], action: 'Highlights the last option.' },
    { keys: ['A–Z'], action: 'Highlights the next option whose label starts with the typed letters.' },
    { keys: ['Escape'], action: 'Closes the list.' },
    { keys: ['Tab'], action: 'Closes the list and moves focus on.' }
  ],
  accessibility: [
    'The trigger is a native button with role="combobox". It sets aria-expanded, and aria-required and aria-invalid when they apply.',
    'The open list has role="listbox". The trigger keeps focus, and aria-activedescendant names the highlighted option.',
    'The label is linked to the trigger. Without a visible label, set ariaLabel, or the select is announced by its placeholder.'
  ],
  api: ['SelectComponent']
};
