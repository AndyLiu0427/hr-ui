import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'button',
  title: 'Button',
  description: 'Starts an action, such as saving a form or approving a pay run. With href it becomes a link.',
  imports: ['ButtonComponent'],
  usage: `<oct-button (buttonClick)="save()">Save</oct-button>`,
  examples: [
    { name: 'button-demo' },
    { name: 'button-variants', title: 'Variants', description: 'Solid for the main action on a screen, outline and ghost for the rest, link for actions inside text.' },
    { name: 'button-colors', title: 'Colors', description: 'Primary follows your brand color. Use success, warning and error for actions with that meaning, and neutral for everything quiet.' },
    { name: 'button-sizes', title: 'Sizes' },
    { name: 'button-shapes', title: 'Shapes' },
    { name: 'button-icons', title: 'With an icon', description: 'An icon-only button needs ariaLabel, so screen readers can name it.' },
    { name: 'button-states', title: 'Loading and disabled', description: 'A loading button shows a spinner and ignores clicks until the work finishes.' },
    { name: 'button-link', title: 'As a link', description: 'Set href to render an <a>. It keeps the button look and can be opened in a new tab or copied.' }
  ],
  keyboard: [
    { keys: ['Enter'], action: 'Activates the button.' },
    { keys: ['Space'], action: 'Activates the button.' }
  ],
  accessibility: [
    'The button renders a native <button>, or an <a> when href is set, so it works with every assistive technology without extra roles.',
    'A disabled or loading link falls back to a <button>, because only a button can be truly disabled.'
  ],
  api: ['ButtonComponent']
};
