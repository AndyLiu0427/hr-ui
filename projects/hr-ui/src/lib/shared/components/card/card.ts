import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type CardStatus = 'initial' | 'success' | 'error';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

const STATUS_CLASSES: Record<CardStatus, string> = {
  initial: 'border border-primary',
  success: 'ring-4 ring-success border border-transparent',
  error: 'ring-4 ring-error border border-transparent'
};

const PADDING_CLASSES: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-2 sm:p-3 md:p-4',
  md: 'p-3 sm:p-4 md:p-6',
  lg: 'p-4 sm:p-6 md:p-8'
};

/** A surface that groups related content. Fill it with oct-card-header, oct-card-content and oct-card-footer. */
@Component({
  selector: 'oct-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()'
  },
  template: `
    <div [class]="containerClasses()">
      <ng-content />
    </div>
  `
})
export class CardComponent {
  /** Classes added to the host element, such as a width or a margin. */
  readonly customClass = input<string>('');
  /** 'success' or 'error' draws a coloured ring around the card, for example after a check passes or fails. */
  readonly status = input<CardStatus>('initial');
  /** Inner padding. It grows with the screen width, and 'none' suits content that has its own padding. */
  readonly padding = input<CardPadding>('md');

  protected readonly hostClasses = computed(() => {
    return ['block', this.customClass()].filter(Boolean).join(' ');
  });

  protected readonly containerClasses = computed(() => {
    const classes = [
      'flex',
      'flex-col',
      'gap-6',
      'rounded-xl',
      'bg-secondary',
      'shadow-hr-sm',
      'h-full',
      'justify-center',
      STATUS_CLASSES[this.status()],
      PADDING_CLASSES[this.padding()]
    ];

    return classes.filter(Boolean).join(' ');
  });
}

/** The top of a card: stacks a title and a description. */
@Component({
  selector: 'oct-card-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  },
  template: `
    <div class="flex flex-col gap-1.5">
      <ng-content />
    </div>
  `
})
export class CardHeaderComponent {}

/** The main content of a card. */
@Component({
  selector: 'oct-card-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  },
  template: `<ng-content />`
})
export class CardContentComponent {}

/** The bottom row of a card: puts its first and last child at either end, such as a status and an action. */
@Component({
  selector: 'oct-card-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  },
  template: `
    <div class="flex items-center justify-between">
      <ng-content />
    </div>
  `
})
export class CardFooterComponent {}
