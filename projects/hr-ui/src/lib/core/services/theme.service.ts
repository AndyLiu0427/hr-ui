import { computed, effect, signal, inject, CSP_NONCE, DOCUMENT, Service } from '@angular/core';

/**
 * Available theme types
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Theme state interface
 */
export interface ThemeState {
  mode: ThemeMode;
  isTransitioning: boolean;
}

/**
 * Modern theme service following Angular best practices
 * Provides global theme switching with persistence and smooth transitions.
 * Implements class-based dark mode switching pattern.
 */
@Service()
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly nonce = inject(CSP_NONCE, { optional: true });
  private readonly storageKey = 'app-theme';

  // Signals for reactive state management
  private readonly _themeMode = signal<ThemeMode>('light');
  private readonly _isTransitioning = signal(false);

  // Public readonly signals
  readonly themeMode = this._themeMode;
  readonly effectiveTheme = this._themeMode; // Same as themeMode now (no auto mode)
  readonly isTransitioning = this._isTransitioning;

  // Complete theme state
  readonly themeState = computed<ThemeState>(() => ({
    mode: this._themeMode(),
    isTransitioning: this._isTransitioning()
  }));


  constructor() {
    this.initializeTheme();
    this.setupThemeApplication();
  }

  /**
   * Initialize theme from localStorage
   */
  private initializeTheme(): void {
    try {
      // Load saved preference or default to light
      const savedTheme = this.getSavedTheme();
      this._themeMode.set(savedTheme);

      // Apply theme immediately to prevent flash
      this.applyThemeToDocument(savedTheme);
    } catch (error) {
      console.warn('Failed to initialize theme:', error);
      this._themeMode.set('light');
    }
  }

  /**
   * Setup reactive theme application
   */
  private setupThemeApplication(): void {
    effect(() => {
      const theme = this._themeMode();
      this.applyThemeToDocument(theme);
    });
  }

  /**
   * Apply theme to document element using class-based approach
   */
  private applyThemeToDocument(theme: 'light' | 'dark'): void {
    const root = this.document.documentElement;

    if (!root) {
      return;
    }

    const freeze = this.freezeTransitions();

    // Remove both classes first
    root.classList.remove('light', 'dark');

    // Add the current theme class
    root.classList.add(theme);

    // Also set data-theme for backward compatibility (optional)
    root.setAttribute('data-theme', theme);

    if (freeze) {
      // Style the new theme now, while the freeze applies; the next frame lets transitions back in.
      void root.offsetHeight;
      freeze.view.requestAnimationFrame(() => freeze.style.remove());
    }

    // Update theme-color meta tag for mobile browsers
    this.updateThemeColorMeta(theme);

    // Dispatch custom event for any external listeners
    this.document.dispatchEvent(
      new CustomEvent('themeChanged', {
        detail: { theme }
      })
    );
  }

  /**
   * Every transition off, so components take the new colours at once instead of each fading on its
   * own timing. hr-ui's only !important, and it is removed on the next frame.
   */
  private freezeTransitions(): { style: HTMLStyleElement; view: Window } | null {
    const view = this.document.defaultView;
    if (!view?.requestAnimationFrame) {
      return null;
    }
    const style = this.document.createElement('style');
    if (this.nonce) {
      style.nonce = this.nonce;
    }
    style.textContent = '*,*::before,*::after{transition:none!important}';
    this.document.head.appendChild(style);
    return { style, view };
  }

  /**
   * Update theme-color meta tag
   */
  private updateThemeColorMeta(theme: 'light' | 'dark'): void {
    let metaThemeColor = this.document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
      metaThemeColor = this.document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      this.document.head.appendChild(metaThemeColor);
    }

    // Set appropriate theme color based on theme
    const themeColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
    metaThemeColor.setAttribute('content', themeColor);
  }

  /**
   * Get saved theme from localStorage
   */
  private getSavedTheme(): ThemeMode {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved && ['light', 'dark'].includes(saved)) {
        return saved as ThemeMode;
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
    }
    return 'light'; // Default to light theme
  }

  /**
   * Save theme to localStorage
   */
  private saveTheme(mode: ThemeMode): void {
    try {
      localStorage.setItem(this.storageKey, mode);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }

  /**
   * Set theme mode
   */
  setTheme(mode: ThemeMode): void {
    if (mode === this._themeMode()) {
      return;
    }

    this._isTransitioning.set(true);
    this._themeMode.set(mode);
    this.saveTheme(mode);

    // Reset transition state after CSS transition duration
    setTimeout(() => {
      this._isTransitioning.set(false);
    }, 200);
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    const currentMode = this._themeMode();
    this.setTheme(currentMode === 'light' ? 'dark' : 'light');
  }


  /**
   * Check if current theme is dark
   */
  isDarkMode(): boolean {
    return this._themeMode() === 'dark';
  }
}
