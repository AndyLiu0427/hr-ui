import { ChangeDetectionStrategy, Component, TemplateRef, computed, signal, viewChild } from '@angular/core';
import { CardComponent, CardContentComponent } from 'hr-ui';
import { ColorTagColor, ColorTagComponent, ColorTagVariant } from 'hr-ui';
import { IChoiceComponent, IChoiceOption } from 'hr-ui';
import { SearchSelectComponent, SearchSelectOption } from 'hr-ui';
import { SelectComponent, SelectOption } from 'hr-ui';
import { TableComponent } from 'hr-ui';
import { TableColumn } from 'hr-ui';
import { TextComponent } from 'hr-ui';

interface TagRow {
  employee: string;
  clientCode: string;
  clientName: string;
  dept: string;
  hours: string;
}

/**
 * Placeholder accounts, invented for this page. Real client names would date the moment someone
 * is filed differently, and which client takes which colour is the product's business, not the
 * component's. Two share amber and two carry no colour, because those are the two cases the
 * component behaves differently for.
 */
const ACCOUNTS: Array<{ code: string; name: string; color: ColorTagColor | null }> = [
  { code: 'ACME', name: 'Acme Industrial', color: 'red' },
  { code: 'BRWK', name: 'Brookwater Group', color: 'green' },
  { code: 'CDLN', name: 'Caldera Networks', color: 'orange' },
  { code: 'DNMR', name: 'Dunmore Freight', color: 'orange' },
  { code: 'ELMS', name: 'Elmsworth Retail', color: 'purple' },
  { code: 'FRWY', name: 'Fairway Clinics', color: null },
  { code: 'GRDN', name: 'Garden State Energy', color: 'yellow' },
  { code: 'HLBK', name: 'Holbeck Media', color: 'blue' },
  { code: 'IRNC', name: 'Ironclad Security', color: null }
];

@Component({
  selector: 'oct-color-tag-page',
  templateUrl: './color-tag.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardComponent,
    CardContentComponent,
    ColorTagComponent,
    IChoiceComponent,
    SearchSelectComponent,
    SelectComponent,
    TableComponent,
    TextComponent
  ]
})
export class ColorTagPageComponent {
  readonly variant = signal<ColorTagVariant>('cut');
  readonly color = signal<ColorTagColor>('red');

  readonly variantOptions: IChoiceOption[] = [
    { value: 'cut', label: 'Cut' },
    { value: 'corner', label: 'Corner' },
    { value: 'inline', label: 'Inline' }
  ];

  readonly colorOptions: IChoiceOption[] = Object.values(ColorTagColor).map(color => ({ value: color, label: color }));

  readonly generatedCode = computed(() => {
    if (this.variant() === 'cut') {
      return `<oct-color-tag color="${this.color()}" variant="cut">\n  <oct-card>...</oct-card>\n</oct-color-tag>`;
    }
    return `<oct-color-tag color="${this.color()}" variant="${this.variant()}" [label]="row.clientCode" />`;
  });

  readonly swatches: readonly ColorTagColor[] = Object.values(ColorTagColor);

  // ── Card example ──────────────────────────────────────────────────────────
  readonly cutCardColor: ColorTagColor = 'purple';

  // ── Select and search-select examples ─────────────────────────────────────
  readonly selectOptions: SelectOption[] = ACCOUNTS.map(account => ({
    value: account.code,
    label: `${account.code} — ${account.name}`,
    colorTag: account.color ?? undefined
  }));

  readonly searchSelectOptions: SearchSelectOption[] = ACCOUNTS.map(account => ({
    value: account.code,
    label: `${account.code} — ${account.name}`,
    description: account.name,
    colorTag: account.color ?? undefined
  }));

  readonly selectedAccount = signal<string | number | null>('CDLN');
  readonly searchedAccount = signal<string | number | null>('GRDN');

  // ── Table example ─────────────────────────────────────────────────────────
  readonly rowTagTemplate = viewChild<TemplateRef<unknown>>('rowTagTemplate');

  /** Caldera and Dunmore share amber, so the Account column still has to print the name. */
  readonly rows: TagRow[] = [
    { employee: 'Chan Ka-Ming', clientCode: 'ACME', clientName: 'Acme Industrial', dept: 'Venue Ops', hours: '168.0' },
    { employee: 'Nurul Aisyah', clientCode: 'CDLN', clientName: 'Caldera Networks', dept: 'Licensing', hours: '152.5' },
    { employee: 'Rajesh Kumar', clientCode: 'DNMR', clientName: 'Dunmore Freight', dept: 'Survey', hours: '176.0' },
    { employee: 'Wong Sze-Wai', clientCode: 'FRWY', clientName: 'Fairway Clinics', dept: 'Clinic 4', hours: '140.0' },
    { employee: 'Leung Chi-Hang', clientCode: 'GRDN', clientName: 'Garden State Energy', dept: 'Waste', hours: '160.0' },
    { employee: 'Tam Wai-Kit', clientCode: 'IRNC', clientName: 'Ironclad Security', dept: 'District', hours: '152.0' }
  ];

  readonly tableColumns = computed<TableColumn<TagRow>[]>(() => [
    // The mark pins to this cell's corner, which is the row's, so it needs no column of its own.
    { key: 'employee', label: 'Employee', sortable: false, width: '200px', template: this.rowTagTemplate() },
    { key: 'clientName', label: 'Account', sortable: false, width: '260px' },
    { key: 'dept', label: 'Dept', sortable: false, width: '140px' },
    { key: 'hours', label: 'Hours', sortable: false, width: '100px', align: 'right', cellClass: 'tabular-nums' }
  ]);

  tagColor(accountCode: string): ColorTagColor | null {
    return ACCOUNTS.find(account => account.code === accountCode)?.color ?? null;
  }
}
