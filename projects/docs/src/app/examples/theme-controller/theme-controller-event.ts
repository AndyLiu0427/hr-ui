import { Component, signal } from '@angular/core';
import { ThemeControllerComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-theme-controller-event',
  imports: [ThemeControllerComponent],
  template: `
    <div class="flex items-center gap-3">
      <oct-theme-controller (themeChanged)="theme.set($event)" />
      <p class="text-sm text-2">{{ theme() ? 'Switched to ' + theme() + ' mode.' : 'Switch the theme.' }}</p>
    </div>
  `
})
export default class ThemeControllerEvent {
  readonly theme = signal<'light' | 'dark' | null>(null);
}
