import { describe, expect, it } from 'vitest';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { useTablePagination } from '../../../utils/table-url-state';
import { URL_STATE_ENABLED } from '../../../utils/url-signal';
import { TableComponent } from './table';
import { TableColumn } from './table.interface';

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
    imports: [TranslateModule.forRoot()],
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
    imports: [TranslateModule.forRoot(), TableComponent],
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
