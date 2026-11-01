import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FilterComponent, FilterOption } from './filter';

describe('FilterComponent: Escape on the trigger', () => {
  let component: FilterComponent<string>;

  const escape = () => new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [TranslateModule.forRoot(), FilterComponent] });
    const fixture = TestBed.createComponent(FilterComponent<string>);
    fixture.componentRef.setInput('label', 'Status');
    component = fixture.componentInstance;
  });

  it('marks the key as handled when it closes the menu, so a side panel around it stays open', () => {
    component.isOpen.set(true);
    const event = escape();
    component.handleKeydown(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('leaves the key alone when the menu is already closed', () => {
    const event = escape();
    component.handleKeydown(event);
    expect(event.defaultPrevented).toBe(false);
  });
});

const DEPARTMENTS: FilterOption<string>[] = [
  { label: 'Closed branch', value: 'CLO', disabled: true },
  { label: 'Finance', value: 'FIN' },
  { label: 'People', value: 'PPL' },
  { label: 'Sales', value: 'SAL' }
];

async function render(inputs: Record<string, unknown> = {}): Promise<{
  fixture: ComponentFixture<FilterComponent<string>>;
  trigger: HTMLButtonElement;
}> {
  TestBed.configureTestingModule({ imports: [TranslateModule.forRoot(), FilterComponent] });
  const fixture = TestBed.createComponent(FilterComponent<string>);
  fixture.componentRef.setInput('label', 'Department');
  fixture.componentRef.setInput('options', DEPARTMENTS);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  await fixture.whenStable();
  return { fixture, trigger: fixture.nativeElement.querySelector('oct-button button') };
}

async function openWithKeyboard(inputs: Record<string, unknown> = {}) {
  const rendered = await render(inputs);
  rendered.trigger.focus();
  rendered.trigger.click();
  await rendered.fixture.whenStable();
  return rendered;
}

function press(key: string, shiftKey = false): void {
  document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true }));
}

const focusedLabel = (): string | undefined => document.activeElement?.textContent?.trim();

/** The options render a beat after the menu: the virtual list measures itself first. */
const optionsRendered = () => vi.waitFor(() => expect(document.querySelectorAll('[role="menuitemcheckbox"]').length).toBe(DEPARTMENTS.length));

describe('FilterComponent menu events', () => {
  it('does not emit menuClosed when it is created, only when an open menu closes', async () => {
    TestBed.configureTestingModule({ imports: [TranslateModule.forRoot(), FilterComponent] });
    const fixture = TestBed.createComponent(FilterComponent<string>);
    fixture.componentRef.setInput('label', 'Department');
    let closed = 0;
    fixture.componentInstance.menuClosed.subscribe(() => closed++);
    await fixture.whenStable();
    expect(closed).toBe(0);

    fixture.componentInstance.toggleMenu();
    fixture.componentInstance.toggleMenu();
    await fixture.whenStable();
    expect(closed).toBe(1);
  });
});

describe('FilterComponent trigger', () => {
  it('names the button that takes focus, and tells it the menu state', async () => {
    const { fixture, trigger } = await render({ selectedValues: ['FIN', 'PPL'] });

    expect(trigger.getAttribute('aria-label')).toBe('Department filter, 2 selected');
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    trigger.click();
    await fixture.whenStable();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });
});

describe('FilterComponent keyboard', () => {
  it('moves focus to the search box when the menu opens', async () => {
    await openWithKeyboard({ searchable: true });

    expect(document.activeElement?.getAttribute('type')).toBe('search');
  });

  it('moves focus to the first option that can be picked when there is no search box', async () => {
    await openWithKeyboard();

    await vi.waitFor(() => expect(focusedLabel()).toBe('Finance'));
  });

  it('moves between the search box and the options with the arrow keys', async () => {
    await openWithKeyboard({ searchable: true });
    await optionsRendered();

    press('ArrowDown');
    expect(focusedLabel()).toBe('Finance');
    press('ArrowDown');
    expect(focusedLabel()).toBe('People');
    press('ArrowUp');
    press('ArrowUp');
    expect(document.activeElement?.getAttribute('type')).toBe('search');
  });

  it('makes each option one tab stop, named by its label', async () => {
    await openWithKeyboard();
    await optionsRendered();

    const option = document.querySelectorAll('[role="menuitemcheckbox"]')[1];
    expect(option.getAttribute('aria-label')).toBe('Finance');
    // The picture of a checkbox inside is inert, so Tab does not stop on its native box too.
    expect(option.querySelector('oct-checkbox')!.hasAttribute('inert')).toBe(true);
  });

  it('closes on Escape inside the menu and puts focus back on the button', async () => {
    const { fixture, trigger } = await openWithKeyboard();
    await vi.waitFor(() => expect(focusedLabel()).toBe('Finance'));

    press('Escape');
    await fixture.whenStable();

    expect(document.querySelector('[role="menu"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('closes when Tab leaves the last option, and puts focus back on the button', async () => {
    const { fixture, trigger } = await openWithKeyboard();
    await vi.waitFor(() => expect(focusedLabel()).toBe('Finance'));

    press('ArrowDown');
    press('ArrowDown');
    expect(focusedLabel()).toBe('Sales');
    press('Tab');
    await fixture.whenStable();

    expect(document.querySelector('[role="menu"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
