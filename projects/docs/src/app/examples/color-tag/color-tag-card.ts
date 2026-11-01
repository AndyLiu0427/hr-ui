import { Component } from '@angular/core';
import { ColorTagComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-color-tag-card',
  imports: [ColorTagComponent],
  host: { class: 'w-full' },
  template: `
    <div class="mx-auto max-w-xs">
      <oct-color-tag color="green" variant="cut">
        <div class="rounded-lg border border-primary bg-secondary p-4">
          <p class="text-sm font-semibold text-1">MRG · Marina Retail Group</p>
          <p class="mt-1 text-sm text-3">42 employees · Pays on the 25th</p>
        </div>
      </oct-color-tag>
    </div>
  `
})
export default class ColorTagCard {}
