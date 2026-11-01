import { Component } from '@angular/core';
import { ThemeControllerComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-theme-controller-toggle',
  imports: [ThemeControllerComponent],
  template: `<oct-theme-controller variant="toggle" [showLabel]="true" />`
})
export default class ThemeControllerToggle {}
