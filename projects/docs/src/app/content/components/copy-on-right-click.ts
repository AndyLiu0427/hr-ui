import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'copy-on-right-click',
  title: 'Copy on right-click',
  description: 'Copies a value, such as an employee code or a bank account number, when the user right-clicks it.',
  imports: ['CopyOnRightClickDirective'],
  usage: `<span [octCopyOnRightClick]="employee.code">{{ employee.code }}</span>`,
  examples: [
    { name: 'copy-on-right-click-demo' },
    {
      name: 'copy-on-right-click-raw',
      title: 'Copy a different value',
      description: 'The value you bind is what gets copied, so a formatted amount can copy as a plain number.'
    }
  ],
  accessibility: [
    'Right-click is the only way to copy, and it replaces the browser menu on that element. Keep the value visible, so keyboard and touch users can still read it.',
    'The "Copied!" message is not announced to screen readers.'
  ],
  api: ['CopyOnRightClickDirective']
};
