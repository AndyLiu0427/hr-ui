import { Component } from '@angular/core';
import { LoadingComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-loading-demo',
  imports: [LoadingComponent],
  template: `<oct-loading text="Loading payslips" />`
})
export default class LoadingDemo {}
