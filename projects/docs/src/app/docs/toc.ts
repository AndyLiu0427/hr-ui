import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  Injectable,
  input,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
  el: HTMLElement;
}

/** The headings of the page on screen, in document order. */
@Injectable({ providedIn: 'root' })
export class TocService {
  private readonly _entries = signal<TocEntry[]>([]);
  readonly entries = this._entries.asReadonly();

  /** Registers a heading and returns the id it got, made unique on the page. */
  register(el: HTMLElement, wanted: string, text: string, level: 2 | 3): string {
    const taken = new Set(this._entries().map(e => e.id));
    let id = wanted || 'section';
    for (let n = 2; taken.has(id); n++) id = `${wanted}-${n}`;
    const entry: TocEntry = { id, text, level, el };
    this._entries.update(list =>
      [...list, entry].sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
    );
    // A link to a section can arrive before the section exists (the API loads its data later),
    // so the router's own anchor scroll finds nothing. Scroll when the heading shows up.
    // Examples above it load in after that and push it down, so scroll again while the page
    // settles, unless the reader has started scrolling.
    if (decodeURIComponent(location.hash.slice(1)) === id) {
      let readerScrolled = false;
      const stop = () => (readerScrolled = true);
      for (const type of ['wheel', 'touchmove', 'keydown']) window.addEventListener(type, stop, { once: true, passive: true });
      for (const delay of [0, 300, 900]) {
        setTimeout(() => readerScrolled || el.scrollIntoView({ block: 'start' }), delay);
      }
    }
    return id;
  }

  unregister(el: HTMLElement): void {
    this._entries.update(list => list.filter(e => e.el !== el));
  }
}

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Gives an h2 or h3 an id and lists it in "On this page". `docsHeading="custom-id"` sets the id. */
@Directive({ selector: 'h2[docsHeading], h3[docsHeading]' })
export class DocsHeadingDirective {
  readonly docsHeading = input<string>('');

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const toc = inject(TocService);
    afterNextRender(() => {
      const text = el.textContent?.trim() ?? '';
      el.id = toc.register(el, this.docsHeading() || slugify(text), text, el.tagName === 'H3' ? 3 : 2);
    });
    inject(DestroyRef).onDestroy(() => toc.unregister(el));
  }
}

/** "On this page": links to the page's headings, highlighting the one being read. */
@Component({
  selector: 'docs-toc',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    @if (toc.entries().length > 1) {
      <nav aria-labelledby="docs-toc-title" class="text-sm">
        <p id="docs-toc-title" class="mb-3 font-medium text-docs-fg">On this page</p>
        <ul class="space-y-2.5 border-l border-docs-border">
          @for (entry of toc.entries(); track entry.id) {
            <li>
              <a
                [routerLink]="[]"
                [fragment]="entry.id"
                class="-ml-px block border-l py-0.5 leading-5 [overflow-wrap:anywhere] transition-colors duration-150 hover:text-docs-fg"
                [class.pl-4]="entry.level === 2"
                [class.pl-7]="entry.level === 3"
                [class.border-docs-fg]="active() === entry.id"
                [class.text-docs-fg]="active() === entry.id"
                [class.border-transparent]="active() !== entry.id"
                [class.text-docs-muted]="active() !== entry.id"
                [attr.aria-current]="active() === entry.id ? 'location' : null"
                >{{ entry.text }}</a
              >
            </li>
          }
        </ul>
      </nav>
    }
  `
})
export class DocsTocComponent {
  protected readonly toc = inject(TocService);
  protected readonly active = signal<string | null>(null);

  constructor() {
    // The active heading is the last one whose top has scrolled past the header.
    const update = () => {
      const entries = this.toc.entries();
      let current: string | null = entries[0]?.id ?? null;
      for (const e of entries) if (e.el.getBoundingClientRect().top < 120) current = e.id;
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2 && entries.length) {
        current = entries[entries.length - 1].id;
      }
      this.active.set(current);
    };
    afterNextRender(() => {
      update();
      window.addEventListener('scroll', update, { passive: true });
    });
    // A new page registers new headings without scrolling.
    effect(() => {
      this.toc.entries();
      queueMicrotask(update);
    });
    inject(DestroyRef).onDestroy(() => window.removeEventListener('scroll', update));
  }
}
