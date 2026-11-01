import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'formula',
  title: 'Formula',
  description: 'Shows how a payroll amount is worked out, as a fraction, so the reader can check the calculation.',
  imports: ['FormulaComponent'],
  usage: `<oct-formula numerator="Basic pay × 1.5" denominator="26 working days × 8 hours" />`,
  examples: [
    { name: 'formula-demo' },
    {
      name: 'formula-values',
      title: 'With the numbers',
      description: 'Bind numerator and denominator to show the employee\'s own figures next to the result.'
    },
    { name: 'formula-line-breaks', title: 'Line breaks', description: 'Line breaks in the text are kept, so a long term can go on two lines.' }
  ],
  accessibility: [
    'The fraction is plain text with no maths markup. Screen readers read the top line, then the bottom line, and do not say "divided by".',
    'Put a label next to it that says what it works out, as in the examples.'
  ],
  api: ['FormulaComponent']
};
