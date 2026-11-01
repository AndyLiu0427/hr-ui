import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { icons } from 'lucide-angular';
import { HR_ICON_OVERRIDES, IconComponent } from 'ngx-hr-ui';
import { DocsApiComponent } from '../../docs/docs-api';
import { DocsCodeComponent } from '../../docs/docs-code';
import { DocsPageComponent } from '../../docs/docs-page';
import { DocsHeadingDirective } from '../../docs/toc';

const ALL = Object.keys(icons);
const SHOWN = 240;

@Component({
  selector: 'docs-icons',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocsPageComponent, DocsCodeComponent, DocsApiComponent, DocsHeadingDirective, IconComponent],
  template: `
    <docs-page title="Icons" description="Every Lucide icon by name, plus HR marks from hr-icons that replace their Lucide namesakes.">
      <docs-code [code]="usage" />

      <h2 docsHeading>HR marks</h2>
      <p>
        These names draw an hr-icons mark instead of the Lucide icon. They are tuned for payroll
        screens and get a dedicated small master at 18px and below.
      </p>
      <ul class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        @for (name of hrMarks; track name) {
          <li>
            <button type="button" (click)="copy(name)" class="oct-focus-ring flex w-full flex-col items-center gap-2 rounded-xl border border-docs-border px-2 py-4 transition-colors duration-150 hover:bg-docs-hover">
              <oct-icon [name]="name" [size]="24" />
              <span class="text-xs text-docs-muted">{{ copied() === name ? 'Copied' : name }}</span>
            </button>
          </li>
        }
      </ul>

      <h2 docsHeading>All icons</h2>
      <p>{{ total }} icons from Lucide. Search by name, then click one to copy its tag.</p>
      <label class="mt-4 flex h-10 items-center gap-2 rounded-lg border border-docs-border bg-docs-subtle px-3 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--primary)]">
        <oct-icon name="Search" [size]="16" class="text-docs-muted" />
        <span class="sr-only">Search icons</span>
        <input
          type="search"
          [value]="query()"
          (input)="query.set($any($event.target).value)"
          placeholder="Search icons, such as calendar"
          class="h-full flex-1 bg-transparent text-base outline-none sm:text-sm"
        />
      </label>
      <p class="mt-3 text-xs text-docs-muted" aria-live="polite">
        {{ matches().length }} {{ matches().length === 1 ? 'match' : 'matches' }}{{ matches().length > shown ? ', showing the first ' + shown : '' }}
      </p>
      <ul class="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
        @for (name of visible(); track name) {
          <li>
            <button
              type="button"
              (click)="copy(name)"
              class="oct-focus-ring flex w-full flex-col items-center gap-2 rounded-lg px-1 py-3 transition-colors duration-150 hover:bg-docs-hover"
              [attr.aria-label]="'Copy ' + name"
            >
              <oct-icon [name]="name" [size]="20" />
              <span class="w-full truncate text-center text-[0.6875rem] text-docs-muted">{{ copied() === name ? 'Copied' : name }}</span>
            </button>
          </li>
        }
      </ul>

      <h2 docsHeading="api-reference">API Reference</h2>
      <docs-api [classes]="['IconComponent']" />
    </docs-page>
  `
})
export class IconsPage {
  protected readonly usage = `<oct-icon name="Calendar" />
<oct-icon name="Payslip" [size]="20" color="primary" />`;
  protected readonly hrMarks = Object.keys(HR_ICON_OVERRIDES);
  protected readonly total = ALL.length;
  protected readonly shown = SHOWN;
  protected readonly query = signal('');
  protected readonly copied = signal<string | null>(null);

  protected readonly matches = computed(() => {
    const q = this.query().trim().toLowerCase();
    return q ? ALL.filter(n => n.toLowerCase().includes(q)) : ALL;
  });
  protected readonly visible = computed(() => this.matches().slice(0, SHOWN));

  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected async copy(name: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(`<oct-icon name="${name}" />`);
      this.copied.set(name);
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.copied.set(null), 1200);
    } catch {
      // Clipboard blocked: the name is on screen.
    }
  }
}
