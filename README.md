# hr-ui

Angular components for HR and payroll apps. The npm package is `ngx-hr-ui`.
Forms, tables, dialogs, and Tailwind 4 design tokens, with light and dark themes.

**Docs and live demos:** https://andyliu0427.github.io/hr-ui/

## Install

```sh
npm install ngx-hr-ui @angular/cdk @angular/material @ngx-translate/core lucide-angular tailwindcss @tailwindcss/postcss
```

Requires Angular 22 and Tailwind 4.

`lucide-angular` does not list Angular 22 as a peer yet. Add this to your `package.json` so npm accepts it:

```json
"overrides": {
  "lucide-angular": { "@angular/core": "$@angular/core", "@angular/common": "$@angular/common" }
}
```

## Set up

1. In your global CSS, import Tailwind, then the hr-ui tokens. The `@source` line lets Tailwind find the classes the components use.

   ```css
   @import "tailwindcss";
   @import "ngx-hr-ui/styles/hr-ui.css";
   @source "../node_modules/ngx-hr-ui";
   ```

2. Add the Material theme to `styles` in `angular.json`:

   ```json
   "styles": ["node_modules/ngx-hr-ui/styles/material-theme.scss", "src/styles.css"]
   ```

3. Provide animations and the English strings in `app.config.ts`:

   ```ts
   import { provideAnimations } from '@angular/platform-browser/animations';
   import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
   import { of } from 'rxjs';
   import en from 'ngx-hr-ui/i18n/en.json';

   export const appConfig = {
     providers: [
       provideAnimations(),
       provideTranslateService({
         fallbackLang: 'en',
         lang: 'en',
         loader: { provide: TranslateLoader, useValue: { getTranslation: () => of(en) } }
       })
     ]
   };
   ```

   This is the ngx-translate 17 setup. Versions 15 and 16 use `TranslateModule.forRoot` with the same loader.
   If your app already uses ngx-translate, merge the keys from `ngx-hr-ui/i18n/en.json` into your own files.

## Choose your colours

The primary colour comes from 2 variables. Set them after the hr-ui import:

```css
:root {
  --hr-primary-hue: 162.5;  /* 0-360, the OKLCH hue. 162.5 is emerald, 189.8 (default) is teal. */
  --hr-primary-chroma: 2;   /* Strength. 1 is the default teal; 2 doubles it. */
}
```

Every shade from `primary-50` to `primary-950` follows, in light and dark mode.
To change one shade only, set its variable, for example `--color-primary-600`.

## Use

```ts
import { ButtonComponent } from 'ngx-hr-ui';

@Component({
  imports: [ButtonComponent],
  template: `<oct-button color="primary" icon="Plus">Add employee</oct-button>`
})
export class Example {}
```

Dark mode: `ThemeService` puts the `dark` class on `<html>`. Use `<oct-theme-controller />` for a ready-made toggle.

## Develop

```sh
npm install
npm start          # docs site on http://localhost:4200
npm test           # library unit tests
npm run build      # package `ngx-hr-ui` in dist/hr-ui
```

Releases: see [RELEASING.md](RELEASING.md).

## License

MIT
