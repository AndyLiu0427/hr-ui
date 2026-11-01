import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'info-card',
  title: 'Info card',
  description: 'Shows the fields of one record as labels and values, such as the employment details of an employee.',
  imports: ['InfoCardComponent', 'CardConfig'],
  usage: `<oct-info-card [config]="config" [data]="employee" />`,
  examples: [
    { name: 'info-card-demo' },
    {
      name: 'info-card-fields',
      title: 'Formatting values',
      description: 'A field can format its value, read a nested key, fall back to a default, and keep line breaks.'
    },
    {
      name: 'info-card-actions',
      title: 'Actions',
      description: 'Actions sit on the right of the header, or under the title with position: \'title\'. Below 768px wide an action with an icon shows the icon only.'
    },
    {
      name: 'info-card-states',
      title: 'Loading and empty',
      description: 'While loading is true, the card shows a loading message. With no data, it says so.',
      align: 'start'
    }
  ],
  accessibility: [
    'Labels and values are plain text in a grid, so screen readers read each label before its value.',
    'Below 768px wide, an action with an icon shows the icon only. Its label stays the accessible name of the button.'
  ],
  api: ['InfoCardComponent']
};
