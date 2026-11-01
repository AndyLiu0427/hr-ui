import { Component } from '@angular/core';
import { LoadingComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-loading-colors',
  imports: [LoadingComponent],
  template: `
    <div class="flex flex-wrap items-end justify-center gap-10">
      <oct-loading color="neutral" text="Neutral" />
      <oct-loading color="primary" text="Primary" />
    </div>
  `
})
export default class LoadingColors {}
