import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { HR_ICON_OVERRIDES } from 'ngx-hr-ui';
import { icons } from 'lucide-angular';
import { ButtonComponent } from 'ngx-hr-ui';
import { CardComponent, CardContentComponent } from 'ngx-hr-ui';
import { IconComponent, IconSize, IconColor } from 'ngx-hr-ui';
import { InputComponent } from 'ngx-hr-ui';
import { SelectComponent } from 'ngx-hr-ui';
import { TextComponent } from 'ngx-hr-ui';

interface IconConfig {
  name: keyof typeof icons;
  size: IconSize | number;
  strokeWidth: number;
  color: IconColor | undefined;
  className: string;
}

/**
 * The hr-icons marks oct-icon knows, read from the component's own table so
 * this page cannot drift from what oct-icon actually does.
 */
const HR_MARKS = Object.keys(HR_ICON_OVERRIDES) as (keyof typeof HR_ICON_OVERRIDES)[];

@Component({
  selector: 'oct-icon-page',
  templateUrl: './icon.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextComponent, InputComponent, ButtonComponent, SelectComponent, IconComponent, CardComponent, CardContentComponent]
})
export class IconPageComponent {
  // Interactive playground state
  config = signal<IconConfig>({
    name: 'House',
    size: 'md',
    strokeWidth: 2,
    color: undefined,
    className: ''
  });

  // Popular icon categories
  iconCategories = [
    {
      category: 'Navigation',
      icons: ['House', 'Menu', 'Settings', 'Search', 'ArrowLeft', 'ArrowRight', 'ChevronDown', 'ChevronUp'] as (keyof typeof icons)[]
    },
    {
      category: 'Actions',
      icons: ['Plus', 'Minus', 'Pencil', 'Trash', 'Copy', 'Download', 'Upload', 'Save'] as (keyof typeof icons)[]
    },
    {
      category: 'Status',
      icons: ['Check', 'X', 'CircleAlert', 'TriangleAlert', 'Info', 'CircleQuestionMark', 'Loader', 'CircleCheck'] as (keyof typeof icons)[]
    },
    {
      category: 'Content',
      icons: ['File', 'Folder', 'Image', 'Video', 'Music', 'Calendar', 'Clock', 'Mail'] as (keyof typeof icons)[]
    },
    {
      category: 'Social',
      icons: ['Heart', 'Star', 'Bookmark', 'Share', 'MessageCircle', 'User', 'Users', 'Bell'] as (keyof typeof icons)[]
    }
  ];

  // Size presets
  sizePresets = [
    { size: 'xs' as const, pixels: 12, label: 'XS (12px)' },
    { size: 'sm' as const, pixels: 14, label: 'SM (14px)' },
    { size: 'md' as const, pixels: 16, label: 'MD (16px)' },
    { size: 'lg' as const, pixels: 20, label: 'LG (20px)' },
    { size: 'xl' as const, pixels: 24, label: 'XL (24px)' }
  ];

  // Stroke width options
  strokeWidthOptions = [
    { value: 1, label: 'Thin (1)' },
    { value: 1.5, label: 'Light (1.5)' },
    { value: 2, label: 'Regular (2)' },
    { value: 2.5, label: 'Medium (2.5)' },
    { value: 3, label: 'Bold (3)' }
  ];

  // Color presets with button color mapping
  colorPresets = [
    { color: undefined, label: 'Inherit (currentColor)', buttonColor: 'neutral' as const },
    { color: 'primary' as IconColor, label: 'Primary', buttonColor: 'primary' as const },
    { color: 'error' as IconColor, label: 'Error', buttonColor: 'error' as const },
    { color: 'disabled' as IconColor, label: 'Disabled', buttonColor: 'neutral' as const },
    { color: 'neutral' as IconColor, label: 'Neutral', buttonColor: 'neutral' as const }
  ];

  // Example use cases
  exampleUseCases = [
    {
      title: 'Button with Icon',
      description: 'Icons enhance button clarity and recognition',
      code: '<oct-button>\n  <oct-icon name="Plus" size="sm" class="mr-2" />\n  Add Item\n</oct-button>'
    },
    {
      title: 'Status Indicator',
      description: 'Use colored icons to show status',
      code: '<oct-icon name="CircleCheck" color="primary" size="lg" />\n<oct-icon name="CircleX" color="error" size="lg" />'
    },
    {
      title: 'Navigation Menu',
      description: 'Icons help users navigate quickly',
      code: '<oct-icon name="House" color="primary" size="md" />\n<oct-icon name="Settings" color="text-2" size="md" />'
    }
  ];

  // Computed options for selects
  /** Marks drawn by hr-icons rather than lucide. */
  hrMarks = HR_MARKS;

  sizeOptions = computed(() => this.sizePresets.map(s => ({ label: s.label, value: s.size })));

  strokeOptions = computed(() => this.strokeWidthOptions.map(s => ({ label: s.label, value: s.value.toString() })));

  colorOptions = computed(() => this.colorPresets.map(c => ({ label: c.label, value: c.color ?? '' })));

  // Update config methods
  updateConfig<K extends keyof IconConfig>(key: K, value: IconConfig[K]): void {
    this.config.update(config => ({ ...config, [key]: value }));
  }

  // Update size with proper type handling
  updateSize(value: string): void {
    const numValue = Number(value);
    const size = isNaN(numValue) ? (value as IconSize) : numValue;
    this.updateConfig('size', size);
  }

  // Apply preset
  applyPreset(preset: string): void {
    switch (preset) {
      case 'default':
        this.config.set({
          name: 'House',
          size: 'md',
          strokeWidth: 2,
          color: undefined,
          className: ''
        });
        break;
      case 'small':
        this.config.update(c => ({ ...c, size: 'xs', strokeWidth: 1.5 }));
        break;
      case 'large':
        this.config.update(c => ({ ...c, size: 'xl', strokeWidth: 2.5 }));
        break;
      case 'colored':
        this.config.update(c => ({ ...c, color: 'primary', className: '' }));
        break;
      case 'animated':
        this.config.update(c => ({
          ...c,
          name: 'Loader',
          className: 'animate-spin'
        }));
        break;
    }
  }

  // Get code snippet for current config
  getCodeSnippet(): string {
    const config = this.config();
    const props = [`name="${config.name}"`];

    if (config.size !== 'md') {
      props.push(typeof config.size === 'string' ? `size="${config.size}"` : `[size]="${config.size}"`);
    }
    // oct-icon derives its stroke from the size when none is given, so any
    // width the playground is showing has to appear in the snippet — omitting
    // one would generate markup that renders differently from the preview.
    props.push(`[strokeWidth]="${config.strokeWidth}"`);
    if (config.color) props.push(`color="${config.color}"`);
    if (config.className) props.push(`class="${config.className}"`);

    return `<oct-icon ${props.join(' ')} />`;
  }

  // Open Lucide Icons website in new tab
  openLucideIcons(): void {
    window.open('https://lucide.dev/icons/', '_blank', 'noopener,noreferrer');
  }
}
