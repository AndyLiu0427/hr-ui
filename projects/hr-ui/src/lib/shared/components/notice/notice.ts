import { Component, ChangeDetectionStrategy, input, output, computed, signal } from '@angular/core';
import { TextComponent } from '../text/text';
import { IconComponent } from '../icon/icon';
import { ButtonComponent } from '../button/button';
import { icons } from 'lucide-angular';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { prefersReducedMotion } from '../../../utils/reduced-motion';

export type NoticeVariant = 'info' | 'success' | 'warning' | 'error';

/** An inline message in the flow of the page. Its content is the text. */
@Component({
  selector: 'oct-notice',
  template: `
    @if (!isDismissed()) {
      <div [class]="combinedClasses()" [@noticeAnimation]="{ value: animationState(), params: { offset: enterOffset } }" [attr.role]="variant() === 'error' ? 'alert' : 'status'">
        <!-- Icon (if provided or default based on variant) -->
        @if (iconName(); as name) {
          <oct-icon [name]="name" [class]="iconColorClass() + ' mt-[2px]'" />
        }

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <oct-text variant="sm" color="inherit" class="break-words">
            <ng-content></ng-content>
          </oct-text>
        </div>

        <!-- Action button (if showAction) -->
        @if (showAction()) {
          <div class="flex-shrink-0">
            <oct-button
              variant="link"
              size="sm"
              [color]="variant()"
              [loading]="actionLoading()"
              [disabled]="actionDisabled() || actionLoading()"
              (buttonClick)="onActionClick()"
            >
              {{ actionLabel() }}
            </oct-button>
          </div>
        }

        <!-- Dismiss button (if dismissible) -->
        @if (dismissible()) {
          <div class="flex-shrink-0">
            <oct-button
              variant="ghost"
              size="sm"
              [icon]="'X'"
              [class]="dismissButtonClass()"
              (buttonClick)="onDismiss()"
              ariaLabel="Dismiss notice"
            />
          </div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TextComponent, IconComponent, ButtonComponent],
  animations: [
    trigger('noticeAnimation', [
      state(
        'void',
        style({
          opacity: 0,
          transform: '{{offset}}'
        }),
        { params: { offset: 'translateY(-8px)' } }
      ),
      state(
        'visible',
        style({
          opacity: 1,
          transform: 'translateY(0)'
        })
      ),
      transition('void => visible', [animate('200ms ease-out')]),
      // The --ease-smooth-out curve: an exit should start fast, not slow like ease-in.
      transition('visible => void', [animate('150ms cubic-bezier(0.22, 1, 0.36, 1)')])
    ])
  ]
})
export class NoticeComponent {
  // Inputs
  /** Sets the colour, the icon, and how urgently screen readers announce it. */
  readonly variant = input<NoticeVariant>('info');
  /** Extra classes for the notice box. */
  readonly class = input<string>('');
  /** Shows a close button that hides the notice and emits dismiss. */
  readonly dismissible = input<boolean>(false);
  /** A Lucide icon name that replaces the icon of the variant. */
  readonly icon = input<keyof typeof icons | null>(null);
  /** Shows the icon of the variant when icon is not set. */
  readonly showDefaultIcon = input<boolean>(true);
  /** Shows a link-style action button after the text. */
  readonly showAction = input<boolean>(false);
  /** The text of the action button. */
  readonly actionLabel = input<string>('View');
  /** Spinner on the action itself, for a notice whose action starts the write. */
  readonly actionLoading = input<boolean>(false);
  /** Disables the action button. */
  readonly actionDisabled = input<boolean>(false);

  // Outputs
  /** Emits after the notice has hidden itself. */
  readonly dismiss = output<void>();
  /** Emits when the action button is clicked. */
  readonly actionClick = output<void>();

  // Internal state
  readonly isDismissed = signal(false);
  readonly animationState = signal<'void' | 'visible'>('visible');
  /** Reduced motion: the notice fades in place instead of sliding. */
  protected readonly enterOffset = prefersReducedMotion() ? 'none' : 'translateY(-8px)';

  // Computed properties for variant-based styling
  readonly noticeClasses = computed(() => {
    const variantClasses = {
      info: 'bg-hr-blue-950 border border-hr-blue-800 text-hr-blue-200',
      success: 'bg-hr-green-950 border border-hr-green-800 text-hr-green-200',
      warning: 'bg-hr-orange-950 border border-hr-orange-800 text-hr-orange-200',
      error: 'bg-hr-red-950 border border-hr-red-800 text-hr-red-200'
    };

    return variantClasses[this.variant()];
  });

  readonly iconColorClass = computed(() => {
    const colorClasses = {
      info: 'text-hr-blue-300',
      success: 'text-hr-green-300',
      warning: 'text-hr-orange-300',
      error: 'text-hr-red-300'
    };

    return colorClasses[this.variant()];
  });

  readonly dismissButtonClass = computed(() => {
    const buttonClasses = {
      info: 'text-hr-blue-200 hover:text-hr-blue-100 hover:bg-hr-blue-900',
      success: 'text-hr-green-200 hover:text-hr-green-100 hover:bg-hr-green-900',
      warning: 'text-hr-orange-200 hover:text-hr-orange-100 hover:bg-hr-orange-900',
      error: 'text-hr-red-200 hover:text-hr-red-100 hover:bg-hr-red-900'
    };

    return buttonClasses[this.variant()];
  });

  readonly combinedClasses = computed(() => {
    const baseClasses = 'flex items-start gap-2 p-4 rounded-xl';
    const variantClass = this.noticeClasses();
    const customClass = this.class();

    return [baseClasses, variantClass, customClass].filter(Boolean).join(' ');
  });

  // Default icons for each variant
  readonly defaultIcons: Record<NoticeVariant, keyof typeof icons> = {
    info: 'Info',
    success: 'CircleCheck',
    warning: 'TriangleAlert',
    error: 'CircleAlert'
  };

  readonly iconName = computed(() => {
    const customIcon = this.icon();
    if (customIcon) return customIcon;

    if (this.showDefaultIcon()) {
      return this.defaultIcons[this.variant()];
    }

    return null;
  });


  onActionClick(): void {
    this.actionClick.emit();
  }

  onDismiss(): void {
    this.animationState.set('void');

    // Wait for animation to complete before emitting dismiss event
    setTimeout(() => {
      this.isDismissed.set(true);
      this.dismiss.emit();
    }, 150);
  }
}
