import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { UpperCasePipe, TitleCasePipe } from '@angular/common';
import { DividerComponent, DividerOrientation, DividerVariant, DividerColor, DividerTextPosition } from 'hr-ui';
import { ButtonComponent } from 'hr-ui';
import { CardComponent, CardContentComponent } from 'hr-ui';
import { InputComponent } from 'hr-ui';
import { TextComponent } from 'hr-ui';

@Component({
  selector: 'oct-divider-page',
  templateUrl: './divider.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DividerComponent, ButtonComponent, InputComponent, TextComponent, CardComponent, CardContentComponent, TitleCasePipe, UpperCasePipe]
})
export class DividerPageComponent {
  readonly config = signal({
    orientation: 'horizontal' as DividerOrientation,
    variant: 'solid' as DividerVariant,
    color: 'neutral' as DividerColor,
    text: '',
    textPosition: 'center' as DividerTextPosition,
    spacing: 'md' as 'sm' | 'md' | 'lg'
  });

  readonly orientationOptions: DividerOrientation[] = ['horizontal', 'vertical'];
  readonly variantOptions: DividerVariant[] = ['solid', 'dashed', 'dotted'];
  readonly colorOptions: DividerColor[] = ['primary', 'secondary', 'neutral', 'success', 'warning', 'error'];
  readonly textPositionOptions: DividerTextPosition[] = ['start', 'center', 'end'];
  readonly spacingOptions: ('sm' | 'md' | 'lg')[] = ['sm', 'md', 'lg'];

  updateConfig(key: string, value: unknown): void {
    this.config.update(config => ({ ...config, [key]: value }));
  }

  applyPreset(preset: string): void {
    switch (preset) {
      case 'simple':
        this.config.set({
          orientation: 'horizontal',
          variant: 'solid',
          color: 'neutral',
          text: '',
          textPosition: 'center',
          spacing: 'md'
        });
        break;
      case 'withText':
        this.config.set({
          orientation: 'horizontal',
          variant: 'solid',
          color: 'neutral',
          text: 'OR',
          textPosition: 'center',
          spacing: 'md'
        });
        break;
      case 'dashed':
        this.config.set({
          orientation: 'horizontal',
          variant: 'dashed',
          color: 'primary',
          text: '',
          textPosition: 'center',
          spacing: 'md'
        });
        break;
      case 'vertical':
        this.config.set({
          orientation: 'vertical',
          variant: 'solid',
          color: 'neutral',
          text: '',
          textPosition: 'center',
          spacing: 'md'
        });
        break;
    }
  }

  getDisplayCode(): string {
    const config = this.config();
    let code = `<oct-divider`;

    if (config.orientation !== 'horizontal') {
      code += `\n  orientation="${config.orientation}"`;
    }
    if (config.variant !== 'solid') {
      code += `\n  variant="${config.variant}"`;
    }
    if (config.color !== 'neutral') {
      code += `\n  color="${config.color}"`;
    }
    if (config.text) {
      code += `\n  text="${config.text}"`;
      if (config.textPosition !== 'center') {
        code += `\n  textPosition="${config.textPosition}"`;
      }
    }
    if (config.spacing !== 'md') {
      code += `\n  spacing="${config.spacing}"`;
    }

    code += `>\n</oct-divider>`;
    return code;
  }

  get generatedCode(): string {
    return this.getDisplayCode();
  }
}
