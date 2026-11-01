import { Component } from '@angular/core';
import { ButtonComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-button-demo',
  imports: [ButtonComponent],
  template: `
    <div class="flex flex-wrap items-center gap-3">
      <oct-button icon="Plus">Add employee</oct-button>
      <oct-button variant="outline" color="neutral" icon="Download">Export</oct-button>
      <oct-button variant="ghost" color="neutral">Cancel</oct-button>
    </div>
  `
})
export default class ButtonDemo {}
