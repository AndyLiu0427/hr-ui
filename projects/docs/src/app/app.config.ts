import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import en from '../../../hr-ui/i18n/en.json';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideAnimations(),
    provideTranslateService({
      fallbackLang: 'en',
      lang: 'en',
      loader: { provide: TranslateLoader, useValue: { getTranslation: () => of(en) } }
    })
  ]
};
