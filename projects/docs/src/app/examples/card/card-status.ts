import { Component } from '@angular/core';
import { CardComponent, CardContentComponent, type CardStatus } from 'ngx-hr-ui';

@Component({
  selector: 'example-card-status',
  imports: [CardComponent, CardContentComponent],
  host: { class: 'w-full' },
  template: `
    <div class="grid gap-4 sm:grid-cols-3">
      @for (file of bankFiles; track file.bank) {
        <oct-card [status]="file.status" padding="sm">
          <oct-card-content>
            <p class="text-sm font-medium text-1">{{ file.bank }}</p>
            <p class="mt-1 text-sm text-3">{{ file.result }}</p>
          </oct-card-content>
        </oct-card>
      }
    </div>
  `
})
export default class CardStatusExample {
  readonly bankFiles: { bank: string; result: string; status: CardStatus }[] = [
    { bank: 'OCBC', result: 'Waiting for upload', status: 'initial' },
    { bank: 'DBS', result: 'Accepted, 212 payments', status: 'success' },
    { bank: 'UOB', result: 'Rejected, 2 invalid accounts', status: 'error' }
  ];
}
