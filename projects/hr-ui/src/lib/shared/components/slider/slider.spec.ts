import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { SliderComponent } from './slider';

function setup(inputs: Record<string, unknown>): SliderComponent {
  const fixture = TestBed.createComponent(SliderComponent);
  fixture.componentRef.setInput('leftLabel', 'Engineering');
  fixture.componentRef.setInput('rightLabel', 'Product');
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  fixture.detectChanges();
  return fixture.componentInstance;
}

const key = (k: string, shiftKey = false) => new KeyboardEvent('keydown', { key: k, shiftKey, cancelable: true });

describe('SliderComponent keyboard', () => {
  it('moves one tick per arrow key with ticks on, even at the default step of 1', () => {
    const slider = setup({ leftPercent: 50, showTicks: true });

    slider.onKeyDown(key('ArrowRight'));
    expect(slider.displayLeftPercent()).toBe(60);

    slider.onKeyDown(key('ArrowLeft'));
    slider.onKeyDown(key('ArrowLeft'));
    expect(slider.displayLeftPercent()).toBe(40);
  });

  it('still moves by step without ticks', () => {
    const slider = setup({ leftPercent: 50 });

    slider.onKeyDown(key('ArrowRight'));
    expect(slider.displayLeftPercent()).toBe(51);
  });
});
