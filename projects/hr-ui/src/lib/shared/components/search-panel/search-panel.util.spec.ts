import { describe, expect, it } from 'vitest';

import type { SearchPanelItem } from './search-panel.model';
import { groupSearchPanelItems } from './search-panel.util';

const item = (id: string, group?: string): SearchPanelItem => ({ id, group });

describe('groupSearchPanelItems', () => {
  it('leads with the group holding the best match, not a fixed order', () => {
    const ranked = [item('tabs', 'Navigation'), item('table', 'Data Display')];

    expect(groupSearchPanelItems(ranked).map(g => g.group)).toEqual(['Navigation', 'Data Display']);
  });

  it('keeps rank order inside a group and reunites items split across the ranking', () => {
    const ranked = [item('select', 'Forms'), item('card', 'Data'), item('radio', 'Forms')];

    expect(groupSearchPanelItems(ranked)).toEqual([
      { group: 'Forms', items: [ranked[0], ranked[2]] },
      { group: 'Data', items: [ranked[1]] }
    ]);
  });

  it('collapses ungrouped items into a single group so a flat list renders without a heading', () => {
    const flat = [item('a'), item('b'), item('c')];

    expect(groupSearchPanelItems(flat)).toEqual([{ group: undefined, items: flat }]);
  });

  it('returns no groups for no items', () => {
    expect(groupSearchPanelItems([])).toEqual([]);
  });
});
