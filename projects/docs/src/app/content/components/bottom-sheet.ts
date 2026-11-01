import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'bottom-sheet',
  title: 'Bottom sheet',
  description: 'A panel that slides up from the bottom of the screen for a short task or a list of choices, mostly on phones.',
  imports: ['BottomSheetComponent'],
  usage: `<oct-bottom-sheet title="October payslip" [isOpen]="open()" (closed)="open.set(false)">
  <p class="p-4">Net pay S$4,250.00</p>
</oct-bottom-sheet>`,
  examples: [
    { name: 'bottom-sheet-demo' },
    {
      name: 'bottom-sheet-footer',
      title: 'With a footer',
      description: 'Put actions in an <ng-template #footer>. The footer stays below the content and clear of the phone\'s home indicator.'
    },
    {
      name: 'bottom-sheet-picker',
      title: 'Pick a value',
      description: 'On a phone a sheet replaces a dropdown. Set the value and close the sheet in the same handler.'
    }
  ],
  keyboard: [
    { keys: ['Esc'], action: 'Closes the sheet and returns focus to the element that opened it.' },
    { keys: ['Tab'], action: 'Moves between the controls in the sheet. Focus cannot leave the sheet while it is open.' }
  ],
  accessibility: [
    'The sheet has role="dialog" and aria-modal="true". Its accessible name is the title. Set ariaLabel when the title is empty.',
    'Clicking the backdrop, pressing Escape, the close button and a downward swipe (longer than 100px, or a quick flick) all emit closed. Set isOpen to false there.'
  ],
  api: ['BottomSheetComponent']
};
