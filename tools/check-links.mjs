/* ═══════════════════════════════════════════════════════════════════
   Ana sayfa bağlantı denetimi

   Üretilen ana sayfaların (index.html / index-en.html) her bağlantısını
   kontrol eder:

     1. Sayfa içi çapa   — hedef id aynı sayfada var mı
     2. İç bağlantı      — dosya diskte var mı (cleanUrls kuralıyla)
     3. Dil tutarlılığı  — Türkçe sayfadan gidilen hedef Türkçe mi, değilse
                           i18n-home.js sözlüğünde karşılığı tanımlı mı
     4. Tekrar           — aynı hedefe giden birden fazla farklı etiket

   Çalıştırma:  node tools/check-links.mjs
   Dış bağlantıları da denetlemek için:  node tools/check-links.mjs --remote

   Çıkış kodu 1 ise kırık bağlantı vardır — yayına almadan önce düzeltilmeli.
   ═══════════════════════════════════════════════════════════════════ */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK_REMOTE = process.argv.includes('--remote');

const PAGES = [
  { file: 'index.html', lang: 'tr', label: '/' },
  { file: 'index-en.html', lang: 'en', label: '/en' },
];

/* i18n-home.js'in Türkçe sözlük tanımladığı yollar. Bu listede olmayan bir
   İngilizce sayfaya Türkçe ana sayfadan link verilirse ziyaretçi İngilizce
   içerik görür. */
function turkishDictPaths() {
  const src = readFileSync(join(ROOT, 'js/i18n-home.js'), 'utf8');
  const block = src.slice(src.indexOf('const DICT_MAP'), src.indexOf('const dict ='));
  return new Set([...block.matchAll(/'(\/[^']*)':/g)].map((m) => m[1]));
}

/* Doğrudan Türkçe yazılmış sayfalar (html lang="tr"). */
function isNativeTurkish(file) {
  try {
    return /<html[^>]*lang="tr"/.test(readFileSync(join(ROOT, file), 'utf8'));
  } catch { return false; }
}

/* vercel.json'daki sabit rewrite ve redirect'ler — /en gibi adreslerin
   diskte kendi dosyası yoktur, yönlendirme üzerinden çözülür. */
function vercelRoutes() {
  const cfg = JSON.parse(readFileSync(join(ROOT, 'vercel.json'), 'utf8'));
  const map = new Map();
  for (const r of [...(cfg.rewrites || []), ...(cfg.redirects || [])]) {
    if (!r.source.includes(':') && !r.has) map.set(r.source, r.destination);
  }
  return map;
}

const routes = vercelRoutes();

/* cleanUrls: /modules → modules.html, /blog → blog/index.html */
function resolveLocal(pathname) {
  const target = routes.get(pathname) ?? pathname;
  const p = target.replace(/^\//, '');
  if (!p) return 'index.html';
  for (const candidate of [`${p}.html`, join(p, 'index.html'), p]) {
    if (existsSync(join(ROOT, candidate))) return candidate;
  }
  return null;
}

/* Bilinçli kabul edilmiş durumlar. Burada listelenenler uyarı üretmez;
   amaç, YENİ bir tutarsızlık çıktığında gürültüye karışmadan görünmesi.
   Bir madde çözülürse (ör. /blog için Türkçe sözlük yazılırsa) buradan sil. */
const ACCEPTED_ENGLISH = new Set([
  '/modules',   // ürün modülleri — Türkçe sözlüğü yok
  '/blog',      // blog dizini İngilizce, yazıların kendi dili karışık
  '/contact',   // iletişim formu İngilizce
]);
const ACCEPTED_DUPLICATE = new Set([
  '/healthcare-clinics',  // Göz/Ophthalmology için ayrı sayfa yok, aynı hub'a gidiyor
]);

const dictPaths = turkishDictPaths();
const problems = [];
const reported = new Set();
const notes = [];
function pushOnce(list, msg) { if (!reported.has(msg)) { reported.add(msg); list.push(msg); } }

for (const page of PAGES) {
  const html = readFileSync(join(ROOT, page.file), 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const seen = new Map();

  for (const m of html.matchAll(/<a\s[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const href = m[1];
    const tag = m[0];
    const label = m[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

    /* Dil anahtarı ve marka bağlantısı doğaları gereği aynı adrese gider —
       tekrar denetiminin dışında tutulur. */
    const isLangSwitch = / hreflang="/.test(tag);
    const isBrand = /class="brand"/.test(tag) || /class="mark"/.test(tag);

    /* 1 — sayfa içi çapa */
    if (href.startsWith('#')) {
      const id = href.slice(1);
      if (!ids.has(id)) pushOnce(problems, `${page.label} · "${label}" → ${href} — bu id sayfada yok`);
      continue;
    }

    /* dış bağlantı */
    if (/^https?:\/\//.test(href)) {
      if (CHECK_REMOTE) pushOnce(notes, `${page.label} · dış: ${href}`);
      continue;
    }
    if (href.startsWith('mailto:') || href.startsWith('tel:')) continue;

    /* 2 — iç bağlantı, dosya var mı */
    const [pathname] = href.split('#');
    const local = resolveLocal(pathname);
    if (!local) {
      pushOnce(problems, `${page.label} · "${label}" → ${href} — hedef dosya yok`);
      continue;
    }

    /* 3 — Türkçe sayfadan gidilen hedefin dili */
    if (page.lang === 'tr' && !isLangSwitch && !isNativeTurkish(local)
        && !dictPaths.has(pathname) && !ACCEPTED_ENGLISH.has(pathname)) {
      pushOnce(notes, `${page.label} · "${label}" → ${pathname} — hedef İngilizce ve i18n sözlüğünde yok`);
    }

    /* 4 — aynı hedefe giden farklı etiketler */
    if (!isLangSwitch && !isBrand && !ACCEPTED_DUPLICATE.has(pathname)) {
      if (seen.has(pathname) && seen.get(pathname) !== label) {
        pushOnce(notes, `${page.label} · "${seen.get(pathname)}" ve "${label}" aynı yere gidiyor: ${pathname}`);
      } else {
        seen.set(pathname, label);
      }
    }
  }
}

console.log(`\nBağlantı denetimi — ${PAGES.map((p) => p.label).join(', ')}\n`);

if (problems.length) {
  console.log('KIRIK (' + problems.length + ')');
  problems.forEach((p) => console.log('  ✗ ' + p));
} else {
  console.log('KIRIK: yok');
}

if (notes.length) {
  console.log('\nDİKKAT (' + notes.length + ')');
  notes.forEach((n) => console.log('  • ' + n));
}

console.log('');
process.exit(problems.length ? 1 : 0);
