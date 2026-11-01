import { Component } from '@angular/core';
import { NoticeComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-notice-demo',
  imports: [NoticeComponent],
  template: `
    <div class="w-full max-w-lg">
      <oct-notice variant="warning">The October pay run locks on 25 October. Changes after that go into the November run.</oct-notice>
    </div>
  `
})
export default class NoticeDemo {}
