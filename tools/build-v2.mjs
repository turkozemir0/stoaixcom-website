/* ═══════════════════════════════════════════════════════════════════
   STOAIX v2 — statik sayfa üreteci
   Çıktı:  index.html     (TR, /)   — ana pazar Türkçe
           index-en.html  (EN, /en — vercel.json rewrite ile)

   Neden build-time: içerik tek kaynaktan (tools/v2-content.mjs) gelsin,
   ama tarayıcıya tam statik HTML insin. Böylece SEO eksiksiz, JS kapalıyken
   de sayfa okunur ve dil geçişinde içerik titremesi (FOUC) olmaz.

   Çalıştırma:  node tools/build-v2.mjs
   ═══════════════════════════════════════════════════════════════════ */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { CONTENT, LINKS } from './v2-content.mjs';
import { esc, header, ctaSection, siteFooter } from './v2-chrome.mjs';
import { ANALYTICS_SNIPPET } from './site-analytics.mjs';
import { setLang, startsHtml } from '../js/pricing.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://stoaix.com';

/* Ana sayfa yayında: GA + Clarity + Meta Pixel, index.html'deki ile aynı
   gecikmeli yükleme mantığıyla. */
const ANALYTICS = true;

/* Ana sayfa arama motorlarına açık. */
const NOINDEX = false;

/* ─── Konsol panelleri ─────────────────────────────────────────── */
function panelOverview(c) {
  const feedItems = c.feed.map((r) => `
            <div class="item">
              <div class="top"><div class="who">${esc(r.t)}</div><div class="ago">${esc(r.s)}</div></div>
              <div class="msg">${esc(r.m)}</div>
            </div>`).join('');
  return `
      <div class="panel panel-ov on" id="panel-ov" role="tabpanel" aria-labelledby="tab-ov">
        <div class="ov-main">
          <div class="metrics">
            ${c.metrics.map((m) => `<div><div class="l">${esc(m.l)}</div><div class="v">${esc(m.v)}</div></div>`).join('\n            ')}
          </div>
          <div class="ov-table scroll-x">
            <div class="sx">
              <div class="thead g5">
                <div>${esc(c.cols.agent)}</div><div>${esc(c.cols.conv)}</div><div>${esc(c.cols.booked)}</div>
                <div>${esc(c.cols.rate)}</div><div>${esc(c.cols.score)}</div>
              </div>
              ${c.agentRows.map((r) => `
              <div class="trow g5">
                <div style="font-weight:600">${esc(r.n)}</div>
                <div style="color:var(--soft)">${esc(r.c)}</div>
                <div style="color:var(--soft)">${esc(r.b)}</div>
                <div style="color:var(--soft)">${esc(r.r)}</div>
                <div class="score">
                  <div class="bar"><i style="width:${r.s}%"></i></div>
                  <div class="n">${r.s}</div>
                </div>
              </div>`).join('')}
            </div>
          </div>
        </div>
        <div class="feed" data-rotate>
          <div class="fhead">${esc(c.conActivity)}</div>${feedItems}
        </div>
      </div>`;
}

function panelConversations(c) {
  return `
      <div class="panel panel-cv" id="panel-cv" role="tabpanel" aria-labelledby="tab-cv" hidden>
        <div class="feed" data-rotate>
          ${c.feed.map((r) => `
          <div class="item">
            <div class="top"><div class="who">${esc(r.t)}</div><div class="ago">${esc(r.s)}</div></div>
            <div class="msg">${esc(r.m)}</div>
          </div>`).join('')}
        </div>
        <div class="transcript">
          ${c.transcript.map((l) => `
          <div class="line">
            <div class="w">${esc(l.w)}</div>
            <div class="m">${esc(l.m)}</div>
          </div>`).join('')}
        </div>
      </div>`;
}

function panelCampaigns(c) {
  return `
      <div class="panel panel-cm" id="panel-cm" role="tabpanel" aria-labelledby="tab-cm" hidden>
        <div class="tbl-pad scroll-x">
          <div class="sx">
            <div class="thead g-cm">${c.cols.camp.map((x) => `<div>${esc(x)}</div>`).join('')}</div>
            ${c.campaigns.map((r) => `
            <div class="trow cm g-cm">
              <div style="font-weight:600">${esc(r.n)}</div>
              <div style="color:var(--soft)">${esc(r.a)}</div>
              <div style="color:var(--soft)">${esc(r.b)}</div>
              <div style="font-weight:620">${esc(r.c)}</div>
              <div style="color:var(--soft)">${esc(r.d)}</div>
            </div>`).join('')}
          </div>
        </div>
      </div>`;
}

function panelCalendar(c) {
  return `
      <div class="panel panel-cl" id="panel-cl" role="tabpanel" aria-labelledby="tab-cl" hidden>
        <div class="tbl-pad scroll-x">
          <div class="sx">
            <div class="thead g-cl">${c.cols.cal.map((x) => `<div>${esc(x)}</div>`).join('')}</div>
            ${c.calendar.map((r) => `
            <div class="trow cl g-cl">
              <div style="font-weight:620">${esc(r.t)}</div>
              <div style="color:var(--soft)">${esc(r.p)}</div>
              <div class="status">${esc(r.s)}</div>
            </div>`).join('')}
          </div>
        </div>
      </div>`;
}

/* ─── Sayfa ────────────────────────────────────────────────────── */
function homeCalculator(lang) {
  const tr = lang === 'tr';
  const c = tr ? {
    kicker: 'GELİR KAÇAĞI HESAPLAYICISI', heading: 'Masada kalan fırsatı hesaplayın.',
    intro: 'Kendi verilerinizle aylık potansiyel ciroyu görün.', inputs: 'Klinik verileriniz',
    leads: 'Aylık yeni lead', conversion: 'Lead’den hastaya dönüşüm oranı',
    target: 'Hedef dönüşüm oranı', value: 'Hasta başına ortalama tahsilat',
    help: 'Açıklamayı göster', close: 'Bildirimi kapat', currency: 'Para birimi',
    result: 'Masada kalan fırsat', monthly: 'Her ay masada kalabilecek ciro',
    annual: 'Yıllık potansiyel', patients: 'Ek hasta / ay',
    details: 'Hesap nasıl yapılıyor?',
    caution: 'Bu bir senaryo tahminidir; gerçekleşmiş kayıp veya getiri garantisi değildir.',
    method: 'Aylık lead × dönüşüm oranları arasındaki yüzde puan farkı × hasta başına ortalama tahsilat. Yıllık tutar aylık sonucun 12 katıdır; maliyetler dahil değildir.',
    cta: 'Bu açığı birlikte inceleyelim', full: 'Hesaplayıcıyı ayrı sayfada aç',
    fullHref: '/gelir-kaybi-hesaplayici',
  } : {
    kicker: 'REVENUE LEAKAGE CALCULATOR', heading: 'Calculate the opportunity left behind.',
    intro: 'Use your own numbers to estimate potential monthly revenue.', inputs: 'Your clinic numbers',
    leads: 'New leads per month', conversion: 'Lead-to-patient conversion rate',
    target: 'Target conversion rate', value: 'Average amount collected per patient',
    help: 'Show explanation', close: 'Dismiss notification', currency: 'Currency',
    result: 'Opportunity left behind', monthly: 'Potential monthly revenue left on the table',
    annual: 'Annual potential', patients: 'Additional patients / month',
    details: 'How is this calculated?',
    caution: 'This is a scenario estimate, not measured lost revenue or a guaranteed return.',
    method: 'Monthly leads × the percentage point gap between conversion rates × average amount collected per patient. Annual potential is 12 times the monthly amount; costs are excluded.',
    cta: 'Review this gap together', full: 'Open the standalone calculator',
    fullHref: '/revenue-loss-calculator',
  };
  const field = (key, label, value, attrs, currency = false) => `<div class="loss-field">
          <div class="loss-field-label"><label for="${key}">${esc(label)}</label><button id="help-${key}" class="loss-help" type="button" aria-label="${esc(label)}: ${esc(c.help)}">?</button></div>
          <div class="loss-input-row"><input id="${key}" name="${key}" type="number" ${attrs} value="${value}" inputmode="${key === 'leads' ? 'numeric' : 'decimal'}">${currency ? `<select name="currency" aria-label="${esc(c.currency)}"><option value="EUR">EUR</option><option value="TRY">TRY</option><option value="GBP">GBP</option><option value="USD">USD</option></select>` : ''}</div>
        </div>`;
  return `<section class="loss-calculator" id="revenue-calculator" aria-labelledby="loss-heading">
  <div class="loss-inner">
    <div class="loss-intro"><p class="loss-kicker">${esc(c.kicker)}</p><h2 id="loss-heading">${esc(c.heading)}</h2><p>${esc(c.intro)}</p></div>
    <div class="loss-grid">
      <div class="loss-inputs"><h3>${esc(c.inputs)}</h3>
        <form id="loss-form" novalidate><div class="loss-fields">
          ${field('leads', c.leads, 300, 'min="0" max="1000000" step="1"')}
          ${field('conversion', c.conversion, 6, 'min="0" max="100" step="0.1"')}
          ${field('target', c.target, 10, 'min="0" max="100" step="0.1"')}
          ${field('value', c.value, 2500, 'min="0" max="100000000" step="1"', true)}
        </div><p class="loss-error" id="calc-error" role="alert"></p></form>
      </div>
      <div class="loss-results" id="calc-results" aria-live="polite">
        <h3>${esc(c.result)}</h3><p class="loss-rate" id="rate-explainer"></p>
        <p class="loss-result-label">${esc(c.monthly)}</p><strong class="loss-big-number" id="monthly-value"></strong>
        <div class="loss-summary"><div><strong id="annual-value"></strong><span>${esc(c.annual)}</span></div><div><strong id="patient-count"></strong><span>${esc(c.patients)}</span></div></div>
        <a class="loss-cta" href="${LINKS.briefing}" target="_blank" rel="noopener">${esc(c.cta)} →</a>
        <p class="loss-caution">${esc(c.caution)}</p>
        <details class="loss-details"><summary>${esc(c.details)}</summary><p id="formula"></p><p>${esc(c.method)}</p></details>
      </div>
    </div>
    <a class="loss-full-link" href="${c.fullHref}">${esc(c.full)} ↗</a>
  </div>
  <aside class="loss-toast" id="field-toast" role="status" aria-live="polite" hidden>
    <button class="loss-toast-close" id="field-toast-close" type="button" aria-label="${esc(c.close)}">×</button>
    <p class="loss-toast-label" id="field-toast-label"></p><strong class="loss-toast-title" id="field-toast-title"></strong>
    <p class="loss-toast-body" id="field-toast-body"></p><a class="loss-toast-link" id="field-toast-link" hidden></a>
  </aside>
</section>`;
}

/* Metin v2-content.mjs'ten, kartlar ve fiyatlar js/pricing.mjs'ten gelir. */
function homePricing(p, lang) {
  setLang(lang);
  return `
<!-- ═══ FİYATLANDIRMA ═════════════════════════════════════════ -->
<section class="pad price-intro" id="pricing" aria-labelledby="pricing-heading">
  <h2 id="pricing-heading">${esc(p.head)} <em>${esc(p.headEm)}</em></h2>
  <p>${esc(p.body)}</p>
  <span class="guar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>${esc(p.guarantee)}</span>
  <div class="seg" role="group" aria-label="${esc(p.billingLabel)}">
    <button type="button" data-billing="monthly" aria-pressed="true">${esc(p.monthly)}</button>
    <button type="button" data-billing="yearly" aria-pressed="false">${esc(p.yearly)}<span class="off">${esc(p.yearlyOff)}</span></button>
  </div>
  <div class="starts" aria-label="${esc(p.startsLabel)}">${startsHtml({ home: p.href })}</div>
  <a class="starts-more" href="${p.href}#h-prices" data-pricing-link="${p.href}">${esc(p.more)}</a>
</section>
`;
}

function page(lang) {
  const c = CONTENT[lang];
  const isTR = lang === 'tr';
  const selfUrl = isTR ? `${ORIGIN}/` : `${ORIGIN}/en`;
  const enUrl = `${ORIGIN}/en`;
  const trUrl = `${ORIGIN}/`;

  const analytics = ANALYTICS ? ANALYTICS_SNIPPET : '\n<!-- Analytics önizlemede kapalı (tools/build-v2.mjs → ANALYTICS). -->';

  return `<!DOCTYPE html>
<html lang="${c.htmlLang}" class="pal-ink">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(c.title)}</title>
<meta name="description" content="${esc(c.metaDesc)}">
<meta name="author" content="Emir TÜRKÖZ, Ata Ulufer">${NOINDEX ? '\n<meta name="robots" content="noindex, nofollow">' : ''}
<meta name="theme-color" content="#0A0A0B" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#F1EEE8" media="(prefers-color-scheme: light)">
<link rel="icon" type="image/png" href="/assets/images/logo.png">

<link rel="canonical" href="${selfUrl}">
<link rel="alternate" hreflang="en" href="${enUrl}">
<link rel="alternate" hreflang="tr" href="${trUrl}">
<link rel="alternate" hreflang="x-default" href="${trUrl}">

<meta property="og:type" content="website">
<meta property="og:url" content="${selfUrl}">
<meta property="og:title" content="${esc(c.title)}">
<meta property="og:description" content="${esc(c.metaDesc)}">
<meta property="og:image" content="${ORIGIN}/assets/og-image.png">
<meta property="og:site_name" content="STOAIX">
<meta property="og:locale" content="${c.ogLocale}">
<meta property="og:locale:alternate" content="${isTR ? 'en_GB' : 'tr_TR'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(c.title)}">
<meta name="twitter:description" content="${esc(c.metaDesc)}">
<meta name="twitter:image" content="${ORIGIN}/assets/og-image.png">
<meta name="twitter:site" content="@stoaix">

<link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>${isTR ? '\n<link rel="preload" href="/assets/fonts/inter-latin-ext.woff2" as="font" type="font/woff2" crossorigin>' : ''}
<link rel="stylesheet" href="/css/v2.css?v=7">
<link rel="stylesheet" href="/css/revenue-calculator-widget.css?v=1">

<!-- Tema, ilk boyamadan önce uygulanır: koyu/açık geçişinde flaş olmaz. -->
<script>
(function () {
  try {
    var t = localStorage.getItem('stoaix.theme');
    if (t !== 'ink' && t !== 'bone') t = 'ink';           /* varsayılan: 6a ink */
    document.documentElement.className = 'pal-' + t;
  } catch (e) {}
  /* Site genelindeki dil tercihiyle tutarlılık. Kök Türkçe; daha önce İngilizce
     seçmiş ziyaretçi /en görür. Tarayıcı diline göre yönlendirme yok — arama
     motorları kökü Türkçe indeksleyebilsin diye tercih yalnızca kullanıcının. */
  try {
    var lang = localStorage.getItem('stoaix-lang');
    var onTR = ${isTR};
    if (!sessionStorage.getItem('stoaix-home-redirected')) {
      if (lang === 'en' && onTR) {
        sessionStorage.setItem('stoaix-home-redirected', '1');
        location.replace('/en' + location.hash);
      } else if (lang === 'tr' && !onTR) {
        sessionStorage.setItem('stoaix-home-redirected', '1');
        location.replace('/' + location.hash);
      }
    }
  } catch (e) {}
})();
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "STOAIX",
  "alternateName": "STOAIX Ltd",
  "url": "${ORIGIN}",
  "logo": { "@type": "ImageObject", "url": "${ORIGIN}/assets/logo-iconwithname.svg" },
  "description": ${JSON.stringify(c.metaDesc)},
  "email": "hello@stoaix.com",
  "address": { "@type": "PostalAddress", "addressCountry": "GB", "addressLocality": "London" },
  "founder": [
    { "@type": "Person", "name": "Emir TÜRKÖZ", "jobTitle": "CTO" },
    { "@type": "Person", "name": "Ata Ulufer", "jobTitle": "CEO" }
  ],
  "contactPoint": {
    "@type": "ContactPoint", "contactType": "sales",
    "availableLanguage": ["Turkish", "English"]
  },
  "sameAs": [
    "https://www.linkedin.com/company/stoaix-ai",
    "https://www.youtube.com/@stoaix",
    "https://www.instagram.com/stoaix.ai"
  ]
}
</script>

<script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  inLanguage: c.htmlLang,
  mainEntity: c.faq.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}, null, 2)}
</script>${analytics}
</head>
<body>
<a class="skip" href="#main">${esc(c.skip)}</a>

${header(c, lang)}

<main id="main">

<!-- ═══ HERO ══════════════════════════════════════════════════ -->
<section class="hero">
  <div class="hero-head">
    <h1 class="eyebrow">${esc(c.eyebrow)}</h1>
    <div class="proof">${esc(c.proof)}</div>
  </div>
  <!-- Hayalet yığın: tüm daktilo satırları aynı grid hücresinde görünmez durur;
       kutu daima en uzun satırın yüksekliğinde kalır, satır değişiminde sayfa zıplamaz. -->
  <p class="hero-line" aria-hidden="true" data-tw='${JSON.stringify(c.tw).replace(/'/g, '&#39;')}'>
    <span class="tw-stack">${c.tw.map((l) => `<span>${esc(l)}</span>`).join('')}</span>
    <span class="tw-live"><span class="tw">${esc(c.tw[0])}</span><span class="caret">|</span></span>
  </p>
  <div class="hero-grid">
    <p>${esc(c.heroBody)}</p>
    <div class="row hero-actions">
      <a href="${LINKS.briefing}" class="btn" target="_blank" rel="noopener">${esc(c.brief)}</a>
      <a href="#revenue-calculator" class="btn-ghost">${lang === 'tr' ? 'Gelir kaçağını hesaplayın' : 'Calculate revenue opportunity'}</a>
    </div>
  </div>
</section>

<!-- ═══ KONSOL — ürün, üstünde başlık olmadan gösterilir ══════ -->
<section class="console-wrap" id="platform" aria-label="${esc(c.liveConsole)}">
  <p class="vh">${esc(c.conNote)}</p>
  <div class="console">
    <div class="console-bar">
      <div class="meta">
        <div class="dots" aria-hidden="true"><span></span><span></span><span></span></div>
        <div class="ttl">${esc(c.conTitle)}</div>
        <div class="sub">${esc(c.conSub)}</div>
      </div>
      <div class="pill">30d</div>
    </div>
    <div class="tabs" role="tablist">
      ${['ov', 'cv', 'cm', 'cl'].map((k, i) =>
        `<button type="button" role="tab" id="tab-${k}" data-tab="${k}" class="${i === 0 ? 'on' : 'off'}" aria-selected="${i === 0}" aria-controls="panel-${k}">${esc(c.tabs[k])}</button>`
      ).join('\n      ')}
    </div>
${panelOverview(c)}
${panelConversations(c)}
${panelCampaigns(c)}
${panelCalendar(c)}
  </div>
</section>

<!-- ═══ ÜÇ SÜTUN ══════════════════════════════════════════════ -->
<section class="pillars-wrap">
  <div class="pillars">
    ${c.pillars.map((p, i) => `
    <div class="pillar p${i + 1}">
      <div class="ground" aria-hidden="true"></div>
      <div class="veil" aria-hidden="true"></div>
      <div class="copy">
        <div class="n">0${i + 1}</div>
        <h2 class="h">${esc(p.h)}</h2>
        <p class="t" style="margin:0">${esc(p.t)}</p>
      </div>
    </div>`).join('')}
  </div>
</section>

<!-- ═══ GELİR KAÇAĞI HESAPLAYICISI ═════════════════════════════ -->
${homeCalculator(lang)}

<!-- ═══ TEKNİK ŞARTNAME (ters zemin) ══════════════════════════ -->
<section class="alt pad" id="specification">
  <div class="sec-head">
    <h2>${esc(c.nav[1])}</h2>
    <div class="note">${esc(c.specNote)}</div>
  </div>
  <div class="spec-head">
    <div>${esc(c.cols.ref)}</div><div>${esc(c.cols.agent)}</div><div>${esc(c.cols.fn)}</div>
    <div class="r">${esc(c.cols.bench)}</div>
  </div>
  ${c.team.map((a) => `
  <div class="spec-row">
    <div class="ref">${esc(a.r)}</div>
    <div class="agent">${esc(a.n)}</div>
    <div class="fn">${esc(a.d)}</div>
    <div class="bench">${esc(a.m)}</div>
  </div>`).join('')}
</section>

<!-- ═══ ENTEGRASYONLAR (ters zemin) ═══════════════════════════ -->
<section class="alt int" id="integrations">
  <div class="int-intro">
    <h2 class="t">${esc(c.intTitle)}</h2>
    <p class="s" style="margin:0">${esc(c.intSub)}</p>
  </div>
  <div class="marquee" aria-hidden="true">
    <div class="track">
      ${[0, 1].map(() => `<div class="grp">${c.stack.map((s) => `<div class="chip">${esc(s)}</div>`).join('')}</div>`).join('\n      ')}
    </div>
  </div>
  <p class="vh">${esc(c.stack.join(', '))}</p>
</section>

<!-- ═══ DEVREYE ALMA + YÖNETİŞİM ══════════════════════════════ -->
<section class="pad deploy-grid">
  <div id="deployment">
    <h2 class="eyebrow">${esc(c.deployTitle)}</h2>
    ${c.deploy.map((d) => `
    <div class="step">
      <div class="hd">
        <div class="w">${esc(d.w)}</div>
        <h3 class="t">${esc(d.t)}</h3>
      </div>
      <p class="d" style="margin:0">${esc(d.d)}</p>
    </div>`).join('')}
  </div>
  <div id="governance">
    <h2 class="eyebrow">${esc(c.govTitle)}</h2>
    ${c.governance.map((g) => `
    <div class="gov">
      <h3 class="t">${esc(g.t)}</h3>
      <p class="d" style="margin:0">${esc(g.d)}</p>
    </div>`).join('')}
  </div>
</section>

<!-- ═══ KAPSAMA (ters zemin) ══════════════════════════════════ -->
<section class="alt pad" id="footprint">
  <div class="foot-head">
    <h2 class="eyebrow">${esc(c.footTitle)}</h2>
    <div class="meta">${esc(c.footMeta)}</div>
  </div>
  <div class="map-block">
    <div id="map" class="map" role="img" aria-label="${esc(c.mapAlt)}"></div>
    <div class="chips">
      ${c.countries.map((x) => `<div class="chip">${esc(x)}</div>`).join('\n      ')}
    </div>
  </div>
</section>
${homePricing(c.pricing, lang)}
<!-- ═══ SSS ═══════════════════════════════════════════════════ -->
<section class="pad" id="faq">
  <div class="sec-head">
    <h2>${esc(c.faqTitle)}</h2>
    <div class="note">${esc(c.faqNote)}</div>
  </div>
  ${c.faq.map((f) => `
  <div class="faq-row">
    <h3 class="q">${esc(f.q)}</h3>
    <p class="a">${esc(f.a)}</p>
  </div>`).join('')}
</section>

${ctaSection(c)}

</main>

${siteFooter(c, lang)}

<script src="/js/v2.js?v=4" defer></script>
<script src="/js/revenue-loss-calculator.js?v=1" defer></script>
</body>
</html>
`;
}

for (const [lang, file] of [['tr', 'index.html'], ['en', 'index-en.html']]) {
  const out = page(lang);
  writeFileSync(join(ROOT, file), out, 'utf8');
  console.log(`${file.padEnd(12)} ${(out.length / 1024).toFixed(1)} KB`);
}
console.log(`\nanalytics=${ANALYTICS}  noindex=${NOINDEX}`);
