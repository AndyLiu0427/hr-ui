import { describe, expect, it, vi } from 'vitest';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { BottomSheetComponent } from './bottom-sheet';

@Component({
  imports: [BottomSheetComponent],
  template: `
    <oct-bottom-sheet [isOpen]="open()" title="Filters" (closed)="closes = closes + 1">
      Body
    </oct-bottom-sheet>
  `
})
class SheetHost {
  readonly open = signal(true);
  closes = 0;
}

/** A pointer event at a chosen time: the sheet measures speed from the events' own timestamps. */
function pointer(type: string, clientY: number, timeStamp: number): Event {
  const event = new MouseEvent(type, { clientY, button: 0, bubbles: true });
  Object.defineProperty(event, 'timeStamp', { value: timeStamp });
  return event;
}

async function openSheet() {
  const fixture = TestBed.createComponent(SheetHost);
  await fixture.whenStable();
  // The sheet slides in two frames after it opens.
  await new Promise(requestAnimationFrame);
  await new Promise(requestAnimationFrame);
  await fixture.whenStable();
  const panel = document.querySelector('[role="dialog"]') as HTMLElement;
  const handle = panel.firstElementChild as HTMLElement;
  // The test DOM has no pointer capture.
  handle.setPointerCapture = () => undefined;

  const drag = async (toY: number, durationMs: number) => {
    handle.dispatchEvent(pointer('pointerdown', 0, 1000));
    handle.dispatchEvent(pointer('pointermove', toY, 1000 + durationMs));
    handle.dispatchEvent(pointer('pointerup', toY, 1000 + durationMs));
    await fixture.whenStable();
  };
  return { host: fixture.componentInstance, panel, handle, drag };
}

describe('BottomSheetComponent drag to close', () => {
  it('closes on a short, fast flick', async () => {
    const { host, drag } = await openSheet();

    await drag(40, 200);

    expect(host.closes).toBe(1);
  });

  it('springs back after a short, slow drag', async () => {
    const { host, panel, drag } = await openSheet();

    await drag(40, 1000);

    expect(host.closes).toBe(0);
    expect(panel.style.transform).toBe('translateY(0)');
  });

  it('closes on a long drag, however slow', async () => {
    const { host, drag } = await openSheet();

    await drag(150, 3000);

    expect(host.closes).toBe(1);
  });

  it('gives a little when pulled up, instead of stopping dead', async () => {
    const { panel, handle } = await openSheet();

    handle.dispatchEvent(pointer('pointerdown', 0, 1000));
    handle.dispatchEvent(pointer('pointermove', -100, 1100));
    await Promise.resolve();
    TestBed.tick();

    expect(panel.style.transform).toBe('translateY(-40px)');
  });
});

describe('BottomSheetComponent pointer capture', () => {
  it('still drags, and reports no error, when the browser refuses capture for a pointer that is no longer active', async () => {
    const { host, handle, drag } = await openSheet();
    handle.setPointerCapture = () => {
      throw new DOMException('No active pointer with the given id is found.', 'NotFoundError');
    };
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await drag(200, 300);

    expect(consoleError).not.toHaveBeenCalled();
    expect(host.closes).toBe(1);
    consoleError.mockRestore();
  });
});
