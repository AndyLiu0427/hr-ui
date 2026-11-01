import { describe, expect, it } from 'vitest';
import { CareerContractSource, buildCareerContracts } from './career-contracts';

const assignment = (overrides: Partial<CareerContractSource> & { _id: string }): CareerContractSource => ({
  clientName: 'Client A',
  clientDeptName: 'DEPT_A',
  jobTitle: 'Crew',
  startDate: '2024-01-01',
  endDate: '2024-06-30',
  ...overrides
});

describe('buildCareerContracts', () => {
  it('opens a contract on restartEmployment and keeps the ones after it inside', () => {
    const contracts = buildCareerContracts([
      assignment({ _id: 'a', startDate: '2024-01-01', endDate: '2024-06-30', restartEmployment: true }),
      assignment({ _id: 'b', startDate: '2024-07-01', endDate: '2024-12-31', restartEmployment: false }),
      assignment({ _id: 'c', startDate: '2025-01-01', endDate: '2025-06-30', restartEmployment: true })
    ]);

    // Most recent contract first.
    expect(contracts.map(contract => contract.id)).toEqual(['c', 'a']);
    expect(contracts[1].clients[0].assignments.map(a => a.id)).toEqual(['a', 'b']);
  });

  it('opens a contract for the first assignment even when nothing is flagged', () => {
    // Almost no assignment carries the flag, so without this the tree is empty.
    const contracts = buildCareerContracts([assignment({ _id: 'a' }), assignment({ _id: 'b', startDate: '2024-07-01' })]);

    expect(contracts).toHaveLength(1);
    expect(contracts[0].clients[0].assignments.map(a => a.id)).toEqual(['a', 'b']);
  });

  it('spans several clients in one contract', () => {
    const contracts = buildCareerContracts([
      assignment({ _id: 'a', clientName: 'Client A', startDate: '2024-01-01', endDate: '2024-03-31' }),
      assignment({ _id: 'b', clientName: 'Client B', startDate: '2024-04-01', endDate: '2024-06-30' }),
      assignment({ _id: 'c', clientName: 'Client A', startDate: '2024-07-01', endDate: '2024-09-30' })
    ]);

    expect(contracts).toHaveLength(1);
    expect(contracts[0].clients.map(client => client.name)).toEqual(['Client A', 'Client B']);
    expect(contracts[0].clients[0].assignments.map(a => a.id)).toEqual(['a', 'c']);
  });

  it('runs the contract from its first start to its latest end', () => {
    const contracts = buildCareerContracts([
      assignment({ _id: 'a', startDate: '2024-01-01', endDate: '2024-03-31' }),
      assignment({ _id: 'b', startDate: '2024-02-01', endDate: '2024-09-30' })
    ]);

    expect(contracts[0].startDate).toBe('2024-01-01');
    expect(contracts[0].endDate).toBe('2024-09-30');
  });

  it('leaves the contract open-ended when any assignment has no end date', () => {
    const contracts = buildCareerContracts([
      assignment({ _id: 'a', startDate: '2024-01-01', endDate: undefined }),
      assignment({ _id: 'b', startDate: '2024-02-01', endDate: '2024-09-30' })
    ]);

    expect(contracts[0].endDate).toBeUndefined();
  });

  it('prefers lastServiceDay over endDate', () => {
    const contracts = buildCareerContracts([assignment({ _id: 'a', endDate: '2024-06-30', lastServiceDay: '2024-05-15' })]);

    expect(contracts[0].clients[0].assignments[0].endDate).toBe('2024-05-15');
    expect(contracts[0].endDate).toBe('2024-05-15');
  });

  it('ignores assignments with no start date', () => {
    const contracts = buildCareerContracts([assignment({ _id: 'a', startDate: undefined }), assignment({ _id: 'b' })]);

    expect(contracts[0].clients[0].assignments.map(a => a.id)).toEqual(['b']);
  });

  it('falls back to the department code, then a dash', () => {
    const contracts = buildCareerContracts([
      assignment({ _id: 'a', clientDeptName: undefined, clientDeptCode: 'DEPT_CODE' }),
      assignment({ _id: 'b', startDate: '2024-07-01', clientDeptName: undefined, clientDeptCode: undefined })
    ]);

    const assignments = contracts[0].clients[0].assignments;
    expect(assignments[0].department).toBe('DEPT_CODE');
    expect(assignments[1].department).toBe('-');
  });

  it('returns nothing for an empty or missing list', () => {
    expect(buildCareerContracts([])).toEqual([]);
    expect(buildCareerContracts(null)).toEqual([]);
    expect(buildCareerContracts(undefined)).toEqual([]);
  });
});
