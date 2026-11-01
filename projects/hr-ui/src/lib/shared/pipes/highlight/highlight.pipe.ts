import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Highlights matching text within a string by wrapping matches in <mark> tags.
 * Used for search result highlighting in the global search dialog.
 *
 * @example
 * <span [innerHTML]="employee.name | highlight:searchQuery()"></span>
 */
@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(text: string | null | undefined, query: string): SafeHtml {
    if (!text) return '';
    if (!query || query.length < 2) return this.escape(text);

    const escaped = this.escape(text);
    const escapedQuery = this.escapeRegex(query);
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const highlighted = escaped.replace(regex, '<mark class="bg-hr-yellow-500/30 text-1 rounded-sm px-0.5">$1</mark>');

    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }

  /** Escape HTML special characters to prevent XSS */
  private escape(text: string): string {
    return text.replaceAll(/&/g, '&amp;').replaceAll(/</g, '&lt;').replaceAll(/>/g, '&gt;').replaceAll(/"/g, '&quot;').replaceAll(/'/g, '&#039;');
  }

  /** Escape regex special characters in the query */
  private escapeRegex(str: string): string {
    return str.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
