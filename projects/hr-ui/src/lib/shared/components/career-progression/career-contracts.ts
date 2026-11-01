import { CareerProgressionContract } from './career-progression';

/** The assignment fields the tree is built from. */
export interface CareerContractSource {
  _id: string;
  clientName?: string;
  clientDeptName?: string;
  clientDeptCode?: string;
  jobTitle?: string;
  startDate?: string;
  endDate?: string;
  /** The employee's actual final working day, where one is recorded. */
  lastServiceDay?: string;
  restartEmployment?: boolean;
}

const timestamp = (date: string): number => new Date(date).getTime();

const endOf = (assignment: CareerContractSource): string | undefined => assignment.lastServiceDay || assignment.endDate || undefined;

/**
 * Group assignments into the contracts they were served under.
 *
 * An assignment with `restartEmployment` true starts a contract; every
 * assignment after it belongs to that contract until the next one that does.
 * Almost no assignment carries the flag today, so the first assignment opens a
 * contract whether or not it is flagged - without that the whole career would
 * have no contract to sit in.
 *
 * Contracts come back most recent first, but the clients within a contract and
 * the assignments within a client read forwards, the order they happened in.
 */
export function buildCareerContracts(assignments: readonly CareerContractSource[] | null | undefined): CareerProgressionContract[] {
  const ordered = (assignments ?? [])
    .filter(assignment => !!assignment.startDate)
    .slice()
    .sort((a, b) => timestamp(a.startDate!) - timestamp(b.startDate!) || a._id.localeCompare(b._id));

  const contracts: CareerProgressionContract[] = [];
  // Tracked alongside each contract: a contract with one open-ended assignment
  // is itself open-ended, whatever the others say.
  const openEnded = new Set<string>();

  for (const assignment of ordered) {
    if (assignment.restartEmployment === true || contracts.length === 0) {
      contracts.push({ id: assignment._id, startDate: assignment.startDate!, clients: [] });
    }

    const contract = contracts[contracts.length - 1];
    const end = endOf(assignment);

    if (!end) {
      openEnded.add(contract.id);
      contract.endDate = undefined;
    } else if (!openEnded.has(contract.id) && (!contract.endDate || timestamp(end) > timestamp(contract.endDate))) {
      contract.endDate = end;
    }

    const name = assignment.clientName || 'Unknown Client';
    let client = contract.clients.find(candidate => candidate.name === name);
    if (!client) {
      client = { name, assignments: [] };
      contract.clients.push(client);
    }

    client.assignments.push({
      id: assignment._id,
      department: assignment.clientDeptName || assignment.clientDeptCode || '-',
      jobTitle: assignment.jobTitle || undefined,
      startDate: assignment.startDate!,
      endDate: end
    });
  }

  return contracts.reverse();
}
