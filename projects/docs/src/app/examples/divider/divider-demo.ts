import { Component } from '@angular/core';
import { DividerComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-divider-demo',
  imports: [DividerComponent],
  host: { class: 'w-full max-w-xs' },
  template: `
    <h3 class="text-sm font-medium text-1">Mei Lin Chen</h3>
    <p class="mt-1 text-sm text-3">Senior payroll analyst</p>
    <oct-divider />
    <div class="flex h-5 items-center text-sm text-2">
      <span>Finance</span>
      <oct-divider orientation="vertical" />
      <span>Singapore</span>
      <oct-divider orientation="vertical" />
      <span>Full-time</span>
    </div>
  `
})
export default class DividerDemo {}
