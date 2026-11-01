import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { AvatarComponent } from 'ngx-hr-ui';
import { BadgeComponent } from 'ngx-hr-ui';
import { ButtonComponent } from 'ngx-hr-ui';
import { CardComponent, CardContentComponent } from 'ngx-hr-ui';
import { IconComponent } from 'ngx-hr-ui';
import { SearchPanelComponent } from 'ngx-hr-ui';
import { SearchPanelEmptyDirective, SearchPanelRowDirective } from 'ngx-hr-ui';
import type { SearchPanelItem } from 'ngx-hr-ui';
import { TextComponent } from 'ngx-hr-ui';
import { HighlightPipe } from 'ngx-hr-ui';

interface DemoCommand extends SearchPanelItem {
  name: string;
  hint: string;
  icon: string;
}

interface DemoPerson extends SearchPanelItem {
  name: string;
  team: string;
}

const DEMO_COMMANDS: DemoCommand[] = [
  { id: 'new-employee', name: 'Add employee', hint: 'Create an employee record', icon: 'UserPlus', group: 'Employees' },
  { id: 'import', name: 'Import employees', hint: 'Upload a spreadsheet', icon: 'Upload', group: 'Employees' },
  { id: 'run-payroll', name: 'Run payroll', hint: 'Start a payroll run for the period', icon: 'Play', group: 'Payroll' },
  { id: 'bank-file', name: 'Generate bank file', hint: 'Export a payment instruction file', icon: 'Landmark', group: 'Payroll' },
  { id: 'payslips', name: 'Publish payslips', hint: 'Release payslips to employees', icon: 'FileText', group: 'Payroll' },
  { id: 'billing-rates', name: 'Edit billing rates', hint: 'Client billing configuration', icon: 'Coins', group: 'Settings' },
  { id: 'pay-items', name: 'Manage pay items', hint: 'Allowances and deductions', icon: 'ListPlus', group: 'Settings' }
];

const DEMO_PEOPLE: DemoPerson[] = [
  { id: 'p1', name: 'Amelia Chan', team: 'Finance' },
  { id: 'p2', name: 'Marcus Tan', team: 'Engineering' },
  { id: 'p3', name: 'Priya Nair', team: 'People Ops' },
  { id: 'p4', name: 'Wei Lin Ho', team: 'Finance' }
];

const MIN_PEOPLE_QUERY_LENGTH = 2;
const FAKE_LATENCY_MS = 600;

// Mirrors the worst real case: a short employee query that matches several thousand rows.
const BULK_SIZE = 3600;
const BULK_ITEMS: DemoPerson[] = Array.from({ length: BULK_SIZE }, (_, i) => ({
  id: `bulk-${i}`,
  name: `Employee ${String(i + 1).padStart(4, '0')}`,
  team: `Client Dept ${(i % 40) + 1}`
}));

@Component({
  selector: 'oct-search-panel-page',
  templateUrl: './search-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AvatarComponent,
    BadgeComponent,
    ButtonComponent,
    CardComponent,
    CardContentComponent,
    IconComponent,
    SearchPanelComponent,
    SearchPanelRowDirective,
    SearchPanelEmptyDirective,
    TextComponent,
    HighlightPipe
  ]
})
export class SearchPanelPageComponent {
  readonly MIN_PEOPLE_QUERY_LENGTH = MIN_PEOPLE_QUERY_LENGTH;

  readonly API_ROWS = [
    { name: 'isOpen', type: 'boolean', description: 'Whether the dialog is shown. The host owns the shortcut that sets it.' },
    { name: 'items', type: 'readonly T[]', description: 'Already filtered and ordered. The panel never filters.' },
    { name: 'query', type: 'model<string>', description: 'Two-way, so a projected template can clear it and stay in sync.' },
    { name: 'loading', type: 'boolean', description: 'Renders the spinner instead of the list or empty template.' },
    { name: 'placeholder', type: 'string', description: 'Query box placeholder.' },
    { name: 'ariaLabel', type: 'string', description: 'Names the query box and the listbox for assistive tech.' },
    { name: 'showHints', type: 'boolean', description: 'Renders the ↑↓ / Enter legend under the results.' },
    {
      name: 'maxVisibleItems',
      type: 'number (100)',
      description: 'How many matches to render. The rest are counted and announced, never silently dropped.'
    },
    { name: 'itemSelected', type: 'output<T>', description: 'Emitted on Enter or click. The host decides what selecting means.' },
    { name: 'dialogClose', type: 'output<void>', description: 'Emitted on Esc, backdrop click, or after a selection.' },
    { name: 'searchPanelRow', type: 'ng-template', description: 'Required. Context: item, query, selected.' },
    { name: 'searchPanelEmpty', type: 'ng-template', description: 'Optional. Context: the query, so one slot serves idle and no-results.' }
  ];

  // Grouped, synchronous: the shape the design-system palette uses.
  readonly commandsOpen = signal(false);
  readonly commandQuery = signal('');
  readonly lastCommand = signal<string | null>(null);
  readonly commandResults = computed(() => filterByName(DEMO_COMMANDS, this.commandQuery()));

  // Flat, asynchronous with a minimum query length: the shape the employee search uses.
  readonly peopleOpen = signal(false);
  readonly peopleQuery = signal('');
  readonly peopleLoading = signal(false);
  readonly peopleResults = signal<DemoPerson[]>([]);
  readonly lastPerson = signal<string | null>(null);

  // Stress case: several thousand matches, the shape that made keyboard navigation crawl.
  readonly bulkOpen = signal(false);
  readonly bulkQuery = signal('');
  readonly bulkResults = computed(() => filterByName(BULK_ITEMS, this.bulkQuery()));
  readonly bulkTotal = BULK_SIZE;

  private peopleLookup?: ReturnType<typeof setTimeout>;

  openBulk(): void {
    this.bulkOpen.set(true);
  }

  openCommands(): void {
    this.commandsOpen.set(true);
  }

  onCommandSelected(command: DemoCommand): void {
    this.lastCommand.set(command.name);
  }

  openPeople(): void {
    this.peopleOpen.set(true);
  }

  // Stands in for a debounced API call so the loading and empty states are demonstrable.
  onPeopleQueryChange(query: string): void {
    this.peopleQuery.set(query);
    clearTimeout(this.peopleLookup);

    if (query.length < MIN_PEOPLE_QUERY_LENGTH) {
      this.peopleLoading.set(false);
      this.peopleResults.set([]);
      return;
    }

    this.peopleLoading.set(true);
    this.peopleLookup = setTimeout(() => {
      this.peopleResults.set(filterByName(DEMO_PEOPLE, query));
      this.peopleLoading.set(false);
    }, FAKE_LATENCY_MS);
  }

  onPersonSelected(person: DemoPerson): void {
    this.lastPerson.set(person.name);
  }
}

function filterByName<T extends { name: string }>(items: readonly T[], query: string): T[] {
  const needle = query.trim().toLowerCase();

  return needle ? items.filter(item => item.name.toLowerCase().includes(needle)) : [...items];
}
