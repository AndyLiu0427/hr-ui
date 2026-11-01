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
  afterRenderEffect,
  viewChild,
  DOCUMENT
} from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { IconComponent } from '../icon/icon';
import { SnackbarType, SnackbarPosition, SnackbarSize } from './snackbar.interface';
import { trigger, transition, style, animate, state, AnimationEvent } from '@angular/animations';
import { ButtonComponent } from '../button/button';
import { prefersReducedMotion } from '../../../utils/reduced-motion';

/** --ease-smooth-out. The animations package cannot read CSS variables, so the curve is spelled out. */
const SMOOTH_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

/** What SnackbarService draws; you do not add it yourself. Most inputs match the SnackbarConfig field of the same name. */
@Component({
  selector: 'oct-snackbar',
  templateUrl: './snackbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, IconComponent, ButtonComponent],
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
      transition('void => in', [animate(`250ms ${SMOOTH_OUT}`)]),
      transition('in => void', [
        animate(
          `150ms ${SMOOTH_OUT}`,
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
  private readonly document = inject(DOCUMENT);
  private readonly box = viewChild<ElementRef<HTMLElement>>('box');

  /** The main line of text. */
  readonly message = input.required<string>();
  /** A second, quieter line under the message. */
  readonly description = input<string>();
  /** Sets the colour and the default icon. */
  readonly type = input<SnackbarType>('neutral');
  /** The corner or edge of the screen it appears at. */
  readonly position = input<SnackbarPosition>('bottom-center');
  /** Sets the padding and the icon size. */
  readonly size = input<SnackbarSize>('md');
  /** Milliseconds before it closes itself. 0 keeps it until it is dismissed. */
  readonly duration = input<number>(5000);
  /** Shows the close button. */
  readonly dismissible = input<boolean>(true);
  /** The label of the action button. SnackbarService sets it from action.text. */
  readonly actionText = input<string>();
  /** A Lucide icon name that replaces the default icon of the type. */
  readonly icon = input<string>();
  /** Keeps it open after the action is clicked, and stops it closing itself. */
  readonly persistent = input<boolean>(false);
  /** Its place in the stack at its position. Set by SnackbarService. */
  readonly index = input<number>(0);
  /** Its distance from the edge of the screen, in pixels, so stacked snackbars do not overlap. Set by SnackbarService. */
  readonly offset = input<number>(0); // Dynamic offset from service

  /** Emits after the close animation ends. */
  readonly dismiss = output<void>();
  /** Emits when the action button is clicked. */
  readonly actionClick = output<void>();
  /** Emits the measured height, so SnackbarService can stack snackbars. */
  readonly heightChange = output<number>();

  readonly isVisible = signal(false);
  readonly animationState = signal<'void' | 'in'>('void');
  readonly copied = signal(false);

  private dismissTimeoutId?: ReturnType<typeof setTimeout>;
  /** Time left to read before it closes itself; null when it does not close itself. */
  private remainingMs: number | null = null;
  private timerStartedAt = 0;
  private hovered = false;
  private focusWithin = false;
  private copiedTimeoutId?: ReturnType<typeof setTimeout>;
  private readonly onVisibilityChange = (): void => this.syncDismissTimer();

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
      'shadow-hr-sm',
      'backdrop-blur-sm',
      'border',
      // A restack moves the box with translate (see snackbarStyle), so only translate animates.
      'transition-[translate]',
      'duration-250',
      'ease-[var(--ease-smooth-out)]',
      'motion-reduce:transition-none',
      'cursor-pointer',
      'select-none',
      'min-w-80'
    ];

    const sizeClasses = {
      sm: ['px-3', 'py-2', 'gap-2'],
      md: ['px-4', 'py-3', 'gap-3'],
      lg: ['px-5', 'py-4', 'gap-4']
    };

    // Base position without offset (offset and centring are applied via style)
    const positionClasses = {
      'top-left': ['left-4'],
      'top-center': ['left-1/2'],
      'top-right': ['right-4'],
      'bottom-left': ['left-4'],
      'bottom-center': ['left-1/2'],
      'bottom-right': ['right-4']
    };

    const typeClasses = {
      success: ['bg-hr-green-950', 'border-hr-green-800', 'text-hr-green-200'],
      error: ['bg-hr-red-950', 'border-hr-red-800', 'text-hr-red-200'],
      warning: ['bg-hr-orange-950', 'border-hr-orange-800', 'text-hr-orange-200'],
      info: ['bg-hr-blue-950', 'border-hr-blue-800', 'text-hr-blue-200'],
      neutral: ['bg-secondary', 'border-hr-neutral-800', 'text-1', '!text-sm']
    };

    const classes = [...baseClasses, ...sizeClasses[this.size()], ...positionClasses[this.position()], ...typeClasses[this.type()]];

    return classes.join(' ');
  });

  /**
   * The edge stays fixed; the stack offset is a translate, so a restack animates without layout.
   * translate also does the centring, which a -translate-x-1/2 class would fight over.
   */
  readonly snackbarStyle = computed(() => {
    const position = this.position();
    const x = position.endsWith('center') ? '-50%' : '0px';

    if (position.includes('top')) {
      return { top: '16px', translate: `${x} ${this.offset()}px` };
    } else {
      return { bottom: '16px', translate: `${x} ${-this.offset()}px` };
    }
  });

  private measureHeight(): void {
    const snackbarElement = this.box()?.nativeElement;

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
      success: ['text-hr-green-300'],
      error: ['text-hr-red-300'],
      warning: ['text-hr-orange-300'],
      info: ['text-hr-blue-300'],
      neutral: ['text-1']
    };

    return [...baseClasses, ...sizeClasses[this.size()], ...typeClasses[this.type()]].join(' ');
  });

  readonly textClasses = computed(() => {
    return 'text-base font-medium';
  });

  readonly descriptionClasses = computed(() => {
    const typeClasses = {
      success: 'text-hr-green-200',
      error: 'text-hr-red-200',
      warning: 'text-hr-orange-200',
      info: 'text-hr-blue-200',
      neutral: 'text-3'
    };

    return `text-sm font-normal opacity-80 mt-1 ${typeClasses[this.type()]}`;
  });

  readonly slideDirection = computed(() => {
    const position = this.position();
    if (prefersReducedMotion()) {
      return 'none';
    }
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
      this.remainingMs = this.duration();
      this.document.addEventListener('visibilitychange', this.onVisibilityChange);
      this.syncDismissTimer();
    }
  }

  ngOnDestroy(): void {
    this.stopDismissTimer();
    this.document.removeEventListener('visibilitychange', this.onVisibilityChange);
    clearTimeout(this.copiedTimeoutId);
  }

  setHovered(hovered: boolean): void {
    this.hovered = hovered;
    this.syncDismissTimer();
  }

  setFocusWithin(focused: boolean): void {
    this.focusWithin = focused;
    this.syncDismissTimer();
  }

  /** Focus moving between the box's own buttons still counts as inside. */
  onFocusOut(event: FocusEvent): void {
    this.setFocusWithin(!!this.box()?.nativeElement.contains(event.relatedTarget as Node | null));
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
    this.stopDismissTimer();
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

  /**
   * The clock runs only while the reader could be reading: it stops while the pointer or focus is on
   * the box, and while the tab is in the background, then resumes with the time that was left.
   */
  private syncDismissTimer(): void {
    if (this.remainingMs === null) return;

    const paused = this.hovered || this.focusWithin || this.document.hidden;
    if (paused && this.dismissTimeoutId !== undefined) {
      clearTimeout(this.dismissTimeoutId);
      this.dismissTimeoutId = undefined;
      this.remainingMs -= Date.now() - this.timerStartedAt;
    } else if (!paused && this.dismissTimeoutId === undefined) {
      this.timerStartedAt = Date.now();
      this.dismissTimeoutId = setTimeout(() => {
        this.stopDismissTimer();
        // Not onDismiss(): dismissible only decides whether the close button shows.
        this.animationState.set('void');
      }, Math.max(0, this.remainingMs));
    }
  }

  private stopDismissTimer(): void {
    clearTimeout(this.dismissTimeoutId);
    this.dismissTimeoutId = undefined;
    this.remainingMs = null;
  }
}
