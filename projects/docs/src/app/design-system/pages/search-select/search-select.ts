import { Component, ChangeDetectionStrategy, signal, computed, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  SearchSelectComponent,
  SearchSelectOption,
  SearchSelectSearchConfig,
  SearchSelectPreloadConfig,
  SearchSelectValue
} from 'hr-ui';
import { ButtonComponent } from 'hr-ui';
import { CardComponent, CardContentComponent, CardFooterComponent, CardHeaderComponent } from 'hr-ui';
import { CheckboxComponent } from 'hr-ui';
import { TextComponent } from 'hr-ui';

// Stands in for a server search, so the demo runs without a backend.
const DEMO_CLIENTS = ['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Stark Industries', 'Wayne Enterprises', 'Hooli', 'Soylent', 'Wonka Industries', 'Tyrell Corp'];

async function searchDemoClients(query: string): Promise<SearchSelectOption[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const queryLower = query.toLowerCase();
  return DEMO_CLIENTS.filter(name => name.toLowerCase().includes(queryLower)).map(name => ({ value: name, label: name }));
}

/**
 * Simplified config for demo playground - matches new component API
 */
interface SearchSelectConfig {
  value: SearchSelectValue;
  placeholder: string;
  label: string;
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  error: boolean;
  errorMessage: string;
  clearable: boolean;
  required: boolean;
  multiple: boolean;
  // Additional properties for demos
  description?: string;
  showIcon?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  maxHeight?: string;
  hideHelper?: boolean;
  debounceMs?: number;
  minSearchLength?: number;
}

@Component({
  selector: 'oct-search-select-page',
  templateUrl: './search-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    SearchSelectComponent,
    ButtonComponent,
    TextComponent,
    CheckboxComponent,
    CardComponent,
    CardContentComponent,
    CardHeaderComponent,
    CardFooterComponent
  ]
})
export class SearchSelectPageComponent {
  private readonly cdr = inject(ChangeDetectorRef);

  // Signal Forms state (matches oct-select pattern)
  readonly signalFormsValue = signal<SearchSelectValue>(null);
  readonly signalFormsTouched = signal(false);
  readonly signalFormsSubmitted = signal(false);
  readonly signalFormsErrors = signal<readonly { message: string }[]>([]);
  readonly signalFormsHasError = computed(() => this.signalFormsTouched() && this.signalFormsErrors().length > 0);

  // Store for client options loaded from API
  readonly clientOptions = signal<SearchSelectOption[]>([]);
  readonly isLoadingClients = signal(false);

  readonly frameworkOptions: SearchSelectOption[] = [
    { value: 'angular', label: 'Angular', description: 'Platform for building web applications', icon: 'Globe' },
    { value: 'react', label: 'React', description: 'Library for building user interfaces', icon: 'Code' },
    { value: 'vue', label: 'Vue.js', description: 'Progressive JavaScript framework', icon: 'Layers' },
    { value: 'svelte', label: 'Svelte', description: 'Cybernetically enhanced web apps', icon: 'Zap' },
    { value: 'nextjs', label: 'Next.js', description: 'React framework for production', icon: 'Rocket' },
    { value: 'nuxtjs', label: 'Nuxt.js', description: 'Vue.js framework for universal apps', icon: 'ExternalLink' },
    { value: 'gatsby', label: 'Gatsby', description: 'Static site generator for React', icon: 'Gauge' },
    { value: 'express', label: 'Express.js', description: 'Fast Node.js web framework', icon: 'Zap' },
    { value: 'nestjs', label: 'NestJS', description: 'Progressive Node.js framework', icon: 'Building' },
    { value: 'fastify', label: 'Fastify', description: 'Fast and low overhead web framework', icon: 'Settings' }
  ];

  readonly languageOptions: SearchSelectOption[] = [
    { value: 'javascript', label: 'JavaScript', description: 'Dynamic programming language', icon: 'Code' },
    { value: 'typescript', label: 'TypeScript', description: 'Typed superset of JavaScript', icon: 'FileCode' },
    { value: 'python', label: 'Python', description: 'High-level programming language', icon: 'Code2' },
    { value: 'java', label: 'Java', description: 'Object-oriented programming language', icon: 'Coffee' },
    { value: 'go', label: 'Go', description: 'Fast, open source programming language', icon: 'Gauge' },
    { value: 'rust', label: 'Rust', description: 'Systems programming language', icon: 'Shield' },
    { value: 'php', label: 'PHP', description: 'Server-side scripting language', icon: 'Globe' },
    { value: 'ruby', label: 'Ruby', description: 'Dynamic, open source language', icon: 'Gem' },
    { value: 'csharp', label: 'C#', description: 'Modern object-oriented language', icon: 'Square' },
    { value: 'swift', label: 'Swift', description: 'Powerful programming language for iOS', icon: 'Smartphone' }
  ];

  readonly countryOptions: SearchSelectOption[] = [
    { value: 'us', label: 'United States', description: 'North America', icon: 'Flag' },
    { value: 'uk', label: 'United Kingdom', description: 'Europe', icon: 'Flag' },
    { value: 'ca', label: 'Canada', description: 'North America', icon: 'Flag' },
    { value: 'de', label: 'Germany', description: 'Europe', icon: 'Flag' },
    { value: 'fr', label: 'France', description: 'Europe', icon: 'Flag' },
    { value: 'jp', label: 'Japan', description: 'Asia', icon: 'Flag' },
    { value: 'au', label: 'Australia', description: 'Oceania', icon: 'Flag' },
    { value: 'in', label: 'India', description: 'Asia', icon: 'Flag' },
    { value: 'br', label: 'Brazil', description: 'South America', icon: 'Flag' },
    { value: 'cn', label: 'China', description: 'Asia', icon: 'Flag' }
  ];

  readonly apiSearchFunction = searchDemoClients;

  /**
   * Mock API search for technologies (kept for demo purposes)
   */
  readonly mockApiSearchFunction = async (query: string): Promise<SearchSelectOption[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const technologies = [
      { value: 'ai', label: 'Artificial Intelligence', description: 'Machine learning and AI technologies' },
      { value: 'blockchain', label: 'Blockchain', description: 'Distributed ledger technology' },
      { value: 'cloud', label: 'Cloud Computing', description: 'On-demand computing services' },
      { value: 'devops', label: 'DevOps', description: 'Development and operations practices' },
      { value: 'mobile', label: 'Mobile Development', description: 'iOS and Android app development' },
      { value: 'web', label: 'Web Development', description: 'Frontend and backend web technologies' },
      { value: 'data', label: 'Data Science', description: 'Data analysis and machine learning' },
      { value: 'cybersecurity', label: 'Cybersecurity', description: 'Information security practices' },
      { value: 'iot', label: 'Internet of Things', description: 'Connected devices and sensors' },
      { value: 'ar', label: 'Augmented Reality', description: 'AR/VR technologies' },
      { value: 'quantum', label: 'Quantum Computing', description: 'Next-generation computing' },
      { value: 'robotics', label: 'Robotics', description: 'Automated systems and robotics' }
    ];

    const queryLower = query.toLowerCase();
    return technologies
      .filter(tech => tech.label.toLowerCase().includes(queryLower) || tech.description.toLowerCase().includes(queryLower))
      .slice(0, 8); // Limit results
  };

  readonly config = signal<SearchSelectConfig>({
    value: null,
    placeholder: 'Search for a framework...',
    label: 'Framework',
    size: 'md',
    disabled: false,
    error: false,
    errorMessage: '',
    clearable: false,
    required: false,
    multiple: false
  });

  /**
   * Search config for API search mode - uses new config object pattern
   */
  readonly apiSearchConfig = computed<SearchSelectSearchConfig>(() => ({
    searchFn: this.apiSearchFunction,
    debounceMs: 300,
    minLength: 0, // Allow empty search to show pre-loaded data
    emptyText: 'No clients found',
    placeholder: 'Search clients...'
  }));

  /**
   * Preload config for API search mode - pre-loads initial data
   */
  readonly apiPreloadConfig = computed<SearchSelectPreloadConfig>(() => ({
    loadFn: this.preloadClients,
    trigger: 'init'
  }));

  selectedFramework = signal<string | number | null>(null);
  selectedTechnology = signal<string | number | null>(null);
  selectedLanguage = signal<string | number | null>(null);
  selectedCountry = signal<string | number | null>(null);

  // Multi-select demo state
  readonly selectedFrameworksMulti = signal<(string | number)[]>(['angular', 'react']);

  readonly playgroundMode = signal<'interactive' | 'signalForms' | 'apiSearch' | 'preloadData'>('interactive');

  /**
   * Generated code sample for documentation - shows new simplified API
   */
  readonly generatedCode = computed(() => {
    const cfg = this.config();
    const props: string[] = [];
    const mode = this.playgroundMode();

    if (mode === 'apiSearch') {
      props.push(`  [searchConfig]="searchConfig"`);
      props.push(`  [preloadConfig]="preloadConfig"`);
    } else {
      props.push(`  [options]="frameworkOptions"`);
    }

    if (cfg.value !== null) {
      props.push(`  [(value)]="selectedValue"`);
    }
    if (cfg.placeholder) {
      props.push(`  placeholder="${cfg.placeholder}"`);
    }
    if (cfg.label) {
      props.push(`  label="${cfg.label}"`);
    }
    if (cfg.size !== 'md') {
      props.push(`  size="${cfg.size}"`);
    }
    if (cfg.clearable) {
      props.push(`  [clearable]="true"`);
    }
    if (cfg.disabled) {
      props.push(`  [disabled]="true"`);
    }
    if (cfg.errorMessage) {
      props.push(`  [errorText]="${cfg.errorMessage}"`);
    }
    if (cfg.required) {
      props.push(`  [required]="true"`);
    }

    return `<oct-search-select\n${props.join('\n')}\n  (valueChange)="onValueChange($event)">\n</oct-search-select>`;
  });

  updateConfig<K extends keyof SearchSelectConfig>(key: K, value: SearchSelectConfig[K]): void {
    this.config.update(cfg => {
      const newConfig = { ...cfg, [key]: value };

      if (key === 'clearable' && value === true && !newConfig.value) {
        newConfig.value = 'angular';
      }

      return newConfig;
    });

    this.cdr.markForCheck();
  }

  updateSize(size: string): void {
    this.updateConfig('size', size as 'sm' | 'md' | 'lg');
  }

  updateDebounceMs(value: string): void {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      this.updateConfig('debounceMs', numValue);
    }
  }

  updateMinSearchLength(value: string): void {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      this.updateConfig('minSearchLength', numValue);
    }
  }

  applyPreset(preset: string): void {
    if (!['signalForms', 'apiSearch'].includes(preset)) {
      this.playgroundMode.set('interactive');
    }

    switch (preset) {
      case 'default':
        this.config.set({
          value: null,
          placeholder: 'Search for a framework...',
          label: 'Framework',
          size: 'md',
          disabled: false,
          error: false,
          errorMessage: '',
          clearable: false,
          required: false,
          multiple: false
        });
        break;
      case 'apiSearch':
        this.playgroundMode.set('apiSearch');
        this.config.update(cfg => ({
          ...cfg,
          placeholder: 'Search clients...',
          label: 'Client (API Search)'
        }));
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
          value: 'angular',
          label: 'Disabled Search Select'
        }));
        break;
      case 'loading':
        // Loading state is now internal to the component
        // This preset just shows the API search mode which has loading states
        this.playgroundMode.set('apiSearch');
        this.config.update(cfg => ({
          ...cfg,
          label: 'Loading Demo (API Search)'
        }));
        break;
      case 'signalForms':
        this.playgroundMode.set('signalForms');
        this.signalFormsValue.set(null);
        this.signalFormsTouched.set(false);
        this.config.update(cfg => ({
          ...cfg,
          value: null,
          placeholder: 'Select technology',
          label: 'Technology (Signal Forms)',
          required: true,
          clearable: true
        }));
        break;
    }
  }

  getDisplayCode(): string {
    const mode = this.playgroundMode();
    if (mode === 'signalForms') {
      return `// Signal Forms state
readonly formValue = signal<string | number | null>(null);
readonly formTouched = signal(false);
readonly formErrors = computed(() => {
  if (!this.formTouched()) return null;
  if (!this.formValue()) return { required: true };
  return null;
});
readonly hasError = computed(() => this.formTouched() && !!this.formErrors());

// Template
<oct-search-select
  [options]="frameworkOptions"
  [value]="formValue()"
  [error]="hasError()"
  [errorText]="formErrors()?.required ? 'This field is required' : ''"
  label="Technology"
  placeholder="Select technology"
  [required]="true"
  [clearable]="true"
  (valueChange)="onValueChange($event)"
  (openChange)="!$event && formTouched.set(true)">
</oct-search-select>`;
    }
    return this.generatedCode();
  }

  /**
   * Search config for framework search in reactive form
   */
  readonly frameworkSearchConfig: SearchSelectSearchConfig = {
    searchFn: this.mockApiSearchFunction,
    debounceMs: 300,
    minLength: 1,
    emptyText: 'No frameworks found',
    placeholder: 'Search frameworks...'
  };

  onInteractiveValueChange(value: SearchSelectValue): void {
    this.config.update(cfg => ({ ...cfg, value }));
  }

  onFrameworkChange(value: SearchSelectValue): void {
    this.selectedFramework.set(this.toScalar(value));
  }

  onTechnologyChange(value: SearchSelectValue): void {
    this.selectedTechnology.set(this.toScalar(value));
  }

  onLanguageChange(value: SearchSelectValue): void {
    this.selectedLanguage.set(this.toScalar(value));
  }

  onCountryChange(value: SearchSelectValue): void {
    this.selectedCountry.set(this.toScalar(value));
  }

  /** Multi-select demo handler */
  onFrameworksMultiChange(value: SearchSelectValue): void {
    this.selectedFrameworksMulti.set(Array.isArray(value) ? value : []);
  }

  /** Narrow a possibly-array value back to a scalar for single-select demo signals. */
  private toScalar(value: SearchSelectValue): string | number | null {
    return Array.isArray(value) ? (value[0] ?? null) : value;
  }

  /**
   * Preload clients for API search mode
   * This function is called when the component needs to pre-load data
   */
  preloadClients = async (): Promise<SearchSelectOption[]> => {
    const options = await searchDemoClients('');
    this.clientOptions.set(options);
    return options;
  };

  preloadCountries = (): Promise<SearchSelectOption[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const countries: SearchSelectOption[] = [
          { value: 'us', label: 'United States', description: 'North America' },
          { value: 'uk', label: 'United Kingdom', description: 'Europe' },
          { value: 'ca', label: 'Canada', description: 'North America' },
          { value: 'de', label: 'Germany', description: 'Europe' },
          { value: 'fr', label: 'France', description: 'Europe' },
          { value: 'jp', label: 'Japan', description: 'Asia' },
          { value: 'au', label: 'Australia', description: 'Oceania' },
          { value: 'br', label: 'Brazil', description: 'South America' },
          { value: 'in', label: 'India', description: 'Asia' },
          { value: 'cn', label: 'China', description: 'Asia' },
          { value: 'mx', label: 'Mexico', description: 'North America' },
          { value: 'it', label: 'Italy', description: 'Europe' },
          { value: 'es', label: 'Spain', description: 'Europe' },
          { value: 'kr', label: 'South Korea', description: 'Asia' },
          { value: 'nl', label: 'Netherlands', description: 'Europe' }
        ];

        resolve(countries);
      }, 1000);
    });
  };

  // Signal Forms handlers (matches oct-select pattern)
  onSignalFormsValueChange(value: SearchSelectValue): void {
    this.signalFormsValue.set(value);
    this.signalFormsSubmitted.set(false);
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
      this.signalFormsErrors.set([{ message: 'Please select a technology' }]);
    } else {
      this.signalFormsErrors.set([]);
    }
  }

  onSubmitSignalForms(): void {
    this.validateSignalForms();
    if (!this.signalFormsHasError() && this.signalFormsValue()) {
      this.signalFormsSubmitted.set(true);
    }
  }

  onResetSignalForms(): void {
    this.signalFormsValue.set(null);
    this.signalFormsTouched.set(false);
    this.signalFormsSubmitted.set(false);
    this.signalFormsErrors.set([]);
  }
}
