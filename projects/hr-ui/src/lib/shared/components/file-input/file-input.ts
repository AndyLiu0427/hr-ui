import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input, output, signal, viewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ButtonColor, ButtonComponent, ButtonSize, ButtonVariant } from '../button/button';
import { IconComponent } from '../icon/icon';
import { TextComponent } from '../text/text';

/** Each text left out comes from the i18n files, in the language of the app. */
export interface FileInputLabels {
  /** Text in the empty preview area. The default is "No image uploaded". */
  placeholderText?: string;
  /** Text of the button. The default is "Choose file". */
  buttonText?: string;
  /** Text under the button. The default is "Supported formats: PNG, JPEG, JPG, SVG". */
  helpText?: string;
  /** Name of the button that removes the preview. The default is "Remove image". */
  removeButtonAriaLabel?: string;
  /** Error for a file over maxFileSize. The default is "File is too large". */
  errorMessageTooLarge?: string;
  /** Error for a file that accept does not allow. The default is "Invalid file type". */
  errorMessageInvalidType?: string;
}

export type FileInputMode = 'preview' | 'button';

/**
 * A file picker with two modes. In preview mode (the default) it shows an image preview, a button
 * and help text, and it checks the file type and size. In button mode it is one button, labelled by
 * its content, with no preview and no checks. Both modes emit an array, and the same file can be picked again.
 */
@Component({
  selector: 'oct-file-input',
  templateUrl: './file-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, ButtonComponent, IconComponent, TextComponent]
})
export class FileInputComponent {
  private readonly translate = inject(TranslateService);

  /** preview shows an image preview and checks each file. button shows only a button. */
  readonly mode = input<FileInputMode>('preview');
  /**
   * Accepted file types, separated by commas, as in the native accept attribute: MIME types such as image/png,
   * wildcards such as image/*, and extensions such as .pdf. Preview mode rejects other files.
   */
  readonly accept = input<string>('');
  /** Lets the user pick several files. Preview mode checks and shows only the first. */
  readonly multiple = input<boolean>(false);
  /** Disables the picker. */
  readonly disabled = input<boolean>(false);
  /** Disables the picker. In button mode the button also shows a spinner. */
  readonly loading = input<boolean>(false);

  /** Image URL to show before the user picks a file, such as the current logo. */
  readonly preview = input<string | null>(null);
  /** Largest file, in bytes, that preview mode accepts. Set null to turn the check off. */
  readonly maxFileSize = input<number | null>(5 * 1024 * 1024);
  /** Name of the icon in the empty preview area. */
  readonly placeholderIcon = input<string>('Image');
  /** Error message under the button, such as an upload failure from your API. */
  readonly error = input<string | null>(null);
  /** Texts for the button, the help text, the empty preview area and the error messages. The defaults come from the i18n files. */
  readonly labels = input<FileInputLabels>({});

  /** Colour of the button in button mode. */
  readonly color = input<ButtonColor>('primary');
  /** Style of the button in button mode. */
  readonly variant = input<ButtonVariant>('outline');
  /** Size of the button in button mode. */
  readonly size = input<ButtonSize>('md');
  /** Name of the button icon in button mode. */
  readonly icon = input<string>('Upload');
  /** Side of the button that the icon is on, in button mode. */
  readonly iconPosition = input<'left' | 'right'>('left');
  /** Shows only the icon in button mode. 'mobile' hides the text on screens narrower than 768px. */
  readonly iconOnly = input<boolean | 'mobile'>(false);
  /** Makes the button fill the width of its container, in button mode. */
  readonly fullWidth = input<boolean>(false);
  /** Accessible name of the button in button mode. Set it when iconOnly is on. */
  readonly ariaLabel = input<string>();

  /** Selected files. Single-file callers can read `event[0]`. */
  readonly filesSelected = output<File[]>();
  /** Emits the preview as a data URL after the user picks an image, or null after they remove it. */
  readonly previewChanged = output<string | null>();
  /** Emits when the user removes the previewed file. */
  readonly removeFile = output<void>();
  /** Fires when preview-mode validation rejects a file. */
  readonly validationError = output<string>();

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
      return this.labels().errorMessageTooLarge ?? this.translate.instant('FILE_INPUT.TOO_LARGE');
    }

    const acceptedTypes = this.accept()
      .split(',')
      .map(type => type.trim().toLowerCase())
      .filter(Boolean);

    if (acceptedTypes.length > 0 && !acceptedTypes.some(type => matchesAcceptedType(file, type))) {
      return this.labels().errorMessageInvalidType ?? this.translate.instant('FILE_INPUT.INVALID_TYPE');
    }

    return null;
  }
}

/** One entry of an accept list, matched the way the browser's file picker matches it. */
function matchesAcceptedType(file: File, type: string): boolean {
  if (type.startsWith('.')) {
    return file.name.toLowerCase().endsWith(type);
  }
  if (type.endsWith('/*')) {
    return file.type.toLowerCase().startsWith(type.slice(0, -1));
  }
  return file.type.toLowerCase() === type;
}
