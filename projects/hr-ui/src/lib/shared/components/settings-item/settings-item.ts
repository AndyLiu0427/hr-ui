import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { IconComponent } from '../icon/icon';
import { TextComponent, type TextColor, type TextWeight } from '../text/text';

/**
 * A rounded panel that groups settings rows.
 *
 * @example
 * ```html
 * <oct-settings-group>
 *   <oct-settings-item icon="Moon" label="Dark Mode" (itemClick)="toggle()" />
 *   <oct-settings-item icon="Globe" label="Language" />
 * </oct-settings-group>
 * ```
 */
@Component({
  selector: 'oct-settings-group',
  host: { class: 'block bg-hr-neutral-900 rounded-2xl overflow-hidden' },
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsGroupComponent {}

export type SettingsItemColor = 'neutral' | 'error';

/**
 * A settings row: a button with an icon, a label and an optional chevron.
 *
 * @example
 * ```html
 * <oct-settings-item icon="Moon" label="Dark Mode" (itemClick)="toggle()" />
 * <oct-settings-item icon="LogOut" label="Log Out" color="error" [showChevron]="false" (itemClick)="logout()" />
 * ```
 */
@Component({
  selector: 'oct-settings-item',
  host: { class: 'contents' },
  template: `
    <button type="button" (click)="itemClick.emit($event)" [class]="buttonClasses()">
      <div [class]="iconContainerClasses()">
        <oct-icon [name]="icon()" size="sm" />
      </div>
      <oct-text [color]="textColor()" variant="md" [weight]="textWeight()" class="flex-1 text-left">{{ label() }}</oct-text>
      @if (showChevron()) {
        <oct-icon name="ChevronRight" size="xs" class="text-hr-neutral-500" />
      }
    </button>
  `,
  imports: [IconComponent, TextComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsItemComponent {
  /** The icon name, shown in a rounded square before the label. */
  readonly icon = input.required<string>();
  /** The row text, which is also its accessible name. */
  readonly label = input.required<string>();
  /** 'error' colours the row red, for an action that deletes data. */
  readonly color = input<SettingsItemColor>('neutral');
  /** Shows a chevron at the end, for a row that opens another screen. */
  readonly showChevron = input(true);

  /** Emits the click event when the user presses the row. */
  readonly itemClick = output<Event>();

  readonly buttonClasses = computed(() => {
    const base = 'flex items-center gap-3 w-full px-4 py-4 transition-colors';
    const hover = this.color() === 'error' ? 'hover:bg-error-900' : 'hover:bg-hr-neutral-800';
    return `${base} ${hover}`;
  });

  readonly iconContainerClasses = computed(() => {
    const base = 'flex items-center justify-center w-9 h-9 rounded-xl';
    const isError = this.color() === 'error';
    return `${base} ${isError ? 'bg-hr-red-900 text-error' : 'bg-hr-neutral-800 text-hr-neutral-400'}`;
  });

  readonly textColor = computed<TextColor>(() => (this.color() === 'error' ? 'error' : '1'));
  readonly textWeight = computed<TextWeight>(() => (this.color() === 'error' ? 'medium' : 'regular'));
}
