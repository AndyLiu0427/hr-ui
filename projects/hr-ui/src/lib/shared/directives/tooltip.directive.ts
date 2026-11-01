import { Directive, ElementRef, EmbeddedViewRef, OnDestroy, Renderer2, TemplateRef, ViewContainerRef, inject, input } from '@angular/core';

import { prefersReducedMotion } from '../../utils/reduced-motion';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type TooltipColor = 'default' | 'primary' | 'blue' | 'red' | 'purple' | 'amber';

const GAP = 8;

// Text bubble surface (HeroUI feel): compact padding, rounded-md, 12px/16px
// centred text. No shadow or border — they drew a seam at the arrow join that
// made the bubble and tip read as separate shapes. `relative z-10` keeps the
// body painting over the arrow's inner half so only the outward tip shows.
// text-pretty keeps wrapped multi-line tooltips from leaving orphan words.
const TOOLTIP_BODY =
  'relative z-10 max-w-60 whitespace-pre-line flex items-center justify-center px-2.5 py-1 rounded-md overflow-hidden text-xs leading-5 font-normal text-center text-pretty';

// Theme-aware color classes — neutral scale is inverted in this project
// (neutral-50 = dark in light mode, neutral-950 = dark in dark mode)
const COLOR_CLASSES: Record<TooltipColor, string> = {
  default: 'bg-hr-neutral-50 text-hr-neutral-950',
  primary: 'bg-primary-solid text-white',
  blue: 'bg-info-solid text-white',
  red: 'bg-error-solid text-white',
  purple: 'bg-hr-violet-300 dark:bg-hr-violet-700 text-white',
  amber: 'bg-warning-solid text-white'
};

// Scale-pop enter (HeroUI feel): the panel scales up from the edge nearest the
// trigger. transition-[opacity,scale] only — never transition-all.
// drop-shadow (on the wrapper, not the body) follows the body+arrow silhouette
// as one shape, so depth returns without a seam at the arrow join.
const WRAPPER_BASE =
  'fixed z-[10000] pointer-events-none transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.2,0,0,1)] [filter:drop-shadow(0_1px_1px_rgb(0_0_0_/_0.10))_drop-shadow(0_2px_6px_rgb(0_0_0_/_0.12))]';

// Rich-content panel surface — matches the card surface (bg-secondary +
// border-primary); same scale-pop enter.
const RICH_WRAPPER_BASE =
  'fixed z-[10000] pointer-events-none max-w-xs rounded-lg border border-primary bg-secondary p-3 shadow-hr-lg transition-[opacity,scale] duration-200 ease-[cubic-bezier(0.2,0,0,1)]';

// transform-origin tracks placement so the panel pops out of the trigger edge.
const ORIGIN_CLASSES: Record<TooltipPosition, string> = {
  top: 'origin-bottom',
  bottom: 'origin-top',
  left: 'origin-right',
  right: 'origin-left'
};

// Enter (hidden) state. Scale-pop; reduced-motion drops scale to a plain fade.
const ENTER = 'opacity-0 scale-95';
const ENTER_REDUCED = 'opacity-0';
const VISIBLE = 'opacity-100 scale-100';

const ARROW_SIZE = 8; // px — keep in sync with the w-2 h-2 below

/** A tooltip that opens this soon after another one closed skips the delay and the pop. */
const WARM_MS = 300;

// Arrow surfaces per color — bg only, matching each bubble (no border).
const ARROW_COLOR_CLASSES: Record<TooltipColor, string> = {
  default: 'bg-hr-neutral-50',
  primary: 'bg-primary-solid',
  blue: 'bg-info-solid',
  red: 'bg-error-solid',
  purple: 'bg-hr-violet-300 dark:bg-hr-violet-700',
  amber: 'bg-warning-solid'
};

/** What can take keyboard focus inside a component host, such as the <button> in oct-button. */
const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

const isTouchPointer = (): boolean =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(hover: none)').matches;

/**
 * Shows a short text label, or a template, next to its host on hover and while the host or a control inside it
 * has keyboard focus. Escape closes it. A template is never shown on touch screens, so keep anything essential
 * on the page as well.
 */
@Directive({
  selector: '[octTooltip], [octTooltipContent]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    // focusin and focusout bubble, so a component host such as oct-button hears its inner <button>.
    '(focusin)': 'onMouseEnter()',
    '(focusout)': 'onFocusOut($event)'
  }
})
export class TooltipDirective implements OnDestroy {
  /** The text to show. An empty string shows nothing. */
  readonly octTooltip = input<string>('');
  /** A template to show instead of text, for more than one line. It is skipped on touch screens. */
  readonly octTooltipContent = input<TemplateRef<unknown> | null>(null);
  /** The side of the host it appears on. Near the edge of the screen it moves back inside. */
  readonly octTooltipPosition = input<TooltipPosition>('top');
  /** The colour of a text tooltip. */
  readonly octTooltipColor = input<TooltipColor>('primary');
  /** How long the pointer must rest on the host before the tooltip shows, in milliseconds. */
  readonly octTooltipShowDelay = input<number>(200);
  /** Stops the tooltip from showing. */
  readonly octTooltipDisabled = input<boolean>(false);

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly vcr = inject(ViewContainerRef);

  private wrapperEl: HTMLElement | null = null;
  private arrowEl: HTMLElement | null = null;
  /** The element that carries aria-describedby while the tooltip shows. */
  private describedEl: HTMLElement | null = null;
  private stopEscapeListener: (() => void) | null = null;
  private embeddedView: EmbeddedViewRef<unknown> | null = null;
  private delayTimer: ReturnType<typeof setTimeout> | null = null;
  private visibleBaseClass = '';
  private static nextId = 0;
  /** Shared by every trigger, so moving along a row of them reads as one tooltip that moves. */
  private static lastClosedAt = -Infinity;

  private get isRich(): boolean {
    return !!this.octTooltipContent();
  }

  onMouseEnter(): void {
    // Already showing: a click on a hovered host also focuses it, and must not pop the tooltip again.
    if (this.wrapperEl) return;
    if (this.octTooltipDisabled()) return;
    // Rich content has no hover affordance on touch — bail and let the consumer
    // show an inline fallback. (Text path keeps its legacy behaviour.)
    if (this.isRich && isTouchPointer()) return;
    if (!this.isRich && !this.octTooltip()) return;

    this.clearTimer();
    const warm = performance.now() - TooltipDirective.lastClosedAt < WARM_MS;
    const delay = this.octTooltipShowDelay();
    if (delay > 0 && !warm) {
      this.delayTimer = setTimeout(() => this.create(false), delay);
    } else {
      this.create(warm);
    }
  }

  onMouseLeave(): void {
    this.clearTimer();
    this.remove();
  }

  /** Focus that moves between controls inside the host stays inside it. */
  onFocusOut(event: FocusEvent): void {
    if (!(this.el.nativeElement as HTMLElement).contains(event.relatedTarget as Node | null)) {
      this.onMouseLeave();
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
    this.remove();
  }

  private clearTimer(): void {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
  }

  /** `instant` skips the enter animation: the user is already reading tooltips. */
  private create(instant: boolean): void {
    this.remove();
    const position = this.octTooltipPosition();
    const id = `oct-tooltip-${TooltipDirective.nextId++}`;

    const reduced = prefersReducedMotion();
    const enter = reduced ? ENTER_REDUCED : ENTER;
    // oct-tooltip lets hr-ui.css style the wrapper, which lives outside any hr-ui element.
    const base = `oct-tooltip ${this.isRich ? RICH_WRAPPER_BASE : WRAPPER_BASE}`;
    // origin only matters while the scale tween plays; skip it when reduced.
    this.visibleBaseClass = reduced ? base : `${base} ${ORIGIN_CLASSES[position]}`;

    const wrapper = this.renderer.createElement('div') as HTMLElement;
    wrapper.id = id;
    wrapper.setAttribute('role', 'tooltip');
    wrapper.className = `${this.visibleBaseClass} ${instant ? VISIBLE : enter}`;

    if (this.isRich) {
      this.embeddedView = this.vcr.createEmbeddedView(this.octTooltipContent()!);
      this.embeddedView.detectChanges();
      for (const node of this.embeddedView.rootNodes) {
        this.renderer.appendChild(wrapper, node);
      }
    } else {
      // Arrow first so the opaque body paints over its inner half — only the
      // sharp outward tip stays visible.
      const arrow = this.renderer.createElement('div') as HTMLElement;
      arrow.className = `absolute w-2 h-2 rotate-45 ${ARROW_COLOR_CLASSES[this.octTooltipColor()]}`;
      this.renderer.appendChild(wrapper, arrow);
      this.arrowEl = arrow;

      const body = this.renderer.createElement('div') as HTMLElement;
      body.className = `${TOOLTIP_BODY} ${COLOR_CLASSES[this.octTooltipColor()]}`;
      body.textContent = this.octTooltip();
      this.renderer.appendChild(wrapper, body);
    }

    this.renderer.appendChild(document.body, wrapper);
    this.wrapperEl = wrapper;

    this.describedEl = this.focusTarget();
    this.renderer.setAttribute(this.describedEl, 'aria-describedby', id);
    // Dismissible without moving the pointer or the focus, as WCAG 1.4.13 asks.
    this.stopEscapeListener = this.renderer.listen('document', 'keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') this.onMouseLeave();
    });
    this.positionTooltip(wrapper, position);

    if (!instant) {
      requestAnimationFrame(() => {
        if (!this.wrapperEl) return;
        this.wrapperEl.className = `${this.visibleBaseClass} ${VISIBLE}`;
      });
    }
  }

  /** The element a screen reader is on when it reads the description: the host, or the control inside a component host. */
  private focusTarget(): HTMLElement {
    const host = this.el.nativeElement as HTMLElement;
    return host.matches(FOCUSABLE) ? host : (host.querySelector<HTMLElement>(FOCUSABLE) ?? host);
  }

  /**
   * The box to point at. A `display: contents` host (`oct-badge`, `oct-settings-item`) renders no box of
   * its own, so its own rect is all zeros and the tooltip lands in the viewport corner. What it renders
   * is the thing the pointer is actually over, so measure that.
   */
  private triggerRect(): DOMRect {
    const host = this.el.nativeElement as HTMLElement;
    const rect = host.getBoundingClientRect();
    if (rect.width || rect.height || !host.firstElementChild) {
      return rect;
    }
    return host.firstElementChild.getBoundingClientRect();
  }

  private positionTooltip(wrapper: HTMLElement, pos: TooltipPosition): void {
    const host = this.triggerRect();
    // offsetWidth/Height ignore the enter-state scale transform, so the panel
    // is measured at its true size (getBoundingClientRect would report 95%).
    const tipW = wrapper.offsetWidth;
    const tipH = wrapper.offsetHeight;

    let top: number;
    let left: number;

    switch (pos) {
      case 'top':
        top = host.top - tipH - GAP;
        left = host.left + host.width / 2 - tipW / 2;
        break;
      case 'bottom':
        top = host.bottom + GAP;
        left = host.left + host.width / 2 - tipW / 2;
        break;
      case 'left':
        top = host.top + host.height / 2 - tipH / 2;
        left = host.left - tipW - GAP;
        break;
      case 'right':
        top = host.top + host.height / 2 - tipH / 2;
        left = host.right + GAP;
        break;
    }

    left = Math.max(8, Math.min(left, window.innerWidth - tipW - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - tipH - 8));

    this.renderer.setStyle(wrapper, 'top', `${top}px`);
    this.renderer.setStyle(wrapper, 'left', `${left}px`);

    // Arrow stays pointed at the trigger's centre even if the panel was
    // clamped into the viewport, mirroring HeroUI's behaviour.
    if (this.arrowEl) {
      this.positionArrow(this.arrowEl, host, { left, top, width: tipW, height: tipH }, pos);
    }
  }

  private positionArrow(
    arrow: HTMLElement,
    host: DOMRect,
    rect: { left: number; top: number; width: number; height: number },
    pos: TooltipPosition
  ): void {
    const half = ARROW_SIZE / 2;
    // Keep the arrow clear of the rounded corners.
    const clamp = (v: number, max: number): number => Math.max(6, Math.min(v, max));

    if (pos === 'top' || pos === 'bottom') {
      const hostCx = host.left + host.width / 2;
      const x = clamp(hostCx - rect.left - half, rect.width - ARROW_SIZE - 6);
      this.renderer.setStyle(arrow, 'left', `${x}px`);
      this.renderer.setStyle(arrow, pos === 'top' ? 'bottom' : 'top', `-${half}px`);
    } else {
      const hostCy = host.top + host.height / 2;
      const y = clamp(hostCy - rect.top - half, rect.height - ARROW_SIZE - 6);
      this.renderer.setStyle(arrow, 'top', `${y}px`);
      this.renderer.setStyle(arrow, pos === 'left' ? 'right' : 'left', `-${half}px`);
    }
  }

  private remove(): void {
    if (this.wrapperEl) {
      TooltipDirective.lastClosedAt = performance.now();
      this.renderer.removeAttribute(this.describedEl, 'aria-describedby');
      this.stopEscapeListener?.();
      this.stopEscapeListener = null;
      this.describedEl = null;
      this.wrapperEl.remove();
      this.wrapperEl = null;
      this.arrowEl = null;
    }
    if (this.embeddedView) {
      this.embeddedView.destroy();
      this.embeddedView = null;
    }
  }
}
