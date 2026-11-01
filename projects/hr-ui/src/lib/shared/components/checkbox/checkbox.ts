import { Component, ChangeDetectionStrategy, computed, model, input, output, viewChild, ElementRef, linkedSignal } from '@angular/core';
import { FormCheckboxControl, ValidationError, DisabledReason } from '@angular/forms/signals';
import { TextComponent } from '../text/text';

/** Checkbox visual state for simple usage without Signal Forms */
export type CheckboxState = 'default' | 'checked' | 'disabled' | 'disabled-checked';

/**
 * A checkbox with a label and an optional description. Bind it with [formField] or [(checked)].
 *
 * @example
 * ```typescript
 * formModel = signal({ agreeTerms: false });
 * form = form(this.formModel, (f) => {
 *   required(f.agreeTerms, { message: 'You must agree to terms' });
 * });
 * ```
 * ```html
 * <oct-checkbox [formField]="form.agreeTerms" label="I agree to terms" />
 * ```
 */
@Component({
  selector: 'oct-checkbox',
  templateUrl: './checkbox.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextComponent]
})
export class CheckboxComponent implements FormCheckboxControl {
  // FormCheckboxControl
  /** Whether the box is checked. */
  readonly checked = model<boolean>(false);

  // FormUiControl - Interaction
  /** Touched state from the bound form field. */
  readonly touched = input<boolean>(false);
  /** Tells the bound form field that the user has left this control. */
  readonly touch = output<void>();
  /** Local copy of `touched`, so the control still tracks its own blur when no form field is bound. */
  readonly isTouched = linkedSignal(this.touched);

  // FormUiControl - Validation State
  /** Invalid state from the form field. The error state shows after the checkbox is touched. */
  readonly invalid = input<boolean>(false);
  /** Validation errors from the form field. The first message shows in the error state. */
  readonly errors = input<readonly ValidationError.WithField[]>([]);

  // FormUiControl - Availability State
  /** Disables the checkbox. */
  readonly disabled = input<boolean>(false);
  /** Reasons from the form field for why the checkbox is disabled. The checkbox does not show them. */
  readonly disabledReasons = input<readonly DisabledReason[]>([]);

  // FormUiControl - Constraints
  /** Adds an asterisk to the label and sets the native required attribute. */
  readonly required = input<boolean>(false);

  // Component Inputs
  /** Text next to the box. A click on it toggles the checkbox. */
  readonly label = input<string>();
  /** Optional helper text shown below the label in a fainter colour. Use for
   *  a longer explanation of a complex toggle (what happens when on/off). */
  readonly description = input<string>();
  /** Id of the native input. One is generated when you do not set it. */
  readonly id = input<string>();
  /** Name of the native input. */
  readonly name = input<string>('');
  /** Value of the native input, sent when a native form submits. */
  readonly htmlValue = input<string>();

  // Outputs
  /** Emits the new checked state when the user toggles the checkbox. */
  readonly checkboxChange = output<boolean>();

  // Legacy/Simple Inputs (prefer [formField] directive for Signal Forms)
  /** Manual error state - prefer [formField] directive for Signal Forms */
  readonly error = input<boolean>();
  /** Manual error message - prefer [formField] directive for Signal Forms */
  readonly errorText = input<string>();
  /** Has no effect. Set checked and disabled instead. */
  readonly state = input<CheckboxState>('default');

  // Internal
  private readonly uniqueId = `checkbox-${Math.random().toString(36).substring(2, 11)}`;
  readonly checkboxInput = viewChild.required<ElementRef<HTMLInputElement>>('checkboxInput');

  // Computed
  readonly computedId = computed(() => this.id() || this.uniqueId);

  readonly hasError = computed(() => {
    // Check legacy error prop first (explicit override)
    const manualError = this.error();
    if (manualError !== undefined) return manualError;
    // Check Signal Forms inputs (set by Field directive or manually)
    return this.invalid() && this.isTouched();
  });

  readonly errorMessage = computed(() => {
    // Check legacy errorText prop first (explicit override)
    const manualErrorText = this.errorText();
    if (manualErrorText) return manualErrorText;
    // Check Signal Forms errors (set by Field directive or manually)
    const errs = this.errors();
    return errs.length > 0 ? errs[0].message : '';
  });

  readonly isDisabled = computed(() => this.disabled());

  readonly isRequired = computed(() => this.required());

  readonly labelClass = computed(() => {
    const baseClasses = ['inline-flex', 'gap-3', 'cursor-pointer'];
    // Single line centres on the box; with a description the box aligns to the
    // top so it sits on the label line, not the centre of the text block.
    baseClasses.push(this.description() ? 'items-start' : 'items-center');
    if (this.isDisabled()) {
      baseClasses.push('cursor-not-allowed', 'text-hr-neutral-600');
    }
    return baseClasses.join(' ');
  });

  readonly inputClass = computed(() => {
    const baseClasses = [
      'appearance-none',
      'cursor-pointer',
      'border',
      'border-hr-neutral-800',
      'bg-hr-neutral-900',
      'flex-shrink-0',
      'inline-block',
      'relative',
      'align-middle',
      'transition-all',
      'duration-300',
      'ease-in-out',
      'focus-visible:outline-none',
      'focus-visible:outline-2',
      'focus-visible:outline-primary',
      'focus-visible:outline-offset-2',
      'hover:border-primary-300',
      "before:content-['']",
      'before:absolute',
      'before:inset-0.5',
      'before:opacity-0',
      'before:bg-hr-neutral-950',
      'before:transition-all',
      'before:duration-300',
      'before:ease-in-out',
      'before:rotate-45',
      'before:[clip-path:polygon(20%_100%,20%_80%,50%_80%,50%_80%,70%_80%,70%_100%)]',
      'checked:bg-primary-solid',
      'checked:border-primary-solid',
      'checked:text-white',
      'checked:before:opacity-100',
      'checked:before:[clip-path:polygon(20%_100%,20%_80%,50%_80%,50%_0%,70%_0%,70%_100%)]',
      'disabled:cursor-not-allowed',
      'disabled:hover:border-hr-neutral-800',
      'w-4',
      'h-4',
      'rounded-sm'
    ];

    // Nudge the box down to the label's first line when a description stacks below.
    if (this.description()) {
      baseClasses.push('mt-0.5');
    }

    if (this.hasError()) {
      baseClasses.push('!border-hr-red-500', 'focus-visible:!outline-hr-red-500', 'checked:!bg-hr-red-500', 'checked:!border-hr-red-500');
    }

    return baseClasses.join(' ');
  });

  // Event Handlers
  onCheckboxChange(event: Event): void {
    if (this.isDisabled()) return;
    const target = event.target as HTMLInputElement;
    this.checked.set(target.checked);
    this.checkboxChange.emit(target.checked);
  }

  onBlur(): void {
    this.isTouched.set(true);
    this.touch.emit();
  }

  // Public Methods
  focus(): void {
    this.checkboxInput()?.nativeElement.focus();
  }

  blur(): void {
    this.checkboxInput()?.nativeElement.blur();
  }
}
