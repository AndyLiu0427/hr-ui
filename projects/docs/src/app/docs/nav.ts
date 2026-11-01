import { COMPONENT_DOCS } from '../generated/component-docs';

export interface NavItem {
  title: string;
  href: string;
  description: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV: NavSection[] = [
  {
    title: 'Getting started',
    items: [
      { title: 'Introduction', href: '/docs', description: 'What hr-ui is, and what it is for.' },
      { title: 'Installation', href: '/docs/installation', description: 'Add ngx-hr-ui to an Angular 22 app with Tailwind 4.' },
      { title: 'Theming', href: '/docs/theming', description: 'Pick your brand colour with two CSS variables.' },
      { title: 'Dark mode', href: '/docs/dark-mode', description: 'Switch themes with ThemeService or the theme toggle.' }
    ]
  },
  {
    title: 'Foundations',
    items: [
      { title: 'Colors', href: '/docs/colors', description: 'Semantic tokens and the colour scales behind them.' },
      { title: 'Typography', href: '/docs/typography', description: 'The text component, its sizes, weights and colours.' },
      { title: 'Icons', href: '/docs/icons', description: 'Lucide icons and the HR marks from hr-icons.' }
    ]
  },
  {
    title: 'Components',
    items: [...COMPONENT_DOCS]
      .sort((a, b) => a.title.localeCompare(b.title))
      .map(c => ({ title: c.title, href: `/docs/components/${c.slug}`, description: c.description }))
  }
];

/** Every page in reading order, for previous/next links. */
export const NAV_ORDER: NavItem[] = NAV.flatMap(s => s.items);

export const findNav = (path: string): NavItem | undefined => NAV_ORDER.find(i => i.href === path);
