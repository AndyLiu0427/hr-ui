import { Component } from '@angular/core';
import { FileInputComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-file-input-icon-only',
  imports: [FileInputComponent],
  template: `
    <div class="flex items-center gap-3">
      <oct-file-input
        mode="button"
        icon="Paperclip"
        variant="ghost"
        color="neutral"
        accept="application/pdf,image/png,image/jpeg"
        [iconOnly]="true"
        ariaLabel="Attach a receipt"
      />
      <span class="text-sm text-2">Taxi to client site, SGD 32.40</span>
    </div>
  `
})
export default class FileInputIconOnly {}
