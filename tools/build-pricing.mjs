/* ═══════════════════════════════════════════════════════════════════
   STOAIX — fiyatlandırma sayfası üreteci
   Çıktı:  pricing.html     (TR, /pricing — cleanUrls)
           pricing-en.html  (EN, /en/pricing — vercel.json rewrite ile)

   Veri ve çizim js/pricing.mjs'te; burada aylık başlangıç durumu statik
   basılır. Böylece fiyat tablosu ve SSS arama motoruna ve JS kapalı
   ziyaretçiye tam gider, yapılandırılmış veri de HTML'de hazır olur.

   Çalıştırma:  node tools/build-pricing.mjs
   ═══════════════════════════════════════════════════════════════════ */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { LINKS } from './v2-content.mjs';
import { ANALYTICS_SNIPPET } from './site-analytics.mjs';
import { blocksHtml, categoryDefs, faqHtml, noteText, setLang, startsHtml, structuredData, tableHtml } from '../js/pricing.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const URL_TR = 'https://stoaix.com/pricing';
const URL_EN = 'https://stoaix.com/en/pricing';
const CALL = `href="${LINKS.briefing}" target="_blank" rel="noopener"`;

const TEXT = {
  tr: {
    file: 'pricing.html', url: URL_TR, ogLocale: 'tr_TR', ogAlt: 'en_GB', home: '/',
    title: 'STOAIX Fiyatlandırma',
    desc: 'Pazarlamadan satışa kliniğinizi büyüten tek sistem. Diş, saç ekimi ve estetik klinikleri için yapay zekâ asistanlarının şeffaf fiyatları: yazılı ve sesli seçenekler, CRM ve tüm entegrasyonlar dahil, 30 gün para iade garantisi.',
    menu: 'Ana menü', openMenu: 'Menüyü aç', closeMenu: 'Menüyü kapat', nav: ['Platform', 'AI Asistanlar', 'STOAIX Ads', 'Fiyatlandırma'],
    themeLabel: 'Tema', dark: 'Koyu', light: 'Açık',
    langSwitch: '<a href="/en/pricing" hreflang="en" style="opacity:.45">EN</a><span class="sep">/</span><span>TR</span>',
    brief: 'Tanışma görüşmesi',
    eyebrow: 'Şeffaf fiyatlandırma', h1: 'Pazarlamadan satışa, kliniğinizi büyüten <em>tek sistem.</em>',
    lead: 'Hastayı getiren reklamdan randevuyu teyit eden asistana kadar her adım tek yerde. Fiyatlar açık: ihtiyacınız olanı seçer, yalnızca onun için ödersiniz.',
    guarantee: '30 gün para iade garantisi', billing: 'Ödeme dönemi', monthly: 'Aylık', yearly: 'Yıllık', yearlyOff: '−%20',
    starts: 'Başlangıç fiyatları', more: 'Tüm asistanlar ve dahil olanlar ↓',
    incl: ['CRM dahil', 'Tüm entegrasyonlar dahil', 'Kurulum dahil', 'Taahhüt yok'],
    pricesEye: 'Tüm fiyatlar', pricesH: 'Her asistanın fiyatı ve içindekiler, tek tabloda',
    pricesP: 'Yazılı asistanlar WhatsApp, Instagram ve web sitenizden gelen mesajlara; sesli asistanlar telefon aramalarına bakar. Fiyatlar aylık ve ABD doları cinsindendir.',
    tableLabel: 'Asistan fiyatları ve dahil olanlar',
    teamEye: 'Takımınızı kurun', teamH: 'Kliniğinizin ihtiyacına göre asistanlarınızı seçin',
    teamP: 'Asistanlar üç alanda çalışır: hastayı getirir, gelen hastayı kaçırmaz, tedaviden sonra da elde tutar. Birlikte seçtikçe takım indirimi kendiliğinden uygulanır.',
    teamHint: 'Resepsiyonist, Takip Uzmanı ve Randevu Asistanı birlikte seçildiğinde <b>yazılıda $50, seslide $100</b> takım indirimi uygulanır.',
    faqEye: 'Sık sorulanlar', faqH: 'Fiyatlar hakkında merak edilenler',
    ctaH: 'Kliniğiniz için doğru takımı birlikte seçelim.',
    ctaP: '20 dakikalık görüşmede hasta akışınıza bakar, hangi asistanların fark yaratacağını birlikte belirleriz.',
    ctaBtn: 'Tanışma görüşmesi planla', footer: '© 2026 STOAIX Ltd. · Londra', barBtn: 'Görüşme planla',
  },
  en: {
    file: 'pricing-en.html', url: URL_EN, ogLocale: 'en_GB', ogAlt: 'tr_TR', home: '/en',
    title: 'STOAIX Pricing',
    desc: 'From marketing to sales, your clinic grows on one system. Transparent pricing for AI agents for dental, hair transplant and aesthetic clinics: written and voice options, CRM and all integrations included, 30-day money-back guarantee.',
    menu: 'Main menu', openMenu: 'Open menu', closeMenu: 'Close menu', nav: ['Platform', 'Specification', 'STOAIX Ads', 'Pricing'],
    themeLabel: 'Theme', dark: 'Dark', light: 'Light',
    langSwitch: '<span>EN</span><span class="sep">/</span><a href="/pricing" hreflang="tr" style="opacity:.45">TR</a>',
    brief: 'Request a briefing',
    eyebrow: 'Transparent pricing', h1: 'From marketing to sales, your clinic grows on <em>one system.</em>',
    lead: 'Every step in one place, from the ad that brings the patient to the agent that confirms the appointment. Pricing is open: choose what you need and pay only for that.',
    guarantee: '30-day money-back guarantee', billing: 'Billing period', monthly: 'Monthly', yearly: 'Annual', yearlyOff: '−20%',
    starts: 'Starting prices', more: 'All agents and what’s included ↓',
    incl: ['CRM included', 'All integrations included', 'Setup included', 'No commitment'],
    pricesEye: 'All prices', pricesH: 'Every agent’s price and what’s included, in one table',
    pricesP: 'Written agents handle messages from WhatsApp, Instagram and your website; voice agents handle phone calls. Prices are monthly, in US dollars.',
    tableLabel: 'Agent prices and what’s included',
    teamEye: 'Build your team', teamH: 'Choose the agents your clinic needs',
    teamP: 'Agents work in three areas: they bring patients in, make sure no enquiry is missed, and keep patients after treatment. Select them together and the team discount applies automatically.',
    teamHint: 'When the Receptionist, Follow-up Specialist and Appointment Agent are selected together, a team discount of <b>$50 on written and $100 on voice</b> applies.',
    faqEye: 'FAQ', faqH: 'Common questions about pricing',
    ctaH: 'Let’s choose the right team for your clinic together.',
    ctaP: 'In a 20-minute call we look at your patient flow and work out which agents will make a difference.',
    ctaBtn: 'Book an intro call', footer: '© 2026 STOAIX Ltd. · London', barBtn: 'Book a call',
  },
};

function page(lang) {
  const c = TEXT[lang];
  setLang(lang);
  return `<!DOCTYPE html>
<html lang="${lang}" class="pal-ink">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${c.title}</title>
<meta name="description" content="${c.desc}">
<meta name="theme-color" content="#0A0A0B" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#F1EEE8" media="(prefers-color-scheme: light)">
<link rel="icon" type="image/png" href="/assets/images/logo.png">
<link rel="canonical" href="${c.url}">
<link rel="alternate" hreflang="en" href="${URL_EN}">
<link rel="alternate" hreflang="tr" href="${URL_TR}">
<link rel="alternate" hreflang="x-default" href="${URL_TR}">

<meta property="og:type" content="website">
<meta property="og:url" content="${c.url}">
<meta property="og:title" content="${c.title}">
<meta property="og:description" content="${c.desc}">
<meta property="og:image" content="https://stoaix.com/assets/og-image.png">
<meta property="og:site_name" content="STOAIX">
<meta property="og:locale" content="${c.ogLocale}">
<meta property="og:locale:alternate" content="${c.ogAlt}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${c.title}">
<meta name="twitter:description" content="${c.desc}">
<meta name="twitter:image" content="https://stoaix.com/assets/og-image.png">
<meta name="twitter:site" content="@stoaix">

<link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>${lang === 'tr' ? '\n<link rel="preload" href="/assets/fonts/inter-latin-ext.woff2" as="font" type="font/woff2" crossorigin>' : ''}
<link rel="stylesheet" href="/css/pricing.css?v=2">

<!-- Tema, ilk boyamadan önce uygulanır; tercih ana sayfayla ortak. -->
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
${JSON.stringify(structuredData()).replace(/</g, '\\u003c')}
</script>${ANALYTICS_SNIPPET}
</head>
<body>

<!-- Ortak avatar tanımları -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs id="avatarDefs">
    <linearGradient id="headFill" x1=".25" y1="0" x2=".75" y2="1">
      <stop offset="0" style="stop-color:var(--head-hi)"/><stop offset="1" style="stop-color:var(--head-lo)"/>
    </linearGradient>
    <linearGradient id="bodyFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" style="stop-color:var(--head-hi)"/><stop offset="1" style="stop-color:var(--head-lo)" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="headClip"><path d="M100 30 C129 30 139 54 139 82 C139 110 124 132 100 134 C76 132 61 110 61 82 C61 54 71 30 100 30Z"/></clipPath>
    <filter id="soft" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="3.5"/></filter>${categoryDefs()}
  </defs>
</svg>

<header class="nav gut">
  <a class="brand" href="${c.home}"><span class="mark" aria-hidden="true"></span>STOAIX</a>
  <nav class="nav-links" aria-label="${c.menu}">
    <a href="${c.home}#platform">${c.nav[0]}</a>
    <a href="${c.home}#specification">${c.nav[1]}</a>
    <a href="/stoaix-ads">${c.nav[2]}</a>
    <a href="#top" class="on" aria-current="page">${c.nav[3]}</a>
  </nav>
  <div class="nav-right">
    <span class="switch" role="group" aria-label="${c.themeLabel}"><button type="button" id="th-dark" data-set-theme="ink" aria-pressed="true">${c.dark}</button><span class="sep">/</span><button type="button" id="th-light" data-set-theme="bone" aria-pressed="false">${c.light}</button></span>
    <span class="switch lang">${c.langSwitch}</span>
    <a class="nav-cta" ${CALL}>${c.brief}</a>
    <button type="button" class="nav-burger" aria-label="${c.openMenu}" aria-expanded="false" aria-controls="mnav">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h18M2 11h18M2 16h18"/></svg>
    </button>
  </div>
</header>

<div class="mnav" id="mnav" hidden>
  <div class="mnav-top">
    <span class="brand"><span class="mark" aria-hidden="true"></span>STOAIX</span>
    <button type="button" class="nav-burger" data-close style="display:block" aria-label="${c.closeMenu}">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4l14 14M18 4L4 18"/></svg>
    </button>
  </div>
  <a class="mlink" href="${c.home}#platform">${c.nav[0]}</a>
  <a class="mlink" href="${c.home}#specification">${c.nav[1]}</a>
  <a class="mlink" href="/stoaix-ads">${c.nav[2]}</a>
  <a class="mlink" href="#top" aria-current="page">${c.nav[3]}</a>
  <div class="mnav-switches"><span class="switch">${c.langSwitch}</span></div>
  <div class="mnav-foot"><a class="btn" ${CALL}>${c.brief}</a></div>
</div>

<main id="top">
  <section class="hero gut">
    <span class="eyebrow">${c.eyebrow}</span>
    <h1>${c.h1}</h1>
    <p>${c.lead}</p>
    <span class="guar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>${c.guarantee}</span>
    <div class="seg" role="group" aria-label="${c.billing}">
      <button type="button" id="bill-m" data-billing="monthly" aria-pressed="true">${c.monthly}</button>
      <button type="button" id="bill-y" data-billing="yearly" aria-pressed="false">${c.yearly}<span class="off">${c.yearlyOff}</span></button>
    </div>
    <div class="starts" id="starts" aria-label="${c.starts}">${startsHtml()}</div>
    <a class="starts-more" href="#h-prices">${c.more}</a>
    <div class="incl">${c.incl.map((x) => `<span>${x}</span>`).join('')}</div>
  </section>

  <section class="sec gut" aria-labelledby="h-prices">
    <div class="wrap">
      <div class="sec-h">
        <span class="eyebrow">${c.pricesEye}</span>
        <h2 id="h-prices">${c.pricesH}</h2>
        <p>${c.pricesP}</p>
      </div>
      <div class="pt" id="priceTable" role="table" aria-label="${c.tableLabel}">${tableHtml()}</div>
      <p class="pt-note" id="ptNote">${noteText()}</p>
    </div>
  </section>

  <section class="sec gut" aria-labelledby="h-team">
    <div class="wrap">
      <div class="sec-h">
        <span class="eyebrow">${c.teamEye}</span>
        <h2 id="h-team">${c.teamH}</h2>
        <p>${c.teamP}</p>
        <div class="seg" role="group" aria-label="${c.billing}">
          <button type="button" data-billing="monthly" aria-pressed="true">${c.monthly}</button>
          <button type="button" data-billing="yearly" aria-pressed="false">${c.yearly}<span class="off">${c.yearlyOff}</span></button>
        </div>
      </div>
      <div class="blocks" id="blocks">${blocksHtml()}</div>
      <p class="team-hint">${c.teamHint}</p>
    </div>
  </section>

  <section class="sec gut" aria-labelledby="h-faq">
    <div class="sec-h">
      <span class="eyebrow">${c.faqEye}</span>
      <h2 id="h-faq">${c.faqH}</h2>
    </div>
    <div class="faq" id="faq">${faqHtml()}</div>
  </section>

  <section class="cta">
    <div class="inner gut">
      <h2>${c.ctaH}</h2>
      <p>${c.ctaP}</p>
      <a class="btn" ${CALL}>${c.ctaBtn}</a>
    </div>
  </section>
</main>

<footer class="footer gut">
  <span class="brand" style="font-size:15px"><span class="mark" style="width:20px;height:20px" aria-hidden="true"></span>STOAIX</span>
  <span>${c.footer}</span>
</footer>

<div class="tbar gut" id="tbar" hidden>
  <div class="faces" id="tbarFaces"></div>
  <div class="who"><div class="t" id="tbarNames"></div><div class="s" id="tbarNote"></div></div>
  <div class="sum"><div class="v num" id="tbarTotal"></div><div class="s num" id="tbarSub"></div></div>
  <a class="btn" ${CALL}>${c.barBtn}</a>
</div>

<script type="module" src="/js/pricing.mjs?v=3"></script>
</body>
</html>
`;
}

for (const lang of ['tr', 'en']) {
  const out = page(lang);
  writeFileSync(join(ROOT, TEXT[lang].file), out, 'utf8');
  console.log(`${TEXT[lang].file.padEnd(16)} ${(out.length / 1024).toFixed(1)} KB`);
}
