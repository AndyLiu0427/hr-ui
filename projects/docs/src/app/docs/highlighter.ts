import type { HighlighterCore } from 'shiki/core';

/** The languages the docs show. `angular-ts` also colors the HTML inside `template:` strings. */
export type CodeLang = 'angular-ts' | 'angular-html' | 'css' | 'shellscript' | 'json';

let highlighter: Promise<HighlighterCore> | undefined;

// Loaded on the first code block, so pages without code never download a grammar.
// The JavaScript regex engine avoids shipping the Oniguruma WASM binary.
function load(): Promise<HighlighterCore> {
  return Promise.all([import('shiki/core'), import('shiki/engine/javascript')]).then(([core, engine]) =>
    core.createHighlighterCore({
      themes: [
        // GitHub's light comment gray (#6e7781) is 4.35:1 on the code background. #656d76 is 5:1.
        import('@shikijs/themes/github-light-default').then(m => JSON.parse(JSON.stringify(m.default).replaceAll('#6e7781', '#656d76'))),
        import('@shikijs/themes/github-dark-default')
      ],
      langs: [
        import('@shikijs/langs/angular-ts'),
        import('@shikijs/langs/angular-html'),
        import('@shikijs/langs/css'),
        import('@shikijs/langs/shellscript'),
        import('@shikijs/langs/json')
      ],
      engine: engine.createJavaScriptRegexEngine()
    })
  );
}

/** Highlighted HTML carrying both themes as CSS variables; styles.css picks one by the html class. */
export async function highlight(code: string, lang: CodeLang): Promise<string> {
  highlighter ??= load();
  const h = await highlighter;
  return h.codeToHtml(code, {
    lang,
    themes: { light: 'github-light-default', dark: 'github-dark-default' },
    defaultColor: false
  });
}
