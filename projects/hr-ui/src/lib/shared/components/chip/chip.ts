import {
  Component,
  ChangeDetectionStrategy,
  booleanAttribute,
  input,
  output,
  computed
} from '@angular/core';
import { IconComponent, IconSize, OctIconName } from '../icon/icon';

export type ChipVariant = 'soft' | 'outline' | 'solid';
export type ChipColor = 'neutral' | 'success' | 'warning' | 'error' | 'info';
export type ChipSize = 'sm' | 'md';

/**
 * Chip
 *
 * A pill that represents a discrete, user-managed value — a filename keyword, a
 * filter, a selected tag. A shared base with `variant` × `color` style maps (same system as `oct-badge`).
 *
 * Chip vs Badge: a badge *labels* something the user cannot act on (status,
 * count, "Required"); a chip is a *value the user put there* and can usually
 * take away — hence `removable` + `(remove)`. Reach for `oct-badge` when there
 * is nothing to remove.
 *
 * The remove affordance is a plain `<button>` (not `oct-button`) so it can sit
 * flush inside the pill and inherit the chip's own color.
 *
 * @example
 * <oct-chip>INV REQ</oct-chip>
 * <oct-chip [label]="kw" removable (remove)="removeKeyword(i)" />
 * <oct-chip color="error" variant="outline" size="md" icon="Tag">urgent</oct-chip>
 */
@Component({
  selector: 'oct-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <span [class]="chipClasses()">
      @if (icon()) {
        <oct-icon [name]="icon()!" [size]="iconSize()" />
      }
      @if (label() != null) {
        {{ label() }}
      } @else {
        <ng-content />
      }
      @if (removable()) {
        <button
          type="button"
          [class]="removeClasses()"
          [attr.aria-label]="removeAriaLabel()"
          (click)="onRemove($event)">
          <oct-icon name="X" [size]="iconSize()" />
        </button>
      }
    </span>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        max-width: 100%;
      }
    `
  ]
})
export class ChipComponent {
  /** Chip text; omit to project content instead (`<oct-chip>text</oct-chip>`). */
  readonly label = input<string>();
  /** Optional leading icon. */
  readonly icon = input<OctIconName>();
  readonly variant = input<ChipVariant>('soft');
  readonly color = input<ChipColor>('neutral');
  readonly size = input<ChipSize>('sm');
  /** Show the trailing X that emits `(remove)`. Bare attribute works: `removable`. */
  readonly removable = input(false, { transform: booleanAttribute });
  /** Accessible name for the remove button — pass a translated string. */
  readonly removeAriaLabel = input<string>('Remove');

  /** Emitted when the remove button is clicked (propagation is stopped). */
  readonly remove = output<void>();

  private static readonly BASE = [
    'inline-flex',
    'items-center',
    'min-w-0',
    'font-medium',
    'rounded-full',
    'transition-colors'
  ];

  /** Padding differs when the X is present: the pill hugs the button on the right. */
  private static readonly SIZE: Record<ChipSize, { base: string[]; plain: string[]; removable: string[] }> = {
    sm: {
      base: ['gap-1', 'py-1', 'text-xs', 'leading-4'],
      plain: ['px-2.5'],
      removable: ['pl-3', 'pr-1']
    },
    md: {
      base: ['gap-1.5', 'py-1.5', 'text-sm', 'leading-5'],
      plain: ['px-3'],
      removable: ['pl-3.5', 'pr-1.5']
    }
  };

  private static readonly ICON_SIZE: Record<ChipSize, IconSize> = {
    sm: 'xs',
    md: 'sm'
  };

  // Filled: strong background, white text.
  private static readonly SOLID: Record<ChipColor, string[]> = {
    neutral: ['bg-hr-neutral-100', 'text-hr-neutral-950'],
    success: ['bg-success-solid', 'text-white'],
    warning: ['bg-warning-solid', 'text-white'],
    error: ['bg-error-solid', 'text-white'],
    info: ['bg-info-solid', 'text-white']
  };

  // Soft: tinted background, deep text, hairline ring. The default.
  private static readonly SOFT: Record<ChipColor, string[]> = {
    neutral: ['bg-hr-neutral-900', 'text-hr-neutral-300', 'ring-1', 'ring-inset', 'ring-hr-neutral-500/10'],
    success: ['bg-hr-green-900', 'text-hr-green-200', 'ring-1', 'ring-inset', 'ring-hr-green-400/10'],
    warning: ['bg-hr-orange-900', 'text-hr-orange-200', 'ring-1', 'ring-inset', 'ring-hr-orange-400/10'],
    error: ['bg-hr-red-900', 'text-hr-red-200', 'ring-1', 'ring-inset', 'ring-hr-red-400/10'],
    info: ['bg-hr-blue-900', 'text-hr-blue-200', 'ring-1', 'ring-inset', 'ring-hr-blue-400/10']
  };

  // Outline: transparent background, colored text + ring.
  private static readonly OUTLINE: Record<ChipColor, string[]> = {
    neutral: ['text-hr-neutral-300', 'ring-1', 'ring-inset', 'ring-hr-neutral-700'],
    success: ['text-hr-green-300', 'ring-1', 'ring-inset', 'ring-hr-green-700'],
    warning: ['text-hr-orange-300', 'ring-1', 'ring-inset', 'ring-hr-orange-700'],
    error: ['text-hr-red-300', 'ring-1', 'ring-inset', 'ring-hr-red-700'],
    info: ['text-hr-blue-300', 'ring-1', 'ring-inset', 'ring-hr-blue-700']
  };

  private static readonly VARIANT: Record<ChipVariant, Record<ChipColor, string[]>> = {
    solid: ChipComponent.SOLID,
    soft: ChipComponent.SOFT,
    outline: ChipComponent.OUTLINE
  };

  /** The X inherits the chip's text color; only its hover wash differs per variant. */
  private static readonly REMOVE_HOVER: Record<ChipVariant, string[]> = {
    solid: ['hover:bg-white/20', 'focus-visible:outline-white/70'],
    soft: ['hover:bg-black/10', 'focus-visible:outline-hr-neutral-500'],
    outline: ['hover:bg-black/5', 'focus-visible:outline-hr-neutral-500']
  };

  private static readonly REMOVE_BASE = [
    'inline-flex',
    'items-center',
    'justify-center',
    'shrink-0',
    'rounded-full',
    'p-1',
    'opacity-70',
    'transition',
    'cursor-pointer',
    'hover:opacity-100',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-1',
    'focus:outline-none'
  ];

  readonly iconSize = computed<IconSize>(() => ChipComponent.ICON_SIZE[this.size()]);

  readonly chipClasses = computed(() => {
    const size = ChipComponent.SIZE[this.size()];
    return [
      ...ChipComponent.BASE,
      ...size.base,
      ...(this.removable() ? size.removable : size.plain),
      ...ChipComponent.VARIANT[this.variant()][this.color()]
    ].join(' ');
  });

  readonly removeClasses = computed(() =>
    [...ChipComponent.REMOVE_BASE, ...ChipComponent.REMOVE_HOVER[this.variant()]].join(' ')
  );

  /** Chips often sit inside clickable rows — never let the X trigger the row. */
  onRemove(event: Event): void {
    event.stopPropagation();
    this.remove.emit();
  }
}
