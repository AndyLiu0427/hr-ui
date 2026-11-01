import { Component, signal } from '@angular/core';
import { CheckboxComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-checkbox-description',
  imports: [CheckboxComponent],
  host: { class: 'block max-w-sm' },
  template: `
    <oct-checkbox
      label="Require manager approval"
      description="Leave requests wait for the reporting manager before HR sees them."
      [(checked)]="needsApproval"
    />
  `
})
export default class CheckboxDescription {
  readonly needsApproval = signal(true);
}
