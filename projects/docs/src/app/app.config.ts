import { ViewportScroller } from '@angular/common';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import en from '../../../hr-ui/i18n/en.json';
import { routes } from './app.routes';

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
    provideTranslateService({
      fallbackLang: 'en',
      lang: 'en',
      loader: { provide: TranslateLoader, useValue: { getTranslation: () => of(en) } }
    })
  ]
};
