import { Component, signal } from '@angular/core';
import { CheckboxComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-checkbox-demo',
  imports: [CheckboxComponent],
  template: `<oct-checkbox label="Email payslips to employees" [(checked)]="emailPayslips" />`
})
export default class CheckboxDemo {
  readonly emailPayslips = signal(true);
}
