# hr-ui docs site

The site at https://andyliu0427.github.io/hr-ui/. Run it with `npm start` from the repo root.

## Add or change a component page

1. Write the examples. One standalone component per file, default export:
   `src/app/examples/<slug>/<slug>-<name>.ts`. The Code tab shows the whole file, so keep it short
   and use realistic HR or payroll data.
2. Write the page content in `src/app/content/components/<slug>.ts`. It exports `doc: ComponentDoc`
   (see `src/app/docs/types.ts`). The first example is the hero preview.
3. Describe each input and output with a `/** ... */` comment in the library source. The API
   Reference table reads those comments.
4. Run `npm run docs:gen`. It checks that every example a page names exists, and rebuilds
   `src/app/generated/` (examples registry, API data, page index). `npm start` and
   `npm run build:docs` run it for you.

The sidebar, ⌘K search and previous/next links pick up a new page by themselves.

## How the pieces fit

- `scripts/generate.mjs` reads the examples, the content files and the library source.
- `src/app/docs/` holds the site frame (`docs-layout`), page frame (`docs-page`), code blocks
  (`docs-code`, Shiki loaded on first use), preview/code tabs (`docs-example`), API tables
  (`docs-api`) and "On this page" (`toc`).
- `src/app/pages/` holds the guides (Installation, Theming, Dark mode), foundations (Colors,
  Typography, Icons) and the generic `component-page`.
