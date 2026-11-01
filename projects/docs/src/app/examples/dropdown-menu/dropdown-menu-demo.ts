import { Component, signal } from '@angular/core';
import { ButtonComponent, DropdownMenuComponent, MenuItem, MenuSection } from 'ngx-hr-ui';

@Component({
  selector: 'example-dropdown-menu-demo',
  imports: [ButtonComponent, DropdownMenuComponent],
  template: `
    <div class="flex flex-col items-center gap-4">
      <oct-dropdown-menu [isOpen]="open()" [menuSections]="sections" (itemClick)="choose($event)" (closed)="open.set(false)">
        <oct-button variant="outline" color="neutral" icon="ChevronDown" iconPosition="right" (buttonClick)="open.set(!open())">
          Actions
        </oct-button>
      </oct-dropdown-menu>
      <p class="min-h-5 text-sm text-2">{{ chosen() }}</p>
    </div>
  `
})
export default class DropdownMenuDemo {
  readonly open = signal(false);
  readonly chosen = signal('');
  readonly sections: MenuSection[] = [
    {
      items: [
        { icon: 'User', label: 'View profile' },
        { icon: 'Pencil', label: 'Edit details' },
        { icon: 'Send', label: 'Send payslip' }
      ]
    },
    { items: [{ icon: 'UserX', label: 'Deactivate' }] }
  ];

  choose(item: MenuItem): void {
    this.chosen.set(`You chose ${item.label}.`);
  }
}
