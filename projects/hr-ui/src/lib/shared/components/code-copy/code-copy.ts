import { Component, ChangeDetectionStrategy, signal, input } from '@angular/core';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'oct-code-copy',
  imports: [ButtonComponent],
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
      @if (copySuccess()) {
        Copied!
      } @else {
        Copy
      }
    </oct-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeCopyComponent {
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
