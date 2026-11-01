import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { DialogComponent } from './dialog';

/** The component under test, with `isOpen` and `persistent` set the way a caller would. */
function setup(persistent: boolean) {
  const fixture = TestBed.createComponent(DialogComponent);
  fixture.componentRef.setInput('isOpen', true);
  fixture.componentRef.setInput('persistent', persistent);
  fixture.detectChanges();

  const closes: boolean[] = [];
  fixture.componentInstance.openChange.subscribe(open => closes.push(open));
  return { fixture, component: fixture.componentInstance, closes };
}

describe('DialogComponent persistent mode', () => {
  it('ignores the backdrop and Escape, so a stray click cannot throw the dialog away', () => {
    const { component, closes } = setup(true);

    component.dismiss();
    component.handleEscapeKey();

    expect(closes).toEqual([]);
  });

  it('shakes instead, so the refused press does not read as nothing happening', async () => {
    const { component } = setup(true);

    component.dismiss();
    await new Promise(requestAnimationFrame);

    expect(component['shaking']()).toBe(true);
  });

  it('still closes on the close button, which is the one way out', () => {
    const { component, closes } = setup(true);

    component.closeDialog();

    expect(closes).toEqual([false]);
  });

  it('closes on the backdrop by default, as every other dialog does', () => {
    const { component, closes } = setup(false);

    component.dismiss();

    expect(closes).toEqual([false]);
  });
});
