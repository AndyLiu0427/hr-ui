import { afterNextRender, afterRenderEffect, ChangeDetectionStrategy, Component, DestroyRef, effect, ElementRef, inject, Injector, input, output, signal, TemplateRef, viewChild, ViewContainerRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { Overlay, OverlayRef, OverlayModule, ConnectedPosition } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { IconComponent } from '../icon/icon';
import { MenuItem, MenuSection, MenuAlignment, MenuAlign } from './dropdown-menu.interface';
import { AvatarComponent } from '../avatar/avatar';

/** The trigger is projected content, so it is found as the first thing in the host that takes focus. */
const TRIGGER = 'button, a[href], [tabindex]:not([tabindex="-1"])';

/**
 * A menu of actions in sections that opens from the trigger you project into it, such as an oct-button.
 * Set isOpen to show it, and set it back to false when closed emits. An item with href renders as a link.
 */
@Component({
  selector: 'oct-dropdown-menu',
  templateUrl: './dropdown-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, OverlayModule, CdkMenu, CdkMenuItem, IconComponent, AvatarComponent],
  host: {
    '[class.dropdown-menu-open]': 'isOpen()'
  }
})
export class DropdownMenuComponent {
  static readonly Align = MenuAlign;

  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private overlayRef?: OverlayRef;
  /** Projected [dropdownContent] replaces the menu, so the panel is the caller's and not a menu. */
  private readonly hasCustomContent = signal(false);

  // Inputs
  /** Whether the menu is shown. Set it back to false when closed emits. */
  isOpen = input<boolean>(false);
  /** Which edge of the trigger the menu lines up with. */
  alignment = input<MenuAlignment>(MenuAlign.RIGHT);
  /** The items, in sections with a divider between them. */
  menuSections = input<MenuSection[]>([]);
  /** The gap between the trigger and the menu, in pixels. */
  offsetY = input<number>(8);
  /** The width of the menu, in pixels or as a CSS length. */
  width = input<number | string>('280px');
  /** Closes the menu after an item is chosen. */
  closeOnItemClick = input<boolean>(true);

  // Outputs
  /** Emits when the menu asks to close: an item was chosen, or the user clicked outside or pressed Escape. */
  readonly closed = output<void>();
  /** Emits the item the user chose. Disabled items never emit. */
  readonly itemClick = output<MenuItem>();

  // Template references
  menuTemplate = viewChild<TemplateRef<unknown>>('menuTemplate');
  customContent = viewChild<TemplateRef<unknown>>('customContent');
  private readonly menu = viewChild(CdkMenu);

  constructor() {
    // A parent can remove the menu while it is open; take the panel and its backdrop with it.
    inject(DestroyRef).onDestroy(() => this.overlayRef?.dispose());

    // Effect to manage overlay when menu opens/closes
    effect(() => {
      const open = this.isOpen();
      const customTemplate = this.customContent();
      const defaultTemplate = this.menuTemplate();
      const hasCustomContent = this.projectsCustomContent(customTemplate);
      this.hasCustomContent.set(hasCustomContent);

      if (open) {
        // Use custom content if it has actual projected content, otherwise use default menu template
        const template = hasCustomContent ? customTemplate : defaultTemplate;
        if (template) {
          this.openOverlay(template, hasCustomContent);
        }
      } else {
        this.closeOverlay();
      }
    });

    // After render, because a projected oct-button draws its <button> in its own first pass.
    afterRenderEffect(() => {
      const trigger = this.trigger();
      trigger?.setAttribute('aria-expanded', String(this.isOpen()));
      if (!this.hasCustomContent()) {
        trigger?.setAttribute('aria-haspopup', 'menu');
      }
    });
  }

  /**
   * Creates a temporary embedded view to check if custom content has actual nodes.
   * This is necessary because ng-content projection doesn't show up in querySelector.
   */
  private projectsCustomContent(customTemplate: TemplateRef<unknown> | undefined): boolean {
    if (!customTemplate) {
      return false;
    }
    const tempView = this.viewContainerRef.createEmbeddedView(customTemplate);
    const hasNodes = tempView.rootNodes.some(node => {
      // Check if it's an element node (not just text/comment)
      return node.nodeType === Node.ELEMENT_NODE && (node as Element).hasAttribute('dropdownContent');
    });
    // Clean up the temporary view immediately
    const viewIndex = this.viewContainerRef.indexOf(tempView);
    if (viewIndex !== -1) {
      this.viewContainerRef.remove(viewIndex);
    }
    return hasNodes;
  }

  private trigger(): HTMLElement | null {
    return this.elementRef.nativeElement.querySelector<HTMLElement>(TRIGGER);
  }

  private openOverlay(template: TemplateRef<unknown>, isCustomContentMode: boolean): void {
    if (this.overlayRef) {
      return; // Already open
    }

    // Define multiple position strategies for better positioning
    const positions: ConnectedPosition[] = [
      // Primary position - below aligned to edge
      {
        originX: this.alignment() === MenuAlign.LEFT ? 'start' : 'end',
        originY: 'bottom',
        overlayX: this.alignment() === MenuAlign.LEFT ? 'start' : 'end',
        overlayY: 'top',
        offsetY: this.offsetY()
      },
      // Fallback - above aligned to edge
      {
        originX: this.alignment() === MenuAlign.LEFT ? 'start' : 'end',
        originY: 'top',
        overlayX: this.alignment() === MenuAlign.LEFT ? 'start' : 'end',
        overlayY: 'bottom',
        offsetY: -this.offsetY()
      },
      // Fallback - opposite alignment below
      {
        originX: this.alignment() === MenuAlign.LEFT ? 'end' : 'start',
        originY: 'bottom',
        overlayX: this.alignment() === MenuAlign.LEFT ? 'end' : 'start',
        overlayY: 'top',
        offsetY: this.offsetY()
      }
    ];

    // Create position strategy
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions(positions)
      .withPush(false)
      .withViewportMargin(8)
      .withFlexibleDimensions(true)
      .withTransformOriginOn('.oct-overlay-enter');

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: isCustomContentMode ? this.overlay.scrollStrategies.noop() : this.overlay.scrollStrategies.reposition(),
      hasBackdrop: !isCustomContentMode,
      backdropClass: '',
      panelClass: 'oct-overlay-pane',
      disposeOnNavigation: true,
      width: this.width(),
      maxHeight: '90vh'
    });

    // Attach template portal
    const portal = new TemplatePortal(template, this.viewContainerRef);
    this.overlayRef.attach(portal);

    if (!isCustomContentMode) {
      this.overlayRef.backdropClick().subscribe(() => {
        this.handleClose();
      });
      // The overlay sits at the end of <body>, where Tab from the trigger never arrives.
      afterNextRender(() => this.menu()?.focusFirstItem(), { injector: this.injector });
    }

    this.overlayRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        this.handleClose();
      }
    });

    // Handle outside clicks, ignoring child component overlays and their backdrops
    this.overlayRef.outsidePointerEvents().subscribe(event => {
      const target = event.target as HTMLElement;
      // This callback belongs to the overlay, so the overlay exists whenever it runs.
      const overlayPane = this.overlayRef!.overlayElement;
      const isInsideThisOverlay = overlayPane.contains(target);
      const isInOtherCdkOverlay = target.closest('.cdk-overlay-pane') !== null;
      const isBackdropClick = target.classList.contains('cdk-overlay-backdrop');
      let isChildComponentBackdrop = false;

      if (isBackdropClick) {
        const allOverlayPanes = document.querySelectorAll('.cdk-overlay-pane');
        const visiblePanes = Array.from(allOverlayPanes).filter(pane => {
          const element = pane as HTMLElement;
          return element.offsetParent !== null;
        });

        if (visiblePanes.length > 1) {
          isChildComponentBackdrop = true;
        }
      }

      if (!isInsideThisOverlay && !isInOtherCdkOverlay && !isChildComponentBackdrop) {
        this.handleClose();
      }
    });
  }

  private closeOverlay(): void {
    if (!this.overlayRef) {
      return;
    }
    // Focus inside the panel would be lost with it. A click on another control keeps its focus.
    const active = document.activeElement;
    const focusWasInPanel = !active || active === document.body || this.overlayRef.overlayElement.contains(active);
    this.overlayRef.dispose();
    this.overlayRef = undefined;
    if (focusWasInPanel) {
      this.trigger()?.focus();
    }
  }

  /** Tab leaves the menu the way Escape does: closed, with focus back on the trigger. */
  onMenuTab(event: Event): void {
    event.preventDefault();
    this.handleClose();
  }

  handleItemClick(item: MenuItem, sectionIndex?: number, itemIndex?: number): void {
    if (!item.disabled) {
      this.itemClick.emit(item);
      if (item.action) {
        item.action();
      }
      // Don't close menu if it's the header item (first item in first section)
      // or if closeOnItemClick is disabled
      const shouldClose = this.closeOnItemClick() && !this.isHeader(item, sectionIndex || 0, itemIndex || 0);
      if (shouldClose) {
        this.handleClose();
      }
    }
  }

  handleClose(): void {
    this.closed.emit();
  }

  isHeader(item: MenuItem, _sectionIndex: number, _itemIndex: number): boolean {
    return item.header ?? false;
  }
}
