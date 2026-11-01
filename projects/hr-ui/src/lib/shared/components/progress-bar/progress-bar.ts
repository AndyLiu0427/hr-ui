import { ChangeDetectionStrategy, Component, input } from '@angular/core';
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
        <div
          class="absolute top-0 left-0 h-full bg-primary-solid rounded-full transition-all duration-500 ease-out will-change-[width]"
          [style.width.%]="progress()"
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
}
