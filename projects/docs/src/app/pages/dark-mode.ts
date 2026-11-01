import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocsCodeComponent } from '../docs/docs-code';
import { DocsExampleComponent } from '../docs/docs-example';
import { DocsPageComponent } from '../docs/docs-page';
import { DocsHeadingDirective } from '../docs/toc';

@Component({
  selector: 'docs-dark-mode',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocsPageComponent, DocsCodeComponent, DocsExampleComponent, DocsHeadingDirective],
  template: `
    <docs-page title="Dark mode" description="One class on the html element switches every component, and ThemeService keeps the reader's choice.">
      <p>
        hr-ui reads the theme from a <code>dark</code> class on <code>&lt;html&gt;</code>. Its colour scales
        flip under that class, so components need no <code>dark:</code> variants of their own. The same
        class also drives Tailwind's <code>dark:</code> variant in your app, the setup shadcn/ui uses.
      </p>

      <h2 docsHeading>The toggle</h2>
      <p><code>&lt;oct-theme-controller&gt;</code> switches the theme and saves the choice.</p>
      <div class="mt-4"><docs-example name="theme-controller-demo" [compact]="true" /></div>

      <h2 docsHeading>From code</h2>
      <p>Inject <code>ThemeService</code> to read or set the theme yourself:</p>
      <docs-code [code]="service" />

      <h2 docsHeading>Avoid a flash on load</h2>
      <p>
        <code>ThemeService</code> saves the choice in <code>localStorage</code> under <code>app-theme</code>.
        Set the class before Angular starts, so the first paint is already in the right theme. This
        snippet also follows the reader's system setting on their first visit:
      </p>
      <docs-code lang="angular-html" title="src/index.html" [code]="script" />

      <h2 docsHeading>Your own colours</h2>
      <p>
        Give your page a background and text colour that follow the theme. hr-ui's tokens work well
        for this, and components that inherit text colour pick it up:
      </p>
      <docs-code lang="css" title="src/styles.css" [code]="base" />
    </docs-page>
  `
})
export class DarkModePage {
  protected readonly service = `import { Component, inject } from '@angular/core';
import { ThemeService } from 'ngx-hr-ui';

@Component({ /* ... */ })
export class Settings {
  private readonly theme = inject(ThemeService);

  /** 'light' or 'dark'; a signal, so templates update when it changes. */
  readonly mode = this.theme.themeMode;

  useDark(): void {
    this.theme.setTheme('dark');
  }
}`;

  protected readonly script = `<script>
  (function () {
    try {
      var saved = localStorage.getItem('app-theme');
      var theme = saved === 'dark' || saved === 'light'
        ? saved
        : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      if (!saved) localStorage.setItem('app-theme', theme);
      document.documentElement.classList.add(theme);
    } catch (e) {}
  })();
</script>`;

  protected readonly base = `@layer base {
  body {
    background-color: var(--secondary-background);
    color: var(--1);
  }
}`;
}
