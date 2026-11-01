import { Component, signal } from '@angular/core';
import { ButtonComponent, DropdownMenuComponent, MenuSection } from 'ngx-hr-ui';

@Component({
  selector: 'example-dropdown-menu-disabled',
  imports: [ButtonComponent, DropdownMenuComponent],
  template: `
    <oct-dropdown-menu [isOpen]="open()" [menuSections]="sections" (closed)="open.set(false)">
      <oct-button variant="outline" color="neutral" icon="ChevronDown" iconPosition="right" (buttonClick)="open.set(!open())">
        October pay run
      </oct-button>
    </oct-dropdown-menu>
  `
})
export default class DropdownMenuDisabled {
  readonly open = signal(false);
  // Payslips can only be sent after the run is approved.
  readonly sections: MenuSection[] = [
    {
      items: [
        { icon: 'Eye', label: 'Preview payslips' },
        { icon: 'CircleCheck', label: 'Approve pay run' },
        { icon: 'Send', label: 'Send payslips', disabled: true }
      ]
    }
  ];
}
