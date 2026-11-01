import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { ThemeControllerComponent, ThemeControllerVariant } from './theme-controller';

function render(variant: ThemeControllerVariant, size?: 'sm' | 'md' | 'lg'): HTMLElement {
  const fixture = TestBed.createComponent(ThemeControllerComponent);
  fixture.componentRef.setInput('variant', variant);
  if (size) fixture.componentRef.setInput('size', size);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('ThemeControllerComponent', () => {
  it('leaves no role or state on the oct-button host, where no screen reader would pair it with the button', () => {
    for (const variant of ['button', 'toggle'] as const) {
      const host = render(variant).querySelector('oct-button')!;
      expect(host.hasAttribute('role'), variant).toBe(false);
      expect(host.hasAttribute('aria-pressed'), variant).toBe(false);
      expect(host.hasAttribute('aria-checked'), variant).toBe(false);
      expect(host.querySelector('button')!.getAttribute('aria-label'), variant).toMatch(/^(Light|Dark) mode\. Switch to (dark|light) mode\.$/);
    }
  });

  it('sizes its button from the size input', () => {
    expect(render('button').querySelector('button')!.className).toContain('!p-1.5');
    expect(render('button', 'lg').querySelector('button')!.className).toContain('!p-2.5');
  });
});
