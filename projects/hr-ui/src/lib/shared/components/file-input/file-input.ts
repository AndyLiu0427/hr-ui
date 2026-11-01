import { ChangeDetectionStrategy, Component, ElementRef, computed, input, output, signal, viewChild } from '@angular/core';

import { ButtonColor, ButtonComponent, ButtonSize, ButtonVariant } from '../button/button';
import { IconComponent } from '../icon/icon';
import { TextComponent } from '../text/text';

export interface FileInputLabels {
  placeholderText?: string;
  buttonText?: string;
  helpText?: string;
  removeButtonAriaLabel?: string;
  errorMessageTooLarge?: string;
  errorMessageInvalidType?: string;
}

export type FileInputMode = 'preview' | 'button';

/**
 * FileInputComponent — unified file picker with two visual modes.
 *
 * - `mode="preview"` (default): full dropzone + image preview + button + helpText.
 *   Suited for single-file workflows that benefit from a visible drop target and
 *   inline preview (e.g. company logo upload). MIME type and size validation run
 *   here when configured.
 *
 * - `mode="button"`: a bare {@link ButtonComponent} that opens the native file
 *   picker. No preview, no validation, no helper UI. Suited for compact toolbars
 *   like attachment headers. Label is provided via projected `<ng-content>`.
 *
 * Selected files are always emitted as an array via `filesSelected`. Single-file
 * callers can take `event[0]`. The hidden `<input>` value is reset after every
 * emit so the same file can be re-picked.
 */
@Component({
  selector: 'oct-file-input',
  templateUrl: './file-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, IconComponent, TextComponent]
})
export class FileInputComponent {
  readonly mode = input<FileInputMode>('preview');
  readonly accept = input<string>('');
  readonly multiple = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);

  readonly preview = input<string | null>(null);
  readonly maxFileSize = input<number | null>(5 * 1024 * 1024);
  readonly placeholderIcon = input<string>('Image');
  readonly error = input<string | null>(null);
  readonly labels = input<FileInputLabels>({});

  readonly color = input<ButtonColor>('primary');
  readonly variant = input<ButtonVariant>('outline');
  readonly size = input<ButtonSize>('md');
  readonly icon = input<string>('Upload');
  readonly iconPosition = input<'left' | 'right'>('left');
  readonly iconOnly = input<boolean | 'mobile'>(false);
  readonly fullWidth = input<boolean>(false);
  readonly ariaLabel = input<string>();

  /** Selected files. Single-file callers can read `event[0]`. */
  readonly filesSelected = output<File[]>();
  readonly previewChanged = output<string | null>();
  readonly removeFile = output<void>();
  /** Fires when preview-mode validation rejects a file. */
  readonly validationError = output<string>();

  private readonly defaultLabels: FileInputLabels = {
    placeholderText: 'No image uploaded',
    buttonText: 'Choose File',
    helpText: 'Supported formats: PNG, JPEG, JPG, SVG',
    removeButtonAriaLabel: 'Remove image',
    errorMessageTooLarge: 'File is too large',
    errorMessageInvalidType: 'Invalid file type'
  };

  readonly placeholderText = computed(() => this.labels().placeholderText ?? this.defaultLabels.placeholderText!);
  readonly buttonText = computed(() => this.labels().buttonText ?? this.defaultLabels.buttonText!);
  readonly helpText = computed(() => this.labels().helpText ?? this.defaultLabels.helpText!);
  readonly removeButtonAriaLabel = computed(() => this.labels().removeButtonAriaLabel ?? this.defaultLabels.removeButtonAriaLabel!);
  readonly errorMessageTooLarge = computed(() => this.labels().errorMessageTooLarge ?? this.defaultLabels.errorMessageTooLarge!);
  readonly errorMessageInvalidType = computed(() => this.labels().errorMessageInvalidType ?? this.defaultLabels.errorMessageInvalidType!);

  private readonly internalPreview = signal<string | null>(null);
  readonly internalError = signal<string | null>(null);

  readonly displayPreview = computed(() => this.internalPreview() || this.preview());
  readonly displayError = computed(() => this.error() || this.internalError());

  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  onFileSelected(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const fileList = inputEl.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);

    if (this.mode() === 'preview') {
      this.internalError.set(null);
      const first = files[0];
      const validationResult = this.validateFile(first);
      if (validationResult !== null) {
        this.internalError.set(validationResult);
        this.validationError.emit(validationResult);
        inputEl.value = '';
        return;
      }
      this.generatePreview(first);
    }

    this.filesSelected.emit(files);
    inputEl.value = '';
  }

  onButtonClick(): void {
    if (this.disabled() || this.loading()) return;
    this.fileInput()?.nativeElement.click();
  }

  onPlaceholderClick(): void {
    if (this.disabled() || this.loading()) return;
    this.fileInput()?.nativeElement.click();
  }

  onRemoveClick(): void {
    this.internalError.set(null);
    this.internalPreview.set(null);
    this.previewChanged.emit(null);
    this.removeFile.emit();
  }

  private generatePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = e => {
      const preview = e.target?.result as string;
      this.internalPreview.set(preview);
      this.previewChanged.emit(preview);
    };
    reader.readAsDataURL(file);
  }

  private validateFile(file: File): string | null {
    const maxSize = this.maxFileSize();
    if (maxSize !== null && file.size > maxSize) {
      return this.errorMessageTooLarge();
    }

    const acceptedTypes = this.accept()
      .split(',')
      .map(type => type.trim())
      .filter(Boolean);

    if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
      return this.errorMessageInvalidType();
    }

    return null;
  }
}
