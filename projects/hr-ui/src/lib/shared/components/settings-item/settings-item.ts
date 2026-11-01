import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { IconComponent } from '../icon/icon';
import { TextComponent, type TextColor, type TextWeight } from '../text/text';

/**
 * Settings Group Component
 *
 * Card container for grouping settings items and related content.
 * Provides consistent rounded card styling with overflow clipping.
 *
 * Usage:
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
 * Settings Item Component
 *
 * A list-item style button for settings pages.
 * Renders a leading icon in a styled container, a label, and an optional trailing chevron.
 *
 * Usage:
 * ```html
 * <oct-settings-item icon="Moon" label="Dark Mode" (itemClick)="toggle()" />
 * <oct-settings-item icon="LogOut" label="Log Out" color="error" [showChevron]="false" (itemClick)="logout()" />
 * ```
 */
@Component({
  selector: 'oct-settings-item',
  host: { class: 'contents' },
  template: `
    <button (click)="itemClick.emit($event)" [class]="buttonClasses()">
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
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
  readonly color = input<SettingsItemColor>('neutral');
  readonly showChevron = input(true);

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
