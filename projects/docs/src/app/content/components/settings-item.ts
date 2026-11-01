import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'settings-item',
  title: 'Settings item',
  description: 'A row on a settings screen that opens a setting or runs an action, grouped with related rows in a settings group.',
  imports: ['SettingsGroupComponent', 'SettingsItemComponent'],
  usage: `<oct-settings-group>
  <oct-settings-item
    icon="CalendarClock"
    label="Pay schedule"
    (itemClick)="openPaySchedule()"
  />
</oct-settings-group>`,
  examples: [
    { name: 'settings-item-demo' },
    {
      name: 'settings-item-no-chevron',
      title: 'Without a chevron',
      description: 'The chevron says the row opens another screen. Hide it for rows that run an action in place.'
    },
    {
      name: 'settings-item-destructive',
      title: 'Destructive',
      description: 'Use color="error" for an action that deletes data. Ask the user to confirm before you run it.'
    }
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves to the next row.' },
    { keys: ['Enter'], action: 'Activates the focused row.' },
    { keys: ['Space'], action: 'Also activates the focused row.' }
  ],
  accessibility: [
    'Each row is a native <button>, and its label is its accessible name. The icon and the chevron add nothing to it.',
    'The group has no role or heading of its own. Put a heading above it when a screen has more than one group.'
  ],
  api: ['SettingsItemComponent', 'SettingsGroupComponent']
};
