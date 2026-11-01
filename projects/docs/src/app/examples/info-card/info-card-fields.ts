import { Component } from '@angular/core';
import { InfoCardComponent, type CardConfig } from 'ngx-hr-ui';

@Component({
  selector: 'example-info-card-fields',
  imports: [InfoCardComponent],
  host: { class: 'w-full max-w-xl' },
  template: `<oct-info-card [config]="config" [data]="payDetails" />`
})
export default class InfoCardFields {
  readonly config: CardConfig = {
    title: 'Pay details',
    fields: [
      // A formatter gets the whole record, not only the field's value.
      { key: 'basicPay', label: 'Monthly basic pay', formatter: pay => `SGD ${pay.basicPay.toLocaleString('en-SG')}` },
      // A key with dots reads a nested value.
      { key: 'bank.name', label: 'Bank' },
      { key: 'overtimeRate', label: 'Overtime rate', defaultValue: 'Not eligible' },
      { key: 'mailingAddress', label: 'Mailing address', preserveLineBreaks: true }
    ]
  };

  readonly payDetails = {
    basicPay: 6800,
    bank: { name: 'DBS Bank' },
    overtimeRate: null,
    mailingAddress: '20 Anson Road, #12-01\nSingapore 079912'
  };
}
