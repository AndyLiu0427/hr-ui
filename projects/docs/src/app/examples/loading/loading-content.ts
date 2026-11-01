import { Component, signal } from '@angular/core';
import { ButtonComponent, LoadingComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-loading-content',
  imports: [ButtonComponent, LoadingComponent],
  template: `
    <div class="flex w-64 flex-col gap-4">
      <!-- role="status" makes screen readers read the result when the loading ends. -->
      <div role="status" class="flex h-28 items-center justify-center rounded-xl border border-primary bg-secondary p-4">
        @if (loading()) {
          <oct-loading size="sm" text="Loading leave balance" />
        } @else {
          <p class="text-center text-sm text-1">
            <span class="block text-2xl font-semibold">12 days</span>
            annual leave left this year
          </p>
        }
      </div>
      <oct-button variant="outline" color="neutral" icon="RefreshCw" [disabled]="loading()" (buttonClick)="refresh()">Refresh</oct-button>
    </div>
  `
})
export default class LoadingContent {
  readonly loading = signal(false);

  refresh(): void {
    this.loading.set(true);
    // Stands in for the real request.
    setTimeout(() => this.loading.set(false), 1500);
  }
}
