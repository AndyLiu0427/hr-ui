import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  model,
  ModelSignal,
  OnInit,
  output,
  signal,
  TemplateRef,
  viewChild,
  linkedSignal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { TranslateService } from '@ngx-translate/core';
import { NgTemplateOutlet } from '@angular/common';
import { IconComponent } from '../icon/icon';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { CdkScrollable, CdkVirtualScrollViewport, ScrollingModule, ViewportRuler } from '@angular/cdk/scrolling';
import { A11yModule } from '@angular/cdk/a11y';
import { ListKeyboardNav } from '../../services/list-keyboard-nav';
import { TextComponent } from '../text/text';
import { Subject, debounceTime } from 'rxjs';
import { SelectOptionComponent } from './select-option';
import { BaseOverlayService } from '../../services/base-overlay';
import { BadgeComponent } from '../badge/badge';
import { ColorTagColor, ColorTagComponent } from '../color-tag/color-tag';

export type SelectValue = string | number | null;
export type SelectValues = (string | number)[];
export type SelectChangeValue = SelectValue | SelectValues;

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: string;
  description?: string;
  /** Drawn in the list and on the closed trigger. Accent only: the label still identifies the option. */
  colorTag?: ColorTagColor;
}

@Component({
  selector: 'oct-select',
  templateUrl: './select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    IconComponent,
    TextComponent,
    CdkOverlayOrigin,
    A11yModule,
    ScrollingModule,
    CdkScrollable,
    SelectOptionComponent,
    BadgeComponent,
    ColorTagComponent
  ],
  providers: [BaseOverlayService],
  host: {
    '[class.block]': 'fullWidth()',
    '[class.inline-block]': '!fullWidth()',
    '[class.w-full]': 'fullWidth()',
    // A bare trigger fills its owner's shell, so its focus ring meets the sibling input's edges.
    '[class.self-stretch]': 'bare()'
  }
})
export class SelectComponent implements FormValueControl<SelectValue>, OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly translateService = inject(TranslateService);
  private readonly viewportRuler = inject(ViewportRuler);
  private readonly overlayService = inject(BaseOverlayService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly nav = new ListKeyboardNav<SelectOption>();

  private readonly typeaheadBuffer = signal<string>('');
  private readonly typeaheadKey$ = new Subject<string>();
  private readonly wasEverOpened = signal(false);

  readonly selectId = signal(`oct-select-${Math.random().toString(36).substring(2, 9)}`);

  readonly options = input<SelectOption[]>([]);
  readonly placeholder = input<string>('Select an option');
  readonly label = input<string>();
  readonly helperText = input<string>();
  readonly errorText = input<string>();
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  readonly showIcon = input<boolean>(true);
  readonly clearable = input<boolean>(false);
  readonly multiple = input<boolean>(false);
  readonly loading = input<boolean>(false);
  readonly maxHeight = input<string>('240px');
  readonly fullWidth = input<boolean>(false);
  readonly showScrollIndicators = input<boolean>(true);
  /** Drops the trigger's border, radius, background and outline so it sits inside a shared shell. */
  readonly bare = input<boolean>(false);
  /** Floor for the dropdown width. A bare trigger is narrow; its option labels are not. */
  readonly overlayMinWidth = input<number>(0);
  /** Accessible name when a parent owns the visible label, so this is not announced as "Select an option". */
  readonly ariaLabel = input<string>();
  readonly hideHelper = input<boolean>(false);
  /** Maximum badges shown in multi-select. Undefined = show all. */
  readonly maxDisplay = input<number | undefined>(undefined);

  readonly virtualScrolling = input<boolean>(false);
  readonly itemSize = input<number>(40);

  readonly value: ModelSignal<SelectValue> = model<SelectValue>(null);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly touched = input<boolean>(false);
  /** Tells the bound form field that the user has left this control. */
  readonly touch = output<void>();
  /** Local copy of `touched`, so the control still tracks its own blur when no form field is bound. */
  readonly isTouched = linkedSignal(this.touched);
  readonly invalid = input<boolean>(false);
  readonly name = input<string>('');
  readonly dirty = input<boolean>(false);
  readonly pending = input<boolean>(false);

  /** @deprecated Use errors array or errorText instead */
  readonly error = input<boolean>();

  readonly selectChange = output<SelectChangeValue>();
  readonly selectionChange = output<SelectOption | SelectOption[] | null>();
  readonly selectFocus = output<FocusEvent>();
  readonly selectBlur = output<FocusEvent>();

  readonly selectValue = signal<SelectValue>(null);
  readonly selectedValues = signal<SelectValues>([]);

  readonly selectTrigger = viewChild.required<ElementRef<HTMLButtonElement>>('selectTrigger');
  readonly overlayTemplate = viewChild<TemplateRef<void>>('overlayTemplate');
  readonly virtualViewport = viewChild<CdkVirtualScrollViewport>('virtualViewport');

  private readonly valueModelEffect = effect(() => {
    const modelValue = this.value();
    if (this.multiple()) {
      if (Array.isArray(modelValue)) {
        const currentValues = this.selectedValues();
        // Only update if different to avoid infinite loops
        if (JSON.stringify(currentValues) !== JSON.stringify(modelValue)) {
          this.selectedValues.set(modelValue as SelectValues);
        }
      } else if (modelValue !== null && modelValue !== undefined) {
        const currentValues = this.selectedValues();
        if (!currentValues.includes(modelValue)) {
          this.selectedValues.set([...currentValues, modelValue]);
        }
      }
    } else if (this.selectValue() !== modelValue) {
      this.selectValue.set(modelValue);
    }
  });

  // Marks touched when the panel closes. A backdrop click closes it without closeDropdown().
  private readonly touchedEffect = effect(() => {
    const isOpen = this.isOpen();
    if (isOpen) {
      this.wasEverOpened.set(true);
    } else if (this.wasEverOpened() && !this.isTouched()) {
      this.isTouched.set(true);
      this.touch.emit();
    }
  });

  ngOnInit(): void {
    this.viewportRuler
      .change()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.isOpen()) {
          this.overlayService.updatePosition();
          this.updateScrollIndicators();
        }
      });

    this.typeaheadKey$.pipe(debounceTime(500), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.typeaheadBuffer.set('');
    });

    queueMicrotask(() => {
      // The select can be destroyed before this runs, e.g. a dialog closed straight away.
      if (!this.destroyRef.destroyed) {
        this.initializeOverlay();
      }
    });
  }

  private initializeOverlay(): void {
    const template = this.overlayTemplate();
    if (template) {
      this.overlayService.initializeOverlay(this.selectTrigger(), template, {
        maxHeight: this.maxHeight(),
        minWidth: this.overlayMinWidth()
      });
    }
  }

  readonly isOpen = this.overlayService.isOpen;
  readonly activeIndex = this.nav.activeIndex;
  readonly canScrollUp = signal(false);
  readonly canScrollDown = signal(false);

  readonly isDisabled = computed(() => this.loading() || this.disabled());

  /** Determines if component should show error state. Priority: explicit > errorText > Signal Forms */
  readonly hasError = computed(() => {
    const deprecatedError = this.error();
    if (deprecatedError !== undefined) return deprecatedError;

    if (this.errorText()) return true;

    return this.isTouched() && (this.errors().length > 0 || this.invalid());
  });

  private readonly signalFormsErrorMessage = computed(() => {
    const errors = this.errors();
    if (errors.length === 0 || !this.isTouched()) return '';
    const first = errors[0];
    return 'message' in first && typeof first.message === 'string' ? first.message : '';
  });

  /** Gets effective error message. Priority: explicit > Signal Forms */
  readonly effectiveErrorMessage = computed(() => this.errorText() || this.signalFormsErrorMessage());

  readonly selectedOption = computed(() => {
    const currentValue = this.selectValue();
    const currentOptions = this.options();
    if (currentValue === null || currentValue === undefined) {
      return null;
    }
    const found = currentOptions.find(opt => opt.value === currentValue);
    return found || null;
  });

  readonly filteredOptions = computed(() => this.options());

  readonly enabledOptions = computed(() => this.options().filter(opt => !opt.disabled));

  readonly displayHelperText = computed(() => (this.hasError() ? this.effectiveErrorMessage() : this.helperText() || ''));

  readonly selectedOptions = computed(() => {
    const values = this.selectedValues();
    const opts = this.options();
    return values.map(v => opts.find(o => o.value === v)).filter((o): o is SelectOption => o !== undefined);
  });

  /** Selected options shown as badges, up to maxDisplay. */
  readonly displayedOptions = computed(() => {
    const selected = this.selectedOptions();
    const max = this.maxDisplay();
    return max === undefined ? selected : selected.slice(0, max);
  });

  /** Selected options beyond maxDisplay, shown as a +N badge. */
  readonly overflowCount = computed(() => {
    const max = this.maxDisplay();
    if (max === undefined) return 0;
    const total = this.selectedOptions().length;
    return Math.max(0, total - max);
  });

  readonly hasMultipleSelections = computed(() => this.selectedValues().length > 0);

  readonly isAllSelected = computed(() => {
    const available = this.enabledOptions();
    const selected = this.selectedValues();
    return available.length > 0 && available.every(opt => selected.includes(opt.value));
  });

  readonly selectAllLabel = computed(() => this.translateService.instant('COMMON.SELECT_ALL'));
  readonly selectAllHighlighted = signal(false);

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

    // Seed the highlight now: the overlay open callback runs a frame later.
    const opts = this.filteredOptions();
    if (this.multiple()) {
      this.nav.setOptions(opts);
      this.nav.clearActive();
      this.selectAllHighlighted.set(true);
    } else {
      this.selectAllHighlighted.set(false);
      const selectedIndex = opts.findIndex(option => option.value === this.selectValue() && !option.disabled);
      this.nav.setOptions(opts, selectedIndex >= 0 ? selectedIndex : undefined);
    }

    this.overlayService.open(() => {
      this.scrollToHighlighted();
      this.updateScrollIndicators();
      this.cdr.markForCheck();
    });
  }

  closeDropdown(): void {
    this.canScrollUp.set(false);
    this.canScrollDown.set(false);
    this.overlayService.close(() => {
      this.nav.setOptions([]);
      this.selectAllHighlighted.set(false);
      this.markTouched();
      this.cdr.markForCheck();
    });
  }

  onOptionSelect(option: SelectOption): void {
    this.selectOption(option);
  }

  onOptionHover(option: SelectOption): void {
    const index = this.filteredOptions().findIndex(opt => opt.value === option.value && !opt.disabled);
    if (index >= 0) {
      this.selectAllHighlighted.set(false);
      this.nav.setActive(index);
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;

    const isPrintableKey = event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;

    // Closed: any of these keys open the dropdown.
    if (!this.isOpen()) {
      switch (event.key) {
        case 'Enter':
        case ' ':
        case 'ArrowDown':
        case 'ArrowUp':
          event.preventDefault();
          this.openDropdown();
          break;
      }
      return;
    }

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.multiple() && this.selectAllHighlighted()) {
          this.toggleSelectAll();
          return;
        }
        if (this.activeIndex() >= 0) {
          const option = this.filteredOptions()[this.activeIndex()];
          if (option) this.selectOption(option);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;
      case 'Tab':
        this.closeDropdown();
        break;
      case 'ArrowUp':
        event.preventDefault();
        // Select-All adapter: ArrowUp from option 0 → Select-All; from Select-All → last option.
        if (this.multiple() && !this.selectAllHighlighted() && this.activeIndex() === 0) {
          this.selectAllHighlighted.set(true);
          this.nav.clearActive();
          return;
        }
        if (this.multiple() && this.selectAllHighlighted()) {
          this.selectAllHighlighted.set(false);
          this.nav.last();
          this.scrollToHighlighted();
          return;
        }
        this.selectAllHighlighted.set(false);
        this.nav.move(-1);
        this.scrollToHighlighted();
        break;
      case 'ArrowDown':
        event.preventDefault();
        // Select-All adapter: ArrowDown from Select-All moves to the first option.
        if (this.multiple() && this.selectAllHighlighted()) {
          this.selectAllHighlighted.set(false);
          this.nav.first();
          this.scrollToHighlighted();
          return;
        }
        this.selectAllHighlighted.set(false);
        this.nav.move(1);
        this.scrollToHighlighted();
        break;
      case 'Home':
        event.preventDefault();
        if (this.multiple()) {
          this.selectAllHighlighted.set(true);
          this.nav.clearActive();
          return;
        }
        this.nav.first();
        this.scrollToHighlighted();
        break;
      case 'End':
        event.preventDefault();
        this.selectAllHighlighted.set(false);
        this.nav.last();
        this.scrollToHighlighted();
        break;
      default:
        if (isPrintableKey) {
          event.preventDefault();
          this.handleTypeahead(event.key);
        }
        break;
    }
  }

  selectOption(option: SelectOption): void {
    if (option.disabled) return;

    if (this.multiple()) {
      const currentValues = [...this.selectedValues()];
      const index = currentValues.indexOf(option.value);

      if (index >= 0) {
        currentValues.splice(index, 1);
      } else {
        currentValues.push(option.value);
      }

      this.selectedValues.set(currentValues);
      this.value.set(currentValues as unknown as SelectValue);
      this.markTouched();
      this.selectChange.emit(currentValues);
      this.selectionChange.emit(this.selectedOptions());
      this.cdr.markForCheck();
    } else {
      this.selectValue.set(option.value);
      this.value.set(option.value);
      this.markTouched();
      this.selectChange.emit(option.value);
      this.selectionChange.emit(option);
      this.closeDropdown();
      this.cdr.markForCheck();
    }
  }

  removeOption(event: Event | void, option: SelectOption): void {
    if (event instanceof Event) {
      event.stopPropagation();
    }
    if (this.isDisabled()) return;

    const currentValues = this.selectedValues().filter(v => v !== option.value);
    this.selectedValues.set(currentValues);
    this.value.set(currentValues as unknown as SelectValue);
    this.markTouched();
    this.selectChange.emit(currentValues);
    this.selectionChange.emit(this.selectedOptions());
    this.cdr.markForCheck();
  }

  clearSelection(event: Event): void {
    event.stopPropagation();
    if (this.isDisabled()) return;

    if (this.multiple()) {
      this.selectedValues.set([]);
      this.value.set(null);
      this.markTouched();
      this.selectChange.emit([]);
      this.selectionChange.emit([]);
    } else {
      this.selectValue.set(null);
      this.value.set(null);
      this.markTouched();
      this.selectChange.emit(null);
      this.selectionChange.emit(null);
    }
    this.cdr.markForCheck();
  }

  toggleSelectAll(): void {
    if (this.isDisabled() || !this.multiple()) return;

    if (this.isAllSelected()) {
      this.selectedValues.set([]);
      this.value.set([] as unknown as SelectValue);
      this.markTouched();
      this.selectChange.emit([]);
      this.selectionChange.emit([]);
    } else {
      const allValues = this.enabledOptions().map(opt => opt.value);
      this.selectedValues.set(allValues);
      this.value.set(allValues as unknown as SelectValue);
      this.markTouched();
      this.selectChange.emit(allValues);
      this.selectionChange.emit(this.selectedOptions());
    }
    this.closeDropdown();
  }

  onSelectAllHover(): void {
    this.selectAllHighlighted.set(true);
    this.nav.clearActive();
  }

  isSelected(option: SelectOption): boolean {
    if (this.multiple()) {
      return this.selectedValues().includes(option.value);
    }
    return this.selectValue() === option.value;
  }

  scrollToHighlighted(): void {
    const idx = this.activeIndex();
    if (idx < 0) return;

    if (this.virtualScrolling() && this.virtualViewport()) {
      this.virtualViewport()?.scrollToIndex(idx);
      return;
    }

    const container = this.optionsContainer();
    // Look up by option id, not child index (the Select-All row shifts it).
    const active = container?.querySelector('#' + CSS.escape(this.selectId() + '-option-' + idx));
    if (active && container) {
      active.scrollIntoView({ block: 'nearest' });
      this.updateScrollIndicators();
    }
  }

  private optionsContainer(): HTMLElement | null {
    return (this.overlayService.getOverlayElement()?.querySelector('.select-options') as HTMLElement | null) ?? null;
  }

  /** Shows the more-above and more-below chevrons. Runs on open, scroll and resize. */
  updateScrollIndicators(): void {
    const container = this.optionsContainer();
    if (!container) {
      this.canScrollUp.set(false);
      this.canScrollDown.set(false);
      return;
    }
    const overflowing = container.scrollHeight > container.clientHeight;
    this.canScrollUp.set(overflowing && container.scrollTop > 0);
    this.canScrollDown.set(overflowing && container.scrollTop < container.scrollHeight - container.clientHeight - 1);
  }

  readonly triggerClasses = computed(() => {
    // Bare: the shell draws border, radius and background; bareFocusRing draws focus.
    const bare = this.bare();
    const base = bare
      ? 'flex items-center w-full h-full select-none px-2 text-sm gap-x-2 bg-transparent border-none rounded-r-[7px]'
      : 'flex items-center w-full rounded-lg bg-secondary border border-primary transition-colors duration-150 ease-out select-none px-2 text-sm gap-x-2 outline-primary';
    const sizeMap = { sm: 'py-1.5', md: 'py-2', lg: 'py-2.5' };
    const size = sizeMap[this.size()];
    const state = this.isDisabled()
      ? bare
        ? 'text-disabled cursor-not-allowed'
        : '!bg-hr-neutral-900 text-disabled cursor-not-allowed'
      : bare
        ? 'cursor-pointer'
        : 'cursor-pointer hover:border-primary-300';
    const error = this.hasError() && !bare ? '!border-transparent outline-2 !outline-hr-red-500' : '';
    const open = this.isOpen() && !bare ? '!border-transparent outline-2 outline-primary outline-offset-transparent' : '';

    return [base, size, state, error, open, this.bareFocusRing()].filter(Boolean).join(' ');
  });

  /**
   * Focus ring on a bare trigger's own box, so focus is visible when it moves from the sibling input.
   * Inset, because the shell clips with overflow-hidden. Keyed on :focus to match the shell.
   */
  private readonly bareFocusRing = computed(() => {
    if (!this.bare()) return '';
    return this.isOpen()
      ? 'outline outline-2 outline-primary -outline-offset-2'
      : 'group-focus:outline group-focus:outline-2 group-focus:outline-primary group-focus:-outline-offset-2';
  });

  readonly menuClasses = 'oct-overlay-enter bg-secondary border border-primary rounded-xl shadow-hr-lg overflow-hidden w-full box-border';

  private markTouched(): void {
    this.isTouched.set(true);
    this.touch.emit();
  }

  focus(): void {
    this.selectTrigger()?.nativeElement.focus();
  }

  blur(): void {
    this.selectTrigger()?.nativeElement.blur();
    this.markTouched();
  }

  clear(): void {
    this.selectValue.set(null);
    this.value.set(null);
    this.selectChange.emit(null);
  }

  trackByValue = (index: number, option: SelectOption): string | number => {
    return option.value;
  };

  getVirtualScrollHeight(): number {
    const optionCount = this.filteredOptions().length;
    const itemSize = this.itemSize();
    return Math.min(optionCount * itemSize, 240);
  }

  private findMatchingOption(searchText: string): number {
    if (!searchText) return -1;

    const options = this.filteredOptions();
    const currentIndex = this.activeIndex();
    const searchLower = searchText.toLowerCase();

    const matchingIndices = options
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => !option.disabled && option.label.toLowerCase().startsWith(searchLower))
      .map(({ index }) => index);

    if (matchingIndices.length === 0) {
      return -1;
    }

    if (matchingIndices.length === 1) {
      return matchingIndices[0];
    }

    const currentMatchIndex = matchingIndices.indexOf(currentIndex);
    if (currentMatchIndex >= 0 && currentMatchIndex < matchingIndices.length - 1) {
      return matchingIndices[currentMatchIndex + 1];
    } else {
      return matchingIndices[0];
    }
  }

  private handleTypeahead(key: string): void {
    if (this.isOpen() === false) return;

    const newBuffer = this.typeaheadBuffer() + key.toLowerCase();
    this.typeaheadBuffer.set(newBuffer);

    const matchIndex = this.findMatchingOption(newBuffer);

    if (matchIndex >= 0) {
      this.selectAllHighlighted.set(false);
      this.nav.setActive(matchIndex);
      this.scrollToHighlighted();
    }

    this.typeaheadKey$.next(key);
  }
}
