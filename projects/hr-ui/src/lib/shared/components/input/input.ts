import {
  Component,
  ChangeDetectionStrategy,
  computed,
  signal,
  input,
  output,
  model,
  viewChild,
  ElementRef,
  ModelSignal,
  linkedSignal
} from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';

import {
  fieldAdornmentClass,
  fieldContainerClass,
  fieldHelperTextClass,
  fieldLabelClass,
  fieldShellClass,
  fieldTextPaddingClass
} from '../form/field-shell';
import { IconComponent } from '../icon/icon';
import { TextComponent } from '../text/text';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date';

/** Mirrors the sizeMap in select.ts triggerClasses(), so a shell holding both is one height. */
const BARE_PADDING_BY_SIZE = {
  sm: 'px-2 py-1.5',
  md: 'px-2 py-2',
  lg: 'px-2 py-2.5'
} as const;
export type InputSize = 'sm' | 'md' | 'lg';
export type InputState = 'default' | 'error' | 'disabled';

/** Text field. Bind it with `[formField]` or `[(value)]`. */
@Component({
  selector: 'oct-input',
  templateUrl: './input.html',
  imports: [IconComponent, TextComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Bare: the host is the flex item of the owner's shell, so it must grow and be allowed to shrink.
  host: {
    '[class.flex-1]': 'bare()',
    '[class.min-w-0]': 'bare()'
  }
})
export class InputComponent implements FormValueControl<string> {
  readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>('inputElement');

  readonly id = input<string>();
  readonly name = input<string>('');
  readonly label = input<string>();
  readonly placeholder = input<string>('');
  readonly helperText = input<string>();
  readonly type = input<InputType>('text');
  readonly size = input<InputSize>('md');
  readonly state = input<InputState>('default');
  readonly readonly = input<boolean>(false);
  readonly ariaLabel = input<string>();
  readonly ariaDescribedBy = input<string>();
  readonly hideHelper = input<boolean>(false);
  readonly errorText = input<string>();
  readonly loading = input<boolean>(false);
  readonly leftIcon = input<string>();
  readonly rightIcon = input<string>();
  readonly leftText = input<string>();
  readonly rightText = input<string>();
  readonly showPasswordToggle = input<boolean>(false);
  /** Shows an X that empties the field. */
  readonly clearable = input<boolean>(false);
  readonly uppercase = input<boolean>(false);
  /** Number step. Unset means 1, which rejects decimals: pass '0.01' for money, 'any' for no check. */
  readonly step = input<string>();
  /** Native inputmode, so a money field can ask for a decimal keypad without type="number". */
  readonly inputMode = input<string>();
  /** Native `pattern` attribute, which opens a numeric keypad on iOS. `pattern` is taken by FormValueControl. */
  readonly inputPattern = input<string>();
  /** Drops the shell, label and helper row so the control sits inside a shared shell. */
  readonly bare = input<boolean>(false);

  readonly value: ModelSignal<string> = model<string>('');

  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  readonly disabled = input<boolean>(false);

  readonly required = input<boolean>(false);

  readonly invalid = input<boolean>(false);

  readonly touched = input<boolean>(false);

  /** Tells the bound form field that the user has left this control. */
  readonly touch = output<void>();

  /** Local copy of `touched`, so the control still tracks its own blur when no form field is bound. */
  readonly isTouched = linkedSignal(this.touched);

  readonly error = input<boolean>();

  readonly inputChange = output<string>();
  readonly inputFocus = output<FocusEvent>();
  readonly inputBlur = output<FocusEvent>();

  readonly passwordVisible = signal<boolean>(false);

  readonly inputId = computed(() => this.id() || `input-${Math.random().toString(36).substring(2, 9)}`);

  readonly inputType = computed(() => {
    if (this.type() === 'password' && this.passwordVisible()) {
      return 'text';
    }
    return this.type();
  });

  readonly isDisabled = computed(() => this.disabled() || this.state() === 'disabled');

  readonly isReadonly = computed(() => this.readonly() || this.loading());

  readonly hasError = computed(() => {
    const explicitError = this.error();
    const errorText = this.errorText();
    const state = this.state();
    const signalFormsInvalid = this.invalid() && this.isTouched();
    const signalFormsErrors = this.errors();

    if (explicitError !== undefined) {
      return explicitError;
    }
    if (errorText) {
      return true;
    }
    if (state === 'error') {
      return true;
    }
    if (signalFormsInvalid) {
      return true;
    }
    return signalFormsErrors.length > 0 && this.isTouched();
  });

  readonly errorMessage = computed(() => {
    const errorText = this.errorText();
    const signalFormsErrors = this.errors();

    if (errorText) {
      return errorText;
    }

    if (signalFormsErrors.length > 0 && this.isTouched()) {
      const firstError = signalFormsErrors[0];
      if ('message' in firstError && typeof firstError.message === 'string') {
        return firstError.message;
      }
    }

    return '';
  });

  readonly containerClass = computed(() => (this.bare() ? 'contents' : fieldContainerClass(this.isDisabled())));

  readonly labelClass = computed(() => fieldLabelClass(this.hasError()));

  private getSizeClass(isIcon: boolean): string {
    return fieldAdornmentClass(this.size(), isIcon);
  }

  private getTextPaddingClass(): string {
    return fieldTextPaddingClass(this.size());
  }

  readonly prefixClass = computed(() => {
    const hasIcon = !!this.leftIcon();
    const hasText = !!this.leftText();

    if (hasText && !hasIcon) {
      return ['flex', 'items-center', 'justify-center', 'flex-shrink-0', 'text-3', 'w-fit', this.getTextPaddingClass()].join(' ');
    }

    return ['flex', 'items-center', 'justify-center', 'flex-shrink-0', 'text-3', this.getSizeClass(hasIcon)].join(' ');
  });

  readonly suffixClass = computed(() => {
    const hasIcon = !!this.rightIcon();
    const hasText = !!this.rightText();
    if (hasText && !hasIcon) {
      return ['flex', 'items-center', 'justify-center', 'flex-shrink-0', 'text-3', 'w-fit', 'mr-2.5'].join(' ');
    }

    return ['flex', 'items-center', 'justify-center', 'flex-shrink-0', 'text-3', this.getSizeClass(hasIcon)].join(' ');
  });

  readonly inputClass = computed(() => {
    // Bare padding follows size() on oct-select's scale, so a shared shell keeps one height.
    const padding = this.bare() ? BARE_PADDING_BY_SIZE[this.size()] : 'p-2';
    const baseClasses = [
      'flex-1',
      'min-w-0',
      padding,
      'text-1',
      // 16px on phones: iOS Safari zooms the page into any focused field under 16px.
      'text-base',
      'sm:text-sm',
      'bg-transparent',
      'rounded-[calc(theme(borderRadius.lg)-1px)]', // 8px outer border radius, 1px inner border radius = 7px
      'border-none',
      'outline-none',
      'placeholder:text-3'
    ];

    if (this.isDisabled()) {
      baseClasses.push('disabled:text-disabled', 'cursor-not-allowed');
    }

    if (this.uppercase()) {
      // Only typed text is uppercased, not the placeholder.
      baseClasses.push('uppercase', 'placeholder:normal-case');
    }

    return baseClasses.join(' ');
  });

  readonly helperTextClass = computed(() => fieldHelperTextClass(this.hasError()));

  readonly displayHelperText = computed(() => (this.hasError() ? this.errorMessage() : this.helperText() || ''));

  readonly showPrefix = computed(() => !!this.leftIcon() || !!this.leftText());
  readonly showSuffix = computed(() => (!!this.rightIcon() || !!this.rightText()) && !(this.type() === 'password' && this.showPasswordToggle()));
  readonly showPasswordToggleButton = computed(() => this.type() === 'password' && this.showPasswordToggle());

  readonly inputWrapperClass = computed(() =>
    this.bare()
      ? 'flex items-center flex-1 min-w-0 bg-transparent border-none outline-none'
      : fieldShellClass({ hasError: this.hasError(), isDisabled: this.isDisabled() })
  );

  readonly passwordToggleClass = computed(() => {
    const classes = [
      'flex',
      'items-center',
      'justify-center',
      'flex-shrink-0',
      'text-3',
      'cursor-pointer',
      'hover:text-1',
      'transition-colors',
      this.getSizeClass(true)
    ];
    if (this.isDisabled()) classes.push('opacity-50', 'cursor-not-allowed');
    return classes.join(' ');
  });

  readonly clearButtonClass = computed(() => this.passwordToggleClass());

  readonly showClearButton = computed(() => this.clearable() && !!this.value() && !this.isDisabled() && !this.isReadonly());

  readonly iconSize = '!text-[16px] !w-4 !h-4';

  readonly passwordToggleIconName = computed(() => {
    return this.passwordVisible() ? 'EyeOff' : 'Eye';
  });

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target.value.trim();

    this.value.set(newValue);
    this.inputChange.emit(newValue);
  }

  handleFocus(event: FocusEvent): void {
    this.inputFocus.emit(event);
  }

  handleBlur(event: FocusEvent): void {
    const target = event.target as HTMLInputElement;
    const trimmedValue = target.value.trim();

    if (target.value !== trimmedValue) {
      target.value = trimmedValue;
      this.value.set(trimmedValue);
      this.inputChange.emit(trimmedValue);
    }

    this.isTouched.set(true);
    this.touch.emit();
    this.inputBlur.emit(event);
  }

  focus(): void {
    this.inputElement()?.nativeElement.focus();
  }

  blur(): void {
    this.inputElement()?.nativeElement.blur();
  }

  clear(): void {
    this.value.set('');
    this.inputChange.emit('');
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update(visible => !visible);
  }
}
