import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'code-copy',
  title: 'Code copy',
  description: 'A Copy button for code or a value that people paste somewhere else, such as an API request or a bank file reference.',
  imports: ['CodeCopyComponent'],
  usage: `<div class="relative">
  <pre>{{ request }}</pre>
  <oct-code-copy [code]="request" />
</div>`,
  examples: [
    { name: 'code-copy-demo', compact: true },
    {
      name: 'code-copy-value',
      title: 'A single value',
      description: 'The button sits in the top-right corner of its nearest positioned parent. Give that box relative, and padding on the right so text does not run under the button.',
      compact: true
    }
  ],
  accessibility: [
    'The button is a native <button> labelled "Copy". After a successful copy the label reads "Copied" for 2 seconds. Both words come from the i18n files.'
  ],
  api: ['CodeCopyComponent']
};
