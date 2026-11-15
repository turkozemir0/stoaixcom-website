/* Teknik denetim: sayfa fotoğrafı (drift), hreflang ve E-E-A-T sinyalleri.
   Drift: her hafta sayfanın SEO kimliği saklanır; bir sonraki hafta farkı bulunur.
   Bilinçsiz bir noindex ya da canonical değişikliği, yayından önce burada yakalanır. */
import { createHash } from 'node:crypto';
import { visibleText } from './site.mjs';

const SITE = 'https://stoaix.com';
/* ISO 639-1 dil (+ ISO 3166 bölge), büyük/küçük harf fark etmez. "en-uk" geçersizdir; doğrusu "en-GB". */
const HREFLANG_RE = /^(x-default|[a-z]{2}(-[a-z]{2})?)$/i;
const BAD_REGIONS = /-(uk|eu)$/i;

const pick = (re, html) => (re.exec(html) || [, null])[1];
const hash = (s) => createHash('sha1').update(s).digest('hex').slice(0, 10);

export function snapshot(html) {
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1].trim());
  const types = [...new Set(jsonLd.join(' ').match(/"@type":\s*"[A-Za-z]+"/g) || [])]
    .map((t) => t.replace(/.*"([A-Za-z]+)"$/, '$1')).sort();
  return {
    title: (pick(/<title>([\s\S]*?)<\/title>/, html) || '').trim(),
    desc: pick(/<meta name="description" content="([^"]*)"/, html) || '',
    canonical: pick(/<link rel="canonical" href="([^"]*)"/, html),
    noindex: /<meta name="robots" content="[^"]*noindex/.test(html),
    h1: visibleText(pick(/<h1[^>]*>([\s\S]*?)<\/h1>/, html) || ''),
    schema: types,
    schemaHash: jsonLd.length ? hash(jsonLd.join('')) : null,
    hreflang: [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => `${m[1]}=${m[2]}`),
  };
}

/* CRITICAL: indekslenmeyi ya da sıralamayı bozar · WARNING: kontrol et · INFO: bilgi */
export function drift(prev = {}, cur = {}) {
  const out = [];
  const add = (level, path, what) => out.push({ level, path, what });
  for (const [path, a] of Object.entries(prev)) {
    const b = cur[path];
    if (!b) { add('CRITICAL', path, "sayfa sitemap'ten düştü"); continue; }
    if (!a.noindex && b.noindex) add('CRITICAL', path, 'noindex eklendi');
    if (a.canonical !== b.canonical) add('CRITICAL', path, `canonical değişti: ${a.canonical} → ${b.canonical}`);
    if (a.h1 && !b.h1) add('CRITICAL', path, 'H1 kayboldu');
    if (a.schema.length && !b.schema.length) add('CRITICAL', path, 'yapılandırılmış veri silindi');
    if (a.title !== b.title) add('WARNING', path, 'başlık değişti');
    if (a.desc !== b.desc) add('WARNING', path, 'açıklama değişti');
    if (a.schemaHash !== b.schemaHash && b.schema.length) add('WARNING', path, 'schema içeriği değişti');
    if (a.hreflang.join() !== b.hreflang.join()) add('WARNING', path, 'hreflang değişti');
  }
  for (const path of Object.keys(cur)) if (!prev[path]) add('INFO', path, 'yeni sayfa');
  return out;
}

const pathOf = (url) => url.replace(/^https?:\/\/(www\.)?stoaix\.com/, '').replace(/\/$/, '') || '/';

/* Her alternatif sayfa: geçerli kod, kendine referans, x-default, dönüş linki, canonical = kendisi */
export function hreflangIssues(snaps) {
  const issues = [];
  for (const [path, s] of Object.entries(snaps)) {
    if (!s.hreflang.length || s.noindex) continue;
    const alts = s.hreflang.map((h) => { const [code, ...rest] = h.split('='); return { code, url: rest.join('=') }; });
    const self = `${SITE}${path === '/' ? '' : path}`;
    const bad = alts.filter((a) => !HREFLANG_RE.test(a.code) || BAD_REGIONS.test(a.code)).map((a) => a.code);
    if (bad.length) issues.push({ path, issue: `geçersiz kod: ${bad.join(', ')}` });
    if (!alts.some((a) => a.url === self || a.url === `${self}/`)) issues.push({ path, issue: 'kendine referans yok' });
    /* x-default önerilir, zorunlu değil: ayrı sayılır */
    if (!alts.some((a) => a.code === 'x-default')) issues.push({ path, issue: 'x-default yok', minor: true });
    if (s.canonical && s.canonical.replace(/\/$/, '') !== self) issues.push({ path, issue: 'hreflang kanonik olmayan sayfada' });
    for (const a of alts) {
      if (a.code === 'x-default') continue;
      const target = snaps[pathOf(a.url)];
      if (!target) issues.push({ path, issue: `${a.code} hedefi sitemap'te yok: ${pathOf(a.url)}` });
      else if (!target.hreflang.some((h) => h.endsWith(`=${self}`) || h.endsWith(`=${self}/`))) {
        issues.push({ path, issue: `${a.code} dönüş linki yok: ${pathOf(a.url)}` });
      }
    }
  }
  return issues;
}

/* YMYL'e yakın (sağlık işletmesi) içerik için: yazar, yazar sayfası, görünür tarih, dürüst güncelleme tarihi */
export function eeat(html) {
  const author = /"author":\s*\{[^}]*"@type":\s*"Person"/.test(html);
  /* Yazarın kendi url'si; iç içe worksFor/publisher url'si sayılmaz */
  const authorBlock = (/"author":\s*\{([\s\S]{0,400})/.exec(html) || [, ''])[1].split(/"(?:worksFor|publisher)"/)[0];
  const authorUrl = /"url":\s*"https?:\/\//.test(authorBlock);
  const published = pick(/"datePublished":\s*"([\d-]+)/, html);
  const modified = pick(/"dateModified":\s*"([\d-]+)/, html);
  return {
    author, authorUrl,
    visibleDate: /<time[^>]+datetime=/.test(html),
    dateOrderOk: !published || !modified || modified >= published,
  };
}

export const orgSameAs = (html) => /"@type":\s*"Organization"[\s\S]{0,800}?"sameAs":\s*\[/.test(html);
