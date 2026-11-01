import { Component } from '@angular/core';
import { TableColumn, TableComponent } from 'ngx-hr-ui';

interface Attendance {
  id: number;
  date: string;
  clockIn: string;
  clockOut: string;
  hours: number;
}

@Component({
  selector: 'example-table-dense',
  imports: [TableComponent],
  host: { class: 'w-full min-w-0' },
  template: `<oct-table class="w-full" [columns]="columns" [data]="days" [dense]="true" />`
})
export default class TableDense {
  readonly columns: TableColumn<Attendance>[] = [
    { key: 'date', label: 'Date' },
    { key: 'clockIn', label: 'Clock in' },
    { key: 'clockOut', label: 'Clock out' },
    { key: 'hours', label: 'Hours', align: 'right', render: value => value.toFixed(1) }
  ];

  readonly days: Attendance[] = [
    { id: 1, date: 'Mon 19 Oct', clockIn: '08:52', clockOut: '18:05', hours: 8.2 },
    { id: 2, date: 'Tue 20 Oct', clockIn: '08:47', clockOut: '18:31', hours: 8.7 },
    { id: 3, date: 'Wed 21 Oct', clockIn: '09:02', clockOut: '18:00', hours: 8 },
    { id: 4, date: 'Thu 22 Oct', clockIn: '08:55', clockOut: '19:12', hours: 9.3 },
    { id: 5, date: 'Fri 23 Oct', clockIn: '08:58', clockOut: '17:45', hours: 7.8 }
  ];
}
