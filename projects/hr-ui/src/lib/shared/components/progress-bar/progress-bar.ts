import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TextComponent } from '../text/text';

/** A bar that shows how far a task has got, with a label and an optional percentage. */
@Component({
  selector: 'oct-progress-bar',
  template: `
    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center">
        <oct-text variant="sm" color="2" weight="medium">{{ label() }}</oct-text>
        @if (showPercentage()) {
          <oct-text variant="sm" color="1" weight="semibold">{{ Math.round(progress()) }}%</oct-text>
        }
      </div>
      <div class="relative w-full bg-hr-neutral-800 rounded-full h-4 overflow-hidden">
        <!-- Full width, slid left by what is left to do: a transform animates without layout. -->
        <div
          class="absolute inset-0 bg-primary-solid rounded-full transition-transform duration-250 ease-out motion-reduce:transition-none"
          [style.transform]="'translateX(-' + (100 - filled()) + '%)'"
        ></div>
      </div>
    </div>
  `,
  imports: [TextComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent {
  readonly Math = Math;
  /** How far the task has got, from 0 to 100. */
  readonly progress = input.required<number>();
  /** Text above the bar. */
  readonly label = input<string>('Processing...');
  /** Shows the rounded percentage beside the label. */
  readonly showPercentage = input<boolean>(true);

  protected readonly filled = computed(() => Math.min(100, Math.max(0, this.progress())));
}
