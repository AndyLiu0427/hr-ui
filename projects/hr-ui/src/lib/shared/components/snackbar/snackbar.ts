import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  signal,
  OnInit,
  OnDestroy,
  ElementRef,
  inject,
  afterRenderEffect
} from '@angular/core';

import { IconComponent } from '../icon/icon';
import { SnackbarType, SnackbarPosition, SnackbarSize } from './snackbar.interface';
import { trigger, transition, style, animate, state, AnimationEvent } from '@angular/animations';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'oct-snackbar',
  templateUrl: './snackbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, ButtonComponent],
  animations: [
    trigger('slideIn', [
      state(
        'void',
        style({
          transform: '{{slideDirection}}',
          opacity: 0
        }),
        { params: { slideDirection: 'translateY(-100%)' } }
      ),
      state(
        'in',
        style({
          transform: 'translate(0, 0)',
          opacity: 1
        })
      ),
      transition('void => in', [animate('300ms cubic-bezier(0.4, 0, 0.2, 1)')]),
      transition('in => void', [
        animate(
          '200ms cubic-bezier(0.4, 0, 1, 1)',
          style({
            transform: '{{slideDirection}}',
            opacity: 0
          })
        )
      ])
    ])
  ]
})
export class SnackbarComponent implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);

  readonly message = input.required<string>();
  readonly description = input<string>();
  readonly type = input<SnackbarType>('neutral');
  readonly position = input<SnackbarPosition>('bottom-center');
  readonly size = input<SnackbarSize>('md');
  readonly duration = input<number>(5000);
  readonly dismissible = input<boolean>(true);
  readonly actionText = input<string>();
  readonly icon = input<string>();
  readonly persistent = input<boolean>(false);
  readonly index = input<number>(0);
  readonly offset = input<number>(0); // Dynamic offset from service

  readonly dismiss = output<void>();
  readonly actionClick = output<void>();
  readonly heightChange = output<number>();

  readonly isVisible = signal(false);
  readonly animationState = signal<'void' | 'in'>('void');
  readonly copied = signal(false);

  private dismissAnimationFrameId?: number;
  private dismissStartTime?: number;
  private copiedTimeoutId?: ReturnType<typeof setTimeout>;

  constructor() {
    // Measure height after render using afterRenderEffect read phase
    afterRenderEffect({
      read: () => {
        // Measure in read phase after DOM is stable
        this.measureHeight();
      }
    });
  }

  readonly snackbarClasses = computed(() => {
    const baseClasses = [
      'fixed',
      'z-100',
      'flex',
      'items-center',
      'justify-between',
      'rounded-xl',
      'shadow-sm',
      'backdrop-blur-sm',
      'border',
      'transition-all',
      'duration-300',
      'cursor-pointer',
      'select-none',
      'min-w-80'
    ];

    const sizeClasses = {
      sm: ['px-3', 'py-2', 'gap-2'],
      md: ['px-4', 'py-3', 'gap-3'],
      lg: ['px-5', 'py-4', 'gap-4']
    };

    // Base position without offset (offset will be applied via style)
    const positionClasses = {
      'top-left': ['left-4'],
      'top-center': ['left-1/2', '-translate-x-1/2'],
      'top-right': ['right-4'],
      'bottom-left': ['left-4'],
      'bottom-center': ['left-1/2', '-translate-x-1/2'],
      'bottom-right': ['right-4']
    };

    const typeClasses = {
      success: ['bg-hr-green-950', 'border-hr-green-800', 'text-hr-green-600'],
      error: ['bg-hr-red-950', 'border-hr-red-800', 'text-hr-red-600'],
      warning: ['bg-hr-orange-950', 'border-hr-orange-800', 'text-hr-orange-600'],
      info: ['bg-hr-blue-950', 'border-hr-blue-800', 'text-hr-blue-600'],
      neutral: ['bg-secondary', 'border-hr-neutral-800', 'text-1', '!text-sm']
    };

    const classes = [...baseClasses, ...sizeClasses[this.size()], ...positionClasses[this.position()], ...typeClasses[this.type()]];

    return classes.join(' ');
  });

  readonly snackbarStyle = computed(() => {
    const position = this.position();
    const offset = this.offset();

    // Apply offset based on position (top or bottom)
    if (position.includes('top')) {
      return { top: `${16 + offset}px` };
    } else {
      return { bottom: `${16 + offset}px` };
    }
  });

  private measureHeight(): void {
    const element = this.elementRef.nativeElement as HTMLElement;
    const snackbarElement = element.querySelector('[role="alert"]') as HTMLElement;

    if (snackbarElement && this.isVisible()) {
      const height = snackbarElement.offsetHeight;

      // Only emit if height is valid and greater than 0
      if (height > 0) {
        this.heightChange.emit(height);
      }
    }
  }

  readonly defaultIcon = computed(() => {
    if (this.copied()) return 'Check';
    if (this.icon()) return this.icon();

    const defaultIcons = {
      success: 'CircleCheck',
      error: 'CircleAlert',
      warning: 'TriangleAlert',
      info: 'Info',
      neutral: 'Bell'
    };

    return defaultIcons[this.type()];
  });

  readonly iconClasses = computed(() => {
    const baseClasses = ['flex-shrink-0'];

    const sizeClasses = {
      sm: ['!w-4', '!h-4', '!text-[16px]'],
      md: ['!w-5', '!h-5', '!text-[20px]'],
      lg: ['!w-6', '!h-6', '!text-[24px]']
    };

    const typeClasses = {
      success: ['text-hr-green-600'],
      error: ['text-hr-red-600'],
      warning: ['text-hr-orange-600'],
      info: ['text-hr-blue-600'],
      neutral: ['text-1']
    };

    return [...baseClasses, ...sizeClasses[this.size()], ...typeClasses[this.type()]].join(' ');
  });

  readonly textClasses = computed(() => {
    return 'text-base font-medium';
  });

  readonly descriptionClasses = computed(() => {
    const typeClasses = {
      success: 'text-hr-green-600',
      error: 'text-hr-red-600',
      warning: 'text-hr-orange-600',
      info: 'text-hr-blue-600',
      neutral: 'text-3'
    };

    return `text-sm font-normal opacity-80 mt-1 ${typeClasses[this.type()]}`;
  });

  readonly slideDirection = computed(() => {
    const position = this.position();
    if (position.includes('top')) {
      return 'translateY(-100%)';
    } else {
      return 'translateY(100%)';
    }
  });

  readonly buttonColor = computed(() => {
    const colorMap = {
      success: 'success' as const,
      error: 'error' as const,
      warning: 'warning' as const,
      info: 'info' as const,
      neutral: 'neutral' as const
    };

    return colorMap[this.type()] || 'neutral';
  });

  ngOnInit(): void {
    // Use microtask to trigger animation after current task
    queueMicrotask(() => {
      this.isVisible.set(true);
      this.animationState.set('in');
    });

    if (!this.persistent() && this.duration() > 0) {
      this.startDismissTimer();
    }
  }

  ngOnDestroy(): void {
    this.clearDismissTimer();
    clearTimeout(this.copiedTimeoutId);
  }

  /** The event is taken so the close button's click does not bubble to the box and copy as well. */
  onDismiss(event?: Event): void {
    event?.stopPropagation();
    if (!this.dismissible()) return;
    this.animationState.set('void');
  }

  onAnimationDone(event: AnimationEvent): void {
    if (event.toState === 'void') {
      this.dismiss.emit();
    }
  }

  onActionClick(event: Event): void {
    event.stopPropagation();
    this.actionClick.emit();
  }

  /** Copies what the box says: it carries `select-none`, so there is no selecting the text by hand. */
  async onSnackbarClick(): Promise<void> {
    this.clearDismissTimer();
    try {
      await navigator.clipboard.writeText([this.message(), this.description()].filter(Boolean).join('\n'));
    } catch {
      // Refused clipboard access leaves the message on screen, where the stopped timer keeps it.
      return;
    }
    this.copied.set(true);
    clearTimeout(this.copiedTimeoutId);
    this.copiedTimeoutId = setTimeout(() => this.copied.set(false), 1500);
  }

  private startDismissTimer(): void {
    this.clearDismissTimer();
    this.dismissStartTime = performance.now();
    const duration = this.duration();

    const checkDismissTime = (currentTime: number) => {
      if (!this.dismissStartTime) return;

      const elapsed = currentTime - this.dismissStartTime;

      if (elapsed >= duration) {
        this.onDismiss();
      } else {
        this.dismissAnimationFrameId = requestAnimationFrame(checkDismissTime);
      }
    };

    this.dismissAnimationFrameId = requestAnimationFrame(checkDismissTime);
  }

  private clearDismissTimer(): void {
    if (this.dismissAnimationFrameId) {
      cancelAnimationFrame(this.dismissAnimationFrameId);
      this.dismissAnimationFrameId = undefined;
    }
    this.dismissStartTime = undefined;
  }
}
