import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'search-select',
  title: 'Search select',
  description: 'Lets the user search a long list and pick from it, such as an employee from the directory. Options can come from your API.',
  imports: ['SearchSelectComponent', 'SearchSelectOption'],
  usage: `<oct-search-select label="Reporting manager" [options]="employees" [(value)]="managerId" />`,
  examples: [
    { name: 'search-select-demo' },
    { name: 'search-select-signal-forms', title: 'With signal forms', description: 'Bind the field with [formField]. The error shows after the list closes or the form is submitted.', align: 'start' },
    { name: 'search-select-async', title: 'Search on the server', description: 'searchConfig calls your API as the user types. preloadConfig is optional: it loads the options shown before they type.' },
    { name: 'search-select-multiple', title: 'Multiple', description: 'With multiple, the value is an array and the list stays open between picks. The field shows how many are selected.' },
    { name: 'search-select-badges', title: 'Badges', description: 'A badge flags something about an option, such as a colleague who is on leave.' },
    { name: 'search-select-states', title: 'Error and disabled', align: 'start' }
  ],
  keyboard: [
    { keys: ['Enter'], action: 'Opens the list and moves focus to the search box. In the list, picks the highlighted option.' },
    { keys: ['Space'], action: 'Opens the list and moves focus to the search box.' },
    { keys: ['ArrowDown'], action: 'Opens the list, or moves the highlight down.' },
    { keys: ['ArrowUp'], action: 'Opens the list, or moves the highlight up.' },
    { keys: ['Home'], action: 'Highlights the first option.' },
    { keys: ['End'], action: 'Highlights the last option.' },
    { keys: ['Escape'], action: 'Closes the list and puts focus back on the field.' },
    { keys: ['Tab'], action: 'Closes the list and moves focus on.' }
  ],
  accessibility: [
    'The field has role="combobox" and sets aria-expanded. The open list has role="listbox", and its search box is labelled "Search options".',
    'While the list is open, focus is in the search box, and its aria-activedescendant names the highlighted option. Picking an option puts focus back on the field.',
    'The label is linked to the field. Without a visible label, the placeholder becomes its accessible name, so write a placeholder that names the field.'
  ],
  api: ['SearchSelectComponent']
};
