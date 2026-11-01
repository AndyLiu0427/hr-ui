import { Component, ChangeDetectionStrategy, input, output, computed, signal } from '@angular/core';
import { TextComponent } from '../text/text';
import { IconComponent } from '../icon/icon';
import { ButtonComponent } from '../button/button';
import { icons } from 'lucide-angular';
import { trigger, state, style, transition, animate } from '@angular/animations';

export type NoticeVariant = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'oct-notice',
  template: `
    @if (!isDismissed()) {
      <div [class]="combinedClasses()" [@noticeAnimation]="animationState()" role="alert" [attr.aria-live]="ariaLive()">
        <!-- Icon (if provided or default based on variant) -->
        @if (showIcon()) {
          <oct-icon [name]="iconName()" [class]="iconColorClass() + ' mt-[2px]'" />
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
              aria-label="Dismiss notice"
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
          transform: 'translateY(-8px)'
        })
      ),
      state(
        'visible',
        style({
          opacity: 1,
          transform: 'translateY(0)'
        })
      ),
      transition('void => visible', [animate('200ms ease-out')]),
      transition('visible => void', [animate('150ms ease-in')])
    ])
  ]
})
export class NoticeComponent {
  // Inputs
  readonly variant = input<NoticeVariant>('info');
  readonly class = input<string>('');
  readonly dismissible = input<boolean>(false);
  readonly icon = input<keyof typeof icons | null>(null);
  readonly showDefaultIcon = input<boolean>(true);
  readonly showAction = input<boolean>(false);
  readonly actionLabel = input<string>('View');
  /** Spinner on the action itself, for a notice whose action starts the write. */
  readonly actionLoading = input<boolean>(false);
  readonly actionDisabled = input<boolean>(false);

  // Outputs
  readonly dismiss = output<void>();
  readonly actionClick = output<void>();

  // Internal state
  readonly isDismissed = signal(false);
  readonly animationState = signal<'void' | 'visible'>('visible');

  // Computed properties for variant-based styling
  readonly noticeClasses = computed(() => {
    const variantClasses = {
      info: 'bg-blue-950 border border-blue-800 text-blue-600',
      success: 'bg-green-950 border border-green-800 text-green-600',
      warning: 'bg-orange-950 border border-orange-800 text-orange-600',
      error: 'bg-red-950 border border-red-800 text-error'
    };

    return variantClasses[this.variant()];
  });

  readonly iconColorClass = computed(() => {
    const colorClasses = {
      info: 'text-blue-500',
      success: 'text-green-500',
      warning: 'text-orange-500',
      error: 'text-red-500'
    };

    return colorClasses[this.variant()];
  });

  readonly dismissButtonClass = computed(() => {
    const buttonClasses = {
      info: 'text-blue-600 hover:text-blue-500 hover:bg-blue-900',
      success: 'text-green-600 hover:text-green-500 hover:bg-green-900',
      warning: 'text-orange-600 hover:text-orange-500 hover:bg-orange-900',
      error: 'text-red-600 hover:text-red-500 hover:bg-red-900'
    };

    return buttonClasses[this.variant()];
  });

  readonly combinedClasses = computed(() => {
    const baseClasses = 'flex items-start gap-2 p-4 rounded-xl transition-all duration-300';
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

  readonly showIcon = computed(() => {
    return this.iconName() !== null;
  });

  readonly ariaLive = computed(() => {
    const variant = this.variant();
    return variant === 'error' || variant === 'warning' ? 'assertive' : 'polite';
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
