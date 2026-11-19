/* ═══════════════════════════════════════════════════════════════════
   Rehber yazıları kaydı — tools/guides/posts/<id>/<dil>.md

   Her klasör bir konu, içindeki tr.md / en.md / de.md aynı konunun
   o dildeki yazısıdır (çeviri değil, o pazara göre yazılmış sürüm).
   Ön bilgi (frontmatter) basit "anahtar: değer" satırlarıdır:

     slug, cluster, title, desc, h1, category, lede, published, [modified]

   cluster = tools/seo/catalog.mjs içindeki ürün ya da niyet sayfasının id'si.
   topical-map.mjs bu kayıttan okur; slug kuralına uyması gerekmez.
   ═══════════════════════════════════════════════════════════════════ */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const POSTS_DIR = join(dirname(fileURLToPath(import.meta.url)), 'posts');
export const LANGS = ['tr', 'en', 'de'];
const REQUIRED = ['slug', 'cluster', 'title', 'desc', 'h1', 'category', 'lede', 'published'];

export function parseFile(src, where) {
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(src.replace(/\r/g, ''));
  if (!m) throw new Error(`${where}: frontmatter yok`);
  const meta = Object.fromEntries(m[1].split('\n').filter((l) => l.trim()).map((l) => {
    const at = l.indexOf(':');
    return [l.slice(0, at).trim(), l.slice(at + 1).trim()];
  }));
  const missing = REQUIRED.filter((k) => !meta[k]);
  if (missing.length) throw new Error(`${where}: eksik alan ${missing.join(', ')}`);
  return { ...meta, body: m[2].trim() };
}

/* [{ id, versions: { tr: {...}, en: {...}, de: {...} } }] */
export function loadGuides() {
  if (!existsSync(POSTS_DIR)) return [];
  return readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name).sort()
    .map((id) => {
      const versions = {};
      for (const lang of LANGS) {
        const file = join(POSTS_DIR, id, `${lang}.md`);
        if (existsSync(file)) versions[lang] = { lang, ...parseFile(readFileSync(file, 'utf8'), `${id}/${lang}.md`) };
      }
      return { id, versions };
    });
}

export const GUIDE_CLUSTERS = Object.fromEntries(loadGuides()
  .flatMap((g) => Object.values(g.versions).map((v) => [v.slug, v.cluster])));
