import { describe, expect, it, vi } from 'vitest';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SearchPanelComponent } from './search-panel';
import { SearchPanelEmptyDirective, SearchPanelRowDirective } from './search-panel.directives';
import type { SearchPanelItem } from './search-panel.model';

@Component({
  imports: [SearchPanelComponent, SearchPanelRowDirective, SearchPanelEmptyDirective],
  template: `
    <oct-search-panel #panel ariaLabel="Search employees" [isOpen]="true" [items]="items()" (tabKey)="onTab($event)">
      <ng-template octSearchPanelRow let-item>{{ item.id }}</ng-template>
      <ng-template octSearchPanelEmpty>
        <button type="button" (click)="panel.clearQuery()">Clear search</button>
      </ng-template>
    </oct-search-panel>
  `
})
class PanelHost {
  readonly items = signal<SearchPanelItem[]>([]);
  readonly tabs: KeyboardEvent[] = [];
  preventTab = false;

  onTab(event: KeyboardEvent): void {
    this.tabs.push(event);
    if (this.preventTab) event.preventDefault();
  }
}

describe('SearchPanelComponent', () => {
  function open() {
    const fixture = TestBed.createComponent(PanelHost);
    fixture.detectChanges();
    const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
    const panel = fixture.debugElement.query(By.directive(SearchPanelComponent)).componentInstance as SearchPanelComponent<SearchPanelItem>;
    return { fixture, dialog, panel };
  }

  it('lets Tab leave the query box, so a button in the empty state can be reached', () => {
    const { fixture, panel } = open();

    // The dialog's own focus trap is not under test here: the test DOM has no layout, so it sees no visible button.
    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    panel.onQueryKeydown(tab);

    expect(tab.defaultPrevented).toBe(false);
    expect(fixture.componentInstance.tabs).toEqual([tab]);
  });

  it('keeps focus in the box when the consumer prevents the Tab, so the dialog cannot move it', () => {
    const { fixture, panel } = open();
    fixture.componentInstance.preventTab = true;

    const tab = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true });
    const stopPropagation = vi.spyOn(tab, 'stopPropagation');
    panel.onQueryKeydown(tab);

    expect(tab.defaultPrevented).toBe(true);
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('names its dialog with ariaLabel', () => {
    const { dialog } = open();

    expect(dialog.getAttribute('aria-label')).toBe('Search employees');
  });
});
