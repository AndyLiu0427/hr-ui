import { inject, signal, ElementRef, TemplateRef, ViewContainerRef, DestroyRef, Service } from '@angular/core';
import { Overlay, OverlayRef, ConnectedPosition, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subject, takeUntil } from 'rxjs';

/**
 * Base Overlay Service
 *
 * Provides reusable overlay functionality for select-like components.
 * Handles overlay creation, positioning, lifecycle management, and cleanup.
 *
 * Usage:
 * 1. Inject this service in your component
 * 2. Call initializeOverlay() with your configuration
 * 3. Use open() and close() methods to control visibility
 * 4. Service automatically cleans up on component destruction
 */
@Service({ autoProvided: false })
export class BaseOverlayService {
  private readonly overlay = inject(Overlay);
  private readonly vcr = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);

  private overlayRef: OverlayRef | null = null;
  private portal: TemplatePortal | null = null;
  private destroy$ = new Subject<void>();
  private originElement: ElementRef | null = null;
  /**
   * Floor for the overlay width, in px. Without it the overlay is pinned to the trigger, so a
   * narrow trigger forces a narrow panel: a 64px unit control would render a 30-character option
   * label in 64px.
   */
  private minWidthPx = 0;

  readonly isOpen = signal(false);

  constructor() {
    // Automatic cleanup when component is destroyed
    this.destroyRef.onDestroy(() => {
      this.cleanup();
    });
  }

  /**
   * Initialize overlay with configuration
   * @param origin - Element to attach overlay to
   * @param template - Template to render in overlay
   * @param config - Additional overlay configuration
   */
  initializeOverlay(origin: ElementRef, template: TemplateRef<void>, config: Partial<OverlayConfig> = {}): void {
    this.originElement = origin;
    this.minWidthPx = typeof config.minWidth === 'number' ? config.minWidth : 0;

    if (!this.overlayRef) {
      this.overlayRef = this.createOverlay(origin, config);
      this.setupEventHandlers();
    }

    if (!this.portal) {
      this.portal = new TemplatePortal(template, this.vcr);
    }
  }

  /**
   * Match the overlay to the trigger, but never below the configured floor.
   *
   * This runs on EVERY open, so a minWidth set anywhere else is overwritten. Consumers that need
   * a wider panel than their trigger pass `minWidth` to initializeOverlay.
   */
  private updateOverlayWidth(): void {
    if (!this.overlayRef || !this.originElement) return;

    const triggerWidth = this.originElement.nativeElement.getBoundingClientRect().width;
    if (triggerWidth > 0) {
      const width = Math.max(triggerWidth, this.minWidthPx);
      this.overlayRef.updateSize({ width, minWidth: width });
    }
  }

  /**
   * Open the overlay
   * @param onOpen - Optional callback after overlay opens
   */
  open(onOpen?: () => void): void {
    if (!this.overlayRef || !this.portal) {
      console.warn('BaseOverlayService: Overlay not initialized. Call initializeOverlay() first.');
      return;
    }

    if (this.overlayRef.hasAttached()) {
      return; // Already open
    }

    // Update width dynamically before opening to ensure correct size
    this.updateOverlayWidth();

    this.overlayRef.attach(this.portal);
    this.isOpen.set(true);

    if (onOpen) {
      requestAnimationFrame(() => {
        onOpen();
      });
    }
  }

  /**
   * Close the overlay
   * @param onClose - Optional callback after overlay closes
   */
  close(onClose?: () => void): void {
    if (!this.isOpen()) {
      return;
    }

    if (this.overlayRef?.hasAttached()) {
      try {
        this.overlayRef.detach();
      } catch (error) {
        console.warn('BaseOverlayService: Error detaching overlay:', error);
      }
    }

    this.isOpen.set(false);

    if (onClose) {
      onClose();
    }
  }

  /**
   * Toggle overlay open/close state
   */
  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Update overlay position
   */
  updatePosition(): void {
    this.overlayRef?.updatePosition();
  }

  /**
   * Get overlay element for DOM queries
   */
  getOverlayElement(): HTMLElement | null {
    return this.overlayRef?.overlayElement ?? null;
  }

  /**
   * Check if overlay has attached content
   */
  hasAttached(): boolean {
    return this.overlayRef?.hasAttached() ?? false;
  }

  /**
   * Create overlay with positioning strategy
   */
  private createOverlay(origin: ElementRef, customConfig: Partial<OverlayConfig>): OverlayRef {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions(this.getDefaultPositions())
      .withFlexibleDimensions(false)
      .withPush(false)
      .withTransformOriginOn('.oct-overlay-enter');

    const defaultConfig: OverlayConfig = {
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      maxHeight: '240px'
    };

    const overlayConfig = new OverlayConfig({
      ...defaultConfig,
      ...customConfig,
      // Marks the pane as hr-ui's, so hr-ui.css styles it and leaves the app's other overlays alone.
      panelClass: ['oct-overlay-pane', ...[customConfig.panelClass ?? []].flat()]
    });

    return this.overlay.create(overlayConfig);
  }

  /**
   * Get default overlay positions (bottom-start, top-start, etc.)
   */
  private getDefaultPositions(): ConnectedPosition[] {
    return [
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetY: 4
      },
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetY: -4
      },
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
        offsetY: 4
      },
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'bottom',
        offsetY: -4
      }
    ];
  }

  /**
   * Setup event handlers for backdrop click and keyboard events
   */
  private setupEventHandlers(): void {
    if (!this.overlayRef) return;

    // Handle backdrop clicks
    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.close();
      });

    // Handle escape key
    this.overlayRef
      .keydownEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event.key === 'Escape') {
          this.close();
        }
      });
  }

  /**
   * Cleanup overlay resources
   */
  private cleanup(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.portal?.isAttached) {
      try {
        this.portal.detach();
      } catch (error) {
        console.warn('BaseOverlayService: Error detaching portal:', error);
      }
    }

    if (this.overlayRef) {
      try {
        this.overlayRef.dispose();
      } catch (error) {
        console.warn('BaseOverlayService: Error disposing overlay:', error);
      }
      this.overlayRef = null;
    }

    this.portal = null;
  }
}
