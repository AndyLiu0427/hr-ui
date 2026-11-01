import { Component, signal } from '@angular/core';
import { CareerProgressionAssignment, CareerProgressionComponent, CareerProgressionContract } from 'ngx-hr-ui';

@Component({
  selector: 'example-career-progression-click',
  imports: [CareerProgressionComponent],
  host: { class: 'w-full' },
  template: `
    <div class="mx-auto max-w-xl">
      <oct-career-progression [contracts]="contracts" (assignmentClick)="selected.set($event)" />
      <p class="mt-4 text-sm text-2">
        @if (selected(); as assignment) {
          Selected: {{ assignment.department }} · {{ assignment.jobTitle }}
        } @else {
          Select an assignment to open it.
        }
      </p>
    </div>
  `
})
export default class CareerProgressionClick {
  readonly selected = signal<CareerProgressionAssignment | null>(null);

  readonly contracts: CareerProgressionContract[] = [
    {
      id: 'C-2024-01',
      startDate: '2024-01-08',
      clients: [
        {
          name: 'Tampines Polyclinic',
          assignments: [
            { id: 'A-201', department: 'Patient Services', jobTitle: 'Service Associate', startDate: '2024-01-08', endDate: '2025-03-31' },
            { id: 'A-233', department: 'Pharmacy', jobTitle: 'Pharmacy Assistant', startDate: '2025-04-01' }
          ]
        }
      ]
    }
  ];
}
