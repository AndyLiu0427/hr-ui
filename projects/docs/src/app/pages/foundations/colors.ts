import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { DocsPageComponent } from '../../docs/docs-page';
import { DocsHeadingDirective } from '../../docs/toc';

interface Token {
  name: string;
  variable: string;
  use: string;
}

const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

/** Swatches read the live CSS variables, so the page always shows what the library ships. */
@Component({
  selector: 'docs-colors',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocsPageComponent, DocsHeadingDirective],
  template: `
    <docs-page source="projects/docs/src/app/pages/foundations/colors.ts" title="Colors" description="Semantic tokens for everyday use, and the scales behind them. Click a swatch to copy it.">
      <p>
        Use the semantic tokens in your own screens. They follow the theme and keep text readable. The
        scales below them are what the tokens point at.
      </p>

      @for (group of tokenGroups; track group.title) {
        <h2 docsHeading>{{ group.title }}</h2>
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          @for (token of group.tokens; track token.variable) {
            <button
              type="button"
              (click)="copy('var(' + token.variable + ')')"
              class="oct-focus-ring flex items-center gap-3 rounded-xl border border-docs-border p-3 text-left transition-colors duration-150 hover:bg-docs-hover"
              [attr.aria-label]="'Copy var(' + token.variable + ')'"
            >
              <span class="size-10 shrink-0 rounded-lg border border-docs-border" [style.background]="'var(' + token.variable + ')'"></span>
              <span class="min-w-0">
                <span class="block text-sm font-medium">{{ token.name }}</span>
                <span class="block truncate font-mono text-xs text-docs-muted">{{ copied() === 'var(' + token.variable + ')' ? 'Copied' : token.variable }}</span>
                <span class="block text-xs text-docs-muted">{{ token.use }}</span>
              </span>
            </button>
          }
        </div>
      }

      <h2 docsHeading>Scales</h2>
      <p>
        The scales flip in dark mode so a token can stay on one step. In light mode a low step is dark
        and a high step is light: <code>hr-red-100</code> is dark red, <code>hr-red-900</code> is a pale
        tint. Click a swatch to copy its class.
      </p>
      @for (scale of scales; track scale.name) {
        <h3 docsHeading>{{ scale.title }}</h3>
        <div class="mt-3 grid grid-cols-6 gap-1.5 sm:grid-cols-11">
          @for (step of steps; track step) {
            <button
              type="button"
              (click)="copy('bg-' + scale.name + '-' + step)"
              class="oct-focus-ring group flex flex-col gap-1.5 rounded-lg text-left"
              [attr.aria-label]="'Copy bg-' + scale.name + '-' + step"
            >
              <span class="h-10 w-full rounded-md border border-black/5 dark:border-white/10" [style.background]="'var(--color-' + scale.name + '-' + step + ')'"></span>
              <span class="font-mono text-[0.6875rem] text-docs-muted group-hover:text-docs-fg">{{ copied() === 'bg-' + scale.name + '-' + step ? '✓' : step }}</span>
            </button>
          }
        </div>
      }
    </docs-page>
  `
})
export class ColorsPage {
  protected readonly steps = STEPS;
  protected readonly copied = signal<string | null>(null);

  protected readonly tokenGroups: { title: string; tokens: Token[] }[] = [
    {
      title: 'Text',
      tokens: [
        { name: 'Primary text', variable: '--1', use: 'Headings and body text · text-1' },
        { name: 'Secondary text', variable: '--2', use: 'Labels and supporting text · text-2' },
        { name: 'Tertiary text', variable: '--3', use: 'Hints and captions · text-3' },
        { name: 'Accent text', variable: '--primary', use: 'Links, outline buttons, focus ring · text-primary' }
      ]
    },
    {
      title: 'Surfaces',
      tokens: [
        { name: 'Surface', variable: '--secondary-background', use: 'Cards, inputs, dialogs · bg-secondary' },
        { name: 'Page', variable: '--primary-background', use: 'Behind cards · bg-primary' },
        { name: 'Canvas', variable: '--canvas-background', use: 'Around an inset panel · bg-canvas' },
        { name: 'Border', variable: '--border-color', use: 'Dividers and card edges · border-primary' }
      ]
    },
    {
      title: 'Solid fills',
      tokens: [
        { name: 'Primary', variable: '--primary-solid', use: 'Buttons with white text · bg-primary-solid' },
        { name: 'Success', variable: '--success-solid', use: 'bg-success-solid' },
        { name: 'Warning', variable: '--warning-solid', use: 'bg-warning-solid' },
        { name: 'Error', variable: '--error-solid', use: 'bg-error-solid' },
        { name: 'Info', variable: '--info-solid', use: 'bg-info-solid' }
      ]
    },
    {
      title: 'Status text',
      tokens: [
        { name: 'Success', variable: '--success', use: 'text-success' },
        { name: 'Warning', variable: '--warning', use: 'text-warning' },
        { name: 'Error', variable: '--error', use: 'text-error' },
        { name: 'Info', variable: '--info', use: 'text-info' }
      ]
    }
  ];

  protected readonly scales = [
    { name: 'primary', title: 'Primary' },
    { name: 'hr-neutral', title: 'Neutral' },
    { name: 'hr-red', title: 'Red' },
    { name: 'hr-orange', title: 'Orange' },
    { name: 'hr-yellow', title: 'Yellow' },
    { name: 'hr-green', title: 'Green' },
    { name: 'hr-cyan', title: 'Cyan' },
    { name: 'hr-blue', title: 'Blue' },
    { name: 'hr-violet', title: 'Violet' },
    { name: 'hr-pink', title: 'Pink' }
  ];

  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected async copy(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      this.copied.set(text);
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.copied.set(null), 1200);
    } catch {
      // Clipboard blocked: the token name is on screen to copy by hand.
    }
  }
}
