import { Component } from '@angular/core';
import { ThemeControllerComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-theme-controller-label',
  imports: [ThemeControllerComponent],
  template: `<oct-theme-controller [iconOnly]="false" [showLabel]="true" />`
})
export default class ThemeControllerLabel {}
