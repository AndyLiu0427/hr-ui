import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { ChipComponent } from './chip';

describe('ChipComponent', () => {
  it('emits remove without triggering the row it sits in', () => {
    const fixture = TestBed.createComponent(ChipComponent);
    fixture.componentRef.setInput('label', 'INV');
    fixture.componentRef.setInput('removable', true);
    fixture.detectChanges();
    let removed = 0;
    let rowClicks = 0;
    fixture.componentInstance.remove.subscribe(() => removed++);
    fixture.nativeElement.addEventListener('click', () => rowClicks++);

    (fixture.nativeElement as HTMLElement).querySelector('button')!.click();

    expect(removed).toBe(1);
    expect(rowClicks).toBe(0);
  });
});
