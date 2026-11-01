import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TextComponent } from '../text/text';

const SPINNER_SIZE_CLASSES = { sm: 'size-6', md: 'size-8', lg: 'size-12' };
const SPINNER_COLOR_CLASSES = { primary: 'border-primary-300', neutral: 'border-hr-neutral-700' };
const TEXT_SIZE_CLASSES = { sm: 'mt-2', md: 'mt-4', lg: 'mt-6' };

@Component({
  selector: 'oct-loading',
  templateUrl: './loading.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextComponent]
})
export class LoadingComponent {
  readonly text = input<string | undefined>('');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly color = input<'primary' | 'neutral'>('neutral');
  readonly centered = input<boolean>(true);
  readonly customClasses = input<string>();

  readonly containerClasses = computed(() => {
    const classes = ['flex', 'flex-col', 'items-center'];
    if (this.centered()) classes.push('justify-center');
    if (this.customClasses()) classes.push(this.customClasses()!);
    return classes.join(' ');
  });

  readonly spinnerClasses = computed(() => `${SPINNER_SIZE_CLASSES[this.size()]} ${SPINNER_COLOR_CLASSES[this.color()]}`);

  readonly textClasses = computed(() => TEXT_SIZE_CLASSES[this.size()]);
}
