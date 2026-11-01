import { TextColor } from '../text/text';

export type SortDirection = 'asc' | 'desc' | null;

/** Inline-edit input modes for an editable column (see {@link TableColumn.editType}). */
export const TableEditType = {
  Text: 'text',
  Number: 'number'
} as const;
export type TableEditType = (typeof TableEditType)[keyof typeof TableEditType];

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  fixed?: boolean;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, column: TableColumn<T>) => string;
  template?: any;
  defaultSort?: SortDirection;
  cellClass?: string | string[] | ((value: any, row: T, column: TableColumn<T>) => string | string[]);
  /** oct-text color for default-rendered cells; static or per-row. Defaults to '1'. */
  cellTextColor?: TextColor | ((value: any, row: T, column: TableColumn<T>) => TextColor);
  headerClass?: string | string[];
  fixedPosition?: 'left' | 'right';
  zIndex?: number;
  resizable?: boolean;
  /** When true, cell allows wrapped/stacked content (disables nowrap + ellipsis clipping). */
  multiline?: boolean;
  /**
   * Makes this column's cells inline-editable (click-to-edit). Pass a boolean for
   * a whole column, or a per-row predicate to exclude specific rows (e.g. aggregate
   * or summary rows). Default: not editable. Editing emits {@link TableComponent.cellValueChange}.
   */
  editable?: boolean | ((row: T) => boolean);
  /** Input mode when editing. Default 'text'. */
  editType?: TableEditType;
  /** For {@link editType} 'number': lower bound applied on commit. */
  editMin?: number;
  /** For {@link editType} 'number': when true, only whole numbers are accepted (decimals rounded). */
  editInteger?: boolean;
  /** For {@link editType} 'number': increment used by the stepper buttons / arrow keys. Default 1. */
  editStep?: number;
}

/** Payload emitted by {@link TableComponent.cellValueChange} when an editable cell commits a new value. */
export interface TableCellEdit<T = any> {
  row: T;
  column: TableColumn<T>;
  /** Index of the row within the table's current data() input. */
  rowIndex: number;
  /** Committed value: a number for editType 'number', a string otherwise, or null when a number cell is cleared. */
  value: number | string | null;
}

export interface TableFilter {
  key: string;
  value: any;
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte';
}

export interface TableSort {
  key: string;
  direction: SortDirection;
}

export interface DefaultSortConfig {
  key: string;
  direction: SortDirection;
}

export interface TablePagination {
  page: number;
  pageSize: number;
  totalNums: number;
  totalNumPages: number;
}

export interface TableSelectionConfig {
  mode: 'single' | 'multiple';
  key?: string;
  /** false hides the checkbox column, as leaving selectionConfig out does. Default true. */
  enabled?: boolean;
}

export interface TableSelection<T = any> {
  selectedRows: T[];
  selectedIds: (string | number)[];
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

export interface TableEmitEvents<T = any> {
  rowClick: T;
  sortChange: TableSort;
  filterChange: TableFilter[];
  pageChange: number;
  pageSizeChange: number;
  selectionChange: TableSelection<T>;
}

export type RowActionVariant = 'ghost' | 'link';
export type RowActionColor = 'primary' | 'neutral' | 'success' | 'error' | 'warning' | 'info';

export interface RowAction<T = any> {
  key: string;
  label: string;
  icon?: string;
  color?: RowActionColor;
  variant?: RowActionVariant;
  disabled?: boolean;
  loading?: boolean;
  href?: string;
  showLabel?: boolean;
  onClick: (row: T) => void;
}

export type RowActionsFn<T = any> = (row: T) => RowAction<T>[];

/**
 * For a page whose table is the whole page. The 19rem is what the queue pages spend on chrome above
 * and below it, measured; the component default reserves 22rem and caps at 530px.
 */
export const FULL_PAGE_TABLE_MAX_HEIGHT = 'calc(100dvh - 19rem)';
