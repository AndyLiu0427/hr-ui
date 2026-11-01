import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Keyboard Key Component
 *
 * Displays keyboard shortcuts/keys with consistent styling using semantic <kbd> element.
 * Used for showing hotkeys like ESC, ⌘K, Enter, arrow keys, etc.
 *
 * @example
 * <oct-kbd>ESC</oct-kbd>
 * <oct-kbd>⌘K</oct-kbd>
 * <oct-kbd variant="secondary">Enter</oct-kbd>
 *
 * @example Multiple keys
 * <div class="flex items-center gap-0.5">
 *   <oct-kbd variant="secondary">↑</oct-kbd>
 *   <oct-kbd variant="secondary">↓</oct-kbd>
 * </div>
 */
@Component({
  selector: 'oct-kbd',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()'
  },
  template: `<kbd class="text-xs text-2 font-sans"><ng-content></ng-content></kbd>`
})
export class KbdComponent {
  /**
   * Background variant
   * - 'tertiary': Lighter background (default, for prominent keys like ESC, ⌘K)
   * - 'secondary': Darker background (for grouped keys like arrows, Enter)
   */
  readonly variant = input<'tertiary' | 'secondary'>('tertiary');

  readonly hostClass = () => {
    const base = 'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-primary';
    const bg = this.variant() === 'secondary' ? 'bg-secondary' : 'bg-tertiary';
    return `${base} ${bg}`;
  };
}
