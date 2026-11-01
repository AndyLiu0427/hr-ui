import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'input-select',
  title: 'Input select',
  description: 'Lets the user enter an amount and pick its unit in one field, such as a notice period in months or a rate per day.',
  imports: ['InputSelectComponent', 'SelectOption'],
  usage: `<oct-input-select
  label="Notice period"
  [amountField]="contractForm.noticeAmount"
  [unitField]="contractForm.noticeUnit"
  [unitOptions]="units"
/>`,
  examples: [
    { name: 'input-select-demo' },
    { name: 'input-select-signal-forms', title: 'With signal forms', description: 'The amount and the unit are two fields of a signal form, each with its own rules. They share one error row, and the amount’s message comes first.', align: 'start' },
    { name: 'input-select-disabled', title: 'Disabled', description: 'There is no disabled input. Disable the fields in the form schema, and the whole control follows.' },
    { name: 'input-select-sizes', title: 'Sizes' }
  ],
  accessibility: [
    'The label is linked to the amount field. The unit gets its own accessible name, the label followed by "unit", so it is not announced as "Select an option".',
    'The unit is an oct-select, so it takes the same keys as Select.'
  ],
  api: ['InputSelectComponent']
};
