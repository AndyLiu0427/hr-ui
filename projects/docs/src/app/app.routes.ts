import { Routes } from '@angular/router';
import { DocsLayoutComponent } from './docs/docs-layout';

// The site's first version served each page at the root (/button, /colors). Keep those links working.
const MOVED: Record<string, string> = {
  colors: 'docs/colors',
  typography: 'docs/typography',
  icon: 'docs/icons',
  sidebar: 'docs/components/sidebar',
  'sidebar/:section': 'docs/components/sidebar'
};
const OLD_COMPONENT_PATHS = [
  'avatar', 'badge', 'bottom-sheet', 'button', 'card', 'career-progression', 'checkbox', 'chip', 'color-tag',
  'date-timeline', 'dialog', 'divider', 'dropdown-menu', 'file-input', 'filter', 'input', 'input-select',
  'notice', 'progress-bar', 'radio', 'search-panel', 'search-select', 'select', 'slider', 'snackbar',
  'switch', 'table', 'tabs', 'textarea', 'theme-controller', 'tooltip'
];

export const routes: Routes = [
  {
    path: '',
    component: DocsLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./pages/home').then(m => m.HomePage) },
      { path: 'docs', pathMatch: 'full', loadComponent: () => import('./pages/introduction').then(m => m.IntroductionPage) },
      { path: 'docs/installation', loadComponent: () => import('./pages/installation').then(m => m.InstallationPage) },
      { path: 'docs/theming', loadComponent: () => import('./pages/theming').then(m => m.ThemingPage) },
      { path: 'docs/dark-mode', loadComponent: () => import('./pages/dark-mode').then(m => m.DarkModePage) },
      { path: 'docs/colors', loadComponent: () => import('./pages/foundations/colors').then(m => m.ColorsPage) },
      { path: 'docs/typography', loadComponent: () => import('./pages/foundations/typography').then(m => m.TypographyPage) },
      { path: 'docs/icons', loadComponent: () => import('./pages/foundations/icons').then(m => m.IconsPage) },
      { path: 'docs/components', pathMatch: 'full', loadComponent: () => import('./pages/components-index').then(m => m.ComponentsIndexPage) },
      { path: 'docs/components/:slug', loadComponent: () => import('./pages/component-page').then(m => m.ComponentPage) },
      ...Object.entries(MOVED).map(([path, redirectTo]) => ({ path, redirectTo: '/' + redirectTo })),
      ...OLD_COMPONENT_PATHS.map(path => ({ path, redirectTo: `/docs/components/${path}` })),
      { path: '**', loadComponent: () => import('./pages/not-found').then(m => m.NotFoundPage) }
    ]
  }
];
