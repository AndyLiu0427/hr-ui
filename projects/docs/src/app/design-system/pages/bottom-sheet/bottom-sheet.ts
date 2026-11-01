import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { BottomSheetComponent } from 'hr-ui';
import { ButtonComponent } from 'hr-ui';
import { CardComponent, CardContentComponent } from 'hr-ui';
import { TextComponent } from 'hr-ui';
import { IconComponent } from 'hr-ui';

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
