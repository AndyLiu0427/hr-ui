import { beforeEach, describe, expect, it } from 'vitest';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwitchComponent } from './switch';

describe('SwitchComponent - label click', () => {
  let fixture: ComponentFixture<SwitchComponent>;
  let emitted: boolean[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(SwitchComponent);
    fixture.componentRef.setInput('label', 'Enable feature');
    emitted = [];
    fixture.componentInstance.switchChange.subscribe(v => emitted.push(v));
    await fixture.whenStable();
  });

  const labelEl = (): HTMLLabelElement => fixture.nativeElement.querySelector('label');
  const buttonEl = (): HTMLButtonElement => fixture.nativeElement.querySelector('button');

  it('toggles once when the label is clicked', async () => {
    labelEl().click();
    await fixture.whenStable();

    expect(emitted).toEqual([true]);
    expect(fixture.componentInstance.checked()).toBe(true);
  });

  it('toggles back to off on a second label click', async () => {
    labelEl().click();
    await fixture.whenStable();
    labelEl().click();
    await fixture.whenStable();

    expect(emitted).toEqual([true, false]);
    expect(fixture.componentInstance.checked()).toBe(false);
  });

  it('toggles once when the switch itself is clicked', async () => {
    buttonEl().click();
    await fixture.whenStable();

    expect(emitted).toEqual([true]);
    expect(fixture.componentInstance.checked()).toBe(true);
  });

  it('shows a pointer cursor over the label', async () => {
    expect(labelEl().className).toContain('cursor-pointer');
  });

  it('shows a not-allowed cursor over the label when disabled', async () => {
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();

    expect(labelEl().className).toContain('cursor-not-allowed');
    expect(labelEl().className).not.toContain('cursor-pointer');
  });

  it('never puts both cursor utilities on the container at once', async () => {
    const containerEl = (): HTMLElement => fixture.nativeElement.querySelector('div');

    expect(containerEl().className).toContain('cursor-pointer');

    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();

    expect(containerEl().className).toContain('cursor-not-allowed');
    expect(containerEl().className).not.toContain('cursor-pointer');
  });

  it('does not toggle when disabled', async () => {
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();

    labelEl().click();
    await fixture.whenStable();

    expect(emitted).toEqual([]);
    expect(fixture.componentInstance.checked()).toBe(false);
  });
});
