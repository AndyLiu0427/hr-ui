import { Component } from '@angular/core';
import { TabsComponent, type TabItem } from 'ngx-hr-ui';

@Component({
  selector: 'example-tabs-descriptions',
  imports: [TabsComponent],
  host: { class: 'w-full max-w-md' },
  template: `<oct-tabs [tabs]="stages" />`
})
export default class TabsDescriptions {
  readonly stages: TabItem[] = [
    { id: 'draft', label: 'Draft', description: 'Enter overtime, allowances and deductions for November.' },
    { id: 'review', label: 'Review', description: 'Check totals and changes from last month before you approve.' },
    { id: 'approved', label: 'Approved', description: 'Payslips are ready to send, and bank files can be downloaded.' }
  ];
}
