import {
  inject,
  ComponentRef,
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  signal,
  Signal,
  computed,
  DestroyRef,
  SecurityContext,
  OutputRefSubscription,
  Service
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { DialogComponent, DialogHeaderComponent, DialogContentComponent, DialogFooterComponent } from '../../shared/components/dialog/dialog';
import { ButtonComponent } from '../../shared/components/button/button';
import { TextComponent } from '../../shared/components/text/text';

/**
 * Button configuration for popup dialogs.
 * `action` may return `false` from Cancel-style buttons; the dialog still closes and the dialog promise resolves to that value.
 */
interface PopupButton {
  text: string;
  action: () => boolean | void;
  variant?: 'solid' | 'outline' | 'ghost';
  color?: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'neutral';
}

/**
 * Button layout options for footer
 * - center: Buttons centered (single button)
 * - between: Space between buttons (2+ buttons)
 * - start: Buttons aligned to start
 * - end: Buttons aligned to end
 * - around: Space around buttons
 * - evenly: Space evenly distributed
 * - split: First button pinned left, remaining buttons grouped right
 */
type ButtonLayout = 'center' | 'between' | 'start' | 'end' | 'around' | 'evenly' | 'split';

/**
 * Dialog component references for proper cleanup
 */
interface DialogRefs {
  main: ComponentRef<DialogComponent>;
  children: ComponentRef<DialogHeaderComponent | DialogContentComponent | DialogFooterComponent>[];
  buttonRefs: ComponentRef<ButtonComponent>[];
  subscription: OutputRefSubscription | null;
  buttonSubscriptions: OutputRefSubscription[];
  escapeHandler: ((event: KeyboardEvent) => void) | null;
}

/**
 * Footer component creation result with all references
 */
interface FooterComponentResult {
  footerRef: ComponentRef<DialogFooterComponent>;
  buttonRefs: ComponentRef<ButtonComponent>[];
  buttonSubscriptions: OutputRefSubscription[];
}

/**
 * Popup dialog types
 */
enum PopupType {
  SUCCESS = 'success',
  ERROR = 'error',
  DELETE = 'delete',
  WARNING = 'warning',
  INFO = 'info',
  PRIMARY = 'primary'
}

/**
 * PopupService - Modern Angular 20+ implementation using oct-dialog
 *
 * Clean implementation without legacy Material Dialog dependencies.
 *
 * Features:
 * - Signal-based state management with signal() and computed()
 * - Programmatic dialog creation using createComponent()
 * - Type-safe interfaces and enums
 * - Proper memory management and cleanup
 * - Modern Angular 20+ patterns throughout
 *
 * Usage:
 * ```typescript
 * // Show success message
 * await this.popupService.success('Operation completed!');
 *
 * // Show error with translation key
 * await this.popupService.error('ERROR_MESSAGE');
 *
 * // Show delete confirmation
 * const confirmed = await this.popupService.confirmDanger(
 *   'Delete User',
 *   'Are you sure you want to delete this user?',
 *   'Delete'
 * );
 * if (confirmed) {
 *   // Delete user
 * }
 * ```
 */
@Service()
export class PopupService {
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translateService = inject(TranslateService);

  private readonly currentDialogRef = signal<DialogRefs | null>(null);
  readonly isDialogOpen: Signal<boolean> = computed(() => this.currentDialogRef() !== null);

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.closeCurrentDialog();
    });
  }

  private createDialog(config: {
    title?: string;
    message: string;
    type?: PopupType;
    buttons?: PopupButton[];
    size?: 'sm' | 'md' | 'lg' | 'xl';
    buttonLayout?: ButtonLayout;
  }): Promise<boolean | void> {
    return new Promise(resolve => {
      this.closeCurrentDialog();

      const childRefs: ComponentRef<DialogHeaderComponent | DialogContentComponent | DialogFooterComponent>[] = [];
      const buttonRefs: ComponentRef<ButtonComponent>[] = [];
      const buttonSubscriptions: OutputRefSubscription[] = [];
      let closeSubscription: OutputRefSubscription | null = null;
      let escapeHandler: ((event: KeyboardEvent) => void) | null = null;

      try {
        const dialogRef = this.createDialogComponent();
        const dialogInstance = dialogRef.instance;

        dialogRef.setInput('size', config.size || 'md');

        document.body.appendChild(dialogRef.location.nativeElement);
        this.appRef.attachView(dialogRef.hostView);

        dialogRef.setInput('isOpen', true);
        dialogRef.changeDetectorRef.detectChanges();

        requestAnimationFrame(() => {
          const dialogContainer = dialogRef.location.nativeElement.querySelector('.dialog-container');

          if (!dialogContainer) {
            console.error('Dialog container not found');
            resolve(false);
            this.closeCurrentDialog();
            return;
          }

          const contentWrapper = dialogContainer.querySelector('.flex.flex-col.flex-1.min-h-0');
          const targetContainer = contentWrapper || dialogContainer;

          if (config.title) {
            const headerRef = this.createHeaderComponent(config.title);
            childRefs.push(headerRef);
            targetContainer.prepend(headerRef.location.nativeElement);
          }

          const contentRef = this.createContentComponent(config.message);
          childRefs.push(contentRef);
          targetContainer.appendChild(contentRef.location.nativeElement);

          if (config.buttons && config.buttons.length > 0) {
            const footerResult = this.createFooterComponent(
              config.buttons,
              result => {
                resolve(result);
                this.closeCurrentDialog();
              },
              config.buttonLayout
            );
            childRefs.push(footerResult.footerRef);
            buttonRefs.push(...footerResult.buttonRefs);
            buttonSubscriptions.push(...footerResult.buttonSubscriptions);
            targetContainer.appendChild(footerResult.footerRef.location.nativeElement);
          }

          closeSubscription = dialogInstance.dialogClose.subscribe(() => {
            resolve(false);
            this.closeCurrentDialog();
          });

          // Add ESC key handler for programmatically created dialogs
          // Use capture phase to ensure handler runs before Angular's host binding
          escapeHandler = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              event.stopPropagation();
              resolve(false);
              this.closeCurrentDialog();
            }
          };
          document.addEventListener('keydown', escapeHandler, true);

          this.currentDialogRef.set({
            main: dialogRef,
            children: childRefs,
            buttonRefs,
            subscription: closeSubscription,
            buttonSubscriptions,
            escapeHandler
          });
        });
      } catch (error) {
        console.error('Failed to create dialog:', error);
        resolve(false);
      }
    });
  }

  private createDialogComponent(): ComponentRef<DialogComponent> {
    return createComponent(DialogComponent, {
      environmentInjector: this.environmentInjector
    });
  }

  private sanitizeHtml(html: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, html) || '';
  }

  private createHeaderComponent(title: string): ComponentRef<DialogHeaderComponent> {
    const headerRef = createComponent(DialogHeaderComponent, {
      environmentInjector: this.environmentInjector
    });

    this.appRef.attachView(headerRef.hostView);

    const textContainer = headerRef.location.nativeElement.querySelector('.text-1.font-semibold');

    if (textContainer) {
      const titleTextRef = createComponent(TextComponent, {
        environmentInjector: this.environmentInjector
      });

      titleTextRef.setInput('color', '1');
      titleTextRef.setInput('variant', 'lg');
      titleTextRef.setInput('weight', 'semibold');

      this.appRef.attachView(titleTextRef.hostView);

      const titleElement = titleTextRef.location.nativeElement;
      titleElement.textContent = title;

      titleTextRef.changeDetectorRef.detectChanges();

      textContainer.textContent = '';
      textContainer.appendChild(titleElement);
    }

    return headerRef;
  }

  /**
   * The message goes in as PROJECTED CONTENT, not by finding a container with querySelector.
   *
   * The previous version looked up `.flex-1.overflow-y-auto` inside the host. That class comes
   * from oct-dialog-content's `[class]` binding, so it does not exist until the first change
   * detection — the query returned null, the `if` around the whole message block was skipped,
   * and every popup rendered its title and buttons with an empty body. Projection has no such
   * ordering dependency and no silent-miss branch.
   */
  private createContentComponent(message: string): ComponentRef<DialogContentComponent> {
    const textRef = createComponent(TextComponent, {
      environmentInjector: this.environmentInjector
    });

    textRef.setInput('color', '3');
    textRef.setInput('variant', 'sm');

    const textElement = textRef.location.nativeElement;
    if (message.includes('<') && message.includes('>')) {
      textElement.innerHTML = this.sanitizeHtml(message);
    } else {
      textElement.textContent = message;
    }

    this.appRef.attachView(textRef.hostView);
    textRef.changeDetectorRef.detectChanges();

    const contentRef = createComponent(DialogContentComponent, {
      environmentInjector: this.environmentInjector,
      projectableNodes: [[textElement]]
    });

    this.appRef.attachView(contentRef.hostView);
    contentRef.changeDetectorRef.detectChanges();

    return contentRef;
  }

  private createFooterComponent(buttons: PopupButton[], onAction: (result: boolean | void) => void, layout?: ButtonLayout): FooterComponentResult {
    const footerRef = createComponent(DialogFooterComponent, {
      environmentInjector: this.environmentInjector
    });

    const buttonRefs: ComponentRef<ButtonComponent>[] = [];
    const buttonSubscriptions: OutputRefSubscription[] = [];

    let justifyClass: string;
    if (layout) {
      const layoutMap: Record<ButtonLayout, string> = {
        center: 'justify-center',
        between: 'justify-between',
        start: 'justify-start',
        end: 'justify-end',
        around: 'justify-around',
        evenly: 'justify-evenly',
        split: 'justify-end'
      };
      justifyClass = layoutMap[layout];
    } else {
      justifyClass = 'justify-end';
    }

    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = `flex items-center ${justifyClass} gap-2 w-full`;

    buttons.forEach((btn, index) => {
      const buttonRef = createComponent(ButtonComponent, {
        environmentInjector: this.environmentInjector,
        projectableNodes: [[document.createTextNode(btn.text)]]
      });

      buttonRef.setInput('variant', btn.variant || 'solid');
      buttonRef.setInput('color', btn.color || 'neutral');
      buttonRef.setInput('size', 'md');
      buttonRef.setInput('shape', 'square');

      this.appRef.attachView(buttonRef.hostView);
      buttonRef.changeDetectorRef.detectChanges();

      const clickSubscription = buttonRef.instance.buttonClick.subscribe(() => {
        const result = btn.action();
        onAction(result);
      });
      buttonSubscriptions.push(clickSubscription);
      buttonRefs.push(buttonRef);

      // split layout: push the first button to the left, group the rest on the right
      if (layout === 'split' && index === 0) {
        buttonRef.location.nativeElement.classList.add('mr-auto');
      }

      buttonWrapper.appendChild(buttonRef.location.nativeElement);
    });

    while (footerRef.location.nativeElement.firstChild) {
      footerRef.location.nativeElement.firstChild.remove();
    }
    const footerContainer = document.createElement('div');
    footerContainer.className = 'px-4 pb-4 sm:px-6 sm:pb-6';
    footerContainer.appendChild(buttonWrapper);
    footerRef.location.nativeElement.appendChild(footerContainer);

    this.appRef.attachView(footerRef.hostView);

    return {
      footerRef,
      buttonRefs,
      buttonSubscriptions
    };
  }

  private closeCurrentDialog(): void {
    const dialogRef = this.currentDialogRef();

    if (dialogRef) {
      if (dialogRef.escapeHandler) {
        document.removeEventListener('keydown', dialogRef.escapeHandler, true);
      }

      dialogRef.buttonSubscriptions.forEach(sub => {
        sub?.unsubscribe();
      });

      dialogRef.subscription?.unsubscribe();

      dialogRef.buttonRefs.forEach(buttonRef => {
        this.appRef.detachView(buttonRef.hostView);
        buttonRef.destroy();
      });

      dialogRef.children.forEach(childRef => {
        this.appRef.detachView(childRef.hostView);
        childRef.destroy();
      });

      this.appRef.detachView(dialogRef.main.hostView);
      dialogRef.main.destroy();

      this.currentDialogRef.set(null);
    }
  }

  close(): void {
    this.closeCurrentDialog();
  }

  async success(message: string, okText?: string, onOkClick?: () => void): Promise<void> {
    const title = this.translateService.instant('MULTIUSED_POPUP.SUCCESS');
    const translatedOkText = okText ?? this.translateService.instant('MULTIUSED_POPUP.OK');

    await this.createDialog({
      title,
      message,
      type: PopupType.SUCCESS,
      buttons: [
        {
          text: translatedOkText,
          action: onOkClick ?? (() => true),
          variant: 'solid',
          color: 'success'
        }
      ]
    });
  }

  async error(message: string, okText?: string, onOkClick?: () => void): Promise<void> {
    const title = this.translateService.instant('MULTIUSED_POPUP.ERROR');
    const translatedOkText = okText ?? this.translateService.instant('MULTIUSED_POPUP.OK');

    await this.createDialog({
      title,
      message,
      type: PopupType.ERROR,
      buttons: [
        {
          text: translatedOkText,
          action: onOkClick ?? (() => true),
          variant: 'solid',
          color: 'error'
        }
      ]
    });
  }

  async warning(message: string, okText?: string, onOkClick?: () => void): Promise<void> {
    const title = this.translateService.instant('MULTIUSED_POPUP.WARNING');
    const translatedOkText = okText ?? this.translateService.instant('MULTIUSED_POPUP.OK');

    await this.createDialog({
      title,
      message,
      type: PopupType.WARNING,
      buttons: [
        {
          text: translatedOkText,
          action: onOkClick ?? (() => true),
          variant: 'solid',
          color: 'warning'
        }
      ]
    });
  }

  async info(message: string): Promise<void> {
    const title = this.translateService.instant('MULTIUSED_POPUP.INFO');
    const okText = this.translateService.instant('MULTIUSED_POPUP.OK');

    await this.createDialog({
      title,
      message,
      type: PopupType.INFO,
      buttons: [
        {
          text: okText,
          action: () => true,
          variant: 'solid',
          color: 'info'
        }
      ]
    });
  }

  async confirmDanger(title: string, message: string, confirmText?: string, cancelText?: string): Promise<boolean> {
    const translatedTitle = this.translateService.instant(title);
    const translatedMessage = this.translateService.instant(message);
    const translatedConfirmText = confirmText ? this.translateService.instant(confirmText) : this.translateService.instant('MULTIUSED_POPUP.CONFIRM');
    const translatedCancelText = cancelText ? this.translateService.instant(cancelText) : this.translateService.instant('MULTIUSED_POPUP.CANCEL');

    const result = await this.createDialog({
      title: translatedTitle,
      message: translatedMessage,
      type: PopupType.DELETE,
      buttons: [
        {
          text: translatedCancelText,
          action: () => false,
          variant: 'ghost',
          color: 'neutral'
        },
        {
          text: translatedConfirmText,
          action: () => true,
          variant: 'solid',
          color: 'error'
        }
      ]
    });

    return result === true;
  }

  async confirm(title: string, message: string, confirmText?: string, cancelText?: string): Promise<boolean> {
    const translatedTitle = this.translateService.instant(title);
    const translatedMessage = this.translateService.instant(message);
    const translatedConfirmText = confirmText ? this.translateService.instant(confirmText) : this.translateService.instant('MULTIUSED_POPUP.CONFIRM');
    const translatedCancelText = cancelText ? this.translateService.instant(cancelText) : this.translateService.instant('MULTIUSED_POPUP.CANCEL');

    const result = await this.createDialog({
      title: translatedTitle,
      message: translatedMessage,
      type: PopupType.PRIMARY,
      buttons: [
        {
          text: translatedCancelText,
          action: () => false,
          variant: 'ghost',
          color: 'neutral'
        },
        {
          text: translatedConfirmText,
          action: () => true,
          variant: 'solid',
          color: 'primary'
        }
      ]
    });

    return result === true;
  }

  async errorWithRetry(message: string): Promise<boolean> {
    const title = this.translateService.instant('MULTIUSED_POPUP.ERROR');
    const retryText = this.translateService.instant('GENERAL.RETRY');
    const cancelText = this.translateService.instant('MULTIUSED_POPUP.CANCEL');

    const result = await this.createDialog({
      title,
      message,
      type: PopupType.WARNING,
      buttons: [
        {
          text: cancelText,
          action: () => false,
          variant: 'ghost',
          color: 'neutral'
        },
        {
          text: retryText,
          action: () => true,
          variant: 'solid',
          color: 'warning'
        }
      ]
    });

    return result === true;
  }

  async custom(config: {
    title?: string;
    message: string;
    type?: PopupType;
    buttons?: PopupButton[];
    size?: 'sm' | 'md' | 'lg' | 'xl';
    buttonLayout?: ButtonLayout;
  }): Promise<boolean | void> {
    return await this.createDialog(config);
  }

  /** @deprecated Use confirm() instead */
  async setPopCounting(initialSeconds: number, countdownSeconds: number): Promise<boolean | null> {
    const title = this.translateService.instant('MULTIUSED_POPUP.SESSION_TIMEOUT');
    const message = this.translateService.instant('MULTIUSED_POPUP.SESSION_TIMEOUT_MESSAGE').replace('{countdown}', countdownSeconds.toString());

    const result = await this.createDialog({
      title,
      message,
      type: PopupType.WARNING,
      buttons: [
        {
          text: this.translateService.instant('MULTIUSED_POPUP.CANCEL'),
          action: () => false,
          variant: 'ghost',
          color: 'neutral'
        },
        {
          text: this.translateService.instant('MULTIUSED_POPUP.CONTINUE'),
          action: () => true,
          variant: 'solid',
          color: 'primary'
        }
      ]
    });

    if (result === true) return true;
    if (result === false) return false;
    return null;
  }

  /** @deprecated Use custom() instead */
  async setPopUp(param: {
    header?: string;
    body?: string;
    okText?: string;
    cancelText?: string;
    showOk?: boolean;
    showCancel?: boolean;
    isCloseShow?: boolean;
    width?: string;
    disableClose?: boolean;
    okClass?: string;
  }): Promise<boolean> {
    const buttons: PopupButton[] = [];

    if (param.showCancel !== false) {
      buttons.push({
        text: param.cancelText || 'Cancel',
        action: () => false,
        variant: 'ghost',
        color: 'neutral'
      });
    }

    if (param.showOk !== false) {
      buttons.push({
        text: param.okText || 'OK',
        action: () => true,
        variant: 'solid',
        color: 'primary'
      });
    }

    const result = await this.createDialog({
      title: param.header ? this.stripHtmlTags(param.header) : undefined,
      message: param.body ? this.stripHtmlTags(param.body) : '',
      buttons
    });

    return result === true;
  }

  /** @deprecated Use error() instead */
  async errorData(message: string): Promise<boolean> {
    await this.error(message);
    return false;
  }

  /** @deprecated Use errorWithRetry() instead */
  async errorDataWithRetry(message: string): Promise<boolean> {
    return await this.errorWithRetry(message);
  }

  /** @deprecated Use success() instead */
  async successData(message: string): Promise<void> {
    await this.success(message);
  }

  /** @deprecated Use confirmDanger() instead */
  async deleteData(): Promise<boolean> {
    const title = this.translateService.instant('MULTIUSED_POPUP.DELETE');
    const message = this.translateService.instant('MULTIUSED_POPUP.CONFIRMDELETEDATA');
    const confirmText = this.translateService.instant('MULTIUSED_POPUP.DELETE');
    return await this.confirmDanger(title, message, confirmText);
  }

  /** @deprecated Use confirmDanger() instead */
  async confirmDelete(_itemName: string, customTitle?: string): Promise<boolean> {
    const title = customTitle ? this.translateService.instant(customTitle) : this.translateService.instant('MULTIUSED_POPUP.DELETE');
    const message = this.translateService.instant('MULTIUSED_POPUP.CONFIRMDELETEDATA');
    const confirmText = this.translateService.instant('MULTIUSED_POPUP.DELETE');
    return await this.confirmDanger(title, message, confirmText);
  }

  private stripHtmlTags(html: string): string {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
}
