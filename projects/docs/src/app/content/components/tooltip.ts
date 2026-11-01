import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'tooltip',
  title: 'Tooltip',
  description: 'A short label that appears on hover and on keyboard focus, to name an icon button or explain a value without taking space on the page.',
  imports: ['ButtonComponent', 'TooltipDirective'],
  usage: `<oct-button icon="Download" ariaLabel="Download payslip" octTooltip="Download payslip" />`,
  examples: [
    { name: 'tooltip-demo', compact: true },
    { name: 'tooltip-positions', title: 'Positions', description: 'top is the default. A tooltip near the edge of the screen moves back inside it.', compact: true },
    {
      name: 'tooltip-colors',
      title: 'Colors',
      description: 'primary is the default. Use the other colours sparingly, for a tooltip that carries that meaning.',
      compact: true
    },
    {
      name: 'tooltip-rich',
      title: 'Rich content',
      description: 'Pass an <ng-template> to octTooltipContent for more than one line of text. Touch screens never show it, so do not put anything essential in it.',
      compact: true
    },
    {
      name: 'tooltip-delay',
      title: 'Delay',
      description: 'A tooltip waits 200 ms by default, so it does not flash while the pointer crosses the page.',
      compact: true
    }
  ],
  accessibility: [
    'The tooltip has role="tooltip". While it is shown, the control that takes focus, such as the <button> inside oct-button, has aria-describedby pointing at it.',
    'It also shows while the host or a control inside it has keyboard focus. Escape closes it.',
    'A tooltip is not a name. An icon-only button still needs ariaLabel, as in the examples above.'
  ],
  api: ['TooltipDirective']
};
