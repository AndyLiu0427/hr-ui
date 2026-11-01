/**
 * The only shape the panel understands. Everything a row displays comes from the consumer's
 * row template, so avatars, badges and trailing actions never have to be modelled here.
 */
export interface SearchPanelItem {
  /** Becomes the role="option" id and the @for track key. */
  id: string;
  /** Without one, items render as a single flat list with no heading. */
  group?: string;
}

export interface SearchPanelGroup<T extends SearchPanelItem = SearchPanelItem> {
  group?: string;
  items: T[];
}
