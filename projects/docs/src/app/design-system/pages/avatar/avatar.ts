import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { AvatarComponent, AvatarSize, AvatarStatus } from 'hr-ui';
import { ButtonComponent } from 'hr-ui';
import { CardComponent, CardContentComponent } from 'hr-ui';
import { CheckboxComponent } from 'hr-ui';
import { InputComponent } from 'hr-ui';
import { TextComponent } from 'hr-ui';

interface AvatarExample {
  size: AvatarSize;
  description: string;
}

interface StatusExample {
  status: AvatarStatus;
  label: string;
  description: string;
}

interface AvatarConfig {
  src: string;
  name: string;
  size: AvatarSize;
  status: AvatarStatus;
  clickable: boolean;
  showTooltip: boolean;
  alt: string;
}

@Component({
  selector: 'oct-avatar-page',
  templateUrl: './avatar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AvatarComponent,
    TitleCasePipe,
    UpperCasePipe,
    ButtonComponent,
    TextComponent,
    InputComponent,
    CheckboxComponent,
    CardComponent,
    CardContentComponent
  ]
})
export class AvatarPageComponent {
  // Demo user data with reliable image sources and fallback examples
  demoUsers = [
    {
      name: 'Alice Johnson',
      src: 'https://ui-avatars.com/api/?name=Alice+Johnson&size=150&background=3B82F6&color=fff&bold=true',
      description: 'UI Avatars service'
    },
    {
      name: 'Bob Smith',
      src: 'https://ui-avatars.com/api/?name=Bob+Smith&size=150&background=10B981&color=fff&bold=true',
      description: 'Generated with green background'
    },
    {
      name: 'Carol Davis',
      src: 'https://ui-avatars.com/api/?name=Carol+Davis&size=150&background=F59E0B&color=fff&bold=true',
      description: 'Generated with orange background'
    },
    {
      name: 'David Wilson',
      src: '',
      description: 'Initials only (no image)'
    },
    {
      name: 'Eve Brown',
      src: 'invalid-url',
      description: 'Error fallback to initials'
    },
    {
      name: 'Frank Miller',
      src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect width="150" height="150" fill="%23EF4444"/%3E%3Ctext x="75" y="90" font-family="Arial" font-size="48" fill="white" text-anchor="middle"%3EFM%3C/text%3E%3C/svg%3E',
      description: 'SVG image example'
    }
  ];

  // Interactive playground state
  config = signal<AvatarConfig>({
    src: 'https://ui-avatars.com/api/?name=John+Doe&size=150&background=3B82F6&color=fff&bold=true',
    name: 'John Doe',
    size: 'lg',
    status: 'online',
    clickable: true,
    showTooltip: true,
    alt: ''
  });

  // Available options for selectors
  avatarSizes: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  avatarStatuses: AvatarStatus[] = ['online', 'offline', 'busy', 'away', 'none'];

  // Avatar sizes
  avatarSizeExamples: AvatarExample[] = [
    { size: 'xs', description: '16px - Compact indicators' },
    { size: 'sm', description: '24px - Compact lists' },
    { size: 'md', description: '32px - Default size' },
    { size: 'lg', description: '40px - Profile cards' },
    { size: 'xl', description: '48px - Sidebar profiles' },
    { size: '2xl', description: '64px - Hero sections' }
  ];

  // Status indicators
  avatarStatusExamples: StatusExample[] = [
    { status: 'online', label: 'Online', description: 'User is currently active' },
    { status: 'offline', label: 'Offline', description: 'User is not available' },
    { status: 'busy', label: 'Busy', description: 'User is busy or in a meeting' },
    { status: 'away', label: 'Away', description: 'User is temporarily away' },
    { status: 'none', label: 'None', description: 'No status indicator' }
  ];

  // Demo state (keeping for compatibility)
  selectedUser = signal(this.demoUsers[0]);
  selectedSize = signal<AvatarSize>('lg');
  selectedStatus = signal<AvatarStatus>('online');
  clickableDemo = signal(true);
  showTooltip = signal(true);

  onAvatarClick(name: string): void {
    console.log(`Avatar clicked: ${name}`);
  }

  selectUser(user: any): void {
    this.selectedUser.set(user);
  }

  updateSize(size: AvatarSize): void {
    this.selectedSize.set(size);
  }

  updateStatus(status: AvatarStatus): void {
    this.selectedStatus.set(status);
  }

  toggleClickable(): void {
    this.clickableDemo.set(!this.clickableDemo());
  }

  toggleTooltip(): void {
    this.showTooltip.set(!this.showTooltip());
  }

  resetCustomization(): void {
    this.selectedUser.set(this.demoUsers[0]);
    this.selectedSize.set('lg');
    this.selectedStatus.set('online');
    this.clickableDemo.set(true);
    this.showTooltip.set(true);
  }

  copyCodeToClipboard(code: string): void {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        console.log('Code copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy code: ', err);
      });
  }

  // Interactive playground methods
  updateConfig<K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]): void {
    this.config.update(config => ({ ...config, [key]: value }));
  }

  applyPreset(preset: string): void {
    switch (preset) {
      case 'default':
        this.config.set({
          src: '',
          name: 'John Doe',
          size: 'lg',
          status: 'none',
          clickable: false,
          showTooltip: false,
          alt: ''
        });
        break;
      case 'withImage':
        this.config.update(config => ({
          ...config,
          src: 'https://ui-avatars.com/api/?name=John+Doe&size=150&background=3B82F6&color=fff&bold=true',
          name: 'John Doe'
        }));
        break;
      case 'initials':
        this.config.update(config => ({
          ...config,
          src: '',
          name: 'Jane Smith'
        }));
        break;
      case 'status':
        this.config.update(config => ({
          ...config,
          status: 'online'
        }));
        break;
      case 'clickable':
        this.config.update(config => ({
          ...config,
          clickable: true,
          showTooltip: true
        }));
        break;
    }
  }

  onPlaygroundClick(event: Event): void {
    console.log('Playground avatar clicked', event);
  }

  // Code generation methods
  getDisplayCode(): string {
    const config = this.config();
    let code = '<oct-avatar';

    // Add non-default props
    if (config.src) code += `\n  src="${config.src}"`;
    if (config.name) code += `\n  name="${config.name}"`;
    if (config.size !== 'md') code += `\n  size="${config.size}"`;
    if (config.status !== 'none') code += `\n  status="${config.status}"`;
    if (config.clickable) code += `\n  [clickable]="true"`;
    if (config.showTooltip) code += `\n  [showTooltip]="true"`;
    if (config.alt) code += `\n  alt="${config.alt}"`;

    code += `\n  (avatarClick)="handleClick($event)">`;
    code += `\n</oct-avatar>`;

    return code;
  }

  generateAvatarCode(): string {
    const user = this.selectedUser();
    const props = [
      user.src ? `[src]="${user.src}"` : '',
      user.name ? `[name]="${user.name}"` : '',
      this.selectedSize() !== 'md' ? `size="${this.selectedSize()}"` : '',
      this.selectedStatus() !== 'none' ? `status="${this.selectedStatus()}"` : '',
      this.clickableDemo() ? '[clickable]="true"' : '',
      this.showTooltip() ? '[showTooltip]="true"' : ''
    ]
      .filter(prop => prop !== '')
      .join('\n  ');

    return `<oct-avatar\n  ${props}>\n</oct-avatar>`;
  }
}
