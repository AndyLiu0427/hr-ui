import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  TemplateRef,
  ViewContainerRef,
  computed,
  contentChild,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { CdkTrapFocus } from '@angular/cdk/a11y';
import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ButtonComponent } from '../button/button';
import { TextComponent } from '../text/text';
import { prefersReducedMotion } from '../../../utils/reduced-motion';

const ENTER_MS = 300;
const EXIT_MS = 200;
/** The iOS sheet curve: a quick start and a long, soft settle. */
const SHEET_EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
const SWIPE_CLOSE_THRESHOLD_PX = 100;
/** px per ms. A short, fast flick closes the sheet as surely as a long drag. */
const SWIPE_CLOSE_VELOCITY = 0.11;

@Component({
  selector: 'oct-bottom-sheet',
  templateUrl: './bottom-sheet.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, OverlayModule, CdkTrapFocus, ButtonComponent, TextComponent]
})
export class BottomSheetComponent {
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);
  private overlayRef?: OverlayRef;
  private closeTimer?: ReturnType<typeof setTimeout>;

  readonly isOpen = input<boolean>(false);
  readonly title = input<string>('');
  readonly ariaLabel = input<string>();
  readonly maxHeight = input<string>('70vh');

  readonly closed = output<void>();

  readonly isAnimating = signal(false);
  readonly isDragging = signal(false);
  readonly translateY = signal(0);
  /** Read on open: with reduced motion the sheet fades where it is instead of sliding. */
  private readonly reducedMotion = signal(false);

  protected readonly panelTransform = computed(() => {
    if (this.isDragging()) return `translateY(${this.translateY()}px)`;
    if (this.isAnimating()) return 'translateY(0)';
    return this.reducedMotion() ? `translateY(${this.translateY()}px)` : 'translateY(100%)';
  });
  protected readonly panelOpacity = computed(() => (this.reducedMotion() && !this.isAnimating() ? 0 : null));
  protected readonly panelTransition = computed(() => {
    if (this.isDragging()) return 'none';
    const duration = this.isAnimating() ? ENTER_MS : EXIT_MS;
    return `${this.reducedMotion() ? 'opacity' : 'transform'} ${duration}ms ${SHEET_EASE}`;
  });

  readonly resolvedAriaLabel = computed(() => this.ariaLabel() ?? this.title());

  readonly sheetTemplate = viewChild.required<TemplateRef<unknown>>('sheetTemplate');
  readonly footerTemplate = contentChild<TemplateRef<unknown>>('footer');

  private dragStartY = 0;
  private dragStartTime = 0;

  constructor() {
    effect(() => {
      const open = this.isOpen();
      if (open) {
        this.openOverlay();
      } else {
        this.startClose();
      }
    });

    this.destroyRef.onDestroy(() => this.disposeOverlay());
  }

  onCloseClick(): void {
    this.closed.emit();
  }

  /** Pointer events, so a mouse drags the handle as well as a finger; capture keeps the drag past its edge. */
  onDragStart(event: PointerEvent): void {
    if (event.button !== 0) return;
    this.dragStartY = event.clientY;
    this.dragStartTime = event.timeStamp;
    this.isDragging.set(true);
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  onDragMove(event: PointerEvent): void {
    if (!this.isDragging()) return;
    const deltaY = event.clientY - this.dragStartY;
    // Down follows the finger. Up resists more the further it goes, then springs back on release.
    this.translateY.set(deltaY >= 0 ? deltaY : -Math.sqrt(-deltaY) * 4);
  }

  onDragEnd(event: PointerEvent): void {
    if (!this.isDragging()) return;
    this.isDragging.set(false);
    const dragged = this.translateY();
    const elapsedMs = Math.max(1, event.timeStamp - this.dragStartTime);
    if (dragged > SWIPE_CLOSE_THRESHOLD_PX || dragged / elapsedMs > SWIPE_CLOSE_VELOCITY) {
      // translateY stays, so a reduced-motion sheet fades out where it was let go.
      this.closed.emit();
    } else {
      this.translateY.set(0);
    }
  }

  onDragCancel(): void {
    this.isDragging.set(false);
    this.translateY.set(0);
  }

  private openOverlay(): void {
    if (this.overlayRef) return;

    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }

    const positionStrategy = this.overlay.position().global().bottom('0').left('0').right('0');

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      hasBackdrop: true,
      backdropClass: 'bg-black/50',
      panelClass: 'oct-overlay-pane',
      disposeOnNavigation: true,
      width: '100%',
      maxHeight: this.maxHeight()
    });

    this.reducedMotion.set(prefersReducedMotion());
    const portal = new TemplatePortal(this.sheetTemplate(), this.viewContainerRef);
    this.overlayRef.attach(portal);

    this.overlayRef
      .backdropClick()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closed.emit());

    this.overlayRef
      .keydownEvents()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        if (event.key === 'Escape') {
          this.closed.emit();
        }
      });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (this.isOpen()) {
          this.isAnimating.set(true);
        }
      });
    });
  }

  private startClose(): void {
    if (!this.overlayRef) return;
    this.isAnimating.set(false);
    this.closeTimer = setTimeout(() => {
      this.disposeOverlay();
      this.translateY.set(0);
    }, EXIT_MS);
  }

  private disposeOverlay(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }
}
