import { Component, signal, ChangeDetectionStrategy, computed } from '@angular/core';
import { form, FormField, required, minLength, maxLength, submit } from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';
import { ButtonComponent } from 'ngx-hr-ui';
import { CardComponent, CardContentComponent, CardFooterComponent, CardHeaderComponent } from 'ngx-hr-ui';
import { CheckboxComponent } from 'ngx-hr-ui';
import { TextareaComponent } from 'ngx-hr-ui';
import { TextComponent } from 'ngx-hr-ui';

@Component({
  selector: 'oct-textarea-page',
  templateUrl: './textarea.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    JsonPipe,
    TextComponent,
    ButtonComponent,
    CardComponent,
    CardContentComponent,
    CardHeaderComponent,
    CardFooterComponent,
    CheckboxComponent,
    TextareaComponent,
    FormField
  ]
})
export class TextareaPageComponent {
  // Interactive playground state
  readonly playgroundMode = signal<'interactive' | 'signalForm'>('interactive');

  // Textarea configuration
  readonly config = signal({
    label: 'Message',
    placeholder: 'Enter your message here...',
    helperText: 'This is your message content.',
    errorText: 'Please provide a message (minimum 10 characters)',
    required: false,
    disabled: false,
    error: false,
    hideHelper: false
  });

  // Signal Forms model
  readonly signalFormModel = signal({
    message: '',
    description: '',
    feedback: '',
    notes: ''
  });

  // Create form with validators using Signal Forms API
  readonly signalForm = form(this.signalFormModel, f => {
    required(f.message, { message: 'Message is required' });
    minLength(f.message, 10, { message: 'Message must be at least 10 characters' });
    maxLength(f.message, 500, { message: 'Message cannot exceed 500 characters' });
    required(f.description, { message: 'Description is required' });
    minLength(f.description, 5, { message: 'Description must be at least 5 characters' });
  });

  // Computed form states using Signal Forms API
  readonly formValid = computed(() => this.signalForm().valid());
  readonly formInvalid = computed(() => this.signalForm().invalid());

  // Check if required fields are filled
  readonly hasRequiredFields = computed(() => {
    const model = this.signalFormModel();
    return model.message.trim().length > 0 && model.description.trim().length > 0;
  });

  // Form status indicators
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
    }
  ]);

  readonly formSubmitted = signal(false);
  readonly formData = signal<any>(null);

  // Interactive value
  readonly interactiveValue = signal('');

  // Computed display code
  readonly displayCode = computed(() => this.getDisplayCode());

  constructor() {
    // Apply default preset on initialization
    this.applyPreset('default');
  }

  // Config update methods
  updateConfig<K extends keyof ReturnType<typeof this.config>>(key: K, value: any): void {
    if (key === 'error' && value === true) {
      this.config.update(current => ({
        ...current,
        [key]: value,
        errorText: current.errorText || 'Please provide a message (minimum 10 characters)'
      }));
    } else if (key === 'error' && value === false) {
      this.config.update(current => ({
        ...current,
        [key]: value,
        errorText: ''
      }));
    } else {
      this.config.update(current => ({ ...current, [key]: value }));
    }
  }

  // Preset methods
  applyPreset(preset: string): void {
    const presets = {
      default: {
        label: 'Message',
        placeholder: 'Enter your message here...',
        helperText: 'This is your message content.',
        errorText: '',
        required: false,
        disabled: false,
        error: false,
        hideHelper: false
      },
      message: {
        label: 'Message',
        placeholder: 'Write your message...',
        helperText: 'Your message will be sent to the recipient.',
        errorText: '',
        required: true,
        disabled: false,
        error: false,
        hideHelper: false
      },
      withError: {
        label: 'Required Message',
        placeholder: 'This field is required...',
        helperText: '',
        errorText: 'Please provide a message (minimum 10 characters)',
        required: true,
        disabled: false,
        error: true,
        hideHelper: false
      },
      disabled: {
        label: 'Disabled Textarea',
        placeholder: 'This textarea is disabled',
        helperText: 'This field cannot be edited.',
        errorText: '',
        required: false,
        disabled: true,
        error: false,
        hideHelper: false
      },
      signalForm: {
        label: 'Form Message',
        placeholder: 'Enter form message...',
        helperText: 'This textarea is part of a Signal Form.',
        errorText: '',
        required: true,
        disabled: false,
        error: false,
        hideHelper: false
      }
    };

    const presetConfig = presets[preset as keyof typeof presets];
    if (presetConfig) {
      this.config.set(presetConfig as any);
    }

    // Switch to signal form mode if needed
    if (preset === 'signalForm') {
      this.playgroundMode.set('signalForm');
    } else {
      this.playgroundMode.set('interactive');
    }
  }

  // Interactive event handlers
  onInteractiveTextareaChange(value: string): void {
    this.interactiveValue.set(value);

    // Example of manual validation in interactive mode
    if (this.config().required && value.length < 10) {
      this.config.update(current => ({ ...current, error: true, errorText: 'Message must be at least 10 characters' }));
    } else {
      this.config.update(current => ({ ...current, error: false, errorText: '' }));
    }
  }

  // Signal Form Methods
  onSubmitSignalForm(): void {
    submit(this.signalForm, async () => {
      // This callback only runs after validation passes and all fields are marked as touched
      this.formSubmitted.set(true);
      this.formData.set(this.signalFormModel());
    });
  }

  onResetSignalForm(): void {
    this.signalFormModel.set({
      message: '',
      description: '',
      feedback: '',
      notes: ''
    });
    this.formSubmitted.set(false);
    this.formData.set(null);
  }

  // Code generation methods
  getDisplayCode(): string {
    const mode = this.playgroundMode();
    if (mode === 'signalForm') {
      return this.generateSignalFormCode();
    }
    return this.generateInteractiveCode();
  }

  private generateSignalFormCode(): string {
    return `<!-- Signal Forms -->
<oct-card>
  <oct-card-header>
    <oct-text color="1" variant="xl" weight="semibold">Signal Form with Textarea</oct-text>
    <oct-text color="3" variant="sm" weight="regular">
      Using Angular Signal Forms with [formField] directive
    </oct-text>
  </oct-card-header>
  <oct-card-content>
    <form (ngSubmit)="onSubmit()">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <oct-textarea
          [formField]="exampleForm.message"
          label="Message"
          placeholder="Enter your main message here...">
        </oct-textarea>

        <oct-textarea
          [formField]="exampleForm.description"
          label="Description"
          placeholder="Add a description...">
        </oct-textarea>

        <oct-textarea
          [formField]="exampleForm.feedback"
          label="Feedback"
          placeholder="Share your detailed feedback...">
        </oct-textarea>

        <oct-textarea
          [formField]="exampleForm.notes"
          label="Notes"
          placeholder="Additional notes...">
        </oct-textarea>
      </div>
    </form>
  </oct-card-content>
  <oct-card-footer>
    <oct-button variant="outline" (buttonClick)="onReset()">
      Reset
    </oct-button>
    <oct-button variant="solid" type="submit" [disabled]="exampleForm.invalid()">
      Submit
    </oct-button>
  </oct-card-footer>
</oct-card>

<!-- Component TypeScript -->
import { form, FormField, required, minLength, maxLength, submit } from '@angular/forms/signals';

export class MyComponent {
  // Signal Forms model
  formModel = signal({
    message: '',
    description: '',
    feedback: '',
    notes: ''
  });

  // Create form with validators
  exampleForm = form(this.formModel, f => {
    required(f.message, { message: 'Message is required' });
    minLength(f.message, 10, { message: 'At least 10 characters' });
    maxLength(f.message, 500, { message: 'Max 500 characters' });

    required(f.description, { message: 'Description is required' });
    minLength(f.description, 5, { message: 'At least 5 characters' });
  });

  onSubmit() {
    // submit() marks all fields as touched and validates before running callback
    submit(this.exampleForm, async () => {
      console.log('Form data:', this.formModel());
    });
  }

  onReset() {
    this.formModel.set({
      message: '',
      description: '',
      feedback: '',
      notes: ''
    });
  }
}`;
  }

  private generateInteractiveCode(): string {
    const config = this.config();
    const props = [];

    if (config.label) props.push(`label="${config.label}"`);
    if (config.placeholder) props.push(`placeholder="${config.placeholder}"`);
    if (config.required) props.push(`[required]="${config.required}"`);
    if (config.disabled) props.push(`[disabled]="${config.disabled}"`);
    if (config.error) props.push(`[error]="${config.error}"`);
    if (config.hideHelper) props.push(`[hideHelper]="${config.hideHelper}"`);
    if (config.helperText && !config.error) props.push(`helperText="${config.helperText}"`);
    if (config.error && config.errorText) props.push(`errorText="${config.errorText}"`);

    props.push('[value]="textareaValue()"');
    props.push('(textareaChange)="onTextareaChange($event)"');

    const propsString = props.length > 3 ? '\n  ' + props.join('\n  ') : ' ' + props.join(' ');

    const componentCode = `<oct-textarea${propsString}${props.length > 3 ? '\n' : ' '}></oct-textarea>`;

    return `${componentCode}

export class MyComponent {
  textareaValue = signal('${this.interactiveValue()}');
  isRequired = signal(${config.required});
  isDisabled = signal(${config.disabled});
  hasError = signal(${config.error});

  onTextareaChange(value: string) {
    this.textareaValue.set(value);

    if (this.isRequired() && value.length < 10) {
      this.hasError.set(true);
    } else {
      this.hasError.set(false);
    }
  }

  toggleRequired() {
    this.isRequired.update(current => !current);
  }

  toggleDisabled() {
    this.isDisabled.update(current => !current);
  }
}`;
  }
}
