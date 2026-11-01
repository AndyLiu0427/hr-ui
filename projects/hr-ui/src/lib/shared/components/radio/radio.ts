import { Component, ChangeDetectionStrategy, computed, input, output, viewChild, ElementRef } from '@angular/core';
import { TextComponent } from '../text/text';

/**
 * Presentational single-select radio control.
 *
 * Unlike `oct-checkbox`, this is a controlled, presentation-only component: the
 * `checked` state is driven by the parent and the parent owns mutual exclusion
 * (e.g. a table that replaces its selection on click). It deliberately does not
 * implement Signal Forms `FormControl` — wire group/form behavior at the call site.
 *
 * @example
 * ```html
 * <oct-radio [checked]="row === selected()" (radioChange)="select(row)" [ariaLabel]="'Select this row'" />
 * ```
 */
@Component({
  selector: 'oct-radio',
  templateUrl: './radio.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Tight inline-flex host so it has no extra line-height box around the input —
  // otherwise the control sits baseline-offset from sibling text (e.g. table cells).
  host: { class: 'inline-flex' },
  imports: [TextComponent]
})
export class RadioComponent {
  readonly checked = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  readonly label = input<string>();
  /** Always-visible helper text rendered under the label (needs `label` to show). */
  readonly description = input<string>();
  readonly id = input<string>();
  /** Groups radios so the browser enforces single-select within the same name. */
  readonly name = input<string>();
  readonly htmlValue = input<string>();
  /** Accessible label when no visible `label` is provided (e.g. inside a table cell). */
  readonly ariaLabel = input<string>();

  /** Emits when the user selects this radio. */
  readonly radioChange = output<boolean>();

  private readonly uniqueId = `radio-${Math.random().toString(36).substring(2, 11)}`;
  readonly radioInput = viewChild.required<ElementRef<HTMLInputElement>>('radioInput');

  readonly computedId = computed(() => this.id() || this.uniqueId);

  readonly labelClass = computed(() => {
    // With a description the text becomes two lines, so the circle tops-align
    // and gets a small offset (see inputClass) to optically center against the
    // first line instead of the whole block.
    const baseClasses = ['inline-flex', this.description() ? 'items-start' : 'items-center', 'gap-3', 'cursor-pointer'];
    if (this.disabled()) {
      baseClasses.push('cursor-not-allowed', 'text-hr-neutral-600');
    }
    return baseClasses.join(' ');
  });

  // Radio: a hollow accent ring that gains a concentric
  // accent dot when checked (not a solid fill). Disabled states drop to neutral.
  readonly inputClass = computed(() =>
    [
      // 16px circle vs the label's 20px first line: nudge down 2px when
      // top-aligned next to a description so it centers on that first line.
      ...(this.description() ? ['mt-0.5'] : []),
      'appearance-none',
      'cursor-pointer',
      'border-[1.5px]',
      'border-primary-300',
      'bg-transparent',
      'flex-shrink-0',
      'inline-block',
      'relative',
      'align-middle',
      // Explicit properties only (never transition-all): ring color + press scale.
      'transition-[border-color,scale]',
      'duration-200',
      'ease-[cubic-bezier(0.2,0,0,1)]',
      'focus-visible:outline-none',
      'focus-visible:outline-2',
      'focus-visible:outline-primary',
      'focus-visible:outline-offset-2',
      'hover:border-primary-200',
      'active:scale-[0.96]',
      // Inner dot: pops in with scale + opacity (cubic-bezier(0.2,0,0,1)).
      "before:content-['']",
      'before:absolute',
      'before:inset-[3px]',
      'before:rounded-full',
      'before:bg-primary-300',
      'before:opacity-0',
      'before:scale-50',
      'before:transition-[opacity,scale]',
      'before:duration-200',
      'before:ease-[cubic-bezier(0.2,0,0,1)]',
      'checked:before:opacity-100',
      'checked:before:scale-100',
      'disabled:cursor-not-allowed',
      'disabled:border-hr-neutral-800',
      'disabled:hover:border-hr-neutral-800',
      'disabled:before:bg-hr-neutral-700',
      'disabled:active:scale-100',
      'w-4',
      'h-4',
      'rounded-full'
    ].join(' ')
  );

  onRadioChange(event: Event): void {
    if (this.disabled()) return;
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      this.radioChange.emit(true);
    }
  }

  focus(): void {
    this.radioInput()?.nativeElement.focus();
  }

  blur(): void {
    this.radioInput()?.nativeElement.blur();
  }
}
