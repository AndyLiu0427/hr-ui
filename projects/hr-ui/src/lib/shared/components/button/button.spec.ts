import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button';

describe('ButtonComponent keyboard press', () => {
  function setup() {
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.detectChanges();
    const clicks: Event[] = [];
    fixture.componentInstance.buttonClick.subscribe(event => clicks.push(event));
    return { button: fixture.componentInstance, clicks };
  }

  const enter = (type: string) => new KeyboardEvent(type, { code: 'Enter' });

  it('clicks when Enter goes down and comes up on the button', () => {
    const { button, clicks } = setup();

    button.onKeyDown(enter('keydown'));
    button.onKeyUp(enter('keyup'));

    expect(clicks.length).toBe(1);
  });

  it('ignores an Enter that went down elsewhere, such as the one that closed a dialog', () => {
    const { button, clicks } = setup();

    button.onKeyUp(enter('keyup'));

    expect(clicks.length).toBe(0);
  });
});
