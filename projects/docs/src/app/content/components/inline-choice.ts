import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'inline-choice',
  title: 'Inline choice',
  description: 'Picks one of a few options inside a sentence, for forms that copy a paper document line by line.',
  imports: ['IChoiceComponent', 'IChoiceOption'],
  usage: `Childcare leave is paid
<oct-ichoice
  [options]="payers"
  [(value)]="payer"
  ariaLabel="Who pays childcare leave"
/>`,
  examples: [
    { name: 'inline-choice-demo' },
    {
      name: 'inline-choice-unset',
      title: 'No choice yet',
      description: 'Leave value undefined, and every option stays muted until the user picks one.'
    },
    { name: 'inline-choice-brackets', title: 'Without brackets', description: 'Set brackets to false when the sentence reads better without them.' },
    { name: 'inline-choice-disabled', title: 'Disabled', description: 'A disabled choice still shows the chosen option, for a form that is already submitted.' }
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves focus to the chosen option, or to the first option when nothing is chosen, then out of the group.' },
    { keys: ['→'], action: 'Chooses the next option. ↓ does the same.' },
    { keys: ['←'], action: 'Chooses the previous option. ↑ does the same.' }
  ],
  accessibility: [
    'Each option is a native radio button, hidden under its label, so the group reads as a radio group with its chosen option.',
    'Set ariaLabel to the question the choice answers. The options alone do not say what is being chosen.'
  ],
  api: ['IChoiceComponent']
};
