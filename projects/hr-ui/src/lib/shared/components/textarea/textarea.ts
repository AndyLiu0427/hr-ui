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
import { FormValueControl, ValidationError, DisabledReason } from '@angular/forms/signals';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { TextComponent } from '../text/text';

@Component({
  selector: 'oct-textarea',
  templateUrl: './textarea.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextComponent, CdkTextareaAutosize]
})
export class TextareaComponent implements FormValueControl<string> {
  readonly value = model<string>('');

  // FormUiControl - Interaction
  /** Touched state from the bound form field. */
  readonly touched = input<boolean>(false);
  /** Tells the bound form field that the user has left this control. */
  readonly touch = output<void>();
  /** Local copy of `touched`, so the control still tracks its own blur when no form field is bound. */
  readonly isTouched = linkedSignal(this.touched);

  // FormUiControl - Validation State
  readonly invalid = input<boolean>(false);
  readonly errors = input<readonly ValidationError.WithField[]>([]);
  readonly pending = input<boolean>(false);

  // FormUiControl - Availability State
  readonly disabled = input<boolean>(false);
  readonly disabledReasons = input<readonly DisabledReason[]>([]);
  readonly readonly = input<boolean>(false);

  // FormUiControl - Constraints
  readonly required = input<boolean>(false);
  readonly minLength = input<number | undefined>(undefined);
  readonly maxLength = input<number | undefined>(undefined);

  // Component Inputs
  readonly id = input<string>();
  readonly name = input<string>('');
  readonly label = input<string>();
  readonly placeholder = input<string>('');
  readonly helperText = input<string>();
  readonly hideHelper = input<boolean>(false);

  // Legacy Inputs
  /** @deprecated Use Signal Forms validation with [formField] directive */
  readonly error = input<boolean>();
  /** @deprecated Use Signal Forms validation with [formField] directive */
  readonly errorText = input<string>();

  // Outputs
  readonly textareaChange = output<string>();
  readonly textareaFocus = output<FocusEvent>();
  readonly textareaBlur = output<FocusEvent>();
  readonly textareaKeydown = output<KeyboardEvent>();
  readonly textareaKeyup = output<KeyboardEvent>();

  // Internal
  private readonly uniqueId = `textarea-${Math.random().toString(36).substring(2, 9)}`;
  readonly textareaElement = viewChild.required<ElementRef<HTMLTextAreaElement>>('textareaElement');
  protected readonly autosize = signal(false);
  private readonly startAutosize = afterNextRender(() => this.autosize.set(true));

  // Computed
  readonly textareaId = computed(() => this.id() || this.uniqueId);

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
      'text-sm',
      'px-3',
      'py-2.5',
      'rounded-lg',
      'border',
      'border-primary',
      'bg-secondary',
      'transition-colors',
      'duration-300',
      'ease-in-out',
      'will-change-[transform,opacity,filter]',
      'placeholder:text-3',
      'outline-2',
      'outline-transparent',
      'hover:border-primary-300',
      'focus:border-transparent',
      'focus:outline-2',
      'focus:outline-primary',
      'focus:outline-offset-transparent',
      'resize-none'
    ];

    if (this.hasError()) {
      classes.push('!border-transparent', 'outline-2', '!outline-hr-red-500');
    } else if (this.disabled()) {
      classes.push('disabled:border-hr-neutral-800', 'disabled:bg-hr-neutral-900', 'disabled:text-disabled', 'cursor-not-allowed');
    } else if (!this.value()) {
      classes.push('text-3', 'focus:!border-transparent', 'focus:outline-2', 'focus:outline-primary', 'focus:outline-offset-transparent');
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
