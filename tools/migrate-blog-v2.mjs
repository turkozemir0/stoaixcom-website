/* ═══════════════════════════════════════════════════════════════════
   Blog yazılarını v2 tasarımına taşır ve blog dizinini yeniden üretir.

   • Eski yazı (generator etiketi yok) → ayrıştırılır, v2 iskeletiyle
     yeniden yazılır. Başlık, açıklama, canonical, JSON-LD ve metin
     korunur; eski nav/hero/CTA/footer ve yazı tipleri atılır.
   • Taşınmış yazı (generator="stoaix-blog-v2") → dokunulmaz.
   • blog/index.html her çalıştırmada taşınmış yazılardan üretilir.

   Çalıştırma:  node tools/migrate-blog-v2.mjs [--dry] [dosya.html …]
   ═══════════════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parsePost } from './blog/parse-post.mjs';
import { renderPost, refreshFooter, GENERATOR } from './blog/render-post.mjs';
import { renderIndex } from './blog/render-index.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BLOG = join(ROOT, 'blog');
const args = process.argv.slice(2);
const isDry = args.includes('--dry');
const only = args.filter((a) => a.endsWith('.html'));

const isMigrated = (html) => html.includes(`name="generator" content="${GENERATOR}"`);
const plain = (html) => html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

/* Kategori yoksa bilgi satırının ortasındaki parça: "10 dk okuma · Algoloji · STOAIX" */
const cleanLabel = (s) => plain(s).replace(/[|←→]/g, '').trim();
const isNavLabel = (s) => !s || /^blog$/i.test(s) || /stoaix/i.test(s);

function categoryOf(p) {
  const own = cleanLabel(p.hero.category);
  if (!isNavLabel(own)) return own;
  const parts = cleanLabel(p.hero.metaLine).split('·').map((s) => s.trim()).filter(Boolean);
  const mid = parts.find((s) => !isNavLabel(s) && !/okuma|read|\d{4}/i.test(s));
  return mid && mid.length <= 40 ? mid : '';
}

function migrate(file) {
  const path = join(BLOG, file);
  const src = readFileSync(path, 'utf8');
  if (isMigrated(src)) {
    const next = refreshFooter(src);
    if (!isDry && next !== src) writeFileSync(path, next);
    return 'skip';
  }
  const p = parsePost(src);
  const post = {
    ...p,
    canonical: p.canonical || `https://stoaix.com/blog/${file.replace(/\.html$/, '')}`,
    plainH1: plain(p.hero.h1),
    category: categoryOf(p),
    lede: p.hero.lede || p.desc,
  };
  if (!isDry) writeFileSync(path, renderPost(post));
  return 'ok';
}

const files = (only.length ? only : readdirSync(BLOG).filter((f) => f.endsWith('.html') && f !== 'index.html')).sort();
const tally = { ok: 0, skip: 0, fail: [] };
for (const f of files) {
  try { tally[migrate(f)]++; } catch (e) { tally.fail.push(`${f}: ${e.message}`); }
}
console.log(`blog: ${tally.ok} taşındı · ${tally.skip} zaten v2 · ${tally.fail.length} hata${isDry ? ' (deneme)' : ''}`);
tally.fail.forEach((x) => console.log(`  ✗ ${x}`));

if (!isDry && !only.length) {
  const count = renderIndex(BLOG);
  console.log(`blog/index.html: ${count} yazı`);
}
if (tally.fail.length) process.exitCode = 1;
