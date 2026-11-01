import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  DestroyRef,
  untracked,
  viewChild,
  linkedSignal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { ColorTagColor, ColorTagComponent } from '../color-tag/color-tag';
import { IconComponent } from '../icon/icon';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, Subject, switchMap, of, catchError } from 'rxjs';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { A11yModule } from '@angular/cdk/a11y';
import { ListKeyboardNav } from '../../services/list-keyboard-nav';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { TextComponent } from '../text/text';

export interface SearchSelectOptionBadge {
  text: string;
  color?: 'neutral' | 'success' | 'warning' | 'error' | 'info';
}

export interface SearchSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: string;
  description?: string;
  badge?: SearchSelectOptionBadge;
  /** Drawn in the list and on the closed trigger. Accent only: the label still identifies the option. */
  colorTag?: ColorTagColor;
}

/** A scalar, or an array of scalars when `[multiple]` is on. */
export type SearchSelectValue = string | number | (string | number)[] | null;

export interface SearchSelectSearchConfig {
  searchFn: (query: string) => Promise<SearchSelectOption[]> | SearchSelectOption[];
  debounceMs?: number;
  minLength?: number;
  emptyText?: string;
  placeholder?: string;
}

export interface SearchSelectPreloadConfig {
  loadFn: () => Promise<SearchSelectOption[]> | SearchSelectOption[];
  trigger?: 'focus' | 'init';
}

export interface SearchSelectVirtualScrollConfig {
  itemSize?: number;
  threshold?: number;
}

export interface SearchSelectSearchEvent {
  query: string;
  isEmpty: boolean;
  isMinLength: boolean;
}
import { SearchSelectOptionComponent } from './search-select-option';
import { BaseOverlayService } from '../../services/base-overlay';

@Component({
  selector: 'oct-search-select',
  templateUrl: './search-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ColorTagComponent,
    IconComponent,
    TextComponent,
    CdkOverlayOrigin,
    CdkScrollable,
    A11yModule,
    ScrollingModule,
    SearchSelectOptionComponent,
    TranslateModule
  ],
  providers: [BaseOverlayService],
  host: {
    '[class.inline-block]': '!fullWidth()',
    '[class.block]': 'fullWidth()',
    '[class.w-full]': 'fullWidth()'
  }
})
export class SearchSelectComponent implements AfterViewInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly viewportRuler = inject(ViewportRuler);
  private readonly overlayService = inject(BaseOverlayService);

  private readonly nav = new ListKeyboardNav<SearchSelectOption>();
  private searchSubject = new Subject<string>();

  readonly searchSelectId = signal(`oct-search-select-${Math.random().toString(36).substring(2, 11)}`);

  /** Static options array (ignored if searchConfig or preloadConfig is provided) */
  readonly options = input<SearchSelectOption[]>([]);

  /** Selected value: a scalar, or an array when `[multiple]` is true. */
  // A model() would clash with the hand-emitted `valueChange` output below, which fires only on user picks.
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly valueInput = input<SearchSelectValue>(null, { alias: 'value' });
  readonly value = linkedSignal(this.valueInput);

  readonly placeholder = input<string>('');
  readonly label = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly error = input<boolean>(false);
  readonly errorText = input<string>();
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly clearable = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly multiple = input<boolean>(false);

  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  readonly touched = input<boolean>(false);
  /** Tells the bound form field that the user has left this control. */
  readonly touch = output<void>();
  /** Local copy of `touched`, so the control still tracks its own blur when no form field is bound. */
  readonly isTouched = linkedSignal(this.touched);
  readonly invalid = input<boolean>(false);
  readonly name = input<string>();
  readonly dirty = input<boolean>(false);
  readonly pending = input<boolean>(false);

  /** Helper text description shown below the input */
  readonly description = input<string>('');
  readonly showIcon = input<boolean>(false);
  /** External loading state (combines with internal search/preload loading) */
  readonly loading = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);
  readonly maxHeight = input<string>('15rem');
  readonly hideHelper = input<boolean>(false);
  /** API search function - shorthand for searchConfig.searchFn */
  readonly apiSearchFn = input<((query: string) => Promise<SearchSelectOption[]> | SearchSelectOption[]) | undefined>(undefined);
  /** Whether to preload data - shorthand for preloadConfig with trigger 'focus' */
  readonly preloadData = input<boolean>(false);
  /* Aliased on purpose: the unsuffixed names belong to computed() members below
     that fold these shorthands into searchConfig(), and consumers bind the aliases. */
  /* eslint-disable @angular-eslint/no-input-rename */
  /** Minimum search length - shorthand for searchConfig.minLength */
  readonly minSearchLengthInput = input<number | undefined>(undefined, { alias: 'minSearchLength' });
  /** Debounce time in ms - shorthand for searchConfig.debounceMs */
  readonly debounceTime = input<number | undefined>(undefined);
  /** No options text - shorthand for searchConfig.emptyText */
  readonly noOptionsTextInput = input<string | undefined>(undefined, { alias: 'noOptionsText' });
  /** Search placeholder - shorthand for searchConfig.placeholder */
  readonly searchPlaceholderInput = input<string | undefined>(undefined, { alias: 'searchPlaceholder' });
  /* eslint-enable @angular-eslint/no-input-rename */
  /** Legacy: Whether API search is enabled */
  readonly apiSearch = input<boolean>(false);
  /** Legacy: Preload function - shorthand for preloadConfig.loadFn */
  readonly preloadFn = input<(() => Promise<SearchSelectOption[]> | SearchSelectOption[]) | undefined>(undefined);
  /** Legacy: Whether to preload on init */
  readonly preloadOnInit = input<boolean>(false);
  /** Legacy: Whether to preload on focus */
  readonly preloadOnFocus = input<boolean>(true);
  /** Changing this after the first render clears the preloaded options and runs `preloadFn` again. */
  readonly preloadKey = input<unknown>(undefined);

  /**
   * API search configuration. When provided, enables async search.
   * @example { searchFn: (q) => api.search(q), debounceMs: 300, minLength: 2 }
   */
  readonly searchConfig = input<SearchSelectSearchConfig | undefined>(undefined);

  /**
   * Preload configuration. When provided, loads options on focus or init.
   * @example { loadFn: () => api.getAll(), trigger: 'focus' }
   */
  readonly preloadConfig = input<SearchSelectPreloadConfig | undefined>(undefined);

  /**
   * Virtual scroll configuration. When provided, enables virtual scrolling for large lists.
   * @example { itemSize: 40, threshold: 10 }
   */
  readonly virtualScrollConfig = input<SearchSelectVirtualScrollConfig | undefined>(undefined);

  readonly valueChange = output<SearchSelectValue>();
  readonly selectionChange = output<SearchSelectOption | null>();
  readonly openChange = output<boolean>();
  readonly searchChange = output<SearchSelectSearchEvent>();
  readonly searchSelectFocus = output<FocusEvent>();
  readonly searchSelectBlur = output<FocusEvent>();

  readonly searchSelectTrigger = viewChild.required<ElementRef<HTMLDivElement>>('searchSelectTrigger');
  readonly overlayTemplate = viewChild<TemplateRef<void>>('overlayTemplate');
  readonly virtualViewport = viewChild<CdkVirtualScrollViewport>('virtualViewport');
  readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  readonly isOpen = this.overlayService.isOpen;
  readonly activeIndex = this.nav.activeIndex;
  readonly searchQuery = signal('');
  readonly searchOptions = signal<SearchSelectOption[]>([]);
  readonly isSearching = signal(false);
  readonly searchError = signal<string | null>(null);
  readonly preloadedOptions = signal<SearchSelectOption[]>([]);
  readonly isPreloading = signal(false);
  readonly preloadError = signal<string | null>(null);
  readonly isPreloaded = signal(false);
  readonly internalValue = signal<SearchSelectValue>(null);
  private readonly selectedOptionCache = signal<SearchSelectOption | null>(null);

  readonly hasSearchConfig = computed(() => !!this.searchConfig()?.searchFn || !!this.apiSearchFn() || this.apiSearch());

  readonly hasPreloadConfig = computed(() => !!this.preloadConfig()?.loadFn || this.preloadData() || !!this.preloadFn());

  readonly hasVirtualScroll = computed(() => {
    const config = this.virtualScrollConfig();
    const threshold = config?.threshold ?? 10;
    return !!config && this.displayOptions().length > threshold;
  });

  readonly debounceMs = computed(() => this.searchConfig()?.debounceMs ?? this.debounceTime() ?? 300);

  readonly minSearchLength = computed(() => this.searchConfig()?.minLength ?? this.minSearchLengthInput() ?? 1);

  readonly noOptionsText = computed(() => this.searchConfig()?.emptyText ?? this.noOptionsTextInput() ?? '');

  readonly searchPlaceholder = computed(() => this.searchConfig()?.placeholder ?? this.searchPlaceholderInput() ?? 'Search...');

  readonly itemSize = computed(() => this.virtualScrollConfig()?.itemSize ?? 40);

  readonly isLoading = computed(() => this.isSearching() || this.isPreloading() || this.loading());

  readonly isDisabled = computed(() => this.disabled());

  /** Determines if component should show error state. Priority: explicit > errorText > Signal Forms */
  readonly hasError = computed(() => {
    if (this.error()) return true;

    if (this.errorText()) return true;

    return this.isTouched() && (this.errors().length > 0 || this.invalid());
  });

  private readonly signalFormsErrorMessage = computed(() => {
    const errors = this.errors();
    if (errors.length === 0 || !this.isTouched()) return '';
    const first = errors[0];
    return 'message' in first && typeof first.message === 'string' ? first.message : '';
  });

  readonly effectiveErrorMessage = computed(() => this.errorText() || this.signalFormsErrorMessage());

  readonly currentValue = computed(() => {
    const internal = this.internalValue();
    return internal !== null ? internal : this.value();
  });

  readonly selectedOption = computed(() => {
    const currentValue = this.currentValue();
    if (currentValue === null || currentValue === undefined) return null;

    const cachedOption = this.selectedOptionCache();
    if (cachedOption && cachedOption.value === currentValue) return cachedOption;

    if (this.hasSearchConfig()) {
      if (this.isPreloaded()) {
        const preloadFound = this.preloadedOptions().find(opt => opt.value === currentValue);
        if (preloadFound) return preloadFound;
      }
      return this.searchOptions().find(opt => opt.value === currentValue) ?? null;
    }
    return this.options().find(opt => opt.value === currentValue) ?? null;
  });

  /** Current value normalized to an array, regardless of single/multi mode. */
  readonly selectedValues = computed<(string | number)[]>(() => {
    const current = this.currentValue();
    if (Array.isArray(current)) return current;
    return current === null || current === undefined ? [] : [current];
  });

  readonly hasSelection = computed(() => (this.multiple() ? this.selectedValues().length > 0 : this.selectedOption() !== null));

  /** A mark on the trigger needs one selected option to take it from, so multiple mode never has one. */
  readonly showsTriggerTag = computed(() => !this.multiple() && !!this.selectedOption()?.colorTag);

  /** Text shown in the collapsed trigger when something is selected. Multiple mode shows a translated count instead. */
  readonly triggerText = computed(() => {
    if (this.multiple()) return '';
    return this.selectedOption()?.label ?? '';
  });

  readonly displayOptions = computed(() => {
    const query = this.searchQuery();

    if (this.hasSearchConfig()) {
      if (!this.hasPreloadConfig()) {
        console.error('SearchSelect: searchConfig requires preloadConfig to be provided');
        return [];
      }

      // minSearchLength 0: '' gives 0 < 0 false, so treat empty query as preload.
      const minLen = this.minSearchLength();
      const qlen = query.length;
      const usePreloaded = this.isPreloaded() && (qlen < minLen || (minLen === 0 && qlen === 0));
      if (usePreloaded) {
        return this.preloadedOptions().filter(opt => !opt.disabled);
      }
      if (query.length >= this.minSearchLength()) {
        return this.searchOptions();
      }
      return [];
    }

    if (!query) return this.options().filter(opt => !opt.disabled);
    const queryLower = query.toLowerCase();
    return this.options().filter(
      opt => !opt.disabled && (opt.label.toLowerCase().includes(queryLower) || (opt.description?.toLowerCase().includes(queryLower) ?? false))
    );
  });

  readonly canShowOptions = computed(() => {
    if (!this.hasSearchConfig()) return true;
    if (!this.hasPreloadConfig()) return false;
    const query = this.searchQuery();
    return this.isPreloaded() || (query.length >= this.minSearchLength() && this.searchOptions().length > 0);
  });

  readonly triggerClasses = computed(() => {
    const classes = [
      'flex',
      'items-center',
      'w-full',
      'rounded-lg',
      'bg-secondary',
      'border',
      'border-primary',
      'transition-colors',
      'duration-150',
      'ease-out',
      'select-none',
      'px-2',
      'text-sm',
      'outline-primary'
    ];

    const sizeMap = { sm: 'py-1.5', md: 'py-2', lg: 'py-2.5' };
    classes.push(sizeMap[this.size()]);

    if (this.isDisabled()) {
      classes.push('!bg-hr-neutral-900', 'text-disabled', 'cursor-not-allowed');
    } else {
      classes.push('cursor-pointer', 'hover:border-primary-300');
    }

    if (this.hasError()) {
      classes.push('!border-transparent', 'outline-2', '!outline-hr-red-500');
    } else if (this.isOpen()) {
      classes.push('!border-transparent', 'outline-2', 'outline-primary', 'outline-offset-transparent');
    }

    return classes.join(' ');
  });

  readonly menuClasses = computed(() => 'oct-overlay-enter bg-secondary border border-primary rounded-xl shadow-hr-sm overflow-hidden');

  private readonly wasEverOpened = signal(false);

  constructor() {
    effect(() => this.openChange.emit(this.isOpen()));

    effect(() => {
      if (this.isDisabled()) untracked(() => this.closeDropdown());
    });

    // Follow outside changes to `value`, so a cleared or replaced form value never shows a stale pick.
    effect(() => {
      const v = this.value();
      untracked(() => {
        this.internalValue.set(v);
        const cached = this.selectedOptionCache();
        if (cached && cached.value !== v) this.selectedOptionCache.set(null);
      });
    });

    effect(() => {
      if (this.isOpen()) {
        requestAnimationFrame(() => this.focusSearchInput());
      }
    });

    // Marks touched when the panel closes. A backdrop click closes it without closeDropdown().
    effect(() => {
      const isOpen = this.isOpen();
      if (isOpen) {
        this.wasEverOpened.set(true);
      } else if (this.wasEverOpened() && !this.isTouched()) {
        this.isTouched.set(true);
        this.touch.emit();
      }
    });

    this.setupDebouncedSearch();

    // Re-preload only when preloadKey really changes after the first render.
    let firstPreloadKey = true;
    let lastPreloadKey: unknown;
    effect(() => {
      const key = this.preloadKey();
      if (firstPreloadKey) {
        firstPreloadKey = false;
        lastPreloadKey = key;
        return;
      }
      if (key === lastPreloadKey) return;
      lastPreloadKey = key;
      // untracked: preloadOptions() reads and writes preload state, which would loop this effect.
      untracked(() => {
        if (!this.hasPreloadConfig()) return;
        this.isPreloaded.set(false);
        this.preloadedOptions.set([]);
        this.preloadError.set(null);
        this.preloadOptions();
      });
    });

    const preloadConfig = this.preloadConfig();
    if (preloadConfig?.trigger === 'init' || this.preloadOnInit()) {
      this.preloadOptions();
    }
  }

  ngAfterViewInit(): void {
    const preloadConfig = this.preloadConfig();
    if (preloadConfig && preloadConfig.trigger !== 'focus') {
      this.preloadOptions();
    } else if (this.preloadOnInit() && this.hasPreloadConfig() && !this.isPreloaded() && !this.isPreloading()) {
      // Legacy `[preloadData]` + `[preloadFn]`: inputs are not ready in constructor, so run here.
      this.preloadOptions();
    }

    this.viewportRuler
      .change()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.isOpen()) {
          this.overlayService.updatePosition();
        }
      });

    this.initializeOverlay();
  }

  private initializeOverlay(): void {
    const template = this.overlayTemplate();
    if (template) {
      this.overlayService.initializeOverlay(this.searchSelectTrigger(), template, {});
    }
  }

  private preloadOptions(): void {
    const config = this.preloadConfig();
    const loadFn = config?.loadFn ?? this.preloadFn();
    if (!loadFn || this.isPreloading() || this.isPreloaded()) return;

    this.isPreloading.set(true);
    this.preloadError.set(null);

    try {
      const result = loadFn();

      if (result instanceof Promise) {
        result
          .then(options => this.handlePreloadSuccess(options))
          .catch(error => this.handlePreloadError(error))
          .finally(() => {
            this.isPreloading.set(false);
            this.cdr.markForCheck();
          });
      } else {
        this.handlePreloadSuccess(result);
        this.isPreloading.set(false);
      }
    } catch (error: unknown) {
      this.handlePreloadError(error);
      this.isPreloading.set(false);
    }

    this.cdr.markForCheck();
  }

  private handlePreloadSuccess(options: SearchSelectOption[]): void {
    this.preloadedOptions.set(options);
    this.isPreloaded.set(true);
    this.preloadError.set(null);
    // Preload can resolve after the dropdown is open; re-seed so keyboard nav works.
    if (this.isOpen()) this.syncNavOptions();
    this.cdr.markForCheck();
  }

  private handlePreloadError(error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : 'Preload failed';
    this.preloadError.set(errorMessage);
    this.preloadedOptions.set([]);
    this.isPreloaded.set(false);
  }

  private setupDebouncedSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(this.debounceMs()),
        distinctUntilChanged(),
        switchMap(query => this.executeSearch(query)),
        catchError(error => {
          const errorMessage = error instanceof Error ? error.message : 'Search failed';
          return of({ success: false, error: errorMessage });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(result => this.handleSearchResult(result));
  }

  private executeSearch(query: string) {
    const config = this.searchConfig();
    const searchFn = config?.searchFn ?? this.apiSearchFn();
    if (!searchFn || query.length < this.minSearchLength()) {
      return of([]);
    }

    this.isSearching.set(true);
    this.searchError.set(null);

    try {
      const result = searchFn(query);
      if (result instanceof Promise) {
        return result.then(
          options => ({ success: true, options }),
          error => ({ success: false, error: error.message || 'Search failed' })
        );
      }
      return of({ success: true, options: result });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Search failed';
      return of({ success: false, error: errorMessage });
    }
  }

  private handleSearchResult(result: unknown): void {
    this.isSearching.set(false);

    if (Array.isArray(result)) {
      this.searchOptions.set([]);
      this.searchError.set(null);
    } else if (typeof result === 'object' && result !== null && 'success' in result) {
      const typedResult = result as { success: boolean; options?: SearchSelectOption[]; error?: string };
      if (typedResult.success) {
        this.searchOptions.set(typedResult.options ?? []);
        this.searchError.set(null);
      } else {
        this.searchError.set(typedResult.error ?? 'Search failed');
        this.searchOptions.set([]);
      }
    }

    // Results settled: auto-highlight the first enabled option so Enter selects it.
    this.nav.setOptions(this.displayOptions());
    this.cdr.markForCheck();
  }

  /** Keys on the closed trigger (combobox). Opens the dropdown. */
  handleKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
      case 'ArrowUp':
        if (!this.isOpen()) {
          event.preventDefault();
          this.openDropdown();
        }
        break;
      case 'Escape':
        if (this.isOpen()) {
          // Handled here, so a side panel around the field stays open.
          event.preventDefault();
          this.closeDropdown();
        }
        break;
      case 'Tab':
        if (this.isOpen()) this.closeDropdown();
        break;
    }
  }

  /** Keys while the panel is open. The search box owns focus then, so every key lands here. */
  handleSearchKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.nav.move(1);
        this.scrollToHighlighted();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.nav.move(-1);
        this.scrollToHighlighted();
        break;
      case 'Home':
        event.preventDefault();
        this.nav.first();
        this.scrollToHighlighted();
        break;
      case 'End':
        event.preventDefault();
        this.nav.last();
        this.scrollToHighlighted();
        break;
      case 'Enter': {
        event.preventDefault();
        const option = this.displayOptions()[this.activeIndex()];
        if (option) this.selectOption(option);
        break;
      }
      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;
      case 'Tab':
        this.closeDropdown();
        break;
    }
  }

  toggleDropdown(): void {
    if (this.isDisabled()) return;
    // Delegate to open/close so openDropdown's nav-seeding runs on the click path too.
    if (this.isOpen()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown(): void {
    if (this.isDisabled()) return;

    // Seed nav synchronously so keyboard nav works on any open path (incl. click).
    this.syncNavOptions();

    this.overlayService.open(() => {
      const preloadConfig = this.preloadConfig();
      const shouldPreloadOnFocus =
        (preloadConfig && (preloadConfig.trigger === 'focus' || preloadConfig.trigger === undefined)) ||
        this.preloadOnFocus() ||
        (this.preloadFn() && !this.preloadOnInit());
      if (shouldPreloadOnFocus && !this.isPreloaded() && !this.isPreloading()) {
        this.preloadOptions();
      }

      this.cdr.markForCheck();
    });
  }

  closeDropdown(): void {
    this.overlayService.close(() => {
      this.searchQuery.set('');
      this.nav.setOptions([]);

      if (this.hasSearchConfig()) {
        this.searchOptions.set([]);
        this.isSearching.set(false);
        this.searchError.set(null);
      }

      this.markTouched();
      this.cdr.markForCheck();
    });
  }

  selectOption(option: SearchSelectOption): void {
    if (option.disabled) return;

    if (this.multiple()) {
      const current = this.selectedValues();
      const next = current.includes(option.value) ? current.filter(v => v !== option.value) : [...current, option.value];

      this.internalValue.set(next);
      this.value.set(next);
      this.markTouched();

      this.valueChange.emit(next);
      this.selectionChange.emit(option);

      // Keep the dropdown open so the user can toggle multiple options.
      this.cdr.markForCheck();
      return;
    }

    this.internalValue.set(option.value);
    this.value.set(option.value);
    this.selectedOptionCache.set(option);
    this.markTouched();

    this.valueChange.emit(option.value);
    this.selectionChange.emit(option);

    this.closeDropdown();
    this.cdr.markForCheck();
  }

  clearSelection(event: Event): void {
    event.stopPropagation();

    const cleared: SearchSelectValue = this.multiple() ? [] : null;
    this.internalValue.set(cleared);
    this.value.set(cleared);
    this.selectedOptionCache.set(null);
    this.markTouched();

    this.valueChange.emit(cleared);
    this.selectionChange.emit(null);
    this.cdr.markForCheck();
  }

  isSelected(option: SearchSelectOption): boolean {
    if (this.multiple()) return this.selectedValues().includes(option.value);
    return this.currentValue() === option.value;
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value.trim();

    this.searchQuery.set(query);

    this.searchChange.emit({
      query,
      isEmpty: query.length === 0,
      isMinLength: query.length >= this.minSearchLength()
    });

    if (this.hasSearchConfig()) {
      // Async: clear the highlight now; handleSearchResult re-seeds it when the
      // debounced search resolves (switchMap drops stale in-flight results).
      this.nav.setOptions([]);
      this.searchSubject.next(query);
    } else {
      this.nav.setOptions(this.displayOptions());
    }
  }

  /** Seed the nav with the current options, highlighting the selected one if present. */
  private syncNavOptions(): void {
    const options = this.displayOptions();
    const selectedIndex = options.findIndex(opt => opt.value === this.currentValue());
    this.nav.setOptions(options, selectedIndex >= 0 ? selectedIndex : undefined);
  }

  private scrollToHighlighted(): void {
    const index = this.activeIndex();
    if (index < 0) return;

    if (this.hasVirtualScroll() && this.virtualViewport()) {
      this.virtualViewport()?.scrollToIndex(index);
      return;
    }

    const container = this.optionsContainer();
    container?.querySelector('#' + CSS.escape(this.searchSelectId() + '-option-' + index))?.scrollIntoView({ block: 'nearest' });
  }

  private optionsContainer(): HTMLElement | null {
    return (this.overlayService.getOverlayElement()?.querySelector('.search-select-options') as HTMLElement | null) ?? null;
  }

  getVirtualScrollHeight(): number {
    return Math.min(this.displayOptions().length, 10) * this.itemSize();
  }

  trackByValue = (_index: number, option: SearchSelectOption): string | number => option.value;

  onOptionHover(option: SearchSelectOption): void {
    const index = this.displayOptions().findIndex(opt => opt.value === option.value);
    this.nav.setActive(index);
  }

  onFocus(event: FocusEvent): void {
    this.searchSelectFocus.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.searchSelectBlur.emit(event);
    this.markTouched();
  }

  private focusSearchInput(): void {
    const inputRef = this.searchInput();
    if (inputRef?.nativeElement) {
      inputRef.nativeElement.focus();
      return;
    }

    const overlayElement = this.overlayService.getOverlayElement();
    if (!overlayElement) return;

    try {
      const searchInputEl = overlayElement.querySelector('input[type="text"]') as HTMLInputElement;
      searchInputEl?.focus();
    } catch {
      queueMicrotask(() => {
        const searchInputEl = overlayElement.querySelector('input[type="text"]') as HTMLInputElement;
        searchInputEl?.focus();
      });
    }
  }

  private markTouched(): void {
    this.isTouched.set(true);
    this.touch.emit();
  }

  focus(): void {
    this.searchSelectTrigger()?.nativeElement.focus();
  }

  blur(): void {
    this.searchSelectTrigger()?.nativeElement.blur();
    this.markTouched();
  }
}
