import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { BadgeComponent, ButtonComponent, CheckboxComponent, ProgressBarComponent, SwitchComponent } from 'ngx-hr-ui';
import { DocsCodeComponent } from '../docs/docs-code';
import { DocsPageComponent } from '../docs/docs-page';
import { DocsHeadingDirective } from '../docs/toc';

interface Preset {
  name: string;
  hue: number;
  chroma: number;
}

const DEFAULT: Preset = { name: 'Teal', hue: 189.8, chroma: 1 };

@Component({
  selector: 'docs-theming',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocsPageComponent, DocsCodeComponent, DocsHeadingDirective, ButtonComponent, BadgeComponent, SwitchComponent, CheckboxComponent, ProgressBarComponent],
  template: `
    <docs-page source="projects/docs/src/app/pages/theming.ts" title="Theming" description="Set your brand color with two CSS variables. Every primary shade follows, in light and dark mode.">
      <p>
        hr-ui builds its primary scale in OKLCH from a hue and a strength. Change those two values and
        buttons, focus rings, switches, links and progress bars all move together. Try it: the whole
        site below follows the controls while you are on this page.
      </p>

      <div class="mt-8 overflow-hidden rounded-xl border border-docs-border">
        <div class="flex flex-col gap-5 border-b border-docs-border bg-docs-subtle p-5 sm:flex-row sm:items-end">
          <label class="flex flex-1 flex-col gap-2 text-sm font-medium">
            <span class="flex justify-between">Hue <output class="font-mono text-docs-muted">{{ hue() }}</output></span>
            <input type="range" min="0" max="360" step="0.5" [value]="hue()" (input)="hue.set(+$any($event.target).value)" class="accent-[var(--primary)]" />
          </label>
          <label class="flex flex-1 flex-col gap-2 text-sm font-medium">
            <span class="flex justify-between">Strength <output class="font-mono text-docs-muted">{{ chroma() }}</output></span>
            <input type="range" min="0.25" max="2" step="0.05" [value]="chroma()" (input)="chroma.set(+$any($event.target).value)" class="accent-[var(--primary)]" />
          </label>
        </div>
        <div class="flex flex-wrap gap-2 border-b border-docs-border px-5 py-3" role="group" aria-label="Presets">
          @for (preset of presets; track preset.name) {
            <button
              type="button"
              (click)="apply(preset)"
              [attr.aria-pressed]="hue() === preset.hue && chroma() === preset.chroma"
              class="oct-focus-ring flex items-center gap-2 rounded-full border border-docs-border px-3 py-1 text-sm transition-colors duration-150 hover:bg-docs-hover aria-pressed:border-docs-fg"
            >
              <span class="size-3 rounded-full" [style.background]="swatch(preset)"></span>{{ preset.name }}
            </button>
          }
        </div>
        <div class="flex flex-wrap items-center gap-x-6 gap-y-5 p-6 sm:p-8">
          <div class="flex flex-wrap gap-2">
            <oct-button icon="Plus">Add employee</oct-button>
            <oct-button variant="outline">Export</oct-button>
            <oct-button variant="ghost">Cancel</oct-button>
          </div>
          <oct-switch [checked]="true" label="Payroll locked" />
          <oct-checkbox [checked]="true" label="Send payslips" />
          <oct-badge text="Approved" color="success" />
          <div class="w-full max-w-xs"><oct-progress-bar [progress]="68" /></div>
        </div>
      </div>

      <h2 docsHeading>Your CSS</h2>
      <p>Put this after the hr-ui import in your global stylesheet:</p>
      <docs-code language="css" title="src/styles.css" [code]="css()" />

      <h2 docsHeading>How it stays readable</h2>
      <p>
        Components never use a primary shade directly. They use roles, and each role points at a
        shade chosen for contrast:
      </p>
      <ul>
        <li><code>bg-primary-solid</code> fills a button behind white text. It measures 5:1 or more for every hue at a strength up to 2.</li>
        <li><code>text-primary</code> colors links, outline and ghost buttons, and the focus ring.</li>
        <li><code>bg-primary-solid-hover</code> is one step darker for hover.</li>
      </ul>
      <p>
        In dark mode the scale flips, and the roles point at the shade that keeps the same contrast
        against a dark page. You do not set anything for dark mode.
      </p>

      <h2 docsHeading>Changing one shade</h2>
      <p>
        To set a single shade by hand, override its variable. Do it for both themes, because the
        scale flips in dark mode:
      </p>
      <docs-code language="css" [code]="singleShade" />

      <h2 docsHeading>Status colors</h2>
      <p>
        Success, warning, error and info use their own scales (<code>--color-success-*</code> and so on)
        and roles (<code>bg-success-solid</code>, <code>text-success</code>). Override them the same way.
      </p>
    </docs-page>
  `
})
export class ThemingPage {
  protected readonly presets: Preset[] = [
    DEFAULT,
    { name: 'Emerald', hue: 162.5, chroma: 2 },
    { name: 'Blue', hue: 255, chroma: 1.7 },
    { name: 'Violet', hue: 292, chroma: 1.6 },
    { name: 'Rose', hue: 12, chroma: 1.7 },
    { name: 'Amber', hue: 65, chroma: 1.6 },
    { name: 'Slate', hue: 250, chroma: 0.35 }
  ];

  protected readonly hue = signal(DEFAULT.hue);
  protected readonly chroma = signal(DEFAULT.chroma);

  protected readonly css = computed(
    () => `:root {
  --hr-primary-hue: ${this.hue()};
  --hr-primary-chroma: ${this.chroma()};
}`
  );

  protected readonly singleShade = `:root {
  --color-primary-300: #0f766e; /* light mode */
}
.dark {
  --color-primary-700: #0f766e; /* the same role in dark mode */
}`;

  constructor() {
    const root = document.documentElement;
    effect(() => {
      root.style.setProperty('--hr-primary-hue', String(this.hue()));
      root.style.setProperty('--hr-primary-chroma', String(this.chroma()));
    });
    // The site goes back to its own colors when you leave the page.
    inject(DestroyRef).onDestroy(() => {
      root.style.removeProperty('--hr-primary-hue');
      root.style.removeProperty('--hr-primary-chroma');
    });
  }

  protected apply(preset: Preset): void {
    this.hue.set(preset.hue);
    this.chroma.set(preset.chroma);
  }

  protected swatch(preset: Preset): string {
    return `oklch(0.512 ${(0.062 * preset.chroma).toFixed(3)} ${preset.hue})`;
  }
}
