import { Component, ChangeDetectionStrategy, computed, model, input, output, viewChild, ElementRef, linkedSignal } from '@angular/core';
import { FormCheckboxControl, ValidationError, DisabledReason } from '@angular/forms/signals';
import { TextComponent } from '../text/text';

export type SwitchColor = 'primary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';

/**
 * Angular Signal Forms Switch Component
 *
 * @example
 * ```typescript
 * formModel = signal({ enabled: false });
 * myForm = form(this.formModel, (f) => {});
 * ```
 * ```html
 * <oct-switch [formField]="myForm.enabled" label="Enable feature" />
 * ```
 *
 * Legacy usage (without Signal Forms):
 * ```html
 * <oct-switch [checked]="isEnabled()" (switchChange)="onToggle($event)" label="Enable" />
 * ```
 */
@Component({
  selector: 'oct-switch',
  templateUrl: './switch.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextComponent]
})
export class SwitchComponent implements FormCheckboxControl {
  // FormCheckboxControl
  readonly checked = model<boolean>(false);

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

  // FormUiControl - Availability State
  readonly disabled = input<boolean>(false);
  readonly disabledReasons = input<readonly DisabledReason[]>([]);

  // FormUiControl - Constraints
  readonly required = input<boolean>(false);

  // Component Inputs
  readonly label = input<string>();
  readonly id = input<string>();
  readonly name = input<string>();
  readonly color = input<SwitchColor>('primary');

  // Outputs
  readonly switchChange = output<boolean>();
  readonly switchFocus = output<FocusEvent>();
  readonly switchBlur = output<FocusEvent>();

  // Legacy Inputs (prefer [formField] directive for Signal Forms)
  readonly error = input<boolean>();
  readonly errorText = input<string>();

  // Internal
  private readonly uniqueId = `switch-${Math.random().toString(36).substring(2, 11)}`;
  readonly switchButton = viewChild.required<ElementRef<HTMLButtonElement>>('switchButton');

  // Computed
  readonly computedId = computed(() => this.id() || this.uniqueId);

  readonly computedDisabled = computed(() => this.disabled());

  readonly computedChecked = computed(() => this.checked());

  readonly hasError = computed(() => {
    const manualError = this.error();
    if (manualError !== undefined) return manualError;
    return this.invalid() && this.isTouched();
  });

  readonly effectiveErrorMessage = computed(() => {
    const manualErrorText = this.errorText();
    if (manualErrorText) return manualErrorText;
    const errs = this.errors();
    return errs.length > 0 ? errs[0].message : '';
  });

  readonly isRequired = computed(() => this.required());

  readonly containerClass = computed(() => {
    const baseClasses = ['inline-flex', 'items-center', 'gap-3'];

    // Exclusive: cursor-pointer and cursor-not-allowed on one element resolve by
    // stylesheet order, not by the order they appear in this list.
    if (this.computedDisabled()) {
      baseClasses.push('opacity-50', 'cursor-not-allowed');
    } else if (this.label()) {
      baseClasses.push('cursor-pointer');
    }

    return baseClasses.join(' ');
  });

  readonly switchTrackClass = computed(() => {
    const baseClasses = [
      'relative',
      'inline-flex',
      'items-center',
      'shrink-0',
      'w-[44px]',
      'h-[24px]',
      'rounded-full',
      'p-[2px]',

      'transition-all',
      'duration-300',
      'ease-in-out',

      'focus-visible:outline-none',
      'focus-visible:outline-2',
      'focus-visible:outline-offset-2',

      'cursor-pointer'
    ];

    const colorClasses: Record<SwitchColor, { on: string; off: string; focus: string }> = {
      primary: { on: 'bg-primary-600', off: 'bg-neutral-800', focus: 'focus-visible:outline-blue-500' },
      success: { on: 'bg-green-600', off: 'bg-neutral-800', focus: 'focus-visible:outline-green-500' },
      error: { on: 'bg-red-600', off: 'bg-neutral-800', focus: 'focus-visible:outline-red-500' },
      warning: { on: 'bg-orange-600', off: 'bg-neutral-800', focus: 'focus-visible:outline-amber-500' },
      info: { on: 'bg-blue-600', off: 'bg-neutral-800', focus: 'focus-visible:outline-sky-500' },
      neutral: { on: 'bg-neutral-600', off: 'bg-neutral-800', focus: 'focus-visible:outline-neutral-500' }
    };

    const selectedColor = colorClasses[this.color()];

    if (this.computedChecked()) {
      baseClasses.push(selectedColor.on);
    } else {
      baseClasses.push(selectedColor.off);
    }

    if (this.hasError()) {
      baseClasses.push('!outline-red-500', 'focus-visible:!outline-red-500');
    } else {
      baseClasses.push(selectedColor.focus);
    }

    if (this.computedDisabled()) {
      baseClasses.push('cursor-not-allowed');
    }

    return baseClasses.join(' ');
  });

  readonly switchHandleClass = computed(() => {
    const baseClasses = [
      'block',
      'size-[20px]',
      'rounded-full',
      'bg-white',
      'shadow-sm',
      'transition-transform',
      'duration-300',
      'ease-in-out',

      this.computedChecked() ? 'translate-x-[20px]' : 'translate-x-0'
    ];

    return baseClasses.join(' ');
  });

  readonly labelClass = computed(() => {
    const baseClasses = ['text-sm', 'select-none'];

    if (this.computedDisabled()) {
      baseClasses.push('text-neutral-600', 'cursor-not-allowed');
    } else {
      baseClasses.push('text-1', 'cursor-pointer');
    }

    return baseClasses.join(' ');
  });

  // Event Handlers
  onSwitchClick(): void {
    if (this.computedDisabled()) return;
    const newValue = !this.computedChecked();
    this.checked.set(newValue);
    this.switchChange.emit(newValue);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.computedDisabled()) return;
    if (event.code === 'Space' || event.code === 'Enter') {
      event.preventDefault();
      this.onSwitchClick();
    }
  }

  onFocus(): void {
    if (this.computedDisabled()) return;
    this.switchFocus.emit(new FocusEvent('focus'));
  }

  onBlur(): void {
    this.isTouched.set(true);
    this.touch.emit();
    this.switchBlur.emit(new FocusEvent('blur'));
  }

  // Public Methods
  focus(): void {
    this.switchButton()?.nativeElement.focus();
  }

  blur(): void {
    this.switchButton()?.nativeElement.blur();
  }
}
