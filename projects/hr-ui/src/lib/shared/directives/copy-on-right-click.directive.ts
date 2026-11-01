import { Directive, inject, input, OnDestroy, Renderer2 } from '@angular/core';

const TOOLTIP_BASE =
  'fixed z-[10000] pointer-events-none px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap bg-hr-green-500 text-white shadow-hr-lg transition-all duration-150 ease-out';
const TOOLTIP_ENTER = 'opacity-0 translate-y-1';
const TOOLTIP_VISIBLE = 'opacity-100 translate-y-0';
const TOOLTIP_EXIT = 'opacity-0 -translate-y-1';

@Directive({
  selector: '[octCopyOnRightClick]',
  host: {
    '(contextmenu)': 'onRightClick($event)'
  }
})
export class CopyOnRightClickDirective implements OnDestroy {
  readonly octCopyOnRightClick = input.required<string | number | null | undefined>();

  private readonly renderer = inject(Renderer2);
  private tooltipElement: HTMLElement | null = null;
  private dismissTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnDestroy(): void {
    this.removeTooltip();
  }

  async onRightClick(event: MouseEvent): Promise<void> {
    event.preventDefault();

    const value = this.octCopyOnRightClick();
    if (value == null || value === '') return;

    try {
      await navigator.clipboard.writeText(String(value));
      this.showTooltip(event);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  private showTooltip(event: MouseEvent): void {
    this.removeTooltip();

    const tooltip = this.renderer.createElement('div') as HTMLElement;
    tooltip.className = `${TOOLTIP_BASE} ${TOOLTIP_ENTER}`;
    tooltip.textContent = 'Copied!';

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
