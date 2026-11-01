import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'dropdown-menu',
  title: 'Dropdown menu',
  description: 'A list of actions that opens from a button, such as the actions for one employee in a table row.',
  imports: ['ButtonComponent', 'DropdownMenuComponent', 'MenuSection'],
  usage: `<oct-dropdown-menu [isOpen]="open()" [menuSections]="sections" (itemClick)="run($event)" (closed)="open.set(false)">
  <oct-button (buttonClick)="open.set(!open())">Actions</oct-button>
</oct-dropdown-menu>`,
  examples: [
    { name: 'dropdown-menu-demo' },
    {
      name: 'dropdown-menu-sections',
      title: 'Sections and a header',
      description: 'A divider separates the sections. A header item, here with an avatar, is bold, and clicking it does not close the menu.'
    },
    {
      name: 'dropdown-menu-disabled',
      title: 'Disabled items',
      description: 'A disabled item stays in the list, so people can see the action exists, but it cannot be chosen.'
    },
    {
      name: 'dropdown-menu-alignment',
      title: 'Alignment',
      description: 'The menu opens below the trigger, lined up with its right edge by default. Use MenuAlign.LEFT near the left edge of the screen.'
    }
  ],
  keyboard: [{ keys: ['Esc'], action: 'Closes the menu.' }],
  accessibility: [
    'The panel has role="menu" and each item has role="menuitem". Clicking outside the menu or pressing Escape emits closed.',
    'An icon-only trigger needs ariaLabel, such as "Account", so screen readers can name it.'
  ],
  api: ['DropdownMenuComponent']
};
