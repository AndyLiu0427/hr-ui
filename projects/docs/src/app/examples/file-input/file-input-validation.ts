import { Component } from '@angular/core';
import { FileInputComponent, FileInputLabels } from 'ngx-hr-ui';

@Component({
  selector: 'example-file-input-validation',
  imports: [FileInputComponent],
  host: { class: 'block w-full max-w-xs' },
  template: `
    <oct-file-input
      accept="image/png,image/jpeg"
      [maxFileSize]="500 * 1024"
      [labels]="labels"
      placeholderIcon="UserRound"
    />
  `
})
export default class FileInputValidation {
  // List exact MIME types: the check compares them one by one with the file's type.
  readonly labels: FileInputLabels = {
    buttonText: 'Upload profile photo',
    placeholderText: 'No photo yet',
    helpText: 'PNG or JPEG, up to 500 KB.',
    errorMessageTooLarge: 'This photo is over 500 KB. Choose a smaller one.',
    errorMessageInvalidType: 'Choose a PNG or JPEG photo.',
    removeButtonAriaLabel: 'Remove photo'
  };
}
