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

describe('ButtonComponent link mode', () => {
  function render(inputs: Record<string, unknown>) {
    const fixture = TestBed.createComponent(ButtonComponent);
    for (const [name, value] of Object.entries(inputs)) fixture.componentRef.setInput(name, value);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders a link that opens safely in a new tab when href is set', () => {
    const link = render({ href: '/file.pdf', target: '_blank' }).querySelector('a');

    expect(link?.getAttribute('href')).toBe('/file.pdf');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('falls back to a disabled button, because a disabled link can still be followed', () => {
    const element = render({ href: '/file.pdf', disabled: true });

    expect(element.querySelector('a')).toBeNull();
    expect(element.querySelector('button')?.disabled).toBe(true);
  });
});
