import { Component, signal } from '@angular/core';
import { ButtonComponent, DropdownMenuComponent, MenuSection } from 'ngx-hr-ui';

@Component({
  selector: 'example-dropdown-menu-sections',
  imports: [ButtonComponent, DropdownMenuComponent],
  template: `
    <oct-dropdown-menu [isOpen]="open()" [menuSections]="sections" (closed)="open.set(false)">
      <oct-button variant="outline" color="neutral" icon="CircleUser" ariaLabel="Account" (buttonClick)="open.set(!open())" />
    </oct-dropdown-menu>
  `
})
export default class DropdownMenuSections {
  readonly open = signal(false);
  // A divider separates the sections. A header item is bold, and clicking it does not close the menu.
  readonly sections: MenuSection[] = [
    { items: [{ label: 'Amelia Chan', header: true, avatar: { name: 'Amelia Chan', status: 'online' } }] },
    {
      items: [
        { icon: 'User', label: 'My profile' },
        { icon: 'Wallet', label: 'My payslips' },
        { icon: 'CalendarDays', label: 'My leave' }
      ]
    },
    { items: [{ icon: 'LogOut', label: 'Sign out' }] }
  ];
}
