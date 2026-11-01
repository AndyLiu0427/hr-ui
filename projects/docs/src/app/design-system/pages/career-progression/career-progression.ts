import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CardComponent, CardContentComponent } from 'hr-ui';
import { TextComponent } from 'hr-ui';
import {
  CareerProgressionAssignment,
  CareerProgressionComponent,
  CareerProgressionContract
} from 'hr-ui';

@Component({
  selector: 'oct-career-progression-page',
  templateUrl: './career-progression.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent, CardContentComponent, TextComponent, CareerProgressionComponent]
})
export class CareerProgressionPageComponent {
  readonly sampleContracts: CareerProgressionContract[] = [
    {
      id: 'c-2',
      startDate: '2025-06-01',
      clients: [
        {
          name: 'Acme Corporation',
          assignments: [{ id: 'a-4', department: 'ACME_CENTRAL', jobTitle: 'Senior Software Engineer', startDate: '2025-06-01' }]
        }
      ]
    },
    {
      id: 'c-1',
      startDate: '2023-01-15',
      endDate: '2024-12-31',
      clients: [
        {
          name: 'Tech Solutions Inc.',
          assignments: [
            { id: 'a-1', department: 'TS_PLATFORM', jobTitle: 'Software Developer', startDate: '2023-01-15', endDate: '2023-12-31' },
            { id: 'a-2', department: 'TS_MOBILE', jobTitle: 'Software Developer', startDate: '2024-01-01', endDate: '2024-06-30' }
          ]
        },
        {
          name: 'StartUp Labs',
          assignments: [{ id: 'a-3', department: 'SUL_MAIN', jobTitle: 'Contract Developer', startDate: '2024-07-01', endDate: '2024-12-31' }]
        }
      ]
    }
  ];

  readonly singleClientContract: CareerProgressionContract[] = [
    {
      id: 'c-solo',
      startDate: '2024-03-15',
      endDate: '2024-09-30',
      clients: [
        {
          name: 'Harborline Freight',
          assignments: [{ id: 'a-solo', department: 'HBL_02', startDate: '2024-03-15', endDate: '2024-09-30' }]
        }
      ]
    }
  ];

  onAssignmentClick(assignment: CareerProgressionAssignment): void {
    console.log('Assignment clicked:', assignment);
  }
}
