/* ═══════════════════════════════════════════════════════════════════
   Blog yazısı ve blog dizini — v2 sayfa iskeleti
   Ana sayfa ve şirket sayfalarıyla aynı nav, CTA ve footer; açık tema sabit.
   ═══════════════════════════════════════════════════════════════════ */

import { CONTENT } from '../v2-content.mjs';
import { esc, header, ctaSection, siteFooter, footer } from '../v2-chrome.mjs';
import { ANALYTICS_SNIPPET } from '../site-analytics.mjs';
import { MARKETS, uiFor } from '../seo/markets.mjs';
import { PRODUCTS, contentFor, pathFor } from '../seo/catalog.mjs';

export const ORIGIN = 'https://stoaix.com';
export const GENERATOR = 'stoaix-blog-v2';
const ldJson = (data) => JSON.stringify(data, null, 2).replace(/</g, '\\u003c');

export const COPY = {
  tr: {
    blog: 'Blog', home: 'Ana sayfa', crumbs: 'Sayfa yolu', readTime: (n) => `${n} dk okuma`,
    published: 'Yayın', updated: 'Güncelleme', locale: 'tr-TR',
  },
  en: {
    blog: 'Blog', home: 'Home', crumbs: 'Breadcrumb', readTime: (n) => `${n} min read`,
    published: 'Published', updated: 'Updated', locale: 'en-GB',
  },
  de: {
    blog: 'Ratgeber', home: 'Startseite', crumbs: 'Brotkrümelnavigation', readTime: (n) => `${n} Min. Lesezeit`,
    published: 'Veröffentlicht', updated: 'Aktualisiert', locale: 'de-DE',
  },
};

/* Almanca yazılar: ana sitenin DE sürümü yok; nav/footer DE pazar sayfalarıyla aynı (markets.mjs) */
export const langOf = (html) => (/<html lang="de/.test(html) ? 'de' : /<html lang="en/.test(html) ? 'en' : 'tr');
const chromeFor = (lang) => (lang === 'de' ? { ...CONTENT.en, ...MARKETS.de.chrome } : CONTENT[lang]);
const ogImage = (lang) => `${ORIGIN}/assets/${lang === 'tr' ? 'og-image.png' : 'og-image-en.png'}`;

const fmtDate = (iso, lang) => new Date(`${iso}T12:00:00Z`).toLocaleDateString(COPY[lang].locale, { day: 'numeric', month: 'long', year: 'numeric' });
const homeOf = (lang) => (lang === 'tr' ? '/' : lang === 'de' ? MARKETS.de.home : '/en');

/* ─── Ortak iskelet ───────────────────────────────────────────── */
/* Dil düğmesi: sayfanın diğer dildeki karşılığı varsa ona, yoksa o dilin ana sayfasına */
function langHrefs(alternates) {
  const path = (lang) => {
    const a = alternates.find((x) => x.hreflang.toLowerCase().startsWith(lang));
    return a ? a.href.replace(ORIGIN, '') || '/' : null;
  };
  return { en: path('en') || '/en', tr: path('tr') || '/' };
}

/* Üç dilli yazıda (DE karşılığı olan ya da kendisi DE) anahtar EN / DE / TR */
function langList(lang, alternates) {
  const hrefs = Object.fromEntries(alternates.map((a) => [a.hreflang.toLowerCase().slice(0, 2), a.href.replace(ORIGIN, '') || '/']));
  if (lang !== 'de' && !hrefs.de) return null;
  return [['en', '/en'], ['de', MARKETS.de.home], ['tr', '/']]
    .map(([code, home]) => ({ code, label: code.toUpperCase(), href: hrefs[code] || home, on: code === lang }));
}

export function pageHead({ lang, htmlLang, title, desc, canonical, alternates = [], robots, ogType = 'article', ld = [], extraCss = '', sheets = [], published, modified }) {
  const c = chromeFor(lang);
  const og = ogImage(lang);
  return `<!DOCTYPE html>
<html lang="${esc(htmlLang)}" class="pal-bone">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="generator" content="${GENERATOR}">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">${robots ? `\n<meta name="robots" content="${esc(robots)}">` : ''}
<meta name="theme-color" content="#F1EEE8">
<link rel="icon" type="image/png" href="/assets/images/logo.png">
<link rel="canonical" href="${canonical}">
${alternates.map((a) => `<link rel="alternate" hreflang="${esc(a.hreflang)}" href="${esc(a.href)}">`).join('\n')}

<meta property="og:type" content="${ogType}">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="STOAIX">
<meta property="og:locale" content="${c.ogLocale}">${published ? `\n<meta property="article:published_time" content="${published}">` : ''}${modified ? `\n<meta property="article:modified_time" content="${modified}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${og}">

<link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>${lang !== 'en' ? '\n<link rel="preload" href="/assets/fonts/inter-latin-ext.woff2" as="font" type="font/woff2" crossorigin>' : ''}
<link rel="stylesheet" href="/css/v2.css?v=7">
<link rel="stylesheet" href="/css/company.css?v=1">
<link rel="stylesheet" href="/css/blog.css?v=2">${sheets.map((h) => `\n<link rel="stylesheet" href="${h}">`).join('')}${extraCss ? `\n<style>\n${extraCss}\n</style>` : ''}
${ld.map((x) => `\n<script type="application/ld+json">\n${ldJson(x)}\n</script>`).join('')}${ANALYTICS_SNIPPET}
</head>
<body class="theme-locked">
<a class="skip" href="#main">${esc(c.skip)}</a>

${header(c, lang, { base: lang === 'de' ? MARKETS.de.anchorBase : homeOf(lang), brandHref: homeOf(lang), langHref: langHrefs(alternates), langs: langList(lang, alternates) })}

<main id="main">
`;
}

/* DE footer: DE pazar sayfalarındaki gibi Platform / Lösungen / Unternehmen */
function deFooter() {
  const c = chromeFor('de');
  const products = PRODUCTS.filter((p) => p.id !== 'crm');
  const cols = [c.footerCols[0], { h: uiFor('de').hub, items: products.map((p) => contentFor(p, 'de').name) }, c.footerCols[2]];
  const links = [['#specification', '#revenue-calculator', '#integrations', '#governance'], products.map((p) => pathFor(p, 'de')), ['/en/about', '/en/contact']];
  return footer({ ...c, footerCols: cols }, 'de', { base: MARKETS.de.anchorBase, links });
}
const footerFor = (lang) => (lang === 'de' ? deFooter() : siteFooter(CONTENT[lang], lang, { base: homeOf(lang) }));

export function pageTail(lang, { ctaHead } = {}) {
  const c = chromeFor(lang);
  return `
${ctaSection(ctaHead ? { ...c, ctaHead } : c)}
</main>

${footerFor(lang)}

<script src="/js/v2.js?v=4" defer></script>
</body>
</html>
`;
}

/* Taşınmış sayfanın footer'ını güncel şablonla değiştirir (göç bir kez yapılır,
   footer değişiklikleri sonraki derlemelerde bu yolla sayfalara ulaşır). */
const FOOTER_RE = /<!-- ═══ FOOTER[\s\S]*?<\/footer>/;
export function refreshFooter(html) {
  return html.replace(FOOTER_RE, () => footerFor(langOf(html)));
}

export function crumbs(lang, items) {
  return `<nav class="crumbs" aria-label="${esc(COPY[lang].crumbs)}">
    ${items.map((x, i) => (i === items.length - 1
    ? `<span aria-current="page">${esc(x.name)}</span>`
    : `<a href="${x.href}">${esc(x.name)}</a>`)).join('<span class="sl" aria-hidden="true">/</span>')}
  </nav>`;
}

/* ─── Yazı ────────────────────────────────────────────────────── */
/* section: ara halka. Blog yazısında Blog; kök sayfalarda yok (null). */
function crumbItems(post) {
  const t = COPY[post.lang];
  const section = post.section === undefined ? { name: t.blog, href: '/blog' } : post.section;
  return [
    { name: t.home, href: homeOf(post.lang) },
    ...(section ? [section] : []),
    { name: post.plainH1, href: post.canonical },
  ];
}

function structuredData(post) {
  const items = crumbItems(post);
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((x, i) => ({
      '@type': 'ListItem', position: i + 1, name: x.name, item: x.href.startsWith('http') ? x.href : ORIGIN + x.href,
    })),
  };
  const kept = post.ld.filter((x) => x['@type'] !== 'BreadcrumbList');
  if (post.hasArticleLd || post.section === null) return [...kept, breadcrumb];
  const article = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.plainH1,
    description: post.desc,
    inLanguage: post.htmlLang,
    mainEntityOfPage: post.canonical,
    image: ogImage(post.lang),
    ...(post.published ? { datePublished: post.published, dateModified: post.modified } : {}),
    author: post.author || { '@type': 'Organization', name: 'STOAIX', url: ORIGIN },
    publisher: { '@type': 'Organization', name: 'STOAIX', url: ORIGIN, logo: { '@type': 'ImageObject', url: `${ORIGIN}/assets/images/logo.png` } },
  };
  return [...kept, article, breadcrumb];
}

function metaLine(post) {
  const t = COPY[post.lang];
  const parts = [];
  if (post.published) parts.push(`${t.published}: <time datetime="${post.published}">${fmtDate(post.published, post.lang)}</time>`);
  if (post.modified && post.modified !== post.published) parts.push(`${t.updated}: <time datetime="${post.modified}">${fmtDate(post.modified, post.lang)}</time>`);
  if (post.readMinutes) parts.push(esc(t.readTime(post.readMinutes)));
  return parts.length ? `<p class="post-meta-line">${parts.map((p) => `<span>${p}</span>`).join('')}</p>` : '';
}

/* Geniş tablolar dar ekranda yatay kaysın */
const wrapTables = (html) => html.replace(/<table\b[\s\S]*?<\/table>/g, (t) => `<div class="tbl-scroll">${t}</div>`);

export function renderPost(post) {
  return `${pageHead({ ...post, ld: structuredData(post), extraCss: post.css })}
<!-- ═══ HERO ══════════════════════════════════════════════════ -->
<section class="hero page-hero post-hero">
  ${crumbs(post.lang, crumbItems(post))}
  ${post.category ? `<div class="hero-head">\n    <p class="eyebrow">${esc(post.category)}</p>\n  </div>` : ''}
  <h1 class="page-title">${post.hero.h1}</h1>
  ${post.lede ? `<div class="hero-grid">\n    <p>${esc(post.lede)}</p>\n  </div>` : ''}
  ${metaLine(post)}
</section>

<!-- ═══ YAZI ══════════════════════════════════════════════════ -->
<section class="pad post-wrap">
  <article class="prose legacy">
${wrapTables(post.content)}
  </article>
</section>
${pageTail(post.lang)}`;
}
