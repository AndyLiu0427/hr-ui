import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy } from '@angular/core';

import { ProgressBarComponent } from 'ngx-hr-ui';
import { ButtonComponent } from 'ngx-hr-ui';
import { CardComponent, CardContentComponent } from 'ngx-hr-ui';
import { CheckboxComponent } from 'ngx-hr-ui';
import { InputComponent } from 'ngx-hr-ui';
import { TextComponent } from 'ngx-hr-ui';

@Component({
  selector: 'oct-progress-bar-page',
  templateUrl: './progress-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressBarComponent, ButtonComponent, InputComponent, TextComponent, CardComponent, CardContentComponent, CheckboxComponent]
})
export class ProgressBarPageComponent implements OnInit, OnDestroy {
  readonly config = signal({
    progress: 65,
    label: 'Processing...',
    showPercentage: true
  });

  private simulationInterval?: ReturnType<typeof setInterval>;
  readonly isSimulating = signal(false);

  ngOnInit(): void {
    this.stopSimulation();
  }

  ngOnDestroy(): void {
    this.stopSimulation();
  }

  updateConfig(key: string, value: any): void {
    this.config.update(config => ({ ...config, [key]: value }));
  }

  updateProgress(value: number): void {
    this.updateConfig('progress', Math.max(0, Math.min(100, value)));
  }

  updateLabel(value: string): void {
    this.updateConfig('label', value);
  }

  togglePercentage(): void {
    this.updateConfig('showPercentage', !this.config().showPercentage);
  }

  startSimulation(): void {
    this.stopSimulation();
    this.isSimulating.set(true);
    this.updateProgress(0);

    this.simulationInterval = setInterval(() => {
      const current = this.config().progress;
      if (current >= 100) {
        this.stopSimulation();
      } else {
        this.updateProgress(current + 1);
      }
    }, 50);
  }

  stopSimulation(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = undefined;
    }
    this.isSimulating.set(false);
  }

  resetProgress(): void {
    this.stopSimulation();
    this.updateProgress(0);
  }

  applyPreset(preset: string): void {
    this.stopSimulation();
    switch (preset) {
      case 'empty':
        this.updateProgress(0);
        break;
      case 'quarter':
        this.updateProgress(25);
        break;
      case 'half':
        this.updateProgress(50);
        break;
      case 'three-quarters':
        this.updateProgress(75);
        break;
      case 'complete':
        this.updateProgress(100);
        break;
    }
  }

  getDisplayCode(): string {
    const config = this.config();
    let code = `<oct-progress-bar\n`;
    code += `  [progress]="${config.progress}"\n`;
    code += `  label="${config.label}"\n`;
    if (!config.showPercentage) {
      code += `  [showPercentage]="false"\n`;
    }
    code += `/>`;
    return code;
  }

  readonly progressExamples = [
    {
      title: 'Upload Progress',
      description: 'File upload with percentage display',
      props: { progress: 45, label: 'Uploading file...', showPercentage: true }
    },
    {
      title: 'Download Progress',
      description: 'Download progress without percentage',
      props: { progress: 70, label: 'Downloading...', showPercentage: false }
    },
    {
      title: 'Processing Complete',
      description: 'Completed processing operation',
      props: { progress: 100, label: 'Processing complete', showPercentage: true }
    },
    {
      title: 'Starting Process',
      description: 'Initial state of a process',
      props: { progress: 5, label: 'Initializing...', showPercentage: true }
    }
  ];
}
