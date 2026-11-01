import { Component } from '@angular/core';
import { ThemeControllerComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-theme-controller-list',
  imports: [ThemeControllerComponent],
  template: `
    <!-- The list variant fills a row in a settings or account menu. -->
    <div class="w-64 overflow-hidden rounded-xl border border-primary bg-secondary">
      <p class="border-b border-primary px-4 py-3 text-sm font-medium text-1">Display</p>
      <oct-theme-controller variant="list" />
    </div>
  `
})
export default class ThemeControllerList {}
