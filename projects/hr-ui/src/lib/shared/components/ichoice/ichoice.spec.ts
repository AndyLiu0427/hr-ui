import { beforeEach, describe, expect, it } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IChoiceComponent } from './ichoice';

const OPTIONS = [
  { value: 'byGovt', label: "By Gov't" },
  { value: 'byEmployer', label: 'By Employer' }
];

describe('IChoiceComponent', () => {
  let fixture: ComponentFixture<IChoiceComponent>;
  let component: IChoiceComponent;
  let host: HTMLElement;

  function setup(inputs: Record<string, unknown> = {}) {
    // Reset here, not only in beforeEach: several tests re-run setup with different inputs,
    // and TestBed refuses to be reconfigured once it has instantiated.
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [IChoiceComponent] });
    fixture = TestBed.createComponent(IChoiceComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', OPTIONS);
    for (const [key, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(key, value);
    }
    fixture.detectChanges();
    host = fixture.nativeElement as HTMLElement;
  }

  const radios = () => Array.from(host.querySelectorAll<HTMLInputElement>('input[type="radio"]'));

  beforeEach(() => {
    setup();
  });

  it('renders one radio per option, labelled with the option text', () => {
    expect(radios()).toHaveLength(2);
    expect(host.textContent).toContain("By Gov't");
    expect(host.textContent).toContain('By Employer');
  });

  it('renders as a radiogroup, not a tablist', () => {
    // role matters: a tablist tells a screen reader that content is about to change.
    expect(host.getAttribute('role')).toBe('radiogroup');
  });

  it('brackets the options like the paper form, and can be told not to', () => {
    expect(host.textContent).toContain('(');
    expect(host.textContent).toContain(')');
    expect(host.textContent).toContain('/');

    setup({ brackets: false });
    expect(host.textContent).not.toContain('(');
    expect(host.textContent).not.toContain(')');
  });

  it('starts with nothing selected, which is a valid state', () => {
    expect(component.value()).toBeUndefined();
    expect(radios().some(radio => radio.checked)).toBe(false);
  });

  it('selects the clicked option and emits it', () => {
    const emitted: (string | undefined)[] = [];
    component.value.subscribe(value => emitted.push(value));

    radios()[1].click();
    fixture.detectChanges();

    expect(component.value()).toBe('byEmployer');
    expect(emitted).toEqual(['byEmployer']);
    expect(radios()[1].checked).toBe(true);
  });

  it('reflects a value set from outside', () => {
    setup({ value: 'byGovt' });
    expect(radios()[0].checked).toBe(true);
    expect(radios()[1].checked).toBe(false);
  });

  it('generates a unique radio name per instance', () => {
    // Two groups sharing a name are ONE group to the browser, so choosing in either would
    // silently clear the other. This is the bug the generated name exists to prevent.
    const first = component.groupName();

    setup();
    expect(component.groupName()).not.toBe(first);
  });

  it('lets the caller pin the radio name', () => {
    setup({ name: 'pinned-group' });
    expect(component.groupName()).toBe('pinned-group');
    expect(radios().every(radio => radio.name === 'pinned-group')).toBe(true);
  });

  it('ignores selection while disabled', () => {
    setup({ disabled: true, value: 'byGovt' });

    component.select('byEmployer');
    fixture.detectChanges();

    expect(component.value()).toBe('byGovt');
    expect(radios().every(radio => radio.disabled)).toBe(true);
  });

  it('carries an aria-label onto the group', () => {
    setup({ ariaLabel: 'Borne by' });
    expect(host.getAttribute('aria-label')).toBe('Borne by');
  });
});
