import { Directive, inject, input, OnDestroy, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const TOOLTIP_BASE =
  'fixed z-[10000] pointer-events-none px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap bg-hr-green-500 text-white shadow-hr-lg transition-[opacity,translate] duration-150 ease-out motion-reduce:translate-none';
const TOOLTIP_ENTER = 'opacity-0 translate-y-1';
const TOOLTIP_VISIBLE = 'opacity-100 translate-y-0';
const TOOLTIP_EXIT = 'opacity-0 -translate-y-1';

/**
 * Copies a value to the clipboard when the user right-clicks the element, then shows "Copied" by the pointer and tells
 * screen readers. The text comes from the i18n files. With nothing to copy, the browser's own menu opens as usual.
 */
@Directive({
  selector: '[octCopyOnRightClick]',
  host: {
    '(contextmenu)': 'onRightClick($event)'
  }
})
export class CopyOnRightClickDirective implements OnDestroy {
  /** The value to copy. It can differ from the text shown; null or an empty string copies nothing. */
  readonly octCopyOnRightClick = input.required<string | number | null | undefined>();

  /** One polite live region for every copy target on the page: screen readers do not read the visible label. */
  private static liveRegion: HTMLElement | null = null;

  private readonly renderer = inject(Renderer2);
  private readonly translate = inject(TranslateService);
  private tooltipElement: HTMLElement | null = null;
  private dismissTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnDestroy(): void {
    this.removeTooltip();
  }

  async onRightClick(event: MouseEvent): Promise<void> {
    const value = this.octCopyOnRightClick();
    if (value == null || value === '') return;
    event.preventDefault();

    try {
      await navigator.clipboard.writeText(String(value));
      const copied = this.translate.instant('COMMON.COPIED');
      this.showTooltip(event, copied);
      this.announce(copied);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  private announce(text: string): void {
    if (!CopyOnRightClickDirective.liveRegion?.isConnected) {
      const created = this.renderer.createElement('div') as HTMLElement;
      created.className = 'sr-only';
      created.setAttribute('aria-live', 'polite');
      this.renderer.appendChild(document.body, created);
      CopyOnRightClickDirective.liveRegion = created;
    }
    const region = CopyOnRightClickDirective.liveRegion;
    region.textContent = '';
    // A beat after clearing, so a second copy is read out again and a new region is in place before it speaks.
    setTimeout(() => (region.textContent = text), 100);
  }

  private showTooltip(event: MouseEvent, text: string): void {
    this.removeTooltip();

    const tooltip = this.renderer.createElement('div') as HTMLElement;
    tooltip.className = `${TOOLTIP_BASE} ${TOOLTIP_ENTER}`;
    tooltip.textContent = text;

    // Dynamic cursor position — must be inline style
    this.renderer.setStyle(tooltip, 'left', `${event.clientX + 8}px`);
    this.renderer.setStyle(tooltip, 'top', `${event.clientY - 32}px`);

    this.renderer.appendChild(document.body, tooltip);
    this.tooltipElement = tooltip;

    // Trigger enter animation on next frame
    requestAnimationFrame(() => {
      if (this.tooltipElement) {
        this.tooltipElement.className = `${TOOLTIP_BASE} ${TOOLTIP_VISIBLE}`;
      }
    });

    this.dismissTimeout = setTimeout(() => this.fadeOutAndRemove(), 1500);
  }

  private fadeOutAndRemove(): void {
    if (!this.tooltipElement) return;

    this.tooltipElement.className = `${TOOLTIP_BASE} ${TOOLTIP_EXIT}`;
    setTimeout(() => this.removeTooltip(), 150);
  }

  private removeTooltip(): void {
    if (this.dismissTimeout) {
      clearTimeout(this.dismissTimeout);
      this.dismissTimeout = null;
    }
    if (this.tooltipElement) {
      this.tooltipElement.remove();
      this.tooltipElement = null;
    }
  }
}
