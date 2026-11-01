import { Component } from '@angular/core';
import { TextareaComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-textarea-states',
  imports: [TextareaComponent],
  host: { class: 'grid w-full max-w-2xl gap-x-4 gap-y-2 sm:grid-cols-2' },
  template: `
    <oct-textarea
      label="Original request"
      value="Family wedding in Penang. I will hand over the March payroll checks to Li Wei before I go."
      [readonly]="true"
      helperText="Written by the employee."
    />
    <oct-textarea
      label="HR comments"
      value="Approved by Priya Nair on 3 November 2026."
      [disabled]="true"
      helperText="Closed requests cannot be edited."
    />
  `
})
export default class TextareaStates {}
