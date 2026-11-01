import { Component, ChangeDetectionStrategy, OnDestroy, effect, input, output, computed, signal, viewChild, ElementRef } from '@angular/core';
import { ButtonComponent } from '../button/button';

/** RWD-optimized size classes: mobile-first with progressive enhancement */
/** What Tab visits, which is what the trap has to cycle through. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** How long a refused close stays marked. Longer than the shake, so the ring is readable. */
const REFUSAL_MS = 900;

const SIZE_CLASSES: Record<string, string> = {
  sm: 'max-w-full sm:max-w-[24rem]',
  md: 'max-w-full sm:max-w-[32rem]',
  lg: 'max-w-full sm:max-w-[40rem] lg:max-w-[48rem]',
  xl: 'max-w-full sm:max-w-[48rem] lg:max-w-[64rem]',
  full: 'max-w-[95vw] sm:max-w-[90vw]',
  custom: ''
};

/** A modal window. Put an oct-dialog-header, oct-dialog-content and oct-dialog-footer inside it. */
@Component({
  selector: 'oct-dialog',
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'handleEscapeKey()'
  },
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 bg-black/50" (click)="dismiss()"></div>

      <div class="dialog-wrapper fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div
          #container
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          (keydown.tab)="holdFocus($event)"
          (keydown.shift.tab)="holdFocus($event)"
          class="dialog-container relative flex flex-col rounded-lg sm:rounded-xl w-full bg-secondary border border-primary shadow-hr-sm overflow-hidden"
          [class]="containerClass()"
          [style.max-width]="customMaxWidth()"
          [style.max-height]="customMaxHeight()"
        >
          @if (showCloseButton()) {
            <oct-button
              class="dialog-close absolute right-2 top-2 sm:right-3 sm:top-3 z-10"
              [class.is-refused]="shaking()"
              [variant]="'ghost'"
              [size]="'sm'"
              [icon]="'X'"
              color="neutral"
              (buttonClick)="closeDialog()"
              [ariaLabel]="closeLabel()"
            >
            </oct-button>
          }

          <div [class]="contentContainerClass()">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .dialog-wrapper {
        pointer-events: none;
      }

      .dialog-container {
        pointer-events: auto;
      }

      /*
       * The refusal, after transitions.dev's "error state shake": each leg carries its own ease, and
       * the stops are the cumulative 80/60/80/60ms as a fraction of 280ms.
       * https://transitions.dev/detail.html?t=error-state-shake
       */
      .dialog-container.is-shaking {
        animation: dialog-shake 280ms linear;
      }

      @keyframes dialog-shake {
        0% {
          transform: translateX(0);
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }
        28.57% {
          transform: translateX(6px);
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }
        57.14% {
          transform: translateX(-6px);
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }
        78.57% {
          transform: translateX(4px);
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
        }
        100% {
          transform: translateX(0);
        }
      }

      /*
       * The static half of the refusal. Motion alone would say nothing to a reader who has turned
       * it off, so the control that DOES close the dialog is marked at the same time.
       */
      .dialog-close.is-refused {
        border-radius: 100px;
        outline: 2px solid var(--primary);
        outline-offset: 2px;
        transition-property: outline-color;
        transition-duration: 150ms;
      }

      @media (prefers-reduced-motion: reduce) {
        .dialog-container.is-shaking {
          animation: none;
        }
      }
    `
  ]
})
export class DialogComponent implements OnDestroy {
  /** Whether the dialog is shown. Set it back to false when dialogClose emits. */
  isOpen = input<boolean>(false);
  /** The maximum width. On phones every size fills the screen; custom takes its width from maxWidth. */
  size = input<'sm' | 'md' | 'lg' | 'xl' | 'full' | 'custom'>('md');
  /** A CSS max-width, such as "40rem". Used only when size is custom. */
  maxWidth = input<string>();
  /** A CSS max-height, such as "80vh". Set it when the content can be taller than the screen, so the content scrolls. */
  maxHeight = input<string>();
  /** Shows the close (X) button in the top-right corner. */
  showCloseButton = input<boolean>(true);
  /** Removes the space between the header, content and footer. */
  noGap = input<boolean>(false);
  /**
   * Only the close button ends the dialog: the backdrop and Escape do nothing.
   *
   * For a dialog holding something the viewer cannot get back - work in progress, or a step still
   * running - where a stray click outside would throw it away.
   */
  persistent = input<boolean>(false);
  /** What the close control announces. Overridable, because a dialog may end in more than closing. */
  closeLabel = input<string>('Close dialog');

  /** Emits false when the user closes the dialog, and true when openDialog() is called. */
  openChange = output<boolean>();
  /** Emits when the user closes the dialog with the close button, the backdrop or Escape. */
  dialogClose = output<void>();

  protected readonly shaking = signal(false);
  private refusalTimer?: ReturnType<typeof setTimeout>;

  private readonly container = viewChild<ElementRef<HTMLElement>>('container');
  /** Who opened it, so closing puts the keyboard back where it was. */
  private opener: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const host = this.container()?.nativeElement;
      if (!this.isOpen()) {
        this.opener?.focus();
        this.opener = null;
        return;
      }
      if (!host) {
        return;
      }
      this.opener = document.activeElement as HTMLElement | null;
      // The dialog itself when it holds nothing focusable, so the reader starts inside either way.
      (this.focusable(host)[0] ?? host).focus();
    });
  }

  /** In DOM order, which is the order Tab will visit them. */
  private focusable(host: HTMLElement): HTMLElement[] {
    return [...host.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(el => el.offsetParent !== null || el === document.activeElement);
  }

  /**
   * Keep Tab inside the dialog. Without this the next Tab lands on the page behind, which is still
   * fully operable by keyboard while a modal covers it.
   */
  protected holdFocus(event: Event): void {
    const { shiftKey } = event as KeyboardEvent;
    const host = this.container()?.nativeElement;
    if (!host) {
      return;
    }
    const stops = this.focusable(host);
    if (stops.length === 0) {
      return;
    }
    const edge = shiftKey ? stops[0] : stops[stops.length - 1];
    if (document.activeElement !== edge) {
      return;
    }
    event.preventDefault();
    (shiftKey ? stops[stops.length - 1] : stops[0]).focus();
  }

  dialogSizeClass = computed(() => {
    return SIZE_CLASSES[this.size()] || SIZE_CLASSES['md'];
  });

  /** One binding: `[class]` replaces the whole list, so a separate `[class.is-shaking]` never lands. */
  protected readonly containerClass = computed(() => `${this.dialogSizeClass()}${this.shaking() ? ' is-shaking' : ''}`);

  contentContainerClass = computed(() => {
    const base = 'flex flex-col flex-1 min-h-0';
    return this.noGap() ? base : `${base} gap-4 sm:gap-6`;
  });

  customMaxWidth = computed(() => {
    if (this.size() === 'custom' && this.maxWidth()) {
      return this.maxWidth();
    }
    return null;
  });

  customMaxHeight = computed(() => {
    if (this.maxHeight()) {
      return this.maxHeight();
    }
    return null;
  });

  handleEscapeKey(): void {
    if (this.isOpen()) {
      this.dismiss();
    }
  }

  /**
   * What the backdrop and Escape do. A persistent dialog answers with a shake instead of closing,
   * so the press reads as refused rather than as nothing happening.
   */
  dismiss(): void {
    if (!this.persistent()) {
      this.closeDialog();
      return;
    }
    // A class re-added in the same frame never replays the keyframes.
    clearTimeout(this.refusalTimer);
    this.shaking.set(false);
    requestAnimationFrame(() => {
      this.shaking.set(true);
      // On a timer, not on `animationend`: the shake is off under reduced motion, and the ring on
      // the one control that does close the dialog has to clear itself either way.
      this.refusalTimer = setTimeout(() => this.shaking.set(false), REFUSAL_MS);
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.refusalTimer);
  }

  openDialog(): void {
    this.openChange.emit(true);
  }

  closeDialog(): void {
    this.openChange.emit(false);
    this.dialogClose.emit();
  }
}

/** The title row at the top of a dialog. */
@Component({
  selector: 'oct-dialog-header',
  imports: [],
  host: {
    class: 'block flex-shrink-0'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-start justify-between relative pt-4 px-4 sm:pt-4 sm:px-6">
      <div class="text-1 text-lg sm:text-lg font-semibold flex-1 pr-8">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class DialogHeaderComponent {}

export type DialogContentPadding = 'none' | 'md';

const CONTENT_PADDING_CLASSES: Record<DialogContentPadding, string> = {
  none: '',
  md: 'px-4 sm:px-6'
};

/** The body of a dialog. It scrolls when the dialog has a maxHeight. */
@Component({
  selector: 'oct-dialog-content',
  imports: [],
  host: {
    class: 'flex flex-col flex-1 min-h-0 overflow-hidden'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="contentClasses()">
      <ng-content></ng-content>
    </div>
  `
})
export class DialogContentComponent {
  /** Horizontal padding. Use 'none' to let content such as a table reach the edges of the dialog. */
  readonly padding = input<DialogContentPadding>('md');

  protected readonly contentClasses = computed(() =>
    ['flex-1', 'overflow-y-auto', 'min-h-0', CONTENT_PADDING_CLASSES[this.padding()]].filter(Boolean).join(' ')
  );
}

/** The action row at the bottom of a dialog. Its children are spread to both ends. */
@Component({
  selector: 'oct-dialog-footer',
  imports: [],
  host: {
    class: 'block flex-shrink-0'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-between gap-2 sm:gap-3 pb-4 px-4 sm:pb-6 sm:px-6">
      <ng-content></ng-content>
    </div>
  `
})
export class DialogFooterComponent {}
