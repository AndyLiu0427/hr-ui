import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorTagComponent } from './color-tag';

describe('ColorTagComponent', () => {
  let fixture: ComponentFixture<ColorTagComponent>;
  let host: HTMLElement;

  function setup(inputs: Record<string, unknown> = {}) {
    // Reset here, not only in beforeEach: every test re-runs setup with different inputs,
    // and TestBed refuses to be reconfigured once it has instantiated.
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [ColorTagComponent] });
    fixture = TestBed.createComponent(ColorTagComponent);
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    host = fixture.nativeElement as HTMLElement;
  }

  const mark = () => host.querySelector<HTMLElement>('.oct-tag-inline');
  const wedge = () => host.querySelector<HTMLElement>('.oct-tag-wedge');
  const corner = () => host.querySelector<HTMLElement>('.oct-tag-corner');

  beforeEach(() => TestBed.resetTestingModule());

  describe('label', () => {
    it('prints the code beside the mark, so a colour is never the only identifier', () => {
      setup({ variant: 'inline', color: 'orange', label: 'JO-4471' });
      expect(host.textContent).toContain('JO-4471');
      expect(mark()?.className).toContain('bg-orange-600');
    });

    // A column of codes has to keep one straight left edge, so an unfiled client still
    // reserves the mark's box. Without a label there is nothing to line up against.
    it('keeps the unpainted mark when labelled, so labelled rows stay aligned', () => {
      setup({ variant: 'inline', color: null, label: 'JO-4471' });
      expect(mark()).not.toBeNull();
      expect(mark()?.className).not.toContain('bg-');
    });

    it('draws nothing at all for an unfiled client with no label', () => {
      setup({ variant: 'inline', color: null });
      expect(mark()).toBeNull();
    });
  });

  describe('corner', () => {
    it('pins the mark to the cell and still prints the code', () => {
      setup({ variant: 'corner', color: 'red', label: 'EMP-00421' });
      expect(corner()?.className).toContain('bg-red-600');
      expect(host.textContent).toContain('EMP-00421');
    });

    // Nothing is reserved here, unlike inline: an absolute mark takes no space, so an unfiled
    // client leaves the column aligned without a placeholder.
    it('draws no mark for an unfiled client, keeping the label in place', () => {
      setup({ variant: 'corner', color: null, label: 'EMP-00421' });
      expect(corner()).toBeNull();
      expect(host.textContent).toContain('EMP-00421');
    });
  });

  it('cut paints a wedge rather than the row mark', () => {
    setup({ variant: 'cut', color: 'red' });
    expect(wedge()?.className).toContain('bg-red-600');
    expect(mark()).toBeNull();
  });
});
