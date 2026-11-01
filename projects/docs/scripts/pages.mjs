// GitHub Pages has no SPA fallback. A deep link gets 404.html with HTTP 404, so search engines skip it.
// This script writes <route>/index.html for every docs route, with the title and description of that page.
// Run it after `ng build docs`: node projects/docs/scripts/pages.mjs [dist/docs/browser]
import fs from 'node:fs';
import path from 'node:path';

const app = 'projects/docs/src/app';
const dist = process.argv[2] ?? 'dist/docs/browser';
const shell = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const attr = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const pages = [];

// Static pages: the page file of each docs route sets its title and description on <docs-page>.
const routes = fs.readFileSync(`${app}/app.routes.ts`, 'utf8');
for (const [, route, file] of routes.matchAll(/path: '(docs[^':]*)'[^}]*?import\('\.\/([^']+)'\)/g)) {
  const page = fs.readFileSync(`${app}/${file}.ts`, 'utf8').match(/<docs-page\b[^>]*?\stitle="([^"]+)"[^>]*?\sdescription="([^"]+)"/);
  if (!page) throw new Error(`${file}.ts: <docs-page> has no static title and description`);
  pages.push({ route, title: page[1], description: page[2] });
}

// Component pages: the generated list holds each title and description as JSON strings.
const docs = fs.readFileSync(`${app}/generated/component-docs.ts`, 'utf8');
for (const [, slug, title, description] of docs.matchAll(/slug: ("[^"]+"),\s*title: ("(?:[^"\\]|\\.)*"),\s*description: ("(?:[^"\\]|\\.)*")/g)) {
  pages.push({ route: `docs/components/${JSON.parse(slug)}`, title: JSON.parse(title), description: JSON.parse(description) });
}

const components = (docs.match(/^\s+slug: "/gm) ?? []).length;
if (pages.length < components + 8) throw new Error(`Found ${pages.length} pages, expected ${components + 8}. Did a file format change?`);

for (const { route, title, description } of pages) {
  const html = shell
    .replace(/<title>[^<]*<\/title>/, `<title>${attr(title)} · hr-ui</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${attr(description)}">`);
  fs.mkdirSync(path.join(dist, route), { recursive: true });
  fs.writeFileSync(path.join(dist, route, 'index.html'), html);
}
console.log(`pages: ${pages.length} routes`);
