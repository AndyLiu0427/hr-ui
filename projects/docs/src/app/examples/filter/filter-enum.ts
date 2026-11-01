import { Component, signal } from '@angular/core';
import { FilterComponent, enumToFilterOptions } from 'ngx-hr-ui';

enum PayRunStatus {
  Draft = 'Draft',
  PendingApproval = 'Pending approval',
  Approved = 'Approved',
  Paid = 'Paid'
}

@Component({
  selector: 'example-filter-enum',
  imports: [FilterComponent],
  template: `<oct-filter label="Pay run status" [options]="statuses" [(selectedValues)]="selected" />`
})
export default class FilterEnum {
  // One option per enum value, labelled with the value itself.
  readonly statuses = enumToFilterOptions(PayRunStatus);
  readonly selected = signal<PayRunStatus[]>([PayRunStatus.PendingApproval]);
}
