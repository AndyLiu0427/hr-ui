import { Component } from '@angular/core';
import { CareerProgressionComponent, CareerProgressionContract } from 'ngx-hr-ui';

@Component({
  selector: 'example-career-progression-demo',
  imports: [CareerProgressionComponent],
  host: { class: 'w-full' },
  template: `
    <div class="mx-auto max-w-xl">
      <oct-career-progression [contracts]="contracts" />
    </div>
  `
})
export default class CareerProgressionDemo {
  // Most recent contract first. The current one has no end date.
  readonly contracts: CareerProgressionContract[] = [
    {
      id: 'C-2025-06',
      startDate: '2025-06-02',
      clients: [
        {
          name: 'Harbourline Freight',
          assignments: [{ id: 'A-118', department: 'Warehouse Operations', jobTitle: 'Inventory Supervisor', startDate: '2025-06-02' }]
        }
      ]
    },
    {
      id: 'C-2022-03',
      startDate: '2022-03-01',
      endDate: '2025-02-28',
      clients: [
        {
          name: 'Marina Retail Group',
          assignments: [
            { id: 'A-071', department: 'Orchard Store', jobTitle: 'Sales Associate', startDate: '2022-03-01', endDate: '2023-08-31' },
            { id: 'A-094', department: 'Jewel Changi Store', jobTitle: 'Senior Sales Associate', startDate: '2023-09-01', endDate: '2024-06-30' }
          ]
        },
        {
          name: 'Changi Air Services',
          assignments: [{ id: 'A-102', department: 'Cargo Terminal 5', jobTitle: 'Cargo Officer', startDate: '2024-07-01', endDate: '2025-02-28' }]
        }
      ]
    }
  ];
}
