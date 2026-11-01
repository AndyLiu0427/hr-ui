import { Component, signal } from '@angular/core';
import { FileInputComponent, FileInputLabels } from 'ngx-hr-ui';

@Component({
  selector: 'example-file-input-demo',
  imports: [FileInputComponent],
  host: { class: 'block w-full max-w-xs' },
  template: `
    <oct-file-input
      accept="image/png,image/jpeg,image/svg+xml"
      [maxFileSize]="2 * 1024 * 1024"
      [labels]="labels"
      (filesSelected)="logo.set($event[0])"
      (removeFile)="logo.set(null)"
    />
  `
})
export default class FileInputDemo {
  readonly logo = signal<File | null>(null);

  readonly labels: FileInputLabels = {
    buttonText: 'Upload company logo',
    placeholderText: 'No logo yet',
    helpText: 'PNG, JPEG or SVG, up to 2 MB. It shows on every payslip.',
    removeButtonAriaLabel: 'Remove logo'
  };
}
