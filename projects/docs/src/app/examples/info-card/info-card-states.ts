import { Component } from '@angular/core';
import { InfoCardComponent, type CardConfig } from 'ngx-hr-ui';

@Component({
  selector: 'example-info-card-states',
  imports: [InfoCardComponent],
  host: { class: 'w-full' },
  template: `
    <div class="grid gap-4 md:grid-cols-2">
      <oct-info-card [config]="config" [loading]="true" />
      <oct-info-card [config]="config" [data]="null" />
    </div>
  `
})
export default class InfoCardStates {
  readonly config: CardConfig = {
    title: 'Emergency contact',
    fields: [
      { key: 'name', label: 'Name' },
      { key: 'phone', label: 'Phone' }
    ]
  };
}
