import { beforeEach, describe, expect, it } from 'vitest';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { disabled, form, required } from '@angular/forms/signals';
import { InputSelectComponent } from './input-select';

/** A host, because the control is driven by two signal-forms fields rather than by plain inputs. */
@Component({
  selector: 'oct-test-host',
  imports: [InputSelectComponent],
  template: ` <oct-input-select [amountField]="f.amount" [unitField]="f.rateType" [unitOptions]="options" [label]="'Pay Rate'" /> `
})
class HostComponent {
  readonly model = signal({ amount: '', rateType: '' });
  /** Callers disable through the schema, so the spec must too. */
  readonly locked = signal(false);
  readonly f = form(this.model, path => {
    required(path.amount, { when: ({ valueOf }) => !!valueOf(path.rateType), message: 'Enter an amount' });
    required(path.rateType, { when: ({ valueOf }) => !!valueOf(path.amount), message: 'Select a rate basis' });
    disabled(path, () => this.locked());
  });
  readonly options = [
    { value: 'WD', label: 'Workday' },
    { value: 'WR', label: 'Workday + rest day + PH' },
    { value: 'WD+PH', label: 'Workday + PH' },
    { value: 'CD', label: 'Calendar day' },
    { value: 'Daily', label: 'Daily' },
    { value: 'Hourly', label: 'Hourly' }
  ];
}

describe('InputSelectComponent', () => {
  let host: HostComponent;
  let element: HTMLElement;
  let control: InputSelectComponent;
  let fixture: ReturnType<typeof TestBed.createComponent<HostComponent>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [{ provide: TranslateService, useValue: { instant: (k: string) => k } }]
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
    control = fixture.debugElement.children[0].componentInstance;
  });

  describe('one shell, one label, one helper row', () => {
    it('renders exactly one label', () => {
      expect(element.querySelectorAll('label')).toHaveLength(1);
    });

    it('points the label at the amount input', () => {
      const label = element.querySelector('label') as HTMLLabelElement;
      const input = element.querySelector('input') as HTMLInputElement;
      expect(label.getAttribute('for')).toBe(input.id);
    });

    // The asterisk comes from the SCHEMA, never from a prop: there is no `required` input to
    // pass, for the same reason there is no `disabled` one.
    it('shows no asterisk while neither half is required', () => {
      expect(control.isRequired()).toBe(false);
      expect(element.querySelector('label')?.textContent).not.toContain('*');
    });

    it('raises the asterisk when a schema rule makes a half required', () => {
      host.model.set({ amount: '', rateType: 'WD' });
      fixture.detectChanges();

      expect(control.isRequired()).toBe(true);
      expect(element.querySelector('label')?.textContent).toContain('*');
    });

    it('renders exactly one fixed-height helper row', () => {
      // Two rows would make the control 20px taller than a plain field beside it in a form grid.
      expect(element.querySelectorAll('.h-5')).toHaveLength(1);
    });

    it('puts the border and focus ring on the shell, once', () => {
      const cls = control.shellClass();
      expect(cls).toContain('border-primary');
      expect(cls).toContain('focus-within:!outline');
    });

    it('stands the shell ring down while the unit half rings itself', () => {
      // Both at once stack into one 5px band down the right edge.
      control.unitFocused.set(true);
      expect(control.shellClass()).not.toContain('focus-within:!outline');
      control.unitFocused.set(false);
      expect(control.shellClass()).toContain('focus-within:!outline');
    });

    it('separates the halves with a border, not a shadow', () => {
      // A black-alpha shadow is invisible on the dark surface, and this seam carries meaning.
      expect(control.dividerClass).toContain('border-l');
      expect(control.dividerClass).not.toContain('shadow');
    });
  });

  describe('the amount is text, never type=number', () => {
    it('uses text with a decimal inputmode and a numeric pattern', () => {
      const input = element.querySelector('input') as HTMLInputElement;
      expect(input.getAttribute('type')).toBe('text');
      expect(input.getAttribute('inputmode')).toBe('decimal');
      expect(input.getAttribute('pattern')).toBe('[0-9]*[.,]?[0-9]*');
    });
  });

  describe('atomic error state', () => {
    it('is clean when both halves are empty', () => {
      expect(control.hasError()).toBe(false);
    });

    it('errors on ANY touched, not on the touched half only', () => {
      // Typing an amount and tabbing past the unit never touches the unit, so a per-field rule
      // would show nothing while the save is rejected.
      host.model.set({ amount: '27475', rateType: '' });
      host.f.amount().markAsTouched();
      expect(control.hasError()).toBe(true);
      expect(control.errorMessage()).toBe('Select a rate basis');
    });

    it('reports the missing amount when only the unit is filled', () => {
      host.model.set({ amount: '', rateType: 'WD' });
      host.f.rateType().markAsTouched();
      expect(control.hasError()).toBe(true);
      expect(control.errorMessage()).toBe('Enter an amount');
    });

    it('clears once both halves are filled', () => {
      host.model.set({ amount: '27475', rateType: 'WD' });
      host.f.amount().markAsTouched();
      expect(control.hasError()).toBe(false);
    });

    it('stays clean while invalid but untouched', () => {
      host.model.set({ amount: '27475', rateType: '' });
      expect(control.hasError()).toBe(false);
    });

    it('shows the helper text when there is no error', () => {
      expect(control.displayHelperText()).toBe('');
    });
  });

  describe('disabled comes from the fields, never from a prop', () => {
    it('exposes no disabled input at all', () => {
      // A shell-level flag would shade the box while both halves stayed editable, because
      // signal-forms forbids binding [disabled] beside [formField]. A border that lies is worse
      // than no disabled support.
      expect((control as unknown as Record<string, unknown>)['disabled']).toBeUndefined();
    });

    it('is enabled while the fields are enabled', () => {
      expect(control.isDisabled()).toBe(false);
      expect(control.shellClass()).not.toContain('cursor-not-allowed');
    });

    it('shades the shell once the FORM disables the fields', () => {
      host.locked.set(true);
      fixture.detectChanges();
      expect(control.isDisabled()).toBe(true);
      expect(control.shellClass()).toContain('cursor-not-allowed');
    });

    it('disables both halves for real, not just the border', () => {
      host.locked.set(true);
      fixture.detectChanges();
      const amount = element.querySelector('input') as HTMLInputElement;
      expect(amount.disabled).toBe(true);
      const trigger = element.querySelector('oct-select button') as HTMLButtonElement;
      expect(trigger.disabled).toBe(true);
    });
  });

  describe('unit dropdown sizing', () => {
    it('sizes maxHeight above the option list so six options do not sit on the cap', () => {
      // 6 x 40 = 240, which is also the default cap: a boundary decided by sub-pixel padding.
      expect(control.unitMaxHeight()).toBe('264px');
    });

    it('floors the panel width, since the trigger is narrower than the labels', () => {
      expect(control.unitOverlayMinWidth).toBeGreaterThan(200);
    });
  });

  describe('accessible naming', () => {
    it('names the unit control after the visible label', () => {
      expect(control.unitAriaLabel()).toBe('Pay Rate unit');
    });
  });

  describe('the unit sizes to its content', () => {
    it('leaves the unit inline-block, so it shrink-to-fits its own content', () => {
      const select = element.querySelector('oct-select') as HTMLElement;
      expect(select).not.toBeNull();
      expect(select.classList.contains('inline-block')).toBe(true);
    });

    it('refuses to shrink, so the flexing amount box cannot squeeze it', () => {
      const select = element.querySelector('oct-select') as HTMLElement;
      expect(select.classList.contains('shrink-0')).toBe(true);
    });

    it('shows a full basis code with no ellipsis machinery on it', () => {
      // oct-text truncates BY DEFAULT (truncate = input(true)) and emits overflow-hidden +
      // text-ellipsis. Removing the `truncate` utility class from select.html did nothing,
      // because the ellipsis was never coming from that class.
      host.model.set({ amount: '27475', rateType: 'WD+PH' });
      fixture.detectChanges();
      const text = element.querySelector('oct-select oct-text') as HTMLElement;
      const cls = text?.className ?? '';
      expect(cls).not.toContain('overflow-hidden');
      expect(cls).not.toContain('text-ellipsis');
      expect(cls).toContain('whitespace-nowrap');
    });

    it('leaves the PLACEHOLDER un-ellipsised too, same defect, second instance', () => {
      const text = element.querySelector('oct-select oct-text') as HTMLElement;
      const cls = text?.className ?? '';
      expect(cls).not.toContain('text-ellipsis');
      expect(cls).toContain('whitespace-nowrap');
    });

    it('lets the amount box shrink so the unit is never pushed out of the shell', () => {
      // The shell is overflow-hidden. oct-input's flex-1/min-w-0 live on a grandchild behind
      // display:contents, so without these host classes the host is flex:0 1 auto with
      // min-width:auto — it refuses to shrink below the <input>'s intrinsic width and shoves
      // the unit (chevron and all) past the clipped edge.
      const input = element.querySelector('oct-input') as HTMLElement;
      expect(input.classList.contains('flex-1')).toBe(true);
      expect(input.classList.contains('min-w-0')).toBe(true);
    });
  });
});
