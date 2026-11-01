import { Component } from '@angular/core';
import { ChipComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-chip-colors',
  imports: [ChipComponent],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <oct-chip color="neutral">Contract</oct-chip>
      <oct-chip color="success">Confirmed</oct-chip>
      <oct-chip color="warning">Expiring</oct-chip>
      <oct-chip color="error">Overdue</oct-chip>
      <oct-chip color="info">New hire</oct-chip>
    </div>
  `
})
export default class ChipColors {}
