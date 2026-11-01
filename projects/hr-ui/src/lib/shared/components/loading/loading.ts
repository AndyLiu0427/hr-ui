import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TextComponent } from '../text/text';

const SPINNER_SIZE_CLASSES = { sm: 'size-6', md: 'size-8', lg: 'size-12' };
const SPINNER_COLOR_CLASSES = { primary: 'border-primary-300', neutral: 'border-hr-neutral-700' };
const TEXT_SIZE_CLASSES = { sm: 'mt-2', md: 'mt-4', lg: 'mt-6' };

/** A spinner, with an optional line of text under it. */
@Component({
  selector: 'oct-loading',
  templateUrl: './loading.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextComponent]
})
export class LoadingComponent {
  /** A line under the spinner that says what is loading. */
  readonly text = input<string | undefined>('');
  /** The size of the spinner. */
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  /** The colour of the spinner. */
  readonly color = input<'primary' | 'neutral'>('neutral');
  /** Centres the spinner vertically when the box has a height, for example from customClasses. */
  readonly centered = input<boolean>(true);
  /** Extra classes for the box around the spinner and the text. */
  readonly customClasses = input<string>();

  readonly containerClasses = computed(() => {
    const classes = ['flex', 'flex-col', 'items-center', 'animate-bounce-in'];
    if (this.centered()) classes.push('justify-center');
    if (this.customClasses()) classes.push(this.customClasses()!);
    return classes.join(' ');
  });

  readonly spinnerClasses = computed(() => `${SPINNER_SIZE_CLASSES[this.size()]} ${SPINNER_COLOR_CLASSES[this.color()]}`);

  readonly textClasses = computed(() => TEXT_SIZE_CLASSES[this.size()]);
}
