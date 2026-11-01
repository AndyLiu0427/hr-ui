import { Component } from '@angular/core';
import { CheckboxComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-checkbox-disabled',
  imports: [CheckboxComponent],
  template: `
    <div class="flex flex-col gap-3">
      <oct-checkbox label="Include in the CPF submission" [checked]="true" [disabled]="true" />
      <oct-checkbox label="Pay by cheque" [disabled]="true" />
    </div>
  `
})
export default class CheckboxDisabled {}
