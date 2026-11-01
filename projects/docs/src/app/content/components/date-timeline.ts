import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'date-timeline',
  title: 'Date timeline',
  description: 'Places a few key dates on a line, to scale, such as when a contract starts, changes and ends.',
  imports: ['DateTimelineComponent'],
  usage: `<oct-date-timeline
  [nodes]="[{ date: '2026-01-05' }, { date: '2026-12-31' }]"
/>`,
  examples: [
    { name: 'date-timeline-demo', compact: true },
    { name: 'date-timeline-years', title: 'Across several years', description: 'Each year is labelled over its own stretch of the line, and gets a tick on 1 January.', compact: true },
    { name: 'date-timeline-close-dates', title: 'Dates close together', description: 'Dates whose labels would overlap move above and below the line.', compact: true },
    { name: 'date-timeline-missing', title: 'Missing dates', description: 'A node without a valid date is left out. When no node has one, nothing renders.', compact: true },
    { name: 'date-timeline-align', title: 'Label alignment', description: 'labelAlign="start" puts the left edge of each date on its dot, so the strip lines up with the text above it.', compact: true }
  ],
  accessibility: [
    'The timeline is positioned text with no list semantics: screen readers read the years, then the dates in the order of nodes. The emphasis is shown by colour only.',
    'Give the timeline a visible label that says what the dates are, and state any date that matters in text as well.'
  ],
  api: ['DateTimelineComponent']
};
