import { Component, signal } from '@angular/core';
import { SwitchComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-switch-demo',
  imports: [SwitchComponent],
  template: `<oct-switch label="Publish payslips on pay day" [(checked)]="publishPayslips" />`
})
export default class SwitchDemo {
  readonly publishPayslips = signal(true);
}
