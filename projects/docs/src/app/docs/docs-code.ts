import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ButtonComponent } from 'ngx-hr-ui';
import { CodeLang, highlight } from './highlighter';

/** A code block with syntax colors and a copy button. Plain text shows until the colors load. */
@Component({
  selector: 'docs-code',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
  host: { class: 'block' },
  template: `
    <figure class="group relative overflow-hidden rounded-xl border border-docs-border bg-docs-subtle">
      @if (title()) {
        <figcaption class="flex h-10 items-center border-b border-docs-border px-4 font-mono text-xs text-docs-muted">
          {{ title() }}
        </figcaption>
      }
      @if (html(); as colored) {
        <div class="code-scroll max-h-[32rem] overflow-auto" [innerHTML]="colored"></div>
      } @else {
        <div class="code-scroll max-h-[32rem] overflow-auto"><pre><code>{{ trimmed() }}</code></pre></div>
      }
      <oct-button
        class="absolute right-2 rounded-lg bg-docs-subtle"
        [style.top.px]="title() ? 48 : 10"
        variant="ghost"
        color="neutral"
        size="sm"
        shape="square"
        [icon]="copied() ? 'Check' : 'Copy'"
        [ariaLabel]="copied() ? 'Copied' : 'Copy code'"
        (buttonClick)="copy()"
      />
    </figure>
  `,
  styles: `
    :host ::ng-deep pre {
      margin: 0;
      padding: 0.875rem 3.25rem 0.875rem 1rem;
      font-family: var(--font-mono);
      font-size: 0.8125rem;
      line-height: 1.6rem;
      tab-size: 2;
      width: max-content;
      min-width: 100%;
    }
  `
})
export class DocsCodeComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly code = input.required<string>();
  readonly lang = input<CodeLang>('angular-ts');
  /** A file name or label shown above the code. */
  readonly title = input<string>();

  protected readonly html = signal<SafeHtml | null>(null);
  protected readonly copied = signal(false);
  protected readonly trimmed = computed(() => this.code().replace(/^\n+|\s+$/g, ''));

  constructor() {
    effect(() => {
      const code = this.trimmed();
      const lang = this.lang();
      this.html.set(null);
      // Shiki escapes the code; the markup is ours, so trusting it keeps the color variables.
      highlight(code, lang).then(markup => {
        if (code === this.trimmed()) this.html.set(this.sanitizer.bypassSecurityTrustHtml(markup));
      });
    });
  }

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.trimmed());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    } catch {
      // The clipboard can be blocked (insecure origin, permissions); the code stays selectable.
    }
  }
}
