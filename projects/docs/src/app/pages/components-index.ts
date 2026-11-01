import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocsPageComponent } from '../docs/docs-page';
import { DocsThumbnailComponent } from '../docs/docs-thumbnail';
import { COMPONENT_DOCS } from '../generated/component-docs';

/** Every component as a card: a small live picture on top, then the name and what it is for. */
@Component({
  selector: 'docs-components-index',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DocsPageComponent, DocsThumbnailComponent],
  template: `
    <docs-page
      title="Components"
      description="Every component in ngx-hr-ui. Each page has live examples, the code behind them, and an API reference generated from the source."
    >
      <ul class="grid gap-4 sm:grid-cols-2">
        @for (c of components; track c.slug) {
          <li
            class="relative flex flex-col overflow-hidden rounded-xl border border-docs-border bg-docs-bg transition-colors duration-150 hover:border-docs-muted has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-[var(--primary)]"
          >
            <!-- A picture, not a demo: inert, so nothing in it takes focus or a click. -->
            <!-- Drawn 560px wide, then shrunk. "safe" keeps a tall or wide picture's top-left edge in view. -->
            <div inert class="flex h-44 flex-col overflow-hidden border-b border-docs-border bg-docs-subtle [align-items:safe_center] [justify-content:safe_center]">
              <div class="flex w-[560px] shrink-0 justify-center px-8 py-6 [zoom:0.66]">
                @defer (on viewport) {
                  <docs-thumbnail [name]="c.hero" />
                } @placeholder {
                  <div class="h-10 w-full"></div>
                }
              </div>
            </div>
            <div class="p-4">
              <h2 class="text-sm font-medium">
                <!-- The link covers the whole card. -->
                <a [routerLink]="'/docs/components/' + c.slug" class="outline-none after:absolute after:inset-0">{{ c.title }}</a>
              </h2>
              <p class="mt-1 line-clamp-2 text-sm leading-6 text-docs-muted">{{ c.description }}</p>
            </div>
          </li>
        }
      </ul>
    </docs-page>
  `
})
export class ComponentsIndexPage {
  protected readonly components = [...COMPONENT_DOCS].sort((a, b) => a.title.localeCompare(b.title));
}
