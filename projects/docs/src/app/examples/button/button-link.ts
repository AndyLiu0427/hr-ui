import { Component } from '@angular/core';
import { ButtonComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-button-link',
  imports: [ButtonComponent],
  template: `
    <!-- With href the button renders an <a>, so it can be opened in a new tab or copied. -->
    <oct-button
      variant="outline"
      color="neutral"
      icon="ExternalLink"
      iconPosition="right"
      href="https://www.npmjs.com/package/ngx-hr-ui"
      target="_blank"
    >
      View on npm
    </oct-button>
  `
})
export default class ButtonLink {}
