import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'color-tag',
  title: 'Color tag',
  description: 'Marks a record with a colour so people can pick out a group at a glance, such as every row for one client.',
  imports: ['ColorTagComponent'],
  usage: `<oct-color-tag color="blue" label="HBL · Harbourline Freight" />`,
  examples: [
    { name: 'color-tag-demo' },
    { name: 'color-tag-colors', title: 'Colors', description: 'Six colours. Set color to null to draw no mark; with a label the text keeps its place, so a column of codes still lines up.' },
    { name: 'color-tag-card', title: 'On a card', description: 'variant="cut" wraps a card and cuts the colour into its top-left corner.' },
    { name: 'color-tag-table', title: 'In a table', description: 'variant="corner" pins the mark to the top-left corner of the table cell it sits in, so the whole row reads as marked.', align: 'start' }
  ],
  accessibility: [
    'The colour mark is aria-hidden, so it never carries meaning on its own. Pass label, or write the name beside the tag, so every reader gets the same information.'
  ],
  api: ['ColorTagComponent']
};
