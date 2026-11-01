import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent, IconSize } from '../icon/icon';

export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeMode = 'solid' | 'opacity';
export type BadgeColor = 'neutral' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps {
  text?: string;
  icon?: string;
  size?: BadgeSize;
  mode?: BadgeMode;
  color?: BadgeColor;
  dismissible?: boolean;
}

/** A small label for a status or attribute that people cannot change, such as Approved or Full-time. */
@Component({
  selector: 'oct-badge',
  host: {
    class: 'contents'
  },
  template: `
    <span [class]="badgeClasses()">
      @if (icon()) {
        <oct-icon [name]="icon()!" [size]="iconSize()" />
      }
      <!-- text, or the content between the tags, as in <oct-badge>Approved</oct-badge>. -->
      <span [class]="textClasses()">
        @if (text()) {
          {{ text() }}
        } @else {
          <ng-content />
        }
      </span>
      @if (dismissible()) {
        <!-- p-1.5 makes the hit area 24px or more; -m-1.5 gives the space back, so the badge keeps its size. -->
        <button
          type="button"
          class="-m-1.5 inline-flex shrink-0 items-center justify-center rounded-full p-1.5 cursor-pointer hover:opacity-70 transition-opacity duration-150 ease-out oct-focus-ring"
          [attr.aria-label]="'COMMON.REMOVE_LABEL' | translate: { label: text() ?? '' }"
          (click)="onDismiss($event)">
          <oct-icon name="X" [size]="iconSize()" aria-hidden="true" />
        </button>
      }
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, IconComponent]
})
export class BadgeComponent {
  /** The text. You can also put it between the tags: `<oct-badge>Approved</oct-badge>`. */
  readonly text = input<string>();
  /** Icon shown before the text. */
  readonly icon = input<string>();
  /** Size of the badge. */
  readonly size = input<BadgeSize>('sm');
  /** 'opacity' tints the badge; 'solid' fills it, for more emphasis. */
  readonly mode = input<BadgeMode>('opacity');
  /** The meaning of the badge, shown as its colour. */
  readonly color = input<BadgeColor>('neutral');
  /**
   * Shows a close button that emits dismiss. It is named "Remove" and the text input, from the i18n files.
   * For values the user adds and removes, oct-chip is usually the better fit.
   */
  readonly dismissible = input<boolean>(false);

  /** Emits when the close button is clicked. */
  readonly dismiss = output<void>();

  readonly badgeClasses = computed(() => {
    const baseClasses = ['inline-flex', 'items-center', 'justify-center', 'font-medium', 'rounded-full'];

    const sizeClasses: Record<BadgeSize, string[]> = {
      sm: ['px-1.5', 'py-0.5', 'text-xs', 'leading-4'],
      md: ['px-2.5', 'py-1', 'text-xs', 'leading-4'],
      lg: ['px-3', 'py-2', 'text-sm', 'leading-5']
    };

    const gapClasses: Record<BadgeSize, string> = {
      sm: 'gap-1',
      md: 'gap-1',
      lg: 'gap-1.5'
    };

    const colorClasses = this.getColorClasses();
    const currentSize = this.size();

    return [...baseClasses, ...(sizeClasses[currentSize] || sizeClasses['sm']), gapClasses[currentSize] || gapClasses['sm'], ...colorClasses].join(
      ' '
    );
  });

  readonly iconSize = computed((): IconSize => {
    const iconSizeMap: Record<BadgeSize, IconSize> = {
      sm: 'xs',
      md: 'xs',
      lg: 'sm'
    };
    return iconSizeMap[this.size()];
  });

  readonly textClasses = computed(() => {
    const textClasses = ['font-medium', 'text-center', 'whitespace-nowrap'];

    const textSizeClasses: Record<BadgeSize, string[]> = {
      sm: ['text-xs', 'leading-4'],
      md: ['text-xs', 'leading-4'],
      lg: ['text-sm', 'leading-5']
    };

    return [...textClasses, ...textSizeClasses[this.size()]].join(' ');
  });

  onDismiss(event: Event): void {
    event.stopPropagation();
    this.dismiss.emit();
  }

  private getColorClasses(): string[] {
    if (this.mode() === 'solid') {
      const solidColors: Record<BadgeColor, string[]> = {
        neutral: ['bg-hr-neutral-400', 'text-hr-neutral-950'],
        success: ['bg-success-solid', 'text-white'],
        warning: ['bg-warning-solid', 'text-white'],
        error: ['bg-error-solid', 'text-white'],
        info: ['bg-info-solid', 'text-white']
      };
      return solidColors[this.color()] || solidColors['neutral'];
    } else {
      const opacityColors: Record<BadgeColor, string[]> = {
        neutral: ['bg-hr-neutral-900', 'text-1'],
        success: ['bg-hr-green-950', 'text-hr-green-200'],
        warning: ['bg-hr-orange-950', 'text-hr-orange-200'],
        error: ['bg-hr-red-950', 'text-hr-red-200'],
        info: ['bg-hr-blue-950', 'text-hr-blue-200']
      };
      return opacityColors[this.color()] || opacityColors['neutral'];
    }
  }
}
