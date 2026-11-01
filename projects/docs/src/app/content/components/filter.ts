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
    { keys: ['Enter'], action: 'On the filter button, opens or closes the menu. On an option, picks it or clears it.' },
    { keys: ['Space'], action: 'Same as Enter.' },
    { keys: ['↓'], action: 'In the menu, moves from the search box to the options, and down the options.' },
    { keys: ['↑'], action: 'In the menu, moves up the options, then to the search box.' },
    { keys: ['Tab'], action: 'Moves through Clear, the search box and the options. Past the last one, closes the menu.' },
    { keys: ['Esc'], action: 'Closes the menu and puts focus back on the filter button.' }
  ],
  accessibility: [
    'The button is named after label, with the count of selected values, as in "Department filter, 2 selected". It has aria-haspopup and aria-expanded.',
    'The menu has role="menu", and each option is a menuitemcheckbox whose aria-checked follows the selection.',
    'When the menu opens, focus moves to the search box, or to the first option when there is no search box. On a phone the menu opens as a bottom sheet instead.'
  ],
  api: ['FilterComponent']
};
