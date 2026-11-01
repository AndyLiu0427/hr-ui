import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from 'ngx-hr-ui';
import { CardComponent } from 'ngx-hr-ui';
import { IconComponent } from 'ngx-hr-ui';
import { TextComponent } from 'ngx-hr-ui';
import { designSystemPages } from '../../layout/sidebar.config';

interface ComponentLink {
  name: string;
  description: string;
  route: string;
  icon: string;
  status: 'new' | 'beta' | 'stable';
  category: 'foundation' | 'forms' | 'navigation' | 'feedback' | 'layout';
}

@Component({
  selector: 'oct-overview',
  templateUrl: './overview.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, CardComponent, BadgeComponent, TextComponent]
})
export class OverviewPageComponent {
  readonly colorFamilyCount = 10;

  // Typography scales
  readonly typographyScales = signal([
    { name: 'Extra Small', class: 'text-xs', size: '0.75rem', lineHeight: '1rem' },
    { name: 'Small', class: 'text-sm', size: '0.875rem', lineHeight: '1.25rem' },
    { name: 'Base', class: 'text-base', size: '1rem', lineHeight: '1.5rem' },
    { name: 'Large', class: 'text-lg', size: '1.125rem', lineHeight: '1.75rem' },
    { name: 'Extra Large', class: 'text-hr-xl', size: '1.5rem', lineHeight: '2rem' },
    { name: '2X Large', class: 'text-hr-2xl', size: '1.875rem', lineHeight: '2.25rem' },
    { name: '3X Large', class: 'text-hr-3xl', size: '2.25rem', lineHeight: '2.5rem' },
    { name: '4X Large', class: 'text-hr-4xl', size: '3rem', lineHeight: '1.1' }
  ]);

  // Minus the Overview page, which is not a component to browse.
  readonly componentLinks = computed<ComponentLink[]>(() => {
    const metaRoutes = new Set(['/']);

    return designSystemPages()
      .filter(page => !metaRoutes.has(page.route))
      .map(page => ({
        name: page.name,
        description: page.description,
        route: page.route,
        icon: page.icon,
        status: this.determineStatus(page.name),
        category: this.categorizeComponent(page.name)
      }));
  });

  private determineStatus(name: string): 'new' | 'beta' | 'stable' {
    // Define components by status
    const betaComponents = ['Button', 'Input'];
    const stableComponents: string[] = [];

    if (betaComponents.includes(name)) return 'beta';
    if (stableComponents.includes(name)) return 'stable';
    return 'new';
  }

  private categorizeComponent(name: string): ComponentLink['category'] {
    const categories: Record<string, ComponentLink['category']> = {
      Avatar: 'foundation',
      'Theme Controller': 'foundation',
      Typography: 'foundation',
      Colors: 'foundation',
      Button: 'forms',
      Checkbox: 'forms',
      Input: 'forms',
      'Search Select': 'forms',
      Select: 'forms',
      'Input Select': 'forms',
      Switch: 'forms',
      'Text area': 'forms',
      Card: 'layout',
      Table: 'layout',
      'Dropdown Menu': 'navigation',
      Badge: 'feedback',
      Dialog: 'feedback',
      Icon: 'foundation',
      Snackbar: 'feedback'
    };

    return categories[name] || 'foundation';
  }

  readonly componentCategories = signal([
    { id: 'foundation', name: 'Foundation', icon: 'Blocks', description: 'Basic building blocks and theme elements' },
    { id: 'forms', name: 'Forms', icon: 'FilePen', description: 'Input components and form controls' },
    { id: 'layout', name: 'Layout', icon: 'LayoutDashboard', description: 'Structural components for organizing content' },
    { id: 'navigation', name: 'Navigation', icon: 'Compass', description: 'Components for navigation and menus' },
    { id: 'feedback', name: 'Feedback', icon: 'MessageCircle', description: 'Components for user feedback and status' }
  ]);

  getComponentsByCategory(categoryId: string): ComponentLink[] {
    return this.componentLinks().filter(comp => comp.category === categoryId);
  }

  getBadgeColor(status: 'new' | 'beta' | 'stable') {
    switch (status) {
      case 'new':
        return 'success';
      case 'beta':
        return 'info';
      case 'stable':
        return 'neutral';
      default:
        return 'neutral';
    }
  }

  getVariantFromClass(className: string): 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' {
    const mapping: Record<string, 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl'> = {
      'text-xs': 'xs',
      'text-sm': 'sm',
      'text-base': 'md',
      'text-lg': 'lg',
      'text-hr-xl': 'xl',
      'text-hr-2xl': '2xl',
      'text-hr-3xl': '3xl',
      'text-hr-4xl': '4xl',
      'text-hr-5xl': '5xl',
      'text-hr-6xl': '6xl',
      'text-hr-7xl': '7xl',
      'text-hr-8xl': '8xl'
    };
    return mapping[className] || 'md';
  }
}
