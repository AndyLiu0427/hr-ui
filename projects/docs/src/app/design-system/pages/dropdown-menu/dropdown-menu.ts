import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

import { DropdownMenuComponent } from 'hr-ui';
import { MenuItem, MenuAlign, MenuSection } from 'hr-ui';
import { ButtonComponent, ButtonColor, ButtonVariant, ButtonSize } from 'hr-ui';
import { CardComponent, CardContentComponent } from 'hr-ui';
import { CheckboxComponent } from 'hr-ui';
import { InputComponent } from 'hr-ui';
import { TextComponent } from 'hr-ui';

interface DropdownMenuConfig {
  triggerText: string;
  alignment: MenuAlign;
  triggerColor: ButtonColor;
  triggerVariant: ButtonVariant;
  triggerSize: ButtonSize;
  menuType: 'simple' | 'account' | 'admin';
  includeAvatar: boolean;
  menuSections: MenuSection[];
}

@Component({
  selector: 'oct-dropdown-menu-page',
  templateUrl: './dropdown-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DropdownMenuComponent, ButtonComponent, TextComponent, InputComponent, CheckboxComponent, CardComponent, CardContentComponent]
})
export class DropdownMenuPageComponent {
  // Constants for template usage
  readonly MenuAlign = MenuAlign;

  // Interactive playground state
  config = signal<DropdownMenuConfig>({
    triggerText: 'Open Menu',
    alignment: MenuAlign.RIGHT,
    triggerColor: 'primary',
    triggerVariant: 'solid',
    triggerSize: 'md',
    menuType: 'account',
    includeAvatar: true,
    menuSections: []
  });

  // Available options for selectors
  buttonColors: ButtonColor[] = ['primary', 'success', 'error', 'warning', 'info', 'neutral'];
  buttonVariants: ButtonVariant[] = ['solid', 'outline', 'ghost'];
  buttonSizes: ButtonSize[] = ['sm', 'md', 'lg'];

  // Playground menu state
  playgroundMenuOpen = signal(false);

  // Demo menu states for examples section
  demoMenuStates = signal({
    leftDemo: false,
    rightDemo: false,
    simpleDemo: false,
    accountDemo: false,
    adminDemo: false,
    avatarDemo: false
  });

  // Last clicked item tracking
  lastDemoAction = signal<MenuItem | null>(null);

  // Predefined menu sections for different types
  simpleMenuSections: MenuSection[] = [
    {
      items: [
        { icon: 'Pencil', label: 'Edit', shortcut: '⌘E' },
        { icon: 'Copy', label: 'Copy', shortcut: '⌘C' },
        { icon: 'Trash2', label: 'Delete', shortcut: '⌘D' }
      ]
    }
  ];

  accountMenuSections: MenuSection[] = [
    {
      items: [
        { icon: 'User', label: 'Profile', shortcut: '⌘P' },
        { icon: 'Settings', label: 'Settings', shortcut: '⌘S' },
        { icon: 'CreditCard', label: 'Billing', shortcut: '⌘B' }
      ]
    },
    {
      items: [{ icon: 'LogOut', label: 'Log out', shortcut: '⌘Q' }]
    }
  ];

  adminMenuSections: MenuSection[] = [
    {
      items: [
        { icon: 'LayoutDashboard', label: 'Dashboard' },
        { icon: 'Users', label: 'Users', hasChevron: true },
        { icon: 'Settings', label: 'System Settings' }
      ]
    },
    {
      items: [
        { icon: 'BarChart', label: 'Analytics' },
        { icon: 'Shield', label: 'Security', shortcut: '⌘S' }
      ]
    },
    {
      items: [{ icon: 'LogOut', label: 'Sign Out' }]
    }
  ];

  avatarMenuSections: MenuSection[] = [
    {
      items: [
        {
          label: 'John Doe',
          avatar: {
            name: 'John Doe',
            src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            alt: 'User avatar',
            status: 'online'
          }
        }
      ]
    },
    {
      items: [
        { icon: 'User', label: 'My Profile', shortcut: '⌘P' },
        { icon: 'Settings', label: 'Account Settings' }
      ]
    },
    {
      items: [{ icon: 'LogOut', label: 'Sign Out', shortcut: '⌘Q' }]
    }
  ];

  constructor() {
    // Initialize config with default menu sections
    this.updateMenuSections();
  }

  // Interactive playground methods
  updateConfig<K extends keyof DropdownMenuConfig>(key: K, value: DropdownMenuConfig[K]): void {
    this.config.update(config => ({ ...config, [key]: value }));
    if (key === 'menuType' || key === 'includeAvatar') {
      this.updateMenuSections();
    }
  }

  updateMenuSections(): void {
    const config = this.config();
    let sections: MenuSection[];

    switch (config.menuType) {
      case 'simple':
        sections = this.simpleMenuSections;
        break;
      case 'admin':
        sections = this.adminMenuSections;
        break;
      case 'account':
      default:
        sections = config.includeAvatar ? this.avatarMenuSections : this.accountMenuSections;
        break;
    }

    this.config.update(c => ({ ...c, menuSections: sections }));
  }

  applyPreset(preset: string): void {
    switch (preset) {
      case 'default':
        this.config.set({
          triggerText: 'Open Menu',
          alignment: MenuAlign.RIGHT,
          triggerColor: 'primary',
          triggerVariant: 'solid',
          triggerSize: 'md',
          menuType: 'account',
          includeAvatar: true,
          menuSections: []
        });
        break;
      case 'leftAlign':
        this.config.update(config => ({
          ...config,
          triggerText: 'Left Menu',
          alignment: MenuAlign.LEFT
        }));
        break;
      case 'rightAlign':
        this.config.update(config => ({
          ...config,
          triggerText: 'Right Menu',
          alignment: MenuAlign.RIGHT
        }));
        break;
      case 'withAvatar':
        this.config.update(config => ({
          ...config,
          triggerText: 'My Profile',
          menuType: 'account',
          includeAvatar: true
        }));
        break;
      case 'simpleMenu':
        this.config.update(config => ({
          ...config,
          triggerText: 'Actions',
          menuType: 'simple',
          includeAvatar: false
        }));
        break;
    }
    this.updateMenuSections();
  }

  // Playground menu methods
  togglePlaygroundMenu(): void {
    this.playgroundMenuOpen.update(current => !current);
  }

  handlePlaygroundMenuClose(): void {
    this.playgroundMenuOpen.set(false);
  }

  handlePlaygroundItemClick(item: MenuItem): void {
    console.log('Playground menu item clicked:', item);
  }

  // Demo menu methods
  toggleDemoMenu(menuKey: string): void {
    this.demoMenuStates.update(states => {
      const newStates = { ...states };
      // Close all other demo menus
      Object.keys(newStates).forEach(key => {
        newStates[key as keyof typeof newStates] = key === menuKey ? !states[key as keyof typeof states] : false;
      });
      return newStates;
    });
  }

  handleDemoMenuClose(menuKey: string): void {
    this.demoMenuStates.update(states => ({ ...states, [menuKey]: false }));
  }

  handleDemoItemClick(item: MenuItem): void {
    this.lastDemoAction.set(item);
    console.log('Demo menu item clicked:', item);
  }

  // Code generation methods
  getDisplayCode(): string {
    const config = this.config();
    let code = `<!-- Trigger Button -->\n<oct-button`;

    if (config.triggerColor !== 'primary') code += `\n  color="${config.triggerColor}"`;
    if (config.triggerVariant !== 'solid') code += `\n  variant="${config.triggerVariant}"`;
    if (config.triggerSize !== 'md') code += `\n  size="${config.triggerSize}"`;

    code += `\n  (buttonClick)="toggleMenu()">`;
    code += `\n  ${config.triggerText}\n</oct-button>`;

    code += `\n\n<!-- Dropdown Menu -->\n@if (menuOpen()) {\n  <oct-dropdown-menu`;
    code += `\n    [isOpen]="true"`;
    if (config.alignment !== MenuAlign.RIGHT) code += `\n    [alignment]="MenuAlign.${config.alignment.toUpperCase()}"`;
    code += `\n    [menuSections]="menuSections"`;
    code += `\n    (onClose)="handleClose()"`;
    code += `\n    (onItemClick)="handleItemClick($event)">`;
    code += `\n  </oct-dropdown-menu>\n}`;

    return code;
  }
}
