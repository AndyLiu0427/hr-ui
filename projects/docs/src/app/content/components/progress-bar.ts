import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'progress-bar',
  title: 'Progress bar',
  description: 'Shows how far a task has got, such as a timesheet import or payslip generation.',
  imports: ['ProgressBarComponent'],
  usage: `<oct-progress-bar [progress]="64" label="Importing timesheets" />`,
  examples: [
    { name: 'progress-bar-demo', compact: true },
    { name: 'progress-bar-live', title: 'Updating progress', description: 'Bind progress to a signal. The bar animates to each new value.', compact: true },
    { name: 'progress-bar-no-percentage', title: 'Without the percentage', description: 'Hide the percentage when the label already says how far along the task is.', compact: true }
  ],
  accessibility: [
    'The bar has role="progressbar" with aria-valuenow from 0 to 100. Its name is label, or "Progress" when there is no label, so give each bar on a page its own label.',
    'A change in progress is not announced. If people must know when a long task finishes, announce it, for example with a snackbar.'
  ],
  api: ['ProgressBarComponent']
};
