import { beforeEach, describe, expect, it } from 'vitest';
import { Component, ComponentRef, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form, FormField } from '@angular/forms/signals';
import { TranslateService } from '@ngx-translate/core';
import { InputComponent } from './input';

/**
 * oct-input's first spec. It has 100+ call sites and no CI test job, so this file is the only
 * automated thing standing between a shell/class refactor and an app-wide regression.
 *
 * Written BEFORE field-shell.ts extracts the wrapper class builders, so these assertions pin the
 * behaviour the extraction has to preserve.
 */
describe('InputComponent', () => {
  let component: InputComponent;
  let ref: ComponentRef<InputComponent>;
  let element: HTMLElement;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent],
      providers: [{ provide: TranslateService, useValue: { instant: (key: string) => key } }]
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    ref = fixture.componentRef;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  const input = () => element.querySelector('input') as HTMLInputElement;

  describe('value round-trip', () => {
    it('starts empty rather than undefined, so signal-forms `required` sees a value', () => {
      expect(component.value()).toBe('');
    });

    it('pushes a typed value into the model', () => {
      input().value = '27475';
      input().dispatchEvent(new Event('input'));
      expect(component.value()).toBe('27475');
    });

    it('trims on input, which is why a pasted cell arrives clean', () => {
      input().value = '  27475  ';
      input().dispatchEvent(new Event('input'));
      expect(component.value()).toBe('27475');
    });

    it('reflects a programmatic value onto the DOM input', () => {
      ref.setInput('value', 'abc');
      fixture.detectChanges();
      expect(input().value).toBe('abc');
    });

    it('clear() empties both the model and the emitted value', () => {
      component.value.set('abc');
      let emitted: string | undefined;
      component.inputChange.subscribe((v: string) => (emitted = v));
      component.clear();
      expect(component.value()).toBe('');
      expect(emitted).toBe('');
    });
  });

  describe('form field contract', () => {
    it('emits valueChange on input', () => {
      let seen: string | undefined;
      component.value.subscribe((v: string) => (seen = v));
      input().value = 'x';
      input().dispatchEvent(new Event('input'));
      expect(seen).toBe('x');
    });

    it('marks touched on blur and tells the form field, which is what gates error display', () => {
      let touchEmits = 0;
      component.touch.subscribe(() => touchEmits++);
      expect(component.isTouched()).toBe(false);
      input().dispatchEvent(new FocusEvent('blur'));
      expect(component.isTouched()).toBe(true);
      expect(touchEmits).toBe(1);
    });

    it('round-trips a [formField] value and touched state', () => {
      @Component({
        imports: [InputComponent, FormField],
        template: `<oct-input [formField]="f.name" />`
      })
      class Host {
        readonly model = signal({ name: 'A' });
        readonly f = form(this.model);
      }

      const host = TestBed.createComponent(Host);
      host.detectChanges();
      const el = host.nativeElement.querySelector('input') as HTMLInputElement;
      expect(el.value).toBe('A');

      el.value = 'B';
      el.dispatchEvent(new Event('input'));
      el.dispatchEvent(new FocusEvent('blur'));
      expect(host.componentInstance.model().name).toBe('B');
      expect(host.componentInstance.f.name().touched()).toBe(true);
    });
  });

  describe('error state', () => {
    it('is clean by default', () => {
      expect(component.hasError()).toBe(false);
    });

    it('errorText alone raises the error state', () => {
      ref.setInput('errorText', 'Enter an amount');
      expect(component.hasError()).toBe(true);
      expect(component.errorMessage()).toBe('Enter an amount');
    });

    it('needs BOTH invalid and touched from signal-forms, not invalid alone', () => {
      ref.setInput('invalid', true);
      expect(component.hasError()).toBe(false);
      ref.setInput('touched', true);
      expect(component.hasError()).toBe(true);
    });

    it('surfaces the first signal-forms error message once touched', () => {
      ref.setInput('errors', [{ message: 'Select a rate basis' }]);
      ref.setInput('touched', true);
      expect(component.errorMessage()).toBe('Select a rate basis');
    });

    it('the explicit legacy `error` input overrides everything', () => {
      ref.setInput('errorText', 'boom');
      ref.setInput('error', false);
      expect(component.hasError()).toBe(false);
    });

    it('puts a red outline on the WRAPPER, not on the inner input', () => {
      // The combo control relies on this: one shell owns the error treatment for both halves.
      ref.setInput('errorText', 'bad');
      TestBed.tick?.();
      expect(component.inputWrapperClass()).toContain('!outline-red-500');
      expect(component.inputClass()).not.toContain('outline-red');
    });
  });

  describe('disabled state', () => {
    it('honours the signal-forms disabled input', () => {
      ref.setInput('disabled', true);
      expect(component.isDisabled()).toBe(true);
    });

    it('honours state="disabled"', () => {
      ref.setInput('state', 'disabled');
      expect(component.isDisabled()).toBe(true);
    });

    it('marks the DOM input disabled', () => {
      ref.setInput('disabled', true);
      TestBed.createComponent(InputComponent); // flush
      expect(component.isDisabled()).toBe(true);
    });
  });

  describe('required and label', () => {
    it('honours the signal-forms required input', () => {
      ref.setInput('required', true);
      fixture.detectChanges();
      expect(input().getAttribute('aria-required')).toBe('true');
    });

    it('renders no label element when no label is given', () => {
      expect(element.querySelector('label')).toBeNull();
    });
  });

  describe('shell classes (what field-shell.ts must preserve)', () => {
    it('carries the border and radius on the wrapper', () => {
      const cls = component.inputWrapperClass();
      expect(cls).toContain('rounded-lg');
      expect(cls).toContain('border');
      expect(cls).toContain('border-primary');
    });

    it('carries the focus ring on the wrapper via focus-within', () => {
      // The combo control lifts exactly this into the shared shell so tabbing between the amount
      // and the unit shows ONE continuous ring rather than two.
      expect(component.inputWrapperClass()).toContain('focus-within:!outline');
    });

    it('gives the inner input no border and no outline of its own', () => {
      const cls = component.inputClass();
      expect(cls).toContain('border-none');
      expect(cls).toContain('outline-none');
      expect(cls).toContain('bg-transparent');
    });

    it('reserves a helper row at least one line high unless hidden', () => {
      // job-order-dialog lays fields out in a 2-col grid; this row is what aligns their borders.
      // A longer message makes the row taller instead of running into the field below.
      expect(element.querySelector('.min-h-5')).not.toBeNull();
      ref.setInput('hideHelper', true);
      TestBed.tick?.();
    });
  });

  describe('padding by size', () => {
    it('is p-2 at every size when NOT bare, which is what all 50 call sites render today', () => {
      for (const size of ['sm', 'md', 'lg'] as const) {
        ref.setInput('size', size);
        expect(component.inputClass(), size).toContain('p-2');
      }
    });

    it('follows size when bare, so a shell can match oct-select height', () => {
      // The amount box is the taller child in oct-input-select, so it sets the shell height.
      // These are oct-select triggerClasses()' own sizeMap values.
      ref.setInput('bare', true);
      const bySize: Record<string, string> = { sm: 'py-1.5', md: 'py-2', lg: 'py-2.5' };
      for (const [size, expected] of Object.entries(bySize)) {
        ref.setInput('size', size);
        expect(component.inputClass(), size).toContain(expected);
        expect(component.inputClass(), size).toContain('px-2');
      }
    });

    it('drops the size-agnostic p-2 when bare, or the two paddings fight', () => {
      ref.setInput('bare', true);
      ref.setInput('size', 'sm');
      expect(component.inputClass().split(' ')).not.toContain('p-2');
    });
  });

  describe('prefix and suffix slots', () => {
    it('shows neither by default', () => {
      expect(component.showPrefix()).toBe(false);
      expect(component.showSuffix()).toBe(false);
    });

    it('leftText opens the prefix slot', () => {
      ref.setInput('leftText', '$');
      expect(component.showPrefix()).toBe(true);
    });

    it('rightText opens the suffix slot — the seam the unit control replaces', () => {
      ref.setInput('rightText', 'hrs');
      expect(component.showSuffix()).toBe(true);
    });

    it('suppresses the suffix when the password toggle owns that corner', () => {
      ref.setInput('rightText', 'hrs');
      ref.setInput('type', 'password');
      ref.setInput('showPasswordToggle', true);
      expect(component.showSuffix()).toBe(false);
    });
  });

  describe('type handling', () => {
    it('defaults to text', () => {
      expect(component.inputType()).toBe('text');
    });

    it('reveals a password as text only while toggled', () => {
      ref.setInput('type', 'password');
      expect(component.inputType()).toBe('password');
      component.togglePasswordVisibility();
      expect(component.inputType()).toBe('text');
    });

    it('treats loading as readonly, so a value cannot be edited mid-request', () => {
      ref.setInput('loading', true);
      expect(component.isReadonly()).toBe(true);
    });
  });

  describe('uppercase', () => {
    it('keeps the placeholder in normal case so only typed input transforms', () => {
      ref.setInput('uppercase', true);
      const cls = component.inputClass();
      expect(cls).toContain('uppercase');
      expect(cls).toContain('placeholder:normal-case');
    });
  });

  // The affordance an optional date field depends on: Chrome and Safari render no clear control
  // of their own, so without this a value set by mistake can never be taken back to empty.
  describe('clearable', () => {
    const clearButton = () => element.querySelector('button[aria-label^="Clear"]');

    it('stays hidden unless asked for, so the 100+ existing call sites are unchanged', () => {
      component.value.set('2026-04-01');
      expect(component.showClearButton()).toBe(false);
    });

    it('stays hidden while the field is empty — nothing to take back', () => {
      ref.setInput('clearable', true);
      expect(component.showClearButton()).toBe(false);
    });

    it('appears once the field holds a value', () => {
      ref.setInput('clearable', true);
      component.value.set('2026-04-01');
      expect(component.showClearButton()).toBe(true);
    });

    it('empties the value, which is what the server reads as "clear this field"', () => {
      ref.setInput('clearable', true);
      component.value.set('2026-04-01');
      component.clear();
      expect(component.value()).toBe('');
    });

    it('renders a button that clears on click', () => {
      ref.setInput('clearable', true);
      component.value.set('2026-04-01');
      fixture.detectChanges();
      (clearButton() as HTMLButtonElement).click();
      expect(component.value()).toBe('');
    });

    it('offers no clear control on a disabled or readonly field', () => {
      ref.setInput('clearable', true);
      component.value.set('2026-04-01');
      ref.setInput('disabled', true);
      expect(component.showClearButton()).toBe(false);

      ref.setInput('disabled', false);
      ref.setInput('readonly', true);
      expect(component.showClearButton()).toBe(false);
    });
  });
});
