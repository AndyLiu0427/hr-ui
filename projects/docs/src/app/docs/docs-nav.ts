import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAV } from './nav';

/** The docs table of contents, shared by the sidebar and the phone drawer. */
@Component({
  selector: 'docs-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav aria-label="Documentation" class="text-sm">
      @for (section of nav; track section.title; let i = $index) {
        <div class="pb-6">
          <p [id]="'docs-nav-' + i" class="mb-1.5 px-2.5 text-xs font-medium text-docs-muted">{{ section.title }}</p>
          <ul [attr.aria-labelledby]="'docs-nav-' + i" class="space-y-px">
            @for (item of section.items; track item.href) {
              <li>
                <a
                  [routerLink]="item.href"
                  routerLinkActive="bg-docs-hover font-medium !text-docs-fg"
                  [routerLinkActiveOptions]="{ exact: true }"
                  ariaCurrentWhenActive="page"
                  (click)="navigate.emit()"
                  class="oct-focus-ring flex min-h-8 items-center rounded-md px-2.5 py-1 text-docs-muted transition-colors duration-150 hover:text-docs-fg"
                  >{{ item.title }}</a
                >
              </li>
            }
          </ul>
        </div>
      }
    </nav>
  `
})
export class DocsNavComponent {
  protected readonly nav = NAV;
  /** Emits when a link is followed, so the phone drawer can close. */
  readonly navigate = output<void>();
}
