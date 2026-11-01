import { describe, expect, it } from 'vitest';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge';

@Component({
  imports: [BadgeComponent],
  template: `<oct-badge id="input" text="Approved" /><oct-badge id="content">Full-time</oct-badge>`
})
class Host {}

describe('BadgeComponent', () => {
  it('shows its text from the input or from the content between the tags', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('#input')?.textContent?.trim()).toBe('Approved');
    expect(element.querySelector('#content')?.textContent?.trim()).toBe('Full-time');
  });
});
