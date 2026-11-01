import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  ElementRef,
  OnDestroy,
  viewChild,
  output,
  AfterViewInit,
  inject,
  input,
  computed,
  signal
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { IconComponent } from '../icon/icon';

export type ButtonColor = 'primary' | 'neutral' | 'success' | 'error' | 'warning' | 'info';
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';
export type ButtonShape = 'round' | 'square';

export interface ButtonProps {
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: ButtonType;
  shape?: ButtonShape;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  /**
   * Force icon-only rendering. Requires `icon` to be set.
   * - `true`: always hide label.
   * - `'mobile'`: hide label below the Tailwind `md` breakpoint (< 768px)
   *   and show it on wider viewports.
   * - `false` (default): auto — becomes icon-only when no label content
   *   is projected.
   */
  iconOnly?: boolean | 'mobile';
}

@Component({
  selector: 'oct-button',
  templateUrl: './button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  styles: [
    `
      .button-content:empty {
        display: none;
      }
    `
  ]
})
export class ButtonComponent implements OnDestroy, AfterViewInit {
  // Input signals
  readonly color = input<ButtonColor>('primary');
  readonly variant = input<ButtonVariant>('solid');
  readonly size = input<ButtonSize>('md');
  readonly type = input<ButtonType>('button');
  readonly shape = input<ButtonShape>('round');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly icon = input<string>();
  readonly iconPosition = input<'left' | 'right'>('left');
  readonly iconOnly = input<boolean | 'mobile'>(false);
  readonly ariaLabel = input<string>();
  readonly ariaDescribedBy = input<string>();

  readonly buttonClick = output<Event>();

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);
  /** Viewport below Tailwind `md` (768px); used by hideLabelOnMobile. */
  readonly isMobile = signal(false);

  readonly buttonRef = viewChild.required<ElementRef<HTMLButtonElement>>('buttonRef');
  readonly contentRef = viewChild<ElementRef>('contentRef');

  // State signals
  readonly isPressed = signal(false);
  readonly isHovered = signal(false);
  readonly isFocused = signal(false);
  readonly hasContent = signal(false);

  constructor() {
    this.breakpointObserver
      .observe('(max-width: 767.98px)')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => this.isMobile.set(result.matches));
  }

  /** True when the caller has forced icon-only via the iconOnly input. */
  readonly isForcedIconOnly = computed(() => {
    const mode = this.iconOnly();
    if (mode === true) return true;
    if (mode === 'mobile' && this.isMobile()) return true;
    return false;
  });

  // Computed properties using signals
  readonly isIconOnly = computed(() => {
    if (!this.icon()) return false;
    if (this.isForcedIconOnly()) return true;
    return !this.hasContent();
  });

  /** Side the icon renders on when a label is also shown. */
  readonly iconSide = computed<'left' | 'right' | null>(() => {
    if (this.isIconOnly()) return null;
    // The spinner replaces the icon but always renders before the label.
    if (this.loading()) return 'left';
    return this.icon() ? this.iconPosition() : null;
  });

  /**
   * The 20px box around the 16px glyph pads icon-only buttons out to their tap size, but
   * beside a label its dead 2px would inflate both the gap and the icon-side padding.
   */
  readonly iconBoxClass = computed(() => (this.isIconOnly() ? 'w-5 h-5' : ''));

  readonly buttonClasses = computed(() => {
    // Link variant has minimal base classes (text-like appearance)
    const isLinkVariant = this.variant() === 'link';
    const iconOnly = this.isIconOnly();

    const baseClasses = isLinkVariant
      ? [
          'inline-flex',
          'items-center',
          ...(iconOnly ? [] : ['gap-1']),
          'text-sm',
          'font-medium',
          'cursor-pointer',
          'transition-all',
          'duration-300',
          'disabled:cursor-not-allowed',
          'disabled:!pointer-events-none'
        ]
      : [
          'relative',
          'inline-flex',
          'items-center',
          'justify-center',
          ...(iconOnly ? [] : ['gap-1']),
          'text-sm',
          'font-medium',
          'whitespace-nowrap',
          'cursor-pointer',
          'transition-all',
          'duration-300',
          'disabled:cursor-not-allowed',
          'disabled:!pointer-events-none',
          'disabled:bg-neutral-900',
          'disabled:text-neutral-600',
          'disabled:!outline',
          'disabled:!outline-neutral-800',
          'disabled:!-outline-offset-1',
          'overflow-hidden',
          'select-none',
          'motion-reduce:transition-none',
          'active:brightness-97'
        ];

    // Size classes - no padding for icon-only buttons, minimal for link variant, normal padding for others
    const sizeClasses = iconOnly
      ? {
          sm: ['!p-1.5'], // Icon-only: equal padding, no gap
          md: ['!p-2'],
          lg: ['!p-2.5']
        }
      : isLinkVariant
        ? {
            sm: [], // Link variant: no padding (text-like)
            md: [],
            lg: []
          }
        : {
            sm: ['px-3', 'py-1.5'],
            md: ['px-3', 'py-2'],
            lg: ['px-4', 'py-2.5']
          };

    // Shape classes
    const shapeClasses = {
      round: {
        sm: 'rounded-full',
        md: 'rounded-full',
        lg: 'rounded-full'
      },
      square: {
        sm: 'rounded-lg',
        md: 'rounded-lg',
        lg: 'rounded-lg'
      }
    };

    // Color-based styles (for solid buttons) - with color-specific shadows
    const solidColorClasses = {
      primary: ['text-white', 'bg-primary-600'],
      success: ['text-white', 'bg-green-600'],
      error: ['text-white', 'bg-red-600'],
      warning: ['text-white', 'bg-orange-600'],
      info: ['text-white', 'bg-blue-600'],
      neutral: ['text-neutral-950', 'bg-neutral-50', 'hover:bg-neutral-200']
    };

    // Outline variant styles - with bg-secondary background
    const outlineColorClasses = {
      primary: ['bg-secondary hover:bg-neutral-800', 'text-primary', 'outline outline-primary-600 -outline-offset-1'],
      success: ['bg-secondary hover:bg-neutral-800', 'text-green-500', 'outline outline-green-500 -outline-offset-1'],
      error: ['bg-secondary hover:bg-neutral-800', 'text-red-600', 'outline outline-red-600 -outline-offset-1'],
      warning: ['bg-secondary hover:bg-neutral-800', 'text-orange-600', 'outline outline-orange-600 -outline-offset-1'],
      info: ['bg-secondary hover:bg-neutral-800', 'text-blue-600', 'outline outline-blue-600 -outline-offset-1'],
      neutral: [
        'bg-secondary',
        'text-1',
        'outline !outline-neutral-800 -outline-offset-1',
        'hover:!bg-neutral-800',
        'hover:!brightness-100',
        'active:!outline-neutral-800'
      ]
    };

    // Ghost variant styles - with very subtle color-specific shadows on hover
    const ghostColorClasses = {
      primary: ['bg-transparent hover:bg-neutral-800', 'text-primary-600', 'hover:brightness-100'],
      success: ['bg-transparent hover:bg-neutral-800', 'text-green-600', 'hover:!brightness-100'],
      error: ['bg-transparent hover:bg-neutral-800', 'text-red-600', 'hover:!brightness-100'],
      warning: ['bg-transparent hover:bg-neutral-800', 'text-orange-600', 'hover:!brightness-100'],
      info: ['bg-transparent hover:bg-neutral-800', 'text-blue-600', 'hover:!brightness-100'],
      neutral: ['bg-transparent hover:bg-neutral-800', 'text-1', 'hover:!brightness-100']
    };

    // Link variant styles - mimics oct-text link styling
    const linkColorClasses = {
      primary: [
        'bg-transparent',
        'text-primary-600',
        'underline',
        'decoration-1',
        'underline-offset-2',
        'hover:decoration-2',
        'hover:brightness-100'
      ],
      success: ['bg-transparent', 'text-green-600', 'underline', 'decoration-1', 'underline-offset-2', 'hover:decoration-2', 'hover:brightness-100'],
      error: ['bg-transparent', 'text-red-600', 'underline', 'decoration-1', 'underline-offset-2', 'hover:decoration-2', 'hover:brightness-100'],
      warning: ['bg-transparent', 'text-orange-600', 'underline', 'decoration-1', 'underline-offset-2', 'hover:decoration-2', 'hover:brightness-100'],
      info: ['bg-transparent', 'text-blue-600', 'underline', 'decoration-1', 'underline-offset-2', 'hover:decoration-2', 'hover:brightness-100'],
      neutral: ['bg-transparent', 'text-1', 'underline', 'decoration-1', 'underline-offset-2', 'hover:decoration-2', 'hover:brightness-100']
    };

    // Determine which color classes to use based on variant
    let colorClasses: string[] = [];

    if (this.variant() === 'outline') {
      colorClasses = outlineColorClasses[this.color()] || [];
    } else if (this.variant() === 'ghost') {
      colorClasses = ghostColorClasses[this.color()] || [];
      // Both outline-transparent classes are required: transition-all animates outline-color,
      // and the disabled: duplicate outranks disabled:!outline-neutral-800 from base.
      colorClasses.push('disabled:bg-transparent', '!outline-transparent', 'disabled:!outline-transparent');
    } else if (this.variant() === 'link') {
      colorClasses = linkColorClasses[this.color()] || [];
      colorClasses.push('disabled:bg-transparent', 'disabled:!outline-transparent', 'disabled:no-underline', 'disabled:!text-neutral-600');
    } else {
      // Default to solid button (variant === 'solid')
      colorClasses = solidColorClasses[this.color()] || [];
    }

    // Link variant doesn't need shape classes (no background/border)
    const currentSize = this.size();
    const shapeClass = isLinkVariant ? [] : [shapeClasses[this.shape()][currentSize]];

    const opticalPadding: Record<ButtonSize, Record<'left' | 'right', string>> = {
      sm: { left: 'pl-2.5', right: 'pr-2.5' },
      md: { left: 'pl-2.5', right: 'pr-2.5' },
      lg: { left: 'pl-3', right: 'pr-3' }
    };
    const iconSide = this.iconSide();
    const iconSidePadding = isLinkVariant || !iconSide ? [] : [opticalPadding[currentSize][iconSide]];

    const classes = [...baseClasses, ...sizeClasses[currentSize], ...iconSidePadding, ...shapeClass, ...(colorClasses || [])];

    if (this.fullWidth()) {
      classes.push('w-full');
    }

    if (this.loading()) {
      classes.push('cursor-wait');
    }

    return classes.join(' ');
  });

  onButtonClick(event: Event): void {
    if (this.disabled() || this.loading()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.buttonClick.emit(event);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMouseDown(event: MouseEvent): void {
    if (this.disabled() || this.loading()) return;

    // Set pressed state
    this.isPressed.set(true);
  }

  onMouseUp(): void {
    if (this.disabled() || this.loading()) return;

    // Reset pressed state
    this.isPressed.set(false);
  }

  onMouseLeave(): void {
    if (this.disabled() || this.loading()) return;

    // Reset states when mouse leaves
    this.isHovered.set(false);
    this.isPressed.set(false);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled() || this.loading()) return;

    // Handle space and enter key presses
    if (event.code === 'Space' || event.code === 'Enter') {
      event.preventDefault();
      this.isPressed.set(true);
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    if (this.disabled() || this.loading()) return;

    // A click only when the key also went down on this button. An Enter that closed a dialog
    // lifts on the opener that the dialog handed focus back to, and must not press it again.
    if ((event.code === 'Space' || event.code === 'Enter') && this.isPressed()) {
      event.preventDefault();

      // Trigger click event
      this.buttonClick.emit(event);

      // Reset pressed state
      this.isPressed.set(false);
    }
  }

  onFocus(): void {
    if (this.disabled() || this.loading()) return;
    this.isFocused.set(true);
  }

  onBlur(): void {
    this.isFocused.set(false);
    // Reset pressed state when focus is lost
    this.isPressed.set(false);
  }

  private mutationObserver?: MutationObserver;

  ngAfterViewInit(): void {
    this.checkContent();
    this.setupContentObserver();
  }

  private checkContent(): void {
    const contentElement = this.contentRef()?.nativeElement;
    if (contentElement) {
      const textContent = contentElement.textContent?.trim();
      const newHasContent = !!textContent && textContent.length > 0;

      if (this.hasContent() !== newHasContent) {
        this.hasContent.set(newHasContent);
        // Signal automatically triggers change detection with OnPush
      }
    }
  }

  private setupContentObserver(): void {
    const contentElement = this.contentRef()?.nativeElement;
    if (contentElement && 'MutationObserver' in window) {
      this.mutationObserver = new MutationObserver(() => {
        this.checkContent();
      });

      this.mutationObserver.observe(contentElement, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }

  ngOnDestroy(): void {
    this.mutationObserver?.disconnect();
  }
}
