import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TextComponent } from '../text/text';

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
      <div class="relative w-full bg-neutral-800 rounded-full h-4 overflow-hidden">
        <div
          class="absolute top-0 left-0 h-full bg-primary-600 rounded-full transition-all duration-500 ease-out will-change-[width]"
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
  readonly progress = input.required<number>();
  readonly label = input<string>('Processing...');
  readonly showPercentage = input<boolean>(true);
}
