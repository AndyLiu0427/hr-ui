import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { DateService } from '../../../services/general/date.service';
import { IconComponent } from '../icon/icon';
import { TextComponent } from '../text/text';

/** Leaf of the tree: one assignment, under the client it was served for. */
export interface CareerProgressionAssignment {
  id: string;
  /** Client department the assignment sits in. */
  department: string;
  jobTitle?: string;
  startDate: string;
  endDate?: string;
}

/** Middle level: one client within a contract. A contract can span several. */
export interface CareerProgressionClient {
  name: string;
  assignments: CareerProgressionAssignment[];
}

/**
 * Top level: one employment contract. It carries no name of its own - a
 * contract is a period, and the clients served during it hang beneath it.
 */
export interface CareerProgressionContract {
  id: string;
  startDate: string;
  /** Absent while the contract is still running. */
  endDate?: string;
  clients: CareerProgressionClient[];
}

export interface CareerProgressionConfig {
  emptyIcon?: string;
  emptyMessage?: string;
}

const DEFAULT_CONFIG: CareerProgressionConfig = {
  emptyIcon: 'Clock',
  emptyMessage: 'No items to display'
};

@Component({
  selector: 'oct-career-progression',
  templateUrl: './career-progression.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, TextComponent]
})
export class CareerProgressionComponent {
  private readonly dateService = inject(DateService);

  /** Contracts, most recent first. Clients and assignments read forwards. */
  readonly contracts = input.required<CareerProgressionContract[]>();

  readonly config = input<CareerProgressionConfig>({});

  /** Emitted when an assignment leaf is clicked. */
  readonly assignmentClick = output<CareerProgressionAssignment>();

  readonly mergedConfig = computed<CareerProgressionConfig>(() => ({
    ...DEFAULT_CONFIG,
    ...this.config()
  }));

  formatDate(date: string | null | undefined): string {
    if (!date) return '-';
    return this.dateService.formatDate(date);
  }

  formatDateRange(startDate: string, endDate?: string): string {
    const start = this.formatDate(startDate);
    const end = endDate ? this.formatDate(endDate) : 'Present';
    return `${start} - ${end}`;
  }

  /**
   * True when the contract has not ended: no end date, or one that has not
   * passed. Status is deliberately not consulted - assignments keep the Active
   * status long after their end date.
   */
  isContractOngoing(contract: CareerProgressionContract): boolean {
    const today = this.dateService.startOfDay(this.dateService.now());
    return !contract.endDate || !this.dateService.isBefore(contract.endDate, today);
  }

  /** Green marks the current, unfinished contract and nothing else. */
  getNodeClasses(isCurrent: boolean): string {
    // relative, or the trunk - an absolutely positioned pseudo-element - paints
    // over the dot instead of running behind it.
    const baseClasses = 'relative w-[9px] h-[9px] rounded-full shrink-0';
    return isCurrent ? `${baseClasses} bg-hr-green-500` : `${baseClasses} bg-hr-neutral-700`;
  }

  onAssignmentClick(assignment: CareerProgressionAssignment): void {
    this.assignmentClick.emit(assignment);
  }
}
