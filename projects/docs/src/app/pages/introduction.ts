import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocsPageComponent } from '../docs/docs-page';
import { DocsHeadingDirective } from '../docs/toc';

@Component({
  selector: 'docs-introduction',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DocsPageComponent, DocsHeadingDirective],
  template: `
    <docs-page title="Introduction" description="Accessible Angular components for HR and payroll apps, styled with Tailwind CSS 4.">
      <p>
        hr-ui is the component set behind a production payroll product, published as the
        <code>ngx-hr-ui</code> package. It covers the screens these apps are made of: forms with
        validation, data tables with filters, side sheets and dialogs, status badges, timelines and
        notices.
      </p>

      <h2 docsHeading>What you get</h2>
      <ul>
        <li><strong>Over 40 components</strong>, all standalone, written with signals and ready for signal forms.</li>
        <li><strong>Accessible by default.</strong> Text meets WCAG AA contrast in both themes, controls show a focus ring for keyboard users, and menus and dialogs manage focus.</li>
        <li><strong>Your brand color in one line.</strong> Two CSS variables recolor every primary shade, in light and dark mode. See <a routerLink="/docs/theming">Theming</a>.</li>
        <li><strong>Dark mode</strong> through one class on the page, with a ready-made toggle.</li>
        <li><strong>Tailwind CSS 4 tokens</strong> that sit next to yours. hr-ui adds its own names and never changes Tailwind's defaults or your global styles.</li>
      </ul>

      <h2 docsHeading>How the docs work</h2>
      <p>
        Every component page starts with a live example. The Code tab shows that example's own source
        file, so what you copy is what you see. The API reference at the bottom of each page is
        generated from the library's source on every build.
      </p>

      <h2 docsHeading>Next steps</h2>
      <ul>
        <li><a routerLink="/docs/installation">Install hr-ui</a> in an Angular 22 app.</li>
        <li><a routerLink="/docs/theming">Pick your colors</a>.</li>
        <li><a routerLink="/docs/components">Browse the components</a>.</li>
      </ul>
    </docs-page>
  `
})
export class IntroductionPage {}
