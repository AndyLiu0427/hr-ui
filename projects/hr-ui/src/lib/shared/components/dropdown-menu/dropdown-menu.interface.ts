export enum MenuAlign {
  LEFT = 'left',
  RIGHT = 'right'
}

export type MenuAlignment = MenuAlign;

import { AvatarStatus } from '../avatar/avatar';

export interface MenuItem {
  icon?: string;
  label: string;
  header?: boolean;
  shortcut?: string;
  action?: () => void;
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
