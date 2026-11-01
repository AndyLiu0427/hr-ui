import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'badge',
  title: 'Badge',
  description: 'Labels a record with a status or attribute that the user cannot change, such as Approved or Full-time.',
  imports: ['BadgeComponent'],
  usage: `<oct-badge text="Approved" color="success" />`,
  examples: [
    { name: 'badge-demo' },
    { name: 'badge-colors', title: 'Colors', description: 'Match the colour to the meaning: success for done, warning for waiting, error for a problem, info for in progress.', compact: true },
    { name: 'badge-solid', title: 'Solid', description: 'The default opacity mode tints the badge. Set mode="solid" when a badge must stand out, such as a count.', compact: true },
    { name: 'badge-sizes', title: 'Sizes', compact: true },
    { name: 'badge-icons', title: 'With an icon', compact: true }
  ],
  accessibility: [
    'A badge renders its text in a <span>, so screen readers read the text and nothing else. The colour and the icon are not announced, so the text must say the status on its own.',
    'The dismissible close icon is not a button and cannot be reached with the keyboard. For a value the user can remove, use Chip, whose remove control is a button.'
  ],
  api: ['BadgeComponent']
};
