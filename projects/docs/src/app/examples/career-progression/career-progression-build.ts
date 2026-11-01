import { Component } from '@angular/core';
import { CareerContractSource, CareerProgressionComponent, buildCareerContracts } from 'ngx-hr-ui';

// Assignment records as they come from the server, oldest first.
const ASSIGNMENTS: CareerContractSource[] = [
  { _id: 'A-071', clientName: 'Marina Retail Group', clientDeptName: 'Orchard Store', jobTitle: 'Sales Associate', startDate: '2022-03-01', endDate: '2023-08-31' },
  { _id: 'A-094', clientName: 'Marina Retail Group', clientDeptName: 'Jewel Changi Store', jobTitle: 'Senior Sales Associate', startDate: '2023-09-01', endDate: '2024-06-30' },
  // Left early: lastServiceDay wins over the planned endDate.
  { _id: 'A-102', clientName: 'Changi Air Services', clientDeptName: 'Cargo Terminal 5', jobTitle: 'Cargo Officer', startDate: '2024-07-01', endDate: '2025-06-30', lastServiceDay: '2025-02-28' },
  // restartEmployment starts a new contract.
  { _id: 'A-118', clientName: 'Harbourline Freight', clientDeptName: 'Warehouse Operations', jobTitle: 'Inventory Supervisor', startDate: '2025-06-02', restartEmployment: true }
];

@Component({
  selector: 'example-career-progression-build',
  imports: [CareerProgressionComponent],
  host: { class: 'w-full' },
  template: `
    <div class="mx-auto max-w-xl">
      <oct-career-progression [contracts]="contracts" />
    </div>
  `
})
export default class CareerProgressionBuild {
  readonly contracts = buildCareerContracts(ASSIGNMENTS);
}
