import { Component, computed, signal } from '@angular/core';
import { FormulaComponent, InputComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-formula-values',
  imports: [FormulaComponent, InputComponent],
  host: { class: 'w-full max-w-xs' },
  template: `
    <oct-input label="Monthly basic pay" type="number" leftText="SGD" [(value)]="basicPay" [hideHelper]="true" />
    <oct-formula class="mt-4" [numerator]="'SGD ' + pay().toLocaleString('en-SG') + ' × 1.5'" denominator="26 × 8" />
    <p class="mt-3 text-sm text-2">
      Overtime pay: <span class="font-semibold tabular-nums text-1">SGD {{ hourlyRate().toFixed(2) }}</span> per hour
    </p>
  `
})
export default class FormulaValues {
  readonly basicPay = signal('3200');
  readonly pay = computed(() => Number(this.basicPay()) || 0);
  readonly hourlyRate = computed(() => (this.pay() * 1.5) / (26 * 8));
}
