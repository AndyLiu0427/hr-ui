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

/** A line that separates content, with an optional short label in a horizontal line. */
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
      <div class="flex items-center w-full">
        <div [class]="startLineClasses()"></div>
        <oct-text color="3" variant="sm" weight="medium" class="px-3 whitespace-nowrap">
          {{ text() }}
        </oct-text>
        <div [class]="endLineClasses()"></div>
      </div>
    } @else {
      <div [class]="lineClasses()"></div>
    }
  `
})
export class DividerComponent {
  /** 'vertical' draws a line between inline items, as tall as its container. */
  readonly orientation = input<DividerOrientation>('horizontal');
  /** The line style. */
  readonly variant = input<DividerVariant>('solid');
  /** The line colour. */
  readonly color = input<DividerColor>('neutral');
  /** A short label in the line, such as "or". Horizontal dividers only. */
  readonly text = input<string>('');
  /** Where the label sits along the line. */
  readonly textPosition = input<DividerTextPosition>('center');
  /** Space above and below the line, or on both sides of a vertical line. */
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

  /** The lines either side of a label. The one on the label's side is short; the other fills the row. */
  readonly startLineClasses = computed(() => `${this.lineClasses()} ${this.textPosition() === 'start' ? 'w-6' : 'flex-1'}`);
  readonly endLineClasses = computed(() => `${this.lineClasses()} ${this.textPosition() === 'end' ? 'w-6' : 'flex-1'}`);

  readonly lineClasses = computed(() => {
    const classes: string[] = [];

    // Orientation-based sizing
    if (this.orientation() === 'horizontal') {
      classes.push('h-px');
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
        neutral: 'bg-hr-neutral-700',
        success: 'bg-hr-green-500',
        warning: 'bg-hr-orange-500',
        error: 'bg-hr-red-500'
      };
      classes.push(colorMap[this.color()]);
    } else {
      // Use border for dashed/dotted
      const borderColorMap = {
        primary: 'border-primary-500',
        secondary: 'border-secondary',
        neutral: 'border-hr-neutral-700',
        success: 'border-hr-green-500',
        warning: 'border-hr-orange-500',
        error: 'border-hr-red-500'
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
