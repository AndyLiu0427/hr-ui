/** One example on a component page. `name` is the example's file name under src/app/examples. */
export interface ExampleRef {
  name: string;
  title?: string;
  description?: string;
  /** 'start' places wide examples (forms, tables) top-left instead of centred. */
  align?: 'center' | 'start';
  /** A shorter preview area for small examples. */
  compact?: boolean;
}

/** A row of the Keyboard table: keys pressed together, and what they do. */
export interface KeyboardRow {
  keys: string[];
  action: string;
}

/**
 * Everything a component page shows. One file per component under src/app/content/components,
 * named after the slug. The page renders: hero example, Installation, Usage, Examples,
 * Keyboard (if any), Accessibility notes (if any), API Reference.
 */
export interface ComponentDoc {
  slug: string;
  title: string;
  description: string;
  /** Symbols imported from ngx-hr-ui in the Usage snippet. */
  imports: string[];
  /** The smallest useful template, shown under Usage. */
  usage: string;
  /** The first example is the hero preview at the top of the page. */
  examples: ExampleRef[];
  /** Class names to list under API Reference, in this order. */
  api: string[];
  keyboard?: KeyboardRow[];
  /** Short paragraphs about accessibility behaviour worth knowing. */
  accessibility?: string[];
}
