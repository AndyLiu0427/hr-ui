import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'career-progression',
  title: 'Career progression',
  description: "Shows an employee's work history as a tree: each contract, the clients served under it, and their assignments.",
  imports: ['CareerProgressionComponent'],
  usage: `<oct-career-progression
  [contracts]="contracts"
  (assignmentClick)="openAssignment($event)"
/>`,
  examples: [
    { name: 'career-progression-demo' },
    { name: 'career-progression-click', title: 'Opening an assignment', description: 'Each assignment is a button. assignmentClick emits the assignment that was clicked.' },
    { name: 'career-progression-build', title: 'From assignment records', description: 'buildCareerContracts groups flat assignment records into contracts. An assignment with restartEmployment: true starts a new contract.' },
    { name: 'career-progression-empty', title: 'Empty state', description: 'With no contracts, the component shows config.emptyIcon and config.emptyMessage.', compact: true }
  ],
  keyboard: [
    { keys: ['Tab'], action: 'Moves focus to the next assignment.' },
    { keys: ['Enter'], action: 'Opens the focused assignment: emits assignmentClick.' },
    { keys: ['Space'], action: 'Same as Enter.' }
  ],
  accessibility: [
    'The tree is built from nested <ul> lists, and the outer list is labelled "Career timeline".',
    'Each assignment is a native <button> named by its department, job title and dates. The green dot on the current contract is colour only and is not announced.'
  ],
  api: ['CareerProgressionComponent']
};
