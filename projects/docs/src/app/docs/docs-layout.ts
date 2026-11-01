import { CdkTrapFocus } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  ButtonComponent,
  HighlightPipe,
  IconComponent,
  KbdComponent,
  SearchPanelComponent,
  SearchPanelEmptyDirective,
  SearchPanelRowDirective,
  ThemeControllerComponent
} from 'ngx-hr-ui';
import { filter, map } from 'rxjs';
import { DocsNavComponent } from './docs-nav';
import { NAV } from './nav';
import { DocsTocComponent } from './toc';

interface SearchItem {
  id: string;
  group: string;
  name: string;
  description: string;
}

const SEARCH_ITEMS: SearchItem[] = NAV.flatMap(s => s.items.map(i => ({ id: i.href, group: s.title, name: i.title, description: i.description })));

/** The site frame: header, sidebar, content, "On this page", phone drawer and ⌘K search. */
@Component({
  selector: 'docs-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    CdkTrapFocus,
    ButtonComponent,
    IconComponent,
    KbdComponent,
    HighlightPipe,
    SearchPanelComponent,
    SearchPanelRowDirective,
    SearchPanelEmptyDirective,
    ThemeControllerComponent,
    DocsNavComponent,
    DocsTocComponent
  ],
  host: { '(document:keydown)': 'onKey($event)' },
  template: `
    <button
      type="button"
      (click)="skipToContent()"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-docs-fg focus:px-3 focus:py-2 focus:text-sm focus:text-docs-bg"
    >
      Skip to content
    </button>

    <header class="sticky top-0 z-40 border-b border-docs-border bg-docs-bg/85 backdrop-blur-md">
      <div class="mx-auto flex h-14 max-w-screen-2xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
        <oct-button
          class="lg:hidden"
          [class.hidden]="isLanding()"
          variant="ghost"
          color="neutral"
          size="sm"
          shape="square"
          icon="Menu"
          ariaLabel="Open the menu"
          (buttonClick)="menuOpen.set(true)"
        />
        <a routerLink="/" class="oct-focus-ring mr-2 flex shrink-0 items-center gap-2 rounded-md font-semibold tracking-tight" aria-label="hr-ui home">
          <img src="favicon.svg" alt="" width="22" height="22" class="rounded-md dark:ring-1 dark:ring-white/15" />
          <span>hr-ui</span>
        </a>
        <nav aria-label="Main" class="hidden items-center gap-1 text-sm md:flex">
          @for (link of headerLinks; track link.href) {
            <a
              [routerLink]="link.href"
              class="oct-focus-ring rounded-md px-2.5 py-1.5 transition-colors duration-150 hover:text-docs-fg"
              [class.text-docs-fg]="isActive(link.match)"
              [class.font-medium]="isActive(link.match)"
              [class.text-docs-muted]="!isActive(link.match)"
              [attr.aria-current]="isActive(link.match) ? 'page' : null"
              >{{ link.title }}</a
            >
          }
        </nav>

        <div class="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            (click)="searchOpen.set(true)"
            class="oct-focus-ring flex h-9 items-center gap-2 rounded-lg border border-docs-border bg-docs-subtle px-2.5 text-sm text-docs-muted transition-colors duration-150 hover:bg-docs-hover hover:text-docs-fg sm:w-60 sm:px-3"
            aria-keyshortcuts="Meta+K Control+K /"
          >
            <oct-icon name="Search" [size]="16" />
            <span class="sr-only sm:not-sr-only sm:flex-1 sm:text-left">Search docs…</span>
            <span class="hidden sm:inline-flex" aria-hidden="true"><oct-kbd>⌘K</oct-kbd></span>
          </button>
          <a
            href="https://github.com/AndyLiu0427/hr-ui"
            target="_blank"
            rel="noopener"
            class="oct-focus-ring flex size-9 items-center justify-center rounded-lg text-docs-muted transition-colors duration-150 hover:bg-docs-hover hover:text-docs-fg"
            aria-label="hr-ui on GitHub"
          >
            <oct-icon name="Github" [size]="18" />
          </a>
          <oct-theme-controller size="sm" />
        </div>
      </div>
    </header>

    @if (isLanding()) {
      <main id="main" tabindex="-1" class="outline-none">
        <router-outlet />
      </main>
    } @else {
      <div class="mx-auto flex max-w-screen-2xl gap-10 px-4 sm:px-6">
        <aside class="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 shrink-0 overflow-y-auto overscroll-contain py-8 pr-2 lg:block">
          <docs-nav />
        </aside>
        <main id="main" tabindex="-1" class="min-w-0 flex-1 pb-20 pt-8 outline-none lg:pt-10">
          <div class="flex gap-12">
            <div class="mx-auto w-full min-w-0 max-w-3xl">
              <router-outlet />
            </div>
            <aside class="sticky top-24 hidden h-fit w-52 shrink-0 xl:block">
              <docs-toc />
            </aside>
          </div>
        </main>
      </div>
    }

    <footer class="border-t border-docs-border">
      <div class="mx-auto flex max-w-screen-2xl flex-col gap-2 px-4 py-8 text-sm text-docs-muted sm:flex-row sm:justify-between sm:px-6">
        <p>hr-ui is MIT licensed. Built with hr-ui.</p>
        <p>
          <a class="underline underline-offset-4 hover:text-docs-fg" href="https://github.com/AndyLiu0427/hr-ui" target="_blank" rel="noopener">Source on GitHub</a>
          ·
          <a class="underline underline-offset-4 hover:text-docs-fg" href="https://www.npmjs.com/package/ngx-hr-ui" target="_blank" rel="noopener">npm</a>
        </p>
      </div>
    </footer>

    @if (menuOpen()) {
      <div class="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
        <div class="absolute inset-0 bg-black/40" (click)="menuOpen.set(false)"></div>
        <div
          cdkTrapFocus
          [cdkTrapFocusAutoCapture]="true"
          class="absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col border-r border-docs-border bg-docs-bg shadow-xl"
        >
          <div class="flex h-14 shrink-0 items-center justify-between border-b border-docs-border pl-5 pr-2">
            <span class="font-semibold tracking-tight">hr-ui</span>
            <oct-button variant="ghost" color="neutral" size="sm" shape="square" icon="X" ariaLabel="Close the menu" (buttonClick)="menuOpen.set(false)" />
          </div>
          <div class="flex-1 overflow-y-auto overscroll-contain px-3 py-6">
            <docs-nav (navigate)="menuOpen.set(false)" />
          </div>
        </div>
      </div>
    }

    <oct-search-panel
      #searchPanel
      [isOpen]="searchOpen()"
      [(query)]="query"
      [items]="results()"
      placeholder="Search components and guides…"
      ariaLabel="Search the documentation"
      (itemSelected)="open($event)"
      (dialogClose)="closeSearch()"
    >
      <ng-template octSearchPanelRow let-item let-query="query">
        <div class="min-w-0 flex-1">
          <div class="truncate text-sm text-1" [innerHTML]="item.name | highlight: query"></div>
          <div class="truncate text-xs text-3" [innerHTML]="item.description | highlight: query"></div>
        </div>
      </ng-template>
      <ng-template octSearchPanelEmpty let-query>
        <div class="flex flex-col items-center gap-2 px-4 py-12 text-center">
          <oct-icon name="SearchX" size="xl" class="text-3" />
          <p class="text-sm text-1">No results for "{{ query }}"</p>
          <p class="text-xs text-3">Try a component name, such as select or dialog.</p>
          <oct-button class="mt-2" variant="outline" color="neutral" size="sm" (buttonClick)="searchPanel.clearQuery()">Clear search</oct-button>
        </div>
      </ng-template>
    </oct-search-panel>
  `
})
export class DocsLayoutComponent {
  private readonly router = inject(Router);

  protected readonly headerLinks = [
    { title: 'Docs', href: '/docs', match: /^\/docs(\/(installation|theming|dark-mode|colors|typography|icons))?$/ },
    { title: 'Components', href: '/docs/components', match: /^\/docs\/components/ },
    { title: 'Theming', href: '/docs/theming', match: /^\/docs\/theming$/ }
  ];

  protected readonly menuOpen = signal(false);
  protected readonly searchOpen = signal(false);
  protected readonly query = signal('');

  private readonly url = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.router.url.split(/[?#]/)[0])
    ),
    { initialValue: this.router.url.split(/[?#]/)[0] }
  );
  protected readonly isLanding = computed(() => this.url() === '/');

  protected readonly results = computed(() => {
    const words = this.query().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return SEARCH_ITEMS;
    return SEARCH_ITEMS.filter(item => {
      const text = `${item.name} ${item.description} ${item.group}`.toLowerCase();
      return words.every(w => text.includes(w));
    });
  });

  protected isActive(match: RegExp): boolean {
    return match.test(this.url());
  }

  protected onKey(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const typing = target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.searchOpen.set(true);
    } else if (event.key === '/' && !typing && !this.searchOpen()) {
      event.preventDefault();
      this.searchOpen.set(true);
    } else if (event.key === 'Escape' && this.menuOpen()) {
      this.menuOpen.set(false);
    }
  }

  protected open(item: SearchItem): void {
    this.closeSearch();
    this.router.navigateByUrl(item.id);
  }

  protected closeSearch(): void {
    this.searchOpen.set(false);
    this.query.set('');
  }

  protected skipToContent(): void {
    document.getElementById('main')?.focus();
  }
}
