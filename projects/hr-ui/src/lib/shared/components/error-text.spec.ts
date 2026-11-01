import { describe, expect, it } from 'vitest';
import { provideZonelessChangeDetection, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { CheckboxComponent } from './checkbox/checkbox';
import { InputComponent } from './input/input';
import { SearchSelectComponent } from './search-select/search-select';
import { SelectComponent } from './select/select';
import { SwitchComponent } from './switch/switch';
import { TextareaComponent } from './textarea/textarea';

// Every form control follows one rule: errorText alone shows the error state, and error overrides it.
const controls: [string, Type<{ hasError: () => boolean }>][] = [
  ['input', InputComponent],
  ['select', SelectComponent],
  ['search select', SearchSelectComponent],
  ['textarea', TextareaComponent],
  ['checkbox', CheckboxComponent],
  ['switch', SwitchComponent]
];

describe('errorText on form controls', () => {
  it.each(controls)('%s shows the error state when only errorText is set', (_name, component) => {
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection(), provideTranslateService()] });
    const fixture = TestBed.createComponent(component);
    expect(fixture.componentInstance.hasError()).toBe(false);
    fixture.componentRef.setInput('errorText', 'Enter a value.');
    expect(fixture.componentInstance.hasError()).toBe(true);
    fixture.componentRef.setInput('error', false);
    expect(fixture.componentInstance.hasError()).toBe(false);
  });
});
