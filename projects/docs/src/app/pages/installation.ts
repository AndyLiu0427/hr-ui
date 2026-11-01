import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocsCodeComponent } from '../docs/docs-code';
import { DocsPageComponent } from '../docs/docs-page';
import { DocsHeadingDirective } from '../docs/toc';

@Component({
  selector: 'docs-installation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DocsPageComponent, DocsCodeComponent, DocsHeadingDirective],
  template: `
    <docs-page title="Installation" description="Add ngx-hr-ui to an Angular 22 app that uses Tailwind CSS 4.">
      <p>You need Angular 22 and Tailwind CSS 4. The steps below take about five minutes.</p>

      <h2 docsHeading>1. Install the packages</h2>
      <docs-code lang="shellscript" [code]="install" />
      <p>
        <code>lucide-angular</code> does not list Angular 22 as a supported version yet. Add an
        <code>overrides</code> block to your <code>package.json</code> so npm accepts it:
      </p>
      <docs-code lang="json" title="package.json" [code]="overrides" />

      <h2 docsHeading>2. Add the styles</h2>
      <p>
        In your global stylesheet, import Tailwind first and hr-ui second. The <code>&#64;source</code>
        line lets Tailwind find the classes the components use inside <code>node_modules</code>.
      </p>
      <docs-code lang="css" title="src/styles.css" [code]="styles" />

      <h2 docsHeading>3. Provide animations and translations</h2>
      <p>
        Components show a few built-in strings, such as "Clear" in a filter. They come from
        <code>&#64;ngx-translate/core</code>. hr-ui ships English and Traditional Chinese files that you
        can use as they are or merge into your own.
      </p>
      <docs-code title="src/app/app.config.ts" [code]="config" />

      <h2 docsHeading>4. Use a component</h2>
      <docs-code title="src/app/app.ts" [code]="usage" />
      <p>
        That's it. Next, <a routerLink="/docs/theming">set your brand color</a> or
        <a routerLink="/docs/components">browse the components</a>.
      </p>
    </docs-page>
  `
})
export class InstallationPage {
  protected readonly install = `npm install ngx-hr-ui @angular/cdk @ngx-translate/core lucide-angular tailwindcss @tailwindcss/postcss`;

  protected readonly overrides = `{
  "overrides": {
    "lucide-angular": {
      "@angular/core": "$@angular/core",
      "@angular/common": "$@angular/common"
    }
  }
}`;

  protected readonly styles = `@import "tailwindcss";
@import "ngx-hr-ui/styles/hr-ui.css";
@source "../node_modules/ngx-hr-ui";`;

  protected readonly config = `import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import en from 'ngx-hr-ui/i18n/en.json';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideTranslateService({
      fallbackLang: 'en',
      lang: 'en',
      loader: { provide: TranslateLoader, useValue: { getTranslation: () => of(en) } }
    })
  ]
};`;

  protected readonly usage = `import { Component } from '@angular/core';
import { ButtonComponent } from 'ngx-hr-ui';

@Component({
  selector: 'app-root',
  imports: [ButtonComponent],
  template: \`<oct-button icon="Plus">Add employee</oct-button>\`
})
export class App {}`;
}
