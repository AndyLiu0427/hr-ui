import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type CardStatus = 'initial' | 'success' | 'error';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

const STATUS_CLASSES: Record<CardStatus, string> = {
  initial: 'border border-primary',
  success: 'ring-4 ring-green-500 border border-transparent',
  error: 'ring-4 ring-red-500 border border-transparent'
};

const PADDING_CLASSES: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-2 sm:p-3 md:p-4',
  md: 'p-3 sm:p-4 md:p-6',
  lg: 'p-4 sm:p-6 md:p-8'
};

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
  readonly customClass = input<string>('');
  readonly status = input<CardStatus>('initial');
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
      'shadow-sm',
      'transition-all',
      'duration-300',
      'h-full',
      'justify-center',
      STATUS_CLASSES[this.status()],
      PADDING_CLASSES[this.padding()]
    ];

    return classes.filter(Boolean).join(' ');
  });
}

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

@Component({
  selector: 'oct-card-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block'
  },
  template: `<ng-content />`
})
export class CardContentComponent {}

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
