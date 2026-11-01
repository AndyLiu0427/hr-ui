import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { getDebugNode, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { SnackbarComponent } from './snackbar';
import { SnackbarService } from './snackbar.service';

const writeText = vi.fn().mockResolvedValue(undefined);

async function setup(inputs: { message: string; description?: string; duration?: number }): Promise<ComponentFixture<SnackbarComponent>> {
  await TestBed.configureTestingModule({
    imports: [SnackbarComponent],
    providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
  }).compileComponents();

  const fixture = TestBed.createComponent(SnackbarComponent);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  fixture.detectChanges();
  return fixture;
}

describe('SnackbarComponent', () => {
  beforeEach(() => {
    writeText.mockClear();
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  });

  it('copies what it says when the box is clicked', async () => {
    const fixture = await setup({ message: 'Upload failed', description: 'contract.pdf' });

    await fixture.componentInstance.onSnackbarClick();

    expect(writeText).toHaveBeenCalledWith('Upload failed\ncontract.pdf');
    expect(fixture.componentInstance.defaultIcon()).toBe('Check');
  });

  it('does not copy when the close button is the thing clicked', async () => {
    const fixture = await setup({ message: 'Upload failed' });
    const event = new Event('click', { bubbles: true, cancelable: true });
    const stopPropagation = vi.spyOn(event, 'stopPropagation');

    fixture.componentInstance.onDismiss(event);

    expect(stopPropagation).toHaveBeenCalled();
    expect(writeText).not.toHaveBeenCalled();
  });

  it('leaves the message on screen when the browser refuses the clipboard', async () => {
    const fixture = await setup({ message: 'Upload failed' });
    writeText.mockRejectedValueOnce(new Error('denied'));

    await fixture.componentInstance.onSnackbarClick();

    expect(fixture.componentInstance.copied()).toBe(false);
  });
});

describe('SnackbarComponent timer', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    Reflect.deleteProperty(document, 'hidden');
  });

  /** The box renders a microtask after init, the way the enter animation needs it. */
  async function rendered(duration: number): Promise<{ snackbar: SnackbarComponent; box: HTMLElement }> {
    const fixture = await setup({ message: 'Contract saved', duration });
    await Promise.resolve();
    fixture.detectChanges();
    return { snackbar: fixture.componentInstance, box: fixture.nativeElement.querySelector('[role="status"]') };
  }

  it('waits while the pointer is on it, then closes with the time that was left', async () => {
    const { snackbar, box } = await rendered(1000);

    vi.advanceTimersByTime(400);
    box.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(5000);
    expect(snackbar.animationState()).toBe('in');

    box.dispatchEvent(new MouseEvent('mouseleave'));
    vi.advanceTimersByTime(599);
    expect(snackbar.animationState()).toBe('in');

    vi.advanceTimersByTime(1);
    expect(snackbar.animationState()).toBe('void');
  });

  it('does not run out in a background tab, so it is still there when the reader comes back', async () => {
    const { snackbar } = await rendered(1000);

    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    vi.advanceTimersByTime(60_000);

    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(snackbar.animationState()).toBe('in');

    vi.advanceTimersByTime(1000);
    expect(snackbar.animationState()).toBe('void');
  });
});

describe('SnackbarService duration', () => {
  const undo = { text: 'Undo', handler: () => undefined };

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection(), provideNoopAnimations()] });
  });
  afterEach(() => vi.useRealTimers());

  it('leaves a snackbar with an action on screen long after a plain one would have closed', async () => {
    vi.useFakeTimers();
    const service = TestBed.inject(SnackbarService);
    const ref = service.success('Contract saved', { action: undo });

    await vi.advanceTimersByTimeAsync(60_000);

    const snackbar = getDebugNode(document.body.querySelector('oct-snackbar'))!.componentInstance as SnackbarComponent;
    expect(snackbar.animationState()).toBe('in');
    ref.dismiss();
  });

  it('keeps a snackbar with an action until the user acts on it or closes it', () => {
    const service = TestBed.inject(SnackbarService);

    expect(service.success('Contract saved', { action: undo }).config.duration).toBe(0);
    expect(service.info('Payslip sent', { action: undo }).config.duration).toBe(0);
    expect(service.show({ message: 'Payslip sent', action: undo }).config.duration).toBe(0);

    service.dismissAll();
  });

  it('still closes one with an action when the caller set a duration', () => {
    const service = TestBed.inject(SnackbarService);

    expect(service.success('Contract saved', { action: undo, duration: 8000 }).config.duration).toBe(8000);
    expect(service.success('Contract saved').config.duration).toBe(3000);

    service.dismissAll();
  });
});
