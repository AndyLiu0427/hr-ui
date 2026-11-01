import { ChangeDetectionStrategy, Component, computed, input, resource } from '@angular/core';
import { DocsHeadingDirective } from './toc';

interface ApiInput {
  name: string;
  type: string;
  default: string | null;
  required: boolean;
  twoWay: boolean;
  description: string;
}
interface ApiOutput {
  name: string;
  type: string;
  description: string;
}
interface ApiMethod {
  name: string;
  signature: string;
  description: string;
}
interface ApiEntry {
  name: string;
  kind: 'component' | 'directive' | 'pipe' | 'service';
  selector: string | null;
  description: string;
  inputs: ApiInput[];
  outputs: ApiOutput[];
  methods: ApiMethod[];
}

/** API reference generated from the library source by scripts/generate.mjs. */
@Component({
  selector: 'docs-api',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocsHeadingDirective],
  host: { class: 'block' },
  template: `
    @for (entry of entries(); track entry.name) {
      <h3 docsHeading class="mt-10 mb-1 scroll-mt-24 text-base font-semibold tracking-tight first:mt-0">
        <code class="font-mono text-[0.9375rem]">{{ heading(entry) }}</code>
      </h3>
      @if (entry.description) {
        <p class="mb-4 text-sm leading-6 text-docs-muted">{{ entry.description }}</p>
      }

      @if (entry.inputs.length) {
        <div class="mt-4 overflow-x-auto rounded-xl border border-docs-border">
          <table class="w-full min-w-[36rem] border-collapse text-left text-sm">
            <caption class="sr-only">{{ entry.name }} inputs</caption>
            <thead class="bg-docs-subtle text-docs-muted">
              <tr>
                <th scope="col" class="w-1/4 px-4 py-2.5 font-medium">Input</th>
                <th scope="col" class="px-4 py-2.5 font-medium">Type</th>
                <th scope="col" class="w-1/5 px-4 py-2.5 font-medium">Default</th>
              </tr>
            </thead>
            <tbody>
              @for (row of entry.inputs; track row.name) {
                <tr class="border-t border-docs-border align-top">
                  <td class="px-4 py-3">
                    <code class="font-mono text-[0.8125rem] font-medium">{{ row.twoWay ? '[(' + row.name + ')]' : row.name }}</code>
                    @if (row.required) {
                      <span class="ml-1.5 rounded-sm bg-docs-hover px-1 py-px text-[0.6875rem] font-medium text-docs-muted">required</span>
                    }
                    @if (row.description) {
                      <p class="mt-1 text-[0.8125rem] leading-5 text-docs-muted">{{ row.description }}</p>
                    }
                  </td>
                  <td class="px-4 py-3"><code class="font-mono text-[0.8125rem] break-words">{{ row.type }}</code></td>
                  <td class="px-4 py-3">
                    <code class="font-mono text-[0.8125rem] text-docs-muted">{{ row.required ? '—' : row.default }}</code>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      @if (entry.outputs.length) {
        <div class="mt-4 overflow-x-auto rounded-xl border border-docs-border">
          <table class="w-full min-w-[36rem] border-collapse text-left text-sm">
            <caption class="sr-only">{{ entry.name }} outputs</caption>
            <thead class="bg-docs-subtle text-docs-muted">
              <tr>
                <th scope="col" class="w-1/4 px-4 py-2.5 font-medium">Output</th>
                <th scope="col" class="px-4 py-2.5 font-medium">Payload</th>
              </tr>
            </thead>
            <tbody>
              @for (row of entry.outputs; track row.name) {
                <tr class="border-t border-docs-border align-top">
                  <td class="px-4 py-3">
                    <code class="font-mono text-[0.8125rem] font-medium">({{ row.name }})</code>
                    @if (row.description) {
                      <p class="mt-1 text-[0.8125rem] leading-5 text-docs-muted">{{ row.description }}</p>
                    }
                  </td>
                  <td class="px-4 py-3"><code class="font-mono text-[0.8125rem]">{{ row.type }}</code></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      @if (entry.methods.length) {
        <div class="mt-4 overflow-x-auto rounded-xl border border-docs-border">
          <table class="w-full min-w-[36rem] border-collapse text-left text-sm">
            <caption class="sr-only">{{ entry.name }} methods</caption>
            <thead class="bg-docs-subtle text-docs-muted">
              <tr><th scope="col" class="px-4 py-2.5 font-medium">Method</th></tr>
            </thead>
            <tbody>
              @for (row of entry.methods; track row.name) {
                <tr class="border-t border-docs-border align-top">
                  <td class="px-4 py-3">
                    <code class="font-mono text-[0.8125rem] break-words">{{ row.signature }}</code>
                    @if (row.description) {
                      <p class="mt-1 text-[0.8125rem] leading-5 text-docs-muted">{{ row.description }}</p>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    } @empty {
      @if (api.isLoading()) {
        <p class="text-sm text-docs-muted">Loading the API reference…</p>
      }
    }
  `
})
export class DocsApiComponent {
  /** Class names to show, in order. */
  readonly classes = input.required<string[]>();

  protected readonly api = resource({
    loader: () => import('../generated/api.json').then(m => m.default as unknown as Record<string, ApiEntry>)
  });

  protected readonly entries = computed(() => {
    const api = this.api.value();
    if (!api) return [];
    return this.classes()
      .map(name => api[name])
      .filter((e): e is ApiEntry => !!e);
  });

  protected heading(entry: ApiEntry): string {
    if (entry.kind === 'component' && entry.selector) return `<${entry.selector}>`;
    if (entry.kind === 'directive' && entry.selector) return entry.selector.split(',')[0].trim();
    if (entry.kind === 'pipe' && entry.selector) return `| ${entry.selector}`;
    return entry.name;
  }
}
