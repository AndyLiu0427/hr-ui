import { BadgeColor, BadgeComponent } from '../badge/badge';
import { ButtonComponent } from '../button/button';
import { CardComponent, CardContentComponent, CardHeaderComponent } from '../card/card';
import { TextComponent } from '../text/text';
import { isPlatformBrowser } from '@angular/common';
import { Component, computed, DestroyRef, inject, input, PLATFORM_ID, signal, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/** Whole class names, never built at runtime, so Tailwind finds them when it scans this file. */
const GRID_COLS_CLASS = { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' } as const;
const GAP_CLASS = { '2': 'gap-2', '3': 'gap-3', '4': 'gap-4', '5': 'gap-5', '6': 'gap-6', '8': 'gap-8' } as const;

export type InfoCardColumns = keyof typeof GRID_COLS_CLASS;
export type InfoCardGap = keyof typeof GAP_CLASS;

export interface FieldConfig {
  key: string;
  label: string;
  formatter?: (data: any) => string;
  defaultValue?: string;
  visible?: (data: any) => boolean;
  preserveLineBreaks?: boolean;
}

export interface CardConfig {
  title: string;
  fields: FieldConfig[];
}

export interface CardAction {
  label?: string;
  icon?: string;
  handler: () => void;
  color?: 'primary' | 'neutral' | 'success' | 'error' | 'warning' | 'info';
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
  disabled?: boolean;
  position?: 'title' | 'right';
}

/** A card of labels and values read from one record, such as the employment details of an employee. */
@Component({
  selector: 'oct-info-card',
  templateUrl: './info-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, CardComponent, CardContentComponent, CardHeaderComponent, TextComponent, ButtonComponent, BadgeComponent]
})
export class InfoCardComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  /**
   * The title and the fields. A field reads data[key], where dots read nested values, and can set
   * formatter (which gets the whole record), defaultValue, visible and preserveLineBreaks.
   */
  readonly config = input.required<CardConfig>();
  /** The record to show. Without one, the card says there is no data. */
  readonly data = input<any>(null);
  /** Shows a loading message instead of the fields. */
  readonly loading = input<boolean>(false);
  /**
   * Buttons in the header: on the right, or under the title with position 'title'. Below 768px wide an action
   * with an icon shows the icon only, and its label stays its accessible name.
   */
  readonly actions = input<CardAction[]>();
  /** Text of a badge next to the title, such as "Active". */
  readonly status = input<string>();
  /** The colour of the status badge. */
  readonly statusColor = input<BadgeColor>('neutral');
  /** The Tailwind gap step between fields. */
  readonly gapSize = input<InfoCardGap>('6');
  /** The number of field columns from 768px wide. Narrower screens show one column. */
  readonly gridCols = input<InfoCardColumns>(2);

  readonly gridClass = computed(() => `grid grid-cols-1 ${GRID_COLS_CLASS[this.gridCols()]} ${GAP_CLASS[this.gapSize()]}`);

  readonly isDesktop = signal<boolean>(true);

  constructor() {
    // isPlatformBrowser is not enough: jsdom is a browser platform but implements no
    // matchMedia, so an unguarded call threw and made this component impossible to render
    // in a spec. Guarded the same way as tooltip.directive.ts and
    // timesheet-summary-stat.ts. isDesktop stays at its `true` default when absent.
    if (isPlatformBrowser(this.platformId) && typeof window.matchMedia === 'function') {
      this.isDesktop.set(window.matchMedia('(min-width: 768px)').matches);

      const mediaQuery = window.matchMedia('(min-width: 768px)');
      const updateDesktop = (e: MediaQueryListEvent) => {
        this.isDesktop.set(e.matches);
      };

      mediaQuery.addEventListener('change', updateDesktop);

      // Automatic cleanup on component destroy
      this.destroyRef.onDestroy(() => {
        mediaQuery.removeEventListener('change', updateDesktop);
      });
    }
  }

  // Computed properties to separate title and right actions
  readonly titleActions = computed(() => {
    return this.actions()?.filter(action => action.position === 'title') || [];
  });

  readonly rightActions = computed(() => {
    return this.actions()?.filter(action => !action.position || action.position === 'right') || [];
  });

  isFieldVisible(field: FieldConfig): boolean {
    if (!field.visible) return true;
    return field.visible(this.data());
  }

  getFieldValue(key: string): any {
    const data = this.data();
    if (!data) return null;

    // Handle nested keys (e.g., 'bankDetails.accountName')
    const keys = key.split('.');
    let value = data;

    for (const k of keys) {
      value = value?.[k];
    }

    return value;
  }

  formatFieldValue(value: any, formatter?: (data: any) => string, defaultValue?: string): string {
    if (formatter) {
      return formatter(this.data());
    }

    if (value === null || value === undefined || value === '') {
      return defaultValue || '-';
    }

    return String(value);
  }

}
