import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TextColor, TextComponent, TextVariant, TextWeight } from 'ngx-hr-ui';
import { DocsApiComponent } from '../../docs/docs-api';
import { DocsCodeComponent } from '../../docs/docs-code';
import { DocsPageComponent } from '../../docs/docs-page';
import { DocsHeadingDirective } from '../../docs/toc';

@Component({
  selector: 'docs-typography',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocsPageComponent, DocsCodeComponent, DocsApiComponent, DocsHeadingDirective, TextComponent],
  template: `
    <docs-page title="Typography" description="One text component sets size, weight and color from the design scale.">
      <p>
        <code>&lt;oct-text&gt;</code> renders text at a size from the scale, in one of the text colors.
        Long text is cut with an ellipsis unless you set <code>[truncate]="false"</code>.
      </p>
      <docs-code [code]="usage" />

      <h2 docsHeading>Sizes</h2>
      <p>From <code>xl</code> up the scale is one step larger than Tailwind's, for headings that read well in dense screens.</p>
      <div class="mt-4 divide-y divide-docs-border overflow-hidden rounded-xl border border-docs-border">
        @for (size of sizes; track size.variant) {
          <div class="flex items-baseline gap-4 overflow-hidden px-4 py-3">
            <code class="w-12 shrink-0 font-mono text-xs text-docs-muted">{{ size.variant }}</code>
            <code class="w-24 shrink-0 font-mono text-xs text-docs-muted">{{ size.px }}</code>
            <oct-text [variant]="size.variant" color="1" weight="semibold">Pay run approved</oct-text>
          </div>
        }
      </div>

      <h2 docsHeading>Weights</h2>
      <div class="mt-4 flex flex-wrap gap-x-8 gap-y-3">
        @for (weight of weights; track weight) {
          <div class="flex flex-col gap-1">
            <oct-text variant="lg" color="1" [weight]="weight">Gross pay</oct-text>
            <code class="font-mono text-xs text-docs-muted">{{ weight }}</code>
          </div>
        }
      </div>

      <h2 docsHeading>Colors</h2>
      <p>Each color meets WCAG AA contrast on hr-ui surfaces in both themes. <code>disabled</code> is for disabled controls only.</p>
      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        @for (color of colors; track color.value) {
          <div class="rounded-xl border border-docs-border px-4 py-3" [attr.aria-disabled]="color.value === 'disabled' ? 'true' : null">
            <oct-text variant="md" [color]="color.value" weight="medium">{{ color.label }}</oct-text>
            <code class="mt-1 block font-mono text-xs text-docs-muted">color="{{ color.value }}"</code>
          </div>
        }
      </div>

      <h2 docsHeading="api-reference">API Reference</h2>
      <docs-api [classes]="['TextComponent']" />
    </docs-page>
  `
})
export class TypographyPage {
  protected readonly usage = `<oct-text variant="2xl" color="1" weight="semibold">Pay run approved</oct-text>
<oct-text variant="sm" color="3">Paid on 28 Nov to 214 employees</oct-text>`;

  protected readonly sizes: { variant: TextVariant; px: string }[] = [
    { variant: 'xs', px: '12 / 16' },
    { variant: 'sm', px: '14 / 20' },
    { variant: 'md', px: '16 / 24' },
    { variant: 'lg', px: '18 / 28' },
    { variant: 'xl', px: '24 / 32' },
    { variant: '2xl', px: '30 / 36' },
    { variant: '3xl', px: '36 / 40' },
    { variant: '4xl', px: '48 / 1.1' },
    { variant: '5xl', px: '60 / 1.1' }
  ];

  protected readonly weights: TextWeight[] = ['regular', 'medium', 'semibold', 'bold'];

  protected readonly colors: { value: TextColor; label: string }[] = [
    { value: '1', label: 'Primary text' },
    { value: '2', label: 'Secondary text' },
    { value: '3', label: 'Tertiary text' },
    { value: 'error', label: 'Error text' },
    { value: 'warning', label: 'Warning text' },
    { value: 'disabled', label: 'Disabled text' }
  ];
}
