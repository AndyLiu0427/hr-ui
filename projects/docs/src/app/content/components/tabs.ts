import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'tabs',
  title: 'Tabs',
  description: 'Switches between views of one record, such as the profile, payroll and documents of an employee.',
  imports: ['TabsComponent', 'TabItem'],
  usage: `<oct-tabs [tabs]="tabs" [(activeTab)]="activeTab" />

@switch (activeTab()) {
  @case ('profile') { <app-profile /> }
  @case ('payroll') { <app-payroll /> }
}`,
  examples: [
    { name: 'tabs-demo' },
    {
      name: 'tabs-descriptions',
      title: 'With descriptions',
      description: 'A tab with a description shows it under the strip while the tab is active.'
    },
    {
      name: 'tabs-links',
      title: 'As links',
      description: 'A tab with href renders as a link, for tabs that change the URL. A click selects the tab without navigating, so you do the routing in tabChange. Cmd, Ctrl or Shift and click opens the link in a new tab or window.'
    },
    {
      name: 'tabs-locked',
      title: 'Locked',
      description: 'Set interactive to false to stop tab changes, for example while a form on the current tab has unsaved edits.'
    }
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves focus to the active tab, then out of the strip. Link tabs are each in the tab order.' },
    { keys: ['→'], action: 'Selects the next tab. From the last tab, goes to the first.' },
    { keys: ['←'], action: 'Selects the previous tab. From the first tab, goes to the last.' },
    { keys: ['Home'], action: 'Selects the first tab.' },
    { keys: ['End'], action: 'Selects the last tab.' }
  ],
  accessibility: [
    'The strip has role="tablist", and each tab has role="tab" with aria-selected. When the tabs have href, they change the page: the strip is a navigation landmark, and each tab is a link with aria-current="page" on the active one.',
    'The component renders the strip only. Give the panel you render role="tabpanel" and a name, such as aria-label with the tab label, as in the first example.'
  ],
  api: ['TabsComponent']
};
