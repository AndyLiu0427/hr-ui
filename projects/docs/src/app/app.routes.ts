import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./design-system/design-system').then(m => m.DesignSystemComponent),
    children: [
      { path: '', loadComponent: () => import('./design-system/pages/overview').then(m => m.OverviewPageComponent) },
      { path: 'avatar', loadComponent: () => import('./design-system/pages/avatar/avatar').then(m => m.AvatarPageComponent) },
      { path: 'badge', loadComponent: () => import('./design-system/pages/badge/badge').then(m => m.BadgePageComponent) },
      { path: 'bottom-sheet', loadComponent: () => import('./design-system/pages/bottom-sheet/bottom-sheet').then(m => m.BottomSheetPageComponent) },
      { path: 'color-tag', loadComponent: () => import('./design-system/pages/color-tag/color-tag').then(m => m.ColorTagPageComponent) },
      { path: 'button', loadComponent: () => import('./design-system/pages/button/button').then(m => m.ButtonPageComponent) },
      { path: 'card', loadComponent: () => import('./design-system/pages/card/card').then(m => m.CardPageComponent) },
      { path: 'checkbox', loadComponent: () => import('./design-system/pages/checkbox/checkbox').then(m => m.CheckboxPageComponent) },
      { path: 'colors', loadComponent: () => import('./design-system/pages/colors/colors').then(m => m.ColorsPageComponent) },
      { path: 'dialog', loadComponent: () => import('./design-system/pages/dialog/dialog').then(m => m.DialogPageComponent) },
      { path: 'divider', loadComponent: () => import('./design-system/pages/divider/divider').then(m => m.DividerPageComponent) },
      { path: 'dropdown-menu', loadComponent: () => import('./design-system/pages/dropdown-menu/dropdown-menu').then(m => m.DropdownMenuPageComponent) },
      { path: 'file-input', loadComponent: () => import('./design-system/pages/file-input/file-input').then(m => m.FileInputPageComponent) },
      { path: 'filter', loadComponent: () => import('./design-system/pages/filter/filter').then(m => m.FilterPageComponent) },
      { path: 'icon', loadComponent: () => import('./design-system/pages/icon/icon').then(m => m.IconPageComponent) },
      { path: 'input', loadComponent: () => import('./design-system/pages/input/input').then(m => m.InputPageComponent) },
      { path: 'notice', loadComponent: () => import('./design-system/pages/notice/notice').then(m => m.NoticePageComponent) },
      { path: 'progress-bar', loadComponent: () => import('./design-system/pages/progress-bar/progress-bar').then(m => m.ProgressBarPageComponent) },
      { path: 'radio', loadComponent: () => import('./design-system/pages/radio/radio').then(m => m.RadioPageComponent) },
      { path: 'search-panel', loadComponent: () => import('./design-system/pages/search-panel/search-panel').then(m => m.SearchPanelPageComponent) },
      { path: 'search-select', loadComponent: () => import('./design-system/pages/search-select/search-select').then(m => m.SearchSelectPageComponent) },
      { path: 'select', loadComponent: () => import('./design-system/pages/select/select').then(m => m.SelectPageComponent) },
      { path: 'input-select', loadComponent: () => import('./design-system/pages/input-select/input-select').then(m => m.InputSelectPageComponent) },
      { path: 'sidebar', redirectTo: 'sidebar/assignments', pathMatch: 'full' },
      { path: 'sidebar/:section', loadComponent: () => import('./design-system/pages/sidebar/sidebar').then(m => m.SidebarPageComponent) },
      { path: 'slider', loadComponent: () => import('./design-system/pages/slider/slider') },
      { path: 'snackbar', loadComponent: () => import('./design-system/pages/snackbar/snackbar').then(m => m.SnackbarPageComponent) },
      { path: 'switch', loadComponent: () => import('./design-system/pages/switch/switch').then(m => m.SwitchPageComponent) },
      { path: 'table', loadComponent: () => import('./design-system/pages/table/table').then(m => m.TablePageComponent) },
      { path: 'tabs', loadComponent: () => import('./design-system/pages/tabs/tabs').then(m => m.TabsPageComponent) },
      { path: 'career-progression', loadComponent: () => import('./design-system/pages/career-progression/career-progression').then(m => m.CareerProgressionPageComponent) },
      { path: 'date-timeline', loadComponent: () => import('./design-system/pages/date-timeline/date-timeline').then(m => m.DateTimelinePageComponent) },
      { path: 'tooltip', loadComponent: () => import('./design-system/pages/tooltip/tooltip').then(m => m.TooltipPageComponent) },
      { path: 'textarea', loadComponent: () => import('./design-system/pages/textarea/textarea').then(m => m.TextareaPageComponent) },
      { path: 'theme-controller', loadComponent: () => import('./design-system/pages/theme-controller/theme-controller').then(m => m.ThemeControllerPageComponent) },
      { path: 'typography', loadComponent: () => import('./design-system/pages/typography/typography').then(m => m.TypographyPageComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
