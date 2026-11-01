import { assertInInjectionContext, computed, signal, Signal, WritableSignal } from '@angular/core';
import { DefaultSortConfig, TablePagination, TableSort } from '../shared/components/table/table.interface';
import { urlCodecs, urlSignal } from './url-signal';

export interface TablePaginationOptions {
  defaultPage?: number;
  defaultPageSize?: number;
  pageKey?: string;
  pageSizeKey?: string;
}

export interface TablePaginationState {
  readonly page: WritableSignal<number>;
  readonly pageSize: WritableSignal<number>;
  readonly totalNums: WritableSignal<number>;
  readonly totalNumPages: WritableSignal<number>;
  readonly config: Signal<TablePagination>;
  /** A new page size starts at page one, or the reader lands past the end of the list they just resized. */
  setPageSize(pageSize: number): void;
  /**
   * The config for a list the table slices itself, never past the last page: page four of a two-page
   * list renders empty with no control to get back. Clamped on read, since an effect that writes the
   * page it reads is a loop.
   */
  clampedConfig(rowCount: number): TablePagination;
}

export function useTablePagination(opts: TablePaginationOptions = {}): TablePaginationState {
  assertInInjectionContext(useTablePagination);
  const defaultPage = opts.defaultPage ?? 1;
  const defaultPageSize = opts.defaultPageSize ?? 100;
  const pageKey = opts.pageKey ?? 'page';
  const pageSizeKey = opts.pageSizeKey ?? 'pageSize';

  const page = urlSignal(pageKey, defaultPage, urlCodecs.number());
  const pageSize = urlSignal(pageSizeKey, defaultPageSize, urlCodecs.number());
  const totalNums = signal<number>(0);
  const totalNumPages = signal<number>(0);

  const config = computed<TablePagination>(() => ({
    page: page(),
    pageSize: pageSize(),
    totalNums: totalNums(),
    totalNumPages: totalNumPages()
  }));

  return {
    page,
    pageSize,
    totalNums,
    totalNumPages,
    config,
    setPageSize(next: number) {
      pageSize.set(next);
      page.set(1);
    },
    clampedConfig(rowCount: number) {
      const lastPage = Math.max(1, Math.ceil(rowCount / pageSize()));
      return { page: Math.min(page(), lastPage), pageSize: pageSize(), totalNums: 0, totalNumPages: 0 };
    }
  };
}

export interface TableSortState {
  /** The stored sort as the table takes one, or nothing so it falls through to a column's own default. */
  readonly config: Signal<DefaultSortConfig | undefined>;
  /** Blank on the table's third click, which is its "no sort" state and drops both params off the URL. */
  set(sort: TableSort): void;
}

/**
 * The sort, in the URL under the two params the lists share, so a link carries the order it was looked
 * at in.
 */
export function useTableSort(sortByKey = 'sortBy', sortOrderKey = 'sortOrder'): TableSortState {
  assertInInjectionContext(useTableSort);
  const sortBy = urlSignal(sortByKey, '', urlCodecs.string());
  const sortOrder = urlSignal(sortOrderKey, '', urlCodecs.string());

  return {
    config: computed<DefaultSortConfig | undefined>(() => {
      const key = sortBy();
      const direction = sortOrder();
      return key && (direction === 'asc' || direction === 'desc') ? { key, direction } : undefined;
    }),
    set(sort: TableSort) {
      sortOrder.set(sort.direction || '');
      sortBy.set(sort.direction ? sort.key : '');
    }
  };
}
