import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FilterComponent, FilterOption, enumToFilterOptions } from 'ngx-hr-ui';
import { TableComponent } from 'ngx-hr-ui';
import { TableColumn } from 'ngx-hr-ui';
import { CardComponent, CardContentComponent } from 'ngx-hr-ui';
import { ButtonComponent } from 'ngx-hr-ui';
import { TextComponent } from 'ngx-hr-ui';
import { InputComponent } from 'ngx-hr-ui';

// Example enum for demonstration
enum Status {
  Active = 'Active',
  Inactive = 'Inactive',
  Pending = 'Pending',
  Archived = 'Archived'
}

enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

interface ExampleData {
  id: string;
  name: string;
  status: Status;
  priority: Priority;
  date: string;
}

interface FilterConfig {
  label: string;
  width: string;
  offsetY: number;
}

@Component({
  selector: 'oct-filter-page',
  templateUrl: './filter.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, FilterComponent, TableComponent, CardComponent, CardContentComponent, ButtonComponent, TextComponent, InputComponent]
})
export class FilterPageComponent {
  // Interactive Playground Configuration
  readonly config = signal<FilterConfig>({
    label: 'Status',
    width: '280px',
    offsetY: 8
  });

  // Filter options
  readonly statusOptions: FilterOption<Status>[] = enumToFilterOptions(Status);
  readonly priorityOptions: FilterOption<Priority>[] = enumToFilterOptions(Priority);

  // Searchable checkbox filter options
  readonly frameworkFilterOptions = signal<FilterOption<string>[]>([
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'nextjs', label: 'Next.js' }
  ]);

  readonly countryFilterOptions = signal<FilterOption<string>[]>([
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
    { value: 'cn', label: 'China' },
    { value: 'in', label: 'India' },
    { value: 'br', label: 'Brazil' }
  ]);

  readonly departmentOptions = signal<FilterOption<string>[]>([
    { value: 'eng', label: 'Engineering' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'ops', label: 'Operations' },
    { value: 'legal', label: 'Legal' },
    { value: 'support', label: 'Customer Support' }
  ]);

  // Playground filter state
  readonly playgroundFilter = signal<unknown[]>([]);

  // Computed values for playground state
  readonly playgroundHasSelections = computed(() => this.playgroundFilter().length > 0);
  readonly playgroundSelectionCount = computed(() => this.playgroundFilter().length);

  // Example filters state
  readonly statusFilter = signal<Status[]>([]);
  readonly priorityFilter = signal<Priority[]>([]);

  // Searchable checkbox mode filters
  readonly frameworkFilter = signal<unknown[]>([]);
  readonly countryFilter = signal<unknown[]>([]);
  readonly departmentFilter = signal<unknown[]>([]);

  // Sample data
  readonly allData: ExampleData[] = [
    {
      id: '1',
      name: 'Project Alpha',
      status: Status.Active,
      priority: Priority.High,
      date: '2024-01-15'
    },
    {
      id: '2',
      name: 'Project Beta',
      status: Status.Inactive,
      priority: Priority.Low,
      date: '2024-01-16'
    },
    {
      id: '3',
      name: 'Project Gamma',
      status: Status.Pending,
      priority: Priority.Medium,
      date: '2024-01-17'
    },
    {
      id: '4',
      name: 'Project Delta',
      status: Status.Active,
      priority: Priority.Critical,
      date: '2024-01-18'
    },
    {
      id: '5',
      name: 'Project Epsilon',
      status: Status.Archived,
      priority: Priority.Low,
      date: '2024-01-19'
    },
    {
      id: '6',
      name: 'Project Zeta',
      status: Status.Active,
      priority: Priority.High,
      date: '2024-01-20'
    },
    {
      id: '7',
      name: 'Project Eta',
      status: Status.Pending,
      priority: Priority.Medium,
      date: '2024-01-21'
    },
    {
      id: '8',
      name: 'Project Theta',
      status: Status.Inactive,
      priority: Priority.Low,
      date: '2024-01-22'
    }
  ];

  // Filtered data signal
  readonly filteredData = signal<ExampleData[]>(this.allData);

  // Table columns
  readonly columns: TableColumn[] = [
    { key: 'name', label: 'Name', sortable: true, width: 'auto' },
    { key: 'status', label: 'Status', sortable: true, width: '120px' },
    { key: 'priority', label: 'Priority', sortable: true, width: '120px' },
    { key: 'date', label: 'Date', sortable: true, width: '150px' }
  ];

  // Computed code generation
  readonly generatedCode = computed(() => {
    const cfg = this.config();
    const props: string[] = [];

    props.push(`  label="${cfg.label}"`);
    props.push(`  [options]="statusOptions"`);
    props.push(`  [(selectedValues)]="statusFilter"`);
    props.push(`  (filterChange)="onStatusFilterChange($event)"`);

    if (cfg.width !== '280px') {
      props.push(`  width="${cfg.width}"`);
    }
    if (cfg.offsetY !== 8) {
      props.push(`  [offsetY]="${cfg.offsetY}"`);
    }

    const propsString = props.join('\n');

    return `<oct-filter
${propsString} />

<!-- Component Setup -->
export class MyComponent {
  readonly statusFilter = signal<Status[]>([]);
  readonly statusOptions: FilterOption<Status>[] = enumToFilterOptions(Status);

  onStatusFilterChange(selectedStatuses: unknown[]): void {
    this.statusFilter.set(selectedStatuses as Status[]);
    // Apply filtering logic
  }
}`;
  });

  /**
   * Update playground configuration
   */
  updateConfig<K extends keyof FilterConfig>(key: K, value: FilterConfig[K]): void {
    this.config.update(cfg => ({ ...cfg, [key]: value }));
  }

  /**
   * Handle label input change
   */
  onLabelInputChange(value: string): void {
    this.updateConfig('label', value);
  }

  /**
   * Handle width input change
   */
  onWidthInputChange(value: string): void {
    this.updateConfig('width', value);
  }

  /**
   * Handle offset input change
   */
  onOffsetInputChange(value: string): void {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      this.updateConfig('offsetY', numValue);
    }
  }

  /**
   * Apply quick presets
   */
  applyPreset(preset: string): void {
    switch (preset) {
      case 'default':
        this.config.set({
          label: 'Status',
          width: '280px',
          offsetY: 8
        });
        this.playgroundFilter.set([]);
        break;
      case 'withSelections':
        this.config.update(cfg => ({
          ...cfg,
          label: 'Status'
        }));
        this.playgroundFilter.set([Status.Active, Status.Pending]);
        break;
      case 'multipleFilters':
        this.config.update(cfg => ({
          ...cfg,
          label: 'Priority'
        }));
        break;
      case 'customWidth':
        this.config.update(cfg => ({
          ...cfg,
          width: '350px',
          label: 'Wide Filter'
        }));
        break;
    }
  }

  /**
   * Handle playground filter changes
   */
  onPlaygroundFilterChange(selectedValues: unknown[]): void {
    this.playgroundFilter.set(selectedValues);
  }

  /**
   * Handle status filter changes
   */
  onStatusFilterChange(selectedStatuses: unknown[]): void {
    this.statusFilter.set(selectedStatuses as Status[]);
    this.applyFilters();
  }

  /**
   * Handle priority filter changes
   */
  onPriorityFilterChange(selectedPriorities: unknown[]): void {
    this.priorityFilter.set(selectedPriorities as Priority[]);
    this.applyFilters();
  }

  /**
   * Apply all filters to the data
   */
  private applyFilters(): void {
    let filtered = [...this.allData];

    const statuses = this.statusFilter();
    const priorities = this.priorityFilter();

    // Filter by status
    if (statuses.length > 0) {
      filtered = filtered.filter(item => statuses.includes(item.status));
    }

    // Filter by priority
    if (priorities.length > 0) {
      filtered = filtered.filter(item => priorities.includes(item.priority));
    }

    this.filteredData.set(filtered);
  }

  /**
   * Clear all filters
   */
  clearAllFilters(): void {
    this.statusFilter.set([]);
    this.priorityFilter.set([]);
    this.filteredData.set(this.allData);
  }

  /**
   * Handle framework filter changes (search-select mode)
   */
  onFrameworkFilterChange(selectedValues: unknown[]): void {
    this.frameworkFilter.set(selectedValues);
  }

  /**
   * Handle country filter changes (search-select mode with preload)
   */
  onCountryFilterChange(selectedValues: unknown[]): void {
    this.countryFilter.set(selectedValues);
  }

  /**
   * Handle department filter changes (search-select mode with API search)
   */
  onDepartmentFilterChange(selectedValues: unknown[]): void {
    this.departmentFilter.set(selectedValues);
  }

  // Code examples
  readonly basicUsageCode = `<oct-filter
  label="Status"
  [options]="statusOptions"
  [(selectedValues)]="statusFilter"
  (filterChange)="onStatusFilterChange($event)" />`;

  readonly multipleFiltersCode = `<div class="flex items-center gap-3">
  <oct-filter
    label="Status"
    [options]="statusOptions"
    [(selectedValues)]="statusFilter"
    (filterChange)="onStatusFilterChange($event)" />

  <oct-filter
    label="Priority"
    [options]="priorityOptions"
    [(selectedValues)]="priorityFilter"
    (filterChange)="onPriorityFilterChange($event)" />
</div>`;

  readonly customWidthCode = `<!-- Default width: 280px -->
<oct-filter
  label="Status"
  [options]="statusOptions"
  [(selectedValues)]="statusFilter" />

<!-- Custom width: 350px -->
<oct-filter
  label="Status"
  width="350px"
  [options]="statusOptions"
  [(selectedValues)]="statusFilter" />

<!-- Custom width: 400px for longer labels -->
<oct-filter
  label="Client Department"
  width="400px"
  [options]="departmentOptions"
  [searchable]="true"
  [(selectedValues)]="departmentFilter" />`;

  readonly enumConversionCode = `import { enumToFilterOptions } from 'ngx-hr-ui';

enum Status {
  Active = 'Active',
  Inactive = 'Inactive'
}

// Convert enum to filter options
readonly statusOptions: FilterOption<Status>[] = enumToFilterOptions(Status);`;

  readonly componentCode = `import { FilterComponent, FilterOption, enumToFilterOptions } from 'ngx-hr-ui';

@Component({
  selector: 'oct-example',
  imports: [FilterComponent]
})
export class ExampleComponent {
  readonly statusFilter = signal<Status[]>([]);
  readonly statusOptions: FilterOption<Status>[] = enumToFilterOptions(Status);

  onStatusFilterChange(selectedStatuses: unknown[]): void {
    this.statusFilter.set(selectedStatuses as Status[]);
    // Apply filtering logic
  }
}`;

  // Searchable checkbox code examples
  readonly searchableCheckboxCode = `<oct-filter
  label="Framework"
  [options]="frameworkOptions()"
  [searchable]="true"
  searchPlaceholder="Search frameworks..."
  [(selectedValues)]="frameworkFilter"
  (filterChange)="onFrameworkFilterChange($event)" />

<!-- Component Setup -->
readonly frameworkOptions = signal<FilterOption<string>[]>([
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' }
]);
readonly frameworkFilter = signal<unknown[]>([]);`;

  readonly searchableCheckboxLargeCode = `<oct-filter
  label="Department"
  [options]="departmentOptions()"
  [searchable]="true"
  searchPlaceholder="Search departments..."
  [(selectedValues)]="departmentFilter"
  (filterChange)="onDepartmentFilterChange($event)" />

<!-- Component Setup -->
readonly departmentOptions = signal<FilterOption<string>[]>([
  { value: 'eng', label: 'Engineering' },
  { value: 'sales', label: 'Sales' },
  // ... more options
]);
readonly departmentFilter = signal<unknown[]>([]);`;

  readonly searchablePreloadCode = `<oct-filter
  label="Country"
  [options]="countryOptions()"
  [searchable]="true"
  searchPlaceholder="Search countries..."
  [(selectedValues)]="countryFilter"
  (filterChange)="onCountryFilterChange($event)" />

<!-- Component Setup -->
readonly countryOptions = signal<FilterOption<string>[]>([]);

constructor() {
  // Load options upfront
  this.loadCountryOptions();
}

private async loadCountryOptions(): Promise<void> {
  const response = await this.api.getCountries();
  this.countryOptions.set(
    response.map(c => ({ value: c.code, label: c.name }))
  );
}`;
}
