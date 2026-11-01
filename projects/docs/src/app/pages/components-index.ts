import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocsPageComponent } from '../docs/docs-page';
import { NAV } from '../docs/nav';

@Component({
  selector: 'docs-components-index',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DocsPageComponent],
  template: `
    <docs-page title="Components" description="Every component in ngx-hr-ui, with live examples and an API reference generated from the source.">
      <ul class="grid gap-3 sm:grid-cols-2">
        @for (item of components; track item.href) {
          <li>
            <a
              [routerLink]="item.href"
              class="oct-focus-ring flex h-full flex-col gap-1 rounded-xl border border-docs-border p-4 transition-colors duration-150 hover:bg-docs-hover"
            >
              <span class="font-medium">{{ item.title }}</span>
              <span class="text-sm leading-6 text-docs-muted">{{ item.description }}</span>
            </a>
          </li>
        }
      </ul>
    </docs-page>
  `
})
export class ComponentsIndexPage {
  protected readonly components = NAV.find(s => s.title === 'Components')?.items ?? [];
}
