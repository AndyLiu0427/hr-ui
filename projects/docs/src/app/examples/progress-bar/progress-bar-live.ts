import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { ButtonComponent, ProgressBarComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-progress-bar-live',
  imports: [ButtonComponent, ProgressBarComponent],
  host: { class: 'w-full' },
  template: `
    <div class="mx-auto flex max-w-md flex-col items-start gap-4">
      <oct-progress-bar class="w-full" [progress]="progress()" [label]="label()" />
      <oct-button variant="outline" color="neutral" [loading]="running()" (buttonClick)="start()">Generate payslips</oct-button>
    </div>
  `
})
export default class ProgressBarLive {
  readonly progress = signal(0);
  readonly running = signal(false);
  readonly label = computed(() => (this.progress() === 100 ? 'Payslips ready' : this.running() ? 'Generating payslips' : 'Not started'));

  private timer?: ReturnType<typeof setInterval>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
  }

  // Stands in for a job that reports its progress.
  start(): void {
    this.progress.set(0);
    this.running.set(true);
    this.timer = setInterval(() => {
      this.progress.update(value => Math.min(value + 8, 100));
      if (this.progress() === 100) {
        clearInterval(this.timer);
        this.running.set(false);
      }
    }, 250);
  }
}
