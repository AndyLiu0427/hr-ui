import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'card',
  title: 'Card',
  description: 'Groups related content and actions, such as an employee profile or a pay run summary, on one surface.',
  imports: ['CardComponent', 'CardHeaderComponent', 'CardContentComponent', 'CardFooterComponent', 'ButtonComponent'],
  usage: `<oct-card>
  <oct-card-header>
    <h3 class="font-semibold text-1">November pay run</h3>
    <p class="text-sm text-3">Pays on 28 Nov</p>
  </oct-card-header>
  <oct-card-content>214 employees, SGD 1,071,560 net pay</oct-card-content>
  <oct-card-footer>
    <oct-button>Review</oct-button>
  </oct-card-footer>
</oct-card>`,
  examples: [
    { name: 'card-demo' },
    {
      name: 'card-status',
      title: 'Status',
      description: 'A success or error ring marks a result, such as a bank file that was accepted or rejected. Say the result in text too.',
      align: 'start'
    },
    {
      name: 'card-padding',
      title: 'Padding',
      description: 'Padding grows with the screen width. Use none when the content has its own padding, such as a table.',
      align: 'start'
    }
  ],
  accessibility: [
    'A card is a plain container with no role. If its title starts a section, use a heading element such as <h3>, so screen reader users can jump to it.',
    'The status ring is colour only. Put the result in the card text as well, as in the Status example.'
  ],
  api: ['CardComponent', 'CardHeaderComponent', 'CardContentComponent', 'CardFooterComponent']
};
