import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { AvatarComponent, AvatarStatus } from './avatar';

async function render(inputs: Record<string, unknown>): Promise<HTMLElement> {
  const fixture = TestBed.createComponent(AvatarComponent);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('AvatarComponent status dot', () => {
  it.each<AvatarStatus>(['online', 'away', 'busy', 'offline'])('gives the %s dot a box, so its size class draws it', async status => {
    const host = await render({ name: 'Nurul Aisyah', status });

    // md draws a size-2.5 dot. An inline span ignores width and height, so it would draw nothing.
    const dot = host.querySelector<HTMLElement>('.size-2\\.5')!;
    expect(dot.className).toMatch(/(^|\s)(block|flex)(\s|$)/);
  });

  it('is not a live region, and leaves the status to the avatar name', async () => {
    const host = await render({ name: 'Nurul Aisyah', status: 'away' });

    expect(host.querySelector('[role="status"]')).toBeNull();
    expect(host.querySelector('.size-2\\.5')!.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(host.querySelector('[role="img"]')!.getAttribute('aria-label')).toBe('Nurul Aisyah, away');
  });
});

describe('AvatarComponent without a photo or a name', () => {
  it('shows a person icon instead of an image file the library does not ship', async () => {
    const host = await render({});

    expect(host.querySelector('img')).toBeNull();
    expect(host.querySelector('oct-icon')).not.toBeNull();
  });
});

describe('AvatarComponent clickable', () => {
  it('is a native button, so Enter and Space click it, and its click reaches the host', async () => {
    const host = await render({ name: 'Arjun Mehta', clickable: true });
    let clicks = 0;
    host.addEventListener('click', () => clicks++);

    const button = host.querySelector('button')!;
    button.click();

    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-label')).toBe('Arjun Mehta');
    expect(clicks).toBe(1);
  });

  it('stays an image when it is not clickable', async () => {
    const host = await render({ name: 'Arjun Mehta' });

    expect(host.querySelector('button')).toBeNull();
    expect(host.querySelector('[role="img"]')).not.toBeNull();
  });
});
