import { BadgeColor, BadgeComponent } from '../badge/badge';
import { ButtonComponent } from '../button/button';
import { CardComponent, CardContentComponent, CardHeaderComponent } from '../card/card';
import { TextComponent } from '../text/text';
import { isPlatformBrowser } from '@angular/common';
import { Component, computed, DestroyRef, inject, input, PLATFORM_ID, signal, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

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

@Component({
  selector: 'oct-info-card',
  templateUrl: './info-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, CardComponent, CardContentComponent, CardHeaderComponent, TextComponent, ButtonComponent, BadgeComponent]
})
export class InfoCardComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly config = input.required<CardConfig>();
  readonly data = input<any>(null);
  readonly loading = input<boolean>(false);
  readonly actions = input<CardAction[]>();
  readonly status = input<string>();
  readonly statusColor = input<BadgeColor>('neutral');
  readonly gapSize = input<string>('6');
  readonly gridCols = input<number>(2);

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

  getGridColsClass(): string {
    const cols = this.gridCols();
    return `grid-cols-1 md:grid-cols-${cols}`;
  }
}
