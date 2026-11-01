export enum MenuAlign {
  LEFT = 'left',
  RIGHT = 'right'
}

/** A MenuAlign value, or the same text, so a template can write alignment="left". */
export type MenuAlignment = 'left' | 'right';

import { AvatarStatus } from '../avatar/avatar';

export interface MenuItem {
  icon?: string;
  label: string;
  header?: boolean;
  shortcut?: string;
  action?: () => void;
  /** Renders the item as a link to this address, so it can be opened in a new tab. */
  href?: string;
  disabled?: boolean;
  hasChevron?: boolean;
  avatar?: {
    src?: string;
    name?: string;
    alt?: string;
    status?: AvatarStatus;
  };
}

export interface MenuSection {
  items: MenuItem[];
}
