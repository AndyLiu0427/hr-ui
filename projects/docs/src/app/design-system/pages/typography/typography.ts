import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { ButtonComponent } from 'hr-ui';
import { CardComponent, CardContentComponent, CardHeaderComponent } from 'hr-ui';
import { InputComponent } from 'hr-ui';
import { TextComponent, type TextColor, type TextVariant, type TextWeight } from 'hr-ui';

interface TypographyExample {
  variant: TextVariant;
  label: string;
  description: string;
}

interface WeightExample {
  weight: TextWeight;
  label: string;
  description: string;
}

interface LinkExample {
  enabled: boolean;
  label: string;
  description: string;
}

interface ColorExample {
  value: TextColor;
  label: string;
}

@Component({
  selector: 'oct-typography',
  templateUrl: './typography.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextComponent, ButtonComponent, InputComponent, CardComponent, CardContentComponent, CardHeaderComponent]
})
export class TypographyPageComponent {
  // Interactive playground state
  readonly selectedColor = signal<TextColor>('1');
  readonly selectedVariant = signal<TextVariant>('lg');
  readonly selectedWeight = signal<TextWeight>('regular');
  readonly selectedLink = signal<boolean>(false);
  readonly customText = signal('The quick brown fox jumps over the lazy dog');
  readonly lastClickedLink = signal<string>('');

  // Computed values for live code generation
  readonly generatedCode = computed(() => {
    const color = this.selectedColor();
    const variant = this.selectedVariant();
    const weight = this.selectedWeight();
    const link = this.selectedLink();
    const text = this.customText();

    // Use vertical format for better readability
    const linkAttr = link ? `\n  [link]="true"` : '';
    const linkEvent = link ? `\n  (linkClick)="onLinkClick()"` : '';

    return `<oct-text
  color="${color}"
  variant="${variant}"
  weight="${weight}"${linkAttr}${linkEvent}
>
  ${text}
</oct-text>`;
  });

  readonly importCode = `import { TextComponent } from 'hr-ui';

// In your component
@Component({
  imports: [TextComponent]
})`;

  readonly typesCode = `// Available types
type TextColor = '1' | '2' | '3' | 'error' | 'warning' | 'disabled';
type TextVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl';
type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

// Component interface
interface TextProps {
  color: TextColor;
  variant: TextVariant;
  weight?: TextWeight;
  link?: boolean;
}

// Component events
interface TextEvents {
  linkClick: () => void;
}`;

  // Configuration data
  readonly colors: ColorExample[] = [
    { value: '1', label: 'Primary' },
    { value: '2', label: 'Secondary' },
    { value: '3', label: 'Tertiary' },
    { value: 'error', label: 'Error' },
    { value: 'warning', label: 'Warning' },
    { value: 'disabled', label: 'Disabled' }
  ];

  readonly variants: TypographyExample[] = [
    { variant: 'xs', label: 'xs', description: '12px - Captions, labels' },
    { variant: 'sm', label: 'sm', description: '14px - Small text' },
    { variant: 'md', label: 'md', description: '16px - Body text (default)' },
    { variant: 'lg', label: 'lg', description: '18px - Large body text' },
    { variant: 'xl', label: 'xl', description: '24px - Subheadings' },
    { variant: '2xl', label: '2xl', description: '30px - Headlines' },
    { variant: '3xl', label: '3xl', description: '36px - Large headlines' },
    { variant: '4xl', label: '4xl', description: '48px - Section headers' },
    { variant: '5xl', label: '5xl', description: '60px - Page titles' },
    { variant: '6xl', label: '6xl', description: '72px - Display text' },
    { variant: '7xl', label: '7xl', description: '96px - Large display' },
    { variant: '8xl', label: '8xl', description: '128px - Display headlines' }
  ];

  readonly weights: WeightExample[] = [
    { weight: 'regular', label: 'Regular', description: 'Normal weight (400)' },
    { weight: 'medium', label: 'Medium', description: 'Medium weight (500)' },
    { weight: 'semibold', label: 'Semibold', description: 'Semibold weight (600)' },
    { weight: 'bold', label: 'Bold', description: 'Bold weight (700)' }
  ];

  readonly linkOptions: LinkExample[] = [
    { enabled: false, label: 'Regular Text', description: 'Standard text without link styling' },
    { enabled: true, label: 'Link Text', description: 'Interactive link with click events' }
  ];

  // Methods for user interactions
  updateColor(color: TextColor): void {
    this.selectedColor.set(color);
  }

  updateVariant(variant: TextVariant): void {
    this.selectedVariant.set(variant);
  }

  updateWeight(weight: TextWeight): void {
    this.selectedWeight.set(weight);
  }

  updateLink(enabled: boolean): void {
    this.selectedLink.set(enabled);
  }

  updateText(text: string): void {
    this.customText.set(text);
  }

  onTextInputChange(value: string | number): void {
    this.customText.set(String(value));
  }

  // Quick preset examples
  applyPreset(preset: 'heading' | 'body' | 'caption' | 'link' | 'error' | 'warning' | 'disabled'): void {
    switch (preset) {
      case 'heading':
        this.selectedColor.set('1');
        this.selectedVariant.set('4xl');
        this.selectedWeight.set('bold');
        this.selectedLink.set(false);
        this.customText.set('Main Heading');
        break;
      case 'body':
        this.selectedColor.set('2');
        this.selectedVariant.set('md');
        this.selectedWeight.set('regular');
        this.selectedLink.set(false);
        this.customText.set('This is body text for your application.');
        break;
      case 'caption':
        this.selectedColor.set('3');
        this.selectedVariant.set('xs');
        this.selectedWeight.set('regular');
        this.selectedLink.set(false);
        this.customText.set('Small caption text');
        break;
      case 'link':
        this.selectedColor.set('1');
        this.selectedVariant.set('md');
        this.selectedWeight.set('medium');
        this.selectedLink.set(true);
        this.customText.set('Click here to learn more');
        break;
      case 'error':
        this.selectedColor.set('error');
        this.selectedVariant.set('sm');
        this.selectedWeight.set('medium');
        this.selectedLink.set(false);
        this.customText.set('This field is required');
        break;
      case 'warning':
        this.selectedColor.set('warning');
        this.selectedVariant.set('sm');
        this.selectedWeight.set('medium');
        this.selectedLink.set(false);
        this.customText.set('Configuration is incomplete');
        break;
      case 'disabled':
        this.selectedColor.set('disabled');
        this.selectedVariant.set('md');
        this.selectedWeight.set('regular');
        this.selectedLink.set(false);
        this.customText.set('Disabled text');
        break;
    }
  }

  // Handle link click in demo - redirect to Angular.dev
  onLinkClick(): void {
    console.log('Demo link clicked! Redirecting to Angular.dev');
    window.open('https://angular.dev/', '_blank');
  }

  // Handle demo link clicks with feedback
  onDemoLinkClick(linkType: string): void {
    console.log(`Demo link clicked: ${linkType}`);
    this.lastClickedLink.set(linkType);

    // Clear the feedback message after 3 seconds
    setTimeout(() => {
      this.lastClickedLink.set('');
    }, 3000);
  }

  // Get display code - usage only
  getDisplayCode(): string {
    return this.generatedCode();
  }
}
