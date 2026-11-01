import { Component } from '@angular/core';
import { CareerProgressionComponent, CareerProgressionConfig } from 'ngx-hr-ui';

@Component({
  selector: 'example-career-progression-empty',
  imports: [CareerProgressionComponent],
  host: { class: 'w-full' },
  template: `
    <div class="mx-auto max-w-xl">
      <oct-career-progression [contracts]="[]" [config]="config" />
    </div>
  `
})
export default class CareerProgressionEmpty {
  readonly config: CareerProgressionConfig = { emptyIcon: 'Briefcase', emptyMessage: 'No assignments yet' };
}
