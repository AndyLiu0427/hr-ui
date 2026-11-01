import { NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  input,
  linkedSignal,
  model,
  output,
  TemplateRef,
  viewChild,
  viewChildren
} from '@angular/core';

import { DialogComponent } from '../dialog/dialog';
import { IconComponent } from '../icon/icon';
import { KbdComponent } from '../kbd/kbd';
import { TextComponent } from '../text/text';
import { SearchPanelEmptyDirective, SearchPanelRowDirective } from './search-panel.directives';
import type { SearchPanelItem } from './search-panel.model';
import { groupSearchPanelItems } from './search-panel.util';

// Measured: 3600 rows is ~47k DOM nodes and 36ms per arrow key. Nobody arrow-keys to result
// 3000 in a search box, so the list is capped and the overflow is counted rather than drawn.
const DEFAULT_MAX_VISIBLE_ITEMS = 100;

// scroll-mt clears the sticky group heading when the arrow keys scroll a row into view.
// No transition: the arrow keys move the highlight, and a keyboard move shows at once.
const ROW_BASE =
  'flex items-center gap-3 px-2 py-1.5 w-full rounded cursor-pointer text-left scroll-mt-8 ' +
  'active:brightness-97';
// No hover colour: the pointer moves the selection, so one row is lit at a time.
const ROW_SELECTED = `${ROW_BASE} bg-primary/15`;

/**
 * A command palette in a dialog. It never filters: pass the matching items, and the markup of a row as an
 * octSearchPanelRow template.
 */
@Component({
  selector: 'oct-search-panel',
  templateUrl: './search-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, DialogComponent, IconComponent, KbdComponent, TextComponent],
  host: {
    '(document:keydown)': 'handleKeydown($event)'
  }
})
export class SearchPanelComponent<T extends SearchPanelItem> {
  /** Whether the panel is shown. Set it back to false when dialogClose emits. */
  readonly isOpen = input<boolean>(false);
  /** The results to show, already filtered and in order. */
  readonly items = input.required<readonly T[]>();
  /** Shows a spinner instead of the results while a search runs. */
  readonly loading = input<boolean>(false);
  /** Placeholder text in the query box. */
  readonly placeholder = input<string>('Search...');
  /** Names the query box and the result list for screen readers. */
  readonly ariaLabel = input.required<string>();
  /** Renders the ↑↓ / Enter legend under the results. */
  readonly showHints = input<boolean>(false);
  /** How many matches to render. The rest are counted, not drawn. */
  readonly maxVisibleItems = input<number>(DEFAULT_MAX_VISIBLE_ITEMS);

  /** The text in the query box. Bind it two-way and filter items from it. */
  readonly query = model<string>('');

  /** Emits the result chosen with Enter or a click, right after dialogClose. */
  readonly itemSelected = output<T>();
  /** Emits when the panel asks to close: Escape, a click outside, or a selection. */
  readonly dialogClose = output<void>();
  /** Tab or Shift+Tab in the query box, for a consumer that steps through its own scopes. */
  readonly tabKey = output<KeyboardEvent>();

  private readonly rowTemplate = contentChild.required(SearchPanelRowDirective, { read: TemplateRef });
  private readonly emptyTemplate = contentChild(SearchPanelEmptyDirective, { read: TemplateRef });

  readonly rowContent = computed(() => this.rowTemplate());
  readonly emptyContent = computed(() => this.emptyTemplate());

  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  private readonly resultItems = viewChildren<ElementRef<HTMLElement>>('resultItem');

  readonly hasResults = computed(() => this.items().length > 0);

  // Grouping, selection, keyboard and aria all read this, never items(), so the arrow keys
  // can never land on an option that was not drawn.
  readonly visibleItems = computed(() => this.items().slice(0, this.maxVisibleItems()));
  readonly hiddenCount = computed(() => this.items().length - this.visibleItems().length);

  private selectedByPointer = false;

  // Writable so the arrow keys can move it, but linked to the item list so a new query
  // lands back on the first row instead of leaving the highlight on a stale index.
  readonly selectedIndex = linkedSignal<readonly T[], number>({
    source: this.visibleItems,
    computation: () => 0
  });

  // Rows are grouped for display but selected by one flat index, so each row carries its
  // position in items(). That is what lets the arrow keys cross a group heading.
  readonly resultGroups = computed(() => {
    let position = -1;

    return groupSearchPanelItems(this.visibleItems()).map(group => ({
      group: group.group,
      rows: group.items.map(item => ({ item, position: ++position }))
    }));
  });

  // Focus never leaves the query box, so this is the only thing a screen reader can announce.
  readonly activeOptionId = computed(() => (this.hasResults() ? this.optionId(this.selectedIndex()) : null));

  readonly resultAnnouncement = computed(() => {
    if (this.loading()) {
      return 'Searching';
    }

    const total = this.items().length;
    if (total === 0) {
      return `No match for ${this.query()}`;
    }

    const hidden = this.hiddenCount();
    if (hidden > 0) {
      return `${total} results, showing the first ${this.visibleItems().length}. Refine your search to narrow them down.`;
    }

    return total === 1 ? '1 result' : `${total} results`;
  });

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.onPanelOpen();
      }
    });

    afterRenderEffect({
      write: () => {
        if (this.isOpen()) {
          this.searchInput()?.nativeElement?.focus();
        }
      }
    });

    afterRenderEffect({
      write: () => {
        const row = this.resultItems()[this.selectedIndex()];
        // A row the pointer picked is under the pointer already; scrolling would slide another row under it.
        if (!this.selectedByPointer) {
          row?.nativeElement.scrollIntoView({ block: 'nearest' });
        }
      }
    });
  }

  // Redundant with onPanelClose today, but that only runs when the dialog emits: a caller
  // that just sets isOpen to false would otherwise reopen onto the previous query.
  private onPanelOpen(): void {
    this.query.set('');
    this.selectedIndex.set(0);
  }

  onQueryInput(value: string): void {
    this.query.set(value);
  }

  onQueryKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }

    // Stopped here, before the dialog's focus trap can move focus out of the query box.
    event.preventDefault();
    event.stopPropagation();
    this.tabKey.emit(event);
  }

  /** Called from a consumer's projected empty template via a template reference variable. */
  clearQuery(): void {
    this.query.set('');
    this.searchInput()?.nativeElement?.focus();
  }

  optionId(position: number): string {
    return `search-panel-option-${position}`;
  }

  onPanelClose(): void {
    this.query.set('');
    this.selectedIndex.set(0);
    this.dialogClose.emit();
  }

  selectByPointer(position: number): void {
    this.selectedByPointer = true;
    this.selectedIndex.set(position);
  }

  onRowClick(item: T): void {
    this.selectItem(item);
  }

  handleKeydown(event: KeyboardEvent): void {
    if (!this.isOpen()) {
      return;
    }

    const items = this.visibleItems();
    if (items.length === 0) {
      return;
    }

    const currentIndex = this.selectedIndex();
    this.selectedByPointer = false;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex.set(currentIndex < items.length - 1 ? currentIndex + 1 : 0);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex.set(currentIndex > 0 ? currentIndex - 1 : items.length - 1);
        break;

      case 'Enter':
        event.preventDefault();
        this.selectItem(items[currentIndex]);
        break;
    }
  }

  private selectItem(item: T): void {
    this.onPanelClose();
    this.itemSelected.emit(item);
  }

  // Two constants rather than a built string: this runs per rendered row per CD pass.
  getRowClass(position: number): string {
    return this.selectedIndex() === position ? ROW_SELECTED : ROW_BASE;
  }
}
