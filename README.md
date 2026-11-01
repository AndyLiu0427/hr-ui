# hr-ui

[![npm](https://img.shields.io/npm/v/ngx-hr-ui)](https://www.npmjs.com/package/ngx-hr-ui)
[![license](https://img.shields.io/npm/l/ngx-hr-ui)](LICENSE)

Accessible Angular components for HR and payroll apps. The npm package is `ngx-hr-ui`.

**Docs, live examples and API reference:** https://andyliu0427.github.io/hr-ui/

- Over 40 standalone components with signals: forms, tables, dialogs, sheets, menus, notices.
- WCAG AA contrast in light and dark mode, keyboard focus rings, focus-managed overlays.
- Your brand color from two CSS variables.
- Tailwind CSS 4 tokens that never change Tailwind's defaults or your global styles.

## Install

Requires Angular 22 and Tailwind CSS 4.

```sh
npm install ngx-hr-ui @angular/cdk @ngx-translate/core lucide-angular tailwindcss @tailwindcss/postcss
```

`lucide-angular` does not list Angular 22 as a peer yet. Add this to your `package.json`:

```json
"overrides": {
  "lucide-angular": { "@angular/core": "$@angular/core", "@angular/common": "$@angular/common" }
}
```

Import Tailwind, then hr-ui, in your global stylesheet:

```css
@import "tailwindcss";
@import "ngx-hr-ui/styles/hr-ui.css";
@source "../node_modules/ngx-hr-ui";
```

Then provide animations, the built-in strings (English and Traditional Chinese ship in
`ngx-hr-ui/i18n/`) and the icons your templates name. `oct-icon` draws a Lucide icon by name, and only
registered icons go into your bundle:

```ts
import { Plus } from 'lucide-angular';
import { provideHrIcons } from 'ngx-hr-ui';

// in app.config.ts providers
provideHrIcons({ Plus })
```

The [Installation guide](https://andyliu0427.github.io/hr-ui/docs/installation) has the full `app.config.ts`.

## Use

```ts
import { Component } from '@angular/core';
import { ButtonComponent } from 'ngx-hr-ui';

@Component({
  selector: 'app-root',
  imports: [ButtonComponent],
  template: `<oct-button icon="Plus">Add employee</oct-button>`
})
export class App {}
```

## Theme

```css
:root {
  --hr-primary-hue: 162.5;  /* OKLCH hue, 0-360. The default 189.8 is teal. */
  --hr-primary-chroma: 2;   /* Strength. 1 is the default. */
}
```

Every primary shade follows, in light and dark mode. Components use roles such as
`bg-primary-solid` (white text measures 5:1 or more for any hue up to strength 2) and
`text-primary`, so text stays readable. Try it live on the
[Theming page](https://andyliu0427.github.io/hr-ui/docs/theming).

Dark mode follows a `dark` class on `<html>`. `ThemeService` and `<oct-theme-controller />` set it.

## Develop

```sh
npm install
npm start           # docs site on http://localhost:4200 (runs docs:gen first)
npm test            # library unit tests
npm run build       # the ngx-hr-ui package in dist/hr-ui
npm run docs:gen    # regenerate the docs' examples registry and API data
```

Docs pages: see [projects/docs/README.md](projects/docs/README.md). Releases: see
[RELEASING.md](RELEASING.md).

## License

MIT
