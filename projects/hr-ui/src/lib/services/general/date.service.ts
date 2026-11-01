import { Service } from '@angular/core';
import { DatePipe } from '@angular/common';
import { addDays as addDaysFns } from 'date-fns';

/**
 * Unified Date Service
 * Combines date formatting, date-picker format configuration, and utility functions.
 * `display` and `parse` have the shape of Angular Material's MatDateFormats, so an app that uses
 * the Material datepicker can provide this service as MAT_DATE_FORMATS.
 *
 * Standard Formats:
 * - Date: DD MMM YYYY (e.g., 24 Jul 2025)
 * - Time: HH:mmAM (e.g., 09:00AM, 08:15PM)
 * - DateTime: DD MMM YYYY HH:mmAM (e.g., 24 Jul 2025 09:00AM)
 *
 * Note: This service does not use user preference settings.
 * All dates are formatted using standard formats defined below.
 */
@Service()
export class DateService {
  private readonly datePipe = new DatePipe('en-US');

  // Standard format constants
  readonly STANDARD_DATE_FORMAT = 'dd MMM yyyy'; // 24 Jul 2025
  readonly STANDARD_TIME_FORMAT = 'hh:mma'; // 09:00AM
  readonly STANDARD_DATETIME_FORMAT = 'dd MMM yyyy hh:mma'; // 24 Jul 2025 09:00AM
  readonly MATERIAL_DATE_FORMAT = 'dd/MM/yyyy'; // Material UI default
  readonly DEFAULT_TIMEZONE = '+0800'; // Default timezone

  // ========================================
  // Material UI Date Formats Configuration
  // ========================================

  get display() {
    return {
      dateInput: this.MATERIAL_DATE_FORMAT,
      monthYearLabel: 'yyyy',
      dateA11yLabel: this.MATERIAL_DATE_FORMAT,
      monthYearA11yLabel: 'MMMM yyyy'
    };
  }

  get parse() {
    return {
      dateInput: this.MATERIAL_DATE_FORMAT
    };
  }

  // ========================================
  // Format Methods
  // ========================================

  /**
   * Format date using standard format
   * @param date Date to format
   * @param _useUserFormat Ignored - kept for backward compatibility
   * @param customFormat Custom format string
   * @param timezone Timezone (default: +0800)
   * @returns Formatted date string
   */
  formatDate(date: Date | string | number | null | undefined, _useUserFormat: boolean = false, customFormat?: string, timezone?: string): string {
    if (!date) return '';

    // Convert moment objects if needed
    const dateObj = this.convertToDate(date);
    if (!this.isValid(dateObj)) return '';

    // Determine format
    const format = customFormat || this.STANDARD_DATE_FORMAT;

    // Determine timezone
    const tz = timezone || this.DEFAULT_TIMEZONE;

    return this.datePipe.transform(dateObj, format, tz) || '';
  }

  /**
   * Format time using standard format
   * @param date Date to format
   * @param _useUserFormat Ignored - kept for backward compatibility
   * @param customFormat Custom format string
   * @param timezone Timezone (default: +0800)
   * @returns Formatted time string
   */
  formatTime(date: Date | string | number | null | undefined, _useUserFormat: boolean = false, customFormat?: string, timezone?: string): string {
    if (!date) return '';

    const dateObj = this.convertToDate(date);
    if (!this.isValid(dateObj)) return '';

    const format = customFormat || this.STANDARD_TIME_FORMAT;

    const tz = timezone || this.DEFAULT_TIMEZONE;

    return this.datePipe.transform(dateObj, format, tz) || '';
  }

  /**
   * Format datetime using standard format
   * @param date Date to format
   * @param customFormat Custom format string
   * @param timezone Timezone (default: +0800)
   * @returns Formatted datetime string
   */
  formatDateTime(date: Date | string | number | null | undefined, customFormat?: string, timezone?: string): string {
    if (!date) return '';

    const dateObj = this.convertToDate(date);
    if (!this.isValid(dateObj)) return '';

    const format = customFormat || this.STANDARD_DATETIME_FORMAT;
    const tz = timezone || this.DEFAULT_TIMEZONE;

    return this.datePipe.transform(dateObj, format, tz) || '';
  }

  /**
   * Generic format method with full control
   * @param date Date to format
   * @param format Format string (Angular DatePipe format)
   * @param timezone Timezone offset (default: +0800)
   * @returns Formatted date string
   */
  format(date: Date | string | number | null | undefined, format: string = this.STANDARD_DATE_FORMAT, timezone?: string): string {
    if (!date) return '';

    const dateObj = this.convertToDate(date);
    if (!this.isValid(dateObj)) return '';

    const tz = timezone || this.DEFAULT_TIMEZONE;
    return this.datePipe.transform(dateObj, format, tz) || '';
  }

  // ========================================
  // Date Validation & Conversion
  // ========================================

  /**
   * Check if date is valid
   * @param date Date to check
   * @returns True if valid date
   */
  isValid(date: any): boolean {
    if (!date) return false;

    if (date instanceof Date) {
      return !Number.isNaN(date.getTime());
    }

    const parsedDate = new Date(date);
    return !Number.isNaN(parsedDate.getTime());
  }

  /**
   * Convert various date formats to Date object
   * @param date Date input (Date, string, number, moment)
   * @returns Date object
   */
  private convertToDate(date: any): Date {
    // Handle moment objects
    if (date && typeof date === 'object' && '_isAMomentObject' in date) {
      return new Date(date.toISOString());
    }

    return new Date(date);
  }

  /**
   * Parse date from string
   * @param dateString Date string
   * @returns Parsed date
   */
  parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  // ========================================
  // Date Comparison & Query
  // ========================================

  /**
   * Get difference between two dates in specified unit
   * @param date1 First date
   * @param date2 Second date
   * @param unit Unit: 'ms' | 'seconds' | 'minutes' | 'hours' | 'days'
   * @returns Difference in specified unit
   */
  diff(date1: Date | string, date2: Date | string, unit: 'ms' | 'seconds' | 'minutes' | 'hours' | 'days' = 'ms'): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffMs = d1.getTime() - d2.getTime();

    switch (unit) {
      case 'seconds':
        return Math.floor(diffMs / 1000);
      case 'minutes':
        return Math.floor(diffMs / (1000 * 60));
      case 'hours':
        return Math.floor(diffMs / (1000 * 60 * 60));
      case 'days':
        return Math.floor(diffMs / (1000 * 60 * 60 * 24));
      default:
        return diffMs;
    }
  }

  /**
   * Check if two dates are the same day
   * @param date1 First date
   * @param date2 Second date
   * @returns True if same day
   */
  isSameDay(date1: Date | string, date2: Date | string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  }

  /**
   * Check if date1 is before date2
   * @param date1 First date
   * @param date2 Second date
   * @returns True if date1 < date2
   */
  isBefore(date1: Date | string, date2: Date | string): boolean {
    return new Date(date1).getTime() < new Date(date2).getTime();
  }

  /**
   * Check if date1 is after date2
   * @param date1 First date
   * @param date2 Second date
   * @returns True if date1 > date2
   */
  isAfter(date1: Date | string, date2: Date | string): boolean {
    return new Date(date1).getTime() > new Date(date2).getTime();
  }

  /**
   * Convert date to timestamp (milliseconds)
   * @param date Date to convert
   * @returns Timestamp in milliseconds
   */
  toTimestamp(date: Date | string): number {
    return new Date(date).getTime();
  }

  // ========================================
  // Date Information
  // ========================================

  /**
   * Get current date
   * @returns Current date
   */
  now(): Date {
    return new Date();
  }

  /**
   * Get timezone offset in format like '+08:00'
   * @returns Timezone offset string
   */
  getTimezoneOffset(): string {
    const offset = new Date().getTimezoneOffset();
    const sign = offset > 0 ? '-' : '+';
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  /**
   * Get day of week (0 = Sunday, 6 = Saturday)
   * @param date Date
   * @returns Day of week number
   */
  getDayOfWeek(date: Date | string): number {
    return new Date(date).getDay();
  }

  /**
   * Get day name (short format like 'Mon', 'Tue', etc.)
   * @param date Date
   * @returns Short day name
   */
  getDayName(date: Date | string): string {
    return this.datePipe.transform(date, 'EEE') || '';
  }

  // ========================================
  // Start/End of Period
  // ========================================

  /**
   * Start of day (00:00:00)
   * @param date Date
   * @returns Date at start of day
   */
  startOfDay(date: Date | string): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * Start of month
   * @param date Date
   * @returns Date at start of month
   */
  startOfMonth(date: Date | string): Date {
    const result = new Date(date);
    result.setDate(1);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * End of month
   * @param date Date
   * @returns Date at end of month
   */
  endOfMonth(date: Date | string): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + 1, 0);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  // ========================================
  // ISO Format
  // ========================================

  /**
   * Format to ISO string with custom format
   * @param date Date to format
   * @returns ISO-like formatted string
   */
  toISOFormat(date: Date | string): string {
    return this.format(date, 'yyyy-MM-ddTHH:mm:ss.SSS');
  }

  // ========================================
  // Date Arithmetic (Allowed Methods Only)
  // ========================================

  /**
   * Add days to date
   * @param date Base date
   * @param days Days to add (can be negative to subtract)
   * @returns New date with days added
   */
  addDays(date: Date | string, days: number): Date {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return addDaysFns(dateObj, days);
  }

  /**
   * Add hours to date
   * @param date Base date
   * @param hours Hours to add (can be negative to subtract)
   * @returns New date with hours added
   */
  addHours(date: Date | string, hours: number): Date {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  }

  /**
   * Add minutes to date
   * @param date Base date
   * @param minutes Minutes to add (can be negative to subtract)
   * @returns New date with minutes added
   */
  addMinutes(date: Date | string, minutes: number): Date {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
  }
}
