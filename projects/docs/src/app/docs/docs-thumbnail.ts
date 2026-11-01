import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, resource } from '@angular/core';
import { EXAMPLES } from '../generated/examples';

/** One example, drawn on its own. The components overview uses it as a picture of each component. */
@Component({
  selector: 'docs-thumbnail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgComponentOutlet],
  host: { class: 'contents' },
  template: `
    @if (example.value(); as component) {
      <ng-container *ngComponentOutlet="component" />
    }
  `
})
export class DocsThumbnailComponent {
  /** The example's file name under src/app/examples, without .ts. */
  readonly name = input.required<string>();

  protected readonly example = resource({
    params: () => EXAMPLES[this.name()],
    loader: ({ params }) => params.load()
  });
}
