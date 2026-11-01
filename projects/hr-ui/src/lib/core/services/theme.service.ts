import { computed, effect, signal, inject, DOCUMENT, Service } from '@angular/core';

/**
 * Theme configuration interface
 */
export interface ThemeConfig {
  name: string;
  displayName: string;
  variables: Record<string, string>;
}

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

  // Theme configurations
  private readonly themeConfigs: Record<'light' | 'dark', ThemeConfig> = {
    light: {
      name: 'light',
      displayName: 'Light Mode',
      variables: {}
    },
    dark: {
      name: 'dark',
      displayName: 'Dark Mode',
      variables: {}
    }
  };

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

    // Remove both classes first
    root.classList.remove('light', 'dark');

    // Add the current theme class
    root.classList.add(theme);

    // Also set data-theme for backward compatibility (optional)
    root.setAttribute('data-theme', theme);

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
   * Get current theme configuration
   */
  getCurrentThemeConfig(): ThemeConfig {
    return this.themeConfigs[this._themeMode()];
  }

  /**
   * Check if current theme is dark
   */
  isDarkMode(): boolean {
    return this._themeMode() === 'dark';
  }

  /**
   * Get theme icon name for UI
   */
  getThemeIcon(): string {
    const mode = this._themeMode();
    return mode === 'dark' ? 'Moon' : 'Sun';
  }

  /**
   * Get theme display label
   */
  getThemeLabel(): string {
    const mode = this._themeMode();
    return mode === 'dark' ? 'Dark Mode' : 'Light Mode';
  }
}
