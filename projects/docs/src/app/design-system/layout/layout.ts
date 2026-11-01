import { Component, ChangeDetectionStrategy, inject, signal, OnInit, OnDestroy, computed } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject, filter, takeUntil } from 'rxjs';

import { ButtonComponent } from 'hr-ui';
import { ThemeControllerComponent } from 'hr-ui';
import { IconComponent } from 'hr-ui';
import { SearchPanelComponent } from 'hr-ui';
import { SearchPanelEmptyDirective, SearchPanelRowDirective } from 'hr-ui';
import { UnifiedSidebarComponent, type SidebarItem } from 'hr-ui';
import { KbdComponent } from 'hr-ui';
import { TextComponent } from 'hr-ui';
import { HighlightPipe } from 'hr-ui';
import { designSystemPages, designSystemSidebarConfig, searchDesignSystemPages, type DesignSystemPage } from './sidebar.config';

@Component({
  selector: 'oct-layout',
  templateUrl: './layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    IconComponent,
    ThemeControllerComponent,
    UnifiedSidebarComponent,
    ButtonComponent,
    KbdComponent,
    TextComponent,
    SearchPanelComponent,
    SearchPanelRowDirective,
    SearchPanelEmptyDirective,
    HighlightPipe
  ]
})
export class LayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);

  readonly sidebarCollapsed = signal(false);
  readonly isSearchOpen = signal(false);
  readonly showQuickActions = signal(false);
  readonly showKeyboardShortcuts = signal(false);
  readonly isRouteLoading = signal(false);
  readonly showScrollTop = signal(false);
  readonly currentPageTitle = signal('Overview');
  readonly hoveredItem = signal<SidebarItem | null>(null);
  readonly sidebarConfig = designSystemSidebarConfig;

  private readonly pages = designSystemPages();
  readonly searchQuery = signal('');
  readonly searchResults = computed(() => searchDesignSystemPages(this.pages, this.searchQuery()));

  private readonly _isMobile = signal(false);
  private readonly _mobileSidebarOpen = signal(false);
  readonly isMobile = this._isMobile.asReadonly();

  readonly showSidebar = computed(() => {
    if (!this._isMobile()) {
      return true;
    }
    return this._mobileSidebarOpen();
  });

  readonly sidebarShouldCollapse = computed(() => {
    if (this._isMobile()) {
      return false;
    }
    return this.sidebarCollapsed();
  });

  readonly showMobileOverlay = computed(() => {
    return this._isMobile() && this._mobileSidebarOpen();
  });

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 1023px)']) // lg breakpoint
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this._isMobile.set(result.matches);

        if (result.matches) {
          this._mobileSidebarOpen.set(false);
        }
      });

    // Listen for route changes to update breadcrumbs
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.updatePageTitle(event.url);
        this.isRouteLoading.set(false);
        if (this._isMobile()) {
          this._mobileSidebarOpen.set(false);
        }
      });

    // Set initial page title
    this.updatePageTitle(this.router.url);

    // Add event listeners using modern approach
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyboardShortcuts);
      window.addEventListener('scroll', this.onWindowScroll);
      document.addEventListener('click', this.onDocumentClick);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Clean up event listeners
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyboardShortcuts);
      window.removeEventListener('scroll', this.onWindowScroll);
      document.removeEventListener('click', this.onDocumentClick);
    }
  }

  private updatePageTitle(url: string): void {
    const segments = url.split('/');
    const lastSegment = segments[segments.length - 1];

    if (!lastSegment) {
      this.currentPageTitle.set('Overview');
    } else {
      // Capitalize and format the segment
      const title = lastSegment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      this.currentPageTitle.set(title);
    }
  }

  onSidebarCollapse(): void {
    if (this._isMobile()) {
      this._mobileSidebarOpen.update(v => !v);
    } else {
      this.sidebarCollapsed.update(v => !v);
    }
  }

  toggleMobileSidebar(): void {
    this._mobileSidebarOpen.set(false);
  }

  onItemHovered(item: SidebarItem | null): void {
    this.hoveredItem.set(item);
  }

  openSearch(): void {
    this.isSearchOpen.set(true);
  }

  onSearchClose(): void {
    this.isSearchOpen.set(false);
    this.searchQuery.set('');
  }

  onPageSelected(page: DesignSystemPage): void {
    this.router.navigateByUrl(page.route);
  }

  onQuickActionsToggle(): void {
    this.showQuickActions.update(v => !v);
  }

  onExportTokens(): void {
    console.log('Exporting design tokens');
    this.showQuickActions.set(false);
  }

  onOpenDocumentation(): void {
    console.log('Opening documentation');
    this.showQuickActions.set(false);
  }

  onOpenCodeEditor(): void {
    console.log('Opening code editor');
    this.showQuickActions.set(false);
  }

  onThemeChanged(theme: 'light' | 'dark'): void {
    console.log('Theme changed to:', theme);
  }

  scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  closeKeyboardShortcuts(): void {
    this.showKeyboardShortcuts.set(false);
  }

  // Host listeners for keyboard shortcuts and scroll detection
  private handleKeyboardShortcuts = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement;
    const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

    // Search shortcut (Ctrl/Cmd + K), which stays available while typing
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.openSearch();
      return;
    }

    // Search shortcut (/)
    if (event.key === '/' && !isTyping) {
      event.preventDefault();
      this.openSearch();
    }

    // Show shortcuts (?)
    if (event.key === '?' && !isTyping) {
      event.preventDefault();
      this.showKeyboardShortcuts.set(true);
    }

    // Close modal on Escape
    if (event.key === 'Escape') {
      this.showKeyboardShortcuts.set(false);
      this.showQuickActions.set(false);
    }
  };

  private onWindowScroll = (): void => {
    if (typeof window !== 'undefined') {
      this.showScrollTop.set(window.pageYOffset > 300);
    }
  };

  private onDocumentClick = (event: Event): void => {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative.group')) {
      this.showQuickActions.set(false);
    }
  };
}
