import { Component, ChangeDetectionStrategy, input } from '@angular/core';

/** Shows a calculation as a fraction, such as how an hourly overtime rate is worked out. */
@Component({
  selector: 'oct-formula',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center gap-2 py-4 px-6 bg-primary rounded-lg">
      <!-- Numerator -->
      <div class="text-center">
        <span class="text-sm font-mono text-1 whitespace-pre-wrap">{{ numerator() }}</span>
      </div>

      <!-- Dividing line -->
      <div class="w-full border-t bg-hr-neutral-50 my-1"></div>

      <!-- Denominator -->
      <div class="text-center">
        <span class="text-sm font-mono text-1 whitespace-pre-wrap">{{ denominator() }}</span>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class FormulaComponent {
  /** The text above the line. Line breaks in it are kept. */
  readonly numerator = input.required<string>();
  /** The text below the line. Line breaks in it are kept. */
  readonly denominator = input.required<string>();
}
