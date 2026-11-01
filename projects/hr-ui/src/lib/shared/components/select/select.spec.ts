import { beforeEach, describe, expect, it } from 'vitest';
import { Component, ComponentRef, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, FormField } from '@angular/forms/signals';
import { TranslateService } from '@ngx-translate/core';
import { SelectComponent, SelectOption } from './select';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let ref: ComponentRef<SelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent],
      providers: [
        {
          provide: TranslateService,
          useValue: { instant: (key: string) => key }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    ref = fixture.componentRef;
  });

  describe('open seeds the keyboard-nav highlight (regression: click-open)', () => {
    it('single-select highlights the first option on open', () => {
      ref.setInput('options', [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' }
      ]);
      component.openDropdown();
      expect(component.activeIndex()).toBe(0);
    });

    it('toggleDropdown (the click path) also seeds the highlight', () => {
      ref.setInput('options', [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' }
      ]);
      component.toggleDropdown();
      expect(component.activeIndex()).toBe(0);
    });

    it('multiple-select opens with Select-All active and no option highlighted', () => {
      ref.setInput('options', [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' }
      ]);
      ref.setInput('multiple', true);
      component.openDropdown();
      expect(component.selectAllHighlighted()).toBe(true);
      expect(component.activeIndex()).toBe(-1);
    });
  });

  describe('loading disables the select', () => {
    it('isDisabled is true while options are loading', () => {
      ref.setInput('loading', true);
      expect(component.isDisabled()).toBe(true);
    });

    it('dropdown cannot be opened while loading', () => {
      ref.setInput('options', [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' }
      ]);
      ref.setInput('loading', true);
      component.toggleDropdown();
      expect(component.activeIndex()).toBe(-1);
    });

    it('select becomes interactive again once loading clears', () => {
      ref.setInput('options', [{ value: 'a', label: 'A' }]);
      ref.setInput('loading', true);
      component.toggleDropdown();
      expect(component.activeIndex()).toBe(-1);
      ref.setInput('loading', false);
      expect(component.isDisabled()).toBe(false);
      component.toggleDropdown();
      expect(component.activeIndex()).toBe(0);
    });
  });

  it('marks the label required, which is how a signal-forms required rule reaches the eye', () => {
    // `required` is one of the inputs signal forms writes onto a FormValueControl, so a
    // `required(schemaPath.x)` rule arrives here as this input. A template may not bind it itself:
    // NG8022 rejects [required] on a node that also carries [formField].
    const fixture = TestBed.createComponent(SelectComponent);
    fixture.componentRef.setInput('label', 'Gender');
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('label')?.textContent).toContain('*');
  });

  it('leaves the label unmarked when nothing requires the field', () => {
    const fixture = TestBed.createComponent(SelectComponent);
    fixture.componentRef.setInput('label', 'Gender');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('label')?.textContent).not.toContain('*');
  });

  it('should return index in full options list for typeahead match', () => {
    const options: SelectOption[] = [
      { value: 'a', label: 'Apple', disabled: true },
      { value: 'b', label: 'Banana' },
      { value: 'c', label: 'Cherry' }
    ];

    (component as any).options = () => options;

    const index = (component as any).findMatchingOption('b');
    expect(index).toBe(1);
  });

  it('should cycle through enabled matches using full-list indices', () => {
    const options: SelectOption[] = [
      { value: 'd0', label: 'Alpha Disabled', disabled: true },
      { value: 'a1', label: 'Alpha' },
      { value: 'a2', label: 'Alpine' },
      { value: 'd3', label: 'Almond Disabled', disabled: true },
      { value: 'a4', label: 'Azure' }
    ];

    (component as any).options = () => options;

    // The active index (current match) is owned by the shared keyboard-nav
    // primitive; seed it directly to drive typeahead cycling.
    const nav = (component as any).nav;
    nav.setOptions(options);

    nav.setActive(1);
    expect((component as any).findMatchingOption('a')).toBe(2);

    nav.setActive(2);
    expect((component as any).findMatchingOption('a')).toBe(4);

    nav.setActive(4);
    expect((component as any).findMatchingOption('a')).toBe(1);
  });

  describe('bare (composed inside a shared shell)', () => {
    it('keeps its own border, radius and background by default', () => {
      const cls = component.triggerClasses();
      expect(cls).toContain('rounded-lg');
      expect(cls).toContain('border-primary');
      expect(cls).toContain('bg-secondary');
    });

    it('drops border, radius and background when bare', () => {
      ref.setInput('bare', true);
      const cls = component.triggerClasses();
      expect(cls).not.toContain('rounded-lg');
      expect(cls).not.toContain('border-primary');
      expect(cls).not.toContain('bg-secondary');
      expect(cls).toContain('border-none');
    });

    it('rings its own box on focus, because the shell rings on focus-within and is already lit', () => {
      ref.setInput('bare', true);
      const cls = component.triggerClasses();
      expect(cls).toContain('group-focus:outline-2');
      expect(cls).toContain('group-focus:outline-primary');
    });

    it('insets that ring, or the owner overflow-hidden clips it away', () => {
      ref.setInput('bare', true);
      expect(component.triggerClasses()).toContain('-outline-offset-2');
    });

    it('holds the ring while the dropdown is open, however it was opened', () => {
      // Set straight on the signal: openDropdown() needs an initialized overlay, which this
      // TestBed never renders.
      ref.setInput('bare', true);
      component.isOpen.set(true);
      const cls = component.triggerClasses();
      expect(cls).toContain('outline-primary');
      expect(cls).not.toContain('group-focus:outline-primary');
    });

    it('fills the owner shell, so the ring reaches the sibling input top and bottom', () => {
      ref.setInput('bare', true);
      expect(component.triggerClasses()).toContain('h-full');
    });

    it('suppresses the error outline when bare, since the shell owns the error treatment', () => {
      ref.setInput('bare', true);
      ref.setInput('errorText', 'bad');
      expect(component.triggerClasses()).not.toContain('outline-hr-red-500');
    });

    it('still shows disabled affordance when bare, without the filled background', () => {
      ref.setInput('bare', true);
      ref.setInput('disabled', true);
      const cls = component.triggerClasses();
      expect(cls).toContain('cursor-not-allowed');
      expect(cls).not.toContain('bg-hr-neutral-900');
    });
  });

  it('clears to an empty array in multiple mode, so a value bound as an array stays one', () => {
    ref.setInput('multiple', true);
    ref.setInput('options', [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' }
    ]);
    component.selectOption({ value: 'a', label: 'A' });

    component.clearSelection(new Event('click'));

    expect(component.value()).toEqual([]);
  });

  describe('accessible name', () => {
    it('prefers ariaLabel, so a parent-owned label still names this control', () => {
      // With bare + no [label], the fallback chain would announce "Select an option".
      ref.setInput('ariaLabel', 'Pay Rate basis');
      ref.setInput('placeholder', 'Select');
      expect(component.ariaLabel()).toBe('Pay Rate basis');
    });
  });

  describe('scroll indicators are measured, not guessed', () => {
    it('reports no overflow when there is no panel yet', () => {
      component.updateScrollIndicators();
      expect(component.canScrollDown()).toBe(false);
      expect(component.canScrollUp()).toBe(false);
    });

    it('clears both flags on close so a reopen re-measures from scratch', () => {
      ref.setInput('options', [{ value: 'a', label: 'A' }]);
      component.openDropdown();
      component.canScrollDown.set(true);
      component.closeDropdown();
      expect(component.canScrollDown()).toBe(false);
      expect(component.canScrollUp()).toBe(false);
    });

    it('does not gate the affordance on an option count', () => {
      // Six options at itemSize 40 sit exactly on the 240px cap, so a `length > 5` guess showed a
      // chevron for a list that may not scroll at all.
      ref.setInput(
        'options',
        Array.from({ length: 6 }, (_, i) => ({ value: i, label: `O${i}` }))
      );
      component.updateScrollIndicators();
      expect(component.canScrollDown()).toBe(false);
    });
  });

  describe('overlayMinWidth', () => {
    it('defaults to no floor', () => {
      expect(component.overlayMinWidth()).toBe(0);
    });

    it('accepts a floor, which the overlay service applies on every open', () => {
      ref.setInput('overlayMinWidth', 240);
      expect(component.overlayMinWidth()).toBe(240);
    });
  });

  describe('bare suppresses oct-text truncation', () => {
    it('keeps ellipsis AND nowrap on the value by default, matching the old `truncate` class', () => {
      // Regression guard. The value used to carry Tailwind `truncate`, which bundles
      // white-space:nowrap. oct-text's own truncate does NOT, so dropping the class without
      // asserting nowrap would make every existing select wrap its value instead of ellipsising.
      const f = TestBed.createComponent(SelectComponent);
      f.componentRef.setInput('options', [{ value: 'WD+PH', label: 'Workday + PH' }]);
      f.componentRef.setInput('value', 'WD+PH');
      f.detectChanges();
      const text = f.nativeElement.querySelector('oct-text') as HTMLElement;
      expect(text.className).toContain('overflow-hidden');
      expect(text.className).toContain('text-ellipsis');
      expect(text.className).toContain('whitespace-nowrap');
    });

    it('leaves the PLACEHOLDER wrapping by default, as it was', () => {
      // The placeholders never carried `truncate`, so they must not gain nowrap either.
      const f = TestBed.createComponent(SelectComponent);
      f.componentRef.setInput('placeholder', 'Select an option');
      f.detectChanges();
      const text = f.nativeElement.querySelector('oct-text') as HTMLElement;
      expect(text.className).toContain('text-ellipsis');
      expect(text.className).not.toContain('whitespace-nowrap');
    });

    it('drops the ellipsis when bare, because the shell sizes the control', () => {
      // oct-text truncates BY DEFAULT (text.ts:51) and emits overflow-hidden + text-ellipsis.
      // That, not any utility class in this template, is what clipped the value.
      const f = TestBed.createComponent(SelectComponent);
      f.componentRef.setInput('bare', true);
      f.componentRef.setInput('options', [{ value: 'WD+PH', label: 'Workday + PH' }]);
      f.componentRef.setInput('value', 'WD+PH');
      f.detectChanges();
      const text = f.nativeElement.querySelector('oct-text') as HTMLElement;
      expect(text.className).not.toContain('text-ellipsis');
      expect(text.className).not.toContain('overflow-hidden');
    });

    it('adds nowrap when bare, because truncate=false alone permits mid-word breaking', () => {
      // The truncate:false branch is `min-w-0 break-words`. Without nowrap, break-words would
      // split "WD+PH" across lines rather than keeping it whole.
      const f = TestBed.createComponent(SelectComponent);
      f.componentRef.setInput('bare', true);
      f.componentRef.setInput('options', [{ value: 'WD+PH', label: 'Workday + PH' }]);
      f.componentRef.setInput('value', 'WD+PH');
      f.detectChanges();
      const text = f.nativeElement.querySelector('oct-text') as HTMLElement;
      expect(text.className).toContain('whitespace-nowrap');
    });

    it('covers the placeholder too, which truncated for the same reason', () => {
      const f = TestBed.createComponent(SelectComponent);
      f.componentRef.setInput('bare', true);
      f.componentRef.setInput('placeholder', 'Basis');
      f.detectChanges();
      const text = f.nativeElement.querySelector('oct-text') as HTMLElement;
      expect(text.className).not.toContain('text-ellipsis');
    });

    it('leaves the fixed-width class chain alone — it was never the cause', () => {
      // The trigger keeps w-full at every level. The clip came from oct-text and from
      // oct-input's host refusing to shrink, not from this template's widths.
      expect(component.triggerClasses()).toContain('w-full');
    });
  });

  it('round-trips a [formField] value: the form sets it, and a user pick writes it back', () => {
    // A prefilled form (an edit page, the saved payroll session) must show its value.
    @Component({
      imports: [SelectComponent, FormField],
      template: `<oct-select [formField]="f.company" [options]="options" />`
    })
    class Host {
      readonly model = signal({ company: null as string | null });
      readonly f = form(this.model);
      readonly options: SelectOption[] = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' }
      ];
      readonly select = viewChild.required(SelectComponent);
    }

    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    fixture.componentInstance.model.set({ company: 'b' });
    fixture.detectChanges();

    const select = fixture.componentInstance.select();
    expect(select.value()).toBe('b');
    expect(select.selectValue()).toBe('b');

    select.selectOption({ value: 'a', label: 'A' });
    expect(fixture.componentInstance.model().company).toBe('a');
    expect(fixture.componentInstance.f.company().touched()).toBe(true);
  });
});

describe('SelectComponent — the open list for screen readers', () => {
  async function openSelect(multiple: boolean) {
    await TestBed.configureTestingModule({
      imports: [SelectComponent],
      providers: [{ provide: TranslateService, useValue: { instant: (key: string) => key } }]
    }).compileComponents();
    const fixture = TestBed.createComponent(SelectComponent);
    fixture.componentRef.setInput('label', 'Department');
    fixture.componentRef.setInput('multiple', multiple);
    fixture.componentRef.setInput('options', [
      { value: 'eng', label: 'Engineering' },
      { value: 'fin', label: 'Finance' }
    ]);
    fixture.detectChanges();
    // The overlay is set up a microtask after init.
    await Promise.resolve();
    fixture.componentInstance.openDropdown();
    fixture.detectChanges();
    return { fixture, trigger: fixture.nativeElement.querySelector('button[role="combobox"]') as HTMLButtonElement };
  }

  it('points aria-activedescendant at an option inside the listbox that the trigger controls', async () => {
    const { trigger } = await openSelect(false);

    const option = document.getElementById(trigger.getAttribute('aria-activedescendant')!);
    expect(option?.getAttribute('role')).toBe('option');
    expect(option?.getAttribute('aria-selected')).toBe('false');
    const listbox = option?.closest('[role="listbox"]');
    expect(listbox?.id).toBe(trigger.getAttribute('aria-controls'));
    expect(listbox?.getAttribute('aria-label')).toBe('Department');
  });

  it('marks the list multiselectable in multiple mode, with Select All as an option', async () => {
    const { trigger } = await openSelect(true);

    const selectAll = document.getElementById(trigger.getAttribute('aria-activedescendant')!);
    expect(selectAll?.getAttribute('role')).toBe('option');
    expect(selectAll?.closest('[role="listbox"]')?.getAttribute('aria-multiselectable')).toBe('true');
  });
});
