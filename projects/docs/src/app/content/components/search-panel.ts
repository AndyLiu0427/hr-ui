import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'search-panel',
  title: 'Search panel',
  description: 'A command palette for finding employees, pages or actions from the keyboard. You filter the items; it shows them and handles the keys.',
  imports: ['SearchPanelComponent', 'SearchPanelRowDirective'],
  usage: `<oct-search-panel ariaLabel="Search commands" [isOpen]="open()" [items]="results()" [(query)]="query" (dialogClose)="open.set(false)">
  <ng-template octSearchPanelRow let-command>{{ command.label }}</ng-template>
</oct-search-panel>`,
  examples: [
    { name: 'search-panel-demo', compact: true },
    {
      name: 'search-panel-empty',
      title: 'Empty state',
      description: 'Without a group, items form one flat list. An octSearchPanelEmpty template shows when there are no items. Its context is the query.',
      compact: true
    },
    {
      name: 'search-panel-loading',
      title: 'Loading results',
      description: 'For a search that calls an API, listen to queryChange, fetch, and set loading while the request runs.',
      compact: true
    }
  ],
  keyboard: [
    { keys: ['↓'], action: 'Highlights the next result. From the last result it wraps to the first.' },
    { keys: ['↑'], action: 'Highlights the previous result. From the first result it wraps to the last.' },
    { keys: ['Enter'], action: 'Selects the highlighted result and closes the panel.' },
    { keys: ['Tab'], action: 'Moves focus to a control in the empty state, such as Clear search.' },
    { keys: ['Esc'], action: 'Closes the panel.' }
  ],
  accessibility: [
    'The query box is a combobox. Focus stays in it while the arrow keys move aria-activedescendant through the results, which are options in a listbox.',
    'A status region announces the number of results, or that a search is running. ariaLabel is required: it names the dialog, the query box and the list.'
  ],
  api: ['SearchPanelComponent', 'SearchPanelRowDirective', 'SearchPanelEmptyDirective', 'HighlightPipe']
};
