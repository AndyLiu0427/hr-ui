import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LayoutComponent } from './layout/layout';

@Component({
  selector: 'oct-design-system',
  template: '<oct-layout></oct-layout>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LayoutComponent]
})
export class DesignSystemComponent {}
