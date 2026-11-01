import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  ViewContainerRef,
  TemplateRef,
  viewChild,
  viewChildren,
  effect,
  afterRenderEffect,
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

/** A button that opens a menu of checkboxes, to narrow a list to one or more values. On a phone the menu opens as a bottom sheet. */
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

  /** Text on the button, and the title of the menu. */
  label = input.required<string>();
  /** Icon shown before the label. */
  icon = input<string>();
  /** Size of the button. */
  size = input<'sm' | 'md' | 'lg'>('md');
  /** Width of the menu, as a CSS length or a number of px. undefined falls back to the default, so a config object can leave it out. */
  width = input<number | string, number | string | undefined>('280px', { transform: v => v ?? '280px' });
  /** Gap between the button and the menu, in px. */
  offsetY = input<number>(8);

  /** The values people can pick, each with a label. */
  options = input<FilterOption<T>[]>([]);
  /** Adds a search box that filters the options by label. */
  searchable = input<boolean>(false);
  /** Placeholder of the search box. The default is "Search…" from the i18n files. */
  searchPlaceholder = input<string>();

  /** The values of the selected options. Supports two-way binding. */
  selectedValues = model<unknown[]>([]);

  searchQuery = signal<string>('');

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  /** Emits the selected values after each change. */
  readonly filterChange = output<unknown[]>();
  /** Emits when the menu opens. */
  readonly menuOpened = output<void>();
  /** Emits when the menu closes. */
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
  private readonly trigger = viewChild.required('trigger', { read: ButtonComponent });
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  private readonly optionRows = viewChildren<ElementRef<HTMLElement>>('optionRow');
  /** Set when the desktop menu opens, until focus has moved into it. */
  private focusOnRender = false;

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

    // After render, because oct-button draws its <button> in its own first pass.
    afterRenderEffect(() => {
      const button = this.trigger().buttonRef().nativeElement;
      button.setAttribute('aria-expanded', String(this.isOpen()));
      button.setAttribute('aria-haspopup', this.isMobile() ? 'dialog' : 'menu');
    });

    // The menu sits at the end of <body>, where Tab from the button never arrives. The options
    // render a beat after the menu, once the virtual list has measured itself.
    afterRenderEffect(() => {
      const target = this.searchInput()?.nativeElement ?? this.optionRows().find(row => row.nativeElement.tabIndex === 0)?.nativeElement;
      if (this.focusOnRender && target) {
        this.focusOnRender = false;
        target.focus();
      }
    });
  }

  toggleMenu(): void {
    if (this.isOpen()) {
      this.closeMenu();
    } else {
      // On a phone the bottom sheet moves focus itself.
      this.focusOnRender = !this.isMobile();
      this.isOpen.set(true);
      this.menuOpened.emit();
    }
  }

  closeMenu(): void {
    if (!this.isOpen()) return;

    this.focusOnRender = false;
    this.closeOverlay();
    this.isOpen.set(false);
    this.searchQuery.set('');
    this.menuClosed.emit();
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

  /**
   * Up and Down move between the search box and the options. Tab past the first or last control
   * closes the menu, as Escape does: the menu sits at the end of <body>, so focus would leave the page.
   */
  handleMenuKeydown(event: KeyboardEvent): void {
    const menu = event.currentTarget as HTMLElement;
    const focused = document.activeElement as HTMLElement;
    if (event.key === 'Tab') {
      const stops = [...menu.querySelectorAll<HTMLElement>('button:not([disabled]), input[type="search"], [role="menuitemcheckbox"][tabindex="0"]')];
      if (focused === (event.shiftKey ? stops[0] : stops[stops.length - 1])) {
        event.preventDefault();
        this.closeMenu();
      }
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const stops = [...menu.querySelectorAll<HTMLElement>('input[type="search"], [role="menuitemcheckbox"][tabindex="0"]')];
      stops[stops.indexOf(focused) + (event.key === 'ArrowDown' ? 1 : -1)]?.focus();
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
          // Handled here, so a side panel around the filter stays open.
          event.preventDefault();
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
    if (!this.overlayRef) return;

    // Focus inside the menu would be lost with it. A click on another control keeps its focus.
    const active = document.activeElement;
    const focusWasInMenu = !active || active === document.body || this.overlayRef.overlayElement.contains(active);
    this.overlayRef.dispose();
    this.overlayRef = undefined;
    if (focusWasInMenu) {
      this.trigger().buttonRef().nativeElement.focus();
    }
  }
}
