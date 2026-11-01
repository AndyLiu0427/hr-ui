import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { IconComponent } from 'ngx-hr-ui';
import { NAV, NAV_ORDER } from './nav';

/** The frame of a docs page: section, title, lead, content, and links to the pages either side. */
@Component({
  selector: 'docs-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  host: { class: 'block' },
  template: `
    <article>
      @if (section()) {
        <p class="mb-3 text-sm font-medium text-docs-muted">{{ section() }}</p>
      }
      <h1 class="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{{ title() }}</h1>
      @if (description()) {
        <p class="mt-3 text-base leading-7 text-docs-muted text-pretty sm:text-lg sm:leading-8">{{ description() }}</p>
      }
      <div class="docs-content mt-10">
        <ng-content />
      </div>

      @if (source()) {
        <p class="mt-16 text-sm">
          <a
            [href]="'https://github.com/AndyLiu0427/hr-ui/edit/main/' + source()"
            target="_blank"
            rel="noopener"
            class="oct-focus-ring inline-flex items-center gap-1.5 rounded-md text-docs-muted underline-offset-4 transition-colors duration-150 hover:text-docs-fg hover:underline"
            ><oct-icon name="Pencil" [size]="14" />Edit this page on GitHub</a
          >
        </p>
      }

      @if (previous() || next()) {
        <nav aria-label="Pages either side" class="mt-6 flex flex-col gap-3 border-t border-docs-border pt-8 sm:flex-row sm:justify-between">
          @if (previous(); as page) {
            <a
              [routerLink]="page.href"
              class="group flex flex-col gap-1 rounded-xl border border-docs-border px-4 py-3 transition-colors duration-150 hover:bg-docs-hover sm:min-w-56"
            >
              <span class="flex items-center gap-1 text-xs text-docs-muted"><oct-icon name="ChevronLeft" [size]="14" />Previous</span>
              <span class="text-sm font-medium">{{ page.title }}</span>
            </a>
          } @else {
            <span></span>
          }
          @if (next(); as page) {
            <a
              [routerLink]="page.href"
              class="group flex flex-col items-end gap-1 rounded-xl border border-docs-border px-4 py-3 text-right transition-colors duration-150 hover:bg-docs-hover sm:min-w-56"
            >
              <span class="flex items-center gap-1 text-xs text-docs-muted">Next<oct-icon name="ChevronRight" [size]="14" /></span>
              <span class="text-sm font-medium">{{ page.title }}</span>
            </a>
          }
        </nav>
      }
    </article>
  `
})
export class DocsPageComponent {
  private readonly router = inject(Router);

  readonly title = input.required<string>();
  readonly description = input<string>();
  /** The page's source file, relative to the repo root, for the "Edit this page" link. */
  readonly source = input<string>();

  // The same page instance can serve two component pages in a row, so follow the URL.
  private readonly path = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.router.url.split(/[?#]/)[0])
    ),
    { initialValue: this.router.url.split(/[?#]/)[0] }
  );
  private readonly index = computed(() => NAV_ORDER.findIndex(i => i.href === this.path()));
  protected readonly section = computed(() => NAV.find(s => s.items.some(i => i.href === this.path()))?.title);
  protected readonly previous = computed(() => (this.index() > 0 ? NAV_ORDER[this.index() - 1] : undefined));
  protected readonly next = computed(() => (this.index() >= 0 ? NAV_ORDER[this.index() + 1] : undefined));

  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    effect(() => {
      title.setTitle(`${this.title()} · hr-ui`);
      const description = this.description();
      if (description) meta.updateTag({ name: 'description', content: description });
    });
  }
}
