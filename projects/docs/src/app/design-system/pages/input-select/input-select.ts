import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { UpperCasePipe, TitleCasePipe } from '@angular/common';
import { disabled, form, required, validate } from '@angular/forms/signals';
import { ButtonComponent } from 'hr-ui';
import { CardComponent, CardContentComponent } from 'hr-ui';
import { CheckboxComponent } from 'hr-ui';
import { InputComponent } from 'hr-ui';
import { InputSelectComponent } from 'hr-ui';
import { SelectOption } from 'hr-ui';
import { TextComponent } from 'hr-ui';
import { FieldSize } from 'hr-ui';

/** The paired value the control edits. Both halves are strings, as the control requires. */
interface RateFormData {
  amount: string;
  rateType: string;
}

interface InputSelectConfig {
  label: string;
  placeholder: string;
  unitPlaceholder: string;
  helperText: string;
  size: FieldSize;
  state: 'default' | 'error' | 'disabled';
  required: boolean;
  disabled: boolean;
  hideHelper: boolean;
}

@Component({
  selector: 'oct-input-select-page',
  templateUrl: './input-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    CardComponent,
    CardContentComponent,
    CheckboxComponent,
    InputComponent,
    InputSelectComponent,
    TextComponent,
    TitleCasePipe,
    UpperCasePipe
  ]
})
export class InputSelectPageComponent {
  // ═══════════════════════════════════════════════════════════════════════════
  // The control takes TWO signal-forms fields rather than one composite value, so
  // every demo on this page needs a real form(). There is no non-form mode.
  // ═══════════════════════════════════════════════════════════════════════════

  readonly rateTypeOptions: SelectOption[] = [
    { value: 'WD', label: 'Workday' },
    { value: 'WR', label: 'Workday + rest day + PH' },
    { value: 'WD+PH', label: 'Workday + PH' },
    { value: 'CD', label: 'Calendar day' },
    { value: 'Daily', label: 'Daily' },
    { value: 'Hourly', label: 'Hourly' }
  ];

  readonly unitOptions: SelectOption[] = [
    { value: 'kg', label: 'Kilogram' },
    { value: 'g', label: 'Gram' },
    { value: 'bag', label: 'Bag' }
  ];

  // Declared before the form below, whose schema closure reads it.
  readonly config = signal<InputSelectConfig>({
    label: 'Pay Rate',
    placeholder: '0',
    unitPlaceholder: 'Basis',
    helperText: 'Amount and the basis it is paid on',
    size: 'md',
    state: 'default',
    required: false,
    disabled: false,
    hideHelper: false
  });

  /** Playground model. */
  readonly playgroundModel = signal<RateFormData>({ amount: '', rateType: '' });

  /**
   * Each half requires the other. That is the whole point of the pair: an amount with no basis
   * reads as "27,475 of what?", so it is refused rather than stored half-recorded.
   *
   * Required belongs to the FORM, like disabled: the control reads REQUIRED off the fields, so
   * the playground toggle has to write the rule the schema rather than a prop on the control.
   */
  readonly playgroundForm = form(this.playgroundModel, schemaPath => {
    required(schemaPath.amount, {
      when: ({ valueOf }) => this.config().required || !!valueOf(schemaPath.rateType).trim(),
      message: 'Enter an amount'
    });
    required(schemaPath.rateType, {
      when: ({ valueOf }) => this.config().required || !!valueOf(schemaPath.amount).trim(),
      message: 'Select a rate basis'
    });
    validate(schemaPath.amount, ({ value }) => this.amountError(value()));
    // Disabled belongs to the FORM, not to a prop on the control. The [formField] directive pushes it
    // into both halves, so the box and the controls agree.
    disabled(schemaPath, () => this.config().disabled);
  });

  // Example-section models, one per card so the cards do not fight over one value.
  readonly zeroModel = signal<RateFormData>({ amount: '0', rateType: 'CD' });
  readonly zeroForm = form(this.zeroModel);
  readonly quantityModel = signal<RateFormData>({ amount: '12', rateType: 'bag' });
  readonly quantityForm = form(this.quantityModel);

  private amountError(raw: string) {
    const value = (raw ?? '').trim();
    if (!value) return undefined;
    const parsed = Number(value.replace(/,/g, ''));
    if (!Number.isNaN(parsed) && parsed >= 0) return undefined;
    return { kind: 'custom', message: 'Enter a valid amount' };
  }

  updateConfig<K extends keyof InputSelectConfig>(key: K, value: InputSelectConfig[K]): void {
    this.config.update(cfg => ({ ...cfg, [key]: value }));
  }

  updateSize(size: string): void {
    this.updateConfig('size', size as FieldSize);
  }

  updateState(state: string): void {
    if (state === 'disabled') {
      this.config.update(cfg => ({ ...cfg, state: 'disabled', disabled: true }));
      return;
    }
    if (state === 'error') {
      // The error state is real, not styling: fill the amount, clear the basis and touch it, so
      // the control's own atomic rule fires.
      this.config.update(cfg => ({ ...cfg, state: 'error', disabled: false }));
      this.playgroundModel.set({ amount: '27475', rateType: '' });
      this.playgroundForm.rateType().markAsTouched();
      return;
    }
    this.config.update(cfg => ({ ...cfg, state: 'default', disabled: false }));
    this.playgroundModel.set({ amount: '', rateType: '' });
  }

  applyPreset(preset: string): void {
    switch (preset) {
      case 'default':
        this.config.set({
          label: 'Pay Rate',
          placeholder: '0',
          unitPlaceholder: 'Basis',
          helperText: 'Amount and the basis it is paid on',
          size: 'md',
          state: 'default',
          required: false,
          disabled: false,
          hideHelper: false
        });
        this.playgroundModel.set({ amount: '', rateType: '' });
        break;
      case 'filled':
        this.config.update(cfg => ({ ...cfg, state: 'default', disabled: false }));
        this.playgroundModel.set({ amount: '27475', rateType: 'WD+PH' });
        break;
      case 'withError':
        this.updateState('error');
        break;
      case 'disabled':
        this.updateState('disabled');
        break;
    }
  }
}
