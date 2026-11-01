import { Component, ChangeDetectionStrategy, signal, computed, effect, linkedSignal, viewChildren } from '@angular/core';
import { JsonPipe, UpperCasePipe, TitleCasePipe } from '@angular/common';
// ═══════════════════════════════════════════════════════════════════════════
// OFFICIAL ANGULAR 21 SIGNAL FORMS - @angular/forms/signals
// ═══════════════════════════════════════════════════════════════════════════
// This demonstrates the OFFICIAL Angular Signal Forms API (stable since v22)
//
// Key Concepts:
// - form(modelSignal, schemaFn): Creates field tree with validation
// - [formField] directive: Two-way binding for components implementing FormValueControl
// - Built-in validators: required(), email(), minLength(), maxLength(), pattern()
// - Field state signals: valid(), touched(), dirty(), errors()
// ═══════════════════════════════════════════════════════════════════════════
import { form, required, email, minLength, maxLength, pattern, FormField } from '@angular/forms/signals';
import { InputComponent, InputSize, InputType, InputState } from 'hr-ui';
import { ButtonComponent } from 'hr-ui';
import { CardComponent, CardContentComponent, CardFooterComponent, CardHeaderComponent } from 'hr-ui';
import { CheckboxComponent } from 'hr-ui';
import { SelectComponent, SelectOption } from 'hr-ui';
import { TextComponent } from 'hr-ui';

/** Form data structure for Signal Forms demo */
interface SignalFormData {
  name: string;
  email: string;
  phone: string;
  searchTerm: string;
}

/** A value the browser accepts for that input type — 'Sample text' is not a legal date. */
function samplePlaygroundValue(type: InputType): string {
  switch (type) {
    case 'date':
      return '2026-04-01';
    case 'number':
      return '42';
    case 'email':
      return 'name@example.com';
    case 'tel':
      return '+85298765432';
    case 'url':
      return 'https://example.com';
    default:
      return 'Sample text';
  }
}

interface InputConfig {
  label: string;
  placeholder: string;
  helperText: string;
  errorText: string;
  type: InputType;
  size: InputSize;
  state: InputState;
  required: boolean;
  disabled: boolean;
  leftIcon?: string;
  rightIcon?: string;
  showPasswordToggle: boolean;
  clearable: boolean;
}

@Component({
  selector: 'oct-input-page',
  templateUrl: './input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    InputComponent,
    ButtonComponent,
    TextComponent,
    SelectComponent,
    CheckboxComponent,
    CardComponent,
    CardContentComponent,
    CardHeaderComponent,
    CardFooterComponent,
    FormField,
    TitleCasePipe,
    UpperCasePipe
  ]
})
export class InputPageComponent {
  readonly inputComponents = viewChildren(InputComponent);

  // ═══════════════════════════════════════════════════════════════════════════
  // OFFICIAL ANGULAR 21 SIGNAL FORMS - @angular/forms/signals
  // ═══════════════════════════════════════════════════════════════════════════
  // Using the official form() function and [formField] directive
  // Benefits:
  // - Official Angular API (stable since v22)
  // - Built-in validators: required(), email(), minLength(), etc.
  // - Automatic state tracking: touched(), dirty(), valid(), errors()
  // - Two-way binding via [formField] directive

  /** Form model signal - stores the actual form data */
  readonly formModel = signal<SignalFormData>({
    name: '',
    email: '',
    phone: '',
    searchTerm: ''
  });

  /** Form field tree with validation using official Signal Forms API */
  readonly signalForm = form(this.formModel, schemaPath => {
    // Name field: required, min 3 chars, max 50 chars
    required(schemaPath.name, { message: 'Name is required' });
    minLength(schemaPath.name, 3, { message: 'Name must be at least 3 characters' });
    maxLength(schemaPath.name, 50, { message: 'Name must not exceed 50 characters' });

    // Email field: required, valid email format
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Invalid email format' });

    // Phone field: optional, but if provided must match pattern
    pattern(schemaPath.phone, /^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone format' });
  });

  // Computed form-level state (derived from official field states)
  readonly formValid = computed(() => this.signalForm.name().valid() && this.signalForm.email().valid() && this.signalForm.phone().valid());

  readonly formTouched = computed(() => this.signalForm.name().touched() || this.signalForm.email().touched() || this.signalForm.phone().touched());

  readonly formDirty = computed(
    () => this.signalForm.name().dirty() || this.signalForm.email().dirty() || this.signalForm.phone().dirty() || this.signalForm.searchTerm().dirty()
  );

  // Check if required fields are filled
  readonly hasRequiredFields = computed(() => {
    const data = this.formModel();
    return data.name.trim().length > 0 && data.email.trim().length > 0;
  });

  // Form status indicators for the demo panel
  readonly formStatusIndicators = computed(() => [
    {
      label: 'Required fields filled',
      value: this.hasRequiredFields(),
      display: this.hasRequiredFields() ? 'Yes' : 'No',
      type: this.hasRequiredFields() ? 'success' : 'warning'
    },
    {
      label: 'Form valid',
      value: this.formValid(),
      display: this.formValid() ? 'Yes' : 'No',
      type: this.formValid() ? 'success' : 'error'
    },
    {
      label: 'Touched',
      value: this.formTouched(),
      display: this.formTouched() ? 'Yes' : 'No',
      type: 'info'
    },
    {
      label: 'Modified',
      value: this.formDirty(),
      display: this.formDirty() ? 'Yes' : 'No',
      type: 'warning'
    }
  ]);

  readonly formSubmitted = signal(false);
  readonly formData = signal<SignalFormData | null>(null);

  constructor() {
    // Initialize with default preset to ensure interactive mode is properly set up
    this.applyPreset('default');

    // Auto-reset form submitted state when form data changes
    effect(() => {
      // Track form model changes
      this.formModel();
      // Reset submitted state when any value changes
      if (this.formSubmitted()) {
        this.formSubmitted.set(false);
      }
    });
  }

  // Interactive Playground Configuration
  readonly config = signal<InputConfig>({
    label: 'Demo Input',
    placeholder: 'Type something...',
    helperText: 'This is helper text',
    errorText: 'This field has an error',
    type: 'text',
    size: 'md',
    state: 'default',
    required: false,
    disabled: false,
    leftIcon: undefined,
    rightIcon: undefined,
    showPasswordToggle: false,
    clearable: false
  });

  /**
   * The playground field starts filled, and refills when the type changes: the clear control
   * renders only on a field that holds a value, so an empty playground can never show it.
   * Clearing it is what reveals the placeholder.
   */
  readonly playgroundValue = linkedSignal(() => samplePlaygroundValue(this.config().type));

  /** Pre-filled so the Clearable example shows the X on first paint. */
  readonly clearableDate = signal('2026-04-01');
  readonly requiredDate = signal('2026-04-01');

  // Playground display mode
  readonly playgroundMode = signal<'interactive' | 'signalForm'>('interactive');

  // Options for dropdowns
  readonly inputTypeOptions: SelectOption[] = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'password', label: 'Password' },
    { value: 'search', label: 'Search' },
    { value: 'tel', label: 'Phone' },
    { value: 'url', label: 'URL' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' }
  ];

  // Values are lucide keys, which is what oct-icon takes and what the generated snippet pastes.
  readonly leftIconOptions: SelectOption[] = [
    { value: 'Mail', label: 'Mail' },
    { value: 'User', label: 'User' },
    { value: 'Search', label: 'Search' },
    { value: 'Phone', label: 'Phone' },
    { value: 'Lock', label: 'Lock' },
    { value: 'DollarSign', label: 'DollarSign' },
    { value: 'Check', label: 'Check' },
    { value: 'CircleAlert', label: 'CircleAlert' }
  ];

  readonly rightIconOptions: SelectOption[] = [
    { value: 'Check', label: 'Check' },
    { value: 'CircleAlert', label: 'CircleAlert' }
  ];

  // Computed code generation for interactive mode
  readonly generatedCode = computed(() => {
    const cfg = this.config();
    const props: string[] = [];

    // Basic required props
    if (cfg.label) {
      props.push(`  label="${cfg.label}"`);
    }
    if (cfg.placeholder) {
      props.push(`  placeholder="${cfg.placeholder}"`);
    }

    // Optional props (only show if different from defaults)
    if (cfg.type !== 'text') {
      props.push(`  type="${cfg.type}"`);
    }
    if (cfg.size !== 'md') {
      props.push(`  size="${cfg.size}"`);
    }
    if (cfg.leftIcon) {
      props.push(`  leftIcon="${cfg.leftIcon}"`);
    }
    if (cfg.rightIcon) {
      props.push(`  rightIcon="${cfg.rightIcon}"`);
    }
    if (cfg.required) {
      props.push(`  [required]="isRequired()"`);
    }
    if (cfg.disabled) {
      props.push(`  [disabled]="isDisabled()"`);
    }
    if (cfg.state === 'error') {
      props.push(`  [error]="hasError()"`);
      if (cfg.errorText) {
        props.push(`  errorText="${cfg.errorText}"`);
      }
    }
    if (cfg.showPasswordToggle && cfg.type === 'password') {
      props.push(`  [showPasswordToggle]="true"`);
    }
    if (cfg.clearable) {
      props.push(`  [clearable]="true"`);
    }
    if (cfg.helperText && cfg.state !== 'error') {
      props.push(`  helperText="${cfg.helperText}"`);
    }

    // Value binding and event handler for manual control
    props.push(`  [value]="inputValue()"`);
    props.push(`  (inputChange)="onInputChange($event)"`);

    const propsString = props.join('\n');

    return `<!-- Interactive Mode - Manual Signal Control -->
<oct-input
${propsString}>
</oct-input>

<!-- Component Setup -->
export class MyComponent {
  // Signals for manual state control
  inputValue = signal('');
  isRequired = signal(${cfg.required});
  isDisabled = signal(${cfg.disabled});
  hasError = signal(${cfg.state === 'error'});

  onInputChange(value: string | number): void {
    this.inputValue.set(value);

    // Manual validation logic
    if (this.isRequired() && !value) {
      this.hasError.set(true);
    } else {
      this.hasError.set(false);
    }

    // Handle input value changes
  }

  // Methods to control state manually
  toggleRequired() {
    this.isRequired.update(current => !current);
  }

  toggleDisabled() {
    this.isDisabled.update(current => !current);
  }
}`;
  });

  updateConfig<K extends keyof InputConfig>(key: K, value: InputConfig[K]): void {
    this.config.update(cfg => {
      const newConfig = { ...cfg, [key]: value };

      // Special handling for showPasswordToggle
      if (key === 'showPasswordToggle') {
        if (value) {
          // When enabling password toggle, automatically set type to 'password'
          newConfig.type = 'password';
        } else {
          // When disabling password toggle, revert to 'text' if it was 'password'
          if (cfg.type === 'password') {
            newConfig.type = 'text';
          }
        }
      }

      // Special handling for type changes
      if (key === 'type') {
        if (value !== 'password' && cfg.showPasswordToggle) {
          // When changing type away from password, disable password toggle
          newConfig.showPasswordToggle = false;
        }
      }

      return newConfig;
    });
  }

  updateSize(size: string): void {
    this.updateConfig('size', size as InputSize);
  }

  updateState(state: string): void {
    if (state === 'disabled') {
      this.config.update(cfg => ({
        ...cfg,
        state: state as InputState,
        disabled: true,
        errorText: ''
      }));
    } else if (state === 'error') {
      this.config.update(cfg => ({
        ...cfg,
        state: state as InputState,
        disabled: false,
        errorText: 'This field has an error'
      }));
    } else {
      this.config.update(cfg => ({
        ...cfg,
        state: state as InputState,
        disabled: false,
        errorText: ''
      }));
    }
  }

  applyPreset(preset: string): void {
    // Reset playground mode for non-form presets
    if (preset !== 'signalForm') {
      this.playgroundMode.set('interactive');
    }

    switch (preset) {
      case 'default':
        this.config.set({
          label: 'Input Label',
          placeholder: 'Enter some text...',
          helperText: 'This is helper text',
          errorText: '',
          type: 'text',
          size: 'md',
          state: 'default',
          required: false,
          disabled: false,
          leftIcon: undefined,
          rightIcon: undefined,
          showPasswordToggle: false,
          clearable: false
        });
        break;
      case 'email':
        this.config.update(cfg => ({
          ...cfg,
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email',
          leftIcon: 'Mail',
          required: true
        }));
        break;
      case 'password':
        this.config.update(cfg => ({
          ...cfg,
          type: 'password',
          label: 'Password',
          placeholder: 'Enter password',
          showPasswordToggle: true,
          required: true
        }));
        break;
      case 'withError':
        this.config.update(cfg => ({
          ...cfg,
          state: 'error',
          errorText: 'This field is required',
          required: true
        }));
        break;
      case 'disabled':
        this.config.update(cfg => ({
          ...cfg,
          disabled: true,
          label: 'Disabled Input',
          placeholder: 'This input is disabled'
        }));
        break;
      case 'signalForm':
        this.playgroundMode.set('signalForm');
        break;
    }
  }

  getDisplayCode(): string {
    const mode = this.playgroundMode();
    if (mode === 'signalForm') {
      return `// OFFICIAL Signal Forms - @angular/forms/signals
// Uses form() function and [formField] directive (stable since v22)

import { form, required, email, minLength, FormField } from '@angular/forms/signals';

// Step 1: Define form data interface
interface FormData {
  name: string;
  email: string;
  phone: string;
}

// Step 2: Create form model signal
readonly formModel = signal<FormData>({
  name: '',
  email: '',
  phone: ''
});

// Step 3: Create form with validators using form()
readonly myForm = form(this.formModel, (schemaPath) => {
  required(schemaPath.name, { message: 'Name is required' });
  minLength(schemaPath.name, 3, { message: 'Min 3 characters' });

  required(schemaPath.email, { message: 'Email is required' });
  email(schemaPath.email, { message: 'Invalid email' });
});

// Step 4: Access field state via signals
readonly formValid = computed(() =>
  this.myForm.name().valid() &&
  this.myForm.email().valid()
);

// Template: Use [formField] directive - NO manual bindings needed!
@Component({
  imports: [FormField],  // Add FormField directive
  template: \`
    <oct-input [formField]="myForm.name" label="Name" />
    <oct-input [formField]="myForm.email" label="Email" />

    @if (myForm.name().touched() && myForm.name().invalid()) {
      @for (error of myForm.name().errors(); track error) {
        <span>{{ error.message }}</span>
      }
    }
  \`
})`;
    }
    return this.generatedCode();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SIGNAL FORM METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  onSubmitSignalForm(): void {
    // Mark all signal form inputs as touched to trigger validation display
    this.signalForm().markAsTouched();

    // With official Signal Forms, validation is automatic via [formField] directive
    // Just check formValid() and submit
    if (this.formValid()) {
      const formData = this.formModel();
      this.formData.set(formData);
      this.formSubmitted.set(true);
      console.log('✅ Signal Form submitted successfully:', formData);
    } else {
      this.formSubmitted.set(false);
      console.log('⚠️ Signal Form has validation errors - fields marked as touched');
    }
  }

  onResetSignalForm(): void {
    // Reset form by setting model back to initial values
    this.formModel.set({
      name: '',
      email: '',
      phone: '',
      searchTerm: ''
    });

    // Reset touched state on all signal form inputs
    this.signalForm().reset();

    // Reset submission state
    this.formSubmitted.set(false);
    this.formData.set(null);
  }

  // Legacy field update handlers (kept for backward compatibility with manual binding examples)
  onNameChange(value: string): void {
    this.formModel.update(m => ({ ...m, name: value }));
  }

  onEmailChange(value: string): void {
    this.formModel.update(m => ({ ...m, email: value }));
  }

  onPhoneChange(value: string): void {
    this.formModel.update(m => ({ ...m, phone: value }));
  }

  onSearchTermChange(value: string): void {
    this.formModel.update(m => ({ ...m, searchTerm: value }));
  }

  // Getter for backward compatibility
  formName = () => this.formModel().name;
  formEmail = () => this.formModel().email;
  formPhone = () => this.formModel().phone;
  formSearchTerm = () => this.formModel().searchTerm;

  // Error getters for backward compatibility with template
  nameError = computed(() => {
    const field = this.signalForm.name();
    if (field.touched() && field.errors().length > 0) {
      const err = field.errors()[0];
      return 'message' in err ? (err.message as string) : '';
    }
    return '';
  });

  emailError = computed(() => {
    const field = this.signalForm.email();
    if (field.touched() && field.errors().length > 0) {
      const err = field.errors()[0];
      return 'message' in err ? (err.message as string) : '';
    }
    return '';
  });

  phoneError = computed(() => {
    const field = this.signalForm.phone();
    if (field.touched() && field.errors().length > 0) {
      const err = field.errors()[0];
      return 'message' in err ? (err.message as string) : '';
    }
    return '';
  });

  // Touched state signals for backward compatibility
  nameTouched = signal(false);
  emailTouched = signal(false);
  phoneTouched = signal(false);
}
