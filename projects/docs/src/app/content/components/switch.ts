import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'switch',
  title: 'Switch',
  description: 'Turns a setting on or off, with an effect the user expects at once, such as publishing payslips.',
  imports: ['SwitchComponent'],
  usage: `<oct-switch label="Publish payslips on pay day" [(checked)]="publishPayslips" />`,
  examples: [
    { name: 'switch-demo', compact: true },
    { name: 'switch-colors', title: 'Colors', description: 'color sets the track colour when the switch is on. Primary follows your brand colour.' },
    { name: 'switch-signal-forms', title: 'With signal forms', description: 'Bind [formField] to a boolean field. A required switch must be on, and its error shows on submit or blur.', align: 'start' },
    { name: 'switch-disabled', title: 'Disabled', compact: true }
  ],
  keyboard: [
    { keys: ['Space'], action: 'Turns the focused switch on or off.' },
    { keys: ['Enter'], action: 'Turns the focused switch on or off.' }
  ],
  accessibility: [
    'The switch is a native button with role="switch" and aria-checked. Its label names it, and a click on the label toggles it.',
    'Always set label. Without one, screen readers announce only "Toggle switch".'
  ],
  api: ['SwitchComponent']
};
