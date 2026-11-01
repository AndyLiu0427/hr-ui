import type { ComponentDoc } from '../../docs/types';

export const doc: ComponentDoc = {
  slug: 'kbd',
  title: 'Kbd',
  description: 'Shows a key or a keyboard shortcut, such as ⌘K or Esc, in help text, menus and hints.',
  imports: ['KbdComponent'],
  usage: `<oct-kbd>Esc</oct-kbd>`,
  examples: [
    { name: 'kbd-demo', compact: true },
    { name: 'kbd-variants', title: 'Variants', description: 'Tertiary, the default, gives the key a grey fill. Secondary uses the surface colour, for a quieter key.', compact: true },
    { name: 'kbd-combinations', title: 'Key combinations', description: 'Give each key of a longer combination its own oct-kbd.', compact: true },
    { name: 'kbd-shortcuts', title: 'Shortcut list', compact: true }
  ],
  accessibility: [
    'The key renders in a native <kbd> element, which screen readers read as plain text. Symbols such as ⌘ and ↑ may be read out differently by each screen reader, so name the key in words where the shortcut matters.'
  ],
  api: ['KbdComponent']
};
