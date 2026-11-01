import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  output,
  signal,
  computed,
  effect,
  ElementRef,
  viewChild,
  viewChildren,
  afterRenderEffect,
  afterNextRender,
  untracked,
  inject,
  Injector
} from '@angular/core';

import { TextComponent } from '../text/text';

export interface TabItem {
  id: string;
  label: string;
  description?: string;
  /**
   * Present when selecting this tab NAVIGATES rather than swapping content in place.
   *
   * A tab with an href renders as a real anchor with `role="link"`, not a `role="tab"` button:
   * a screen reader announcing "tab, selected" for something that changes the page is wrong,
   * and a button silently drops middle-click, cmd-click, hover preview and copy-link-address.
   * The click handler still fires and still preventDefaults, so in-app navigation stays a
   * router call — the href exists for the affordances a button cannot offer.
   *
   * Same reasoning as the assignments row action in the job order detail page.
   */
  href?: string;
}

@Component({
  selector: 'oct-tabs',
  templateUrl: './tabs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextComponent],
  host: {
    class: 'block w-full'
  }
})
export class TabsComponent {
  readonly tabs = input.required<TabItem[]>();
  readonly activeTab = model<string>('');
  readonly tabChange = output<string>();

  /**
   * False makes the whole strip inert: no click, no keyboard, and anchors DROP their href.
   *
   * Dropping the href matters — `preventDefault` alone would leave middle-click and the context
   * menu navigating, which is exactly what a caller disabling the strip is trying to prevent
   * (e.g. an open edit dialog whose draft would be silently replaced by the sibling's values).
   */
  readonly interactive = input<boolean>(true);
  /** Names the tab strip for screen readers. Pass a translated, specific name where the page has more than one. */
  readonly ariaLabel = input<string>('Tabs');

  protected readonly indicatorPlaced = signal(false);
  private readonly focusedTabIndex = signal(0);
  private readonly tabElements = viewChildren<ElementRef<HTMLButtonElement>>('tabButton');
  private readonly indicator = viewChild<ElementRef<HTMLElement>>('indicator');
  private readonly injector = inject(Injector);

  readonly indicatorStyle = signal({
    left: '0px',
    width: '0px',
    top: '0px',
    height: '0px',
    isVertical: false
  });

  readonly activeTabIndex = computed(() => {
    const activeId = this.activeTab();
    const index = this.tabs().findIndex(tab => tab.id === activeId);
    return index >= 0 ? index : 0;
  });

  readonly activeTabDescription = computed(() => {
    const activeId = this.activeTab();
    const activeTabItem = this.tabs().find(tab => tab.id === activeId);
    return activeTabItem?.description || '';
  });

  constructor() {
    effect(() => {
      const tabsList = this.tabs();
      const currentActive = this.activeTab();

      if (tabsList.length > 0 && !currentActive) {
        this.activeTab.set(tabsList[0].id);
      }
    });

    afterRenderEffect(() => {
      this.tabs();
      this.activeTab();
      this.updateIndicatorPosition();
      if (untracked(this.indicatorPlaced) || untracked(this.indicatorStyle).width === '0px') {
        return;
      }
      afterNextRender(
        () => {
          void this.indicator()?.nativeElement.offsetWidth;
          this.indicatorPlaced.set(true);
        },
        { injector: this.injector }
      );
    });
  }

  private updateIndicatorPosition(): void {
    const activeIndex = this.activeTabIndex();
    const tabElements = this.tabElements();

    if (!tabElements || tabElements.length === 0 || activeIndex >= tabElements.length) {
      return;
    }

    const activeTabElement = tabElements[activeIndex]?.nativeElement;
    if (!activeTabElement) {
      return;
    }

    const tabRect = activeTabElement.getBoundingClientRect();
    const containerRect = activeTabElement.parentElement?.getBoundingClientRect();

    if (!containerRect) {
      return;
    }

    // Detect if tabs are wrapped (vertical layout) by checking if tabs have different top positions
    const firstTabRect = tabElements[0]?.nativeElement?.getBoundingClientRect();
    const secondTabRect = tabElements[1]?.nativeElement?.getBoundingClientRect();
    const isVertical = secondTabRect && firstTabRect && Math.abs(secondTabRect.top - firstTabRect.top) > 5;

    const left = tabRect.left - containerRect.left;
    const width = tabRect.width;
    const top = tabRect.top - containerRect.top;
    const height = tabRect.height;

    this.indicatorStyle.set({
      left: `${left}px`,
      width: `${width}px`,
      top: `${top}px`,
      height: `${height}px`,
      isVertical
    });
  }

  onTabClick(tabId: string, index: number, event?: Event): void {
    if (!this.interactive()) {
      event?.preventDefault();
      return;
    }
    // On an anchor tab the href is the fallback, not the mechanism: let the caller route.
    if (this.tabs()[index]?.href) {
      event?.preventDefault();
    }
    if (this.activeTab() === tabId) return;

    this.activeTab.set(tabId);
    this.focusedTabIndex.set(index);
    this.tabChange.emit(tabId);
  }

  onKeyDown(event: KeyboardEvent, currentIndex: number): void {
    if (!this.interactive()) return;
    const tabsList = this.tabs();
    const tabCount = tabsList.length;
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabCount - 1;
        break;

      case 'ArrowRight':
        event.preventDefault();
        newIndex = currentIndex < tabCount - 1 ? currentIndex + 1 : 0;
        break;

      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;

      case 'End':
        event.preventDefault();
        newIndex = tabCount - 1;
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.onTabClick(tabsList[currentIndex].id, currentIndex);
        return;

      default:
        return;
    }

    this.focusedTabIndex.set(newIndex);
    this.activeTab.set(tabsList[newIndex].id);
    this.tabChange.emit(tabsList[newIndex].id);

    const tabElements = this.tabElements();
    if (tabElements && tabElements[newIndex]) {
      tabElements[newIndex].nativeElement.focus();
    }
  }

  isActive(tabId: string): boolean {
    return this.activeTab() === tabId;
  }

  trackByTabId(_index: number, tab: TabItem): string {
    return tab.id;
  }
}
