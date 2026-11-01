import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, ElementRef, inject, input, signal, Type } from '@angular/core';
import { EXAMPLES } from '../generated/examples';
import { DocsCodeComponent } from './docs-code';

let nextId = 0;

/** An example with Preview and Code tabs. The code is the example's own file, so it cannot drift. */
@Component({
  selector: 'docs-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgComponentOutlet, DocsCodeComponent],
  host: { class: 'block' },
  template: `
    <div role="tablist" aria-label="Example view" class="flex items-center gap-5 border-b border-docs-border" (keydown)="onTabKey($event)">
      @for (tab of tabs; track tab) {
        <button
          type="button"
          role="tab"
          [id]="id + '-' + tab"
          [attr.aria-selected]="view() === tab"
          [attr.aria-controls]="id + '-' + tab + '-panel'"
          [tabIndex]="view() === tab ? 0 : -1"
          class="oct-focus-ring -mb-px border-b-2 px-0.5 pb-2.5 text-sm font-medium capitalize transition-colors duration-150"
          [class.border-docs-fg]="view() === tab"
          [class.text-docs-fg]="view() === tab"
          [class.border-transparent]="view() !== tab"
          [class.text-docs-muted]="view() !== tab"
          (click)="view.set(tab)"
        >
          {{ tab }}
        </button>
      }
    </div>

    <!-- The preview stays mounted while the code is shown, so a demo keeps its state. -->
    <div
      role="tabpanel"
      [id]="id + '-preview-panel'"
      [attr.aria-labelledby]="id + '-preview'"
      [hidden]="view() !== 'preview'"
      class="mt-4 overflow-x-auto rounded-xl border border-docs-border bg-docs-bg"
    >
      <div
        class="flex w-full p-6 sm:p-10"
        [class.min-h-72]="!compact()"
        [class.min-h-40]="compact()"
        [class.items-center]="align() !== 'start'"
        [class.justify-center]="align() !== 'start'"
        [class.items-start]="align() === 'start'"
      >
        @if (component(); as c) {
          <ng-container *ngComponentOutlet="c" />
        } @else if (missing()) {
          <p class="text-sm text-error">Example "{{ name() }}" not found. Run npm run docs:gen.</p>
        }
      </div>
    </div>
    <div role="tabpanel" [id]="id + '-code-panel'" [attr.aria-labelledby]="id + '-code'" [hidden]="view() !== 'code'" class="mt-4">
      @if (view() === 'code' || codeSeen()) {
        <docs-code [code]="source()" lang="angular-ts" />
      }
    </div>
  `
})
export class DocsExampleComponent {
  /** The example's file name under src/app/examples, without .ts. */
  readonly name = input.required<string>();
  /** 'start' puts wide examples (tables, forms) in the top-left instead of the centre. */
  readonly align = input<'center' | 'start'>('center');
  /** A shorter preview area for small examples. */
  readonly compact = input<boolean>(false);

  protected readonly id = `docs-example-${nextId++}`;
  protected readonly tabs = ['preview', 'code'] as const;
  protected readonly view = signal<'preview' | 'code'>('preview');
  protected readonly codeSeen = signal(false);
  protected readonly component = signal<Type<unknown> | null>(null);
  protected readonly source = signal('');
  protected readonly missing = signal(false);

  constructor() {
    // Examples link to app routes such as /employees that this site does not have. Keep a click on
    // one inside the preview, so the demo reacts without leaving the page. External links still work.
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const stayOnPage = (event: MouseEvent) => {
      const link = (event.target as Element).closest('a[href]') as HTMLAnchorElement | null;
      const preview = host.querySelector(`#${this.id}-preview-panel`);
      if (!link || !preview?.contains(link) || link.target === '_blank' || link.origin !== location.origin) return;
      event.preventDefault();
      event.stopPropagation();
    };
    host.addEventListener('click', stayOnPage, true);
    inject(DestroyRef).onDestroy(() => host.removeEventListener('click', stayOnPage, true));

    effect(() => {
      const entry = EXAMPLES[this.name()];
      this.component.set(null);
      this.missing.set(!entry);
      if (!entry) return;
      entry.load().then(c => this.component.set(c));
      entry.source().then(s => this.source.set(s));
    });
    effect(() => {
      if (this.view() === 'code') this.codeSeen.set(true);
    });
  }

  // Tabs follow the WAI-ARIA pattern: arrow keys move between them.
  protected onTabKey(event: KeyboardEvent): void {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const next = this.view() === 'preview' ? 'code' : 'preview';
    this.view.set(next);
    (document.getElementById(`${this.id}-${next}`) as HTMLElement | null)?.focus();
  }
}
