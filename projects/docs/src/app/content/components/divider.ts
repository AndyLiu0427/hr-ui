import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'divider',
  title: 'Divider',
  description: 'Separates groups of content, such as a profile header from its details, or two ways to add employees.',
  imports: ['DividerComponent'],
  usage: `<oct-divider />`,
  examples: [
    { name: 'divider-demo' },
    { name: 'divider-label', title: 'With a label', description: 'Set text to put a short label, such as "or", in the middle of a horizontal line.' },
    { name: 'divider-variants', title: 'Variants' },
    { name: 'divider-colors', title: 'Colors', description: 'Neutral suits most screens. Use a status colour only when the line itself carries that meaning.' }
  ],
  accessibility: [
    'The divider has role="separator" and aria-orientation, so screen readers know it splits content.',
    'A separator does not expose its label text to screen readers. Do not put information only in the label.'
  ],
  api: ['DividerComponent']
};
