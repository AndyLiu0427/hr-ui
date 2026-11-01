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
  filters = input.required<TableFiltersConfig<T>[]>();
  showIcon = input<boolean>(true);
  iconName = input<string>('Settings2');
  clearAllLabel = input<string>('FILTER_COMPONENT.CLEAR_ALL_FILTERS');
  // Hide the "clear all" button (e.g. a single mandatory filter where clearing
  // is meaningless). Defaults to true so existing multi-filter bars are unchanged.
  showClearAll = input<boolean>(true);

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
