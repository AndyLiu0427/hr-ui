import { Location } from '@angular/common';
import { assertInInjectionContext, effect, inject, InjectionToken, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export interface UrlCodec<T> {
  parse(raw: string): T;
  serialize(value: T, initial: T): string | null;
}

/** False for a page shown inside another page: its state then lives in memory only. */
export const URL_STATE_ENABLED = new InjectionToken<boolean>('URL_STATE_ENABLED', { factory: () => true });

export function urlSignal<T>(param: string, initial: T, codec: UrlCodec<T>): WritableSignal<T> {
  assertInInjectionContext(urlSignal);
  if (!inject(URL_STATE_ENABLED)) {
    return signal(initial);
  }
  const route = inject(ActivatedRoute);
  const location = inject(Location);

  const raw = route.snapshot.queryParamMap.get(param);
  const initialValue = raw !== null ? codec.parse(raw) : initial;
  const sig = signal<T>(initialValue);

  effect(() => {
    const serialized = codec.serialize(sig(), initial);
    // Use URL constructor with dummy base to parse path/query/hash robustly
    const url = new URL(location.path(true), 'http://_');

    if (serialized === null) {
      url.searchParams.delete(param);
    } else {
      url.searchParams.set(param, serialized);
    }

    location.replaceState(url.pathname + url.search + url.hash);
  });

  return sig;
}

function arraysEqual<T>(a: readonly T[], b: readonly T[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export const urlCodecs = {
  string: (): UrlCodec<string> => ({
    parse: raw => raw,
    serialize: (v, initial) => (v === initial ? null : v)
  }),

  number: (): UrlCodec<number> => ({
    parse: raw => Number(raw),
    serialize: (v, initial) => (v === initial ? null : String(v))
  }),

  stringArray: <T extends string = string>(sep = ','): UrlCodec<T[]> => ({
    parse: raw => (raw === '' ? [] : (raw.split(sep) as T[])),
    serialize: (v, initial) => (arraysEqual(v, initial) ? null : v.join(sep))
  })
};
