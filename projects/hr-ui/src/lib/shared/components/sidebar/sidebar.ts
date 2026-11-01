import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  Signal,
  afterNextRender,
  computed,
  inject,
  input,
  linkedSignal,
  model,
  output,
  signal,
  untracked,
  viewChild
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { IsActiveMatchOptions, Router, RouterLink, RouterLinkActive, isActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IconComponent } from '../icon/icon';
import { BadgeComponent } from '../badge/badge';
import { TextComponent } from '../text/text';

export type SidebarConfig = {
  sections: SidebarSection[];
  useTranslation?: boolean;
};

export type SidebarSection = {
  id: string;
  label: string;
  /** The Pinned block: each row shows its group name and an unpin button. */
  kind?: 'pinned';
  items: SidebarItem[];
};

/** A row inside a hover flyout (icon + label that navigates to a leaf route). */
export type SidebarFlyoutItem = {
  label: string;
  route: string;
  icon: string;
  pinnable?: boolean;
  pinned?: boolean;
};

export type SidebarItem = {
  label: string;
  route: string;
  icon: string;
  isShow?: boolean;
  badge?: string;
  pinnable?: boolean;
  pinned?: boolean;
  /** Small grey text after a pinned page's label: the group it belongs to. */
  context?: string;
  /** When present, the item does NOT navigate; it opens a panel of these pages to the right. */
  flyoutItems?: SidebarFlyoutItem[];
  children?: SidebarItem[];
  preview?: {
    title: string;
    description: string;
    content?: string;
  };
};

/** A panel to the right of the sidebar: the pages of a group or flyout item, or a rail item's label. */
type Flyout = {
  kind: 'pages' | 'tip';
  item: SidebarItem;
  top: number;
  left: number;
};

type FlyoutPage = SidebarFlyoutItem & { context?: string };

/** Segment-aware, like routerLinkActive: /payroll/billing is not active on /payroll/billing-rates. */
const PAGE_MATCH: IsActiveMatchOptions = { paths: 'subset', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' };
/** Rest before the first rail panel opens, so a pointer passing over the rail opens nothing. */
const RAIL_HOVER_INTENT_MS = 100;
/** Long enough for the pointer to cross the gap from the sidebar into an open panel. */
const FLYOUT_CLOSE_GRACE_MS = 140;
const FLYOUT_GAP_PX = 8;

@Component({
  selector: 'oct-unified-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, RouterLink, RouterLinkActive, IconComponent, BadgeComponent, TextComponent, TranslateModule],
  host: { '(document:keydown.escape)': 'closeOnEscape()' }
})
export class UnifiedSidebarComponent {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly injector = inject(Injector);

  readonly collapsed = input<boolean>(false);
  readonly config = input.required<SidebarConfig>();
  /** Shows an item's `preview` card on hover. Turn off to keep `preview` only as data, such as for search. */
  readonly showPreview = input<boolean>(true);
  /** Routes of the open groups. Every group starts closed; the host decides what to remember. */
  readonly openGroups = model<string[]>([]);

  readonly collapsedToggled = output<void>();
  readonly itemClicked = output<void>();
  readonly itemHovered = output<SidebarItem | null>();
  readonly pinToggled = output<SidebarItem>();

  private readonly sidebarRoot = viewChild.required<ElementRef<HTMLElement>>('sidebarRoot');
  private readonly flyoutPanelElement = viewChild<ElementRef<HTMLElement>>('flyoutPanel');

  protected readonly useTranslation = computed(() => this.config().useTranslation ?? false);
  protected readonly componentPreview = signal<SidebarItem | null>(null);
  protected readonly flyout = signal<Flyout | null>(null);
  /** The page just pinned: its new Pinned row plays the enter animation, once. */
  protected readonly freshPin = signal<string | null>(null);
  /** A pin keeps its icon until the pointer leaves after a click, so a new pin never flips straight to PinOff. */
  protected readonly justToggled = signal<string | null>(null);
  protected readonly announcement = signal('');

  /** Counts collapse changes after the first render: labels fade in when the user opens the rail, not on page load. */
  private readonly collapseChanges = linkedSignal<boolean, number>({
    source: this.collapsed,
    computation: (_collapsed, previous) => (previous === undefined ? 0 : previous.value + 1)
  });
  protected readonly railTouched = computed(() => this.collapseChanges() > 0);

  protected readonly flyoutPages = computed(() => this.pagesFor(this.flyout()));

  private readonly activeByRoute = new Map<string, Signal<boolean>>();
  private flyoutTrigger: HTMLElement | null = null;
  private flyoutCloseTimer: ReturnType<typeof setTimeout> | null = null;
  private railIntentTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.cancelFlyoutClose();
      this.clearRailIntent();
    });
  }

  protected isPageActive(item: SidebarItem): boolean {
    if (item.flyoutItems?.length) {
      return item.flyoutItems.some(page => this.isRouteActive(page.route));
    }
    return this.isRouteActive(item.route);
  }

  protected hasCurrentPage(group: SidebarItem): boolean {
    return (group.children ?? []).some(child => child.isShow !== false && this.isPageActive(child));
  }

  protected isGroupOpen(group: SidebarItem): boolean {
    return this.openGroups().includes(group.route);
  }

  protected groupPanelId(group: SidebarItem): string {
    return 'sidebar-group' + group.route.replace(/[^a-zA-Z0-9]+/g, '-');
  }

  /** In the rail a group click opens the sidebar on that group; otherwise it opens or closes the group. */
  protected toggleGroup(group: SidebarItem): void {
    const open = this.openGroups();
    if (this.collapsed()) {
      if (!open.includes(group.route)) {
        this.openGroups.set([...open, group.route]);
      }
      this.expandFromRail();
      return;
    }
    this.openGroups.set(open.includes(group.route) ? open.filter(route => route !== group.route) : [...open, group.route]);
  }

  protected expandFromRail(): void {
    this.closeFlyout();
    this.collapsedToggled.emit();
  }

  /** The rail pin icon goes away when the sidebar opens, so focus moves to the first pinned page. */
  protected expandToPins(): void {
    this.expandFromRail();
    afterNextRender(() => this.sidebarRoot().nativeElement.querySelector<HTMLElement>('.pinned-row a, .pinned-row button')?.focus(), {
      injector: this.injector
    });
  }

  protected togglePin(item: SidebarItem, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const pinning = !item.pinned;
    this.justToggled.set(item.route);
    this.freshPin.set(pinning ? item.route : null);
    const page = this.useTranslation() ? this.translate.instant(item.label) : item.label;
    this.announcement.set(this.translate.instant(pinning ? 'SIDEBAR.PINNED_ANNOUNCE' : 'SIDEBAR.UNPINNED_ANNOUNCE', { page }));
    if (!pinning) {
      this.keepFocusAfterUnpin(event.currentTarget as HTMLElement);
    }
    this.pinToggled.emit(item);
    if (pinning) {
      // Cleared once the new row has rendered, so it never replays.
      afterNextRender(() => this.freshPin.set(null), { injector: this.injector });
    }
  }

  protected releasePin(item: SidebarItem): void {
    if (this.justToggled() === item.route) {
      this.justToggled.set(null);
    }
  }

  protected showItemPreview(item: SidebarItem): void {
    if (item.preview) {
      this.componentPreview.set(item);
      this.itemHovered.emit(item);
    }
  }

  protected hideItemPreview(): void {
    this.componentPreview.set(null);
    this.itemHovered.emit(null);
  }

  protected openPagesFlyout(item: SidebarItem, event: Event): void {
    this.openFlyout('pages', item, event.currentTarget as HTMLElement);
  }

  /** The first rail panel waits for the pointer to rest; once one is open the next opens at once. */
  protected enterRailItem(item: SidebarItem, event: MouseEvent): void {
    if (!this.collapsed()) {
      return;
    }
    const trigger = event.currentTarget as HTMLElement;
    const kind = item.children?.length ? 'pages' : 'tip';
    this.cancelFlyoutClose();
    this.clearRailIntent();
    if (this.flyout()) {
      this.openFlyout(kind, item, trigger);
      return;
    }
    this.railIntentTimer = setTimeout(() => this.openFlyout(kind, item, trigger), RAIL_HOVER_INTENT_MS);
  }

  protected leaveRailItem(): void {
    if (!this.collapsed()) {
      return;
    }
    this.clearRailIntent();
    if (this.flyout()) {
      this.scheduleFlyoutClose();
    }
  }

  protected scheduleFlyoutClose(): void {
    this.cancelFlyoutClose();
    this.flyoutCloseTimer = setTimeout(() => this.closeFlyout(), FLYOUT_CLOSE_GRACE_MS);
  }

  protected cancelFlyoutClose(): void {
    if (this.flyoutCloseTimer) {
      clearTimeout(this.flyoutCloseTimer);
      this.flyoutCloseTimer = null;
    }
  }

  /** Esc closes an open panel wherever focus is. Focus inside the panel goes back to the row that opened it. */
  protected closeOnEscape(): void {
    if (!this.flyout()) {
      return;
    }
    const focusInPanel = !!this.flyoutPanelElement()?.nativeElement.contains(document.activeElement);
    this.closeFlyout();
    if (focusInPanel) {
      this.flyoutTrigger?.focus();
    }
  }

  /** Also drops a panel still waiting on hover intent: a click on a rail group lands inside that wait. */
  protected closeFlyout(): void {
    this.cancelFlyoutClose();
    this.clearRailIntent();
    this.flyout.set(null);
  }

  protected chooseFlyoutPage(): void {
    this.closeFlyout();
    this.itemClicked.emit();
  }

  private openFlyout(kind: Flyout['kind'], item: SidebarItem, trigger: HTMLElement): void {
    this.cancelFlyoutClose();
    this.clearRailIntent();
    const top = trigger.getBoundingClientRect().top;
    const left = this.sidebarRoot().nativeElement.getBoundingClientRect().right + FLYOUT_GAP_PX;
    this.flyoutTrigger = trigger;
    this.flyout.set({ kind, item, top, left });
    afterNextRender(() => this.keepFlyoutInView(), { injector: this.injector });
  }

  /** A panel that would run past the bottom of the window moves up once it has a height. */
  private keepFlyoutInView(): void {
    const panel = this.flyoutPanelElement()?.nativeElement;
    const flyout = this.flyout();
    if (!panel || !flyout) {
      return;
    }
    const overflow = panel.getBoundingClientRect().bottom - (window.innerHeight - FLYOUT_GAP_PX);
    if (overflow > 0) {
      this.flyout.set({ ...flyout, top: Math.max(FLYOUT_GAP_PX, flyout.top - overflow) });
    }
  }

  /**
   * Unpinning in the Pinned block removes the focused row. Focus moves to the next row's pin, else
   * the row before, else the menu below the block.
   */
  private keepFocusAfterUnpin(button: HTMLElement): void {
    const row = button.closest('.pinned-row');
    if (!row) {
      return;
    }
    const neighbour = row.nextElementSibling ?? row.previousElementSibling;
    const menuBelow = row.closest('ul')?.parentElement?.nextElementSibling;
    (neighbour?.querySelector<HTMLElement>('.sidebar-pin') ?? menuBelow?.querySelector<HTMLElement>('a, button'))?.focus();
  }

  private clearRailIntent(): void {
    if (this.railIntentTimer) {
      clearTimeout(this.railIntentTimer);
      this.railIntentTimer = null;
    }
  }

  /**
   * A flyout item lists its own pages, with their pins. A rail panel lists a group's pages, then its
   * flyout item's pages under that item's label; it is only a way in, so it has no pins.
   */
  private pagesFor(flyout: Flyout | null): { pages: FlyoutPage[]; subTitle: string; subPages: FlyoutPage[] } {
    if (!flyout || flyout.kind === 'tip') {
      return { pages: [], subTitle: '', subPages: [] };
    }
    const { item } = flyout;
    if (!item.children?.length) {
      return { pages: this.latestFlyoutItems(item), subTitle: '', subPages: [] };
    }
    const visible = item.children.filter(child => child.isShow !== false);
    const hub = visible.find(child => child.flyoutItems?.length);
    return {
      pages: visible.filter(child => child !== hub).map(child => ({ label: child.label, route: child.route, icon: '', context: child.context })),
      subTitle: hub?.label ?? '',
      subPages: (hub?.flyoutItems ?? []).map(page => ({ label: page.label, route: page.route, icon: '' }))
    };
  }

  /** The open panel's pages as the config holds them now, so a pin made inside the panel shows at once. */
  private latestFlyoutItems(item: SidebarItem): SidebarFlyoutItem[] {
    const entries = this.config().sections.flatMap(section => section.items.flatMap(entry => [entry, ...(entry.children ?? [])]));
    return entries.find(entry => entry.route === item.route && entry.flyoutItems?.length)?.flyoutItems ?? item.flyoutItems ?? [];
  }

  private isRouteActive(route: string): boolean {
    let active = this.activeByRoute.get(route);
    if (!active) {
      active = untracked(() => isActive(route, this.router, PAGE_MATCH));
      this.activeByRoute.set(route, active);
    }
    return active();
  }
}
