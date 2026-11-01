import { ChangeDetectionStrategy, Component, computed, input, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocsApiComponent } from '../docs/docs-api';
import { DocsCodeComponent } from '../docs/docs-code';
import { DocsExampleComponent } from '../docs/docs-example';
import { DocsPageComponent } from '../docs/docs-page';
import { DocsHeadingDirective } from '../docs/toc';
import { COMPONENT_DOCS } from '../generated/component-docs';
import { NotFoundPage } from './not-found';

/** One page per component, built from src/app/content/components/<slug>.ts. */
@Component({
  selector: 'docs-component-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DocsPageComponent, DocsExampleComponent, DocsCodeComponent, DocsApiComponent, DocsHeadingDirective, NotFoundPage],
  template: `
    @if (entry(); as e) {
      <docs-page [title]="e.title" [description]="e.description" [source]="'projects/docs/src/app/content/components/' + e.slug + '.ts'">
        @if (doc.value(); as d) {
          @let hero = d.examples[0];
          @if (hero) {
            <docs-example [name]="hero.name" [align]="hero.align ?? 'center'" [compact]="hero.compact ?? false" />
          }

          <h2 docsHeading>Installation</h2>
          <docs-code lang="shellscript" [code]="'npm install ngx-hr-ui'" />
          <p>Then import what you use. Tailwind, styles and translations are set up once, on the <a routerLink="/docs/installation">Installation</a> page.</p>

          <h2 docsHeading>Usage</h2>
          <docs-code lang="angular-ts" [code]="importLine()" />
          <div class="mt-3"><docs-code lang="angular-html" [code]="d.usage" /></div>

          @if (d.examples.length > 1) {
            <h2 docsHeading>Examples</h2>
            @for (example of d.examples.slice(1); track example.name) {
              <h3 docsHeading>{{ example.title ?? example.name }}</h3>
              @if (example.description) {
                <p>{{ example.description }}</p>
              }
              <div class="mt-4"><docs-example [name]="example.name" [align]="example.align ?? 'center'" [compact]="example.compact ?? false" /></div>
            }
          }

          @if (d.keyboard?.length) {
            <h2 docsHeading>Keyboard</h2>
            <div class="mt-4 overflow-x-auto rounded-xl border border-docs-border">
              <table class="w-full border-collapse text-left text-sm">
                <thead class="bg-docs-subtle text-docs-muted">
                  <tr>
                    <th scope="col" class="w-1/3 px-4 py-2.5 font-medium">Key</th>
                    <th scope="col" class="px-4 py-2.5 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  @for (row of d.keyboard; track $index) {
                    <tr class="border-t border-docs-border align-top">
                      <td class="px-4 py-3">
                        <span class="inline-flex flex-wrap items-center gap-1">
                          @for (key of row.keys; track key) {
                            <kbd class="rounded-md border border-docs-border bg-docs-subtle px-1.5 py-0.5 font-sans text-xs font-medium">{{ key }}</kbd>
                          }
                        </span>
                      </td>
                      <td class="px-4 py-3 leading-6">{{ row.action }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          @if (d.accessibility?.length) {
            <h2 docsHeading>Accessibility</h2>
            @for (note of d.accessibility; track note) {
              <p>{{ note }}</p>
            }
          }

          <h2 docsHeading="api-reference">API Reference</h2>
          <docs-api [classes]="d.api" />
        }
      </docs-page>
    } @else {
      <docs-not-found />
    }
  `
})
export class ComponentPage {
  /** Bound from the :slug route parameter. */
  readonly slug = input.required<string>();

  protected readonly entry = computed(() => COMPONENT_DOCS.find(c => c.slug === this.slug()));
  protected readonly doc = resource({
    params: () => this.entry(),
    loader: ({ params }) => params.load()
  });
  protected readonly importLine = computed(() => {
    const names = this.doc.value()?.imports ?? [];
    return `import { ${names.join(', ')} } from 'ngx-hr-ui';`;
  });
}
