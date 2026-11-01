import { Component, computed, signal } from '@angular/core';
import { HighlightPipe, InputComponent, OctDatePipe } from 'ngx-hr-ui';

@Component({
  selector: 'example-pipes-demo',
  imports: [HighlightPipe, InputComponent, OctDatePipe],
  host: { class: 'w-full max-w-sm' },
  template: `
    <oct-input [(value)]="query" type="search" leftIcon="Search" placeholder="Search employees" ariaLabel="Search employees" [hideHelper]="true" />
    <ul class="mt-3 text-sm">
      @for (employee of matches(); track employee.code) {
        <li class="flex justify-between gap-4 border-b border-primary py-2.5 last:border-b-0">
          <span class="text-1" [innerHTML]="employee.name | highlight: query()"></span>
          <span class="shrink-0 text-3">Joined {{ employee.startDate | octDate }}</span>
        </li>
      } @empty {
        <li class="py-2.5 text-3">No employees match "{{ query() }}".</li>
      }
    </ul>
  `
})
export default class PipesDemo {
  readonly query = signal('li');
  readonly employees = [
    { code: 'EMP-01042', name: 'Mei Lin Chen', startDate: '2021-03-01' },
    { code: 'EMP-01107', name: 'Aisha Rahman', startDate: '2022-08-15' },
    { code: 'EMP-01188', name: 'Daniel Lim', startDate: '2023-01-09' },
    { code: 'EMP-01203', name: 'Priya Nair', startDate: '2024-06-03' }
  ];
  readonly matches = computed(() => this.employees.filter(e => e.name.toLowerCase().includes(this.query().toLowerCase())));
}
