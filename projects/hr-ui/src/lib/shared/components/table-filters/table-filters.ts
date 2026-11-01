import { Component, computed, input, output, ChangeDetectionStrategy, WritableSignal } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { FilterComponent, FilterOption } from '../filter/filter';
import { ButtonComponent } from '../button/button';
import { IconComponent } from '../icon/icon';

export interface TableFiltersConfig<T> {
  key: string;
  label: string;
  options: FilterOption<T>[] | (() => FilterOption<T>[]);
  selectedValues: WritableSignal<T[]>;
  width?: number | string;
  searchable?: boolean;
  searchPlaceholder?: string;
  icon?: string;
}

/** A bar of filters for a table. Each filter writes the values people pick into its own signal. */
@Component({
  selector: 'oct-table-filters',
  templateUrl: './table-filters.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, FilterComponent, ButtonComponent, IconComponent],
  host: {
    class: 'flex flex-wrap items-center gap-2 sm:gap-3'
  }
})
export class TableFiltersComponent<T> {
  /** One entry per filter: its label, its options, and the signal that holds its selected values. */
  filters = input.required<TableFiltersConfig<T>[]>();
  /** Shows an icon at the start of the bar. */
  showIcon = input<boolean>(true);
  /** The icon at the start of the bar. */
  iconName = input<string>('Settings2');
  /** Text, or a translation key, for the button that clears every filter. */
  clearAllLabel = input<string>('FILTER_COMPONENT.CLEAR_ALL_FILTERS');
  /**
   * Shows the clear-all button once a filter has a value. Turn it off for a single filter that
   * must always keep a value.
   */
  showClearAll = input<boolean>(true);

  /** Emits after the clear-all button empties every filter. */
  readonly clearAllFilters = output<void>();

  readonly hasActiveFilters = computed(() => {
    return this.filters().some(filter => {
      const selectedValues = filter.selectedValues();
      return Array.isArray(selectedValues) && selectedValues.length > 0;
    });
  });

  readonly onClearAll = (): void => {
    this.filters().forEach(filter => {
      filter.selectedValues.set([]);
    });
    this.clearAllFilters.emit();
  };

  getFilterOptions(config: TableFiltersConfig<T>): FilterOption<T>[] {
    if (typeof config.options === 'function') {
      return config.options();
    }
    return config.options;
  }
}
