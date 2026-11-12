/* ═══════════════════════════════════════════════════════════════════
   STOAIX — ürün ve pazar sayfaları üreteci (SEO / GEO)
   Çıktı:  her ürün × 4 pazar
             TR     /<slug>            → <slug>.html
             EN/UK  /en/<slug>         → en/<slug>.html
             AU     /en-au/<slug>      → en-au/<slug>.html
             DE     /de/<slug>         → de/<slug>.html
           + her pazar için asistanlar sayfası (hub)

   Vercel dosya sistemini rewrite'lardan önce kontrol eder; bu yüzden
   en/<slug>.html gibi gerçek dosyalar /en/:path* kuralına takılmadan
   kendi adresinde sunulur.

   Tasarım ana sayfayla aynı: v2.css + company.css (sayfa başlığı, ızgara)
   + seo.css (tablo, SSS, soru-cevap düzeni). İçerik raw HTML'de durur;
   yapay zekâ tarayıcıları JavaScript çalıştırmaz.

   🔴 İÇERİK KURALI: fiyatlar js/pricing.mjs'ten gelir, elle yazılmaz.
   Uydurma müşteri, vaka ya da istatistik yok. Mevzuat metinleri genel
   bilgidir (tools/seo/markets.mjs).

   Çalıştırma:  node tools/build-seo.mjs
   ═══════════════════════════════════════════════════════════════════ */

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { LINKS } from './v2-content.mjs';
import { esc, header, ctaSection, footer } from './v2-chrome.mjs';
import { ANALYTICS_SNIPPET } from './site-analytics.mjs';
import { PRICE_DATA } from '../js/pricing.mjs';
import { MARKETS, MARKET_ORDER, ORIGIN, UPDATED, RULES, uiFor } from './seo/markets.mjs';
import { PRODUCTS, HUB, contentFor, pathFor, urlFor, fileFor, allPages } from './seo/catalog.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const EXT = 'target="_blank" rel="noopener"';
const ORG_ID = `${ORIGIN}/#organization`;
const NUM_LOCALE = { en: 'en-GB', de: 'de-DE', tr: 'tr-TR' };

const money = (n, lang) => `$${n.toLocaleString(NUM_LOCALE[lang], { maximumFractionDigits: 2, minimumFractionDigits: n % 1 ? 2 : 0 })}`;
/* UK ve AU: USD fiyatın yanında yaklaşık yerel karşılık (markets.mjs → local) */
const LOCAL_STEP = 5;
const approx = (n, local) => (n < 1 ? (n * local.rate).toFixed(2) : String(Math.round((n * local.rate) / LOCAL_STEP) * LOCAL_STEP));
const price = (n, m, unit = '') => {
  const { lang, local } = MARKETS[m];
  return local ? `${money(n, lang)}${unit} (≈ ${local.sym}${Number(approx(n, local)).toLocaleString(NUM_LOCALE[lang], { minimumFractionDigits: n < 1 ? 2 : 0 })})` : `${money(n, lang)}${unit}`;
};
const ldJson = (data) => JSON.stringify(data, null, 2).replace(/</g, '\\u003c');

/* ─── Fiyat ──────────────────────────────────────────────────────── */
function priceRows(item, m) {
  if (!item.price) return [];
  const ui = uiFor(m);
  const lang = MARKETS[m].lang;
  const c = contentFor(item, m);
  const agent = PRICE_DATA.agents.find((a) => a.id === item.price.agent);
  if (!agent) throw new Error(`${item.id}: js/pricing.mjs içinde "${item.price.agent}" yok`);
  return item.price.options.map((k) => {
    const opt = agent.opts.find((o) => o.k === k);
    if (!opt) throw new Error(`${item.id}: "${item.price.agent}" için "${k}" seçeneği yok`);
    const label = (c.optionLabels && c.optionLabels[k]) || ui[{ text: 'written', voice: 'voice', mix: 'mix' }[k]];
    const included = (c.included && c.included[k])
      || (k === 'text' ? `${PRICE_DATA.includedMessages.toLocaleString(NUM_LOCALE[lang])} ${ui.messages}`
        : `${PRICE_DATA.includedMinutes.toLocaleString(NUM_LOCALE[lang])} ${ui.minutes}`);
    const overage = k === 'text' ? `${price(PRICE_DATA.overage.message, m)} ${ui.perMessage}`
      : k === 'voice' ? `${price(PRICE_DATA.overage.minute, m)} ${ui.perMinute}` : '—';
    return { k, label, monthly: opt.price, annual: opt.price * (1 - PRICE_DATA.annualDiscount), included, overage };
  });
}
const fromPrice = (item) => {
  if (!item.price) return null;
  const agent = PRICE_DATA.agents.find((a) => a.id === item.price.agent);
  return Math.min(...agent.opts.filter((o) => item.price.options.includes(o.k)).map((o) => o.price));
};

/* ─── Yapılandırılmış veri ───────────────────────────────────────── */
function crumbList(item, m) {
  const ui = uiFor(m);
  const list = [{ name: ui.home, url: ORIGIN + (MARKETS[m].home === '/' ? '/' : MARKETS[m].home) }];
  if (item !== HUB) list.push({ name: ui.hub, url: urlFor(HUB, m) });
  list.push({ name: contentFor(item, m).name, url: urlFor(item, m) });
  /* AU ve DE'de ana sayfa hub'ın kendisi; aynı adres iki kez yazılmaz. */
  return list.filter((x, i) => list.findIndex((y) => y.url === x.url) === i);
}

function structuredData(item, m) {
  const c = contentFor(item, m);
  const M = MARKETS[m];
  const self = urlFor(item, m);
  const graph = [
    {
      '@type': 'Organization', '@id': ORG_ID, name: 'STOAIX', legalName: 'STOAIX Ltd', url: ORIGIN,
      logo: `${ORIGIN}/assets/logo-iconwithname.svg`, email: 'hello@stoaix.com',
      sameAs: ['https://find-and-update.company-information.service.gov.uk/company/17131250'],
    },
    {
      '@type': 'WebPage', '@id': `${self}#webpage`, url: self, name: c.title, description: c.desc,
      inLanguage: M.hreflang, dateModified: UPDATED, isPartOf: { '@type': 'WebSite', url: ORIGIN, name: 'STOAIX' },
      breadcrumb: { '@id': `${self}#breadcrumb` },
    },
    {
      '@type': 'BreadcrumbList', '@id': `${self}#breadcrumb`,
      itemListElement: crumbList(item, m).map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, item: x.url })),
    },
  ];
  if (item !== HUB) {
    const rows = priceRows(item, m);
    graph.push({
      '@type': 'Service', '@id': `${self}#service`, name: c.serviceName || c.name, serviceType: c.serviceType,
      description: c.lede, provider: { '@id': ORG_ID }, url: self,
      areaServed: M.areaServed.map((code) => ({ '@type': 'Country', name: code })),
      audience: { '@type': 'BusinessAudience', audienceType: c.audience },
      ...(rows.length ? { offers: rows.map((r) => ({
        '@type': 'Offer', name: `${c.name} — ${r.label}`, price: r.monthly, priceCurrency: 'USD', url: self,
        priceSpecification: { '@type': 'UnitPriceSpecification', price: r.monthly, priceCurrency: 'USD', unitText: 'MONTH' },
      })) } : {}),
    });
  }
  if (c.faq && c.faq.length) {
    graph.push({
      '@type': 'FAQPage', '@id': `${self}#faq`,
      mainEntity: c.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

/* ─── Sayfa iskeleti ─────────────────────────────────────────────── */
function langLinks(item, m) {
  return MARKET_ORDER.map((k) => ({ code: MARKETS[k].hreflang, label: MARKETS[k].label, href: pathFor(item, k), on: k === m }));
}

function head(item, m) {
  const c = contentFor(item, m);
  const M = MARKETS[m];
  const self = urlFor(item, m);
  const og = `${ORIGIN}/assets/${M.lang === 'tr' ? 'og-image.png' : 'og-image-en.png'}`;
  return `<!DOCTYPE html>
<html lang="${M.hreflang}" class="pal-ink">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(c.title)}</title>
<meta name="description" content="${esc(c.desc)}">
<meta name="theme-color" content="#0A0A0B" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#F1EEE8" media="(prefers-color-scheme: light)">
<link rel="icon" type="image/png" href="/assets/images/logo.png">
<link rel="canonical" href="${self}">
${MARKET_ORDER.map((k) => `<link rel="alternate" hreflang="${MARKETS[k].hreflang}" href="${urlFor(item, k)}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${urlFor(item, 'en')}">

<meta property="og:type" content="website">
<meta property="og:url" content="${self}">
<meta property="og:title" content="${esc(c.title)}">
<meta property="og:description" content="${esc(c.desc)}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="STOAIX">
<meta property="og:locale" content="${M.ogLocale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(c.title)}">
<meta name="twitter:description" content="${esc(c.desc)}">
<meta name="twitter:image" content="${og}">

<link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>${M.lang === 'en' ? '' : '\n<link rel="preload" href="/assets/fonts/inter-latin-ext.woff2" as="font" type="font/woff2" crossorigin>'}
<link rel="stylesheet" href="/css/v2.css?v=7">
<link rel="stylesheet" href="/css/company.css?v=1">
<link rel="stylesheet" href="/css/seo.css?v=1">

<script>
(function () {
  try {
    var t = localStorage.getItem('stoaix.theme');
    if (t !== 'ink' && t !== 'bone') t = 'ink';
    document.documentElement.className = 'pal-' + t;
  } catch (e) {}
})();
</script>

<script type="application/ld+json">
${ldJson(structuredData(item, m))}
</script>${ANALYTICS_SNIPPET}
</head>
<body>
<a class="skip" href="#main">${esc(M.chrome.skip)}</a>

${header(M.chrome, M.lang, { base: M.anchorBase, brandHref: M.home, langs: langLinks(item, m) })}

<main id="main">
`;
}

/* Footer: Platform sütunu ana sayfa çapalarına, ikinci sütun bu pazarın
   asistan sayfalarına, Şirket sütunu Hakkımızda/İletişim'e gider. */
function pageFooter(m) {
  const M = MARKETS[m];
  const base = M.chrome.footerCols || MARKETS.en.chrome.footerCols;
  const products = PRODUCTS.filter((p) => p.id !== 'crm');
  const cols = [
    base[0],
    { h: uiFor(m).hub, items: products.map((p) => contentFor(p, m).name) },
    base[2],
  ];
  const company = M.lang === 'tr' ? ['/about', '/contact'] : ['/en/about', '/en/contact'];
  const links = [
    ['#specification', '#revenue-calculator', '#integrations', '#governance'],
    products.map((p) => pathFor(p, m)),
    company,
  ];
  return footer({ ...M.chrome, footerCols: cols }, M.lang, { base: M.anchorBase === '/' ? '/' : M.anchorBase, links });
}

function tail(m) {
  return `
</main>

${pageFooter(m)}

<script src="/js/v2.js?v=4" defer></script>
</body>
</html>
`;
}

/* ─── Bölümler ───────────────────────────────────────────────────── */
function crumbsNav(item, m) {
  const list = crumbList(item, m);
  return `<nav class="crumbs" aria-label="${esc(uiFor(m).crumbs)}">
    ${list.map((x, i) => (i === list.length - 1
    ? `<span aria-current="page">${esc(x.name)}</span>`
    : `<a href="${x.url.replace(ORIGIN, '')}">${esc(x.name)}</a>`)).join('<span class="sl" aria-hidden="true">/</span>')}
  </nav>`;
}

function hero(item, m) {
  const c = contentFor(item, m);
  const ui = uiFor(m);
  const M = MARKETS[m];
  const from = fromPrice(item);
  const proof = from ? ui.fromPrice(`${price(from, m, ui.perMonth)}`) : ui.freeCrm;
  return `
<!-- ═══ HERO ══════════════════════════════════════════════════ -->
<section class="hero page-hero">
  ${crumbsNav(item, m)}
  <div class="hero-head">
    <p class="eyebrow">${esc(c.eyebrow)}</p>
    <div class="proof">${esc(c.proof || proof)}</div>
  </div>
  <h1 class="page-title">${esc(c.h1)}</h1>
  <div class="hero-grid">
    <p>${esc(c.lede)}</p>
    <div class="row hero-actions">
      <a class="btn" href="${LINKS.briefing}" ${EXT}>${esc(ui.brief)}</a>
      <a class="btn-ghost" href="${M.pricing}">${esc(ui.allPrices)}</a>
    </div>
  </div>
  <p class="updated">${esc(ui.updated)}: <time datetime="${UPDATED}">${UPDATED}</time></p>
</section>
`;
}

function factsSection(item, m) {
  const c = contentFor(item, m);
  const ui = uiFor(m);
  const lang = MARKETS[m].lang;
  const from = fromPrice(item);
  const rows = [
    [ui.price, from ? ui.fromPrice(`${price(from, m, ui.perMonth)}`) : ui.freeCrm],
    ...(c.facts || []),
  ];
  return `
<!-- ═══ KISACA ═════════════════════════════════════════════════ -->
<section class="pad facts-wrap">
  <h2 class="vh">${esc(ui.facts)}</h2>
  <dl class="facts">
    ${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n    ')}
  </dl>
</section>
`;
}

/* Soru başlıklı bölüm: başlık solda, ilk cümlesi soruyu yanıtlayan metin sağda. */
function qaSection(h, paras, { alt = false, extra = '' } = {}) {
  return `
<section class="pad${alt ? ' alt' : ''}">
  <div class="qa">
    <h2>${esc(h)}</h2>
    <div class="qa-body">
      ${paras.map((p) => `<p>${esc(p)}</p>`).join('\n      ')}${extra}
    </div>
  </div>
</section>
`;
}

function stepsSection(item, m) {
  const c = contentFor(item, m);
  if (!c.steps) return '';
  return `
<!-- ═══ NASIL ÇALIŞIR ══════════════════════════════════════════ -->
<section class="pad alt">
  <div class="sec-head">
    <h2>${esc(c.howH || uiFor(m).howH)}</h2>
  </div>
  <ol class="principles steps-list">
    ${c.steps.map((s, i) => `<li class="step">
      <div class="hd"><span class="w">${String(i + 1).padStart(2, '0')}</span><span class="t">${esc(s.t)}</span></div>
      <p class="d">${esc(s.d)}</p>
    </li>`).join('\n    ')}
  </ol>
</section>
`;
}

function priceSection(item, m) {
  const c = contentFor(item, m);
  const ui = uiFor(m);
  const lang = MARKETS[m].lang;
  const rows = priceRows(item, m);
  const table = rows.length ? `
      <div class="scroll-x"><table class="tbl sx">
        <thead><tr><th scope="col">${esc(ui.option)}</th><th scope="col">${esc(ui.monthly)}</th><th scope="col">${esc(ui.annual)}</th><th scope="col">${esc(ui.included)}</th><th scope="col">${esc(ui.overage)}</th></tr></thead>
        <tbody>
          ${rows.map((r) => `<tr><th scope="row">${esc(r.label)}</th><td>${price(r.monthly, m, esc(ui.perMonth))}</td><td>${price(r.annual, m, esc(ui.perMonth))}</td><td>${esc(r.included)}</td><td>${esc(r.overage)}</td></tr>`).join('\n          ')}
        </tbody>
      </table></div>
      <p class="fine">${esc(ui.priceNote)}${MARKETS[m].local ? ` ${esc(MARKETS[m].local.note)}` : ''}${item.price && item.price.trio ? ` ${esc(ui.trio(PRICE_DATA.trioDiscount.text, PRICE_DATA.trioDiscount.voice))}` : ''}${item.price && item.price.adBudget ? ` ${esc(ui.adBudget)}` : ''}</p>
      <p><a class="more" href="${MARKETS[m].pricing}">${esc(ui.pricingLink)}</a></p>` : '';
  return `
<!-- ═══ FİYAT ══════════════════════════════════════════════════ -->${qaSection(c.priceH, c.priceText, { extra: table })}`;
}

function compareSection(item, m) {
  const c = contentFor(item, m);
  if (!c.compare) return '';
  const { h, intro, cols, rows } = c.compare;
  return `
<!-- ═══ KARŞILAŞTIRMA ═════════════════════════════════════════ -->
<section class="pad alt">
  <div class="qa">
    <h2>${esc(h)}</h2>
    <div class="qa-body">
      <p>${esc(intro)}</p>
      <div class="scroll-x"><table class="tbl sx cmp">
        <thead><tr><th scope="col"></th>${cols.map((x) => `<th scope="col">${esc(x)}</th>`).join('')}</tr></thead>
        <tbody>
          ${rows.map(([k, ...v]) => `<tr><th scope="row">${esc(k)}</th>${v.map((x) => `<td>${esc(x)}</td>`).join('')}</tr>`).join('\n          ')}
        </tbody>
      </table></div>
    </div>
  </div>
</section>
`;
}

function usesSection(item, m) {
  const c = contentFor(item, m);
  if (!c.uses) return '';
  return `
<!-- ═══ KULLANIM ═══════════════════════════════════════════════ -->
<section class="pad">
  <div class="sec-head">
    <h2>${esc(c.useH || uiFor(m).useH)}</h2>
  </div>
  <div class="uses">
    ${c.uses.map((u) => `<div class="gov"><h3 class="t">${esc(u.t)}</h3><p class="d">${esc(u.d)}</p></div>`).join('\n    ')}
  </div>
</section>
`;
}

function localSection(item, m) {
  const c = contentFor(item, m);
  const ui = uiFor(m);
  const rules = (item.rules || []).map((k) => RULES[m][k]);
  if (!rules.length) return '';
  const h = c.localH || (m === 'au' ? 'Rules and systems in Australia' : m === 'en' ? 'Rules and systems in the UK' : ui.localH);
  return `
<!-- ═══ YEREL KURALLAR ═════════════════════════════════════════ -->
<section class="pad alt">
  <div class="sec-head">
    <h2>${esc(h)}</h2>
    <div class="note">${esc(ui.legal)}</div>
  </div>
  <div class="uses">
    ${rules.map((r) => `<div class="gov"><h3 class="t">${esc(r.t)}</h3><p class="d">${esc(r.d)}</p></div>`).join('\n    ')}
  </div>
</section>
`;
}

function faqSection(item, m) {
  const c = contentFor(item, m);
  if (!c.faq) return '';
  return `
<!-- ═══ SSS ════════════════════════════════════════════════════ -->
<section class="pad" id="faq">
  <div class="sec-head">
    <h2>${esc(uiFor(m).faqH)}</h2>
  </div>
  ${c.faq.map(([q, a]) => `<div class="faq-row">
    <h3 class="q">${esc(q)}</h3>
    <p class="a">${esc(a)}</p>
  </div>`).join('\n  ')}
</section>
`;
}

function cardsSection(h, items, m, { alt = true } = {}) {
  const ui = uiFor(m);
  const lang = MARKETS[m].lang;
  return `
<section class="pad${alt ? ' alt' : ''} related">
  <div class="sec-head">
    <h2>${esc(h)}</h2>
  </div>
  <div class="channels">
    ${items.map((p) => {
    const pc = contentFor(p, m);
    const from = fromPrice(p);
    return `<a class="ch" href="${pathFor(p, m)}">
      <span class="t">${esc(pc.name)}</span>
      <span class="d">${esc(pc.card)}</span>
      <span class="go">${esc(from ? ui.fromPrice(`${price(from, m, ui.perMonth)}`) : ui.freeCrm)} →</span>
    </a>`;
  }).join('\n    ')}
  </div>
</section>
`;
}

/* ─── Sayfalar ───────────────────────────────────────────────────── */
function productPage(item, m) {
  const c = contentFor(item, m);
  const related = item.related.map((id) => PRODUCTS.find((p) => p.id === id));
  return head(item, m)
    + hero(item, m)
    + factsSection(item, m)
    + `\n<!-- ═══ NEDİR ══════════════════════════════════════════════════ -->${qaSection(c.whatH, c.what)}`
    + stepsSection(item, m)
    + priceSection(item, m)
    + compareSection(item, m)
    + usesSection(item, m)
    + localSection(item, m)
    + faqSection(item, m)
    + cardsSection(uiFor(m).relatedH, related, m)
    + `\n${ctaSection(MARKETS[m].chrome)}\n`
    + tail(m);
}

function hubPage(m) {
  const c = contentFor(HUB, m);
  const groups = c.groups.map((g) => cardsSection(g.h, g.ids.map((id) => PRODUCTS.find((p) => p.id === id)), m, { alt: g.alt }));
  return head(HUB, m)
    + hero(HUB, m)
    + `\n<!-- ═══ NEDİR ══════════════════════════════════════════════════ -->${qaSection(c.whatH, c.what)}`
    + groups.join('')
    + localSection(HUB, m)
    + faqSection(HUB, m)
    + `\n${ctaSection(MARKETS[m].chrome)}\n`
    + tail(m);
}

/* Basit içerik denetimi: başlık ve açıklama uzunluğu, eksik alan. */
function lint(item, m) {
  const c = contentFor(item, m);
  const where = `${item.id}/${m}`;
  for (const k of ['name', 'title', 'desc', 'h1', 'lede', 'eyebrow', 'whatH', 'what']) {
    if (!c[k]) throw new Error(`${where}: "${k}" eksik`);
  }
  if (item !== HUB && !c.priceH) throw new Error(`${where}: "priceH" eksik`);
  const warn = [];
  if (c.title.length > 65) warn.push(`title ${c.title.length} karakter`);
  if (c.desc.length > 165) warn.push(`desc ${c.desc.length} karakter`);
  if (m === 'tr' && /\bajan|agent\b/i.test(JSON.stringify(c))) warn.push('"ajan/agent" geçiyor');
  return warn.length ? `  ! ${where}: ${warn.join(', ')}` : null;
}

const warnings = [];
for (const page of allPages()) {
  const { item, m } = page;
  const w = lint(item, m);
  if (w) warnings.push(w);
  const out = item === HUB ? hubPage(m) : productPage(item, m);
  const file = fileFor(item, m);
  mkdirSync(dirname(join(ROOT, file)), { recursive: true });
  writeFileSync(join(ROOT, file), out, 'utf8');
}
console.log(`SEO sayfaları: ${allPages().length} dosya (${PRODUCTS.length} ürün + hub × ${MARKET_ORDER.length} pazar)`);
if (warnings.length) console.log(warnings.join('\n'));
