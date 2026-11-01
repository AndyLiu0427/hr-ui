import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RadioComponent } from './radio';
import { TextComponent } from '../text/text';

describe('RadioComponent', () => {
  const callChange = (ctx: { disabled: () => boolean; radioChange: { emit: ReturnType<typeof vi.fn> } }, checked: boolean) =>
    RadioComponent.prototype.onRadioChange.call(ctx as never, { target: { checked } } as never);

  it('emits true when selected and enabled', () => {
    const emit = vi.fn();
    callChange({ disabled: () => false, radioChange: { emit } }, true);
    expect(emit).toHaveBeenCalledWith(true);
  });

  it('does not emit when the input reports unchecked (radios only fire on select)', () => {
    const emit = vi.fn();
    callChange({ disabled: () => false, radioChange: { emit } }, false);
    expect(emit).not.toHaveBeenCalled();
  });

  it('does not emit when disabled', () => {
    const emit = vi.fn();
    callChange({ disabled: () => true, radioChange: { emit } }, true);
    expect(emit).not.toHaveBeenCalled();
  });
});

describe('RadioComponent - option description', () => {
  let fixture: ComponentFixture<RadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(RadioComponent);
    fixture.componentRef.setInput('label', 'New Contract');
  });

  const text = (): string => (fixture.nativeElement.textContent ?? '').trim();
  const labelEl = (): HTMLLabelElement => fixture.nativeElement.querySelector('label');

  it('renders the description under the label and tops-aligns the row', async () => {
    fixture.componentRef.setInput('description', 'Starts a new employment period.');
    await fixture.whenStable();

    expect(text()).toContain('New Contract');
    expect(text()).toContain('Starts a new employment period.');
    expect(labelEl().className).toContain('items-start');
  });

  it('keeps the original center-aligned single-line layout without a description', async () => {
    await fixture.whenStable();

    expect(text()).toBe('New Contract');
    expect(labelEl().className).toContain('items-center');
  });

  it('drops the description to the disabled color when disabled', async () => {
    fixture.componentRef.setInput('description', 'Starts a new employment period.');
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();

    const texts = fixture.debugElement.queryAll(By.directive(TextComponent));
    expect(texts).toHaveLength(2);
    for (const debugEl of texts) {
      expect((debugEl.componentInstance as TextComponent).color()).toBe('disabled');
    }
    expect(labelEl().className).toContain('cursor-not-allowed');
  });
});
