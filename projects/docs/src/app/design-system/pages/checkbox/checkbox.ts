import { Component, ChangeDetectionStrategy, signal, viewChildren, computed } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';
import { CheckboxComponent, CheckboxState } from 'ngx-hr-ui';
import { ButtonComponent } from 'ngx-hr-ui';
import { CardComponent, CardContentComponent, CardFooterComponent, CardHeaderComponent } from 'ngx-hr-ui';
import { InputComponent } from 'ngx-hr-ui';
import { TextComponent } from 'ngx-hr-ui';

interface CheckboxConfig {
  state: CheckboxState;
  label: string;
  disabled: boolean;
  checked: boolean;
  required: boolean;
  error: boolean;
  errorMessage: string;
}

@Component({
  selector: 'oct-checkbox-page',
  templateUrl: './checkbox.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CheckboxComponent,
    ButtonComponent,
    TextComponent,
    InputComponent,
    CardComponent,
    CardContentComponent,
    CardHeaderComponent,
    CardFooterComponent,
    FormField,
    JsonPipe
  ]
})
export class CheckboxPageComponent {
  readonly checkboxComponents = viewChildren(CheckboxComponent);

  readonly signalFormModel = signal({
    terms: false,
    newsletter: false,
    notifications: true,
    marketing: false,
    privacy: false
  });

  readonly signalForm = form(this.signalFormModel, f => {
    required(f.terms, { message: 'You must agree to the Terms of Service' });
    required(f.privacy, { message: 'You must acknowledge the Privacy Policy' });
  });

  readonly formSubmitted = signal(false);
  readonly formData = signal<any>(null);

  config = signal<CheckboxConfig>({
    state: 'default',
    label: 'Checkbox label',
    disabled: false,
    checked: false,
    required: false,
    error: false,
    errorMessage: ''
  });

  // Playground mode state
  readonly playgroundMode = signal<'interactive' | 'signalForm'>('interactive');

  // Available options for selectors
  checkboxStates: CheckboxState[] = ['default', 'checked', 'disabled', 'disabled-checked'];

  // Example data for display
  checkboxStateExamples: { state: CheckboxState; label: string; description: string }[] = [
    { state: 'default', label: 'Default', description: 'Unchecked state' },
    { state: 'checked', label: 'Checked', description: 'Selected state' },
    { state: 'disabled', label: 'Disabled', description: 'Cannot be interacted with' },
    { state: 'disabled-checked', label: 'Disabled Checked', description: 'Checked but disabled' }
  ];

  // Form demo values
  readonly formValues = signal<{
    terms: boolean;
    newsletter: boolean;
    notifications: boolean;
    marketing: boolean;
  }>({
    terms: false,
    newsletter: true,
    notifications: false,
    marketing: true
  });

  // Group checkbox demo - Morning Routine Checklist
  readonly groupItems = signal([
    { id: 'exercise', label: '🏃‍♂️ Morning exercise (30 minutes)', checked: true },
    { id: 'breakfast', label: '🥐 Healthy breakfast', checked: true },
    { id: 'meditation', label: '🧘‍♀️ Meditation or mindfulness (10 minutes)', checked: false },
    { id: 'news', label: '📰 Read news and updates', checked: true },
    { id: 'skincare', label: '✨ Skincare routine', checked: false },
    { id: 'planning', label: '📝 Plan the day ahead', checked: false }
  ]);

  // Validation example
  readonly validationExample = signal<{
    privacy: boolean;
    newsletter: boolean;
    touched: boolean;
  }>({
    privacy: false,
    newsletter: false,
    touched: false
  });

  // Computed for form validity using Signal Forms API
  readonly formValid = computed(() => this.signalForm().valid());
  readonly formInvalid = computed(() => this.signalForm().invalid());

  // Computed for "select all" state
  get selectAllState(): 'checked' | 'default' {
    const items = this.groupItems();
    const checkedCount = items.filter(item => item.checked).length;

    if (checkedCount === 0) return 'default';
    if (checkedCount === items.length) return 'checked';
    return 'default'; // Simplified: no intermediate state
  }

  get selectAllChecked(): boolean {
    return this.selectAllState === 'checked';
  }

  // Interactive playground methods
  updateConfig<K extends keyof CheckboxConfig>(key: K, value: CheckboxConfig[K]): void {
    this.config.update(config => ({ ...config, [key]: value }));
  }

  onPlaygroundChange(value: boolean): void {
    this.updateConfig('checked', value);
  }

  // Code generation methods
  getDisplayCode(): string {
    const config = this.config();
    const mode = this.playgroundMode();

    if (mode === 'signalForm') {
      return this.generateUsageCode();
    } else {
      // Interactive mode - show manual signal control
      let code = '<!-- Interactive Mode - Manual Control -->\n<oct-checkbox';

      // Add non-default props for interactive mode
      if (config.label) code += `\n  label="${config.label}"`;
      if (config.disabled) code += `\n  [disabled]="disabled()"`;
      if (config.checked) code += `\n  [checked]="checked()"`;
      if (config.required) code += `\n  [required]="required()"`;
      if (config.error) code += `\n  [error]="error()"`;
      if (config.errorMessage) code += `\n  [errorMessage]="errorMessage()"`;

      code += `\n  (checkboxChange)="handleChange($event)">`;
      code += `\n</oct-checkbox>`;

      code += `\n\n<!-- Component TypeScript -->\nexport class MyComponent {
  // Signal-based state management
  disabled = signal(${config.disabled});
  checked = signal(${config.checked});
  required = signal(${config.required});
  error = signal(${config.error});
  errorMessage = signal('${config.errorMessage}');

  handleChange(value: boolean) {
    this.checked.set(value);
  }
}`;

      return code;
    }
  }

  generateUsageCode(): string {
    return `<!-- Signal Forms -->
<form (ngSubmit)="onSubmit()" class="space-y-4">
  <div class="space-y-3">
    <oct-checkbox
      [formField]="exampleForm.terms"
      label="I agree to the Terms of Service">
    </oct-checkbox>

    <oct-checkbox
      [formField]="exampleForm.newsletter"
      label="Subscribe to newsletter">
    </oct-checkbox>

    <oct-checkbox
      [formField]="exampleForm.notifications"
      label="Enable notifications">
    </oct-checkbox>

    <oct-checkbox
      [formField]="exampleForm.marketing"
      label="Receive marketing emails">
    </oct-checkbox>

    <oct-checkbox
      [formField]="exampleForm.privacy"
      label="I have read and agree to the Privacy Policy">
    </oct-checkbox>
  </div>

  <div class="flex gap-4">
    <oct-button type="submit" [disabled]="exampleForm.invalid()">
      Submit Form
    </oct-button>
    <oct-button variant="outline" type="button" (buttonClick)="onReset()">
      Reset Form
    </oct-button>
  </div>
</form>

<!-- Component TypeScript -->
export class MyComponent {
  // Signal Forms model
  formModel = signal({
    terms: false,
    newsletter: false,
    notifications: true,
    marketing: false,
    privacy: false
  });

  // Create form with validators
  exampleForm = form(this.formModel, f => {
    required(f.terms, { message: 'You must agree to terms' });
    required(f.privacy, { message: 'Privacy policy is required' });
  });

  onSubmit() {
    if (this.exampleForm.valid()) {
      console.log('Form data:', this.formModel());
    }
  }

  onReset() {
    this.formModel.set({
      terms: false,
      newsletter: false,
      notifications: true,
      marketing: false,
      privacy: false
    });
  }
}`;
  }

  generateImportCode(): string {
    return `import { Component, signal, computed } from '@angular/core';
import { form, required } from '@angular/forms/signals';
import { CheckboxComponent } from 'ngx-hr-ui';

@Component({
  selector: 'oct-checkbox-form',
  template: \`
    <form (ngSubmit)="onSubmit()">
      <oct-checkbox
        [formField]="myForm.terms"
        label="I agree to the Terms of Service">
      </oct-checkbox>

      <oct-checkbox
        [formField]="myForm.newsletter"
        label="Subscribe to newsletter">
      </oct-checkbox>

      <button type="submit" [disabled]="myForm.invalid()">Submit</button>
    </form>
  \`,
  imports: [CheckboxComponent]
})
export class CheckboxFormComponent {
  // Signal Forms model - simple signal with initial values
  formModel = signal({
    terms: false,
    newsletter: false
  });

  // Create form with validation rules
  myForm = form(this.formModel, f => {
    required(f.terms, { message: 'You must agree to terms' });
  });

  // Computed for UI
  formValid = computed(() => this.myForm.valid());

  onSubmit(): void {
    if (this.myForm.valid()) {
      console.log('Submitted:', this.formModel());
    }
  }
}`;
  }

  generateTypesCode(): string {
    return `// Checkbox State Types
type CheckboxState = 'default' | 'checked' | 'disabled' | 'disabled-checked';

// Component Properties - Signal Forms Integration
interface CheckboxProps {
  // Signal Forms Integration (Recommended)
  field?: FormCheckboxControl;  // Use [formField] directive

  // Manual Control (Legacy)
  checked?: boolean;
  label?: string;
  description?: string;  // Optional helper text below the label (fainter colour)
  id?: string;
  name?: string;
  value?: string;

  // Visual States (Auto-detected from Signal Forms)
  disabled?: boolean;        // Auto from field.disabled
  required?: boolean;        // Auto from field.required
  invalid?: boolean;         // Auto from field.invalid
  errors?: ValidationError[]; // Auto from field.errors

  // Events
  checkboxChange?: (checked: boolean) => void;
}

// Signal Forms Integration
// ✅ Automatic validation state via [formField] directive
// ✅ Error messages from validator options
// ✅ Touch/dirty state management built-in
// ✅ Signal-based reactivity
// ✅ No ControlValueAccessor boilerplate
// ✅ Type-safe form model with signals`;
  }

  // Form demo handlers
  onFormValueChange(field: string, value: boolean): void {
    const validFields = ['terms', 'newsletter', 'notifications', 'marketing'] as const;
    if (validFields.includes(field as any)) {
      this.formValues.update(current => ({
        ...current,
        [field]: value
      }));
    }
  }

  // Event handlers
  onCheckboxChange(_checkboxValue: boolean, _checkboxContext: string): void {
    // Handle checkbox change for demo purposes
  }

  // Group checkbox handlers
  onSelectAllChange(checked: boolean): void {
    this.groupItems.update(items => items.map(item => ({ ...item, checked })));
  }

  onGroupItemChange(itemId: string, checked: boolean): void {
    this.groupItems.update(items => items.map(item => (item.id === itemId ? { ...item, checked } : item)));
  }

  // Reset methods
  resetForm(): void {
    this.formValues.set({
      terms: false,
      newsletter: false,
      notifications: false,
      marketing: false
    });
  }

  resetGroup(): void {
    this.groupItems.update(items => items.map(item => ({ ...item, checked: false })));
  }

  // Signal Forms methods
  onSubmitSignalForm(): void {
    submit(this.signalForm, async () => {
      this.formSubmitted.set(true);
      this.formData.set(this.signalFormModel());
    });
  }

  onResetSignalForm(): void {
    this.signalFormModel.set({
      terms: false,
      newsletter: false,
      notifications: true,
      marketing: false,
      privacy: false
    });
    this.formSubmitted.set(false);
    this.formData.set(null);
  }

  // Validation example methods
  updateValidationExample(field: 'privacy' | 'newsletter', value: boolean): void {
    this.validationExample.update(current => ({
      ...current,
      [field]: value
    }));
  }

  triggerValidation(): void {
    this.validationExample.update(current => ({
      ...current,
      touched: true
    }));
  }

  applyPreset(preset: string): void {
    // Reset playground mode for non-form presets
    if (preset !== 'signalForm') {
      this.playgroundMode.set('interactive');
    }

    switch (preset) {
      case 'default':
        this.config.set({
          state: 'default',
          label: 'Checkbox label',
          disabled: false,
          checked: false,
          required: false,
          error: false,
          errorMessage: ''
        });
        break;
      case 'checked':
        this.config.update(config => ({
          ...config,
          state: 'checked',
          checked: true
        }));
        break;
      case 'disabled':
        this.config.update(config => ({
          ...config,
          state: 'disabled',
          disabled: true
        }));
        break;
      case 'withLabel':
        this.config.update(config => ({
          ...config,
          label: 'I agree to the terms and conditions',
          required: true
        }));
        break;
      case 'signalForm':
        this.playgroundMode.set('signalForm');
        break;
    }
  }
}
