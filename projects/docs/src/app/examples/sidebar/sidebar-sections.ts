import { Component, ElementRef, inject } from '@angular/core';
import { UnifiedSidebarComponent, type SidebarConfig } from 'ngx-hr-ui';

@Component({
  selector: 'example-sidebar-sections',
  imports: [UnifiedSidebarComponent],
  template: `
    <div class="h-80 overflow-hidden rounded-xl border border-primary bg-canvas pt-2">
      <oct-unified-sidebar [config]="config" />
    </div>
  `
})
export default class SidebarSections {
  readonly config: SidebarConfig = {
    sections: [
      {
        id: 'people',
        label: 'People',
        items: [
          { label: 'Employees', route: '/employees', icon: 'Team' },
          { label: 'Leave requests', route: '/leave', icon: 'CalendarDays', badge: '5' }
        ]
      },
      {
        id: 'payroll',
        label: 'Payroll',
        items: [
          { label: 'Pay runs', route: '/pay-runs', icon: 'PayRun' },
          { label: 'Payslips', route: '/payslips', icon: 'Payslip' }
        ]
      }
    ]
  };

  constructor() {
    // Docs only: these routes do not exist on this site, so page links in this preview stay here.
    inject(ElementRef).nativeElement.addEventListener('click', (event: MouseEvent) => {
      if ((event.target as Element).closest('a')) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
  }
}
