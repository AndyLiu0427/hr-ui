import { describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Calendar } from 'lucide-angular';
import { IconComponent } from './icon';
import { provideHrIcons } from './icon-registry';

function draw(name: string): HTMLElement {
  const fixture = TestBed.createComponent(IconComponent);
  fixture.componentRef.setInput('name', name);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('icon registration', () => {
  it('draws the icons hr-ui components use without any setup', () => {
    expect(draw('ChevronDown').querySelector('svg')).not.toBeNull();
    expect(draw('X').querySelector('svg')).not.toBeNull();
  });

  it('draws nothing for a name nobody registered, and says how to register it', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(draw('Calendar').querySelector('svg')).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('provideHrIcons({ Calendar })'));
    warn.mockRestore();
  });

  it('draws an icon the app registered with provideHrIcons', () => {
    TestBed.configureTestingModule({ providers: [provideHrIcons({ Calendar })] });
    expect(draw('Calendar').querySelector('svg')).not.toBeNull();
  });
});
