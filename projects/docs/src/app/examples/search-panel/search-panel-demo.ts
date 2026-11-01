import { Component, computed, signal } from '@angular/core';
import { ButtonComponent, HighlightPipe, IconComponent, SearchPanelComponent, SearchPanelItem, SearchPanelRowDirective } from 'ngx-hr-ui';

interface Command extends SearchPanelItem {
  label: string;
  icon: string;
}

// Items with a group are shown under a heading, in the order the groups first appear.
const COMMANDS: Command[] = [
  { id: 'add-employee', label: 'Add employee', icon: 'UserPlus', group: 'Employees' },
  { id: 'import-employees', label: 'Import employees', icon: 'Upload', group: 'Employees' },
  { id: 'run-payroll', label: 'Run payroll', icon: 'Play', group: 'Payroll' },
  { id: 'send-payslips', label: 'Send payslips', icon: 'Send', group: 'Payroll' },
  { id: 'bank-file', label: 'Create bank file', icon: 'Landmark', group: 'Payroll' },
  { id: 'pay-items', label: 'Manage pay items', icon: 'ListPlus', group: 'Settings' }
];

@Component({
  selector: 'example-search-panel-demo',
  imports: [ButtonComponent, HighlightPipe, IconComponent, SearchPanelComponent, SearchPanelRowDirective],
  template: `
    <div class="flex flex-col items-center gap-4">
      <oct-button variant="outline" color="neutral" icon="Search" (buttonClick)="open.set(true)">Search commands</oct-button>
      <p class="min-h-5 text-sm text-2">{{ chosen() }}</p>
    </div>

    <oct-search-panel
      ariaLabel="Search commands"
      placeholder="Type a command"
      [isOpen]="open()"
      [items]="results()"
      [(query)]="query"
      [showHints]="true"
      (itemSelected)="chosen.set('You chose ' + $event.label + '.')"
      (dialogClose)="open.set(false)"
    >
      <ng-template octSearchPanelRow let-command let-query="query">
        <oct-icon [name]="command.icon" size="sm" class="text-2" />
        <span class="flex-1 truncate text-sm text-1" [innerHTML]="command.label | highlight: query"></span>
      </ng-template>
    </oct-search-panel>
  `
})
export default class SearchPanelDemo {
  readonly open = signal(false);
  readonly query = signal('');
  readonly chosen = signal('');
  // The panel never filters: you pass the matching items.
  readonly results = computed(() => COMMANDS.filter(c => c.label.toLowerCase().includes(this.query().trim().toLowerCase())));
}
