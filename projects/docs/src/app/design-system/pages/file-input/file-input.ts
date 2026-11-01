import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FileInputComponent } from 'hr-ui';
import { ButtonComponent } from 'hr-ui';
import { CardComponent, CardContentComponent } from 'hr-ui';
import { TextComponent } from 'hr-ui';

@Component({
  selector: 'oct-file-input-page',
  templateUrl: './file-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FileInputComponent, ButtonComponent, CardComponent, CardContentComponent, TextComponent]
})
export class FileInputPageComponent {
  readonly previewLogo = signal<string | null>(null);
  readonly previewSelectedName = signal<string | null>(null);
  readonly buttonSelectedNames = signal<string[]>([]);

  onPreviewSelected(files: File[]): void {
    const file = files[0];
    if (!file) return;
    this.previewSelectedName.set(file.name);
  }

  onPreviewRemove(): void {
    this.previewLogo.set(null);
    this.previewSelectedName.set(null);
  }

  onButtonSelected(files: File[]): void {
    this.buttonSelectedNames.set(files.map(f => f.name));
  }

  resetButtonDemo(): void {
    this.buttonSelectedNames.set([]);
  }
}
