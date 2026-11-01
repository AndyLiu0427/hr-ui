import { Component } from '@angular/core';
import { InfoCardComponent, type CardConfig } from 'ngx-hr-ui';

@Component({
  selector: 'example-info-card-demo',
  imports: [InfoCardComponent],
  host: { class: 'w-full max-w-xl' },
  template: `<oct-info-card [config]="config" [data]="employee" status="Active" statusColor="success" />`
})
export default class InfoCardDemo {
  readonly config: CardConfig = {
    title: 'Employment',
    fields: [
      { key: 'employeeCode', label: 'Employee code' },
      { key: 'jobTitle', label: 'Job title' },
      { key: 'department', label: 'Department' },
      { key: 'employmentType', label: 'Employment type' },
      { key: 'startDate', label: 'Start date' },
      { key: 'payGroup', label: 'Pay group' }
    ]
  };

  readonly employee = {
    employeeCode: 'EMP-01042',
    jobTitle: 'Senior payroll analyst',
    department: 'Finance',
    employmentType: 'Full-time',
    startDate: '1 Mar 2021',
    payGroup: 'Monthly, Singapore'
  };
}
