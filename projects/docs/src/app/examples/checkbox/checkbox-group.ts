import { Component, signal } from '@angular/core';
import { CheckboxComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-checkbox-group',
  imports: [CheckboxComponent],
  template: `
    <fieldset class="flex flex-col gap-3">
      <legend class="mb-3 text-sm font-medium text-1">Email me when</legend>
      @for (alert of alerts; track alert.label) {
        <oct-checkbox [label]="alert.label" [(checked)]="alert.on" />
      }
    </fieldset>
  `
})
export default class CheckboxGroup {
  readonly alerts = [
    { label: 'A leave request needs my approval', on: signal(true) },
    { label: 'An expense claim is submitted', on: signal(false) },
    { label: 'A pay run is ready to review', on: signal(true) }
  ];
}
