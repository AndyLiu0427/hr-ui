import { Component, signal } from '@angular/core';
import { RowAction, TableColumn, TableComponent } from 'ngx-hr-ui';

interface LeaveRequest {
  id: number;
  employee: string;
  leaveType: string;
  days: number;
  status: string;
}

@Component({
  selector: 'example-table-row-actions',
  imports: [TableComponent],
  host: { class: 'w-full min-w-0' },
  template: `<oct-table class="w-full" [columns]="columns" [data]="requests()" [rowActions]="actions" />`
})
export default class TableRowActions {
  readonly requests = signal<LeaveRequest[]>([
    { id: 1, employee: 'Nguyen Thi Lan', leaveType: 'Annual leave', days: 5, status: 'Pending' },
    { id: 2, employee: 'Rajesh Kumar', leaveType: 'Sick leave', days: 2, status: 'Approved' },
    { id: 3, employee: 'Isabella Cruz', leaveType: 'Childcare leave', days: 1, status: 'Pending' },
    { id: 4, employee: 'Joon-ho Park', leaveType: 'Annual leave', days: 10, status: 'Pending' }
  ]);

  readonly columns: TableColumn<LeaveRequest>[] = [
    { key: 'employee', label: 'Employee' },
    { key: 'leaveType', label: 'Leave type' },
    { key: 'days', label: 'Days', align: 'right' },
    { key: 'status', label: 'Status' },
    // The actions go in the column whose key is 'actions'.
    { key: 'actions', label: '' }
  ];

  // Called for each row, so an action can depend on the row.
  readonly actions = (request: LeaveRequest): RowAction<LeaveRequest>[] => [
    { key: 'approve', label: 'Approve', icon: 'Check', color: 'success', disabled: request.status !== 'Pending', onClick: row => this.approve(row) },
    { key: 'delete', label: 'Delete', icon: 'Trash2', color: 'error', onClick: row => this.delete(row) }
  ];

  approve(request: LeaveRequest): void {
    this.requests.update(requests => requests.map(r => (r.id === request.id ? { ...r, status: 'Approved' } : r)));
  }

  delete(request: LeaveRequest): void {
    this.requests.update(requests => requests.filter(r => r.id !== request.id));
  }
}
