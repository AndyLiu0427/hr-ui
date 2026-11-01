import { Component } from '@angular/core';
import { InputComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-input-password',
  imports: [InputComponent],
  host: { class: 'block w-full max-w-sm' },
  template: `
    <oct-input label="Password" type="password" [showPasswordToggle]="true" helperText="At least 12 characters." />
  `
})
export default class InputPassword {}
