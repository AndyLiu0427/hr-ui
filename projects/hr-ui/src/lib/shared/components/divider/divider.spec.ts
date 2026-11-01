import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { DividerComponent, DividerTextPosition } from './divider';

/** The classes of the line before the label and the line after it. */
function lines(textPosition: DividerTextPosition): [string[], string[]] {
  const fixture = TestBed.createComponent(DividerComponent);
  fixture.componentRef.setInput('text', 'or');
  fixture.componentRef.setInput('textPosition', textPosition);
  fixture.detectChanges();
  const row = (fixture.nativeElement as HTMLElement).firstElementChild!;
  const [before, after] = [row.firstElementChild!, row.lastElementChild!];
  return [[...before.classList], [...after.classList]];
}

describe('DividerComponent textPosition', () => {
  it('puts the label at the start with a short line before it', () => {
    const [before, after] = lines('start');
    expect(before).toContain('w-6');
    expect(before).not.toContain('flex-1');
    expect(after).toContain('flex-1');
  });

  it('puts the label at the end with a short line after it', () => {
    const [before, after] = lines('end');
    expect(before).toContain('flex-1');
    expect(after).toContain('w-6');
    expect(after).not.toContain('flex-1');
  });

  it('centres the label between two equal lines by default', () => {
    const [before, after] = lines('center');
    expect(before).toContain('flex-1');
    expect(after).toContain('flex-1');
  });
});
