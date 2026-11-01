import { describe, expect, it } from 'vitest';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownMenuComponent } from './dropdown-menu';
import { MenuSection } from './dropdown-menu.interface';

@Component({
  imports: [DropdownMenuComponent],
  template: `
    <oct-dropdown-menu
      [isOpen]="open()"
      [menuSections]="sections"
      (closed)="open.set(false)"
      (itemClick)="clicked.push($event.label)"
    >
      <button type="button" (click)="open.set(!open())">Actions</button>
    </oct-dropdown-menu>
  `
})
class MenuHost {
  readonly open = signal(false);
  readonly clicked: string[] = [];
  readonly sections: MenuSection[] = [
    {
      items: [
        { label: 'Signed in as Ana', header: true },
        { label: 'Edit' },
        { label: 'Archive', disabled: true },
        { label: 'Delete' }
      ]
    }
  ];
}

/** keyCode as well as key: the CDK key manager still reads keyCode. */
const KEY_CODES: Record<string, number> = {
  Tab: 9,
  Enter: 13,
  Escape: 27,
  End: 35,
  Home: 36,
  ArrowUp: 38,
  ArrowDown: 40
};

function press(key: string): void {
  document.activeElement!.dispatchEvent(
    new KeyboardEvent('keydown', { key, keyCode: KEY_CODES[key], bubbles: true, cancelable: true })
  );
}

const focusedLabel = (): string | undefined => document.activeElement?.textContent?.trim();

async function openWithKeyboard(): Promise<{
  fixture: ComponentFixture<MenuHost>;
  trigger: HTMLButtonElement;
}> {
  const fixture = TestBed.createComponent(MenuHost);
  await fixture.whenStable();
  const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  trigger.focus();
  trigger.click();
  await fixture.whenStable();
  return { fixture, trigger };
}

describe('DropdownMenuComponent keyboard', () => {
  it('tells assistive tech that the trigger opens a menu, and whether it is open', async () => {
    const { trigger } = await openWithKeyboard();

    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('moves focus to the first item on open, past the header', async () => {
    await openWithKeyboard();

    expect(document.activeElement?.getAttribute('role')).toBe('menuitem');
    expect(focusedLabel()).toBe('Edit');
  });

  it('moves between items with the arrow keys and skips the disabled one', async () => {
    await openWithKeyboard();

    press('ArrowDown');
    expect(focusedLabel()).toBe('Delete');

    press('ArrowDown');
    expect(focusedLabel()).toBe('Edit');

    press('End');
    expect(focusedLabel()).toBe('Delete');

    press('Home');
    expect(focusedLabel()).toBe('Edit');
  });

  it('closes on Escape and puts focus back on the trigger', async () => {
    const { fixture, trigger } = await openWithKeyboard();

    press('Escape');
    await fixture.whenStable();

    expect(document.querySelector('[role="menu"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes on Tab and puts focus back on the trigger instead of the end of the page', async () => {
    const { fixture, trigger } = await openWithKeyboard();

    press('Tab');
    await fixture.whenStable();

    expect(document.querySelector('[role="menu"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('activates the focused item with Enter', async () => {
    const { fixture, trigger } = await openWithKeyboard();

    press('ArrowDown');
    press('Enter');
    await fixture.whenStable();

    expect(fixture.componentInstance.clicked).toEqual(['Delete']);
    expect(document.activeElement).toBe(trigger);
  });
});

describe('DropdownMenuComponent teardown', () => {
  it('removes its open panel when the menu itself is destroyed', async () => {
    const fixture = TestBed.createComponent(MenuHost);
    fixture.componentInstance.open.set(true);
    await fixture.whenStable();
    expect(document.querySelectorAll('.cdk-overlay-pane').length).toBe(1);

    fixture.destroy();

    expect(document.querySelectorAll('.cdk-overlay-pane').length).toBe(0);
  });
});

@Component({
  imports: [DropdownMenuComponent],
  template: `
    <oct-dropdown-menu alignment="left" [isOpen]="true" [menuSections]="sections">
      <button type="button">Help</button>
    </oct-dropdown-menu>
  `
})
class LinkMenuHost {
  readonly sections: MenuSection[] = [{ items: [{ label: 'Edit' }, { label: 'Payroll guide', href: '/guides/payroll' }] }];
}

describe('DropdownMenuComponent links', () => {
  it('renders an item with href as a link, which the arrow keys still reach', async () => {
    const fixture = TestBed.createComponent(LinkMenuHost);
    await fixture.whenStable();

    press('ArrowDown');

    const link = document.activeElement as HTMLAnchorElement;
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/guides/payroll');
    expect(link.getAttribute('role')).toBe('menuitem');
    expect(focusedLabel()).toBe('Payroll guide');
  });
});
