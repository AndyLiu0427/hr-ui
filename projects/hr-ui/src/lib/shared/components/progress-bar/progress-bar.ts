import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TextComponent } from '../text/text';

/** A bar that shows how far a task has got, with an optional label and percentage. */
@Component({
  selector: 'oct-progress-bar',
  template: `
    <div class="flex flex-col gap-2">
      @if (label() || showPercentage()) {
        <div class="flex justify-between items-center">
          @if (label()) {
            <oct-text variant="sm" color="2" weight="medium">{{ label() }}</oct-text>
          }
          @if (showPercentage()) {
            <oct-text variant="sm" color="1" weight="semibold" class="ml-auto">{{ percent() }}%</oct-text>
          }
        </div>
      }
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'progressbar',
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    '[attr.aria-valuenow]': 'percent()',
    '[attr.aria-label]': 'label() || "Progress"'
  }
})
export class ProgressBarComponent {
  /** How far the task has got, from 0 to 100. */
  readonly progress = input.required<number>();
  /** Text above the bar, and the bar's name for screen readers, which is "Progress" without it. */
  readonly label = input<string>('');
  /** Shows the rounded percentage above the bar. */
  readonly showPercentage = input<boolean>(true);

  protected readonly filled = computed(() => Math.min(100, Math.max(0, this.progress())));
  protected readonly percent = computed(() => Math.round(this.filled()));
}
