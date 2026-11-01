import { Component } from '@angular/core';
import { FormulaComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-formula-demo',
  imports: [FormulaComponent],
  host: { class: 'w-full max-w-xs' },
  template: `
    <p class="mb-2 text-sm font-medium text-1">Overtime pay per hour</p>
    <oct-formula numerator="Basic pay × 1.5" denominator="26 working days × 8 hours" />
  `
})
export default class FormulaDemo {}
