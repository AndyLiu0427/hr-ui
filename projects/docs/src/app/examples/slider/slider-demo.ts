import { Component, computed, signal } from '@angular/core';
import { SliderComponent } from 'ngx-hr-ui';

const sgd = (amount: number) => 'SGD ' + amount.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

@Component({
  selector: 'example-slider-demo',
  imports: [SliderComponent],
  host: { class: 'flex w-full max-w-sm flex-col gap-4' },
  template: `
    <oct-slider
      leftLabel="Main account"
      rightLabel="Savings account"
      [leftPercent]="mainPercent()"
      [rightPercent]="100 - mainPercent()"
      (percentageChange)="mainPercent.set($event.left)"
    />
    <p class="text-sm text-2">{{ summary() }}</p>
  `
})
export default class SliderDemo {
  readonly netPay = 6500;
  readonly mainPercent = signal(80);

  readonly summary = computed(() => {
    const toMain = (this.netPay * this.mainPercent()) / 100;
    return `${sgd(toMain)} to the main account, ${sgd(this.netPay - toMain)} to savings.`;
  });
}
