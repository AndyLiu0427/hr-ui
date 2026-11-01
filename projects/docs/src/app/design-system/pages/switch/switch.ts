import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { SwitchComponent, type SwitchColor } from 'hr-ui';
import { ButtonComponent } from 'hr-ui';
import { CardComponent, CardContentComponent, CardFooterComponent, CardHeaderComponent } from 'hr-ui';
import { InputComponent } from 'hr-ui';
import { TextComponent } from 'hr-ui';

interface SwitchConfig {
  label: string;
  disabled: boolean;
  checked: boolean;
  required: boolean;
  error: boolean;
  errorMessage: string;
  color: SwitchColor;
}

@Component({
  selector: 'oct-switch-page',
  templateUrl: './switch.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SwitchComponent,
    ButtonComponent,
    TextComponent,
    InputComponent,
    CardComponent,
    CardContentComponent,
    CardHeaderComponent,
    CardFooterComponent,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe
  ]
})
export class SwitchPageComponent {
  private readonly fb = inject(FormBuilder);

  // Reactive Form Example
  readonly settingsForm: FormGroup;
  readonly formSubmitted = signal(false);
  readonly formData = signal<any>(null);

  // Interactive playground state
  config = signal<SwitchConfig>({
    label: 'Enable notifications',
    disabled: false,
    checked: false,
    required: false,
    error: false,
    errorMessage: '',
    color: 'primary'
  });

  // Playground mode state
  readonly playgroundMode = signal<'interactive' | 'reactiveForm'>('interactive');

  // Simple switch states for examples
  readonly darkModeEnabled = signal(false);
  readonly notificationsEnabled = signal(true);
  readonly autoSaveEnabled = signal(true);
  readonly twoFactorEnabled = signal(false);

  constructor() {
    // Initialize reactive form with various FormControl examples
    this.settingsForm = this.fb.group({
      notifications: [true],
      emailAlerts: [false],
      darkMode: [false],
      autoSave: [true, Validators.requiredTrue],
      twoFactor: [false]
    });
  }

  // Available preset configurations
  presets = {
    default: {
      label: 'Enable notifications',
      disabled: false,
      checked: false,
      required: false,
      error: false,
      errorMessage: '',
      color: 'primary' as SwitchColor
    },
    checked: {
      label: 'Enable notifications',
      disabled: false,
      checked: true,
      required: false,
      error: false,
      errorMessage: '',
      color: 'primary' as SwitchColor
    },
    disabled: {
      label: 'Enable notifications',
      disabled: true,
      checked: false,
      required: false,
      error: false,
      errorMessage: '',
      color: 'primary' as SwitchColor
    },
    required: {
      label: 'I agree to the terms',
      disabled: false,
      checked: false,
      required: true,
      error: false,
      errorMessage: '',
      color: 'primary' as SwitchColor
    },
    error: {
      label: 'Enable notifications',
      disabled: false,
      checked: false,
      required: true,
      error: true,
      errorMessage: 'You must enable this option to continue',
      color: 'error' as SwitchColor
    },
    success: {
      label: 'Task completed',
      disabled: false,
      checked: true,
      required: false,
      error: false,
      errorMessage: '',
      color: 'success' as SwitchColor
    },
    warning: {
      label: 'Warning mode',
      disabled: false,
      checked: true,
      required: false,
      error: false,
      errorMessage: '',
      color: 'warning' as SwitchColor
    },
    info: {
      label: 'Information mode',
      disabled: false,
      checked: true,
      required: false,
      error: false,
      errorMessage: '',
      color: 'info' as SwitchColor
    }
  };

  // Interactive playground methods
  updateConfig<K extends keyof SwitchConfig>(key: K, value: SwitchConfig[K]): void {
    this.config.update(config => ({ ...config, [key]: value }));
  }

  onPlaygroundChange(value: boolean): void {
    this.updateConfig('checked', value);
  }

  // Code generation methods
  getDisplayCode(): string {
    const config = this.config();
    const mode = this.playgroundMode();

    if (mode === 'reactiveForm') {
      return this.generateUsageCode();
    } else {
      // Interactive mode - show manual signal control
      let code = '<!-- Interactive Mode - Signal-based Control -->\n<oct-switch';

      // Add non-default props
      if (config.label) code += `\n  label="${config.label}"`;
      if (config.color && config.color !== 'primary') code += `\n  color="${config.color}"`;
      if (config.disabled) code += `\n  [disabled]="disabled()"`;
      if (config.checked) code += `\n  [checked]="checked()"`;
      if (config.required) code += `\n  [required]="required()"`;
      if (config.error) code += `\n  [error]="error()"`;
      if (config.errorMessage) code += `\n  errorText="${config.errorMessage}"`;

      code += `\n  (switchChange)="handleChange($event)">`;
      code += `\n</oct-switch>`;

      code += `\n\n<!-- Component TypeScript -->\nexport class MyComponent {
  // Signal-based state management
  disabled = signal(${config.disabled});
  checked = signal(${config.checked});
  required = signal(${config.required});
  error = signal(${config.error});

  handleChange(value: boolean) {
    this.checked.set(value);
    console.log('Switch changed:', value);
  }
}`;

      return code;
    }
  }

  generateUsageCode(): string {
    return `<form [formGroup]="settingsForm" (ngSubmit)="onSubmit()" class="space-y-4">
  <div class="space-y-3">
    <oct-switch
      formControlName="notifications"
      label="Enable push notifications">
    </oct-switch>

    <oct-switch
      formControlName="emailAlerts"
      label="Email alerts">
    </oct-switch>

    <oct-switch
      formControlName="darkMode"
      label="Dark mode">
    </oct-switch>

    <oct-switch
      formControlName="autoSave"
      label="Auto-save changes">
    </oct-switch>

    <oct-switch
      formControlName="twoFactor"
      label="Two-factor authentication">
    </oct-switch>
  </div>

  <div class="flex gap-4">
    <oct-button type="submit">
      Save Settings
    </oct-button>
    <oct-button variant="outline" type="button" (click)="onReset()">
      Reset
    </oct-button>
  </div>
</form>

<!-- Form automatically handles validation and state -->
<!-- No need to manually manage disabled/error states -->`;
  }

  generateImportCode(): string {
    return `import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SwitchComponent } from 'hr-ui';

@Component({
  selector: 'oct-settings-form',
  template: \`
    <form [formGroup]="settingsForm" (ngSubmit)="onSubmit()">
      <oct-switch
        formControlName="notifications"
        label="Enable notifications">
      </oct-switch>

      <oct-switch
        formControlName="darkMode"
        label="Dark mode">
      </oct-switch>

      <button type="submit">Save Settings</button>
    </form>
  \`,
  imports: [ReactiveFormsModule, SwitchComponent]
})
export class SettingsFormComponent {
  settingsForm = this.fb.group({
    notifications: [true],
    darkMode: [false]
  });

  constructor(private fb: FormBuilder) {}

  onSubmit(): void {
    if (this.settingsForm.valid) {
      console.log('Settings:', this.settingsForm.value);
    }
  }
}`;
  }

  generateTypesCode(): string {
    return `// Switch Component Properties
interface SwitchProps {
  // Form Control Integration
  formControlName?: string;  // Reactive forms
  [(ngModel)]?: boolean;     // Template-driven forms

  // Basic Properties
  label?: string;            // Label text displayed next to switch
  checked?: boolean;         // Initial checked state
  id?: string;              // HTML id attribute
  name?: string;            // HTML name attribute

  // State Control (Auto-detected from FormControl)
  disabled?: boolean;        // Disable user interaction
  required?: boolean;        // Mark as required field
  error?: boolean;          // Show error state
  errorText?: string;       // Error message to display

  // Events
  switchChange?: (checked: boolean) => void;  // Fires on state change
  switchFocus?: (event: FocusEvent) => void;  // Fires on focus
  switchBlur?: (event: FocusEvent) => void;   // Fires on blur
}

// Public Methods
interface SwitchMethods {
  focus(): void;  // Programmatically focus the switch
  blur(): void;   // Programmatically blur the switch
}

// Form Control Integration
// ✅ Full reactive forms support via ControlValueAccessor
// ✅ Automatic state detection with FormSignals
// ✅ Keyboard navigation (Space/Enter keys)
// ✅ WCAG 2.1 AA accessibility compliance`;
  }

  // Preset application
  applyPreset(preset: keyof typeof this.presets | 'reactiveForm'): void {
    if (preset === 'reactiveForm') {
      this.playgroundMode.set('reactiveForm');
    } else {
      this.playgroundMode.set('interactive');
      this.config.set(this.presets[preset]);
    }
  }

  // Simple switch handlers
  onDarkModeChange(value: boolean): void {
    this.darkModeEnabled.set(value);
  }

  onNotificationsChange(value: boolean): void {
    this.notificationsEnabled.set(value);
  }

  onAutoSaveChange(value: boolean): void {
    this.autoSaveEnabled.set(value);
  }

  onTwoFactorChange(value: boolean): void {
    this.twoFactorEnabled.set(value);
  }

  // Reactive Form methods
  onSubmitReactiveForm(): void {
    this.formSubmitted.set(true);

    if (this.settingsForm.valid) {
      this.formData.set(this.settingsForm.value);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.settingsForm.controls).forEach(key => {
        this.settingsForm.get(key)?.markAsTouched();
      });
    }
  }

  onResetReactiveForm(): void {
    this.settingsForm.reset({
      notifications: true,
      emailAlerts: false,
      darkMode: false,
      autoSave: true,
      twoFactor: false
    });
    this.formSubmitted.set(false);
    this.formData.set(null);
  }
}
