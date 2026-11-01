import { describe, expect, it } from 'vitest';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ButtonComponent } from '../components/button/button';
import { TooltipDirective } from './tooltip.directive';

/**
 * `display: contents` is what `oct-badge` sets on its own host, and it was putting every badge
 * tooltip in the viewport's top-left corner: such a host has no box, so its rect is all zeros.
 * Rects are stubbed because the test DOM does no layout, and this is about which element is measured.
 */
@Component({
  imports: [TooltipDirective],
  template: `
    <div [octTooltip]="'Bank Proof'" [octTooltipShowDelay]="0">
      <span>3 missing</span>
    </div>
  `
})
class ContentsHostComponent {}

const rectAt = (top: number, left: number, width: number, height: number): DOMRect =>
  ({ top, left, width, height, right: left + width, bottom: top + height, x: left, y: top }) as DOMRect;

describe('octTooltip', () => {
  it('measures what a display:contents host renders, not the host itself', () => {
    const fixture = TestBed.createComponent(ContentsHostComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('div') as HTMLElement;
    const child = host.firstElementChild as HTMLElement;
    host.getBoundingClientRect = () => rectAt(0, 0, 0, 0);
    child.getBoundingClientRect = () => rectAt(400, 500, 60, 20);

    host.dispatchEvent(new MouseEvent('mouseenter'));

    const tooltip = document.body.querySelector('[role="tooltip"]') as HTMLElement;
    expect(tooltip).toBeTruthy();
    // Above the child, centred on it. 8px/8px would be the viewport-corner clamp, the bug.
    expect(tooltip.style.top).toBe('392px');
    expect(tooltip.style.left).toBe('530px');

    host.dispatchEvent(new MouseEvent('mouseleave'));
  });

  it('measures the host itself when it has a box', () => {
    const fixture = TestBed.createComponent(ContentsHostComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('div') as HTMLElement;
    const child = host.firstElementChild as HTMLElement;
    host.getBoundingClientRect = () => rectAt(400, 500, 60, 20);
    child.getBoundingClientRect = () => rectAt(0, 0, 0, 0);

    host.dispatchEvent(new MouseEvent('mouseenter'));

    const tooltip = document.body.querySelector('[role="tooltip"]') as HTMLElement;
    expect(tooltip.style.top).toBe('392px');
    expect(tooltip.style.left).toBe('530px');

    host.dispatchEvent(new MouseEvent('mouseleave'));
  });
});

/** oct-button's host never takes focus itself: its inner <button> does, and focus does not bubble. */
@Component({
  imports: [TooltipDirective, ButtonComponent],
  template: `
    <oct-button octTooltip="Approves every payslip in the run" [octTooltipShowDelay]="0">Approve</oct-button>
    <button type="button">Next</button>
  `
})
class ComponentHostComponent {}

describe('octTooltip on keyboard focus', () => {
  const tooltip = () => document.body.querySelector('[role="tooltip"]');

  it('shows when focus lands inside a component host, and describes the control that has focus', () => {
    const fixture = TestBed.createComponent(ComponentHostComponent);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('oct-button button') as HTMLButtonElement;

    button.focus();

    expect(tooltip()).toBeTruthy();
    expect(button.getAttribute('aria-describedby')).toBe(tooltip()!.id);
    expect(fixture.nativeElement.querySelector('oct-button').hasAttribute('aria-describedby')).toBe(false);

    (fixture.nativeElement.querySelector(':scope > button') as HTMLButtonElement).focus();
    expect(tooltip()).toBeNull();
    expect(button.hasAttribute('aria-describedby')).toBe(false);
  });

  it('closes on Escape while focus stays on the host', () => {
    const fixture = TestBed.createComponent(ComponentHostComponent);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('oct-button button') as HTMLButtonElement;
    button.focus();
    expect(tooltip()).toBeTruthy();

    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(tooltip()).toBeNull();
    expect(document.activeElement).toBe(button);
  });
});
