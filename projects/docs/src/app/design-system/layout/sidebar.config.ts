import type { SearchPanelItem } from 'hr-ui';
import type { SidebarConfig } from 'hr-ui';

// Which design-system pages exist, and how to search them. The sections below are the only
// place a page is registered; the sidebar, search panel and overview list all derive from them.
export const designSystemSidebarConfig: SidebarConfig = {
  useTranslation: false,
  sections: [
    {
      id: 'get-started',
      label: 'Get Started',
      items: [
        {
          label: 'Overview',
          route: '/',
          icon: 'House'
        }
      ]
    },
    {
      id: 'foundations',
      label: 'Foundations',
      items: [
        {
          label: 'Colors',
          route: '/colors',
          icon: 'SwatchBook',
          preview: {
            title: 'Colors',
            description: 'Semantic design tokens plus the full Tailwind color palette, with click-to-copy'
          }
        },
        {
          label: 'Typography',
          route: '/typography',
          icon: 'Type',
          preview: {
            title: 'Typography',
            description: 'Text component with configurable colors, sizes, and weights'
          }
        },
        {
          label: 'Icon',
          route: '/icon',
          icon: 'Sparkles',
          preview: {
            title: 'Icon Component',
            description: 'Display scalable vector icons from Lucide Icons library with customizable size, stroke, and color'
          }
        },
        {
          label: 'Theme Controller',
          route: '/theme-controller',
          icon: 'Palette',
          preview: {
            title: 'Theme Controller',
            description: 'Toggle between light and dark themes'
          }
        },
        {
          label: 'Divider',
          route: '/divider',
          icon: 'Minus',
          preview: {
            title: 'Divider Component',
            description: 'Visual separator for content sections with customizable orientation, style, and optional text'
          }
        }
      ]
    },
    {
      id: 'forms',
      label: 'Forms & Inputs',
      items: [
        {
          label: 'Input',
          route: '/input',
          icon: 'TextCursor'
        },
        {
          label: 'Text area',
          route: '/textarea',
          icon: 'TextCursor',
          preview: {
            title: 'Text area Component',
            description: 'Multi-line text input with states, validation, and form integration'
          }
        },
        {
          label: 'Select',
          route: '/select',
          icon: 'ChevronDown',
          preview: {
            title: 'Select Component',
            description: 'Dropdown select with search, clear, and keyboard navigation support'
          }
        },
        {
          label: 'Input Select',
          route: '/input-select',
          icon: 'TextCursorInput',
          preview: {
            title: 'Input Select Component',
            description: 'An amount and the unit it is measured in, as one control with one label and one error row'
          }
        },
        {
          label: 'Search Select',
          route: '/search-select',
          icon: 'Search',
          preview: {
            title: 'Search Select Component',
            description: 'Advanced searchable select with API integration, debounce, and custom value creation'
          }
        },
        {
          label: 'Checkbox',
          route: '/checkbox',
          icon: 'SquareCheck',
          preview: {
            title: 'Checkbox Component',
            description: 'Interactive checkbox components with various states, sizes, and form integration'
          }
        },
        {
          label: 'Radio',
          route: '/radio',
          icon: 'CircleDot',
          preview: {
            title: 'Radio Component',
            description: 'Presentational single-select control where the parent owns the checked state'
          }
        },
        {
          label: 'Switch',
          route: '/switch',
          icon: 'ToggleLeft',
          preview: {
            title: 'Switch Component',
            description: 'Toggle control for binary on/off states with full accessibility and form integration'
          }
        },
        {
          label: 'Slider',
          route: '/slider',
          icon: 'SlidersHorizontal',
          preview: {
            title: 'Slider Component',
            description: 'Interactive percentage slider with drag support, click navigation, and 100% sum constraint'
          }
        },
        {
          label: 'File Input',
          route: '/file-input',
          icon: 'Upload',
          preview: {
            title: 'File Input Component',
            description: 'Native file picker with dropzone + preview mode (image upload) and compact button mode (multi-file toolbars)'
          }
        },
        {
          label: 'Filter',
          route: '/filter',
          icon: 'Funnel',
          preview: {
            title: 'Filter Component',
            description: 'Reusable filter button with multi-select overlay menu using Angular CDK'
          }
        },
        {
          label: 'Button',
          route: '/button',
          icon: 'RectangleEllipsis'
        },
        {
          label: 'Dropdown Menu',
          route: '/dropdown-menu',
          icon: 'ChevronDown',
          preview: {
            title: 'Dropdown Menu',
            description: 'Context menu for account-related actions with keyboard navigation'
          }
        }
      ]
    },
    {
      id: 'data-display',
      label: 'Data Display',
      items: [
        {
          label: 'Table',
          route: '/table',
          icon: 'Table',
          preview: {
            title: 'Table Component',
            description: 'Advanced data table with sorting, filtering, pagination, and responsive design'
          }
        },
        {
          label: 'Career Progression',
          route: '/career-progression',
          icon: 'GitBranch',
          preview: {
            title: 'Career Progression Component',
            description: 'Vertical timeline of assignments and chronological events with status indicators'
          }
        },
        {
          label: 'Date Timeline',
          route: '/date-timeline',
          icon: 'CalendarRange',
          preview: {
            title: 'Date Timeline Component',
            description: 'Compact horizontal milestone strip for related dates with an optional emphasized node'
          }
        },
        {
          label: 'Card',
          route: '/card',
          icon: 'CreditCard',
          preview: {
            title: 'Card Component',
            description: 'Container component with header, content, and footer sections for displaying information'
          }
        },
        {
          label: 'Badge',
          route: '/badge',
          icon: 'Tag',
          preview: {
            title: 'Badge Component',
            description: 'Small status indicators with support for different sizes, colors, and modes with optional icons'
          }
        },
        {
          label: 'Color Tag',
          route: '/color-tag',
          icon: 'Bookmark',
          preview: {
            title: 'Color Tag Component',
            description: 'Client color code: the same triangle cut from a card, pinned to a table row, or set inline in a select option'
          }
        },
        {
          label: 'Avatar',
          route: '/avatar',
          icon: 'CircleUser',
          preview: {
            title: 'Avatar Component',
            description: 'Display user profile pictures with fallbacks'
          }
        },
        {
          label: 'Progress Bar',
          route: '/progress-bar',
          icon: 'LoaderCircle',
          preview: {
            title: 'Progress Bar Component',
            description: 'Display progress indicators with customizable labels and percentage display'
          }
        }
      ]
    },
    {
      id: 'feedback',
      label: 'Feedback & Overlays',
      items: [
        {
          label: 'Dialog',
          route: '/dialog',
          icon: 'MessageSquare',
          preview: {
            title: 'Dialog Component',
            description: 'Modal dialog with header, content, and footer sections for user interactions'
          }
        },
        {
          label: 'Bottom Sheet',
          route: '/bottom-sheet',
          icon: 'PanelBottomOpen',
          preview: {
            title: 'Bottom Sheet',
            description: 'Mobile slide-up sheet with drag handle, header, body slot, and optional footer slot'
          }
        },
        {
          label: 'Notice',
          route: '/notice',
          icon: 'CircleAlert',
          preview: {
            title: 'Notice Component',
            description: 'Display alerts, warnings, and informational messages with variants, icons, and dismiss functionality'
          }
        },
        {
          label: 'Snackbar',
          route: '/snackbar',
          icon: 'Bell',
          preview: {
            title: 'Snackbar Component',
            description: 'Display temporary notifications and alerts with support for actions, types, and positions'
          }
        },
        {
          label: 'Tooltip',
          route: '/tooltip',
          icon: 'Info',
          preview: {
            title: 'Tooltip Directive',
            description: 'Short informational message that appears on hover with configurable position and arrow'
          }
        }
      ]
    },
    {
      id: 'navigation',
      label: 'Navigation',
      items: [
        {
          label: 'Sidebar',
          route: '/sidebar',
          icon: 'PanelLeft',
          preview: {
            title: 'Sidebar Component',
            description: 'App navigation with pinned pages, groups that start closed, a hover flyout for reports, and a collapsible icon rail'
          }
        },
        {
          label: 'Tabs',
          route: '/tabs',
          icon: 'Layers',
          preview: {
            title: 'Tabs Component',
            description: 'Navigation component for organizing content into separate views with smooth sliding animations'
          }
        },
        {
          label: 'Search Panel',
          route: '/search-panel',
          icon: 'SearchCode',
          preview: {
            title: 'Search Panel',
            description: 'Command palette shell with keyboard navigation and combobox semantics, filtering left to the host'
          }
        }
      ]
    }
  ]
};

/** One navigable destination in the design system. Not every one is a component: Overview,
 *  Colors is a page too, which is why this is not called a component. */
export interface DesignSystemPage extends SearchPanelItem {
  name: string;
  description: string;
  route: string;
  icon: string;
  /** Required here, unlike the optional group on SearchPanelItem: every page has a section. */
  group: string;
}

export function designSystemPages(): DesignSystemPage[] {
  return designSystemSidebarConfig.sections.flatMap(section =>
    section.items.map(item => ({
      // The route doubles as the identity: one page, one destination.
      id: item.route,
      name: item.label,
      description: item.preview?.description ?? '',
      route: item.route,
      icon: item.icon,
      group: section.label
    }))
  );
}

const NO_MATCH = -1;

/** An empty query returns every page, so the panel opens on a browsable list. */
export function searchDesignSystemPages(pages: readonly DesignSystemPage[], query: string): DesignSystemPage[] {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return [...pages];
  }

  return pages
    .map((page, catalogOrder) => ({ page, catalogOrder, rank: rankPage(page, needle) }))
    .filter(match => match.rank !== NO_MATCH)
    .sort((a, b) => a.rank - b.rank || a.catalogOrder - b.catalogOrder)
    .map(match => match.page);
}

// Ranked rather than filtered: "select" must put Select above Search Select, and both
// above pages that only mention selection in their description.
function rankPage(page: DesignSystemPage, needle: string): number {
  const name = page.name.toLowerCase();

  if (name.startsWith(needle)) return 0;
  if (name.includes(needle)) return 1;
  if (page.group.toLowerCase().includes(needle)) return 2;
  if (page.description.toLowerCase().includes(needle)) return 3;

  return NO_MATCH;
}
