/* ═══════════════════════════════════════════════════════════════════
   Rehber yazılarını üretir: tools/guides/posts/<id>/<dil>.md → blog/<slug>.html

   • Aynı konunun dilleri birbirine hreflang ile bağlanır (x-default: en, yoksa tr).
   • "## Sık sorulan sorular" bölümü FAQPage verisine dönüşür.
   • Sayfa v2 blog iskeletiyle yazılır (generator=stoaix-blog-v2), bu yüzden
     migrate-blog-v2 ona dokunmaz; yalnız küme kutusunu ve dizini ekler.
   • Elle yazılmış bir blog dosyasının üstüne asla yazmaz.

   Çalıştırma:  node tools/build-guides.mjs [--check]
   ═══════════════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadGuides } from './guides/registry.mjs';
import { toHtml, faqOf, plainWords } from './guides/markdown.mjs';
import { renderPost, ORIGIN } from './blog/render-post.mjs';
import { byId } from './seo/catalog.mjs';
import { esc } from './v2-chrome.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BLOG = join(ROOT, 'blog');
const isCheck = process.argv.includes('--check');
const MARK = 'stoaix-guide';
const WORDS_PER_MINUTE = 200;
const HTML_LANG = { tr: 'tr', en: 'en', de: 'de' };

const urlOf = (v) => `${ORIGIN}/blog/${v.slug}`;

function alternatesOf(guide) {
  const vs = Object.values(guide.versions);
  if (vs.length < 2) return [];
  const xDefault = guide.versions.en || guide.versions.tr;
  return [...vs.map((v) => ({ hreflang: HTML_LANG[v.lang], href: urlOf(v) })), { hreflang: 'x-default', href: urlOf(xDefault) }];
}

function faqLd(v) {
  const faq = faqOf(v.body);
  if (!faq.length) return [];
  return [{
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: HTML_LANG[v.lang],
    mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }];
}

function render(guide, v) {
  const html = renderPost({
    lang: v.lang,
    htmlLang: HTML_LANG[v.lang],
    title: v.title,
    desc: v.desc,
    canonical: urlOf(v),
    alternates: alternatesOf(guide),
    ld: faqLd(v),
    published: v.published,
    modified: v.modified || v.published,
    readMinutes: Math.max(1, Math.round(plainWords(v.body) / WORDS_PER_MINUTE)),
    category: v.category,
    lede: v.lede,
    hero: { h1: esc(v.h1) },
    plainH1: v.h1,
    content: toHtml(v.body),
    css: '',
  });
  return html.replace(/(<meta name="generator"[^>]*>)/, `$1\n<meta name="${MARK}" content="${guide.id}">`);
}

function validate(guide, v, seen) {
  const where = `${guide.id}/${v.lang}.md`;
  if (!byId(v.cluster)) throw new Error(`${where}: bilinmeyen küme "${v.cluster}"`);
  if (seen.has(v.slug)) throw new Error(`${where}: slug tekrar ediyor "${v.slug}"`);
  seen.add(v.slug);
  const file = join(BLOG, `${v.slug}.html`);
  if (existsSync(file) && !readFileSync(file, 'utf8').includes(`name="${MARK}"`)) {
    throw new Error(`${where}: blog/${v.slug}.html elle yazılmış bir yazı, üstüne yazılmaz`);
  }
  if (v.title.length > 70) console.warn(`  ! ${where}: başlık ${v.title.length} karakter (>70)`);
  if (v.desc.length > 165) console.warn(`  ! ${where}: açıklama ${v.desc.length} karakter (>165)`);
}

/* /blog/<slug> bağlantısı ya bir rehbere ya da var olan bir blog dosyasına gitmeli */
function deadBlogLinks(guide, v, slugs) {
  return [...v.body.matchAll(/\]\(\/blog\/([a-z0-9-]+)\)/g)]
    .map((m) => m[1])
    .filter((s) => !slugs.has(s) && !existsSync(join(BLOG, `${s}.html`)))
    .map((s) => `${guide.id}/${v.lang}.md → /blog/${s}`);
}

const guides = loadGuides();
const seen = new Set();
const slugs = new Set(guides.flatMap((g) => Object.values(g.versions).map((v) => v.slug)));
const dead = [];
let count = 0;
for (const g of guides) {
  for (const v of Object.values(g.versions)) {
    validate(g, v, seen);
    dead.push(...deadBlogLinks(g, v, slugs));
    if (!isCheck) writeFileSync(join(BLOG, `${v.slug}.html`), render(g, v));
    count++;
  }
}
if (dead.length) throw new Error(`rehberlerde hedefi olmayan blog bağlantısı:\n  ${dead.join('\n  ')}`);
console.log(`rehberler: ${guides.length} konu, ${count} yazı${isCheck ? ' (kontrol)' : ' yazıldı'}`);
