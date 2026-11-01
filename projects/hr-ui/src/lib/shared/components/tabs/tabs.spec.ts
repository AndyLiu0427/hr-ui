import { beforeEach, describe, expect, it } from 'vitest';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TabItem, TabsComponent } from './tabs';

/**
 * oct-tabs renders TWO different elements, and which one it picks is the whole point.
 *
 * A tab that swaps content in place is a `role="tab"` button. A tab that NAVIGATES is a real
 * anchor: a screen reader announcing "tab, selected" for something that changes the page is
 * wrong, and a button silently drops middle-click, cmd-click, hover preview and
 * copy-link-address. `href` on a TabItem is what selects the second form.
 *
 * These are the component's first tests. Four callers already render it — import-dialog,
 * pay-item detail, payroll-run-list and the design-system gallery — and all four pass no href,
 * so the button path below is their regression guard as much as this feature's.
 */
@Component({
  imports: [TabsComponent],
  template: `<oct-tabs [tabs]="tabs" [activeTab]="active" [interactive]="interactive" />`
})
class HostComponent {
  tabs: TabItem[] = [];
  active = '';
  interactive = true;
}

describe('TabsComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const BUTTON_TABS: TabItem[] = [
    { id: 'a', label: 'Details' },
    { id: 'b', label: 'History' }
  ];
  const LINK_TABS: TabItem[] = [
    { id: 'a', label: 'AMZ-001', href: '/payroll/job-orders/detail?id=a' },
    { id: 'b', label: 'AMZ-002', href: '/payroll/job-orders/detail?id=b' }
  ];

  const els = (selector: string) => Array.from(fixture.nativeElement.querySelectorAll(selector));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideNoopAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
  });

  describe('without href — the existing callers', () => {
    beforeEach(() => {
      host.tabs = BUTTON_TABS;
      host.active = 'a';
      fixture.detectChanges();
    });

    it('renders role="tab" buttons, not links', () => {
      expect(els('button[role="tab"]')).toHaveLength(2);
      expect(els('a')).toHaveLength(0);
    });

    it('marks the active tab with aria-selected', () => {
      const selected = els('button[role="tab"][aria-selected="true"]') as HTMLElement[];
      expect(selected).toHaveLength(1);
      expect(selected[0].textContent?.trim()).toBe('Details');
    });
  });

  describe('with href — a navigating tab', () => {
    beforeEach(() => {
      host.tabs = LINK_TABS;
      host.active = 'a';
      fixture.detectChanges();
    });

    it('renders anchors carrying the href, so middle-click and copy-link work', () => {
      const anchors = els('a[role="link"]') as HTMLAnchorElement[];
      expect(anchors).toHaveLength(2);
      expect(anchors.map(a => a.getAttribute('href'))).toEqual(['/payroll/job-orders/detail?id=a', '/payroll/job-orders/detail?id=b']);
      // Not role="tab": these change the page, and there is no tabpanel to associate.
      expect(els('button[role="tab"]')).toHaveLength(0);
    });

    it('marks the active tab with aria-current rather than aria-selected', () => {
      const current = els('a[aria-current="page"]') as HTMLElement[];
      expect(current).toHaveLength(1);
      expect(current[0].textContent?.trim()).toBe('AMZ-001');
    });
  });

  describe('inert mode', () => {
    beforeEach(() => {
      host.tabs = LINK_TABS;
      host.active = 'a';
      host.interactive = false;
      fixture.detectChanges();
    });

    it('DROPS the href, so middle-click and the context menu cannot navigate either', () => {
      // preventDefault alone would leave both of those working, which defeats the point of a
      // caller disabling the strip (an open edit dialog whose draft would be silently replaced).
      const anchors = els('a') as HTMLAnchorElement[];
      expect(anchors).toHaveLength(2);
      for (const anchor of anchors) {
        expect(anchor.getAttribute('href')).toBeNull();
        expect(anchor.getAttribute('aria-disabled')).toBe('true');
      }
    });

    it('does not emit a tab change on click', () => {
      let emitted: string | null = null;
      const tabs = fixture.debugElement.children[0].componentInstance as TabsComponent;
      tabs.tabChange.subscribe((id: string) => (emitted = id));

      (els('a')[1] as HTMLElement).click();
      fixture.detectChanges();

      expect(emitted).toBeNull();
    });
  });

  it('leaves a Cmd, Ctrl or Shift click on a link tab to the browser, so it opens in a new tab', () => {
    host.tabs = LINK_TABS;
    host.active = 'a';
    fixture.detectChanges();

    let emitted: string | null = null;
    const tabs = fixture.debugElement.children[0].componentInstance as TabsComponent;
    tabs.tabChange.subscribe((id: string) => (emitted = id));

    for (const modifier of ['metaKey', 'ctrlKey', 'shiftKey'] as const) {
      const click = new MouseEvent('click', { bubbles: true, cancelable: true, [modifier]: true });
      (els('a')[1] as HTMLElement).dispatchEvent(click);
      expect(click.defaultPrevented, modifier).toBe(false);
    }
    expect(emitted).toBeNull();

    const plain = new MouseEvent('click', { bubbles: true, cancelable: true });
    (els('a')[1] as HTMLElement).dispatchEvent(plain);
    expect(plain.defaultPrevented).toBe(true);
    expect(emitted).toBe('b');
  });

  it('dims inert button tabs and drops their pointer cursor, as it does for link tabs', () => {
    host.tabs = BUTTON_TABS;
    host.active = 'a';
    host.interactive = false;
    fixture.detectChanges();

    for (const tab of els('button[role="tab"]') as HTMLElement[]) {
      expect(tab.classList).toContain('opacity-60');
      expect(tab.classList).toContain('cursor-default');
      expect(tab.classList).not.toContain('cursor-pointer');
    }
  });

  it('describes only the active tab, by an id that two strips with the same tab ids do not share', () => {
    const DESCRIBED: TabItem[] = [
      { id: 'a', label: 'Details', description: 'Name, job title and department' },
      { id: 'b', label: 'History', description: 'Every change to this record' }
    ];
    host.tabs = DESCRIBED;
    host.active = 'a';
    fixture.detectChanges();
    const second = TestBed.createComponent(HostComponent);
    second.componentInstance.tabs = DESCRIBED;
    second.componentInstance.active = 'a';
    second.detectChanges();

    const [active, inactive] = els('button[role="tab"]') as HTMLElement[];
    const describedBy = active.getAttribute('aria-describedby')!;
    expect(fixture.nativeElement.querySelector('#' + describedBy)?.textContent?.trim()).toBe('Name, job title and department');
    expect(inactive.hasAttribute('aria-describedby')).toBe(false);
    expect(second.nativeElement.querySelector('button[role="tab"]').getAttribute('aria-describedby')).not.toBe(describedBy);
  });

  it('emits the clicked tab id when interactive', () => {
    host.tabs = LINK_TABS;
    host.active = 'a';
    fixture.detectChanges();

    let emitted: string | null = null;
    const tabs = fixture.debugElement.children[0].componentInstance as TabsComponent;
    tabs.tabChange.subscribe((id: string) => (emitted = id));

    (els('a')[1] as HTMLElement).click();
    fixture.detectChanges();

    expect(emitted).toBe('b');
  });
});
