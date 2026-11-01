import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';
import en from './i18n/en.json';

// Every spec gets the English texts the library ships, so a spec can assert what a user reads.
// It sits outside src, so the library build never includes it.
export default [
  provideTranslateService({ fallbackLang: 'en', lang: 'en', loader: { provide: TranslateLoader, useValue: { getTranslation: () => of(en) } } })
];
