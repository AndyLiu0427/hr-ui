import { Component } from '@angular/core';
import { TextareaComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-textarea-demo',
  imports: [TextareaComponent],
  host: { class: 'block w-full max-w-md' },
  template: `
    <oct-textarea
      label="Reason for leave"
      placeholder="Tell your manager why you need the time off."
      helperText="Your manager sees this with the request."
    />
  `
})
export default class TextareaDemo {}
