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

import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ButtonComponent } from '../button/button';
import { TextComponent } from '../text/text';

const ANIMATION_DURATION_MS = 300;
const SWIPE_CLOSE_THRESHOLD_PX = 100;

@Component({
  selector: 'oct-bottom-sheet',
  templateUrl: './bottom-sheet.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, OverlayModule, ButtonComponent, TextComponent]
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

  readonly resolvedAriaLabel = computed(() => this.ariaLabel() ?? this.title());

  readonly sheetTemplate = viewChild.required<TemplateRef<unknown>>('sheetTemplate');
  readonly footerTemplate = contentChild<TemplateRef<unknown>>('footer');

  private touchStartY = 0;

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

  onDragStart(event: TouchEvent): void {
    this.touchStartY = event.touches[0].clientY;
    this.isDragging.set(true);
  }

  onDragMove(event: TouchEvent): void {
    if (!this.isDragging()) return;
    const deltaY = event.touches[0].clientY - this.touchStartY;
    if (deltaY > 0) {
      this.translateY.set(deltaY);
    }
  }

  onDragEnd(): void {
    if (!this.isDragging()) return;
    this.isDragging.set(false);
    const dragged = this.translateY();
    this.translateY.set(0);
    if (dragged > SWIPE_CLOSE_THRESHOLD_PX) {
      this.closed.emit();
    }
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
    }, ANIMATION_DURATION_MS);
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
