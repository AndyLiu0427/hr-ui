import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { UpperCasePipe, TitleCasePipe } from '@angular/common';
import { BadgeComponent, BadgeSize, BadgeMode, BadgeColor } from 'hr-ui';
import { ButtonComponent } from 'hr-ui';
import { CardComponent, CardContentComponent } from 'hr-ui';
import { CheckboxComponent } from 'hr-ui';
import { InputComponent } from 'hr-ui';
import { TextComponent } from 'hr-ui';

@Component({
  selector: 'oct-badge-page',
  templateUrl: './badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BadgeComponent,
    ButtonComponent,
    InputComponent,
    TextComponent,
    CardComponent,
    CardContentComponent,
    CheckboxComponent,
    TitleCasePipe,
    UpperCasePipe
  ]
})
export class BadgePageComponent {
  readonly config = signal({
    text: 'Badge text',
    icon: 'Tag',
    showIcon: true,
    size: 'md' as BadgeSize,
    mode: 'opacity' as BadgeMode,
    color: 'success' as BadgeColor,
    dismissible: false
  });

  // Track dismiss count for demo purposes
  readonly dismissCount = signal(0);

  readonly sizeOptions: BadgeSize[] = ['sm', 'md', 'lg'];
  readonly modeOptions: BadgeMode[] = ['solid', 'opacity'];
  readonly colorOptions: BadgeColor[] = ['neutral', 'success', 'warning', 'error', 'info'];
  readonly iconOptions = ['Tag', 'CircleCheck', 'Info', 'TriangleAlert', 'CircleX', 'Star', 'Bookmark', 'Clock', 'Bell'];

  get selectedText() {
    return signal(this.config().text);
  }
  get selectedIcon() {
    return signal(this.config().icon);
  }
  get selectedSize() {
    return signal(this.config().size);
  }
  get selectedMode() {
    return signal(this.config().mode);
  }
  get selectedColor() {
    return signal(this.config().color);
  }
  get showIcon() {
    return signal(this.config().showIcon);
  }
  get sizes() {
    return this.sizeOptions;
  }
  get modes() {
    return this.modeOptions;
  }
  get colors() {
    return this.colorOptions;
  }

  updateConfig(key: string, value: any): void {
    this.config.update(config => ({ ...config, [key]: value }));
  }

  updateText(value: string) {
    this.updateConfig('text', value);
  }

  updateIcon(value: string) {
    this.updateConfig('icon', value);
  }

  updateSize(value: BadgeSize) {
    this.updateConfig('size', value);
  }

  updateMode(value: BadgeMode) {
    this.updateConfig('mode', value);
  }

  updateColor(value: BadgeColor) {
    this.updateConfig('color', value);
  }

  toggleIcon() {
    this.updateConfig('showIcon', !this.config().showIcon);
  }

  applyPreset(preset: string) {
    switch (preset) {
      case 'success':
        this.config.set({
          text: 'Success',
          icon: 'CircleCheck',
          color: 'success',
          mode: 'solid',
          showIcon: true,
          size: 'md',
          dismissible: false
        });
        break;
      case 'error':
        this.config.set({
          text: 'Error',
          icon: 'CircleX',
          color: 'error',
          mode: 'solid',
          showIcon: true,
          size: 'md',
          dismissible: false
        });
        break;
      case 'warning':
        this.config.set({
          text: 'Warning',
          icon: 'TriangleAlert',
          color: 'warning',
          mode: 'opacity',
          showIcon: true,
          size: 'md',
          dismissible: false
        });
        break;
      case 'info':
        this.config.set({
          text: 'Info',
          icon: 'Info',
          color: 'info',
          mode: 'opacity',
          showIcon: true,
          size: 'md',
          dismissible: false
        });
        break;
      case 'dismissible':
        this.config.set({
          text: 'Dismissible',
          icon: 'X',
          color: 'neutral',
          mode: 'opacity',
          showIcon: false,
          size: 'md',
          dismissible: true
        });
        this.dismissCount.set(0);
        break;
    }
  }

  onDismiss(): void {
    this.dismissCount.update(count => count + 1);
  }

  getDisplayCode(): string {
    const config = this.config();
    let code = `<oct-badge\n`;
    code += `  text="${config.text}"\n`;
    if (config.showIcon) {
      code += `  icon="${config.icon}"\n`;
    }
    code += `  size="${config.size}"\n`;
    code += `  mode="${config.mode}"\n`;
    code += `  color="${config.color}"`;
    if (config.dismissible) {
      code += `\n  [dismissible]="true"\n`;
      code += `  (dismiss)="onDismiss()">\n`;
    } else {
      code += `>\n`;
    }
    code += `</oct-badge>`;
    return code;
  }

  get generatedCode(): string {
    return this.getDisplayCode();
  }

  statusExamples = [
    {
      text: 'Success',
      size: 'md' as const,
      mode: 'solid' as const,
      color: 'success' as const,
      icon: 'CircleCheck',
      description: 'Operation completed successfully'
    },
    {
      text: 'Warning',
      size: 'md' as const,
      mode: 'opacity' as const,
      color: 'warning' as const,
      icon: 'TriangleAlert',
      description: 'Attention required'
    },
    { text: 'Error', size: 'md' as const, mode: 'solid' as const, color: 'error' as const, icon: 'CircleX', description: 'Operation failed' },
    { text: 'Info', size: 'md' as const, mode: 'opacity' as const, color: 'info' as const, icon: 'Info', description: 'Informational message' }
  ];

  realWorldExamples = [
    { text: 'New', size: 'sm' as const, mode: 'solid' as const, color: 'success' as const, icon: 'Sparkles', category: 'Status' },
    { text: 'Beta', size: 'sm' as const, mode: 'opacity' as const, color: 'info' as const, icon: 'FlaskConical', category: 'Status' },
    { text: 'Deprecated', size: 'sm' as const, mode: 'opacity' as const, color: 'warning' as const, icon: 'CircleAlert', category: 'Status' },
    { text: 'Active', size: 'sm' as const, mode: 'solid' as const, color: 'success' as const, icon: 'CircleCheck', category: 'State' },
    { text: 'Inactive', size: 'sm' as const, mode: 'opacity' as const, color: 'neutral' as const, icon: 'CircleX', category: 'State' },
    { text: 'Pending', size: 'sm' as const, mode: 'opacity' as const, color: 'info' as const, icon: 'Clock', category: 'State' }
  ];

  get groupedRealWorldExamples() {
    const grouped: { [key: string]: typeof this.realWorldExamples } = {};
    this.realWorldExamples.forEach(example => {
      if (!grouped[example.category]) {
        grouped[example.category] = [];
      }
      grouped[example.category].push(example);
    });
    return grouped;
  }

  get categoryKeys() {
    return Object.keys(this.groupedRealWorldExamples);
  }

  readonly badgeExamples = [
    {
      title: 'Success Badge',
      description: 'Used to indicate successful operations or positive states',
      props: { text: 'Success', icon: 'CircleCheck', size: 'md', mode: 'solid', color: 'success' }
    },
    {
      title: 'Warning Badge',
      description: 'Alerts users to potential issues or important information',
      props: { text: 'Warning', icon: 'TriangleAlert', size: 'md', mode: 'opacity', color: 'warning' }
    },
    {
      title: 'Error Badge',
      description: 'Indicates errors or failed operations',
      props: { text: 'Error', icon: 'CircleX', size: 'md', mode: 'solid', color: 'error' }
    },
    {
      title: 'Info Badge',
      description: 'Provides additional information or context',
      props: { text: 'Info', icon: 'Info', size: 'md', mode: 'opacity', color: 'info' }
    }
  ];
}
