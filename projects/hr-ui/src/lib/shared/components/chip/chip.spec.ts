import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

import { ChipComponent } from './chip';

describe('ChipComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideTranslateService()] }));

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

  it('names the remove button with the label by default', async () => {
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', { COMMON: { REMOVE_LABEL: 'Remove {{label}}' } });
    translate.use('en');
    const fixture = TestBed.createComponent(ChipComponent);
    fixture.componentRef.setInput('label', 'Payroll');
    fixture.componentRef.setInput('removable', true);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button').getAttribute('aria-label')).toBe('Remove Payroll');
  });
});
