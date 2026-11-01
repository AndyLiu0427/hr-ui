import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'pipes',
  title: 'Pipes',
  description: 'Formats dates and times the same way on every screen, and highlights search matches in text.',
  imports: ['OctDatePipe', 'HighlightPipe'],
  usage: `<p>Pays on {{ payDate | octDate }}</p>
<span [innerHTML]="employee.name | highlight: query()"></span>`,
  examples: [
    { name: 'pipes-demo' },
    {
      name: 'pipes-dates',
      title: 'Dates and times',
      description: 'octDate, octTime and octDateTime take a Date, an ISO string or a timestamp. An empty or invalid value renders nothing.'
    },
    {
      name: 'pipes-formats',
      title: 'Formats and time zones',
      description: 'The first argument is an Angular DatePipe format. Times show in UTC+8 unless the second argument names another offset.'
    }
  ],
  api: ['HighlightPipe', 'OctDatePipe', 'OctTimePipe', 'OctDateTimePipe']
};
