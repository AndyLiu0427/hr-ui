import { Component, computed, signal } from '@angular/core';
import { TabsComponent, type TabItem } from 'ngx-hr-ui';

@Component({
  selector: 'example-tabs-demo',
  imports: [TabsComponent],
  host: { class: 'w-full max-w-md' },
  template: `
    <oct-tabs [tabs]="tabs" [(activeTab)]="activeTab" />
    <div role="tabpanel" [attr.aria-label]="activeLabel()" class="mt-4 rounded-xl border border-primary p-4">
      <dl class="grid gap-3 text-sm">
        @for (row of panels[activeTab()]; track row.label) {
          <div class="flex justify-between gap-4">
            <dt class="text-3">{{ row.label }}</dt>
            <dd class="text-right text-1">{{ row.value }}</dd>
          </div>
        }
      </dl>
    </div>
  `
})
export default class TabsDemo {
  readonly tabs: TabItem[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'payroll', label: 'Payroll' },
    { id: 'documents', label: 'Documents' }
  ];
  readonly activeTab = signal('profile');
  readonly activeLabel = computed(() => this.tabs.find(tab => tab.id === this.activeTab())?.label);

  readonly panels: Record<string, { label: string; value: string }[]> = {
    profile: [
      { label: 'Name', value: 'Mei Lin Chen' },
      { label: 'Job title', value: 'Senior payroll analyst' },
      { label: 'Department', value: 'Finance' }
    ],
    payroll: [
      { label: 'Monthly basic pay', value: 'SGD 6,800.00' },
      { label: 'Pay group', value: 'Monthly, Singapore' },
      { label: 'Bank account', value: 'DBS •••• 4821' }
    ],
    documents: [
      { label: 'Employment contract', value: 'Signed 1 Mar 2021' },
      { label: 'Payslip, Oct 2026', value: 'Sent 28 Oct 2026' },
      { label: 'IR8A, 2025', value: 'Filed 27 Feb 2026' }
    ]
  };
}
