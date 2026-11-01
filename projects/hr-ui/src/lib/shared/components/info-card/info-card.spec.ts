import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { CardAction, InfoCardComponent } from './info-card';

describe('InfoCardComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TranslateModule.forRoot(), InfoCardComponent] });
  });

  function render(actions: CardAction[], inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(InfoCardComponent);
    fixture.componentRef.setInput('config', { title: 'Employment', fields: [{ key: 'jobTitle', label: 'Job title' }] });
    fixture.componentRef.setInput('data', { jobTitle: 'Payroll analyst' });
    fixture.componentRef.setInput('actions', actions);
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    // Below 768px wide.
    fixture.componentInstance.isDesktop.set(false);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('names an icon-only action after its label below 768px', () => {
    const card = render([{ label: 'Send payslip', icon: 'Send', handler: () => undefined }]);

    const button = card.querySelector('oct-button button')!;
    expect(button.textContent?.trim()).toBe('');
    expect(button.getAttribute('aria-label')).toBe('Send payslip');
  });

  it('keeps the label of an action without an icon below 768px, so the button is not empty', () => {
    const card = render([{ label: 'Deactivate', handler: () => undefined }]);

    expect(card.querySelector('oct-button button')!.textContent?.trim()).toBe('Deactivate');
  });

  it('maps gridCols and gapSize to their grid classes', () => {
    const card = render([], { gridCols: 3, gapSize: '4' });

    const grid = card.querySelector('oct-card-content .grid')!;
    expect(grid.classList).toContain('md:grid-cols-3');
    expect(grid.classList).toContain('gap-4');
  });
});
