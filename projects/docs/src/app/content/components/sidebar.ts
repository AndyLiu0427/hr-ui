import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'sidebar',
  title: 'Sidebar',
  description: 'The main navigation of an app: sections of pages, groups that open in place, pinned pages, and an icon rail.',
  imports: ['UnifiedSidebarComponent', 'SidebarConfig'],
  usage: `<oct-unified-sidebar
  [config]="config"
  [collapsed]="collapsed()"
  (collapsedToggled)="collapsed.set(!collapsed())"
/>`,
  examples: [
    { name: 'sidebar-demo', align: 'start' },
    {
      name: 'sidebar-sections',
      title: 'Sections',
      description: 'The smallest setup: pages under section labels. A badge flags work that is waiting, such as leave requests to approve.',
      align: 'start'
    }
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves through the page links, group buttons and pin buttons. A pin button shows while its row has keyboard focus.' },
    { keys: ['Enter'], action: 'Opens the focused page. On a group or a pin button, does the same as Space.' },
    { keys: ['Space'], action: 'Opens or closes the focused group. On a pin button, pins or unpins its page.' },
    { keys: ['Esc'], action: 'Closes an open panel. If focus was in the panel, it goes back to the item that opened it.' }
  ],
  accessibility: [
    'The pages are links in a <nav>, and the current page has aria-current="page". A group button has aria-expanded and aria-controls.',
    'Pin buttons have aria-pressed and a label such as "Pin Pay runs". Each pin and unpin is announced through a polite live region.',
    'In the rail, each icon has an aria-label with the page or group name.'
  ],
  api: ['UnifiedSidebarComponent']
};
