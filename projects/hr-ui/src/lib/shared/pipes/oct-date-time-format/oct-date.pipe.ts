import { Pipe, PipeTransform, inject } from '@angular/core';
import { DateService } from '../../../services/general/date.service';

/**
 * Formats a date as dd MMM yyyy, such as 24 Jul 2025. Takes an Angular DatePipe format and a
 * time zone offset, which defaults to +0800.
 *
 * @example
 * {{ date | octDate }}
 * {{ date | octDate : 'dd MMM yyyy' }}
 * {{ date | octDate : 'dd MMM yyyy' : '+0800' }}
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
 * Formats a time as hh:mma, such as 09:00AM. Takes an Angular DatePipe format and a time zone
 * offset, which defaults to +0800.
 *
 * @example
 * {{ date | octTime }}
 * {{ date | octTime : 'hh:mma' }}
 * {{ date | octTime : 'hh:mma' : '+0800' }}
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
 * Formats a date and time as dd MMM yyyy hh:mma, such as 24 Jul 2025 09:00AM. Takes an Angular
 * DatePipe format and a time zone offset, which defaults to +0800.
 *
 * @example
 * {{ date | octDateTime }}                           // 24 Jul 2025 09:00AM (standard format)
 * {{ date | octDateTime : 'dd/MM/yyyy HH:mm' }}      // 24/07/2025 09:00
 * {{ date | octDateTime : 'EEE, dd MMM yyyy HH:mm' }} // Thu, 24 Jul 2025 09:00
 * {{ date | octDateTime : 'dd MMM yyyy hh:mma' : '+0800' }}
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
