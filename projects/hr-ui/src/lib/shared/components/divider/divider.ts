import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { TextComponent } from '../text/text';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';
export type DividerColor = 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'error';
export type DividerTextPosition = 'start' | 'center' | 'end';

export interface DividerProps {
  orientation?: DividerOrientation;
  variant?: DividerVariant;
  color?: DividerColor;
  text?: string;
  textPosition?: DividerTextPosition;
  spacing?: 'sm' | 'md' | 'lg';
}

@Component({
  selector: 'oct-divider',
  imports: [TextComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    role: 'separator',
    '[attr.aria-orientation]': 'orientation()'
  },
  template: `
    @if (text() && orientation() === 'horizontal') {
      <div [class]="containerClasses()">
        <div [class]="lineClasses()"></div>
        <oct-text color="3" variant="sm" weight="medium" class="px-3 whitespace-nowrap">
          {{ text() }}
        </oct-text>
        <div [class]="lineClasses()"></div>
      </div>
    } @else {
      <div [class]="lineClasses()"></div>
    }
  `
})
export class DividerComponent {
  readonly orientation = input<DividerOrientation>('horizontal');
  readonly variant = input<DividerVariant>('solid');
  readonly color = input<DividerColor>('neutral');
  readonly text = input<string>('');
  readonly textPosition = input<DividerTextPosition>('center');
  readonly spacing = input<'sm' | 'md' | 'lg'>('md');

  readonly hostClasses = computed(() => {
    const classes: string[] = ['block'];

    // Spacing based on orientation
    if (this.orientation() === 'horizontal') {
      const spacingMap = {
        sm: 'my-2',
        md: 'my-4',
        lg: 'my-6'
      };
      classes.push(spacingMap[this.spacing()]);
    } else {
      const spacingMap = {
        sm: 'mx-2',
        md: 'mx-4',
        lg: 'mx-6'
      };
      classes.push(spacingMap[this.spacing()]);
      classes.push('h-full', 'inline-block');
    }

    return classes.join(' ');
  });

  readonly containerClasses = computed(() => {
    const classes: string[] = ['flex', 'items-center', 'w-full'];

    // Text position affects flex layout
    const positionMap = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end'
    };
    classes.push(positionMap[this.textPosition()]);

    return classes.join(' ');
  });

  readonly lineClasses = computed(() => {
    const classes: string[] = [];

    // Orientation-based sizing
    if (this.orientation() === 'horizontal') {
      classes.push('h-px', 'flex-1');
    } else {
      classes.push('w-px', 'h-full', 'min-h-[20px]');
    }

    // Border style (variant)
    const variantMap = {
      solid: '',
      dashed: 'border-dashed',
      dotted: 'border-dotted'
    };

    if (this.variant() === 'solid') {
      // Use background color for solid lines
      const colorMap = {
        primary: 'bg-primary-500',
        secondary: 'bg-secondary',
        neutral: 'bg-neutral-700',
        success: 'bg-green-500',
        warning: 'bg-orange-500',
        error: 'bg-red-500'
      };
      classes.push(colorMap[this.color()]);
    } else {
      // Use border for dashed/dotted
      const borderColorMap = {
        primary: 'border-primary-500',
        secondary: 'border-secondary',
        neutral: 'border-neutral-700',
        success: 'border-green-500',
        warning: 'border-orange-500',
        error: 'border-red-500'
      };

      if (this.orientation() === 'horizontal') {
        classes.push('border-t', 'bg-transparent');
      } else {
        classes.push('border-l', 'bg-transparent');
      }
      classes.push(borderColorMap[this.color()], variantMap[this.variant()]);
    }

    return classes.join(' ');
  });
}
