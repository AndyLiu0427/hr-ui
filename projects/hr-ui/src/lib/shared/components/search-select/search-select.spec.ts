import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Component, ComponentRef, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, FormField } from '@angular/forms/signals';
import { TranslateService } from '@ngx-translate/core';
import { SearchSelectComponent, SearchSelectOption, SearchSelectValue } from './search-select';

/**
 * Keyboard navigation for oct-search-select. Before a fix, this was
 * non-functional (dead keyManager, invisible highlight, no auto-first). These
 * tests drive the public keyboard handlers directly — no live overlay needed.
 */
describe('SearchSelectComponent — keyboard navigation', () => {
  let component: SearchSelectComponent;
  let ref: ComponentRef<SearchSelectComponent>;

  const input = (value: string): Event => ({ target: { value } }) as unknown as Event;
  const key = (k: string): KeyboardEvent => new KeyboardEvent('keydown', { key: k });

  const setOptions = (opts: SearchSelectOption[]): void => {
    ref.setInput('options', opts);
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchSelectComponent],
      providers: [{ provide: TranslateService, useValue: { instant: (k: string) => k } }]
    }).compileComponents();

    const fixture = TestBed.createComponent(SearchSelectComponent);
    component = fixture.componentInstance;
    ref = fixture.componentRef;
  });

  describe('open seeds the keyboard-nav highlight (regression: click-open)', () => {
    it('highlights the first option on open so arrows/Enter work without typing', () => {
      setOptions([
        { value: 'a', label: 'Apple' },
        { value: 'b', label: 'Banana' }
      ]);
      component.openDropdown();
      expect(component.activeIndex()).toBe(0);
    });

    it('toggleDropdown (the click path) also seeds the highlight', () => {
      setOptions([
        { value: 'a', label: 'Apple' },
        { value: 'b', label: 'Banana' }
      ]);
      component.toggleDropdown();
      expect(component.activeIndex()).toBe(0);
    });
  });

  describe('Escape on the trigger', () => {
    const escape = () => new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });

    it('marks the key as handled when it closes the dropdown, so a side panel around it stays open', () => {
      component.isOpen.set(true);
      const event = escape();
      component.handleKeyDown(event);
      expect(event.defaultPrevented).toBe(true);
    });

    it('leaves the key alone when the dropdown is already closed', () => {
      const event = escape();
      component.handleKeyDown(event);
      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe('auto-highlight first after search (req 1)', () => {
    it('highlights the first option after a local filter', () => {
      setOptions([
        { value: 'a', label: 'Apple' },
        { value: 'b', label: 'Banana' }
      ]);
      component.onSearchInput(input(''));
      expect(component.activeIndex()).toBe(0);
    });

    it('skips a leading disabled option', () => {
      setOptions([
        { value: 'a', label: 'Apple', disabled: true },
        { value: 'b', label: 'Banana' }
      ]);
      component.onSearchInput(input(''));
      // displayOptions filters out disabled, so 'Banana' is the first shown option.
      expect(component.activeIndex()).toBe(0);
      expect(component.displayOptions()[component.activeIndex()].value).toBe('b');
    });

    it('narrows to the matching option and highlights it', () => {
      setOptions([
        { value: 'a', label: 'Apple' },
        { value: 'b', label: 'Banana' }
      ]);
      component.onSearchInput(input('ban'));
      expect(component.displayOptions()).toHaveLength(1);
      expect(component.activeIndex()).toBe(0);
    });
  });

  describe('arrow navigation (req 2)', () => {
    beforeEach(() => {
      setOptions([
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
        { value: 'c', label: 'C' }
      ]);
      component.onSearchInput(input(''));
    });

    it('ArrowDown advances the active index', () => {
      component.handleSearchKeyDown(key('ArrowDown'));
      expect(component.activeIndex()).toBe(1);
    });

    it('ArrowUp from the first option wraps to the last', () => {
      component.handleSearchKeyDown(key('ArrowUp'));
      expect(component.activeIndex()).toBe(2);
    });

    it('Home and End jump to first and last (CP2)', () => {
      component.handleSearchKeyDown(key('End'));
      expect(component.activeIndex()).toBe(2);
      component.handleSearchKeyDown(key('Home'));
      expect(component.activeIndex()).toBe(0);
    });
  });

  describe('Enter selects the highlighted option (req 3)', () => {
    it('selects the auto-highlighted first match on Enter', () => {
      setOptions([
        { value: 'a', label: 'Apple' },
        { value: 'b', label: 'Banana' }
      ]);
      component.onSearchInput(input('ban'));

      let emitted: SearchSelectValue = null;
      component.valueChange.subscribe(v => (emitted = v));

      component.handleSearchKeyDown(key('Enter'));

      expect(emitted).toBe('b');
      expect(component.value()).toBe('b');
    });

    it('toggles values via Enter in multiple mode without closing', () => {
      ref.setInput('multiple', true);
      setOptions([
        { value: 'a', label: 'Apple' },
        { value: 'b', label: 'Banana' }
      ]);
      component.onSearchInput(input('')); // auto-highlights index 0 (Apple)

      component.handleSearchKeyDown(key('Enter')); // toggle Apple on
      expect(component.value()).toEqual(['a']);

      component.handleSearchKeyDown(key('Enter')); // toggle Apple off (highlight unchanged, no close)
      expect(component.value()).toEqual([]);
    });

    it('does nothing on Enter when there are no results', () => {
      setOptions([{ value: 'a', label: 'Apple' }]);
      component.onSearchInput(input('zzz'));
      expect(component.activeIndex()).toBe(-1);

      let emitted = false;
      component.valueChange.subscribe(() => (emitted = true));
      component.handleSearchKeyDown(key('Enter'));

      expect(emitted).toBe(false);
    });
  });
});

/**
 * Large-list findability. The ADW employee picker once capped its options at
 * the first 1000 (caller-side `.slice(0, 1000)`), which silently hid — and made
 * unsearchable — any employee sorting past index 1000 (e.g. CPPCP02827). The fix
 * removed the cap and enabled virtual scroll. These tests pin the component
 * guarantee the fix relies on: it never truncates options, and search filters
 * across the WHOLE list, including entries far beyond 1000.
 */
describe('SearchSelectComponent — large list is fully searchable (no 1000 cap)', () => {
  let component: SearchSelectComponent;
  let ref: ComponentRef<SearchSelectComponent>;

  const input = (value: string): Event => ({ target: { value } }) as unknown as Event;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchSelectComponent],
      providers: [{ provide: TranslateService, useValue: { instant: (k: string) => k } }]
    }).compileComponents();

    const fixture = TestBed.createComponent(SearchSelectComponent);
    component = fixture.componentInstance;
    ref = fixture.componentRef;

    // 1500 employees, sorted-ascending codes — index 1200 is well past the old cap.
    const opts: SearchSelectOption[] = Array.from({ length: 1500 }, (_, i) => {
      const code = `CPPCP${String(i).padStart(5, '0')}`;
      return { value: `id-${i}`, label: `Employee ${code}`, description: code };
    });
    ref.setInput('options', opts);
    ref.setInput('virtualScrollConfig', { itemSize: 40, threshold: 20 });
  });

  it('keeps every option — no truncation at 1000', () => {
    expect(component.displayOptions()).toHaveLength(1500);
  });

  it('finds an employee whose code sorts past index 1000 (the original bug)', () => {
    component.onSearchInput(input('CPPCP01200'));
    const results = component.displayOptions();
    expect(results).toHaveLength(1);
    expect(results[0].value).toBe('id-1200');
  });

  it('enables virtual scroll once the list exceeds the threshold', () => {
    expect(component.hasVirtualScroll()).toBe(true);
  });
});

/**
 * `preloadKey` re-preload. API-search selects (e.g. the job-order picker) preload
 * a dept-scoped set and the current value; when the dept changes or an option is
 * created inline, the preloaded set is stale. Changing `preloadKey` must clear
 * the one-shot preload cache and re-run `preloadFn`, and an unchanged key must
 * not. Regression: search by code and current-value display.
 */
describe('SearchSelectComponent — preloadKey re-runs preload', () => {
  let component: SearchSelectComponent;
  let ref: ComponentRef<SearchSelectComponent>;
  let fixture: ReturnType<typeof TestBed.createComponent<SearchSelectComponent>>;
  let preloadCalls: number;
  let nextResult: SearchSelectOption[];

  const flush = async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchSelectComponent],
      providers: [{ provide: TranslateService, useValue: { instant: (k: string) => k } }]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchSelectComponent);
    component = fixture.componentInstance;
    ref = fixture.componentRef;

    preloadCalls = 0;
    nextResult = [{ value: 'a', label: 'Alpha' }];
    ref.setInput('preloadData', true);
    ref.setInput('preloadOnInit', true);
    ref.setInput('preloadFn', () => {
      preloadCalls += 1;
      return Promise.resolve(nextResult);
    });
    ref.setInput('preloadKey', 'dept-1');
  });

  it('preloads on init and again when preloadKey changes', async () => {
    fixture.detectChanges();
    await flush();
    expect(component.isPreloaded()).toBe(true);
    expect(component.preloadedOptions().map(o => o.value)).toEqual(['a']);
    expect(preloadCalls).toBe(1);

    // A dept switch / inline create: the source changes and so does the key.
    nextResult = [{ value: 'b', label: 'Bravo' }];
    ref.setInput('preloadKey', 'dept-2');
    fixture.detectChanges();
    await flush();

    expect(preloadCalls).toBe(2);
    expect(component.preloadedOptions().map(o => o.value)).toEqual(['b']);
  });

  it('does not re-run preload when preloadKey is unchanged', async () => {
    fixture.detectChanges();
    await flush();
    expect(preloadCalls).toBe(1);

    fixture.detectChanges();
    await flush();
    expect(preloadCalls).toBe(1);
  });
});

/**
 * External value resync. With signal-forms `[formField]`, the bound value flows
 * through the `value` input, so a programmatic
 * value change (e.g. the job-order picker clearing the field when the client
 * dept changes) must still reset the displayed selection. Regression:
 * previously a stale internalValue/selectedOptionCache kept rendering the old
 * option after the form value was cleared or replaced.
 */
describe('SearchSelectComponent — external value change resets the selection', () => {
  let component: SearchSelectComponent;
  let ref: ComponentRef<SearchSelectComponent>;
  let fixture: ReturnType<typeof TestBed.createComponent<SearchSelectComponent>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchSelectComponent],
      providers: [{ provide: TranslateService, useValue: { instant: (k: string) => k } }]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchSelectComponent);
    component = fixture.componentInstance;
    ref = fixture.componentRef;
    fixture.detectChanges();
  });

  it('clears the displayed option when the bound value is cleared externally', () => {
    // User picks an option: internalValue + selectedOptionCache now hold it.
    component.selectOption({ value: 'joA', label: 'JO-A' });
    expect(component.selectedOption()?.value).toBe('joA');
    expect(component.triggerText()).toBe('JO-A');

    // Signal-forms clears the field (client dept switched): value model -> ''.
    ref.setInput('value', '');
    fixture.detectChanges();

    expect(component.selectedOption()).toBeNull();
    expect(component.hasSelection()).toBe(false);
    expect(component.triggerText()).toBe('');
  });

  it('reflects an external value replacement with a different option', () => {
    component.selectOption({ value: 'joA', label: 'JO-A' });
    ref.setInput('options', [{ value: 'joB', label: 'JO-B' }]);
    ref.setInput('value', 'joB');
    fixture.detectChanges();

    expect(component.selectedOption()?.value).toBe('joB');
    expect(component.triggerText()).toBe('JO-B');
  });

  it('round-trips a [formField] value: the form sets it, and a user pick writes it back', () => {
    @Component({
      imports: [SearchSelectComponent, FormField],
      template: `<oct-search-select [formField]="f.jobOrder" [options]="options" />`
    })
    class Host {
      readonly model = signal({ jobOrder: 'joA' as string | null });
      readonly f = form(this.model);
      readonly options: SearchSelectOption[] = [
        { value: 'joA', label: 'JO-A' },
        { value: 'joB', label: 'JO-B' }
      ];
      readonly select = viewChild.required(SearchSelectComponent);
    }

    const host = TestBed.createComponent(Host);
    host.detectChanges();
    const select = host.componentInstance.select();
    expect(select.triggerText()).toBe('JO-A');

    select.selectOption({ value: 'joB', label: 'JO-B' });
    host.detectChanges();
    expect(host.componentInstance.model().jobOrder).toBe('joB');
    expect(host.componentInstance.f.jobOrder().touched()).toBe(true);
  });
});

describe('SearchSelectComponent - label search matches any part of the label', () => {
  it('finds every 2024 month when the user types "24"', async () => {
    await TestBed.configureTestingModule({
      imports: [SearchSelectComponent],
      providers: [{ provide: TranslateService, useValue: { instant: (k: string) => k } }]
    }).compileComponents();
    const fixture = TestBed.createComponent(SearchSelectComponent);
    const months = ['2026-01', '2025-12', '2024-12', '2024-11', '2024-01'];
    fixture.componentRef.setInput(
      'options',
      months.map(month => ({ value: month, label: month }))
    );

    fixture.componentInstance.onSearchInput({ target: { value: '24' } } as unknown as Event);

    expect(fixture.componentInstance.displayOptions().map(option => option.value)).toEqual(['2024-12', '2024-11', '2024-01']);
  });
});

describe('SearchSelectComponent — search timing, focus and active option', () => {
  let component: SearchSelectComponent;
  let ref: ComponentRef<SearchSelectComponent>;
  let fixture: ReturnType<typeof TestBed.createComponent<SearchSelectComponent>>;

  const input = (value: string): Event => ({ target: { value } }) as unknown as Event;
  const key = (k: string) => new KeyboardEvent('keydown', { key: k, cancelable: true });
  const trigger = () => fixture.nativeElement.querySelector('[role="combobox"]') as HTMLElement;
  const searchBox = () => document.querySelector('.cdk-overlay-container input[type="text"]') as HTMLInputElement;
  const OPTIONS: SearchSelectOption[] = [
    { value: 'E1031', label: 'Kenji Watanabe' },
    { value: 'E1047', label: 'Priya Nair' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchSelectComponent],
      providers: [{ provide: TranslateService, useValue: { instant: (k: string) => k } }]
    }).compileComponents();
    fixture = TestBed.createComponent(SearchSelectComponent);
    component = fixture.componentInstance;
    ref = fixture.componentRef;
  });
  afterEach(() => vi.useRealTimers());

  /** Opens the list and puts focus in its search box, as the open does a frame later. */
  function openWithFocusInSearch(): void {
    ref.setInput('options', OPTIONS);
    fixture.detectChanges();
    component.openDropdown();
    fixture.detectChanges();
    searchBox().focus();
  }

  it('waits the debounce from searchConfig, not a fixed 300 ms', () => {
    vi.useFakeTimers();
    const searchFn = vi.fn().mockReturnValue([]);
    ref.setInput('searchConfig', { searchFn, debounceMs: 50 });
    ref.setInput('preloadConfig', { loadFn: () => [] });

    component.onSearchInput(input('ke'));
    vi.advanceTimersByTime(60);

    expect(searchFn).toHaveBeenCalledWith('ke');
  });

  it('waits the debounce from the debounceTime shorthand too', () => {
    vi.useFakeTimers();
    const searchFn = vi.fn().mockReturnValue([]);
    ref.setInput('apiSearchFn', searchFn);
    ref.setInput('debounceTime', 1000);

    component.onSearchInput(input('ke'));
    vi.advanceTimersByTime(300);
    expect(searchFn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(700);
    expect(searchFn).toHaveBeenCalledWith('ke');
  });

  it('searches with searchConfig alone, without preloadConfig, and logs no error', () => {
    vi.useFakeTimers();
    const consoleError = vi.spyOn(console, 'error');
    ref.setInput('searchConfig', { searchFn: () => [OPTIONS[0]], debounceMs: 0 });

    component.onSearchInput(input('ke'));
    vi.advanceTimersByTime(0);

    expect(component.displayOptions().map(option => option.value)).toEqual(['E1031']);
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('puts focus back on the field after Escape in the search box', () => {
    openWithFocusInSearch();

    component.handleSearchKeyDown(key('Escape'));

    expect(document.activeElement).toBe(trigger());
  });

  it('puts focus back on the field after a pick, even when the click took focus off the search box', () => {
    openWithFocusInSearch();
    searchBox().blur();

    component.selectOption(OPTIONS[1]);

    expect(document.activeElement).toBe(trigger());
  });

  it('leaves focus on another control the user moved to', () => {
    openWithFocusInSearch();
    const other = document.body.appendChild(document.createElement('button'));
    other.focus();

    component.closeDropdown();

    expect(document.activeElement).toBe(other);
    other.remove();
  });

  it('names the highlighted option on the search box, which has focus, and not on the field', () => {
    openWithFocusInSearch();

    const activeId = searchBox().getAttribute('aria-activedescendant')!;
    const option = document.getElementById(activeId);
    expect(option?.getAttribute('role')).toBe('option');
    expect(option?.closest('[role="listbox"]')?.id).toBe(searchBox().getAttribute('aria-controls'));
    expect(trigger().hasAttribute('aria-activedescendant')).toBe(false);
  });
});
