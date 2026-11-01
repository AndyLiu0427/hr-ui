import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'theme-controller',
  title: 'Theme controller',
  description: 'A button that switches the app between light and dark mode, and remembers the choice for the next visit.',
  imports: ['ThemeControllerComponent'],
  usage: `<oct-theme-controller />`,
  examples: [
    { name: 'theme-controller-demo', compact: true },
    { name: 'theme-controller-label', title: 'With a label', description: 'Set iconOnly to false and showLabel to true to show the current mode next to the icon.', compact: true },
    { name: 'theme-controller-toggle', title: 'Toggle', description: 'The toggle variant puts a "Theme" label before the button.', compact: true },
    { name: 'theme-controller-list', title: 'In a menu', description: 'The list variant is a full-width row for a settings panel or an account menu.', compact: true },
    {
      name: 'theme-controller-event',
      title: 'React to a change',
      description: 'themeChanged emits the new mode, for example to save it to the user\'s profile on the server.',
      compact: true
    }
  ],
  accessibility: [
    'The button is named after what it does, such as "Switch to dark mode. Current: Light Mode".',
    'A polite live region announces the switch, such as "Switching to dark mode". With reduced motion, the circular reveal is skipped.'
  ],
  api: ['ThemeControllerComponent']
};
