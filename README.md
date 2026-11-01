# hr-ui

Angular components for HR and payroll apps.
Forms, tables, dialogs, and Tailwind 4 design tokens, with light and dark themes.

**Docs and live demos:** https://andyliu0427.github.io/hr-ui/

## Install

```sh
npm install hr-ui @angular/cdk @angular/material @ngx-translate/core lucide-angular tailwindcss @tailwindcss/postcss
```

Requires Angular 22 and Tailwind 4.

`lucide-angular` does not list Angular 22 as a peer yet. Add this to your `package.json` so npm accepts it:

```json
"overrides": {
  "lucide-angular": { "@angular/core": "$@angular/core", "@angular/common": "$@angular/common" }
}
```

## Set up

1. Import the tokens in your global CSS. The `@source` line lets Tailwind find the classes the components use.

   ```css
   @import "hr-ui/styles/hr-ui.css";
   @source "../node_modules/hr-ui";
   ```

2. Add the Material theme to `styles` in `angular.json`:

   ```json
   "styles": ["node_modules/hr-ui/styles/material-theme.scss", "src/styles.css"]
   ```

3. Provide animations and the English strings in `app.config.ts`:

   ```ts
   import { importProvidersFrom } from '@angular/core';
   import { provideAnimations } from '@angular/platform-browser/animations';
   import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
   import { of } from 'rxjs';
   import en from 'hr-ui/i18n/en.json';

   export const appConfig = {
     providers: [
       provideAnimations(),
       importProvidersFrom(
         TranslateModule.forRoot({
           defaultLanguage: 'en',
           loader: { provide: TranslateLoader, useValue: { getTranslation: () => of(en) } }
         })
       )
     ]
   };
   ```

   If your app already uses ngx-translate, merge the keys from `hr-ui/i18n/en.json` into your own files.

## Use

```ts
import { ButtonComponent } from 'hr-ui';

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
npm run build      # library package in dist/hr-ui
```

Releases: see [RELEASING.md](RELEASING.md).

## License

MIT
