import { Component, signal } from '@angular/core';
import { TextareaComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-textarea-character-count',
  imports: [TextareaComponent],
  host: { class: 'block w-full max-w-md' },
  template: `
    <oct-textarea
      label="Note on the payslip"
      placeholder="The employee sees this under their net pay."
      [maxLength]="limit"
      [(value)]="note"
      [helperText]="note().length + ' of ' + limit + ' characters'"
    />
  `
})
export default class TextareaCharacterCount {
  readonly limit = 160;
  readonly note = signal('');
}
