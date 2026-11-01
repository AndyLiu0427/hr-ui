import { Component, signal } from '@angular/core';
import { FileInputComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-file-input-states',
  imports: [FileInputComponent],
  template: `
    <div class="flex flex-wrap items-center gap-3">
      <oct-file-input mode="button" accept="text/csv" [loading]="importing()" (filesSelected)="import()">
        Import bank file
      </oct-file-input>
      <oct-file-input mode="button" variant="outline" color="neutral" [disabled]="true">
        Upload IR8A forms
      </oct-file-input>
    </div>
  `
})
export default class FileInputStates {
  readonly importing = signal(false);

  import(): void {
    this.importing.set(true);
    setTimeout(() => this.importing.set(false), 2000);
  }
}
