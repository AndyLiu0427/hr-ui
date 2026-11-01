import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { BottomSheetComponent } from 'ngx-hr-ui';
import { ButtonComponent } from 'ngx-hr-ui';
import { CardComponent, CardContentComponent } from 'ngx-hr-ui';
import { TextComponent } from 'ngx-hr-ui';
import { IconComponent } from 'ngx-hr-ui';

@Component({
  selector: 'oct-bottom-sheet-page',
  templateUrl: './bottom-sheet.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BottomSheetComponent, ButtonComponent, CardComponent, CardContentComponent, TextComponent, IconComponent]
})
export class BottomSheetPageComponent {
  readonly basicOpen = signal(false);
  readonly withFooterOpen = signal(false);
  readonly menuOpen = signal(false);

  readonly menuItems = [
    { key: 'edit', label: 'Edit', icon: 'Pencil' },
    { key: 'duplicate', label: 'Duplicate', icon: 'Copy' },
    { key: 'archive', label: 'Archive', icon: 'Archive' },
    { key: 'delete', label: 'Delete', icon: 'Trash2', destructive: true }
  ];

  readonly lastAction = signal<string>('');

  triggerAction(key: string): void {
    this.lastAction.set(key);
    this.menuOpen.set(false);
  }
}
