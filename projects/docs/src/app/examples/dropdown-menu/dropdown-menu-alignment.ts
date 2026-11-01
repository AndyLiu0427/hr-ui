import { Component, signal } from '@angular/core';
import { ButtonComponent, DropdownMenuComponent, MenuSection } from 'ngx-hr-ui';

@Component({
  selector: 'example-dropdown-menu-alignment',
  imports: [ButtonComponent, DropdownMenuComponent],
  template: `
    <div class="flex flex-wrap justify-center gap-3">
      <oct-dropdown-menu alignment="left" [isOpen]="leftOpen()" [menuSections]="sections" (closed)="leftOpen.set(false)">
        <oct-button variant="outline" color="neutral" (buttonClick)="leftOpen.set(!leftOpen())">Align left</oct-button>
      </oct-dropdown-menu>
      <oct-dropdown-menu alignment="right" [isOpen]="rightOpen()" [menuSections]="sections" (closed)="rightOpen.set(false)">
        <oct-button variant="outline" color="neutral" (buttonClick)="rightOpen.set(!rightOpen())">Align right</oct-button>
      </oct-dropdown-menu>
    </div>
  `
})
export default class DropdownMenuAlignment {
  readonly leftOpen = signal(false);
  readonly rightOpen = signal(false);
  readonly sections: MenuSection[] = [
    {
      items: [
        { icon: 'FileSpreadsheet', label: 'Export as Excel' },
        { icon: 'FileText', label: 'Export as PDF' }
      ]
    }
  ];
}
