import { Component } from '@angular/core';
import { ButtonComponent, DividerComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-divider-label',
  imports: [ButtonComponent, DividerComponent],
  host: { class: 'w-full max-w-xs' },
  template: `
    <oct-button icon="Upload" [fullWidth]="true">Import employees from CSV</oct-button>
    <oct-divider text="or" />
    <oct-button variant="outline" color="neutral" icon="UserPlus" [fullWidth]="true">Add one employee</oct-button>
  `
})
export default class DividerLabel {}
