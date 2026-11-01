import { Component } from '@angular/core';
import { FormulaComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-formula-line-breaks',
  imports: [FormulaComponent],
  host: { class: 'w-full max-w-xs' },
  template: `
    <p class="mb-2 text-sm font-medium text-1">Salary for a partial month</p>
    <oct-formula [numerator]="numerator" denominator="Working days in the month" />
  `
})
export default class FormulaLineBreaks {
  // Each term on its own line.
  readonly numerator = '(Basic pay + Fixed allowances)\n× Days worked';
}
