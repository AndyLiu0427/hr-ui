import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { FormField, FieldTree, REQUIRED } from '@angular/forms/signals';

import {
  fieldContainerClass,
  fieldDividerClass,
  fieldHelperTextClass,
  fieldLabelClass,
  fieldShellClass,
  FieldSize
} from '../form/field-shell';
import { InputComponent, InputType } from '../input/input';
import { SelectComponent, SelectOption } from '../select/select';
import { TextComponent } from '../text/text';

/*
 * An amount and the unit it is measured in, as ONE control: `[ 27475 | WD+PH v ]`.
 *
 * Two signal-forms fields, not one composite value. That is the idiom everywhere else in this app
 * (see pay-terms-dialog), it keeps per-field `required`/`validate` working, and a composite
 * FormValueControl would have to hand-compose its own error routing.
 *
 * This component owns the box, the label and the ONE helper row; both children run `bare` so they
 * contribute no border, no label and no helper row of their own. Rendering two helper rows would
 * make the control 20px taller than the plain field beside it in a form grid, which is what
 * misaligns their borders.
 */
/**
 * An amount and its unit in one field, such as a notice period of 3 months.
 * Bind each half to its own signal-forms field with amountField and unitField.
 */
@Component({
  selector: 'oct-input-select',
  templateUrl: './input-select.html',
  imports: [FormField, InputComponent, SelectComponent, TextComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputSelectComponent {
  /** The numeric half. Its id carries the label, because it is what the operator types into. */
  readonly amountField = input.required<FieldTree<string>>();
  /** The unit half. */
  readonly unitField = input.required<FieldTree<string>>();
  /** Units to pick from. */
  readonly unitOptions = input<SelectOption[]>([]);

  /** Text of the label above the field. The unit is named after it too. */
  readonly label = input<string>();
  /** Hint in the amount half while it is empty. */
  readonly placeholder = input<string>('');
  /** Text in the unit half while no unit is picked. */
  readonly unitPlaceholder = input<string>('');
  /** Text under the field. An error message replaces it. */
  readonly helperText = input<string>();
  /** Height of the field. */
  readonly size = input<FieldSize>('md');
  /** Removes the row under the field that holds the helper and error text. */
  readonly hideHelper = input<boolean>(false);

  /**
   * `text` with a decimal inputmode, never `type="number"`.
   *
   * A number input refuses the decimal separator on some locale keyboards, offers a spinner that
   * means nothing for money, and renders an unparseable stored value as an empty box — which
   * hides the value the operator is being asked to correct.
   */
  readonly amountType: InputType = 'text';
  readonly amountInputMode = 'decimal';
  readonly amountPattern = '[0-9]*[.,]?[0-9]*';

  readonly amountId = computed(() => `input-select-${this.instance}-amount`);
  private readonly instance = Math.random().toString(36).substring(2, 9);

  private readonly amountState = computed(() => this.amountField()());
  private readonly unitState = computed(() => this.unitField()());

  /**
   * One error state for the pair, because the pair is one value.
   *
   * ANY invalid AND ANY touched, not per-field. oct-input marks touched on blur while oct-select
   * only marks it when its dropdown closes after opening, so typing an amount and tabbing straight
   * past the unit leaves the unit untouched — a per-field rule would show no error at all and the
   * save would be rejected with nothing on screen to explain it.
   */
  readonly hasError = computed(() => {
    const amount = this.amountState();
    const unit = this.unitState();
    const anyInvalid = amount.invalid() || unit.invalid();
    const anyTouched = amount.touched() || unit.touched();
    return anyInvalid && anyTouched;
  });

  /** Reading order decides precedence: the amount comes first, so its message wins. */
  readonly errorMessage = computed(() => {
    if (!this.hasError()) return '';
    for (const state of [this.amountState(), this.unitState()]) {
      const [first] = state.errors();
      if (first && 'message' in first && typeof first.message === 'string') {
        return first.message;
      }
    }
    return '';
  });

  /**
   * Read from the FIELDS, never from a local flag.
   *
   * There is deliberately no `disabled` input. Signal-forms forbids binding [disabled] beside
   * [formField], so a shell-level flag could shade the box without disabling either control - a
   * border that lies. Callers disable via `disabled(schemaPath, ...)` in the form schema, which
   * is what every other form in this app already does, and the [formField] directive then disables
   * both halves for real.
   */
  readonly isDisabled = computed(() => this.amountState().disabled() || this.unitState().disabled());

  /**
   * Read from the FIELDS too, for the same reason as isDisabled.
   *
   * The `Field` directive fills a FormValueControl's own `required` input automatically, which
   * is how oct-input gets its asterisk — but this component is not one control, it is a shell
   * around two, so nothing fills it here. Reading REQUIRED off the fields means the schema is
   * the only place a rule is written, and a conditional `required` flips the asterisk with it
   * instead of leaving a caller's static flag lying.
   */
  readonly isRequired = computed(() => (this.amountState().metadata(REQUIRED)?.() ?? false) || (this.unitState().metadata(REQUIRED)?.() ?? false));

  /**
   * Which half has the keyboard, which `focus-within` on the shell cannot express.
   *
   * The shell was already highlighting around the amount input, The unit highlights its own box instead, and the shell
   * stands down while it does - see fieldShellClass.
   */
  readonly unitFocused = signal(false);

  readonly containerClass = computed(() => fieldContainerClass(this.isDisabled()));
  readonly labelClass = computed(() => fieldLabelClass(this.hasError()));
  readonly helperTextClass = computed(() => fieldHelperTextClass(this.hasError()));
  readonly shellClass = computed(() =>
    fieldShellClass({ hasError: this.hasError(), isDisabled: this.isDisabled(), suppressFocusRing: this.unitFocused() })
  );
  readonly dividerClass = fieldDividerClass;

  readonly displayHelperText = computed(() => (this.hasError() ? this.errorMessage() : this.helperText() || ''));

  /** Names the unit control for a screen reader, since the visible label belongs to the amount. */
  readonly unitAriaLabel = computed(() => {
    const label = this.label();
    return label ? `${label} unit` : 'Unit';
  });

  /**
   * Tall enough that the option list never sits exactly on its own cap.
   *
   * Six options at the default 40px item size measure exactly 240px, which is also the default
   * maxHeight — a boundary where whether it scrolls comes down to sub-pixel padding.
   */
  readonly unitMaxHeight = computed(() => `${this.unitOptions().length * 40 + 24}px`);

  /** A trigger sized to "WD+PH" is narrower than "Workday + PH", so the panel needs a floor. */
  readonly unitOverlayMinWidth = 224;
}
