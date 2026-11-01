import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'notice',
  title: 'Notice',
  description: 'An inline message that calls out something important on a page, such as a payroll cut-off or a missing bank account.',
  imports: ['NoticeComponent'],
  usage: `<oct-notice variant="warning">The October pay run locks on 25 October.</oct-notice>`,
  examples: [
    { name: 'notice-demo', compact: true },
    {
      name: 'notice-variants',
      title: 'Variants',
      description: 'info for news, success for a check that passed, warning for something to fix soon, and error for something that blocks the work.'
    },
    {
      name: 'notice-dismissible',
      title: 'Dismissible',
      description: 'The notice hides itself and emits dismiss. Store the choice yourself if it should stay hidden next time.',
      compact: true
    },
    {
      name: 'notice-action',
      title: 'With an action',
      description: 'showAction adds a link-style button in the colour of the notice. Set actionLoading while the action runs.',
      compact: true
    },
    {
      name: 'notice-icon',
      title: 'Icon',
      description: 'Each variant has its own icon. Pass any Lucide icon name to icon, or set showDefaultIcon to false for none.',
      compact: true
    }
  ],
  accessibility: [
    'A notice is a live region, so screen readers read it when it appears. An error notice has role="alert" and interrupts.',
    'The icon is decorative. Put everything people need to know in the text.'
  ],
  api: ['NoticeComponent']
};
