import { describe, expect, it } from 'vitest';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { useTablePagination } from '../../../utils/table-url-state';
import { URL_STATE_ENABLED } from '../../../utils/url-signal';
import { TableComponent } from './table';
import { TableCellEdit, TableColumn } from './table.interface';

const rows = Array.from({ length: 50 }, (_, index) => ({ name: `Employee ${index}` }));

@Component({
  template: `<oct-table
    [columns]="columns"
    [data]="rows"
    [pagination]="pagination.clampedConfig(rows.length)"
    (pageChange)="pagination.page.set($event)"
  />`,
  imports: [TableComponent]
})
class ListPage {
  readonly columns = [{ key: 'name', label: 'Name' }];
  readonly rows = rows;
  readonly pagination = useTablePagination({ defaultPageSize: 25 });
}

@Component({
  selector: 'oct-test-panel',
  template: `<oct-table [columns]="columns" [data]="rows" />`,
  imports: [TableComponent],
  providers: [{ provide: URL_STATE_ENABLED, useValue: false }]
})
class PanelContent {
  readonly columns = [{ key: 'name', label: 'Name' }];
  readonly rows = rows;
}

@Component({ template: '<oct-test-panel />', imports: [PanelContent] })
class PanelPage {}

@Component({ template: `<oct-table [columns]="columns" [data]="rows" />`, imports: [TableComponent] })
class DetailPage {
  readonly columns = [{ key: 'payItem', label: 'Pay Item' }];
  readonly rows = rows.map(row => ({ payItem: row.name }));
}

async function open(url: string): Promise<{ harness: RouterTestingHarness; container: () => HTMLDivElement; table: () => TableComponent }> {
  TestBed.configureTestingModule({
    providers: [
      provideZonelessChangeDetection(),
      provideRouter([
        { path: 'list', component: ListPage },
        { path: 'panel', component: PanelPage },
        { path: 'detail', component: DetailPage }
      ])
    ]
  });
  const harness = await RouterTestingHarness.create(url);
  const container = () => harness.routeNativeElement!.querySelector<HTMLDivElement>('oct-table div[class*="hide-scrollbars"]')!;
  const table = () => harness.routeDebugElement!.query(debug => debug.componentInstance instanceof TableComponent).componentInstance;
  return { harness, container, table };
}

function scroll(element: HTMLElement, top: number): void {
  element.scrollTop = top;
}

describe('TableComponent scroll position', () => {
  it('goes back to the first row when the user changes page', async () => {
    const { container, table } = await open('/list');
    scroll(container(), 300);

    table().onPageChange(2);

    expect(container().scrollTop).toBe(0);
  });

  it('comes back to where the user left page 2 of the list for a detail page', async () => {
    const { harness, container, table } = await open('/list');
    table().onPageChange(2);
    await harness.fixture.whenStable();
    scroll(container(), 300);

    await harness.navigateByUrl('/detail');
    await harness.navigateByUrl('/list?page=2');

    expect(container().scrollTop).toBe(300);
  });

  it('comes back to the list after a sort changed its URL with no scroll since', async () => {
    const { harness, container } = await open('/list');
    scroll(container(), 300);
    TestBed.inject(Location).replaceState('/list?sortBy=name');

    await harness.navigateByUrl('/detail');
    await harness.navigateByUrl('/list?sortBy=name');

    expect(container().scrollTop).toBe(300);
  });

  it('keeps the list scroll when a table on the detail page was scrolled too', async () => {
    const { harness, container } = await open('/list');
    scroll(container(), 300);

    await harness.navigateByUrl('/detail');
    scroll(container(), 200);
    await harness.navigateByUrl('/list');

    expect(container().scrollTop).toBe(300);
  });

  it('does not carry a side panel table scroll over to the next record', async () => {
    const { harness, container } = await open('/panel');
    scroll(container(), 300);

    await harness.navigateByUrl('/detail');
    await harness.navigateByUrl('/panel');

    expect(container().scrollTop).toBe(0);
  });
});

function createTable(columns: TableColumn[]) {
  TestBed.configureTestingModule({
    imports: [TableComponent],
    providers: [provideNoopAnimations()]
  });
  const fixture = TestBed.createComponent(TableComponent);
  fixture.componentRef.setInput('columns', columns);
  fixture.componentRef.setInput('data', []);
  return fixture.componentInstance;
}

describe('TableComponent tableMinWidth', () => {
  it('adds up the columns that have a width', () => {
    const table = createTable([
      { key: 'code', label: 'Code', width: '120px' },
      { key: 'name', label: 'Name', width: 200 }
    ]);

    expect(table.tableMinWidth()).toBe(320);
  });

  it('gives a column without a width 100px, so a narrow screen scrolls instead of squeezing it', () => {
    const table = createTable([
      { key: 'code', label: 'Code', width: '120px' },
      { key: 'name', label: 'Name' }
    ]);

    expect(table.tableMinWidth()).toBe(220);
  });

  it('leaves room for a percent column, which takes its share of the whole table', () => {
    const table = createTable([
      { key: 'code', label: 'Code', width: '120px' },
      { key: 'name', label: 'Name' },
      { key: 'dept', label: 'Department', width: '20%' }
    ]);

    expect(table.tableMinWidth()).toBe(275);
  });

  it('adds no floor when every column is a percent', () => {
    const table = createTable([
      { key: 'name', label: 'Name', width: '60%' },
      { key: 'dept', label: 'Department', width: '40%' }
    ]);

    expect(table.tableMinWidth()).toBe(0);
  });

  it('gives every column without a width the widest header word, as they share the space equally', () => {
    const table = createTable([
      { key: 'qty', label: 'Qty' },
      { key: 'dept', label: 'Client Department' }
    ]);

    table.headerWordWidths.set({ qty: 60, dept: 130 });

    expect(table.tableMinWidth()).toBe(260);
  });

  it('leaves out the actions column until it measures its buttons', () => {
    const table = createTable([
      { key: 'name', label: 'Name', width: '200px' },
      { key: 'actions', label: '', fixed: true }
    ]);

    expect(table.tableMinWidth()).toBe(200);
  });
});

describe('TableComponent header sort', () => {
  function render() {
    TestBed.configureTestingModule({
      imports: [TableComponent],
      providers: [provideNoopAnimations()]
    });
    const fixture = TestBed.createComponent(TableComponent);
    fixture.componentRef.setInput('columns', [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'dept', label: 'Department' }
    ]);
    fixture.componentRef.setInput('data', [
      { name: 'Bea', dept: 'HR' },
      { name: 'Al', dept: 'IT' },
      { name: 'Cy', dept: 'Ops' }
    ]);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const [name, dept] = [...element.querySelectorAll('th')];
    const names = () => [...element.querySelectorAll('tbody tr')].map(row => row.querySelector('td')!.textContent!.trim());
    const clickName = () => {
      name.querySelector('button')!.click();
      fixture.detectChanges();
    };
    return { name, dept, names, clickName };
  }

  it('sorts when the header label is pressed, and says which way with aria-sort', () => {
    const { name, names, clickName } = render();
    expect(name.getAttribute('aria-sort')).toBe('none');

    clickName();
    expect(name.getAttribute('aria-sort')).toBe('ascending');
    expect(names()).toEqual(['Al', 'Bea', 'Cy']);

    clickName();
    expect(name.getAttribute('aria-sort')).toBe('descending');
    expect(names()).toEqual(['Cy', 'Bea', 'Al']);
  });

  it('gives a column that does not sort neither a button nor aria-sort', () => {
    const { dept } = render();

    expect(dept.querySelector('button')).toBeNull();
    expect(dept.hasAttribute('aria-sort')).toBe(false);
  });
});

async function renderTable(inputs: Record<string, unknown>) {
  TestBed.configureTestingModule({
    imports: [TableComponent],
    providers: [provideNoopAnimations()]
  });
  const fixture = TestBed.createComponent(TableComponent);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  await fixture.whenStable();
  const element = fixture.nativeElement as HTMLElement;
  const rows = () => [...element.querySelectorAll<HTMLTableRowElement>('tbody tr')];
  return { fixture, element, rows, table: fixture.componentInstance };
}

const CLAIMS = [
  { id: 'CLM-1', employee: 'Arjun Mehta', amount: 86 },
  { id: 'CLM-2', employee: 'Siti Rahmah', amount: 120 },
  { id: 'CLM-3', employee: 'Amelia Wong', amount: 42 }
];
const CLAIM_COLUMNS: TableColumn[] = [
  { key: 'employee', label: 'Employee', sortable: true },
  { key: 'amount', label: 'Amount', editable: true, editType: 'number' }
];

describe('TableComponent row selection', () => {
  const select = (inputs: Record<string, unknown> = {}) =>
    renderTable({ columns: CLAIM_COLUMNS, data: CLAIMS, selectionConfig: { mode: 'multiple', key: 'id' }, ...inputs });
  const checkboxes = (element: HTMLElement) => [...element.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')];
  const nameOf = (checkbox: HTMLInputElement) => checkbox.closest('label')!.textContent!.trim();

  it('names the header checkbox "Select all rows", and each row checkbox after its first column', async () => {
    const { element } = await select();
    const [all, first] = checkboxes(element);

    expect(nameOf(all)).toBe('Select all rows');
    expect(nameOf(first)).toBe('Select Arjun Mehta');
  });

  it('shows the header checkbox as partly checked while only some rows are selected', async () => {
    const { fixture, element } = await select();
    const [all, first, second, third] = checkboxes(element);
    expect(all.indeterminate).toBe(false);

    first.click();
    await fixture.whenStable();
    expect(all.indeterminate).toBe(true);
    expect(all.checked).toBe(false);

    second.click();
    third.click();
    await fixture.whenStable();
    expect(all.indeterminate).toBe(false);
    expect(all.checked).toBe(true);
  });

  it('leaves out the checkbox column when enabled is false', async () => {
    const { element } = await select({ selectionConfig: { mode: 'multiple', key: 'id', enabled: false } });

    expect(checkboxes(element)).toHaveLength(0);
  });
});

describe('TableComponent clickable rows', () => {
  const enter = () => new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });

  it('makes each row a tab stop that Enter opens', async () => {
    const { table, rows } = await renderTable({ columns: CLAIM_COLUMNS, data: CLAIMS, clickableRows: true });
    const clicked: unknown[] = [];
    table.rowClick.subscribe(row => clicked.push(row));

    expect(rows()[1].tabIndex).toBe(0);
    rows()[1].dispatchEvent(enter());

    expect(clicked).toEqual([CLAIMS[1]]);
  });

  it('leaves Enter in a control inside the row to that control', async () => {
    const { table, rows } = await renderTable({ columns: CLAIM_COLUMNS, data: CLAIMS, clickableRows: true });
    const clicked: unknown[] = [];
    table.rowClick.subscribe(row => clicked.push(row));

    rows()[1].querySelector('button')!.dispatchEvent(enter());

    expect(clicked).toEqual([]);
  });

  it('gives rows no tab stop when they are not clickable', async () => {
    const { rows } = await renderTable({ columns: CLAIM_COLUMNS, data: CLAIMS });

    expect(rows()[1].hasAttribute('tabindex')).toBe(false);
  });
});

describe('TableComponent inline edit', () => {
  async function editAmount(rowOnScreen: number, inputs: Record<string, unknown> = {}) {
    const rendered = await renderTable({ columns: CLAIM_COLUMNS, data: CLAIMS, ...inputs });
    const edits: TableCellEdit[] = [];
    rendered.table.cellValueChange.subscribe(edit => edits.push(edit));
    const editButton = () => rendered.rows()[rowOnScreen].querySelectorAll('td')[1].querySelector('button')!;
    editButton().click();
    await rendered.fixture.whenStable();
    const input = rendered.element.querySelector<HTMLInputElement>('td input')!;
    const type = (value: string) => {
      input.value = value;
      input.dispatchEvent(new Event('input'));
    };
    const press = (key: string) => input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    return { ...rendered, edits, editButton, input, type, press };
  }

  it('emits the index of the row in data(), not its place on screen after sorting', async () => {
    // Sorted by employee, Amelia Wong is first on screen and third in data().
    const { type, press, edits } = await editAmount(0, { defaultSort: { key: 'employee', direction: 'asc' } });

    type('50');
    press('Enter');

    expect(edits).toHaveLength(1);
    expect(edits[0].row).toBe(CLAIMS[2]);
    expect(edits[0].rowIndex).toBe(2);
  });

  it('gives focus back to the edit button of the cell after Enter saves', async () => {
    const { fixture, input, type, press, editButton } = await editAmount(1);
    expect(document.activeElement).toBe(input);

    type('130');
    press('Enter');
    await fixture.whenStable();

    expect(document.activeElement).toBe(editButton());
  });

  it('gives focus back to the edit button of the cell after Escape cancels', async () => {
    const { fixture, press, editButton } = await editAmount(1);

    press('Escape');
    await fixture.whenStable();

    expect(document.activeElement).toBe(editButton());
  });
});

describe('TableComponent accessible names', () => {
  async function render() {
    TestBed.configureTestingModule({ imports: [TableComponent], providers: [provideNoopAnimations()] });
    const fixture = TestBed.createComponent(TableComponent);
    fixture.componentRef.setInput('columns', [{ key: 'name', label: 'Name' }, { key: 'actions', label: '' }]);
    fixture.componentRef.setInput('data', rows);
    fixture.componentRef.setInput('pagination', { page: 2, pageSize: 10, totalNums: rows.length, totalNumPages: 5 });
    fixture.componentRef.setInput('rowActions', () => [{ key: 'edit', label: 'Edit', icon: 'Pencil', onClick: () => {} }]);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('keeps the words in the previous and next buttons, so they have a name on a phone too', async () => {
    const words = [...(await render()).querySelectorAll('oct-button button span')].filter(span => !span.children.length && /^(Previous|Next)$/.test(span.textContent?.trim() ?? ''));
    expect(words).toHaveLength(2);
    // hidden would drop the word from the accessible name below 640px; sr-only keeps it.
    for (const word of words) expect(word.classList.contains('hidden')).toBe(false);
  });

  it('names the actions column, whose cells hold only icon buttons', async () => {
    const headers = [...(await render()).querySelectorAll('thead th')].map(th => th.textContent?.trim());
    expect(headers.at(-1)).toBe('Actions');
  });

  it('lets the keyboard reach the scroll box, so a wide table can be scrolled without a mouse', async () => {
    const scroller = (await render()).querySelector('[role="region"]');
    expect(scroller?.getAttribute('tabindex')).toBe('0');
    expect(scroller?.getAttribute('aria-label')).toBe('Table');
  });
});
