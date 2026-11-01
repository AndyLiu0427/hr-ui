import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { ProgressBarComponent } from './progress-bar';

async function render(inputs: Record<string, unknown>): Promise<HTMLElement> {
  const fixture = TestBed.createComponent(ProgressBarComponent);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('ProgressBarComponent', () => {
  it('is a progressbar from 0 to 100, named by its label', async () => {
    const host = await render({ progress: 64.4, label: 'Importing timesheets' });

    expect(host.getAttribute('role')).toBe('progressbar');
    expect(host.getAttribute('aria-valuemin')).toBe('0');
    expect(host.getAttribute('aria-valuemax')).toBe('100');
    expect(host.getAttribute('aria-valuenow')).toBe('64');
    expect(host.getAttribute('aria-label')).toBe('Importing timesheets');
  });

  it('is named "Progress" and shows no label text when it has no label', async () => {
    const host = await render({ progress: 30 });

    expect(host.getAttribute('aria-label')).toBe('Progress');
    expect(host.textContent!.trim()).toBe('30%');
  });

  it('keeps the value and the percentage inside 0 to 100', async () => {
    const host = await render({ progress: 120 });

    expect(host.getAttribute('aria-valuenow')).toBe('100');
    expect(host.textContent!.trim()).toBe('100%');
  });

  it('shows nothing above the bar with no label and no percentage', async () => {
    const host = await render({ progress: 30, showPercentage: false });

    expect(host.textContent!.trim()).toBe('');
  });
});
