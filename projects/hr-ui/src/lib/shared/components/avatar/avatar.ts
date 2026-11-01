import { Component, ChangeDetectionStrategy, computed, signal, input, effect } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent } from '../icon/icon';

/** icon is the px size of the person icon shown when there is neither a photo nor a name. */
const AVATAR_SIZE_CLASSES = {
  xs: {
    container: 'size-4',
    text: 'text-[8px]',
    icon: 10,
    status: 'size-1.5',
    statusOffset: '-top-px -right-px'
  },
  sm: {
    container: 'size-6',
    text: 'text-xs',
    icon: 14,
    status: 'size-2',
    statusOffset: '-top-0.5 -right-0.5'
  },
  md: {
    container: 'size-8',
    text: 'text-sm',
    icon: 18,
    status: 'size-2.5',
    statusOffset: '-top-0.5 -right-0.5'
  },
  lg: {
    container: 'size-10',
    text: 'text-base',
    icon: 22,
    status: 'size-3',
    statusOffset: '-top-0.5 -right-0.5'
  },
  xl: {
    container: 'size-12',
    text: 'text-lg',
    icon: 26,
    status: 'size-3.5',
    statusOffset: '-top-1 -right-1'
  },
  '2xl': {
    container: 'size-16',
    text: 'text-hr-xl',
    icon: 34,
    status: 'size-4',
    statusOffset: '-top-1 -right-1'
  }
} as const;

export type AvatarSize = keyof typeof AVATAR_SIZE_CLASSES;
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away' | 'none';

/** i18n key of the accessible name with each status. */
const STATUS_KEYS: Record<AvatarStatus, string | null> = {
  online: 'AVATAR.ONLINE',
  offline: 'AVATAR.OFFLINE',
  busy: 'AVATAR.BUSY',
  away: 'AVATAR.AWAY',
  none: null
};

/** A person's photo, or their initials when there is no photo, with an optional status dot. */
@Component({
  selector: 'oct-avatar',
  templateUrl: './avatar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, TranslateModule, IconComponent],
  host: {
    class: 'inline-flex leading-none',
    '[attr.data-size]': 'size()',
    '[attr.data-status]': 'status()'
  }
})
export class AvatarComponent {
  /** Size, from xs (16px) to 2xl (64px). */
  readonly size = input<AvatarSize>('md');
  /** URL of the photo. If it fails to load, the avatar shows the initials of name. */
  readonly src = input<string>('');
  /** Accessible name of the avatar. Falls back to name. */
  readonly alt = input<string>('');
  /** The person's name. Gives the initials, and the accessible name when alt is empty. */
  readonly name = input<string>('');
  /** Shows a status dot on the corner. 'none' hides it. */
  readonly status = input<AvatarStatus>('none');
  /** Shows the name under the avatar while the pointer rests on it. */
  readonly showTooltip = input<boolean>(false);
  /** Draws the avatar as a native button, with a pointer cursor and a hover ring. Listen to (click) on oct-avatar: Enter and Space click it too. */
  readonly clickable = input<boolean>(false);

  protected readonly imageLoaded = signal(false);
  protected readonly imageError = signal(false);

  constructor() {
    effect(() => {
      const src = this.src();
      if (src) {
        this.preloadImage(src);
      } else {
        this.imageLoaded.set(false);
        this.imageError.set(false);
      }
    });
  }

  protected readonly initials = computed(() => {
    const name = this.name();
    if (!name) return '';

    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  });

  protected readonly displayContent = computed<'image' | 'initials' | 'fallback'>(() => {
    if (this.src() && !this.imageError()) {
      return 'image';
    }
    if (this.name()) {
      return 'initials';
    }
    return 'fallback';
  });

  protected readonly sizeClasses = computed(() => {
    return AVATAR_SIZE_CLASSES[this.size()] ?? AVATAR_SIZE_CLASSES.md;
  });

  protected readonly containerClasses = computed(() => {
    const classes = [
      'inline-flex',
      'items-center',
      'justify-center',
      'overflow-hidden',
      'rounded-full',
      'select-none',
      this.sizeClasses().container
    ];

    const content = this.displayContent();
    if (content === 'image') {
      classes.push('bg-hr-neutral-200');
    } else if (content === 'fallback') {
      classes.push('bg-hr-neutral-800', 'text-2');
    } else {
      classes.push('bg-info-solid', 'text-white', 'font-semibold');
    }

    if (this.clickable()) {
      classes.push('cursor-pointer', 'hover:ring-2', 'hover:ring-hr-blue-300', 'hover:ring-offset-1', 'oct-focus-ring');
    }

    return classes.join(' ');
  });

  protected readonly textClasses = computed(() => this.sizeClasses().text);

  protected readonly statusWrapperClasses = computed(() => {
    const status = this.status();
    if (status === 'none') return '';

    const sizeConfig = this.sizeClasses();
    return `absolute ${sizeConfig.statusOffset} z-10`;
  });

  protected readonly statusClasses = computed(() => {
    const status = this.status();
    if (status === 'none') return '';

    const sizeConfig = this.sizeClasses();
    const classes = ['rounded-full', sizeConfig.status];

    if (status === 'online') {
      classes.push('relative', 'flex');
    } else {
      const colorMap: Record<string, string> = {
        offline: 'bg-hr-neutral-400',
        busy: 'bg-rose-500',
        away: 'bg-amber-500'
      };
      // block, or the span stays inline and its size class draws nothing.
      classes.push('block', colorMap[status] ?? 'bg-hr-neutral-400');
    }

    return classes.join(' ');
  });

  protected readonly statusInnerClasses = computed(() => {
    if (this.status() !== 'online') return '';

    const sizeConfig = this.sizeClasses();
    return `relative inline-flex rounded-full bg-emerald-500 ${sizeConfig.status}`;
  });

  protected readonly statusKeys = STATUS_KEYS;

  protected readonly tooltipText = computed(() => {
    if (!this.showTooltip()) return '';
    return this.name() || this.alt() || '';
  });

  private preloadImage(src: string): void {
    if (!src) return;

    this.imageLoaded.set(false);
    this.imageError.set(false);

    const img = new Image();
    img.onload = () => {
      if (this.src() === src) {
        this.imageLoaded.set(true);
        this.imageError.set(false);
      }
    };
    img.onerror = () => {
      if (this.src() === src) {
        this.imageError.set(true);
        this.imageLoaded.set(false);
      }
    };
    img.src = src;
  }

  protected onImageError(): void {
    this.imageError.set(true);
  }

  protected onImageLoad(): void {
    this.imageLoaded.set(true);
  }
}
