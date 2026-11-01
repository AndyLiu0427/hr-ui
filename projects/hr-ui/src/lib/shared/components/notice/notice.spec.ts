import { describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NoticeComponent } from './notice';

describe('NoticeComponent', () => {
  it('emits actionClick when the action button is clicked', () => {
    const emit = vi.fn();
    const context = { actionClick: { emit } };

    NoticeComponent.prototype.onActionClick.call(context as any);

    expect(emit).toHaveBeenCalledTimes(1);
  });

  it('names the real close button, not the oct-button around it', () => {
    TestBed.configureTestingModule({ providers: [provideNoopAnimations()] });
    const fixture = TestBed.createComponent(NoticeComponent);
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('oct-button button').getAttribute('aria-label')).toBe('Dismiss notice');
    expect(fixture.nativeElement.querySelector('oct-button').hasAttribute('aria-label')).toBe(false);
  });
});
