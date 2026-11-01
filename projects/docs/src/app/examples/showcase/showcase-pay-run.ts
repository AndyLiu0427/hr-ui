import { Component } from '@angular/core';
import { BadgeComponent, ButtonComponent, NoticeComponent, ProgressBarComponent, TextComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-showcase-pay-run',
  imports: [BadgeComponent, ButtonComponent, NoticeComponent, ProgressBarComponent, TextComponent],
  template: `
    <div class="flex flex-col gap-6">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <oct-text variant="lg" color="1" weight="semibold">November pay run</oct-text>
          <oct-text variant="sm" color="3" class="mt-1">Pays on 28 Nov · 214 employees · SGD</oct-text>
        </div>
        <oct-badge text="Ready to approve" color="warning" />
      </div>

      <dl class="grid grid-cols-3 gap-4 border-y border-primary py-5">
        @for (figure of figures; track figure.label) {
          <div class="min-w-0">
            <dt><oct-text variant="xs" color="3">{{ figure.label }}</oct-text></dt>
            <dd class="mt-1 text-lg font-semibold tabular-nums text-1 sm:text-xl">{{ figure.value }}</dd>
          </div>
        }
      </dl>

      <div class="flex flex-col gap-2">
        <div class="flex justify-between">
          <oct-text variant="sm" color="2" weight="medium">Checks passed</oct-text>
          <oct-text variant="sm" color="3" class="tabular-nums">18 of 20</oct-text>
        </div>
        <oct-progress-bar [progress]="90" label="" [showPercentage]="false" />
      </div>

      <oct-notice variant="warning">2 employees have no bank account. Their pay will be held.</oct-notice>

      <div class="flex justify-end gap-2">
        <oct-button variant="outline" color="neutral">Review</oct-button>
        <oct-button icon="Check">Approve pay run</oct-button>
      </div>
    </div>
  `
})
export default class ShowcasePayRun {
  readonly figures = [
    { label: 'Gross pay', value: '1,284,500' },
    { label: 'Deductions', value: '212,940' },
    { label: 'Net pay', value: '1,071,560' }
  ];
}
