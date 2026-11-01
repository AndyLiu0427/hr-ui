import { Component, signal } from '@angular/core';
import { TabsComponent, type TabItem } from 'ngx-hr-ui';

@Component({
  selector: 'example-tabs-links',
  imports: [TabsComponent],
  host: { class: 'w-full max-w-md' },
  template: `
    <!-- A click selects the tab without navigating. Route in (tabChange), for example with router.navigateByUrl. -->
    <oct-tabs [tabs]="tabs" [(activeTab)]="activeTab" />
  `
})
export default class TabsLinks {
  readonly tabs: TabItem[] = [
    { id: 'profile', label: 'Profile', href: '/employees/1042/profile' },
    { id: 'payroll', label: 'Payroll', href: '/employees/1042/payroll' },
    { id: 'documents', label: 'Documents', href: '/employees/1042/documents' }
  ];
  readonly activeTab = signal('profile');
}
