import { describe, expect, it } from 'vitest';

import en from '../../i18n/en.json';
import zhTw from '../../i18n/zh-tw.json';

type Messages = { [key: string]: string | Messages };

/** Every text as a dotted key, such as COMMON.SELECT_ALL. */
function flatten(messages: Messages, prefix = ''): Map<string, string> {
  const texts = new Map<string, string>();
  for (const [key, value] of Object.entries(messages)) {
    if (typeof value === 'string') texts.set(prefix + key, value);
    else flatten(value, `${prefix}${key}.`).forEach((text, path) => texts.set(path, text));
  }
  return texts;
}

const paramsOf = (text = ''): string[] => [...text.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map(match => match[1]);

describe('i18n files', () => {
  const english = flatten(en);
  const chinese = flatten(zhTw);

  it('have the same keys in English and Traditional Chinese', () => {
    expect([...chinese.keys()].sort()).toEqual([...english.keys()].sort());
  });

  it('keep every {{param}} of the English text in the Chinese text', () => {
    for (const [key, text] of english) {
      expect(paramsOf(chinese.get(key)), key).toEqual(expect.arrayContaining(paramsOf(text)));
    }
  });
});
