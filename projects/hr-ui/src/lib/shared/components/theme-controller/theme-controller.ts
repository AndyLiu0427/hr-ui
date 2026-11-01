import { Component, ChangeDetectionStrategy, computed, inject, input, output, signal, DOCUMENT } from '@angular/core';

import { ThemeService } from '../../../core/services/theme.service';
import { ButtonComponent } from '../button/button';
import { IconComponent } from '../icon/icon';
import { TextComponent } from '../text/text';

export type ThemeControllerVariant = 'button' | 'toggle' | 'list';
export type ThemeControllerSize = 'sm' | 'md' | 'lg';

export interface ThemeControllerProps {
  variant?: ThemeControllerVariant;
  size?: ThemeControllerSize;
  showLabel?: boolean;
  disabled?: boolean;
  iconOnly?: boolean;
}

@Component({
  selector: 'oct-theme-controller',
  host: { class: 'contents' },
  templateUrl: './theme-controller.html',
  styleUrl: './theme-controller.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, IconComponent, TextComponent]
})
export class ThemeControllerComponent {
  private readonly document = inject(DOCUMENT);
  private readonly themeService = inject(ThemeService);

  /** Incremented on each toggle to drive icon rotation (180° per toggle) */
  private readonly toggleCount = signal(0);

  // Input properties
  readonly variant = input<ThemeControllerVariant>('button');
  readonly size = input<ThemeControllerSize>('md');
  readonly showLabel = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly iconOnly = input<boolean>(true);

  // Output events
  readonly themeChanged = output<'light' | 'dark'>();

  // Computed properties for reactive UI
  readonly currentTheme = computed(() => {
    return this.themeService.themeMode();
  });
  readonly effectiveTheme = computed(() => this.themeService.effectiveTheme());
  readonly isTransitioning = computed(() => this.themeService.isTransitioning());
  readonly themeLabel = computed(() => {
    const theme = this.currentTheme();
    return theme === 'dark' ? 'Dark Mode' : 'Light Mode';
  });
  readonly themeIcon = computed(() => {
    const theme = this.currentTheme();
    return theme === 'dark' ? 'Moon' : 'Sun';
  });
  readonly iconRotation = computed(() => `rotate(${this.toggleCount() * 180}deg)`);

  // CSS classes
  get containerClasses(): string {
    const baseClasses = ['theme-controller', 'relative', 'inline-flex', 'items-center', '!text-neutral-500'];

    baseClasses.push('gap-2');

    return baseClasses.join(' ');
  }

  /**
   * Toggle theme between light and dark modes.
   * Supports View Transition API circular reveal when MouseEvent is provided.
   */
  toggleTheme(event?: MouseEvent | Event): void {
    if (this.disabled()) return;

    this.toggleCount.update(n => n + 1);

    const currentTheme = this.currentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    const applyTheme = () => {
      this.themeService.setTheme(newTheme);
      this.themeChanged.emit(newTheme);
    };

    const doc = this.document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    const mouseEvent = event instanceof MouseEvent ? event : undefined;

    if (!doc.startViewTransition || !mouseEvent) {
      applyTheme();
      return;
    }

    const { clientX: x, clientY: y } = mouseEvent;
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const transition = doc.startViewTransition(() => applyTheme());

    transition.ready.then(() => {
      this.document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
        { duration: 400, easing: 'ease-out', pseudoElement: '::view-transition-new(root)' }
      );
    });
  }

  /**
   * Set specific theme mode (only light or dark)
   */
  setTheme(mode: 'light' | 'dark'): void {
    if (this.disabled()) return;

    this.themeService.setTheme(mode);
    this.themeChanged.emit(mode);
  }

  /**
   * Cycle through theme options (for button variant - same as toggle for 2 modes)
   */
  cycleTheme(event?: Event): void {
    if (this.disabled()) return;

    this.toggleTheme(event);
  }

  /**
   * Get ARIA label for accessibility
   */
  getAriaLabel(): string {
    const current = this.currentTheme();
    const opposite = current === 'dark' ? 'light' : 'dark';
    return `Switch to ${opposite} mode. Current: ${this.themeLabel()}`;
  }

  /**
   * Handle keyboard navigation
   */
  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled()) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (this.variant() === 'toggle') {
        this.toggleTheme();
      } else {
        this.cycleTheme();
      }
    }
  }
}
