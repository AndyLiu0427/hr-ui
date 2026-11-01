import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import {
  ButtonComponent,
  ButtonColor,
  ButtonVariant as AppButtonVariant,
  ButtonSize as AppButtonSize,
  ButtonShape
} from 'ngx-hr-ui';
import { CardComponent, CardContentComponent } from 'ngx-hr-ui';
import { CheckboxComponent } from 'ngx-hr-ui';
import { InputComponent } from 'ngx-hr-ui';
import { TextComponent } from 'ngx-hr-ui';

interface ButtonConfig {
  text: string;
  color: ButtonColor;
  variant: AppButtonVariant;
  size: AppButtonSize;
  shape: ButtonShape;
  disabled: boolean;
  loading: boolean;
  fullWidth: boolean;
  icon: string;
  iconPosition: 'left' | 'right';
  ariaLabel: string;
}
@Component({
  selector: 'oct-button-page',
  templateUrl: './button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, TitleCasePipe, UpperCasePipe, TextComponent, InputComponent, CheckboxComponent, CardComponent, CardContentComponent]
})
export class ButtonPageComponent {
  // Interactive playground state
  config = signal<ButtonConfig>({
    text: 'Click me',
    color: 'primary',
    variant: 'solid',
    size: 'md',
    shape: 'round',
    disabled: false,
    loading: false,
    fullWidth: false,
    icon: '',
    iconPosition: 'left',
    ariaLabel: ''
  });

  // Available options for selectors
  buttonColors: ButtonColor[] = ['primary', 'success', 'error', 'warning', 'info', 'neutral'];
  buttonVariants: AppButtonVariant[] = ['solid', 'outline', 'ghost', 'link'];
  buttonSizes: AppButtonSize[] = ['sm', 'md', 'lg'];
  buttonShapes: ButtonShape[] = ['round', 'square'];

  // Interactive playground methods
  updateConfig<K extends keyof ButtonConfig>(key: K, value: ButtonConfig[K]): void {
    this.config.update(config => ({ ...config, [key]: value }));
  }

  applyPreset(preset: string): void {
    switch (preset) {
      case 'default':
        this.config.set({
          text: 'Click me',
          color: 'primary',
          variant: 'solid',
          size: 'md',
          shape: 'round',
          disabled: false,
          loading: false,
          fullWidth: false,
          icon: '',
          iconPosition: 'left',
          ariaLabel: ''
        });
        break;
      case 'withIcon':
        this.config.update(config => ({
          ...config,
          text: 'Save Changes',
          icon: 'Check',
          iconPosition: 'left'
        }));
        break;
      case 'iconOnly':
        this.config.update(config => ({
          ...config,
          text: '',
          icon: 'Plus',
          ariaLabel: 'Add item'
        }));
        break;
      case 'loading':
        this.config.update(config => ({
          ...config,
          loading: true,
          text: 'Processing...'
        }));
        break;
      case 'disabled':
        this.config.update(config => ({
          ...config,
          disabled: true,
          text: 'Disabled'
        }));
        break;
      case 'fullWidth':
        this.config.update(config => ({
          ...config,
          fullWidth: true,
          text: 'Full Width Button'
        }));
        break;
    }
  }

  onPlaygroundClick(event: Event): void {
    console.log('Playground button clicked', event);
  }
}
