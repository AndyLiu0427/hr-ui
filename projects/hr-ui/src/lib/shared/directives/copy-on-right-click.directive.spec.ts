import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CopyOnRightClickDirective } from './copy-on-right-click.directive';

@Component({
  imports: [CopyOnRightClickDirective],
  template: `<span [octCopyOnRightClick]="value()">Employee code</span>`
})
class CopyHost {
  readonly value = signal<string | null>('E1024');
}

const writeText = vi.fn().mockResolvedValue(undefined);

describe('octCopyOnRightClick', () => {
  beforeEach(() => {
    writeText.mockClear();
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  });
  afterEach(() => vi.useRealTimers());

  function rightClick(value: string | null): MouseEvent {
    const fixture = TestBed.createComponent(CopyHost);
    fixture.componentInstance.value.set(value);
    fixture.detectChanges();
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 40, clientY: 80 });
    fixture.nativeElement.querySelector('span').dispatchEvent(event);
    return event;
  }

  it('leaves the browser menu alone when there is nothing to copy', () => {
    expect(rightClick('').defaultPrevented).toBe(false);
    expect(rightClick(null).defaultPrevented).toBe(false);
    expect(writeText).not.toHaveBeenCalled();
  });

  it('copies the value instead of opening the browser menu', () => {
    expect(rightClick('E1024').defaultPrevented).toBe(true);
    expect(writeText).toHaveBeenCalledWith('E1024');
  });

  it('tells screen readers that the value was copied, in a polite live region', async () => {
    vi.useFakeTimers();
    rightClick('E1024');
    await vi.advanceTimersByTimeAsync(100);

    const region = document.body.querySelector('[aria-live="polite"]');
    expect(region?.textContent).toBe('Copied');
    expect(document.body.textContent).toContain('Copied!');
  });
});
