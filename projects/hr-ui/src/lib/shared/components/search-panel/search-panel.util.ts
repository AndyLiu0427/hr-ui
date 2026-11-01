import type { SearchPanelGroup, SearchPanelItem } from './search-panel.model';

/**
 * Group order follows the first item belonging to it, not any fixed order, so a ranked list
 * keeps its ranking through the grouping. A Map iterates in insertion order, which is what
 * makes first-seen order the returned order.
 */
export function groupSearchPanelItems<T extends SearchPanelItem>(items: readonly T[]): SearchPanelGroup<T>[] {
  const byGroup = new Map<string | undefined, SearchPanelGroup<T>>();

  for (const item of items) {
    let group = byGroup.get(item.group);

    if (!group) {
      group = { group: item.group, items: [] };
      byGroup.set(item.group, group);
    }

    group.items.push(item);
  }

  return [...byGroup.values()];
}
