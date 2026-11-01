import {
  Component,
  input,
  ChangeDetectionStrategy,
  signal,
  computed,
  output,
  OnInit,
  OnDestroy,
  ElementRef,
  viewChild,
  effect,
  afterRenderEffect,
  contentChild,
  TemplateRef,
  inject,
  DestroyRef,
  Injectable,
  untracked
} from '@angular/core';
import { Location, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent } from '../icon/icon';
import { ButtonComponent } from '../button/button';
import { SelectComponent, SelectOption } from '../select/select';
import { BadgeColor, BadgeComponent } from '../badge/badge';
import { TextColor, TextComponent } from '../text/text';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet';
import {
  TableColumn,
  TableSort,
  TablePagination,
  TableSize,
  SortDirection,
  DefaultSortConfig,
  TableSelectionConfig,
  TableSelection,
  RowAction,
  RowActionsFn,
  TableCellEdit,
  TableEditType
} from './table.interface';
import { LoadingComponent } from '../loading/loading';
import { CheckboxComponent } from '../checkbox/checkbox';
import { CopyOnRightClickDirective } from '../../directives/copy-on-right-click.directive';
import { URL_STATE_ENABLED } from '../../../utils/url-signal';

/** Where each table was scrolled to when the reader left its page, so coming back lands on the same row. */
@Injectable({ providedIn: 'root' })
class TableScrollMemory {
  private static readonly LIMIT = 10;
  private readonly topByKey = new Map<string, number>();

  save(key: string, top: number): void {
    this.topByKey.delete(key);
    this.topByKey.set(key, top);
    if (this.topByKey.size > TableScrollMemory.LIMIT) this.topByKey.delete(this.topByKey.keys().next().value!);
  }

  take(key: string): number | undefined {
    const top = this.topByKey.get(key);
    this.topByKey.delete(key);
    return top;
  }
}

/** Narrowest a column without a width gets, even when its header is one short word. */
const UNSIZED_COLUMN_MIN_WIDTH_PX = 100;
const ACTIONS_COLUMN_KEY = 'actions';
/** Text styles that change how wide a header word renders. */
const HEADER_TEXT_STYLES = [
  'fontFamily',
  'fontSize',
  'fontWeight',
  'fontStyle',
  'fontStretch',
  'fontVariantNumeric',
  'letterSpacing',
  'textTransform'
] as const;

/** Shows records in rows and columns, with sorting, pagination, row selection, row actions and inline editing. */
@Component({
  selector: 'oct-table',
  templateUrl: './table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .hide-scrollbars {
        scrollbar-width: none;
      }

      /* A cell holding oct-color-tag variant="corner" anchors that mark, so it has to be a
         containing block. Without it the mark falls back to the cell's CONTENT box, which <td>
         centres vertically, and it drifts down whenever another cell makes the row taller.

         It lives here rather than in the tag: a component's styles only reach its own template,
         and the <td> belongs to this one. Matched on what the cell contains rather than on a
         class the column sets, so a new caller cannot forget to opt in.

         A fixed column is already sticky, which is a containing block too, so it is left alone
         rather than having its stickiness overwritten. */
      td:has(.oct-tag[data-variant='corner']):not(.sticky) {
        position: relative;
      }
    `
  ],
  imports: [
    FormsModule,
    IconComponent,
    TranslateModule,
    ButtonComponent,
    SelectComponent,
    BadgeComponent,
    TextComponent,
    LoadingComponent,
    CheckboxComponent,
    CopyOnRightClickDirective,
    BottomSheetComponent,
    NgTemplateOutlet
  ]
})
export class TableComponent<T = any> implements OnInit, OnDestroy {
  readonly ELLIPSIS_PAGES = [-1, -2];
  readonly tableContainer = viewChild<ElementRef<HTMLDivElement>>('tableContainer');
  readonly tableElement = viewChild<ElementRef<HTMLTableElement>>('tableElement');
  /** The single active inline-edit input (only one cell edits at a time). */
  readonly editInput = viewChild<ElementRef<HTMLInputElement>>('editInput');

  readonly actionTemplate = contentChild<TemplateRef<any>>('actionTemplate');
  readonly footerTemplate = contentChild<TemplateRef<any>>('footerTemplate');
  readonly printActionTemplate = contentChild<TemplateRef<any>>('printActionTemplate');

  /** The columns: key and label, plus optional width, alignment, sorting, rendering and editing. */
  readonly columns = input<TableColumn<T>[]>([]);
  /** The rows. With client-side pagination pass every row; with server-side pagination pass the current page. */
  readonly data = input<T[]>([]);
  /** When true, Enter commits the cell then moves editing to the next editable
   *  cell (the row's next editable column, then the first editable column of a
   *  later row). Off by default so Enter just commits and closes, preserving the
   *  original behaviour for existing inline-edit tables. */
  readonly editAdvanceOnEnter = input(false);
  /** Covers the rows with a spinner while data loads. */
  readonly loading = input(false);
  /** Has no effect at present. Use dense for tighter rows. */
  readonly size = input<TableSize>('md');
  /** Shades every other row. */
  readonly striped = input(false);
  /** Has no effect at present: the table always draws its border. */
  readonly bordered = input(true);
  /** Draws lines between the columns. */
  readonly cellLines = input(false);
  /** Has no effect at present: the header row always stays in view while the rows scroll. */
  readonly fixedHeader = input(true);
  /** The tallest the table gets, as a CSS length. Longer content scrolls inside it. */
  readonly maxHeight = input('min(530px, calc(100dvh - 22rem))');
  /** Turns sorting on or off for the whole table. A column also needs sortable: true. */
  readonly sortable = input(true);
  /** Paging state. With totalNumPages 0 the table pages data itself; above 0, data is already one page. */
  readonly pagination = input<TablePagination | undefined>();
  /** Text shown when there are no rows. */
  readonly emptyMessage = input('No data available');
  /** Hides the icon in the empty state, which makes the empty table shorter. */
  readonly hideEmptyIcon = input(false);
  /** Has no effect at present: the loading overlay shows a spinner only. */
  readonly loadingMessage = input('Loading...');
  /** Makes rows look clickable and emits rowClick when one is clicked. */
  readonly clickableRows = input(false);
  /** The sort to start with. Takes priority over a column's defaultSort. */
  readonly defaultSort = input<DefaultSortConfig | undefined>();
  /** Adds a checkbox column. mode is 'single' or 'multiple'; key names the row field that identifies a row (default 'id'). */
  readonly selectionConfig = input<TableSelectionConfig | undefined>();
  /** Lets people drag a column edge to resize it. A column can opt out with resizable: false. */
  readonly resizableColumns = input(true);
  /** Reduces the cell padding, for long lists. */
  readonly dense = input(false);
  /** Returns the action buttons for a row, shown in the column whose key is 'actions'. On a phone they open in a bottom sheet. */
  readonly rowActions = input<RowActionsFn<T> | undefined>();
  /** Name of the button that opens the row actions on a phone, and title of their sheet. Defaults to "Actions". */
  readonly rowActionsTitle = input<string>();

  /** Emits the row that was clicked, when clickableRows is on. */
  readonly rowClick = output<T>();
  /** Emits the column key and its new width in px after a resize. */
  readonly columnResize = output<{ key: string; width: number }>();
  /** Emits the new sort, including the default sort when the table starts. */
  readonly sortChange = output<TableSort>();
  /** Emits the new page number. */
  readonly pageChange = output<number>();
  /** Emits the new page size. The table then goes back to page 1 and emits pageChange too. */
  readonly pageSizeChange = output<number>();
  /** Not emitted at present. Use rowActions for buttons in a row. */
  readonly actionClick = output<{ action: 'detail' | 'delete'; row: T }>();
  /** Emits the selected rows and their keys after every change to the selection. */
  readonly selectionChange = output<TableSelection<T>>();
  /** Emitted when an editable cell commits a new value (see {@link TableColumn.editable}). */
  readonly cellValueChange = output<TableCellEdit<T>>();

  readonly currentSort = signal<TableSort>({ key: '', direction: null });
  readonly showScrollShadow = signal<boolean>(false);
  readonly hasHorizontalScroll = signal<boolean>(false);

  readonly selectedRows = signal<T[]>([]);
  readonly selectedIds = signal<(string | number)[]>([]);

  // Only one cell edits at a time, so a single pair of signals suffices.
  readonly editingCell = signal<{ rowIndex: number; key: string } | null>(null);
  readonly editDraft = signal<string>('');

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);
  readonly isMobile = signal(false);
  readonly activeActionRow = signal<T | null>(null);
  readonly activeRowActions = computed<RowAction<T>[]>(() => {
    const row = this.activeActionRow();
    const fn = this.rowActions();
    return row && fn ? fn(row) : [];
  });

  /** Width of the widest row of action buttons plus the cell padding, measured after render. */
  readonly actionsWidth = signal<string | undefined>(undefined);
  // jsdom, which runs the unit tests, has no ResizeObserver.
  private readonly actionsObserver =
    globalThis.ResizeObserver &&
    new ResizeObserver(() => {
      const boxes = this.actionBoxes();
      const cell = boxes[0]?.parentElement;
      if (!cell) return;
      const style = getComputedStyle(cell);
      const content = Math.max(...boxes.map(box => box.offsetWidth));
      const paddingAndBorder = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + cell.offsetWidth - cell.clientWidth;
      this.actionsWidth.set(`${Math.ceil(content + paddingAndBorder)}px`);
    });

  /** Per column key, the width its header needs to show its longest word whole, measured after render. */
  readonly headerWordWidths = signal<Record<string, number>>({});
  // Header text changes when translations load; a column resize does not change it, so only text is watched.
  private readonly headerTextObserver = new MutationObserver(() => this.measureHeaderWords());

  // Column resize state signals
  readonly columnWidths = signal<Record<string, number>>({});
  readonly isResizing = signal<boolean>(false);
  private resizingColumnKey = '';
  private resizeStartX = 0;
  private resizeStartWidth = 0;

  private readonly resizeHandler = () => this.checkScrollStatus();
  private readonly scrollHandler = () => this.checkScrollStatus();
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly scrollMemory = inject(TableScrollMemory);
  /** False inside a side panel, which shows another record on the same URL. */
  private readonly urlStateEnabled = inject(URL_STATE_ENABLED);
  /** Read when a navigation starts: by the time the table is destroyed, the browser already shows the next page. */
  private leaving?: { url: string; top: number };
  private readonly mouseMoveHandler = (e: MouseEvent) => this.onResizeMove(e);
  private readonly mouseUpHandler = () => this.onResizeEnd();

  readonly internalPagination = signal<TablePagination | undefined>(undefined);

  readonly activePagination = computed(() => {
    const internal = this.internalPagination();
    const external = this.pagination();
    return internal ?? external;
  });

  // Enhanced columns with selection column injection and action column optimization
  readonly enhancedColumns = computed(() => {
    const originalColumns = this.columns() || [];
    const hasSelection = this.hasSelection();
    const collapseActionsToSheet = !!this.rowActions() && this.isMobile();

    // Optimize columns - handle fixed positioning
    const optimizedColumns = originalColumns.map(column => {
      if (column.fixed) {
        return {
          ...column,
          // Default positioning: actions column to right, others to left
          fixedPosition: (column.fixedPosition || (this.isActionsColumn(column) ? 'right' : 'left')) as 'left' | 'right',
          zIndex: column.zIndex || 1,
          ...(this.isActionsColumn(column) && {
            width: collapseActionsToSheet ? '56px' : column.width || this.actionsWidth(),
            minWidth: collapseActionsToSheet ? '56px' : column.minWidth,
            maxWidth: collapseActionsToSheet ? '56px' : column.maxWidth,
            align: (column.align || 'center') as 'left' | 'center' | 'right',
            sortable: column.sortable ?? false,
            filterable: column.filterable ?? false
          })
        };
      }

      if (collapseActionsToSheet && this.isActionsColumn(column)) {
        return {
          ...column,
          width: '56px',
          minWidth: '56px',
          maxWidth: '56px'
        };
      }

      if (this.isActionsColumn(column) && !column.width) {
        return { ...column, width: this.actionsWidth() };
      }

      return column;
    });

    if (!hasSelection) return optimizedColumns;

    const selectionColumn: TableColumn<T> = {
      key: '_selection',
      label: '',
      sortable: false,
      filterable: false,
      width: '48px',
      minWidth: '48px',
      align: 'center'
    };

    return [selectionColumn, ...optimizedColumns];
  });

  // Computed properties - optimized for performance
  readonly sortedData = computed(() => {
    const data = this.data();
    const sort = this.currentSort();

    if (!sort.key || !sort.direction) return data;

    return [...data].sort((a, b) => {
      const aValue = this.getNestedValue(a, sort.key);
      const bValue = this.getNestedValue(b, sort.key);

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sort.direction === 'desc' ? -comparison : comparison;
    });
  });

  readonly filteredData = computed(() => {
    return this.sortedData();
  });

  readonly paginatedData = computed(() => {
    const filtered = this.filteredData();
    const pagination = this.activePagination();

    if (!pagination || this.isServerSidePagination()) return filtered;

    const start = (pagination.page - 1) * pagination.pageSize;
    return filtered.slice(start, start + pagination.pageSize);
  });

  readonly totalPages = computed(() => {
    const pagination = this.activePagination();
    if (!pagination) return 1;

    // Server-side pagination uses API's totalNumPages
    if (this.isServerSidePagination()) {
      return pagination.totalNumPages || 1;
    }

    // Client-side pagination calculates from filtered data
    return Math.ceil(this.filteredData().length / pagination.pageSize);
  });

  readonly hasFixedColumns = computed(() => {
    return this.columns().some(col => col.fixed);
  });

  readonly hasFixedActionColumn = computed(() => {
    return this.columns().some(col => this.isActionsColumn(col) && col.fixed);
  });

  // Check if column is the last non-fixed column
  isLastNonFixedColumn(column: TableColumn<T>): boolean {
    const columns = this.enhancedColumns();
    const nonFixedColumns = columns.filter(col => !col.fixed);
    if (nonFixedColumns.length === 0) return false;
    const lastNonFixed = nonFixedColumns[nonFixedColumns.length - 1];
    return column.key === lastNonFixed.key;
  }

  // Server-side pagination detection - optimized
  readonly isServerSidePagination = computed(() => {
    const pagination = this.activePagination();
    return (pagination?.totalNumPages ?? 0) > 0;
  });

  // Page size options for select component
  readonly pageSizeOptions = computed((): SelectOption[] => [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 200, label: '200' }
  ]);

  private readonly paginationSyncEffect = effect(() => {
    const external = this.pagination();
    if (!external) return;
    this.internalPagination.set(external);
  });

  private readonly defaultSortEffect = effect(() => {
    const defaultSort = this.defaultSort();
    const columns = this.columns();
    const currentSort = this.currentSort();

    if (currentSort.key === '' && currentSort.direction === null) {
      if (defaultSort && defaultSort.key && defaultSort.direction) {
        this.currentSort.set(defaultSort);
        this.sortChange.emit(defaultSort);
      } else {
        const defaultSortColumn = columns.find(col => col.defaultSort);
        if (defaultSortColumn && defaultSortColumn.defaultSort) {
          const sortConfig = {
            key: defaultSortColumn.key,
            direction: defaultSortColumn.defaultSort
          };
          this.currentSort.set(sortConfig);
          this.sortChange.emit(sortConfig);
        }
      }
    }
  });

  // Optimized scroll status checking
  private readonly scrollCheckEffect = effect(() => {
    // Track changes that affect table layout
    this.paginatedData();
    this.columns();
    this.tableMinWidth();

    queueMicrotask(() => this.checkScrollStatus());
  });

  constructor() {
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => this.isMobile.set(result.matches));

    // Focus + select the inline-edit input as soon as it renders, so the user can type immediately.
    afterRenderEffect({
      write: () => {
        if (this.editingCell()) {
          const el = this.editInput()?.nativeElement;
          el?.focus();
          el?.select();
        }
      }
    });

    if (this.urlStateEnabled) {
      this.router.events
        .pipe(
          filter(event => event instanceof NavigationStart),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => (this.leaving = { url: this.location.path(true), top: this.tableContainer()?.nativeElement.scrollTop ?? 0 }));

      // Back on a list, the scroll waits for the first rows: before they load there is nothing to scroll.
      const scrollRestore = afterRenderEffect({
        write: () => {
          if (this.loading() || this.paginatedData().length === 0) return;
          scrollRestore.destroy();
          const top = this.scrollMemory.take(this.scrollKey(this.location.path(true)));
          const container = this.tableContainer()?.nativeElement;
          if (top && container) container.scrollTop = top;
        }
      });
    }

    // Button labels can grow after the first render (translations, fonts), so every box is watched.
    afterRenderEffect({
      read: () => {
        this.paginatedData();
        this.dense();
        this.isMobile();
        const observer = this.actionsObserver;
        if (!observer) return;
        observer.disconnect();
        this.actionBoxes().forEach(box => observer.observe(box));
      }
    });

    afterRenderEffect({
      read: () => {
        this.enhancedColumns();
        this.dense();
        untracked(() => this.measureHeaderWords());
        this.headerTextObserver.disconnect();
        this.headerLabels().forEach(label => this.headerTextObserver.observe(label, { characterData: true, childList: true, subtree: true }));
      }
    });
    document.fonts?.ready.then(() => this.measureHeaderWords());
  }

  private headerLabels(): HTMLElement[] {
    return Array.from(this.tableElement()?.nativeElement.querySelectorAll<HTMLElement>('[data-header-label]') ?? []);
  }

  private measureHeaderWords() {
    const labels = this.headerLabels();
    if (!labels.length) return;
    // Measured outside the table, so the header text watcher does not see it.
    const probe = document.body.appendChild(document.createElement('span'));
    probe.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;white-space:nowrap';
    const widths: Record<string, number> = {};
    for (const label of labels) {
      const row = label.parentElement;
      const cell = row?.closest('th');
      const key = label.dataset['headerLabel'];
      if (!row || !cell || !key) continue;
      const labelStyle = getComputedStyle(label);
      HEADER_TEXT_STYLES.forEach(name => (probe.style[name] = labelStyle[name]));
      const longestWord = Math.max(
        0,
        ...(label.textContent ?? '')
          .trim()
          .split(/\s+/)
          .map(word => {
            probe.textContent = word;
            return probe.getBoundingClientRect().width;
          })
      );
      const cellStyle = getComputedStyle(cell);
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      const besideLabel = Array.from(row.children)
        .filter(child => child !== label)
        .reduce((sum, child) => sum + (child as HTMLElement).offsetWidth + gap, 0);
      widths[key] = Math.ceil(longestWord + besideLabel + (parseFloat(cellStyle.paddingLeft) || 0) + (parseFloat(cellStyle.paddingRight) || 0));
    }
    probe.remove();
    const current = this.headerWordWidths();
    const changed = Object.keys(widths).length !== Object.keys(current).length || Object.keys(widths).some(key => widths[key] !== current[key]);
    if (changed) {
      this.headerWordWidths.set(widths);
    }
  }

  /** A page can hold more than one table, so the columns tell them apart. */
  private scrollKey(url: string): string {
    return `${url} ${this.columns()
      .map(column => column.key)
      .join()}`;
  }

  private scrollToFirstRow(): void {
    const container = this.tableContainer()?.nativeElement;
    if (container) container.scrollTop = 0;
  }

  private actionBoxes(): HTMLElement[] {
    return Array.from(this.tableElement()?.nativeElement.querySelectorAll<HTMLElement>('[data-row-actions]') ?? []);
  }

  ngOnInit(): void {
    // Setup scroll detection for shadow
    this.setupScrollDetection();
  }

  ngOnDestroy(): void {
    // Cleanup event listeners
    window.removeEventListener('resize', this.resizeHandler);
    this.actionsObserver?.disconnect();
    this.headerTextObserver.disconnect();
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('mouseup', this.mouseUpHandler);

    // Kept only when the reader went to another page: a dialog's table closes on the same URL.
    if (this.leaving?.top && this.leaving.url !== this.location.path(true)) {
      this.scrollMemory.save(this.scrollKey(this.leaving.url), this.leaving.top);
    }

    // Cleanup scroll event listener from table container
    const container = this.tableContainer();
    if (container?.nativeElement) {
      container.nativeElement.removeEventListener('scroll', this.scrollHandler);
    }
  }

  // Expose Math for template
  readonly Math = Math;
  readonly Number = Number;

  // Public methods
  sort(columnKey: string): void {
    const column = this.columns().find(col => col.key === columnKey);
    if (!column || !this.isColumnSortable(column)) return;

    const currentSort = this.currentSort();
    let direction: SortDirection = 'asc';

    if (currentSort.key === columnKey) {
      direction = currentSort.direction === 'asc' ? 'desc' : currentSort.direction === 'desc' ? null : 'asc';
    } else {
      direction = column.defaultSort || 'asc';
    }

    const newSort = { key: columnKey, direction };
    this.currentSort.set(newSort);
    this.sortChange.emit(newSort);
  }

  setSort(sort: TableSort): void {
    this.currentSort.set(sort);
    this.sortChange.emit(sort);
  }

  resetToDefaultSort(): void {
    const defaultSort = this.defaultSort();
    const columns = this.columns();

    if (defaultSort && defaultSort.key && defaultSort.direction) {
      this.setSort(defaultSort);
    } else {
      const defaultSortColumn = columns.find(col => col.defaultSort);
      if (defaultSortColumn && defaultSortColumn.defaultSort) {
        this.setSort({
          key: defaultSortColumn.key,
          direction: defaultSortColumn.defaultSort
        });
      } else {
        this.setSort({ key: '', direction: null });
      }
    }
  }

  onRowClick(row: T): void {
    this.rowClick.emit(row);
  }

  onPageChange(page: number): void {
    const currentPagination = this.activePagination();
    if (currentPagination && page !== currentPagination.page) {
      // Update internal pagination signal to trigger recomputation
      this.internalPagination.set({
        ...currentPagination,
        page
      });
      this.scrollToFirstRow();

      // Emit the change for parent components
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const pageSize = Number(target.value);
    const currentPagination = this.activePagination();
    if (currentPagination && pageSize !== currentPagination.pageSize) {
      this.pageSizeChange.emit(pageSize);
    }
  }

  onPageSizeSelectChange(option: SelectOption | SelectOption[] | null): void {
    const currentPagination = this.activePagination();
    if (!option || Array.isArray(option) || !currentPagination) return;

    const pageSize = Number(option.value);
    if (pageSize !== currentPagination.pageSize) {
      this.internalPagination.set({
        ...currentPagination,
        pageSize,
        page: 1
      });
      this.scrollToFirstRow();

      // Emit the change for parent components
      this.pageSizeChange.emit(pageSize);

      // Also emit page change to reset to page 1
      this.pageChange.emit(1);
    }
  }

  getSortDirection(columnKey: string): SortDirection {
    const sort = this.currentSort();
    return sort.key === columnKey ? sort.direction : null;
  }

  /** A column sorts only when it asks to. The header renders as a sort button only then. */
  isColumnSortable(column: TableColumn<T>): boolean {
    return this.sortable() && !!column.sortable;
  }

  ariaSort(columnKey: string): 'ascending' | 'descending' | 'none' {
    const direction = this.getSortDirection(columnKey);
    if (direction === 'asc') return 'ascending';
    if (direction === 'desc') return 'descending';
    return 'none';
  }

  getSortIcon(columnKey: string): string {
    const direction = this.getSortDirection(columnKey);
    if (direction === 'asc') return 'ChevronUp';
    if (direction === 'desc') return 'ChevronDown';
    return 'ChevronsUpDown';
  }

  getColumnValue(row: T, column: TableColumn<T>): string {
    const value = this.getNestedValue(row, column.key);

    if (column.render) {
      return column.render(value, row, column);
    }

    return value?.toString() || '';
  }

  // ── Inline editing ────────────────────────────────────────────────────────

  isCellEditable(column: TableColumn<T>, row: T): boolean {
    const editable = column.editable;
    if (typeof editable === 'function') {
      return editable(row);
    }
    return editable === true;
  }

  isNumberEdit(column: TableColumn<T>): boolean {
    return column.editType === TableEditType.Number;
  }

  isCellEditing(rowIndex: number, column: TableColumn<T>): boolean {
    const cell = this.editingCell();
    return !!cell && cell.rowIndex === rowIndex && cell.key === column.key;
  }

  startEdit(rowIndex: number, column: TableColumn<T>, row: T, event: Event): void {
    event.stopPropagation();
    if (!this.isCellEditable(column, row)) return;
    this.beginEdit(rowIndex, column, row);
  }

  /** Seed the draft from the cell's current value and open it for editing. The
   *  afterRender focus effect then focuses + selects the input. */
  private beginEdit(rowIndex: number, column: TableColumn<T>, row: T): void {
    const current = this.getNestedValue(row, column.key);
    this.editDraft.set(current == null ? '' : String(current));
    this.editingCell.set({ rowIndex, key: column.key });
  }

  onEditInput(event: Event): void {
    this.editDraft.set((event.target as HTMLInputElement).value);
  }

  cancelEdit(): void {
    this.editingCell.set(null);
    this.editDraft.set('');
  }

  /**
   * Validate the draft and, if it is a real change, emit {@link cellValueChange}.
   * Number columns: reject NaN, round when {@link TableColumn.editInteger}, clamp to
   * {@link TableColumn.editMin}. Empty / unchanged / invalid input silently reverts.
   */
  commitEdit(rowIndex: number, column: TableColumn<T>, row: T): void {
    if (!this.isCellEditing(rowIndex, column)) return; // already closed (e.g. Enter then blur)

    const raw = this.editDraft().trim();
    const original = this.getNestedValue(row, column.key);

    if (column.editType === TableEditType.Number) {
      if (raw === '') {
        // Clearing the cell: emit null, but only when there was actually a value to clear.
        if (original != null) {
          this.cellValueChange.emit({ row, column, rowIndex, value: null });
        }
        this.cancelEdit();
        return;
      }
      let num = Number(raw);
      if (!Number.isFinite(num)) {
        this.cancelEdit();
        return;
      }
      if (column.editInteger) {
        num = Math.round(num);
      }
      if (column.editMin != null && num < column.editMin) {
        num = column.editMin;
      }
      if (original != null && num === Number(original)) {
        this.cancelEdit();
        return;
      }
      this.cellValueChange.emit({ row, column, rowIndex, value: num });
    } else {
      if (raw === String(original ?? '')) {
        this.cancelEdit();
        return;
      }
      this.cellValueChange.emit({ row, column, rowIndex, value: raw });
    }

    this.cancelEdit();
  }

  /**
   * Nudge the in-progress number draft up/down by the column's {@link TableColumn.editStep}
   * (default 1), clamped to {@link TableColumn.editMin}. Used by the stepper buttons; the
   * caller suppresses focus loss so this never commits or closes the editor.
   */
  stepEdit(direction: 1 | -1, column: TableColumn<T>): void {
    const step = column.editStep ?? 1;
    const current = Number(this.editDraft());
    const base = Number.isFinite(current) ? current : (column.editMin ?? 0);
    let next = base + direction * step;
    if (column.editInteger) {
      next = Math.round(next);
    }
    if (column.editMin != null && next < column.editMin) {
      next = column.editMin;
    }
    // Guard against binary float drift (e.g. 0.1 + 0.2).
    next = Math.round((next + Number.EPSILON) * 1e6) / 1e6;
    this.editDraft.set(String(next));
  }

  /** Enter commits and, when {@link editAdvanceOnEnter} is set, jumps to the next
   *  editable cell (so a run of numbers can be typed with Enter between them);
   *  Esc cancels. Stops propagation so table-level key handlers don't fire. */
  onEditKeydown(event: KeyboardEvent, rowIndex: number, column: TableColumn<T>, row: T): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      const next = this.editAdvanceOnEnter() ? this.findNextEditableCell(rowIndex, column) : null;
      this.commitEdit(rowIndex, column, row);
      if (next) {
        this.beginEdit(next.rowIndex, next.column, next.row);
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelEdit();
    }
    event.stopPropagation();
  }

  /**
   * The next cell open for inline editing after `(rowIndex, column)`: the next
   * editable column in the same row, else the first editable column of a later
   * row. Null when the current cell is the last editable one. Skips
   * non-editable columns (selection / actions / read-only) and rows.
   */
  private findNextEditableCell(rowIndex: number, column: TableColumn<T>): { rowIndex: number; column: TableColumn<T>; row: T } | null {
    const rows = this.paginatedData();
    const cols = this.enhancedColumns();
    const startColIdx = cols.findIndex(c => c.key === column.key);
    if (startColIdx === -1 || rowIndex < 0 || rowIndex >= rows.length) {
      return null;
    }
    for (let c = startColIdx + 1; c < cols.length; c += 1) {
      if (this.isCellEditable(cols[c], rows[rowIndex])) {
        return { rowIndex, column: cols[c], row: rows[rowIndex] };
      }
    }
    for (let r = rowIndex + 1; r < rows.length; r += 1) {
      for (let c = 0; c < cols.length; c += 1) {
        if (this.isCellEditable(cols[c], rows[r])) {
          return { rowIndex: r, column: cols[c], row: rows[r] };
        }
      }
    }
    return null;
  }

  // Private methods
  private checkScrollStatus(): void {
    const container = this.tableContainer();
    if (container?.nativeElement) {
      const element = container.nativeElement;
      const hasHorizontalScroll = element.scrollWidth > element.clientWidth;
      const isScrolledToEnd = element.scrollLeft >= element.scrollWidth - element.clientWidth - 1;

      this.hasHorizontalScroll.set(hasHorizontalScroll);
      // showScrollShadow is true when scrolled to end (used to hide shadows)
      this.showScrollShadow.set(isScrolledToEnd);
    }
  }

  private setupScrollDetection(): void {
    // Use queueMicrotask for better performance
    queueMicrotask(() => {
      const container = this.tableContainer()?.nativeElement;
      if (!container) return;

      container.addEventListener('scroll', this.scrollHandler);
      window.addEventListener('resize', this.resizeHandler);
      this.checkScrollStatus();
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Optimized pagination pages calculation
  readonly paginationPages = computed(() => {
    const total = this.totalPages();
    const current = this.activePagination()?.page || 1;

    // If total pages <= 7, show all pages (no need for ellipsis)
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: number[] = [];

    // Always show first page
    pages.push(1);

    // Calculate the current page window (current ± 1)
    const windowStart = Math.max(1, current - 1);
    const windowEnd = Math.min(total, current + 1);

    // Determine if we need ellipsis after first page
    // Show ellipsis if there's a gap between first page and current window
    if (windowStart > 2) {
      pages.push(this.ELLIPSIS_PAGES[0]); // First ellipsis
    }

    // Add the current page window (excluding first and last if already added)
    for (let i = windowStart; i <= windowEnd; i++) {
      if (i !== 1 && i !== total) {
        // Don't duplicate first/last pages
        pages.push(i);
      }
    }

    // Determine if we need ellipsis before last page
    // Show ellipsis if there's a gap between current window and last page
    if (windowEnd < total - 1) {
      pages.push(this.ELLIPSIS_PAGES[1]); // Second ellipsis
    }

    // Always show last page (if different from first)
    if (total > 1) {
      pages.push(total);
    }

    return pages;
  });

  // Optimized trackBy functions
  readonly trackByColumn = (index: number, column: TableColumn<T>): string => column.key;
  readonly trackByRow = (index: number, row: T): any => {
    if (this.hasSelection()) {
      return this.getNestedValue(row, this.selectionKey()) || index;
    }
    return (row as any).id || index;
  };

  readonly hasSelection = computed(() => !!this.selectionConfig());

  readonly selectionKey = computed(() => this.selectionConfig()?.key || 'id');

  readonly isMultipleSelection = computed(() => this.selectionConfig()?.mode === 'multiple');

  readonly isAllSelected = computed(() => {
    const data = this.paginatedData();
    const selectedIds = this.selectedIds();
    const selectionKey = this.selectionKey();

    if (!this.hasSelection() || data.length === 0) return false;

    return data.every(row => {
      const rowId = this.getNestedValue(row, selectionKey);
      return selectedIds.includes(rowId);
    });
  });

  readonly isIndeterminate = computed(() => {
    const data = this.paginatedData();
    const selectedIds = this.selectedIds();
    const selectionKey = this.selectionKey();

    if (!this.hasSelection() || data.length === 0 || selectedIds.length === 0) return false;

    const selectedCount = data.filter(row => {
      const rowId = this.getNestedValue(row, selectionKey);
      return selectedIds.includes(rowId);
    }).length;

    return selectedCount > 0 && selectedCount < data.length;
  });

  readonly currentSelection = computed(
    (): TableSelection<T> => ({
      selectedRows: this.selectedRows(),
      selectedIds: this.selectedIds(),
      isAllSelected: this.isAllSelected(),
      isIndeterminate: this.isIndeterminate()
    })
  );

  readonly isStatusColumn = (column: TableColumn<T>): boolean => column.key.toLowerCase().includes('status');
  readonly isSelectionColumn = (column: TableColumn<T>): boolean => column.key === '_selection';

  getStatusBadgeColor(row: T, column: TableColumn<T>): BadgeColor {
    const value = this.getNestedValue(row, column.key)?.toString().toLowerCase() || '';

    const colorMap: Record<string, BadgeColor> = {
      active: 'success',
      available: 'success',
      shortlisted: 'success',
      hired: 'success',
      new: 'success',
      completed: 'neutral',
      approved: 'success',
      processed: 'success',
      unprocessed: 'warning',
      inactive: 'error',
      'out-of-stock': 'error',
      deactivated: 'error',
      pending: 'warning',
      discontinued: 'neutral',
      draft: 'neutral'
    };

    return colorMap[value] || 'neutral';
  }

  getStatusBadgeText(row: T, column: TableColumn<T>): string {
    const value = this.getNestedValue(row, column.key)?.toString() || '';
    if (!value) return '';

    const lowerValue = value.toLowerCase();
    if (lowerValue === 'out-of-stock') return 'Out of Stock';

    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  onActionClick(action: 'detail' | 'delete', row: T, event?: Event): void {
    // Stop event propagation to prevent triggering row click
    if (event) {
      event.stopPropagation();
    }

    // Emit action events for parent components to handle
    this.actionClick.emit({ action, row });
  }

  openRowActionsSheet(row: T, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.activeActionRow.set(row);
  }

  closeRowActionsSheet(): void {
    this.activeActionRow.set(null);
  }

  onRowActionTrigger(action: RowAction<T>, row: T, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (action.disabled || action.loading) return;
    action.onClick(row);
    if (this.activeActionRow()) {
      this.activeActionRow.set(null);
    }
  }

  getCellClass(column: TableColumn<T>, row: T): string | string[] | null {
    const baseClasses: string[] = [];

    // Apply custom classes if provided
    let customClasses: string | string[] | null = null;
    if (column.cellClass) {
      if (typeof column.cellClass === 'function') {
        const value = this.getNestedValue(row, column.key);
        customClasses = column.cellClass(value, row, column);
      } else {
        customClasses = column.cellClass;
      }
    }

    // Combine base and custom classes
    if (customClasses) {
      const customArray = Array.isArray(customClasses) ? customClasses : [customClasses];
      baseClasses.push(...customArray);
    }

    return baseClasses.length > 0 ? baseClasses : null;
  }

  getCellTextColor(column: TableColumn<T>, row: T): TextColor {
    const resolver = column.cellTextColor;
    if (!resolver) {
      return '1';
    }
    if (typeof resolver === 'function') {
      return resolver(this.getNestedValue(row, column.key), row, column);
    }
    return resolver;
  }

  getHeaderClass(column: TableColumn<T>): string | string[] | null {
    const baseClasses: string[] = [];
    // Apply custom header classes if provided
    if (column.headerClass) {
      const customArray = Array.isArray(column.headerClass) ? column.headerClass : [column.headerClass];
      baseClasses.push(...customArray);
    }

    return baseClasses.length > 0 ? baseClasses : null;
  }

  isRowSelected(row: T): boolean {
    if (!this.hasSelection()) return false;

    const rowId = this.getNestedValue(row, this.selectionKey());
    return this.selectedIds().includes(rowId);
  }

  toggleRowSelection(row: T): void {
    if (!this.hasSelection()) return;

    const config = this.selectionConfig()!;
    const selectionKey = this.selectionKey();
    const rowId = this.getNestedValue(row, selectionKey);
    const currentSelectedIds = this.selectedIds();
    const currentSelectedRows = this.selectedRows();

    if (config.mode === 'single') {
      // Single selection mode - replace current selection
      const isCurrentlySelected = currentSelectedIds.includes(rowId);
      if (isCurrentlySelected) {
        // Deselect if already selected
        this.selectedIds.set([]);
        this.selectedRows.set([]);
      } else {
        // Select this row only
        this.selectedIds.set([rowId]);
        this.selectedRows.set([row]);
      }
    } else {
      // Multiple selection mode - toggle selection
      const isCurrentlySelected = currentSelectedIds.includes(rowId);
      if (isCurrentlySelected) {
        // Remove from selection
        const newSelectedIds = currentSelectedIds.filter(id => id !== rowId);
        const newSelectedRows = currentSelectedRows.filter(r => this.getNestedValue(r, selectionKey) !== rowId);
        this.selectedIds.set(newSelectedIds);
        this.selectedRows.set(newSelectedRows);
      } else {
        // Add to selection
        this.selectedIds.set([...currentSelectedIds, rowId]);
        this.selectedRows.set([...currentSelectedRows, row]);
      }
    }

    // Emit selection change
    this.selectionChange.emit(this.currentSelection());
  }

  toggleAllSelection(): void {
    if (!this.hasSelection() || !this.isMultipleSelection()) return;

    const data = this.paginatedData();
    const selectionKey = this.selectionKey();

    if (this.isAllSelected()) {
      this.selectedIds.set([]);
      this.selectedRows.set([]);
    } else {
      const currentSelectedIds = this.selectedIds();
      const currentSelectedRows = this.selectedRows();

      const newItemsToAdd = data.filter(row => {
        const rowId = this.getNestedValue(row, selectionKey);
        return !currentSelectedIds.includes(rowId);
      });

      const newIdsToAdd = newItemsToAdd.map(row => this.getNestedValue(row, selectionKey));

      this.selectedIds.set([...currentSelectedIds, ...newIdsToAdd]);
      this.selectedRows.set([...currentSelectedRows, ...newItemsToAdd]);
    }

    this.selectionChange.emit(this.currentSelection());
  }

  clearSelection(): void {
    this.selectedIds.set([]);
    this.selectedRows.set([]);
    this.selectionChange.emit(this.currentSelection());
  }

  getSelection(): TableSelection<T> {
    return this.currentSelection();
  }

  // Column resize methods
  isColumnResizable(column: TableColumn<T>): boolean {
    // Don't allow resize on selection column or if resizable is explicitly false
    if (column.key === '_selection') return false;
    if (column.resizable === false) return false;
    // Default to resizableColumns input value
    return this.resizableColumns();
  }

  isColumnBeingResized(columnKey: string): boolean {
    return this.isResizing() && this.resizingColumnKey === columnKey;
  }

  /**
   * The table never gets narrower than its columns, so a narrow screen scrolls it instead of squeezing them.
   * Columns without a width share the space left equally, so each gets the widest one's floor.
   * A percent column takes its share of the whole table, so the rest is scaled up to leave room for it.
   */
  readonly tableMinWidth = computed(() => {
    const wordWidths = this.headerWordWidths();
    let sizedTotal = 0;
    let percentTotal = 0;
    const unsizedFloors: number[] = [];
    for (const column of this.enhancedColumns()) {
      const width = this.getColumnWidth(column);
      if (width.endsWith('px')) {
        sizedTotal += parseFloat(width);
      } else if (width.endsWith('%')) {
        percentTotal += parseFloat(width);
      } else if (!this.isActionsColumn(column)) {
        // The actions column sizes itself once its buttons render.
        unsizedFloors.push(Math.max(UNSIZED_COLUMN_MIN_WIDTH_PX, wordWidths[column.key] ?? 0, this.resolveResizeMinWidthPx(column)));
      }
    }
    const floorTotal = sizedTotal + unsizedFloors.length * Math.max(0, ...unsizedFloors);
    // Percent columns fill the whole table, so only the px columns set a floor.
    if (percentTotal >= 100) {
      return sizedTotal;
    }
    return Math.ceil(floorTotal / (1 - percentTotal / 100));
  });

  isActionsColumn(column: TableColumn<T>): boolean {
    return column.key === ACTIONS_COLUMN_KEY;
  }

  getColumnWidth(column: TableColumn<T>): string {
    const dynamicWidth = this.columnWidths()[column.key];
    if (dynamicWidth) {
      return `${dynamicWidth}px`;
    }
    if (column.width) {
      return typeof column.width === 'number' ? `${column.width}px` : column.width;
    }
    return 'auto';
  }

  onResizeStart(event: MouseEvent, column: TableColumn<T>): void {
    if (!this.isColumnResizable(column)) return;

    event.preventDefault();
    event.stopPropagation();

    this.isResizing.set(true);
    this.resizingColumnKey = column.key;
    this.resizeStartX = event.clientX;

    // Get the current width of the header cell
    const headerCell = (event.target as HTMLElement).closest('th');
    if (headerCell) {
      this.resizeStartWidth = headerCell.offsetWidth;
    }

    // Add document-level event listeners for drag
    document.addEventListener('mousemove', this.mouseMoveHandler);
    document.addEventListener('mouseup', this.mouseUpHandler);

    // Add cursor style to body for better UX during drag
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }

  /** Minimum width (px) when resizing if {@link TableColumn.minWidth} is unset; matches selection column floor. */
  private resolveResizeMinWidthPx(column: TableColumn<T>): number {
    let minWidthPx = 48;
    if (column.minWidth != null && column.minWidth !== '') {
      const parsed = typeof column.minWidth === 'number' ? column.minWidth : Number.parseInt(String(column.minWidth), 10);
      if (Number.isFinite(parsed)) {
        minWidthPx = parsed;
      }
    }
    return minWidthPx;
  }

  private onResizeMove(event: MouseEvent): void {
    if (!this.isResizing() || !this.resizingColumnKey) return;

    const deltaX = event.clientX - this.resizeStartX;
    let newWidth = this.resizeStartWidth + deltaX;

    // Get column for min/max constraints
    const column = this.columns().find(c => c.key === this.resizingColumnKey);
    if (column) {
      newWidth = Math.max(newWidth, this.resolveResizeMinWidthPx(column));

      // Apply maximum width constraint if defined
      if (column.maxWidth) {
        const maxWidth = typeof column.maxWidth === 'number' ? column.maxWidth : Number.parseInt(String(column.maxWidth), 10);
        newWidth = Math.min(newWidth, maxWidth);
      }
    }

    // Update the column width signal
    this.columnWidths.update(widths => ({
      ...widths,
      [this.resizingColumnKey]: newWidth
    }));
  }

  private onResizeEnd(): void {
    if (this.isResizing() && this.resizingColumnKey) {
      const finalWidth = this.columnWidths()[this.resizingColumnKey];
      if (finalWidth) {
        this.columnResize.emit({ key: this.resizingColumnKey, width: finalWidth });
      }
    }

    // Reset resize state
    this.isResizing.set(false);
    this.resizingColumnKey = '';
    this.resizeStartX = 0;
    this.resizeStartWidth = 0;

    // Remove document-level event listeners
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('mouseup', this.mouseUpHandler);

    // Reset cursor and selection
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }
}
