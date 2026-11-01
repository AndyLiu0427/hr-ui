import { Component } from '@angular/core';
import { InputComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-input-demo',
  imports: [InputComponent],
  host: { class: 'block w-full max-w-sm' },
  template: `
    <oct-input
      label="Work email"
      type="email"
      placeholder="name@company.com"
      helperText="Payslips are sent to this address."
    />
  `
})
export default class InputDemo {}
