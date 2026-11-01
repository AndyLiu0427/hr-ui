import type { SidebarItem } from 'ngx-hr-ui';

/**
 * What the sidebar remembers for one user: the groups left open, and the pinned pages in the order
 * they were pinned. Kept in local storage, one key per signed-in admin.
 */
export interface SidebarLayout {
  open: string[];
  pinned: string[];
}

const LAYOUT_VERSION = 1;

interface StoredSidebarLayout {
  v: typeof LAYOUT_VERSION;
  open: string[];
  pinned: string[];
}

export const EMPTY_SIDEBAR_LAYOUT: SidebarLayout = { open: [], pinned: [] };

/**
 * Reads a stored layout. A route the menu no longer has is dropped, so a renamed page leaves no dead
 * pin behind. Anything that is not a layout of this version reads as the empty layout: every group
 * closed, nothing pinned.
 */
export function readSidebarLayout(stored: unknown, groupRoutes: ReadonlySet<string>, pageRoutes: ReadonlySet<string>): SidebarLayout {
  if (!isStoredLayout(stored)) {
    return EMPTY_SIDEBAR_LAYOUT;
  }
  return {
    open: [...new Set(stored.open)].filter(route => groupRoutes.has(route)),
    pinned: [...new Set(stored.pinned)].filter(route => pageRoutes.has(route))
  };
}

export function toStoredSidebarLayout(layout: SidebarLayout): StoredSidebarLayout {
  return { v: LAYOUT_VERSION, open: layout.open, pinned: layout.pinned };
}

/** A new pin goes to the bottom of the list. Pinning a pinned page unpins it. */
export function togglePinnedPage(layout: SidebarLayout, pageRoute: string): SidebarLayout {
  const pinned = layout.pinned.includes(pageRoute) ? layout.pinned.filter(route => route !== pageRoute) : [...layout.pinned, pageRoute];
  return { ...layout, pinned };
}

/**
 * The Pinned rows, in pin order: the pinned pages the menu shows. A page under a group shows the
 * group's icon and name; a report shows its group's icon and the name of the row that opens it.
 */
export function pinnedPages(items: SidebarItem[], pinned: readonly string[]): SidebarItem[] {
  const pages = new Map<string, SidebarItem>();
  for (const item of items) {
    if (item.pinnable) {
      pages.set(item.route, item);
    }
    for (const child of item.children ?? []) {
      if (child.pinnable) {
        pages.set(child.route, { ...child, icon: item.icon, context: item.label });
      }
      for (const report of child.flyoutItems ?? []) {
        pages.set(report.route, { ...report, icon: item.icon, context: child.label });
      }
    }
  }
  return pinned.map(route => pages.get(route)).filter((page): page is SidebarItem => !!page);
}

function isStoredLayout(value: unknown): value is StoredSidebarLayout {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const candidate = value as Partial<StoredSidebarLayout>;
  return candidate.v === LAYOUT_VERSION && isRouteList(candidate.open) && isRouteList(candidate.pinned);
}

function isRouteList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(route => typeof route === 'string');
}
