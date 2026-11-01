import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { FilterComponent } from './filter';

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
