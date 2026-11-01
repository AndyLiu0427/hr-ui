import { ViewportScroller } from '@angular/common';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { provideHrIcons } from 'ngx-hr-ui';
import { of } from 'rxjs';
import en from '../../../hr-ui/i18n/en.json';
import { routes } from './app.routes';
import { DOCS_ICONS } from './generated/icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })
    ),
    // Anchor links land below the sticky header.
    provideAppInitializer(() => inject(ViewportScroller).setOffset([0, 80])),
    provideAnimations(),
    // Every Lucide icon the site's own code names. The Icons page adds the rest.
    provideHrIcons(DOCS_ICONS),
    provideTranslateService({
      fallbackLang: 'en',
      lang: 'en',
      loader: { provide: TranslateLoader, useValue: { getTranslation: () => of(en) } }
    })
  ]
};
