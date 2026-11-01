import { Pipe, PipeTransform, inject } from '@angular/core';
import { DateService } from '../../../services/general/date.service';

/**
 * OctDate Pipe - Format dates using user's preferred format
 * Uses the unified DateService for consistent formatting
 *
 * Usage: {{ date | octDate }}
 *        {{ date | octDate : 'dd MMM yyyy' }}
 *        {{ date | octDate : 'dd MMM yyyy' : '+0800' }}
 */
@Pipe({ name: 'octDate' })
export class OctDatePipe implements PipeTransform {
  private dateService = inject(DateService);

  transform(date: any, format?: string, timezone?: string): string {
    if (!date) {
      return '';
    }

    // Use DateService which handles moment objects internally
    return this.dateService.formatDate(date, true, format, timezone);
  }
}

/**
 * OctTime Pipe - Format time using user's preferred format
 * Uses the unified DateService for consistent formatting
 *
 * Usage: {{ date | octTime }}
 *        {{ date | octTime : 'hh:mma' }}
 *        {{ date | octTime : 'hh:mma' : '+0800' }}
 */
@Pipe({ name: 'octTime' })
export class OctTimePipe implements PipeTransform {
  private dateService = inject(DateService);

  transform(date: any, format?: string, timezone?: string): string {
    if (!date) {
      return '';
    }

    // Use DateService which handles moment objects internally
    return this.dateService.formatTime(date, true, format, timezone);
  }
}

/**
 * OctDateTime Pipe - Format date and time together
 * Uses the unified DateService for consistent formatting
 *
 * Usage: {{ date | octDateTime }}
 *        {{ date | octDateTime : 'dd MMM yyyy hh:mma' }}
 *        {{ date | octDateTime : 'dd MMM yyyy hh:mma' : '+0800' }}
 *
 * Examples:
 *   {{ date | octDateTime }}                           // 24 Jul 2025 09:00AM (standard format)
 *   {{ date | octDateTime : 'dd/MM/yyyy HH:mm' }}      // 24/07/2025 09:00
 *   {{ date | octDateTime : 'EEE, dd MMM yyyy HH:mm' }} // Thu, 24 Jul 2025 09:00
 */
@Pipe({ name: 'octDateTime' })
export class OctDateTimePipe implements PipeTransform {
  private dateService = inject(DateService);

  transform(date: any, format?: string, timezone?: string): string {
    if (!date) {
      return '';
    }

    // Use DateService which handles moment objects internally
    return this.dateService.formatDateTime(date, format, timezone);
  }
}
