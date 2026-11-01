import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'slider',
  title: 'Slider',
  description: 'Splits 100% between two parts, such as a salary across two bank accounts or a cost across two cost centres.',
  imports: ['SliderComponent'],
  usage: `<oct-slider
  leftLabel="Main account"
  rightLabel="Savings account"
  [leftPercent]="mainPercent()"
  [rightPercent]="100 - mainPercent()"
  (percentageChange)="mainPercent.set($event.left)"
/>`,
  examples: [
    { name: 'slider-demo' },
    { name: 'slider-ticks', title: 'Ticks', description: 'showTicks adds a scale from 0 to 100 and snaps the split to its ticks. Set step to 10 too, so each arrow key press moves one tick.' },
    { name: 'slider-step', title: 'Step', description: 'step snaps the split to a multiple of its value, here 5%.' },
    { name: 'slider-colors', title: 'Colors', description: 'leftColor and rightColor take primary or neutral. Give primary to the part that matters most.' }
  ],
  keyboard: [
    { keys: ['ArrowRight'], action: 'Moves one step to the right.' },
    { keys: ['ArrowLeft'], action: 'Moves one step to the left.' },
    { keys: ['Shift', 'ArrowRight'], action: 'Moves ten steps to the right.' },
    { keys: ['Shift', 'ArrowLeft'], action: 'Moves ten steps to the left.' },
    { keys: ['Home'], action: 'Gives the left part 0%.' },
    { keys: ['End'], action: 'Gives the left part 100%.' }
  ],
  accessibility: [
    'The track has role="slider" with a value from 0 to 100. The value is the left part, and leftLabel names it.'
  ],
  api: ['SliderComponent']
};
