import { Component, ElementRef, computed, inject, signal } from '@angular/core';
import { ButtonComponent, UnifiedSidebarComponent, type SidebarConfig, type SidebarItem } from 'ngx-hr-ui';

@Component({
  selector: 'example-sidebar-demo',
  imports: [ButtonComponent, UnifiedSidebarComponent],
  host: { class: 'w-full' },
  template: `
    <div class="flex h-[30rem] overflow-hidden rounded-xl border border-primary bg-canvas">
      <oct-unified-sidebar
        [config]="config()"
        [collapsed]="collapsed()"
        [(openGroups)]="openGroups"
        (collapsedToggled)="collapsed.set(!collapsed())"
        (pinToggled)="togglePin($event)"
      />
      <div class="m-2 ml-0 min-w-0 flex-1 rounded-lg border border-primary bg-secondary p-2">
        <oct-button
          variant="ghost"
          color="neutral"
          size="sm"
          shape="square"
          [icon]="collapsed() ? 'PanelLeftOpen' : 'PanelLeftClose'"
          [ariaLabel]="collapsed() ? 'Expand the sidebar' : 'Collapse the sidebar'"
          (buttonClick)="collapsed.set(!collapsed())"
        />
        <p class="mt-2 hidden px-1 text-sm text-3 sm:block">Hover a page to pin it. Collapse the sidebar to see the rail.</p>
      </div>
    </div>
  `
})
export default class SidebarDemo {
  readonly collapsed = signal(false);
  readonly openGroups = signal(['/payroll']);
  readonly pinned = signal(['/payroll/runs']);

  readonly config = computed<SidebarConfig>(() => {
    const page = (label: string, route: string): SidebarItem =>
      ({ label, route, icon: '', pinnable: true, pinned: this.pinned().includes(route) });
    const items: SidebarItem[] = [
      { label: 'Home', route: '/home', icon: 'House' },
      { label: 'Timesheets', route: '/timesheets', icon: 'Timesheet', badge: '3' },
      { label: 'Employees', route: '/employees', icon: 'Team', children: [
        page('Directory', '/employees/directory'),
        page('Contracts', '/employees/contracts')
      ] },
      { label: 'Payroll', route: '/payroll', icon: 'Payslip', children: [
        page('Pay runs', '/payroll/runs'),
        page('Overtime', '/payroll/overtime'),
        page('Bank files', '/payroll/bank-files')
      ] }
    ];
    // The Pinned block lists each pinned page with its group's icon and name.
    const pinnedPages = items.flatMap(group => (group.children ?? [])
      .filter(child => child.pinned)
      .map(child => ({ ...child, icon: group.icon, context: group.label })));
    return {
      sections: [
        { id: 'pinned', kind: 'pinned', label: 'Pinned', items: pinnedPages },
        { id: 'menu', label: '', items }
      ]
    };
  });

  constructor() {
    // Docs only: these routes do not exist on this site, so page links in this preview stay here.
    inject(ElementRef).nativeElement.addEventListener('click', (event: MouseEvent) => {
      if ((event.target as Element).closest('a')) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
  }

  togglePin(page: SidebarItem): void {
    this.pinned.update(routes =>
      routes.includes(page.route) ? routes.filter(route => route !== page.route) : [...routes, page.route]
    );
  }
}
