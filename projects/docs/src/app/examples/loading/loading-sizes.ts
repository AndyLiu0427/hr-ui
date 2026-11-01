import { Component } from '@angular/core';
import { LoadingComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-loading-sizes',
  imports: [LoadingComponent],
  template: `
    <div class="flex flex-wrap items-end justify-center gap-10">
      <oct-loading size="sm" text="Small" />
      <oct-loading size="md" text="Medium" />
      <oct-loading size="lg" text="Large" />
    </div>
  `
})
export default class LoadingSizes {}
