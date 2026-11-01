import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { TabsComponent, TabItem } from 'hr-ui';
import { CardComponent, CardContentComponent } from 'hr-ui';
import { TextComponent } from 'hr-ui';
import { ButtonComponent } from 'hr-ui';
import { InputComponent } from 'hr-ui';
import { SwitchComponent } from 'hr-ui';
import { FormsModule } from '@angular/forms';

interface TabsConfig {
  tabs: TabItem[];
  activeTab: string;
}

@Component({
  selector: 'oct-tabs-page',
  templateUrl: './tabs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TabsComponent, CardComponent, CardContentComponent, TextComponent, ButtonComponent, InputComponent, SwitchComponent, FormsModule]
})
export class TabsPageComponent {
  readonly config = signal<TabsConfig>({
    tabs: [
      { id: 'account', label: 'Account' },
      { id: 'profile', label: 'Profile' },
      { id: 'settings', label: 'Settings' }
    ],
    activeTab: 'account'
  });

  readonly profileTabs = signal<TabItem[]>([
    { id: 'personal', label: '👤 Personal Info' },
    { id: 'security', label: '🔒 Security' }
  ]);
  readonly activeProfileTab = signal('personal');

  readonly productTabs = signal<TabItem[]>([
    { id: 'description', label: '📝 Description' },
    { id: 'reviews', label: '⭐ Reviews (127)' },
    { id: 'shipping', label: '🚚 Shipping & Returns' }
  ]);
  readonly activeProductTab = signal('description');

  readonly dashboardTabs = signal<TabItem[]>([
    { id: 'overview', label: '📊 Overview' },
    { id: 'analytics', label: '📈 Analytics' },
    { id: 'reports', label: '📑 Reports' },
    { id: 'settings', label: '⚙️ Settings' }
  ]);
  readonly activeDashboardTab = signal('overview');

  readonly socialTabs = signal<TabItem[]>([
    { id: 'feed', label: '🏠 Feed' },
    { id: 'explore', label: '🔍 Explore' },
    { id: 'notifications', label: '🔔 Notifications' },
    { id: 'messages', label: '💬 Messages' },
    { id: 'profile', label: '👤 Profile' }
  ]);
  readonly activeSocialTab = signal('feed');

  readonly projectTabs = signal<TabItem[]>([
    { id: 'board', label: '📋 Board' },
    { id: 'timeline', label: '📅 Timeline' },
    { id: 'calendar', label: '🗓️ Calendar' },
    { id: 'team', label: '👥 Team' },
    { id: 'files', label: '📁 Files' },
    { id: 'insights', label: '💡 Insights' }
  ]);
  readonly activeProjectTab = signal('board');

  /**
   * Real design-system routes, so the anchor affordances the `href` exists for are genuinely
   * testable on this page: middle-click opens the sibling page, right-click offers copy-link-address,
   * and the browser shows the target in the status bar on hover.
   */
  readonly navTabs = signal<TabItem[]>([
    { id: 'sidebar', label: 'Sidebar', href: '/sidebar' },
    { id: 'tabs', label: 'Tabs', href: '/tabs' },
    { id: 'search-panel', label: 'Search Panel', href: '/search-panel' }
  ]);
  readonly activeNavTab = signal('tabs');
  readonly navInteractive = signal(true);
  readonly lastNavTarget = signal('');

  readonly mixedTabs = signal<TabItem[]>([
    { id: 'summary', label: 'Summary' },
    { id: 'sibling', label: 'Sibling record', href: '/tabs' }
  ]);
  readonly activeMixedTab = signal('summary');

  readonly contentExamples = {
    personal: '✏️ Edit your name, email, phone number, and profile picture',
    security: '🛡️ Manage passwords, two-factor authentication, and active sessions',
    description:
      '🎯 Premium wireless headphones with active noise cancellation. Enjoy crystal-clear sound quality with up to 30 hours of battery life.',
    reviews: '⭐⭐⭐⭐⭐ "Best headphones I\'ve ever owned! The noise cancellation is incredible." - Sarah M.',
    shipping: '📦 Free shipping on orders over $50. 30-day return policy with full refund.',
    overview: '📊 Total revenue this month: $45,231 | Active users: 1,234 | Growth: +12%',
    analytics: '📈 User engagement is up 23% compared to last month. Peak traffic: 3pm-5pm',
    reports: '📑 Monthly sales report generated. Download available in PDF and Excel formats.',
    settings: '⚙️ Configure dashboard layout, notification preferences, and data refresh intervals',
    feed: '🏠 See posts from people you follow and discover new content',
    explore: '🔍 Trending topics: #TechNews #Photography #Travel',
    notifications: '🔔 You have 3 new likes and 2 comments on your recent post',
    messages: '💬 2 unread messages from Alex and Jordan',
    profile: '👤 Your profile has been viewed 127 times this week',
    board: '📋 12 tasks in progress, 8 completed today, 5 pending review',
    timeline: '📅 Project milestone: Beta launch scheduled for next Friday',
    calendar: '🗓️ Upcoming: Team standup (10am), Design review (2pm)',
    team: '👥 5 team members online: Alex, Jordan, Sam, Taylor, Morgan',
    files: '📁 23 files shared | Recent: Design_mockups_v3.fig, Meeting_notes.pdf',
    insights: '💡 Team velocity: +15% | Average completion time: 2.3 days per task'
  };

  applyPreset(preset: string): void {
    switch (preset) {
      case '2tabs':
        this.config.set({
          tabs: [
            { id: 'tab1', label: 'Tab 1' },
            { id: 'tab2', label: 'Tab 2' }
          ],
          activeTab: 'tab1'
        });
        break;
      case '3tabs':
        this.config.set({
          tabs: [
            { id: 'tab1', label: 'Tab 1' },
            { id: 'tab2', label: 'Tab 2' },
            { id: 'tab3', label: 'Tab 3' }
          ],
          activeTab: 'tab1'
        });
        break;
      case '4tabs':
        this.config.set({
          tabs: [
            { id: 'tab1', label: 'Tab 1' },
            { id: 'tab2', label: 'Tab 2' },
            { id: 'tab3', label: 'Tab 3' },
            { id: 'tab4', label: 'Tab 4' }
          ],
          activeTab: 'tab1'
        });
        break;
      case '6tabs':
        this.config.set({
          tabs: [
            { id: 'tab1', label: 'Tab 1' },
            { id: 'tab2', label: 'Tab 2' },
            { id: 'tab3', label: 'Tab 3' },
            { id: 'tab4', label: 'Tab 4' },
            { id: 'tab5', label: 'Tab 5' },
            { id: 'tab6', label: 'Tab 6' }
          ],
          activeTab: 'tab1'
        });
        break;
    }
  }

  addTab(): void {
    const current = this.config();
    const newTabNum = current.tabs.length + 1;
    const newTab: TabItem = {
      id: `tab${newTabNum}`,
      label: `Tab ${newTabNum}`
    };

    this.config.set({
      ...current,
      tabs: [...current.tabs, newTab]
    });
  }

  removeTab(): void {
    const current = this.config();
    if (current.tabs.length <= 1) return;

    const newTabs = current.tabs.slice(0, -1);
    const newActiveTab = current.activeTab === current.tabs[current.tabs.length - 1].id ? newTabs[newTabs.length - 1].id : current.activeTab;

    this.config.set({
      tabs: newTabs,
      activeTab: newActiveTab
    });
  }

  updateTabLabel(index: number, newLabel: string): void {
    const current = this.config();
    const updatedTabs = [...current.tabs];
    updatedTabs[index] = { ...updatedTabs[index], label: newLabel };

    this.config.set({
      ...current,
      tabs: updatedTabs
    });
  }

  onPlaygroundTabChange(tabId: string): void {
    const current = this.config();
    this.config.set({
      ...current,
      activeTab: tabId
    });
    console.log('Playground tab changed to:', tabId);
  }

  onProfileTabChange(tabId: string): void {
    console.log('Profile tab selected:', tabId);
  }

  onProductTabChange(tabId: string): void {
    console.log('Product tab selected:', tabId);
  }

  onDashboardTabChange(tabId: string): void {
    console.log('Dashboard tab selected:', tabId);
  }

  onSocialTabChange(tabId: string): void {
    console.log('Social tab selected:', tabId);
  }

  onProjectTabChange(tabId: string): void {
    console.log('Project tab selected:', tabId);
  }

  /**
   * Left-click on an anchor tab is preventDefaulted by the component, so nothing navigates here —
   * a real consumer routes from this handler. Recording the target is what makes that visible.
   */
  onNavTabChange(tabId: string): void {
    this.lastNavTarget.set(this.navTabs().find(tab => tab.id === tabId)?.href ?? '');
  }

  getContent(key: string): string {
    return this.contentExamples[key as keyof typeof this.contentExamples] || '';
  }
}
