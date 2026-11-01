import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { ButtonComponent } from 'ngx-hr-ui';
import { CardComponent, CardContentComponent, CardHeaderComponent, CardFooterComponent } from 'ngx-hr-ui';
import { CheckboxComponent } from 'ngx-hr-ui';
import { InputComponent } from 'ngx-hr-ui';
import { SelectComponent, SelectOption } from 'ngx-hr-ui';
import { TextComponent } from 'ngx-hr-ui';

interface SelectConfig {
  value: string | number | null;
  placeholder: string;
  label: string;
  size: 'sm' | 'md' | 'lg';
  clearable: boolean;
  disabled: boolean;
  error: boolean;
  errorMessage: string;
  showIcon: boolean;
  required: boolean;
  multiple: boolean;
  loading: boolean;
  maxHeight: string;
  virtualScrolling: boolean;
}

@Component({
  selector: 'oct-select-page',
  templateUrl: './select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SelectComponent,
    ButtonComponent,
    TextComponent,
    InputComponent,
    CheckboxComponent,
    CardComponent,
    CardContentComponent,
    CardHeaderComponent,
    CardFooterComponent,
    UpperCasePipe
  ]
})
export class SelectPageComponent {
  // Signal Forms Example State
  readonly signalFormsValue = signal<string | number | null>(null);
  readonly signalFormsTouched = signal(false);
  readonly signalFormsErrors = signal<readonly { message: string }[]>([]);

  readonly signalFormsHasError = computed(() => this.signalFormsTouched() && this.signalFormsErrors().length > 0);

  // Sample options for the select
  readonly fruitOptions: SelectOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'blueberry', label: 'Blueberry' },
    { value: 'grapes', label: 'Grapes' },
    { value: 'pineapple', label: 'Pineapple' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'watermelon', label: 'Watermelon' },
    { value: 'mango', label: 'Mango' },
    { value: 'orange', label: 'Orange' },
    { value: 'peach', label: 'Peach' }
  ];

  readonly countryOptions: SelectOption[] = [
    { value: 'au', label: 'Australia', icon: 'Flag' },
    { value: 'br', label: 'Brazil', icon: 'Flag' },
    { value: 'ca', label: 'Canada', icon: 'Flag' },
    { value: 'cn', label: 'China', icon: 'Flag' },
    { value: 'fr', label: 'France', icon: 'Flag' },
    { value: 'de', label: 'Germany', icon: 'Flag' },
    { value: 'in', label: 'India', icon: 'Flag' },
    { value: 'it', label: 'Italy', icon: 'Flag' },
    { value: 'jp', label: 'Japan', icon: 'Flag' },
    { value: 'mx', label: 'Mexico', icon: 'Flag' },
    { value: 'nl', label: 'Netherlands', icon: 'Flag' },
    { value: 'sg', label: 'Singapore', icon: 'Flag' },
    { value: 'kr', label: 'South Korea', icon: 'Flag' },
    { value: 'es', label: 'Spain', icon: 'Flag' },
    { value: 'se', label: 'Sweden', icon: 'Flag' },
    { value: 'ch', label: 'Switzerland', icon: 'Flag' },
    { value: 'tw', label: 'Taiwan', icon: 'Flag' },
    { value: 'th', label: 'Thailand', icon: 'Flag' },
    { value: 'uk', label: 'United Kingdom', icon: 'Flag' },
    { value: 'us', label: 'United States', icon: 'Flag' }
  ];

  readonly statusOptions: SelectOption[] = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'archived', label: 'Archived', disabled: true }
  ];

  readonly roleOptions: SelectOption[] = [
    { value: 'admin', label: 'Administrator' },
    { value: 'user', label: 'User' },
    { value: 'manager', label: 'Manager' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' }
  ];

  // Large dataset for virtual scrolling demo
  readonly largeDataset: SelectOption[] = Array.from({ length: 1000 }, (_, i) => ({
    value: `item-${i}`,
    label: `Item ${i + 1} - ${this.getRandomLabel()}`
  }));

  // Interactive Playground Configuration
  readonly config = signal<SelectConfig>({
    value: null,
    placeholder: 'Select a fruit',
    label: 'Fruits',
    size: 'lg',
    clearable: false,
    disabled: false,
    error: false,
    errorMessage: 'Please select a valid option',
    showIcon: true,
    required: false,
    multiple: false,
    loading: false,
    maxHeight: '240px',
    virtualScrolling: false
  });

  // Selected options for different examples
  selectedFruit = signal<string | number | null>(null);
  selectedCountry = signal<string | number | null>(null);
  selectedStatus = signal<string | number | null>('active');
  selectedLargeItem = signal<string | number | null>(null);

  // Loading state demo
  loadingDemoValue = signal<string | number | null>(null);
  loadingDemoLoading = signal(false);

  // Multiple selection example - Basic (no pre-selected values)
  basicMultipleFruits = signal<(string | number)[]>([]);
  basicMultipleCountries = signal<(string | number)[]>([]);
  // Multiple selection example - Pre-selected values demo
  selectedFruits = signal<(string | number)[]>(['apple', 'banana']);
  selectedCountries = signal<(string | number)[]>(['us', 'uk', 'jp', 'au']);

  // Playground display mode
  readonly playgroundMode = signal<'interactive' | 'signalForms'>('interactive');

  // Computed code generation
  readonly generatedCode = computed(() => {
    const cfg = this.config();
    const props: string[] = [];

    props.push(`  [options]="fruitOptions"`);
    if (cfg.value !== null) {
      props.push(`  [(value)]="selectedValue"`);
    }
    if (cfg.placeholder) {
      props.push(`  placeholder="${cfg.placeholder}"`);
    }
    if (cfg.label) {
      props.push(`  label="${cfg.label}"`);
    }
    if (cfg.size !== 'lg') {
      props.push(`  size="${cfg.size}"`);
    }
    if (cfg.clearable) {
      props.push(`  [clearable]="true"`);
    }
    if (cfg.disabled) {
      props.push(`  [disabled]="true"`);
    }
    if (cfg.error) {
      props.push(`  [error]="true"`);
      if (cfg.errorMessage) {
        props.push(`  errorText="${cfg.errorMessage}"`);
      }
    }
    if (!cfg.showIcon) {
      props.push(`  [showIcon]="false"`);
    }
    if (cfg.required) {
      props.push(`  [required]="true"`);
    }
    if (cfg.multiple) {
      props.push(`  [multiple]="true"`);
    }
    if (cfg.loading) {
      props.push(`  [loading]="true"`);
    }
    if (cfg.maxHeight !== '240px') {
      props.push(`  maxHeight="${cfg.maxHeight}"`);
    }
    if (cfg.virtualScrolling) {
      props.push(`  [virtualScrolling]="true"`);
    }

    return `<oct-select\n${props.join('\n')}\n  (selectChange)="onValueChange($event)">\n</oct-select>`;
  });

  private getRandomLabel(): string {
    const adjectives = ['Amazing', 'Brilliant', 'Creative', 'Dynamic', 'Elegant'];
    const nouns = ['Product', 'Service', 'Solution', 'Package', 'Bundle'];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
  }

  updateConfig<K extends keyof SelectConfig>(key: K, value: SelectConfig[K]): void {
    this.config.update(cfg => {
      const newConfig = { ...cfg, [key]: value };

      // When clearable is enabled and no value is selected, set a default value to show the clear button
      if (key === 'clearable' && value === true && !newConfig.value) {
        newConfig.value = 'apple';
      }

      return newConfig;
    });
  }

  updateSize(size: string): void {
    this.updateConfig('size', size as 'sm' | 'md' | 'lg');
  }

  applyPreset(preset: string): void {
    // Reset playground mode for non-form presets
    if (preset !== 'signalForms') {
      this.playgroundMode.set('interactive');
    }

    switch (preset) {
      case 'default':
        this.config.set({
          value: null,
          placeholder: 'Select an option',
          label: 'Label',
          size: 'lg',
          clearable: false,
          disabled: false,
          error: false,
          errorMessage: '',
          showIcon: true,
          required: false,
          multiple: false,
          loading: false,
          maxHeight: '240px',
          virtualScrolling: false
        });
        break;
      case 'withError':
        this.config.update(cfg => ({
          ...cfg,
          error: true,
          errorMessage: 'This field is required',
          required: true
        }));
        break;
      case 'disabled':
        this.config.update(cfg => ({
          ...cfg,
          disabled: true,
          value: 'apple',
          label: 'Disabled Select'
        }));
        break;
      case 'loading':
        this.config.update(cfg => ({
          ...cfg,
          loading: true,
          label: 'Loading Select'
        }));
        break;
      case 'signalForms':
        this.playgroundMode.set('signalForms');
        this.signalFormsValue.set(null);
        this.signalFormsTouched.set(false);
        this.signalFormsErrors.set([]);
        break;
    }
  }

  generateImportCode(): string {
    return `import { Component, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { SelectComponent, SelectOption } from 'ngx-hr-ui';

@Component({
  selector: 'oct-select-form',
  template: \`
    <form novalidate (submit)="onSubmit($event)">
      <oct-select
        [formField]="selectForm.selection"
        [options]="options"
        label="Select Option"
        placeholder="Choose an option" />

      <button type="submit">Submit</button>
    </form>
  \`,
  imports: [FormField, SelectComponent]
})
export class SelectFormComponent {
  readonly formModel = signal<{ selection: string | null }>({ selection: null });
  readonly selectForm = form(this.formModel, schemaPath => required(schemaPath.selection));

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.selectForm.selection().valid()) {
      console.log('Form submitted:', this.formModel());
    }
  }
}`;
  }

  generateSignalFormsCode(): string {
    return `// Signal Forms integration
// The SelectComponent implements FormValueControl<T> interface

import { Component, signal } from '@angular/core';
import { SelectComponent, SelectOption } from 'ngx-hr-ui';

@Component({
  selector: 'oct-signal-forms-example',
  template: \`
    <!-- Signal Forms uses direct signal bindings -->
    <oct-select
      [options]="options"
      [(value)]="selectedValue"
      [touched]="touched()"
      (touch)="touched.set(true)"
      [errors]="errors()"
      [invalid]="hasError()"
      label="Signal Forms Select"
      placeholder="Choose an option">
    </oct-select>

    <!-- Manual validation example -->
    <button (click)="validate()">Validate</button>
  \`,
  imports: [SelectComponent]
})
export class SignalFormsExample {
  readonly options: SelectOption[] = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' }
  ];

  // Signal Forms state management
  readonly selectedValue = signal<string | number | null>(null);
  readonly touched = signal(false);
  readonly errors = signal<readonly { message: string }[]>([]);

  readonly hasError = computed(() =>
    this.touched() && this.errors().length > 0
  );

  validate(): void {
    this.touched.set(true);
    if (this.selectedValue() === null) {
      this.errors.set([{ message: 'Please select an option' }]);
    } else {
      this.errors.set([]);
    }
  }
}`;
  }

  generateTypesCode(): string {
    return `// Select Option Interface
interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: string;
}

// Component implements FormValueControl<T> for Signal Forms
interface SelectProps {
  // Required
  options: SelectOption[];

  // Value binding
  value: string | number | null;  // Two-way binding with model()

  // Signal Forms Integration (FormValueControl<T>)
  errors: readonly ValidationError[];  // Validation errors array
  touched: boolean;                    // Input; the control emits (touch) on blur
  dirty: boolean;                      // Form dirty state
  pending: boolean;                    // Async validation pending
  invalid: boolean;                    // Overall invalid state
  disabled: boolean;                   // Disabled state
  required: boolean;                   // Required validation

  // Display Properties
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorText?: string;              // Manual error message override
  error?: boolean;                 // Manual error state override

  // Appearance
  size?: 'sm' | 'md' | 'lg';       // Default: 'md'
  fullWidth?: boolean;             // Default: false
  showIcon?: boolean;              // Default: true
  hideHelper?: boolean;            // Default: false

  // Behavior
  clearable?: boolean;             // Default: false
  multiple?: boolean;              // Default: false
  loading?: boolean;               // Default: false
  maxDisplay?: number;             // Max badges in multiple mode
  maxHeight?: string;              // Default: '240px'
  showScrollIndicators?: boolean;  // Default: true

  // Performance
  virtualScrolling?: boolean;      // Default: false
  itemSize?: number;               // Default: 40 (for virtual scroll)
}

// Events
interface SelectEvents {
  selectChange: string | number | null | (string | number)[];
  selectionChange: SelectOption | SelectOption[] | null;
  selectFocus: FocusEvent;
  selectBlur: FocusEvent;
}`;
  }

  getDisplayCode(): string {
    const mode = this.playgroundMode();
    if (mode === 'signalForms') {
      return `<!-- Signal Forms -->
<oct-select
  [options]="fruitOptions"
  [(value)]="signalFormsValue"
  [touched]="signalFormsTouched()"
  (touch)="signalFormsTouched.set(true)"
  [errors]="signalFormsErrors()"
  [invalid]="signalFormsHasError()"
  label="Signal Forms Select"
  placeholder="Select a fruit"
  [required]="true">
</oct-select>

<!-- Validation on blur/submit -->
<button (click)="validateSignalForms()">Validate</button>`;
    }

    return this.generatedCode();
  }

  onInteractiveValueChange(value: string | number | null): void {
    this.config.update(cfg => {
      const shouldClearError = value !== null && value !== undefined;
      return {
        ...cfg,
        value,
        error: shouldClearError ? false : cfg.error
      };
    });
  }

  onFruitChange(value: string | number | null): void {
    this.selectedFruit.set(value);
  }

  onCountryChange(value: string | number | null): void {
    this.selectedCountry.set(value);
  }

  onStatusChange(value: string | number | null): void {
    this.selectedStatus.set(value);
  }

  onLargeItemChange(value: string | number | null): void {
    this.selectedLargeItem.set(value);
  }

  onMultipleFruitsChange(values: (string | number)[] | string | number | null): void {
    if (Array.isArray(values)) {
      this.basicMultipleFruits.set(values);
    }
  }

  onMultipleCountriesChange(values: (string | number)[] | string | number | null): void {
    if (Array.isArray(values)) {
      this.basicMultipleCountries.set(values);
    }
  }

  // Signal Forms validation
  onSignalFormsChange(value: string | number | null): void {
    this.signalFormsValue.set(value);
    // Clear errors when value changes
    if (value !== null) {
      this.signalFormsErrors.set([]);
    }
  }

  onSignalFormsTouchedChange(touched: boolean): void {
    this.signalFormsTouched.set(touched);
    // Validate on blur
    if (touched) {
      this.validateSignalForms();
    }
  }

  validateSignalForms(): void {
    this.signalFormsTouched.set(true);
    if (this.signalFormsValue() === null) {
      this.signalFormsErrors.set([{ message: 'Please select a fruit' }]);
    } else {
      this.signalFormsErrors.set([]);
    }
  }

  // Loading demo
  simulateLoading(): void {
    this.loadingDemoLoading.set(true);
    this.loadingDemoValue.set(null);

    setTimeout(() => {
      this.loadingDemoLoading.set(false);
    }, 2000);
  }
}
