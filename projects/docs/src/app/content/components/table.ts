import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'table',
  title: 'Table',
  description: 'Lists records such as employees or pay runs, with sorting, paging, filters, selection, row actions and inline editing.',
  imports: ['TableComponent', 'TableColumn'],
  usage: `<oct-table [columns]="columns" [data]="employees" />`,
  examples: [
    { name: 'table-demo', align: 'start' },
    {
      name: 'table-sorting',
      title: 'Sorting',
      description: 'Set sortable: true on a column. Click the arrow that appears on hover to sort ascending, descending, then unsorted. defaultSort sets the starting order.',
      align: 'start'
    },
    {
      name: 'table-pagination',
      title: 'Pagination',
      description: 'Pass every row and a pagination config with totalNumPages: 0. The table makes the pages and the page size menu.',
      align: 'start'
    },
    {
      name: 'table-server-pagination',
      title: 'Server-side pagination',
      description: 'With totalNumPages above 0, the table shows data as one page. Load the next page on pageChange and pageSizeChange.',
      align: 'start'
    },
    {
      name: 'table-selection',
      title: 'Row selection',
      description: 'selectionConfig adds a checkbox column. selectionChange emits the selected rows and their keys.',
      align: 'start'
    },
    {
      name: 'table-row-actions',
      title: 'Row actions',
      description: 'rowActions returns the buttons for a row and fills the column with the key actions. On a phone they move into a sheet behind one button.',
      align: 'start'
    },
    {
      name: 'table-status',
      title: 'Status column',
      description: 'A column whose key contains "status" shows each value as a badge. Active, new and approved are green, pending is amber, inactive is red, and other values are grey.',
      align: 'start'
    },
    {
      name: 'table-custom-cells',
      title: 'Custom cells',
      description: 'render returns text, such as a formatted amount. For markup, give the column a template; it gets the row as $implicit.',
      align: 'start'
    },
    {
      name: 'table-filters',
      title: 'Filters',
      description: 'oct-table-filters puts a row of filters above the table. Each filter writes to a signal; filter the rows from those signals.',
      align: 'start'
    },
    {
      name: 'table-inline-edit',
      title: 'Inline editing',
      description: 'An editable column opens an input on click. cellValueChange emits the new value; update your data with it. editable can also be a function, to lock some rows.',
      align: 'start'
    },
    { name: 'table-footer', title: 'Footer', description: 'A #footerTemplate shows a row under the data, such as totals.', align: 'start' },
    {
      name: 'table-fixed-columns',
      title: 'Fixed columns',
      description: 'On a table wider than its box, fixed: true keeps a column in view while the rest scroll sideways.',
      align: 'start'
    },
    { name: 'table-dense', title: 'Dense', description: 'dense reduces the cell padding for long lists. striped shades every other row, and cellLines draws lines between columns.', align: 'start' },
    {
      name: 'table-states',
      title: 'Loading and empty states',
      description: 'loading covers the rows with a spinner. With no rows, the table shows emptyMessage.',
      align: 'start'
    }
  ],
  keyboard: [
    { keys: ['Enter'], action: 'On the header of a sortable column, sorts by it. Press again to change the direction.' },
    { keys: ['Space'], action: 'Selects or clears the row of the focused checkbox.' },
    { keys: ['Enter'], action: 'On a row made clickable with clickableRows, emits rowClick. Space does the same.' },
    { keys: ['Enter'], action: 'On an editable cell, opens it for editing.' },
    { keys: ['Enter'], action: 'While editing, saves the value and puts focus back on the cell. With editAdvanceOnEnter, opens the next editable cell instead.' },
    { keys: ['↑'], action: 'While editing a number, adds editStep.' },
    { keys: ['↓'], action: 'While editing a number, subtracts editStep.' },
    { keys: ['Esc'], action: 'While editing, cancels the change and puts focus back on the cell.' }
  ],
  accessibility: [
    'oct-table renders a native <table> with a header row, so screen readers announce the column of each cell. Row actions are buttons named by their label, and an editable cell is a button that opens an input.',
    'Each selection checkbox has a name that only screen readers get: "Select all rows" in the header, and "Select" with the row\'s first column in a row, as in "Select Arjun Mehta". The header checkbox shows a dash and reads as partly checked while only some rows on the page are selected.',
    'clickableRows makes each row a tab stop with a focus ring. Screen readers announce it as a row, not as a button, so also give the row a keyboard path that says what it does, such as a row action. The loading spinner is not announced.'
  ],
  api: ['TableComponent', 'TableFiltersComponent']
};
