import { Component, signal } from '@angular/core';
import { TableCellEdit, TableColumn, TableComponent } from 'ngx-hr-ui';

interface Timesheet {
  id: number;
  employee: string;
  regularHours: number;
  overtimeHours: number;
  status: string;
}

// Approved timesheets are locked.
const isOpen = (row: Timesheet): boolean => row.status !== 'Approved';

@Component({
  selector: 'example-table-inline-edit',
  imports: [TableComponent],
  host: { class: 'w-full min-w-0' },
  template: `
    <oct-table
      class="w-full"
      [columns]="columns"
      [data]="timesheets()"
      [editAdvanceOnEnter]="true"
      (cellValueChange)="update($event)"
    />
  `
})
export default class TableInlineEdit {
  readonly timesheets = signal<Timesheet[]>([
    { id: 1, employee: 'Ahmad Faizal', regularHours: 44, overtimeHours: 6.5, status: 'Pending' },
    { id: 2, employee: 'Ethan Goh', regularHours: 44, overtimeHours: 2, status: 'Pending' },
    { id: 3, employee: 'Rizal Santos', regularHours: 40, overtimeHours: 0, status: 'Approved' },
    { id: 4, employee: 'Siti Rahmah', regularHours: 36, overtimeHours: 4, status: 'Pending' }
  ]);

  readonly columns: TableColumn<Timesheet>[] = [
    { key: 'employee', label: 'Employee' },
    { key: 'regularHours', label: 'Regular hours', align: 'right', editable: isOpen, editType: 'number', editMin: 0, editStep: 0.5 },
    { key: 'overtimeHours', label: 'Overtime hours', align: 'right', editable: isOpen, editType: 'number', editMin: 0, editStep: 0.5 },
    { key: 'status', label: 'Status' }
  ];

  // Match the row by id: rowIndex counts the rows on screen, after sorting and paging.
  update({ row, column, value }: TableCellEdit<Timesheet>): void {
    this.timesheets.update(rows => rows.map(r => (r.id === row.id ? { ...r, [column.key]: value } : r)));
  }
}
