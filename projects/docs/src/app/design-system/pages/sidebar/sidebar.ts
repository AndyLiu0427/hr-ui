import { Component, ChangeDetectionStrategy, computed, signal } from '@angular/core';

import { UnifiedSidebarComponent, type SidebarConfig, type SidebarItem, type SidebarSection } from 'hr-ui';
import { pinnedPages, togglePinnedPage, type SidebarLayout } from '../../../core/layout/sidebar/sidebar-layout.util';
import { ButtonComponent } from 'hr-ui';
import { CardComponent, CardContentComponent } from 'hr-ui';
import { TextComponent } from 'hr-ui';
import { IconComponent } from 'hr-ui';

// Every demo route loads this same page, so a click only moves the current row.
const DEMO_ROUTE = '/sidebar/';

function demoRoute(label: string): string {
  return DEMO_ROUTE + label.toLowerCase().replace(/ /g, '-');
}

@Component({
  selector: 'oct-sidebar-page',
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UnifiedSidebarComponent, ButtonComponent, CardComponent, CardContentComponent, TextComponent, IconComponent]
})
export class SidebarPageComponent {
  readonly collapsed = signal(false);
  /** The app keeps this per user in local storage. The demo keeps it in memory. */
  readonly layout = signal<SidebarLayout>({ open: [], pinned: [demoRoute('Data Entry'), demoRoute('Pay History')] });

  /** Like the app, the rail shows the pin icon and the groups only. */
  readonly demoConfig = computed<SidebarConfig>(() => {
    const pinned = new Set(this.layout().pinned);
    const page = (label: string, icon = ''): SidebarItem => {
      const route = demoRoute(label);
      return { label, route, icon, pinnable: true, pinned: pinned.has(route) };
    };
    const group = (label: string, icon: string, children: SidebarItem[]): SidebarItem => ({ label, route: demoRoute(label), icon, children });
    const items = [
      { ...page('Timesheets', 'Timesheet'), badge: '3' },
      group('Employees', 'Team', [page('Employees'), page('Assignments')]),
      group('Payroll', 'Payslip', [
        page('Data Entry'),
        page('Process'),
        {
          ...page('Reports'),
          flyoutItems: [page('Payment Listing', 'ReceiptText'), page('Pay History', 'FileClock'), page('Export All', 'FileChartColumn')]
        },
        page('Close Payroll')
      ]),
      group('Settings', 'Settings', [page('Pay Items'), page('Pay Groups'), page('Banks')])
    ];
    const pinnedSection: SidebarSection = { id: 'pinned', kind: 'pinned', label: 'Pinned', items: pinnedPages(items, this.layout().pinned) };
    if (this.collapsed()) {
      return { useTranslation: false, sections: [pinnedSection, { id: 'main-menu', label: '', items: items.filter(item => item.children?.length) }] };
    }
    return {
      useTranslation: false,
      sections: [
        { id: 'home', label: '', items: [{ label: 'Home', route: demoRoute('Home'), icon: 'House' }] },
        pinnedSection,
        { id: 'main-menu', label: '', items }
      ]
    };
  });

  readonly features = [
    {
      icon: 'Pin',
      title: 'Pins',
      description:
        'Pin a page or a report to add it to the Pinned block below Home. A page shows its group name in grey, and a report shows Reports. A new pin goes to the bottom. Click the pin again to unpin.'
    },
    {
      icon: 'LocateFixed',
      title: 'Where you are',
      description:
        'Every group starts closed. A closed group still shows the current page row, in a soft teal fill. In the rail, the group icon turns teal.'
    },
    {
      icon: 'PanelRightOpen',
      title: 'Hover flyout',
      description:
        'A row with flyoutItems opens a panel of pages to the right instead of navigating. Its >> turns into a pin on hover. Each page in the panel can have its own pin. Open Payroll, then hover Reports.'
    },
    {
      icon: 'PanelLeftClose',
      title: 'Collapsible rail',
      description:
        'Collapses to a 56px icon rail. On hover, the pin icon at the top lists the pinned pages, and a group icon lists its pages. A click expands the sidebar.'
    },
    {
      icon: 'History',
      title: 'Remembered layout',
      description:
        'The host owns the open groups and the pins, through openGroups and pinToggled. The app saves them per user in local storage. This demo keeps them in memory.'
    },
    {
      icon: 'Keyboard',
      title: 'Accessible',
      description:
        'Groups carry aria-expanded, and pins carry aria-pressed. A screen reader hears each pin and unpin. Esc closes an open panel. Motion follows the reduced-motion setting.'
    }
  ];

  readonly usageCode = `<oct-unified-sidebar
  [collapsed]="collapsed()"
  [config]="config()"
  [openGroups]="layout().open"
  (openGroupsChange)="saveOpenGroups($event)"
  (pinToggled)="togglePin($event)"
  (collapsedToggled)="collapsed.set(!collapsed())" />

// The Pinned block, then the groups. pinnedPages() builds its rows from the pinned routes.
sections: [
  { id: 'pinned', kind: 'pinned', label: 'Pinned', items: pinnedPages(items, layout().pinned) },
  { id: 'main-menu', label: '', items }
]

// A group with a pinnable page, and a Reports row that opens a panel of pinnable reports:
{
  label: 'Payroll', route: '/payroll', icon: 'Payslip',
  children: [
    { label: 'Data Entry', route: '/payroll/data-entry', icon: '', pinnable: true, pinned: true },
    {
      label: 'Reports', route: '/payroll/reports', icon: '', pinnable: true,
      flyoutItems: [{ label: 'Pay History', route: '/payroll/pay-history', icon: 'FileClock', pinnable: true }]
    }
  ]
}`;

  toggleCollapsed(): void {
    this.collapsed.update(c => !c);
  }

  setOpenGroups(open: string[]): void {
    this.layout.update(layout => ({ ...layout, open }));
  }

  togglePin(item: SidebarItem): void {
    this.layout.update(layout => togglePinnedPage(layout, item.route));
  }
}
