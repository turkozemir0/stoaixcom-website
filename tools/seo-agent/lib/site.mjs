/* Site okuyucu: sitemap'teki her sayfayı diskten okur, iç link grafiğini kurar,
   ana sayfadan tıklama derinliğini hesaplar. Ağ yok; yalnız repodaki HTML. */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const HOST_RE = /^(?:www\.)?stoaix\.com$/;

/* Her biçimi tek yola indirger: "/x.html", "https://stoaix.com/x/" → "/x" */
export function normalizeHref(href, fromPath = '/') {
  try {
    const u = new URL(href, `https://stoaix.com${fromPath}`);
    if (!HOST_RE.test(u.hostname)) return null;
    const p = u.pathname.replace(/\.html$/, '').replace(/\/index$/, '').replace(/\/$/, '');
    return p || '/';
  } catch {
    return null;
  }
}

export const visibleText = (html) => html
  .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

/* <main> içi; yoksa tüm gövde. Nav/footer metni içerik ölçümünü bozmasın diye. */
export const mainHtml = (html) => (/<main[^>]*>([\s\S]*?)<\/main>/.exec(html) || [, html])[1];

/* vercel.json'daki birebir yeniden yazımlar (/en → /index-en); joker kurallar atlanır */
function rewrites(root) {
  try {
    const { rewrites: list = [] } = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
    return new Map(list.filter((r) => !r.has && !r.source.includes(':')).map((r) => [r.source, r.destination]));
  } catch {
    return new Map();
  }
}

function fileFor(root, path, aliases = new Map()) {
  const target = aliases.get(path) || path;
  const base = target === '/' ? '/index' : target;
  return [`${base}.html`, `${base}/index.html`].map((f) => join(root, f)).find(existsSync) || null;
}

export function loadSite(root) {
  const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  const pages = new Map();
  const missing = [];
  const aliases = rewrites(root);
  for (const url of urls) {
    const path = normalizeHref(url);
    const file = path && fileFor(root, path, aliases);
    if (!file) { missing.push(url); continue; }
    const html = readFileSync(file, 'utf8');
    const links = new Set([...html.matchAll(/href="([^"#]+)"/g)]
      .map((m) => normalizeHref(m[1], path))
      .filter((p) => p && p !== path));
    pages.set(path, { path, file, html, links });
  }
  return { pages, missing };
}

/* Ana sayfadan BFS: { path → tıklama sayısı }; ulaşılamayan sayfa haritada yok */
export function clickDepth(pages, start = '/') {
  const depth = new Map([[start, 0]]);
  const queue = [start];
  while (queue.length) {
    const cur = queue.shift();
    for (const next of pages.get(cur)?.links || []) {
      if (!depth.has(next) && pages.has(next)) {
        depth.set(next, depth.get(cur) + 1);
        queue.push(next);
      }
    }
  }
  return depth;
}

export function inboundCounts(pages) {
  const counts = new Map();
  for (const page of pages.values()) {
    for (const l of page.links) counts.set(l, (counts.get(l) || 0) + 1);
  }
  return counts;
}
