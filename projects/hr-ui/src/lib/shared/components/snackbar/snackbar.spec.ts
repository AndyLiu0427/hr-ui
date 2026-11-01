import { describe, expect, it, vi, beforeEach } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { SnackbarComponent } from './snackbar';

const writeText = vi.fn().mockResolvedValue(undefined);

async function setup(inputs: { message: string; description?: string }): Promise<ComponentFixture<SnackbarComponent>> {
  await TestBed.configureTestingModule({
    imports: [SnackbarComponent],
    providers: [provideZonelessChangeDetection(), provideNoopAnimations()]
  }).compileComponents();

  const fixture = TestBed.createComponent(SnackbarComponent);
  fixture.componentRef.setInput('message', inputs.message);
  if (inputs.description) {
    fixture.componentRef.setInput('description', inputs.description);
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
