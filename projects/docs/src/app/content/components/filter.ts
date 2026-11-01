import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'filter',
  title: 'Filter',
  description: 'Narrows a list to the values people pick from a menu, such as departments or pay run statuses.',
  imports: ['FilterComponent'],
  usage: `<oct-filter
  label="Department"
  [options]="departments"
  [(selectedValues)]="selectedDepartments"
/>`,
  examples: [
    { name: 'filter-demo' },
    { name: 'filter-searchable', title: 'Searchable', description: 'Turn on searchable for long lists. The search box filters the options by label.' },
    { name: 'filter-icon', title: 'With an icon', description: 'The badge on the button counts the selected values.', compact: true },
    { name: 'filter-sizes', title: 'Sizes', compact: true },
    { name: 'filter-disabled-options', title: 'Disabled options', description: 'A disabled option stays in the list but cannot be picked.' },
    { name: 'filter-enum', title: 'From an enum', description: 'enumToFilterOptions turns an enum into options and uses each value as its label.' }
  ],
  keyboard: [
    { keys: ['Enter'], action: 'On the filter button, opens or closes the menu.' },
    { keys: ['Space'], action: 'Same as Enter.' },
    { keys: ['Esc'], action: 'Closes the menu.' }
  ],
  accessibility: [
    'The menu has role="menu", and each option is a menuitemcheckbox whose aria-checked follows the selection. The count badge is part of the button name, as in "Department 2".',
    'Focus stays on the button when the menu opens, and Tab moves past the menu, so the options cannot be reached from the keyboard. On a phone the menu opens as a bottom sheet.'
  ],
  api: ['FilterComponent']
};
