import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'loading',
  title: 'Loading',
  description: 'A spinner that shows work is in progress, such as fetching payslips, with an optional line of text.',
  imports: ['LoadingComponent'],
  usage: `<oct-loading text="Loading payslips" />`,
  examples: [
    { name: 'loading-demo', compact: true },
    { name: 'loading-sizes', title: 'Sizes', description: 'md is the default. Use sm inside a card and lg for a whole page.', compact: true },
    { name: 'loading-colors', title: 'Colors', description: 'neutral is the default. primary follows your brand colour.', compact: true },
    {
      name: 'loading-content',
      title: 'While content loads',
      description: 'Show the spinner in the place the content will appear, and keep the box the same size so the page does not jump.'
    }
  ],
  accessibility: [
    'oct-loading has no role and no live region, and the spinner has no text alternative. Use the text input to say what is loading.',
    'To have the result read out when loading ends, put the area in an element with role="status", as in the last example.'
  ],
  api: ['LoadingComponent']
};
