import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { PopupService } from './popup.service';

/** 'pending' when the promise is still open a moment later: an unsettled popup leaves its caller waiting forever. */
const settled = <T>(promise: Promise<T>): Promise<T | 'pending'> =>
  Promise.race([promise, new Promise<'pending'>(resolve => setTimeout(() => resolve('pending'), 50))]);

const nextFrame = () => new Promise(requestAnimationFrame);

describe('PopupService', () => {
  let popup: PopupService;
  let trigger: HTMLButtonElement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    popup = TestBed.inject(PopupService);
    trigger = document.body.appendChild(document.createElement('button'));
    trigger.textContent = 'Approve pay run';
    trigger.focus();
  });

  afterEach(() => {
    popup.close();
    trigger.remove();
  });

  it('gives focus back to the control that opened it when it closes', async () => {
    const answer = popup.confirm('Approve the October pay run?', '48 employees will be paid.');
    await nextFrame();
    expect(document.activeElement).not.toBe(trigger);

    popup.close();

    expect(document.activeElement).toBe(trigger);
    expect(await settled(answer)).toBe(false);
  });

  it('settles with false when close() is called from code', async () => {
    const answer = popup.confirm('Approve the October pay run?', '48 employees will be paid.');
    await nextFrame();

    popup.close();

    expect(await settled(answer)).toBe(false);
  });

  it('settles the first popup when a second one replaces it', async () => {
    const first = popup.info('Payslips are being generated.');
    await nextFrame();

    const second = popup.confirm('Send the payslips now?', '48 employees will get an email.');

    expect(await settled(first)).toBeUndefined();
    expect(await settled(second)).toBe('pending');
  });

  it('settles and removes a popup closed before its first frame', async () => {
    const answer = popup.confirm('Approve the October pay run?', '48 employees will be paid.');
    popup.close();
    await nextFrame();

    expect(await settled(answer)).toBe(false);
    expect(document.body.querySelector('oct-dialog')).toBeNull();
    expect(popup.isDialogOpen()).toBe(false);
  });

  it('still resolves to the result of the button the user picked', async () => {
    const answer = popup.confirm('Approve the October pay run?', '48 employees will be paid.', 'Approve');
    await nextFrame();

    const approve = [...document.body.querySelectorAll<HTMLButtonElement>('oct-dialog button')].find(button => button.textContent?.includes('Approve'));
    approve!.click();

    expect(await settled(answer)).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });
});
