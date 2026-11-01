import { Component, signal } from '@angular/core';
import { FileInputComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-file-input-button',
  imports: [FileInputComponent],
  template: `
    <div class="flex flex-col items-center gap-3">
      <oct-file-input mode="button" accept="application/pdf" [multiple]="true" (filesSelected)="files.set($event)">
        Attach timesheets
      </oct-file-input>
      @for (file of files(); track file.name) {
        <span class="text-sm text-2">{{ file.name }}</span>
      } @empty {
        <span class="text-sm text-3">PDF only. You can pick several files.</span>
      }
    </div>
  `
})
export default class FileInputButton {
  readonly files = signal<File[]>([]);
}
