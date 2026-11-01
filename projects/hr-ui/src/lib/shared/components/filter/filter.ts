import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  ViewContainerRef,
  TemplateRef,
  viewChild,
  effect,
  inject,
  ElementRef,
  signal,
  computed,
  model,
  DestroyRef
} from '@angular/core';

import { Overlay, OverlayRef, OverlayModule, ConnectedPosition } from '@angular/cdk/overlay';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TemplatePortal } from '@angular/cdk/portal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../button/button';
import { IconComponent } from '../icon/icon';
import { BadgeComponent } from '../badge/badge';
import { TextComponent } from '../text/text';
import { CheckboxComponent } from '../checkbox/checkbox';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet';

export interface FilterOption<T> {
  label: string;
  value: T;
  disabled?: boolean;
}

export function enumToFilterOptions<T>(enumObj: Record<string, T>): FilterOption<T>[] {
  return Object.entries(enumObj)
    .filter(([key]) => Number.isNaN(Number(key)))
    .map(([, value]) => ({
      value,
      label: String(value)
    }));
}

@Component({
  selector: 'oct-filter',
  templateUrl: './filter.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    OverlayModule,
    ScrollingModule,
    TranslateModule,
    ButtonComponent,
    IconComponent,
    BadgeComponent,
    TextComponent,
    CheckboxComponent,
    BottomSheetComponent
  ],
  host: {
    class: 'inline-block'
  }
})
export class FilterComponent<T> {
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly elementRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private overlayRef?: OverlayRef;

  readonly isMobile = signal<boolean>(false);

  label = input.required<string>();
  icon = input<string>();
  size = input<'sm' | 'md' | 'lg'>('md');
  // undefined falls back to the default, so a config object can leave these out.
  width = input<number | string, number | string | undefined>('280px', { transform: v => v ?? '280px' });
  offsetY = input<number>(8);

  options = input<FilterOption<T>[]>([]);
  searchable = input<boolean>(false);
  searchPlaceholder = input<string, string | undefined>('Search...', { transform: v => v ?? 'Search...' });

  selectedValues = model<unknown[]>([]);

  searchQuery = signal<string>('');

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  readonly filterChange = output<unknown[]>();
  readonly menuOpened = output<void>();
  readonly menuClosed = output<void>();

  isOpen = signal<boolean>(false);
  readonly selections = signal<Set<unknown>>(new Set());
  selectionCount = computed(() => this.selections().size);
  hasSelections = computed(() => this.selections().size > 0);

  filteredOptions = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const allOptions = this.options();

    if (!query || !this.searchable()) {
      return allOptions;
    }

    return allOptions.filter(option => option.label.toLowerCase().includes(query));
  });

  viewportHeight = computed(() => {
    const itemCount = this.filteredOptions().length;
    const itemHeight = 40;
    const maxHeight = 320;
    const minHeight = 80;

    const calculatedHeight = itemCount * itemHeight;

    return Math.min(Math.max(calculatedHeight, minHeight), maxHeight);
  });

  desktopMenuTemplate = viewChild<TemplateRef<unknown>>('desktopMenuTemplate');

  constructor() {
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => this.isMobile.set(result.matches));

    effect(() => {
      const values = this.selectedValues();
      this.selections.set(new Set(values));
    });

    effect(() => {
      const open = this.isOpen();
      const template = this.desktopMenuTemplate();

      if (open && template && !this.isMobile()) {
        this.openDesktopOverlay(template);
      }
    });

    effect(() => {
      if (this.isOpen()) {
        this.menuOpened.emit();
      } else {
        this.menuClosed.emit();
      }
    });
  }

  toggleMenu(): void {
    if (this.isOpen()) {
      this.closeMenu();
    } else {
      this.isOpen.set(true);
    }
  }

  closeMenu(): void {
    if (!this.isOpen()) return;

    this.closeOverlay();
    this.isOpen.set(false);
    this.searchQuery.set('');
  }

  toggleOption(value: unknown): void {
    this.selections.update(selections => {
      const newSelections = new Set(selections);
      if (newSelections.has(value)) {
        newSelections.delete(value);
      } else {
        newSelections.add(value);
      }
      return newSelections;
    });

    const arrayValue = Array.from(this.selections());
    this.selectedValues.set(arrayValue);
    this.filterChange.emit(arrayValue);
  }

  clearSelections(): void {
    this.selections.set(new Set());
    this.selectedValues.set([]);
    this.filterChange.emit([]);
    this.searchQuery.set('');
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleMenu();
    } else if (event.key === 'Escape' && this.isOpen()) {
      // Handled here, so a side panel around the filter stays open.
      event.preventDefault();
      this.closeMenu();
    }
  }

  handleOptionKeydown(event: KeyboardEvent, value: unknown): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleOption(value);
    }
  }

  trackByValue(index: number, option: FilterOption<T>): unknown {
    return option.value;
  }

  private openDesktopOverlay(template: TemplateRef<unknown>): void {
    if (this.overlayRef) {
      return;
    }

    const positions: ConnectedPosition[] = [
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetY: this.offsetY()
      },
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetY: -this.offsetY()
      },
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
        offsetY: this.offsetY()
      }
    ];

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions(positions)
      .withPush(false)
      .withViewportMargin(8)
      .withFlexibleDimensions(true)
      .withTransformOriginOn('.oct-overlay-enter');

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: false,
      panelClass: 'oct-overlay-pane',
      disposeOnNavigation: true,
      width: this.width(),
      maxHeight: '400px'
    });

    const portal = new TemplatePortal(template, this.viewContainerRef);
    this.overlayRef.attach(portal);

    this.overlayRef
      .keydownEvents()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        if (event.key === 'Escape') {
          this.closeMenu();
        }
      });

    this.overlayRef
      .outsidePointerEvents()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        const target = event.target as Element;
        const triggerElement = this.elementRef.nativeElement;
        if (!triggerElement.contains(target)) {
          this.closeMenu();
        }
      });
  }

  private closeOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }
}
