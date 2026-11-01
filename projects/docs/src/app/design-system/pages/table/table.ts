import { Component, ChangeDetectionStrategy, signal, computed, viewChild, TemplateRef } from '@angular/core';

import { TableComponent } from 'ngx-hr-ui';
import {
  TableColumn,
  TablePagination,
  TableFilter,
  TableSort,
  TableSelectionConfig,
  TableSelection,
  RowActionsFn,
  TableCellEdit,
  TableEditType
} from 'ngx-hr-ui';
import { ButtonComponent } from 'ngx-hr-ui';
import { CardComponent, CardContentComponent } from 'ngx-hr-ui';
import { CheckboxComponent } from 'ngx-hr-ui';
import { TextComponent } from 'ngx-hr-ui';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  joinDate: string;
  department: string;
  location: string;
  salary: number;
  manager: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'available' | 'out-of-stock' | 'discontinued';
  rating: number;
  description: string;
  brand: string;
  weight: number;
  sku: string;
  featured: boolean;
}

/**
 * Sample row for the inline-edit demo ONLY. The table imposes no shape — any row
 * type works; editability is configured per-column via TableColumn.editable.
 * (Just like the User / Product demos above, this is local sample data.)
 */
interface EditableDemoRow {
  id: number;
  name: string;
  amount: number;
  quantity: number;
  note: string;
  /** When true, the Amount cell is locked — demonstrates the per-row editable predicate. */
  locked: boolean;
}

@Component({
  selector: 'oct-table-page',
  templateUrl: './table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent, ButtonComponent, TextComponent, CardComponent, CardContentComponent, CheckboxComponent]
})
export class TablePageComponent {
  readonly featuredTemplate = viewChild<TemplateRef<any>>('featuredTemplate');

  private readonly activeTab = signal<'basic' | 'advanced' | 'api' | 'code'>('basic');
  private readonly isLoading = signal<boolean>(false);

  constructor() {
    setTimeout(() => this.applyPreset('basic'), 0);
  }

  // New state for interactive playground
  private readonly activeTableTypeSignal = signal<'basic' | 'advanced' | 'api' | 'no-data'>('basic');
  private readonly tableStripedSignal = signal<boolean>(false);
  private readonly tableHoverableSignal = signal<boolean>(false);
  private readonly tableClickableRowsSignal = signal<boolean>(false);
  private readonly tableCellLinesSignal = signal<boolean>(false);
  private readonly tableDenseSignal = signal<boolean>(false);
  private readonly tableTitleSignal = signal<string>('User Management Table');
  private readonly tableDescriptionSignal = signal<string>('Manage and view user data with sorting and filtering');

  private readonly selectionEnabledSignal = signal<boolean>(false);
  private readonly selectionModeSignal = signal<'single' | 'multiple'>('multiple');
  private readonly currentSelectionSignal = signal<TableSelection<any>>({
    selectedRows: [],
    selectedIds: [],
    isAllSelected: false,
    isIndeterminate: false
  });

  private readonly currentPagination = signal<TablePagination>({
    page: 1,
    pageSize: 10,
    totalNums: 0,
    totalNumPages: 0
  });

  private readonly currentFilters = signal<TableFilter[]>([]);
  private readonly currentSort = signal<TableSort>({ key: '', direction: null });

  // ── Inline editing demo ─────────────────────────────────────────────────
  // Generic showcase: arbitrary sample rows, with a non-editable column plus the
  // three edit types (text / decimal / integer) and a per-row lock. Nothing here
  // is special to any domain — only the column config drives editability.
  readonly inlineEditData = signal<EditableDemoRow[]>([
    { id: 1, name: 'Item A', amount: 3.5, quantity: 2, note: 'Editable row', locked: false },
    { id: 2, name: 'Item B', amount: 6, quantity: 5, note: '', locked: false },
    { id: 3, name: 'Item C', amount: 0, quantity: 0, note: 'Amount locked (per-row predicate)', locked: true }
  ]);

  /** Name = read-only; Amount = editable decimal (locked on row 3); Quantity = editable integer; Note = editable text. */
  readonly inlineEditColumns: TableColumn<EditableDemoRow>[] = [
    { key: 'name', label: 'Name', sortable: false, width: '140px' },
    {
      key: 'amount',
      label: 'Amount',
      sortable: false,
      align: 'right',
      width: '120px',
      editable: (row: EditableDemoRow) => !row.locked,
      editType: TableEditType.Number,
      editMin: 0,
      editStep: 0.5
    },
    {
      key: 'quantity',
      label: 'Quantity',
      sortable: false,
      align: 'right',
      width: '120px',
      editable: true,
      editType: TableEditType.Number,
      editMin: 0,
      editInteger: true
    },
    { key: 'note', label: 'Note', sortable: false, width: '240px', editable: true, editType: TableEditType.Text }
  ];

  /** Last committed edit, shown below the demo table to illustrate the cellValueChange contract. */
  readonly lastInlineEdit = signal<string | null>(null);

  /** Apply a committed inline edit to the demo data and log the emitted event. */
  onDemoCellEdit(event: TableCellEdit<EditableDemoRow>): void {
    const key = event.column.key as keyof EditableDemoRow;
    this.inlineEditData.update(rows => rows.map((r, i) => (i === event.rowIndex ? ({ ...r, [key]: event.value } as EditableDemoRow) : r)));
    const type = event.value === null ? 'null' : typeof event.value;
    this.lastInlineEdit.set(`row ${event.rowIndex} · ${event.column.key} = ${event.value} (${type})`);
  }

  readonly sampleUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-03-15',
      department: 'Engineering',
      location: 'San Francisco',
      salary: 120000,
      manager: 'Sarah Johnson'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'User',
      status: 'active',
      lastLogin: '2024-01-14',
      joinDate: '2023-05-20',
      department: 'Marketing',
      location: 'New York',
      salary: 75000,
      manager: 'Mike Chen'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@company.com',
      role: 'Moderator',
      status: 'inactive',
      lastLogin: '2024-01-10',
      joinDate: '2023-07-12',
      department: 'Sales',
      location: 'Chicago',
      salary: 85000,
      manager: 'Lisa Wang'
    },
    {
      id: 4,
      name: 'Alice Wilson',
      email: 'alice.wilson@company.com',
      role: 'User',
      status: 'pending',
      lastLogin: 'Never',
      joinDate: '2024-01-01',
      department: 'HR',
      location: 'Austin',
      salary: 65000,
      manager: 'Maria Garcia'
    },
    {
      id: 5,
      name: 'Charlie Brown',
      email: 'charlie.brown@company.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-01-10',
      department: 'Engineering',
      location: 'San Francisco',
      salary: 115000,
      manager: 'Sarah Johnson'
    },
    {
      id: 6,
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      role: 'Manager',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2022-11-08',
      department: 'Finance',
      location: 'Boston',
      salary: 95000,
      manager: 'Amanda Robinson'
    },
    {
      id: 7,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      role: 'Developer',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-02-28',
      department: 'Engineering',
      location: 'Seattle',
      salary: 105000,
      manager: 'Sarah Johnson'
    },
    {
      id: 8,
      name: 'Sarah Martinez',
      email: 'sarah.martinez@company.com',
      role: 'Designer',
      status: 'active',
      lastLogin: '2024-01-14',
      joinDate: '2023-06-15',
      department: 'Design',
      location: 'Los Angeles',
      salary: 80000,
      manager: 'Kevin Nguyen'
    },
    {
      id: 9,
      name: 'David Lee',
      email: 'david.lee@company.com',
      role: 'Analyst',
      status: 'inactive',
      lastLogin: '2024-01-05',
      joinDate: '2023-04-10',
      department: 'Analytics',
      location: 'Denver',
      salary: 78000,
      manager: 'Olivia Zhang'
    },
    {
      id: 10,
      name: 'Lisa Wang',
      email: 'lisa.wang@company.com',
      role: 'Manager',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2022-09-20',
      department: 'Product',
      location: 'San Francisco',
      salary: 110000,
      manager: 'Jennifer Liu'
    },
    {
      id: 11,
      name: 'James Taylor',
      email: 'james.taylor@company.com',
      role: 'Developer',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-08-05',
      department: 'Engineering',
      location: 'Portland',
      salary: 98000,
      manager: 'Sarah Johnson'
    },
    {
      id: 12,
      name: 'Maria Garcia',
      email: 'maria.garcia@company.com',
      role: 'HR Manager',
      status: 'active',
      lastLogin: '2024-01-14',
      joinDate: '2022-12-01',
      department: 'HR',
      location: 'Miami',
      salary: 87000,
      manager: 'CEO'
    },
    {
      id: 13,
      name: 'Robert Kim',
      email: 'robert.kim@company.com',
      role: 'Sales Rep',
      status: 'pending',
      lastLogin: '2024-01-13',
      joinDate: '2024-01-10',
      department: 'Sales',
      location: 'Atlanta',
      salary: 68000,
      manager: 'Bob Johnson'
    },
    {
      id: 14,
      name: 'Jennifer Liu',
      email: 'jennifer.liu@company.com',
      role: 'Product Owner',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-03-25',
      department: 'Product',
      location: 'San Jose',
      salary: 125000,
      manager: 'CEO'
    },
    {
      id: 15,
      name: 'Thomas Anderson',
      email: 'thomas.anderson@company.com',
      role: 'DevOps',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-05-15',
      department: 'Engineering',
      location: 'Remote',
      salary: 112000,
      manager: 'Sarah Johnson'
    },
    {
      id: 16,
      name: 'Emma Wilson',
      email: 'emma.wilson@company.com',
      role: 'Content Manager',
      status: 'active',
      lastLogin: '2024-01-14',
      joinDate: '2023-07-20',
      department: 'Marketing',
      location: 'Phoenix',
      salary: 72000,
      manager: 'Mike Chen'
    },
    {
      id: 17,
      name: 'Daniel Park',
      email: 'daniel.park@company.com',
      role: 'QA Engineer',
      status: 'inactive',
      lastLogin: '2024-01-08',
      joinDate: '2023-09-10',
      department: 'Engineering',
      location: 'San Diego',
      salary: 88000,
      manager: 'Sarah Johnson'
    },
    {
      id: 18,
      name: 'Olivia Zhang',
      email: 'olivia.zhang@company.com',
      role: 'Business Analyst',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-04-05',
      department: 'Analytics',
      location: 'Dallas',
      salary: 85000,
      manager: 'CEO'
    },
    {
      id: 19,
      name: 'Kevin Nguyen',
      email: 'kevin.nguyen@company.com',
      role: 'UX Designer',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-06-30',
      department: 'Design',
      location: 'San Francisco',
      salary: 92000,
      manager: 'CEO'
    },
    {
      id: 20,
      name: 'Amanda Robinson',
      email: 'amanda.robinson@company.com',
      role: 'Finance Manager',
      status: 'active',
      lastLogin: '2024-01-14',
      joinDate: '2022-10-15',
      department: 'Finance',
      location: 'New York',
      salary: 105000,
      manager: 'CEO'
    },
    {
      id: 21,
      name: 'Ryan Murphy',
      email: 'ryan.murphy@company.com',
      role: 'Developer',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-11-12',
      department: 'Engineering',
      location: 'Austin',
      salary: 95000,
      manager: 'Sarah Johnson'
    },
    {
      id: 22,
      name: 'Sophie Turner',
      email: 'sophie.turner@company.com',
      role: 'Content Writer',
      status: 'active',
      lastLogin: '2024-01-14',
      joinDate: '2023-08-22',
      department: 'Marketing',
      location: 'Remote',
      salary: 68000,
      manager: 'Mike Chen'
    },
    {
      id: 23,
      name: 'Alex Thompson',
      email: 'alex.thompson@company.com',
      role: 'DevOps Engineer',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-04-18',
      department: 'Engineering',
      location: 'Seattle',
      salary: 108000,
      manager: 'Sarah Johnson'
    },
    {
      id: 24,
      name: 'Maya Patel',
      email: 'maya.patel@company.com',
      role: 'UX Researcher',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-07-05',
      department: 'Design',
      location: 'San Francisco',
      salary: 89000,
      manager: 'Kevin Nguyen'
    },
    {
      id: 25,
      name: 'Connor Walsh',
      email: 'connor.walsh@company.com',
      role: 'Sales Manager',
      status: 'active',
      lastLogin: '2024-01-14',
      joinDate: '2023-01-30',
      department: 'Sales',
      location: 'Chicago',
      salary: 92000,
      manager: 'CEO'
    },
    {
      id: 26,
      name: 'Isabella Cruz',
      email: 'isabella.cruz@company.com',
      role: 'Data Scientist',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-09-11',
      department: 'Analytics',
      location: 'Boston',
      salary: 115000,
      manager: 'Olivia Zhang'
    },
    {
      id: 27,
      name: 'Nathan Brooks',
      email: 'nathan.brooks@company.com',
      role: 'Project Manager',
      status: 'inactive',
      lastLogin: '2024-01-08',
      joinDate: '2023-06-14',
      department: 'Product',
      location: 'Portland',
      salary: 88000,
      manager: 'Lisa Wang'
    },
    {
      id: 28,
      name: 'Grace Kim',
      email: 'grace.kim@company.com',
      role: 'Security Analyst',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-12-01',
      department: 'Security',
      location: 'Washington DC',
      salary: 96000,
      manager: 'CEO'
    },
    {
      id: 29,
      name: 'Lucas Martinez',
      email: 'lucas.martinez@company.com',
      role: 'Frontend Developer',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-10-25',
      department: 'Engineering',
      location: 'Austin',
      salary: 92000,
      manager: 'Sarah Johnson'
    },
    {
      id: 30,
      name: 'Zoe Williams',
      email: 'zoe.williams@company.com',
      role: 'Graphic Designer',
      status: 'active',
      lastLogin: '2024-01-14',
      joinDate: '2023-05-08',
      department: 'Design',
      location: 'Los Angeles',
      salary: 75000,
      manager: 'Kevin Nguyen'
    },
    {
      id: 31,
      name: 'Ethan Davis',
      email: 'ethan.davis@company.com',
      role: 'Backend Developer',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-03-20',
      department: 'Engineering',
      location: 'Remote',
      salary: 102000,
      manager: 'Sarah Johnson'
    },
    {
      id: 32,
      name: 'Chloe Anderson',
      email: 'chloe.anderson@company.com',
      role: 'Marketing Specialist',
      status: 'pending',
      lastLogin: 'Never',
      joinDate: '2024-01-10',
      department: 'Marketing',
      location: 'Miami',
      salary: 62000,
      manager: 'Mike Chen'
    },
    {
      id: 33,
      name: 'Owen Johnson',
      email: 'owen.johnson@company.com',
      role: 'Database Admin',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-08-15',
      department: 'IT',
      location: 'Denver',
      salary: 91000,
      manager: 'Thomas Anderson'
    },
    {
      id: 34,
      name: 'Lily Chen',
      email: 'lily.chen@company.com',
      role: 'Product Designer',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-11-28',
      department: 'Design',
      location: 'San Jose',
      salary: 87000,
      manager: 'Kevin Nguyen'
    },
    {
      id: 35,
      name: 'Mason Taylor',
      email: 'mason.taylor@company.com',
      role: 'Full Stack Developer',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-07-19',
      department: 'Engineering',
      location: 'San Francisco',
      salary: 118000,
      manager: 'Sarah Johnson'
    },
    {
      id: 36,
      name: 'Aria Wilson',
      email: 'aria.wilson@company.com',
      role: 'Accountant',
      status: 'active',
      lastLogin: '2024-01-14',
      joinDate: '2023-09-05',
      department: 'Finance',
      location: 'New York',
      salary: 71000,
      manager: 'Amanda Robinson'
    },
    {
      id: 37,
      name: 'Logan Brown',
      email: 'logan.brown@company.com',
      role: 'Systems Administrator',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-02-14',
      department: 'IT',
      location: 'Phoenix',
      salary: 83000,
      manager: 'Thomas Anderson'
    },
    {
      id: 38,
      name: 'Mia Rodriguez',
      email: 'mia.rodriguez@company.com',
      role: 'Social Media Manager',
      status: 'active',
      lastLogin: '2024-01-14',
      joinDate: '2023-06-07',
      department: 'Marketing',
      location: 'Los Angeles',
      salary: 64000,
      manager: 'Mike Chen'
    },
    {
      id: 39,
      name: 'Carter Lee',
      email: 'carter.lee@company.com',
      role: 'Mobile Developer',
      status: 'inactive',
      lastLogin: '2024-01-09',
      joinDate: '2023-10-12',
      department: 'Engineering',
      location: 'Seattle',
      salary: 99000,
      manager: 'Sarah Johnson'
    },
    {
      id: 40,
      name: 'Harper Zhang',
      email: 'harper.zhang@company.com',
      role: 'Operations Manager',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-04-25',
      department: 'Operations',
      location: 'Dallas',
      salary: 93000,
      manager: 'CEO'
    },
    {
      id: 41,
      name: 'Aiden Murphy',
      email: 'aiden.murphy@company.com',
      role: 'Technical Writer',
      status: 'active',
      lastLogin: '2024-01-14',
      joinDate: '2023-12-15',
      department: 'Engineering',
      location: 'Remote',
      salary: 72000,
      manager: 'Sarah Johnson'
    },
    {
      id: 42,
      name: 'Scarlett Davis',
      email: 'scarlett.davis@company.com',
      role: 'Customer Success Manager',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-08-08',
      department: 'Customer Success',
      location: 'Atlanta',
      salary: 78000,
      manager: 'CEO'
    },
    {
      id: 43,
      name: 'Grayson Wilson',
      email: 'grayson.wilson@company.com',
      role: 'Cloud Architect',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-01-12',
      department: 'Engineering',
      location: 'Austin',
      salary: 125000,
      manager: 'Sarah Johnson'
    },
    {
      id: 44,
      name: 'Avery Martinez',
      email: 'avery.martinez@company.com',
      role: 'Compliance Officer',
      status: 'active',
      lastLogin: '2024-01-14',
      joinDate: '2023-11-03',
      department: 'Legal',
      location: 'Washington DC',
      salary: 89000,
      manager: 'CEO'
    },
    {
      id: 45,
      name: 'Elijah Johnson',
      email: 'elijah.johnson@company.com',
      role: 'Machine Learning Engineer',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-09-18',
      department: 'Analytics',
      location: 'San Francisco',
      salary: 128000,
      manager: 'Olivia Zhang'
    },
    {
      id: 46,
      name: 'Luna Garcia',
      email: 'luna.garcia@company.com',
      role: 'Event Coordinator',
      status: 'pending',
      lastLogin: 'Never',
      joinDate: '2024-01-08',
      department: 'Marketing',
      location: 'Miami',
      salary: 58000,
      manager: 'Mike Chen'
    },
    {
      id: 47,
      name: 'Sebastian Brown',
      email: 'sebastian.brown@company.com',
      role: 'Network Engineer',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-07-22',
      department: 'IT',
      location: 'Chicago',
      salary: 94000,
      manager: 'Thomas Anderson'
    },
    {
      id: 48,
      name: 'Nova Williams',
      email: 'nova.williams@company.com',
      role: 'Brand Manager',
      status: 'active',
      lastLogin: '2024-01-14',
      joinDate: '2023-05-17',
      department: 'Marketing',
      location: 'New York',
      salary: 85000,
      manager: 'Mike Chen'
    },
    {
      id: 49,
      name: 'Hudson Taylor',
      email: 'hudson.taylor@company.com',
      role: 'Site Reliability Engineer',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-10-07',
      department: 'Engineering',
      location: 'San Jose',
      salary: 112000,
      manager: 'Sarah Johnson'
    },
    {
      id: 50,
      name: 'Stella Anderson',
      email: 'stella.anderson@company.com',
      role: 'Legal Counsel',
      status: 'active',
      lastLogin: '2024-01-14',
      joinDate: '2023-03-28',
      department: 'Legal',
      location: 'Boston',
      salary: 135000,
      manager: 'CEO'
    },
    {
      id: 51,
      name: 'Felix Martinez',
      email: 'felix.martinez@company.com',
      role: 'Game Developer',
      status: 'inactive',
      lastLogin: '2024-01-06',
      joinDate: '2023-12-20',
      department: 'Engineering',
      location: 'Remote',
      salary: 97000,
      manager: 'Sarah Johnson'
    },
    {
      id: 52,
      name: 'Hazel Davis',
      email: 'hazel.davis@company.com',
      role: 'Business Development',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-06-30',
      department: 'Sales',
      location: 'Seattle',
      salary: 81000,
      manager: 'Connor Walsh'
    },
    {
      id: 53,
      name: 'Jasper Wilson',
      email: 'jasper.wilson@company.com',
      role: 'AI Researcher',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-08-16',
      department: 'Research',
      location: 'San Francisco',
      salary: 140000,
      manager: 'CEO'
    },
    {
      id: 54,
      name: 'Iris Chen',
      email: 'iris.chen@company.com',
      role: 'Quality Assurance',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-11-09',
      department: 'Engineering',
      location: 'Austin',
      salary: 76000,
      manager: 'Sarah Johnson'
    },
    {
      id: 55,
      name: 'River Johnson',
      email: 'river.johnson@company.com',
      role: 'Blockchain Developer',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-04-11',
      department: 'Engineering',
      location: 'Miami',
      salary: 119000,
      manager: 'Sarah Johnson'
    },
    {
      id: 56,
      name: 'Willow Rodriguez',
      email: 'willow.rodriguez@company.com',
      role: 'Training Specialist',
      status: 'active',
      lastLogin: '2024-01-14',
      joinDate: '2023-09-25',
      department: 'HR',
      location: 'Phoenix',
      salary: 67000,
      manager: 'Maria Garcia'
    },
    {
      id: 57,
      name: 'Phoenix Lee',
      email: 'phoenix.lee@company.com',
      role: 'Cybersecurity Analyst',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-07-13',
      department: 'Security',
      location: 'Washington DC',
      salary: 98000,
      manager: 'Grace Kim'
    },
    {
      id: 58,
      name: 'Sage Thompson',
      email: 'sage.thompson@company.com',
      role: 'Video Editor',
      status: 'pending',
      lastLogin: 'Never',
      joinDate: '2024-01-12',
      department: 'Marketing',
      location: 'Los Angeles',
      salary: 65000,
      manager: 'Mike Chen'
    },
    {
      id: 59,
      name: 'Atlas Brown',
      email: 'atlas.brown@company.com',
      role: 'Data Engineer',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2023-05-24',
      department: 'Analytics',
      location: 'Seattle',
      salary: 109000,
      manager: 'Olivia Zhang'
    },
    {
      id: 60,
      name: 'Juniper Wilson',
      email: 'juniper.wilson@company.com',
      role: 'Product Marketing Manager',
      status: 'active',
      lastLogin: '2024-01-14',
      joinDate: '2023-02-28',
      department: 'Marketing',
      location: 'San Francisco',
      salary: 96000,
      manager: 'Mike Chen'
    },
    {
      id: 101,
      name: 'Alex Chen',
      email: 'alex.chen@company.com',
      role: 'Junior Developer',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2024-01-02',
      department: 'Engineering',
      location: 'Austin',
      salary: 52500,
      manager: 'Sarah Johnson'
    },
    {
      id: 1002,
      name: 'Victoria Sterling',
      email: 'victoria.sterling@company.com',
      role: 'Chief Technology Officer',
      status: 'active',
      lastLogin: '2024-01-15',
      joinDate: '2020-03-15',
      department: 'Engineering',
      location: 'San Francisco',
      salary: 385000,
      manager: 'CEO'
    },
    {
      id: 7,
      name: 'Marco Rodriguez',
      email: 'marco.rodriguez@company.com',
      role: 'Intern',
      status: 'active',
      lastLogin: '2024-01-14',
      joinDate: '2024-01-08',
      department: 'Design',
      location: 'Remote',
      salary: 15000,
      manager: 'Kevin Nguyen'
    }
  ];

  readonly sampleProducts: Product[] = [
    {
      id: 1,
      name: 'Laptop Pro',
      category: 'Electronics',
      price: 1299.99,
      stock: 45,
      status: 'available',
      rating: 4.8,
      description: 'High-performance laptop for professionals',
      brand: 'TechCorp',
      weight: 1.8,
      sku: 'LAP-PRO-001',
      featured: true
    },
    {
      id: 2,
      name: 'Office Chair',
      category: 'Furniture',
      price: 299.99,
      stock: 0,
      status: 'out-of-stock',
      rating: 4.2,
      description: 'Ergonomic office chair with lumbar support',
      brand: 'ComfortSeats',
      weight: 12.5,
      sku: 'CHR-ERG-002',
      featured: false
    },
    {
      id: 3,
      name: 'Wireless Mouse',
      category: 'Electronics',
      price: 49.99,
      stock: 150,
      status: 'available',
      rating: 4.5,
      description: 'Precision wireless mouse with long battery life',
      brand: 'ClickTech',
      weight: 0.1,
      sku: 'MOU-WIR-003',
      featured: true
    },
    {
      id: 4,
      name: 'Standing Desk',
      category: 'Furniture',
      price: 599.99,
      stock: 12,
      status: 'available',
      rating: 4.7,
      description: 'Adjustable height standing desk',
      brand: 'FlexDesk',
      weight: 35.0,
      sku: 'DSK-STD-004',
      featured: false
    },
    {
      id: 5,
      name: 'Old Keyboard',
      category: 'Electronics',
      price: 79.99,
      stock: 5,
      status: 'discontinued',
      rating: 3.8,
      description: 'Legacy mechanical keyboard',
      brand: 'OldTech',
      weight: 0.8,
      sku: 'KEY-OLD-005',
      featured: false
    },
    {
      id: 6,
      name: 'Monitor 4K',
      category: 'Electronics',
      price: 449.99,
      stock: 28,
      status: 'available',
      rating: 4.6,
      description: '27-inch 4K UHD monitor with IPS panel',
      brand: 'ViewMax',
      weight: 4.2,
      sku: 'MON-4K-006',
      featured: true
    },
    {
      id: 7,
      name: 'Desk Lamp',
      category: 'Office',
      price: 89.99,
      stock: 35,
      status: 'available',
      rating: 4.3,
      description: 'LED desk lamp with adjustable brightness',
      brand: 'BrightLite',
      weight: 1.3,
      sku: 'LMP-DSK-007',
      featured: false
    },
    {
      id: 8,
      name: 'Webcam HD',
      category: 'Electronics',
      price: 129.99,
      stock: 67,
      status: 'available',
      rating: 4.1,
      description: '1080p webcam with built-in microphone',
      brand: 'StreamCam',
      weight: 0.3,
      sku: 'CAM-HD-008',
      featured: false
    },
    {
      id: 9,
      name: 'Bookshelf',
      category: 'Furniture',
      price: 189.99,
      stock: 0,
      status: 'out-of-stock',
      rating: 4.4,
      description: '5-tier wooden bookshelf',
      brand: 'WoodCraft',
      weight: 18.5,
      sku: 'SHF-BOK-009',
      featured: false
    },
    {
      id: 10,
      name: 'Coffee Mug',
      category: 'Office',
      price: 19.99,
      stock: 200,
      status: 'available',
      rating: 4.2,
      description: 'Ceramic coffee mug with company logo',
      brand: 'CupCo',
      weight: 0.4,
      sku: 'MUG-COF-010',
      featured: false
    },
    {
      id: 11,
      name: 'Tablet Pro',
      category: 'Electronics',
      price: 799.99,
      stock: 23,
      status: 'available',
      rating: 4.7,
      description: '12.9-inch tablet with stylus support',
      brand: 'TabletMax',
      weight: 0.6,
      sku: 'TAB-PRO-011',
      featured: true
    },
    {
      id: 12,
      name: 'Office Plant',
      category: 'Office',
      price: 24.99,
      stock: 45,
      status: 'available',
      rating: 4.0,
      description: 'Low-maintenance desk plant',
      brand: 'GreenSpace',
      weight: 1.2,
      sku: 'PLT-OFF-012',
      featured: false
    },
    {
      id: 13,
      name: 'Printer Laser',
      category: 'Electronics',
      price: 349.99,
      stock: 8,
      status: 'available',
      rating: 4.3,
      description: 'Monochrome laser printer',
      brand: 'PrintTech',
      weight: 8.5,
      sku: 'PRT-LAS-013',
      featured: false
    },
    {
      id: 14,
      name: 'Filing Cabinet',
      category: 'Furniture',
      price: 159.99,
      stock: 15,
      status: 'available',
      rating: 4.1,
      description: '3-drawer metal filing cabinet',
      brand: 'MetalWorks',
      weight: 22.0,
      sku: 'CAB-FIL-014',
      featured: false
    },
    {
      id: 15,
      name: 'Headphones Pro',
      category: 'Electronics',
      price: 249.99,
      stock: 0,
      status: 'out-of-stock',
      rating: 4.8,
      description: 'Noise-cancelling wireless headphones',
      brand: 'SoundMax',
      weight: 0.3,
      sku: 'HDP-PRO-015',
      featured: true
    },
    {
      id: 16,
      name: 'Whiteboard',
      category: 'Office',
      price: 79.99,
      stock: 12,
      status: 'available',
      rating: 4.0,
      description: 'Magnetic dry erase whiteboard',
      brand: 'WriteBoard',
      weight: 2.8,
      sku: 'BRD-WHT-016',
      featured: false
    },
    {
      id: 17,
      name: 'External HDD',
      category: 'Electronics',
      price: 89.99,
      stock: 34,
      status: 'available',
      rating: 4.4,
      description: '2TB portable external hard drive',
      brand: 'DataVault',
      weight: 0.2,
      sku: 'HDD-EXT-017',
      featured: false
    },
    {
      id: 18,
      name: 'Desk Mat',
      category: 'Office',
      price: 29.99,
      stock: 78,
      status: 'available',
      rating: 4.2,
      description: 'Large desk mat with smooth surface',
      brand: 'SmoothDesk',
      weight: 0.7,
      sku: 'MAT-DSK-018',
      featured: false
    },
    {
      id: 19,
      name: 'Scanner',
      category: 'Electronics',
      price: 199.99,
      stock: 3,
      status: 'discontinued',
      rating: 3.9,
      description: 'Flatbed document scanner',
      brand: 'ScanTech',
      weight: 3.2,
      sku: 'SCN-FLT-019',
      featured: false
    },
    {
      id: 20,
      name: 'Ergonomic Pad',
      category: 'Office',
      price: 39.99,
      stock: 56,
      status: 'available',
      rating: 4.3,
      description: 'Wrist rest pad for keyboard and mouse',
      brand: 'ComfortTech',
      weight: 0.3,
      sku: 'PAD-ERG-020',
      featured: false
    },
    {
      id: 21,
      name: 'Smart Watch Pro',
      category: 'Electronics',
      price: 399.99,
      stock: 32,
      status: 'available',
      rating: 4.6,
      description: 'Advanced smartwatch with health monitoring',
      brand: 'TechTime',
      weight: 0.05,
      sku: 'WAT-SMR-021',
      featured: true
    },
    {
      id: 22,
      name: 'Conference Table',
      category: 'Furniture',
      price: 899.99,
      stock: 3,
      status: 'available',
      rating: 4.4,
      description: '8-person conference table with cable management',
      brand: 'MeetingMax',
      weight: 45.0,
      sku: 'TAB-CNF-022',
      featured: false
    },
    {
      id: 23,
      name: 'Wireless Charger',
      category: 'Electronics',
      price: 49.99,
      stock: 78,
      status: 'available',
      rating: 4.2,
      description: 'Fast wireless charging pad',
      brand: 'PowerMax',
      weight: 0.2,
      sku: 'CHG-WIR-023',
      featured: false
    },
    {
      id: 24,
      name: 'Notebook Set',
      category: 'Office',
      price: 24.99,
      stock: 120,
      status: 'available',
      rating: 4.1,
      description: 'Set of 3 premium notebooks',
      brand: 'WriteWell',
      weight: 0.6,
      sku: 'NOT-SET-024',
      featured: false
    },
    {
      id: 25,
      name: 'Gaming Chair',
      category: 'Furniture',
      price: 449.99,
      stock: 0,
      status: 'out-of-stock',
      rating: 4.7,
      description: 'Professional gaming chair with RGB lighting',
      brand: 'GameSeats',
      weight: 18.5,
      sku: 'CHR-GAM-025',
      featured: true
    },
    {
      id: 26,
      name: 'USB Hub',
      category: 'Electronics',
      price: 34.99,
      stock: 89,
      status: 'available',
      rating: 4.3,
      description: '7-port USB 3.0 hub with power adapter',
      brand: 'ConnectAll',
      weight: 0.4,
      sku: 'HUB-USB-026',
      featured: false
    },
    {
      id: 27,
      name: 'Desk Organizer',
      category: 'Office',
      price: 29.99,
      stock: 67,
      status: 'available',
      rating: 4.0,
      description: 'Bamboo desk organizer with compartments',
      brand: 'OrganizeIt',
      weight: 1.2,
      sku: 'ORG-DSK-027',
      featured: false
    },
    {
      id: 28,
      name: 'Bluetooth Speaker',
      category: 'Electronics',
      price: 79.99,
      stock: 45,
      status: 'available',
      rating: 4.5,
      description: 'Portable waterproof Bluetooth speaker',
      brand: 'SoundWave',
      weight: 0.8,
      sku: 'SPK-BLU-028',
      featured: false
    },
    {
      id: 29,
      name: 'Projector Screen',
      category: 'Office',
      price: 149.99,
      stock: 12,
      status: 'available',
      rating: 4.2,
      description: '100-inch portable projector screen',
      brand: 'ViewPro',
      weight: 3.5,
      sku: 'SCR-PRJ-029',
      featured: false
    },
    {
      id: 30,
      name: 'Smart Thermostat',
      category: 'Electronics',
      price: 199.99,
      stock: 23,
      status: 'available',
      rating: 4.6,
      description: 'WiFi-enabled programmable thermostat',
      brand: 'ClimateTech',
      weight: 0.7,
      sku: 'THR-SMR-030',
      featured: true
    },
    {
      id: 31,
      name: 'Reception Sofa',
      category: 'Furniture',
      price: 649.99,
      stock: 5,
      status: 'available',
      rating: 4.3,
      description: '3-seater reception area sofa',
      brand: 'ComfortSeats',
      weight: 32.0,
      sku: 'SOF-RCP-031',
      featured: false
    },
    {
      id: 32,
      name: 'Document Camera',
      category: 'Electronics',
      price: 289.99,
      stock: 14,
      status: 'available',
      rating: 4.4,
      description: 'High-resolution document camera for presentations',
      brand: 'DocuCam',
      weight: 1.8,
      sku: 'CAM-DOC-032',
      featured: false
    },
    {
      id: 33,
      name: 'Wall Calendar',
      category: 'Office',
      price: 19.99,
      stock: 150,
      status: 'available',
      rating: 3.9,
      description: 'Large format wall calendar',
      brand: 'PlanIt',
      weight: 0.3,
      sku: 'CAL-WAL-033',
      featured: false
    },
    {
      id: 34,
      name: 'Wireless Headset',
      category: 'Electronics',
      price: 159.99,
      stock: 0,
      status: 'out-of-stock',
      rating: 4.5,
      description: 'Professional wireless headset with noise cancellation',
      brand: 'SoundMax',
      weight: 0.3,
      sku: 'HDS-WIR-034',
      featured: false
    },
    {
      id: 35,
      name: 'Storage Cabinet',
      category: 'Furniture',
      price: 299.99,
      stock: 8,
      status: 'available',
      rating: 4.1,
      description: 'Lockable storage cabinet with shelves',
      brand: 'SecureStore',
      weight: 28.0,
      sku: 'CAB-STO-035',
      featured: false
    },
    {
      id: 36,
      name: 'Power Strip',
      category: 'Electronics',
      price: 39.99,
      stock: 95,
      status: 'available',
      rating: 4.3,
      description: '12-outlet surge protector power strip',
      brand: 'PowerSafe',
      weight: 1.5,
      sku: 'PWR-STP-036',
      featured: false
    },
    {
      id: 37,
      name: 'Flipchart Pad',
      category: 'Office',
      price: 34.99,
      stock: 78,
      status: 'available',
      rating: 4.0,
      description: 'Large flipchart paper pad',
      brand: 'WriteBoard',
      weight: 2.1,
      sku: 'FLP-PAD-037',
      featured: false
    },
    {
      id: 38,
      name: 'Security Camera',
      category: 'Electronics',
      price: 129.99,
      stock: 27,
      status: 'available',
      rating: 4.4,
      description: '4K security camera with night vision',
      brand: 'SecureCam',
      weight: 0.9,
      sku: 'CAM-SEC-038',
      featured: false
    },
    {
      id: 39,
      name: 'Lounge Chair',
      category: 'Furniture',
      price: 549.99,
      stock: 6,
      status: 'available',
      rating: 4.6,
      description: 'Comfortable lounge chair for break areas',
      brand: 'RelaxSeats',
      weight: 22.5,
      sku: 'CHR-LNG-039',
      featured: false
    },
    {
      id: 40,
      name: 'Digital Frame',
      category: 'Electronics',
      price: 89.99,
      stock: 34,
      status: 'available',
      rating: 4.2,
      description: '10-inch digital photo frame with WiFi',
      brand: 'MemoryMax',
      weight: 0.6,
      sku: 'FRM-DIG-040',
      featured: false
    },
    {
      id: 41,
      name: 'Paper Shredder',
      category: 'Office',
      price: 159.99,
      stock: 19,
      status: 'available',
      rating: 4.3,
      description: 'Cross-cut paper shredder',
      brand: 'SecureShred',
      weight: 8.2,
      sku: 'SHR-PAP-041',
      featured: false
    },
    {
      id: 42,
      name: 'Drone Camera',
      category: 'Electronics',
      price: 799.99,
      stock: 7,
      status: 'available',
      rating: 4.7,
      description: '4K camera drone with gimbal stabilization',
      brand: 'SkyTech',
      weight: 1.2,
      sku: 'DRN-CAM-042',
      featured: true
    },
    {
      id: 43,
      name: 'Reception Desk',
      category: 'Furniture',
      price: 1199.99,
      stock: 2,
      status: 'available',
      rating: 4.5,
      description: 'Modern reception desk with storage',
      brand: 'WelcomeDesk',
      weight: 55.0,
      sku: 'DSK-RCP-043',
      featured: false
    },
    {
      id: 44,
      name: 'Smart Plug',
      category: 'Electronics',
      price: 24.99,
      stock: 156,
      status: 'available',
      rating: 4.1,
      description: 'WiFi-enabled smart plug',
      brand: 'SmartHome',
      weight: 0.1,
      sku: 'PLG-SMR-044',
      featured: false
    },
    {
      id: 45,
      name: 'Coat Rack',
      category: 'Office',
      price: 79.99,
      stock: 25,
      status: 'available',
      rating: 4.0,
      description: 'Free-standing coat rack',
      brand: 'HangIt',
      weight: 4.5,
      sku: 'RCK-COT-045',
      featured: false
    },
    {
      id: 46,
      name: 'VR Headset',
      category: 'Electronics',
      price: 599.99,
      stock: 0,
      status: 'out-of-stock',
      rating: 4.8,
      description: 'Virtual reality headset with controllers',
      brand: 'VirtMax',
      weight: 1.1,
      sku: 'HDS-VR-046',
      featured: true
    },
    {
      id: 47,
      name: 'Coffee Station',
      category: 'Furniture',
      price: 399.99,
      stock: 4,
      status: 'available',
      rating: 4.3,
      description: 'Office coffee station with storage',
      brand: 'BrewStation',
      weight: 25.0,
      sku: 'STA-COF-047',
      featured: false
    },
    {
      id: 48,
      name: 'Wireless Mouse Pad',
      category: 'Electronics',
      price: 49.99,
      stock: 67,
      status: 'available',
      rating: 4.2,
      description: 'Mouse pad with built-in wireless charging',
      brand: 'ChargePad',
      weight: 0.5,
      sku: 'PAD-WIR-048',
      featured: false
    },
    {
      id: 49,
      name: 'Bulletin Board',
      category: 'Office',
      price: 44.99,
      stock: 38,
      status: 'available',
      rating: 3.8,
      description: 'Cork bulletin board with frame',
      brand: 'PinBoard',
      weight: 2.3,
      sku: 'BRD-BUL-049',
      featured: false
    },
    {
      id: 50,
      name: 'Action Camera',
      category: 'Electronics',
      price: 299.99,
      stock: 18,
      status: 'available',
      rating: 4.6,
      description: '4K action camera with waterproof case',
      brand: 'ActionMax',
      weight: 0.3,
      sku: 'CAM-ACT-050',
      featured: false
    },
    {
      id: 51,
      name: 'Modular Shelving',
      category: 'Furniture',
      price: 249.99,
      stock: 11,
      status: 'available',
      rating: 4.4,
      description: 'Modular shelving system',
      brand: 'FlexShelf',
      weight: 15.0,
      sku: 'SHF-MOD-051',
      featured: false
    },
    {
      id: 52,
      name: 'Smart Light Bulb',
      category: 'Electronics',
      price: 29.99,
      stock: 145,
      status: 'available',
      rating: 4.3,
      description: 'Color-changing smart LED bulb',
      brand: 'BrightSmart',
      weight: 0.1,
      sku: 'BLB-SMR-052',
      featured: false
    },
    {
      id: 53,
      name: 'Magazine Rack',
      category: 'Office',
      price: 39.99,
      stock: 42,
      status: 'available',
      rating: 4.1,
      description: '6-slot magazine display rack',
      brand: 'DisplayIt',
      weight: 3.2,
      sku: 'RCK-MAG-053',
      featured: false
    },
    {
      id: 54,
      name: 'Portable SSD',
      category: 'Electronics',
      price: 149.99,
      stock: 0,
      status: 'discontinued',
      rating: 4.5,
      description: '1TB portable solid state drive',
      brand: 'SpeedDrive',
      weight: 0.1,
      sku: 'SSD-POR-054',
      featured: false
    },
    {
      id: 55,
      name: 'Executive Chair',
      category: 'Furniture',
      price: 799.99,
      stock: 3,
      status: 'available',
      rating: 4.7,
      description: 'Leather executive office chair',
      brand: 'ExecutiveSeats',
      weight: 26.0,
      sku: 'CHR-EXE-055',
      featured: true
    },
    {
      id: 56,
      name: 'Wireless Presenter',
      category: 'Electronics',
      price: 59.99,
      stock: 28,
      status: 'available',
      rating: 4.4,
      description: 'Wireless presentation remote with laser pointer',
      brand: 'PresentPro',
      weight: 0.2,
      sku: 'PRS-WIR-056',
      featured: false
    },
    {
      id: 57,
      name: 'Key Cabinet',
      category: 'Office',
      price: 89.99,
      stock: 15,
      status: 'available',
      rating: 4.2,
      description: 'Secure key management cabinet',
      brand: 'KeySafe',
      weight: 5.5,
      sku: 'CAB-KEY-057',
      featured: false
    },
    {
      id: 58,
      name: 'Fitness Tracker',
      category: 'Electronics',
      price: 199.99,
      stock: 53,
      status: 'available',
      rating: 4.4,
      description: 'Advanced fitness tracker with GPS',
      brand: 'FitTrack',
      weight: 0.04,
      sku: 'TRK-FIT-058',
      featured: false
    },
    {
      id: 59,
      name: 'Task Light',
      category: 'Office',
      price: 59.99,
      stock: 36,
      status: 'available',
      rating: 4.2,
      description: 'Adjustable LED task light',
      brand: 'TaskLite',
      weight: 1.8,
      sku: 'LIT-TSK-059',
      featured: false
    },
    {
      id: 60,
      name: 'Wireless Keyboard',
      category: 'Electronics',
      price: 89.99,
      stock: 74,
      status: 'available',
      rating: 4.5,
      description: 'Wireless mechanical keyboard',
      brand: 'KeyTech',
      weight: 1.2,
      sku: 'KEY-WIR-060',
      featured: false
    },
    {
      id: 1001,
      name: 'Premium Headphones',
      category: 'Electronics',
      price: 12999.95,
      stock: 3,
      status: 'available',
      rating: 4.9,
      description: 'High-end audiophile headphones',
      brand: 'AudioMax',
      weight: 0.45,
      sku: 'HDP-PREM-1001',
      featured: false
    },
    {
      id: 99,
      name: 'USB Cable',
      category: 'Electronics',
      price: 5.0,
      stock: 2500,
      status: 'available',
      rating: 3.2,
      description: 'Standard USB Type-C cable',
      brand: 'CableTech',
      weight: 0.05,
      sku: 'USB-C-099',
      featured: false
    },
    {
      id: 12345,
      name: 'Enterprise Server',
      category: 'Hardware',
      price: 149999.99,
      stock: 1,
      status: 'available',
      rating: 5.0,
      description: 'High-performance enterprise server',
      brand: 'ServerPro',
      weight: 125.8,
      sku: 'SRV-ENT-12345',
      featured: false
    }
  ];

  // Column definitions
  readonly basicColumns: TableColumn<User>[] = [
    {
      key: 'id',
      label: 'ID',
      fixed: true,
      width: '80px',
      sortable: true,
      cellClass: 'tabular-nums font-mono text-right',
      headerClass: 'text-right'
    },
    { key: 'name', label: 'Name', sortable: true, filterable: true },
    { key: 'email', label: 'Email', sortable: true, filterable: true },
    { key: 'role', label: 'Role', sortable: true, filterable: true },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true
    },
    { key: 'department', label: 'Department', sortable: true, filterable: true },
    { key: 'location', label: 'Location', sortable: true, filterable: true },
    {
      key: 'salary',
      label: 'Salary',
      sortable: true,
      align: 'right',
      cellClass: 'tabular-nums font-semibold text-right text-blue-600',
      headerClass: 'text-right',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { key: 'manager', label: 'Manager', sortable: true, filterable: true },
    {
      key: 'actions',
      label: '',
      fixed: true,
      align: 'center',
      sortable: false,
      filterable: false
    }
  ];

  readonly advancedColumns = computed(() => [
    {
      key: 'id',
      label: 'ID',
      fixed: true,
      width: '80px',
      sortable: true,
      cellClass: 'tabular-nums font-mono text-right',
      headerClass: 'text-right'
    },
    { key: 'name', label: 'Product Name', sortable: true, filterable: true, minWidth: '180px' },
    { key: 'brand', label: 'Brand', sortable: true, filterable: true, minWidth: '100px' },
    { key: 'category', label: 'Category', sortable: true, filterable: true, minWidth: '100px' },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      align: 'right',
      minWidth: '100px',
      cellClass: 'tabular-nums font-semibold text-right text-green-600',
      headerClass: 'text-right',
      render: (value: number) => `$${value.toFixed(2)}`
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      align: 'center',
      minWidth: '80px',
      cellClass: 'tabular-nums text-center font-bold',
      headerClass: 'text-center',
      render: (value: number) => (value > 0 ? value.toString() : '<span class="text-red-500">0</span>')
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      minWidth: '110px'
    },
    {
      key: 'weight',
      label: 'Weight (kg)',
      sortable: true,
      align: 'right',
      minWidth: '100px',
      cellClass: 'tabular-nums text-right',
      headerClass: 'text-right',
      render: (value: number) => `${value} kg`
    },
    { key: 'sku', label: 'SKU', sortable: true, filterable: true, minWidth: '130px' },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      align: 'center',
      minWidth: '100px',
      cellClass: 'tabular-nums text-center font-medium',
      headerClass: 'text-center',
      render: (value: number) => this.renderRating(value)
    },
    {
      key: 'featured',
      label: 'Featured',
      align: 'center',
      width: '100px',
      sortable: false,
      filterable: false,
      template: this.featuredTemplate()
    },
    {
      key: 'actions',
      label: '',
      fixed: true,
      align: 'center',
      sortable: false,
      filterable: false
    }
  ]);

  // Computed properties
  readonly pagination = computed(() => {
    const p = this.currentPagination();
    return { ...p, totalNums: this.sampleUsers.length };
  });

  readonly productPagination = computed(() => {
    const p = this.currentPagination();
    return { ...p, totalNums: this.sampleProducts.length };
  });

  readonly activeTableType = this.activeTableTypeSignal.asReadonly();
  readonly tableStriped = this.tableStripedSignal.asReadonly();
  readonly tableHoverable = this.tableHoverableSignal.asReadonly();
  readonly tableClickableRows = this.tableClickableRowsSignal.asReadonly();
  readonly tableCellLines = this.tableCellLinesSignal.asReadonly();
  readonly tableDense = this.tableDenseSignal.asReadonly();
  readonly tableTitle = this.tableTitleSignal.asReadonly();
  readonly tableDescription = this.tableDescriptionSignal.asReadonly();

  readonly selectionEnabled = this.selectionEnabledSignal.asReadonly();
  readonly selectionMode = this.selectionModeSignal.asReadonly();
  readonly currentSelection = this.currentSelectionSignal.asReadonly();

  readonly selectionConfig = computed((): TableSelectionConfig | undefined => {
    if (!this.selectionEnabled()) return undefined;
    return {
      mode: this.selectionMode(),
      key: 'id',
      enabled: true
    };
  });

  readonly currentColumns = computed(() => {
    const type = this.activeTableTypeSignal();
    return type === 'advanced' ? this.advancedColumns() : this.basicColumns;
  });

  readonly currentData = computed(() => {
    const type = this.activeTableTypeSignal();
    if (type === 'no-data') {
      return [];
    }
    return type === 'advanced' ? this.sampleProducts : this.sampleUsers;
  });

  // Methods
  setTab(tab: 'basic' | 'advanced' | 'api' | 'code'): void {
    this.activeTab.set(tab);
  }

  setTableType(type: 'basic' | 'advanced' | 'api' | 'no-data'): void {
    this.activeTableTypeSignal.set(type);

    // Update title and description based on type
    switch (type) {
      case 'basic':
        this.tableTitleSignal.set('User Management Table');
        this.tableDescriptionSignal.set('Manage and view user data with sorting and filtering');
        break;
      case 'advanced':
        this.tableTitleSignal.set('Product Inventory Table');
        this.tableDescriptionSignal.set('Advanced table with custom renderers and product data');
        break;
      case 'api':
        this.tableTitleSignal.set('API Data Table');
        this.tableDescriptionSignal.set('Dynamic table with API integration and loading states');
        break;
      case 'no-data':
        this.tableTitleSignal.set('Empty Data Table');
        this.tableDescriptionSignal.set('Table with no data to demonstrate empty state handling');
        break;
    }
  }

  toggleStriped(): void {
    this.tableStripedSignal.update(s => !s);
  }

  toggleHoverable(): void {
    this.tableHoverableSignal.update(h => !h);
  }

  toggleClickableRows(): void {
    this.tableClickableRowsSignal.update(c => !c);
  }

  toggleCellLines(): void {
    this.tableCellLinesSignal.update(c => !c);
  }

  toggleDense(): void {
    this.tableDenseSignal.update(d => !d);
  }

  toggleSelection(): void {
    this.selectionEnabledSignal.update(s => !s);
    this.currentSelectionSignal.set({ selectedRows: [], selectedIds: [], isAllSelected: false, isIndeterminate: false });
  }

  setSelectionMode(mode: 'single' | 'multiple'): void {
    this.selectionModeSignal.set(mode);
    this.currentSelectionSignal.set({ selectedRows: [], selectedIds: [], isAllSelected: false, isIndeterminate: false });
  }

  applyPreset(preset: string): void {
    switch (preset) {
      case 'basic':
        this.setTableType('basic');
        this.tableStripedSignal.set(false);
        this.tableHoverableSignal.set(false);
        this.tableClickableRowsSignal.set(false);
        this.selectionEnabledSignal.set(false);
        break;
      case 'advanced':
        this.setTableType('advanced');
        this.tableStripedSignal.set(true);
        this.tableHoverableSignal.set(true);
        this.tableClickableRowsSignal.set(true);
        this.selectionEnabledSignal.set(true);
        this.selectionModeSignal.set('multiple');
        break;
      case 'api':
        this.setTableType('api');
        this.tableStripedSignal.set(false);
        this.tableHoverableSignal.set(true);
        this.tableClickableRowsSignal.set(false);
        this.selectionEnabledSignal.set(false);
        this.fetchApiData();
        break;
      case 'striped':
        this.tableStripedSignal.set(true);
        this.tableHoverableSignal.set(true);
        this.tableClickableRowsSignal.set(true);
        this.selectionEnabledSignal.set(true);
        this.selectionModeSignal.set('multiple');
        break;
      case 'no-data':
        this.setTableType('no-data');
        this.tableStripedSignal.set(false);
        this.tableHoverableSignal.set(false);
        this.tableClickableRowsSignal.set(false);
        this.selectionEnabledSignal.set(false);
        break;
    }
  }

  toggleLoading(): void {
    this.isLoading.update(loading => !loading);

    if (this.isLoading()) {
      setTimeout(() => this.isLoading.set(false), 3000);
    }
  }

  onRowClick(row: any): void {
    if (this.tableClickableRows()) {
      console.log('Row clicked:', row);
      alert(`Row clicked: ${row.name || row.title || JSON.stringify(row)}`);
    }
  }

  onSortChange(sort: TableSort): void {
    this.currentSort.set(sort);
    console.log('Sort changed:', sort);
  }

  onFilterChange(filters: TableFilter[]): void {
    this.currentFilters.set(filters);
    console.log('Filters changed:', filters);
  }

  onPageChange(page: number): void {
    this.currentPagination.update(p => ({ ...p, page }));
    console.log('Page changed:', page);
  }

  onPageSizeChange(pageSize: number): void {
    this.currentPagination.update(p => ({ ...p, pageSize, page: 1 }));
    console.log('Page size changed:', pageSize);
  }

  onSelectionChange(selection: TableSelection<any>): void {
    this.currentSelectionSignal.set(selection);
    console.log('Selection changed:', selection);
  }

  readonly rowActions: RowActionsFn = () => [
    { key: 'view', label: 'View', icon: 'Eye', onClick: r => this.onView(r) },
    { key: 'edit', label: 'Edit', icon: 'Pencil', color: 'primary', onClick: r => this.onEdit(r) },
    { key: 'delete', label: 'Delete', icon: 'Trash2', color: 'error', onClick: r => this.onDelete(r) }
  ];

  onView(row: any): void {
    console.log('View row:', row);
    alert(`Viewing details for: ${row.name || row.id}`);
  }

  onEdit(row: any): void {
    console.log('Edit row:', row);
    alert(`Editing: ${row.name || row.id}`);
  }

  onDelete(row: any): void {
    console.log('Delete row:', row);
    if (confirm(`Are you sure you want to delete: ${row.name || row.id}?`)) {
      alert(`Deleted: ${row.name || row.id}`);
    }
  }

  getDisplayCode(): string {
    const selectionConfig = this.selectionEnabled()
      ? `
  [selectionConfig]="{ mode: '${this.selectionMode()}', key: 'id' }"`
      : '';
    const selectionEvent = this.selectionEnabled()
      ? `
  (selectionChange)="onSelectionChange($event)"`
      : '';

    return `<oct-table
  [columns]="columns"
  [data]="data"
  [pagination]="pagination"
  [loading]="loading"
  [sortable]="true"

  [fixedHeader]="true"
  [striped]="${this.tableStriped()}"
  [hoverable]="${this.tableHoverable()}"
  [clickableRows]="${this.tableClickableRows()}"${selectionConfig}
  maxHeight="600px"
  (rowClick)="onRowClick($event)"
  (sortChange)="onSortChange($event)"
  (filterChange)="onFilterChange($event)"
  (pageChange)="onPageChange($event)"
  (pageSizeChange)="onPageSizeChange($event)"${selectionEvent}>

  <!-- Action Template -->
  <ng-template #actionTemplate let-row="row">
    <div class="flex items-center justify-center gap-1">
      <oct-button variant="ghost" size="sm" icon="Eye" (buttonClick)="onView(row)"></oct-button>
      <oct-button variant="ghost" size="sm" icon="Pencil" color="primary" (buttonClick)="onEdit(row)"></oct-button>
      <oct-button variant="ghost" size="sm" icon="Trash2" color="error" (buttonClick)="onDelete(row)"></oct-button>
    </div>
  </ng-template>
</oct-table>`;
  }

  // Render methods

  private renderRating(rating: number): string {
    const stars = Math.round(rating);
    const starIcon = '<oct-icon name="Star" class="text-yellow-400" />';
    const emptyIcon = '<oct-icon name="Star" class="text-gray-300" />';

    let html = '';
    for (let i = 0; i < 5; i++) {
      html += i < stars ? starIcon : emptyIcon;
    }
    html += `<span class="ml-1 text-xs text-gray-600">${rating}</span>`;

    return html;
  }

  // API simulation methods
  async fetchApiData(): Promise<void> {
    this.isLoading.set(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    this.isLoading.set(false);
  }

  toggleFeatured(row: Product): void {
    // Find the product in the array and toggle its featured status
    const productIndex = this.sampleProducts.findIndex(p => p.id === row.id);
    if (productIndex !== -1) {
      // Create a new array with the updated product (immutable approach)
      const updatedProducts = [...this.sampleProducts];
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        featured: !updatedProducts[productIndex].featured
      };
      // In a real app, you would update the data source here
      console.log(`Toggled featured status for ${row.name} to ${!row.featured}`);
    }
  }

  // Getters for template
  get activeTabValue() {
    return this.activeTab();
  }

  get isLoadingValue() {
    return this.isLoading();
  }
}
