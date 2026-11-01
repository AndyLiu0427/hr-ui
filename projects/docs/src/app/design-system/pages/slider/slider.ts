import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SliderComponent, PercentageChangeEvent } from 'hr-ui';
import { CodeCopyComponent } from 'hr-ui';
import { TextComponent } from 'hr-ui';
import { ButtonComponent } from 'hr-ui';
import { CardComponent, CardHeaderComponent, CardContentComponent } from 'hr-ui';
import { InputComponent } from 'hr-ui';

interface SliderConfig {
  leftPercent: number;
  rightPercent: number;
  leftLabel: string;
  rightLabel: string;
  leftColor: 'primary' | 'neutral';
  rightColor: 'primary' | 'neutral';
  showLabels: boolean;
  showTicks: boolean;
  step: number;
}

@Component({
  selector: 'oct-slider-page',
  imports: [
    FormsModule,
    SliderComponent,
    CodeCopyComponent,
    TextComponent,
    ButtonComponent,
    CardComponent,
    CardHeaderComponent,
    CardContentComponent,
    InputComponent
  ],
  templateUrl: './slider.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export default class SliderPageComponent {
  // Interactive playground configuration
  config = signal<SliderConfig>({
    leftPercent: 60,
    rightPercent: 40,
    leftLabel: 'Client Holder',
    rightLabel: 'Candidate Holder',
    leftColor: 'primary',
    rightColor: 'neutral',
    showLabels: true,
    showTicks: false,
    step: 1
  });

  // Computed display code
  displayCode = computed(() => this.getDisplayCode());

  // Quick preset configurations
  presets: { label: string; config: SliderConfig }[] = [
    {
      label: 'Default (60/40)',
      config: {
        leftPercent: 60,
        rightPercent: 40,
        leftLabel: 'Client Holder',
        rightLabel: 'Candidate Holder',
        leftColor: 'primary',
        rightColor: 'neutral',
        showLabels: true,
        showTicks: false,
        step: 1
      }
    },
    {
      label: 'Balanced (50/50)',
      config: {
        leftPercent: 50,
        rightPercent: 50,
        leftLabel: 'Client Holder',
        rightLabel: 'Candidate Holder',
        leftColor: 'primary',
        rightColor: 'neutral',
        showLabels: true,
        showTicks: false,
        step: 1
      }
    },
    {
      label: 'Client Heavy (80/20)',
      config: {
        leftPercent: 80,
        rightPercent: 20,
        leftLabel: 'Client Holder',
        rightLabel: 'Candidate Holder',
        leftColor: 'primary',
        rightColor: 'neutral',
        showLabels: true,
        showTicks: false,
        step: 1
      }
    },
    {
      label: 'Neutral Colors',
      config: {
        leftPercent: 60,
        rightPercent: 40,
        leftLabel: 'Left Side',
        rightLabel: 'Right Side',
        leftColor: 'neutral',
        rightColor: 'neutral',
        showLabels: true,
        showTicks: false,
        step: 1
      }
    },
    {
      label: 'No Labels',
      config: {
        leftPercent: 70,
        rightPercent: 30,
        leftLabel: 'Client Holder',
        rightLabel: 'Candidate Holder',
        leftColor: 'primary',
        rightColor: 'neutral',
        showLabels: false,
        showTicks: false,
        step: 1
      }
    }
  ];

  // Apply preset configuration
  applyPreset(preset: SliderConfig): void {
    this.config.set({ ...preset });
  }

  // Handle percentage change from slider
  onPercentageChange(percentages: PercentageChangeEvent): void {
    this.config.update(cfg => ({
      ...cfg,
      leftPercent: percentages.left,
      rightPercent: percentages.right
    }));
  }

  // Handle slider click
  onSliderClick(): void {
    console.log('Slider clicked - navigation logic here');
  }

  // Update left percent (ensures sum stays 100%)
  updateLeftPercent(value: number): void {
    const left = Math.max(0, Math.min(100, value));
    this.config.update(cfg => ({
      ...cfg,
      leftPercent: left,
      rightPercent: 100 - left
    }));
  }

  // Update right percent (ensures sum stays 100%)
  updateRightPercent(value: number): void {
    const right = Math.max(0, Math.min(100, value));
    this.config.update(cfg => ({
      ...cfg,
      leftPercent: 100 - right,
      rightPercent: right
    }));
  }

  // Update left color
  updateLeftColor(color: 'primary' | 'neutral'): void {
    this.config.update(cfg => ({
      ...cfg,
      leftColor: color
    }));
  }

  // Update right color
  updateRightColor(color: 'primary' | 'neutral'): void {
    this.config.update(cfg => ({
      ...cfg,
      rightColor: color
    }));
  }

  // Generate display code for preview
  private getDisplayCode(): string {
    const cfg = this.config();
    return (
      '<oct-slider\n' +
      '  [leftPercent]="' +
      cfg.leftPercent +
      '"\n' +
      '  [rightPercent]="' +
      cfg.rightPercent +
      '"\n' +
      '  [leftLabel]="' +
      "'" +
      cfg.leftLabel +
      "'" +
      '"\n' +
      '  [rightLabel]="' +
      "'" +
      cfg.rightLabel +
      "'" +
      '"\n' +
      '  [leftColor]="' +
      "'" +
      cfg.leftColor +
      "'" +
      '"\n' +
      '  [rightColor]="' +
      "'" +
      cfg.rightColor +
      "'" +
      '"\n' +
      '  [showLabels]="' +
      cfg.showLabels +
      '"\n' +
      '  [showTicks]="' +
      cfg.showTicks +
      '"\n' +
      '  [step]="' +
      cfg.step +
      '"\n' +
      '  (percentageChange)="onPercentageChange($event)"\n' +
      '  (sliderClick)="onSliderClick()"\n' +
      '/>'
    );
  }
}
