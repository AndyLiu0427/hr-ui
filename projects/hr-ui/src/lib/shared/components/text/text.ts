import { Component, ChangeDetectionStrategy, input, output, computed, HostAttributeToken, inject } from '@angular/core';

export type TextColor = '1' | '2' | '3' | 'error' | 'warning' | 'disabled' | 'inherit';
export type TextVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

// Interface for API contract - used for documentation and external consumers
export interface TextProps {
  color: TextColor;
  variant: TextVariant;
  weight?: TextWeight;
  link?: boolean;
  nowrap?: boolean;
  truncate?: boolean;
}

// Interface for component events
export interface TextEvents {
  linkClick: () => void;
}

// Internal interface matching Angular input signal types
export interface TextInputs {
  color: () => TextColor;
  variant: () => TextVariant;
  weight: () => TextWeight;
  link: () => boolean;
  nowrap: () => boolean;
  truncate: () => boolean;
}

@Component({
  selector: 'oct-text',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'textClasses()',
    '(click)': 'onHostClick($event)'
  }
})
export class TextComponent implements TextInputs {
  // Required inputs
  readonly color = input.required<TextColor>();
  readonly variant = input.required<TextVariant>();

  // Optional inputs
  readonly weight = input<TextWeight>('regular');
  readonly link = input<boolean>(false);
  readonly nowrap = input<boolean>(false);
  /** When false, text wraps and ellipsis is not applied (for multi-line labels). */
  readonly truncate = input<boolean>(true);

  // Boolean attribute handling - presence of attribute means true
  private readonly nowrapAttribute: boolean;

  constructor() {
    const nowrapAttribute = inject(new HostAttributeToken('nowrap'), { optional: true });

    this.nowrapAttribute = nowrapAttribute !== null;
  }

  // Output events
  readonly linkClick = output<void>();

  // Computed signal for optimized class calculation
  textClasses = computed(() => {
    const baseClasses = this.truncate()
      ? (['block', 'duration-300', 'transition-all', 'overflow-hidden', 'text-ellipsis'] as const)
      : (['block', 'duration-300', 'transition-all', 'min-w-0', 'break-words'] as const);

    // Color classes based on design system colors
    const colorClasses = {
      '1': 'text-1',
      '2': 'text-2',
      '3': 'text-3',
      error: 'text-error',
      warning: 'text-hr-orange-600',
      disabled: 'text-hr-neutral-600',
      inherit: 'text-inherit'
    } as const;

    // Variant (size) classes - the theme scale in src/styles.css, larger than Tailwind's from xl up
    const variantClasses = {
      xs: 'text-xs', // 12px
      sm: 'text-sm', // 14px
      md: 'text-base', // 16px
      lg: 'text-lg', // 18px
      xl: 'text-xl', // 24px
      '2xl': 'text-2xl', // 30px
      '3xl': 'text-3xl', // 36px
      '4xl': 'text-4xl', // 48px
      '5xl': 'text-5xl', // 60px
      '6xl': 'text-6xl', // 72px
      '7xl': 'text-7xl', // 96px
      '8xl': 'text-8xl' // 128px
    } as const;

    const weightClasses = {
      regular: 'font-normal', // 400
      medium: 'font-medium', // 500
      semibold: 'font-semibold', // 600
      bold: 'font-bold' // 700
    } as const;

    // Link styling - separate from weight
    const linkClasses = this.link() ? 'underline decoration-1 underline-offset-2 hover:decoration-2 cursor-pointer' : '';

    // Nowrap styling - prevents text from wrapping
    // Check both input signal and attribute presence
    const shouldWrap = this.nowrap() || this.nowrapAttribute;
    const nowrapClasses = shouldWrap ? 'whitespace-nowrap' : '';

    const classes = [
      ...baseClasses,
      colorClasses[this.color()],
      variantClasses[this.variant()],
      weightClasses[this.weight()],
      linkClasses,
      nowrapClasses
    ];

    return classes.filter(Boolean).join(' ');
  });

  onHostClick(event: Event): void {
    if (this.link()) {
      event.preventDefault();
      this.linkClick.emit();
    }
  }
}
