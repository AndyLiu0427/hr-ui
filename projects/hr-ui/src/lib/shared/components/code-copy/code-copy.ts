import { Component, ChangeDetectionStrategy, signal, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../button/button';

/**
 * A Copy button for a block of code or text. It sits in the top-right corner of its nearest positioned parent.
 * Its text, "Copy" and then "Copied", comes from the i18n files.
 */
@Component({
  selector: 'oct-code-copy',
  imports: [TranslateModule, ButtonComponent],
  template: `
    <oct-button
      variant="outline"
      [color]="copySuccess() ? 'success' : 'neutral'"
      size="sm"
      shape="square"
      [icon]="copySuccess() ? 'Check' : 'Copy'"
      iconPosition="left"
      class="absolute top-4 right-4 z-10"
      (buttonClick)="copyCode()"
    >
      {{ (copySuccess() ? 'COMMON.COPIED' : 'COMMON.COPY') | translate }}
    </oct-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeCopyComponent {
  /** The text to copy. */
  readonly code = input.required<string>();

  copySuccess = signal(false);

  async copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copySuccess.set(true);

      // Reset after 2 seconds
      setTimeout(() => {
        this.copySuccess.set(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }
}
