import { Component } from '@angular/core';
import { ButtonComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-button-colors',
  imports: [ButtonComponent],
  template: `
    <div class="flex flex-wrap items-center gap-3">
      <oct-button color="primary">Primary</oct-button>
      <oct-button color="neutral">Neutral</oct-button>
      <oct-button color="success">Approve</oct-button>
      <oct-button color="warning">Hold</oct-button>
      <oct-button color="error">Delete</oct-button>
      <oct-button color="info">Details</oct-button>
    </div>
  `
})
export default class ButtonColors {}
