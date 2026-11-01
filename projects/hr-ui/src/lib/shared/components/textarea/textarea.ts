import {
  Component,
  ChangeDetectionStrategy,
  computed,
  model,
  input,
  output,
  viewChild,
  ElementRef,
  linkedSignal,
  signal,
  afterNextRender
} from '@angular/core';
import { FormValueControl, ValidationError, DisabledReason, WithOptionalFieldTree } from '@angular/forms/signals';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { TextComponent } from '../text/text';

/** A multi-line text field with a label, helper text and an error message. It starts at four rows and grows with its content. */
@Component({
  selector: 'oct-textarea',
  templateUrl: './textarea.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextComponent, CdkTextareaAutosize]
})
export class TextareaComponent implements FormValueControl<string> {
  /** Text in the field. Spaces at the start and end are removed. */
  readonly value = model<string>('');

  // FormUiControl - Interaction
  /** Touched state from the bound form field. */
  readonly touched = input<boolean>(false);
  /** Tells the bound form field that the user has left this control. */
  readonly touch = output<void>();
  /** Local copy of `touched`, so the control still tracks its own blur when no form field is bound. */
  readonly isTouched = linkedSignal(this.touched);

  // FormUiControl - Validation State
  /** Invalid state from the form field. The error state shows after the field is touched. */
  readonly invalid = input<boolean>(false);
  /** Validation errors from the form field. The first message shows in the error state. */
  readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  /** Async validation state from the form field. The textarea does not show it. */
  readonly pending = input<boolean>(false);

  // FormUiControl - Availability State
  /** Disables the field. */
  readonly disabled = input<boolean>(false);
  /** Reasons from the form field for why the field is disabled. The textarea does not show them. */
  readonly disabledReasons = input<readonly WithOptionalFieldTree<DisabledReason>[]>([]);
  /** Lets the user select and copy the text, but not change it. */
  readonly readonly = input<boolean>(false);

  // FormUiControl - Constraints
  /** Adds an asterisk to the label. */
  readonly required = input<boolean>(false);
  /** Sets the native minlength attribute. */
  readonly minLength = input<number | undefined>(undefined);
  /** Sets the native maxlength attribute, which stops typing at the limit. */
  readonly maxLength = input<number | undefined>(undefined);

  // Component Inputs
  /** Id of the native textarea. One is generated when you do not set it. */
  readonly id = input<string>();
  /** Name of the native textarea. It falls back to the id. */
  readonly name = input<string>('');
  /** Text of the label above the field. */
  readonly label = input<string>();
  /** Hint that shows while the field is empty. */
  readonly placeholder = input<string>('');
  /** Text under the field. An error message replaces it. */
  readonly helperText = input<string>();
  /** Removes the row under the field that holds the helper and error text. */
  readonly hideHelper = input<boolean>(false);

  /** Turns the error state on or off. It overrides errorText and the form field. */
  readonly error = input<boolean>();
  /** Error message under the field. Setting it shows the error state. */
  readonly errorText = input<string>();

  // Outputs
  /** Emits the value when the user types in the field. */
  readonly textareaChange = output<string>();
  /** Emits when the field gets focus. */
  readonly textareaFocus = output<FocusEvent>();
  /** Emits when the field loses focus. */
  readonly textareaBlur = output<FocusEvent>();
  /** Emits each keydown event from the field. */
  readonly textareaKeydown = output<KeyboardEvent>();
  /** Emits each keyup event from the field. */
  readonly textareaKeyup = output<KeyboardEvent>();

  // Internal
  private readonly uniqueId = `textarea-${Math.random().toString(36).substring(2, 9)}`;
  readonly textareaElement = viewChild.required<ElementRef<HTMLTextAreaElement>>('textareaElement');
  protected readonly autosize = signal(false);
  private readonly startAutosize = afterNextRender(() => this.autosize.set(true));

  // Computed
  readonly textareaId = computed(() => this.id() || this.uniqueId);

  readonly hasError = computed(() => {
    const manualError = this.error();
    if (manualError !== undefined) return manualError;
    if (this.errorText()) return true;
    return this.invalid() && this.isTouched();
  });

  readonly errorMessage = computed(() => {
    const manualErrorText = this.errorText();
    if (manualErrorText) return manualErrorText;
    const errs = this.errors();
    return errs.length > 0 ? errs[0].message : '';
  });

  readonly displayHelperText = computed(() => (this.hasError() ? this.errorMessage() : this.helperText() || ''));

  readonly containerClass = computed(() =>
    ['relative', 'w-full', 'grid', 'gap-1.5', this.disabled() ? 'cursor-not-allowed' : ''].filter(Boolean).join(' ')
  );

  readonly labelClass = computed(() =>
    ['inline-flex', 'text-sm', 'font-medium', 'transition-colors', this.hasError() ? 'text-error' : 'text-1'].join(' ')
  );

  readonly textareaClass = computed(() => {
    const classes = [
      'w-full',
      'text-1',
      // 16px on phones: iOS Safari zooms the page into any focused field under 16px.
      'text-base',
      'sm:text-sm',
      'px-3',
      'py-2.5',
      'rounded-lg',
      'border',
      'border-primary',
      'bg-secondary',
      'transition-colors',
      'duration-150',
      'ease-out',
      'placeholder:text-3',
      'outline-2',
      'outline-transparent',
      'hover:border-primary-300',
      'focus:border-transparent',
      'focus:outline-2',
      'focus:outline-primary',
      'resize-none'
    ];

    if (this.hasError()) {
      classes.push('!border-transparent', 'outline-2', '!outline-hr-red-500');
    } else if (this.disabled()) {
      classes.push('disabled:border-hr-neutral-800', 'disabled:bg-hr-neutral-900', 'disabled:text-disabled', 'cursor-not-allowed');
    } else if (!this.value()) {
      classes.push('text-3', 'focus:!border-transparent', 'focus:outline-2', 'focus:outline-primary');
    }

    return classes.join(' ');
  });

  // Event Handlers
  handleInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const trimmedValue = target.value.trim();
    this.value.set(trimmedValue);
    this.textareaChange.emit(trimmedValue);
  }

  handleFocus(event: FocusEvent): void {
    this.textareaFocus.emit(event);
  }

  handleBlur(event: FocusEvent): void {
    const target = event.target as HTMLTextAreaElement;
    const trimmedValue = target.value.trim();

    if (target.value !== trimmedValue) {
      target.value = trimmedValue;
      this.value.set(trimmedValue);
      this.textareaChange.emit(trimmedValue);
    }

    this.isTouched.set(true);

    this.touch.emit();
    this.textareaBlur.emit(event);
  }

  handleKeydown(event: KeyboardEvent): void {
    this.textareaKeydown.emit(event);
  }

  handleKeyup(event: KeyboardEvent): void {
    this.textareaKeyup.emit(event);
  }

  // Public Methods
  focus(): void {
    this.textareaElement()?.nativeElement.focus();
  }

  blur(): void {
    this.textareaElement()?.nativeElement.blur();
  }

  select(): void {
    this.textareaElement()?.nativeElement.select();
  }

  clear(): void {
    this.value.set('');
    this.textareaChange.emit('');
  }
}
