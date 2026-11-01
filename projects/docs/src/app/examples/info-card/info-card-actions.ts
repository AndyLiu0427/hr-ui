import { Component, computed, signal } from '@angular/core';
import { InfoCardComponent, type CardAction, type CardConfig } from 'ngx-hr-ui';

@Component({
  selector: 'example-info-card-actions',
  imports: [InfoCardComponent],
  host: { class: 'w-full max-w-xl' },
  template: `
    <oct-info-card
      [config]="config"
      [data]="employee"
      [actions]="actions()"
      [status]="active() ? 'Active' : 'Inactive'"
      [statusColor]="active() ? 'success' : 'neutral'"
    />
  `
})
export default class InfoCardActions {
  readonly active = signal(true);
  readonly payslipSent = signal(false);

  readonly actions = computed<CardAction[]>(() => [
    {
      label: this.payslipSent() ? 'Payslip sent' : 'Send payslip',
      icon: 'Send',
      position: 'title',
      disabled: this.payslipSent() || !this.active(),
      handler: () => this.payslipSent.set(true)
    },
    {
      label: this.active() ? 'Deactivate' : 'Reactivate',
      icon: this.active() ? 'UserX' : 'UserCheck',
      handler: () => this.active.update(active => !active)
    }
  ]);

  readonly config: CardConfig = {
    title: 'Mei Lin Chen',
    fields: [
      { key: 'employeeCode', label: 'Employee code' },
      { key: 'department', label: 'Department' }
    ]
  };
  readonly employee = { employeeCode: 'EMP-01042', department: 'Finance' };
}
