import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'ngx-hr-ui';
import { CardComponent, CardContentComponent } from 'ngx-hr-ui';
import { TextComponent } from 'ngx-hr-ui';
import { ThemeControllerComponent } from 'ngx-hr-ui';

interface ThemeExample {
  title: string;
  description: string;
  props: any;
  code: string;
}

@Component({
  selector: 'oct-theme-controller-page',
  templateUrl: './theme-controller.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ButtonComponent, TextComponent, ThemeControllerComponent, CardComponent, CardContentComponent]
})
export class ThemeControllerPageComponent {
  // Component state
  readonly selectedVariant = signal<'button' | 'toggle'>('button');
  readonly selectedSize = signal<'sm' | 'md' | 'lg'>('md');

  // UI state

  // Theme controller variants
  readonly variants = [
    { variant: 'button' as const, label: 'Button', description: 'Button-style theme toggle' },
    { variant: 'toggle' as const, label: 'Toggle', description: 'Switch-style theme toggle' }
  ];

  // Sizes
  readonly sizes = [
    { size: 'sm' as const, label: 'SM', description: 'Small size' },
    { size: 'md' as const, label: 'MD', description: 'Medium size' },
    { size: 'lg' as const, label: 'LG', description: 'Large size' }
  ];

  // Theme controller examples
  readonly themeExamples: ThemeExample[] = [
    {
      title: 'Button Variant',
      description: 'Button-style theme controller with icon',
      props: { variant: 'button', size: 'md', iconOnly: true },
      code: `<oct-theme-controller
  variant="button"
  size="md"
  [iconOnly]="true"
  (themeChanged)="onThemeChange($event)">
</oct-theme-controller>`
    },
    {
      title: 'Button with Label',
      description: 'Button-style with text label',
      props: { variant: 'button', size: 'md', iconOnly: false, showLabel: true },
      code: `<oct-theme-controller
  variant="button"
  size="md"
  [iconOnly]="false"
  [showLabel]="true"
  (themeChanged)="onThemeChange($event)">
</oct-theme-controller>`
    }
  ];

  // Methods for interactive playground
  updateVariant(variant: 'button' | 'toggle'): void {
    this.selectedVariant.set(variant);
  }

  updateSize(size: 'sm' | 'md' | 'lg'): void {
    this.selectedSize.set(size);
  }

  applyPreset(preset: string): void {
    switch (preset) {
      case 'button-icon':
        this.selectedVariant.set('button');
        this.selectedSize.set('md');
        break;
      case 'button-text':
        this.selectedVariant.set('button');
        this.selectedSize.set('md');
        break;
      case 'toggle-labeled':
        this.selectedVariant.set('toggle');
        break;
      case 'toggle-compact':
        this.selectedVariant.set('toggle');
        break;
    }
  }

  onThemeChange(theme: 'light' | 'dark'): void {
    console.log('Theme changed to:', theme);
  }
}
