import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
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
      @if (text()) {
        <span [class]="textClasses()">{{ text() }}</span>
      }
      @if (dismissible()) {
        <oct-icon name="X" [size]="iconSize()" class="cursor-pointer hover:opacity-70 transition-opacity duration-200" (click)="onDismiss($event)" />
      }
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent]
})
export class BadgeComponent {
  readonly text = input<string>('Badge text');
  readonly icon = input<string>();
  readonly size = input<BadgeSize>('sm');
  readonly mode = input<BadgeMode>('opacity');
  readonly color = input<BadgeColor>('neutral');
  readonly dismissible = input<boolean>(false);

  readonly dismiss = output<void>();

  readonly badgeClasses = computed(() => {
    const baseClasses = ['inline-flex', 'items-center', 'justify-center', 'font-medium', 'rounded-full', 'transition-all', 'duration-300'];

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
        success: ['bg-hr-green-600', 'text-hr-neutral-950'],
        warning: ['bg-hr-orange-600', 'text-hr-neutral-950'],
        error: ['bg-hr-red-600', 'text-hr-neutral-950'],
        info: ['bg-hr-blue-600', 'text-hr-neutral-950']
      };
      return solidColors[this.color()] || solidColors['neutral'];
    } else {
      const opacityColors: Record<BadgeColor, string[]> = {
        neutral: ['bg-hr-neutral-900', 'text-1'],
        success: ['bg-hr-green-950', 'text-hr-green-600'],
        warning: ['bg-hr-orange-950', 'text-hr-orange-600'],
        error: ['bg-hr-red-950', 'text-hr-red-600'],
        info: ['bg-hr-blue-950', 'text-hr-blue-600']
      };
      return opacityColors[this.color()] || opacityColors['neutral'];
    }
  }
}
