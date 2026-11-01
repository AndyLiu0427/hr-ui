import { Component, signal } from '@angular/core';
import { RadioComponent } from 'ngx-hr-ui';

@Component({
  selector: 'example-radio-table',
  imports: [RadioComponent],
  host: { class: 'block w-full max-w-md' },
  template: `
    <table class="w-full text-left text-sm text-1">
      <caption class="mb-2 text-left font-medium">Salary account for Arjun Mehta</caption>
      <thead class="text-3">
        <tr>
          <th scope="col" class="w-10 py-2 font-medium"><span class="sr-only">Pay into</span></th>
          <th scope="col" class="py-2 font-medium">Bank</th>
          <th scope="col" class="py-2 font-medium">Account</th>
        </tr>
      </thead>
      <tbody>
        @for (account of accounts; track account.id) {
          <tr class="border-t border-primary">
            <td class="py-2.5">
              <oct-radio
                class="align-middle"
                name="salary-account"
                [ariaLabel]="'Pay salary into ' + account.bank + ' account ending ' + account.last4"
                [checked]="accountId() === account.id"
                (radioChange)="accountId.set(account.id)"
              />
            </td>
            <td class="py-2.5">{{ account.bank }}</td>
            <td class="py-2.5 tabular-nums">•••• {{ account.last4 }}</td>
          </tr>
        }
      </tbody>
    </table>
  `
})
export default class RadioTable {
  readonly accountId = signal('a1');

  readonly accounts = [
    { id: 'a1', bank: 'DBS', last4: '4821' },
    { id: 'a2', bank: 'OCBC', last4: '0937' },
    { id: 'a3', bank: 'Maybank', last4: '5502' }
  ];
}
