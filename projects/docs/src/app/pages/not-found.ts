import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'docs-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="flex flex-col items-start gap-4 py-16">
      <p class="font-mono text-sm text-docs-muted">404</p>
      <h1 class="text-3xl font-semibold tracking-tight">This page does not exist</h1>
      <p class="text-docs-muted">The link may be old. Search with ⌘K, or start from the component list.</p>
      <a
        routerLink="/docs/components"
        class="oct-focus-ring inline-flex h-10 items-center gap-2 rounded-lg bg-docs-fg px-4 text-sm font-medium text-docs-bg transition-opacity duration-150 hover:opacity-90"
        >Browse components</a
      >
    </div>
  `
})
export class NotFoundPage {
  constructor() {
    inject(Title).setTitle('Page not found · hr-ui');
  }
}
