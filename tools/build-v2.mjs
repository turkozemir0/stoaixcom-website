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

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://stoaix.com';

/* Ana sayfa yayında: GA + Clarity + Meta Pixel, index.html'deki ile aynı
   gecikmeli yükleme mantığıyla. */
const ANALYTICS = true;

/* Ana sayfa arama motorlarına açık. */
const NOINDEX = false;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Marka işareti — gerçek marka formu. Handoff'un SVG'si kendi PNG'sinden
   farklı çizilmişti (yapraklar ters yönde), o yüzden PNG esas alındı.
   Tema başına iki dosya; görünürlüğü CSS yönetir. */
const MARK = (size) =>
  `<span class="mark" style="width:${size}px;height:${size}px" aria-hidden="true"></span>`;

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
function page(lang) {
  const c = CONTENT[lang];
  const isTR = lang === 'tr';
  const selfUrl = isTR ? `${ORIGIN}/` : `${ORIGIN}/en`;
  const enUrl = `${ORIGIN}/en`;
  const trUrl = `${ORIGIN}/`;
  const navIds = ['platform', 'specification', 'deployment', 'governance', 'footprint'];

  const analytics = ANALYTICS ? `
<!-- Analytics: ilk kullanıcı etkileşiminde VEYA en geç ~3.5sn (idle) yüklenir. -->
<script>
(function () {
  var loaded = false;
  function loadAnalytics() {
    if (loaded) return; loaded = true;
    var g = document.createElement('script'); g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=G-53TMTQML2Q';
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); } window.gtag = gtag;
    gtag('js', new Date()); gtag('config', 'G-53TMTQML2Q');
    (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","wnyyri0jrz");
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1426016022664547'); fbq('track', 'PageView');
  }
  var evs = ['scroll','mousemove','touchstart','pointerdown','keydown','click'];
  function onFirst(){ evs.forEach(function(e){ window.removeEventListener(e, onFirst, {passive:true}); }); loadAnalytics(); }
  evs.forEach(function(e){ window.addEventListener(e, onFirst, {passive:true}); });
  if ('requestIdleCallback' in window) requestIdleCallback(loadAnalytics, { timeout: 3500 });
  else setTimeout(loadAnalytics, 3500);
})();
</script>` : '\n<!-- Analytics önizlemede kapalı (tools/build-v2.mjs → ANALYTICS). -->';

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
<link rel="stylesheet" href="/css/v2.css?v=2">

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

<!-- ═══ NAV ═══════════════════════════════════════════════════ -->
<header class="nav">
  <a class="brand" href="/">${MARK(24)}STOAIX</a>
  <nav class="nav-links" aria-label="${esc(c.nav.join(', '))}">
    ${c.nav.map((n, i) => `<a href="#${navIds[i]}">${esc(n)}</a>`).join('\n    ')}
  </nav>
  <div class="nav-right">
    <span class="switch" role="group" aria-label="${esc(c.themeLabel)}">
      <button type="button" data-theme="ink" class="on" aria-pressed="true">${esc(c.dark)}</button><span class="sep" aria-hidden="true">/</span><button type="button" data-theme="bone" class="off" aria-pressed="false">${esc(c.light)}</button>
    </span>
    <span class="switch" role="group" aria-label="${esc(c.langLabel)}">
      <a href="/en" hreflang="en" class="${isTR ? 'off' : 'on'}"${isTR ? '' : ' aria-current="true"'}>EN</a><span class="sep" aria-hidden="true">/</span><a href="/" hreflang="tr" class="${isTR ? 'on' : 'off'}"${isTR ? ' aria-current="true"' : ''}>TR</a>
    </span>
    <a class="nav-cta" href="${LINKS.briefing}" target="_blank" rel="noopener">${esc(c.brief)}</a>
    <button type="button" class="nav-burger" aria-label="${esc(c.menu)}" aria-expanded="false" aria-controls="mnav">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 6h18M2 11h18M2 16h18"/></svg>
    </button>
  </div>
</header>

<!-- ═══ MOBİL MENÜ ════════════════════════════════════════════ -->
<div class="mnav" id="mnav" hidden>
  <div class="mnav-top">
    <span class="brand">${MARK(24)}STOAIX</span>
    <button type="button" class="nav-burger" data-close style="display:block" aria-label="${esc(c.close)}">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4l14 14M18 4L4 18"/></svg>
    </button>
  </div>
  ${c.nav.map((n, i) => `<a class="mlink" href="#${navIds[i]}">${esc(n)}</a>`).join('\n  ')}
  <div class="mnav-switches">
    <span class="switch" role="group" aria-label="${esc(c.themeLabel)}">
      <button type="button" data-theme="ink" class="on" aria-pressed="true">${esc(c.dark)}</button><span class="sep" aria-hidden="true">/</span><button type="button" data-theme="bone" class="off" aria-pressed="false">${esc(c.light)}</button>
    </span>
    <span class="switch" role="group" aria-label="${esc(c.langLabel)}">
      <a href="/en" hreflang="en" class="${isTR ? 'off' : 'on'}">EN</a><span class="sep" aria-hidden="true">/</span><a href="/" hreflang="tr" class="${isTR ? 'on' : 'off'}">TR</a>
    </span>
  </div>
  <div class="mnav-foot">
    <a class="btn" href="${LINKS.briefing}" target="_blank" rel="noopener">${esc(c.brief)}</a>
    <a class="btn-ghost" href="${LINKS.console}">${esc(c.explore)}</a>
    <a href="${LINKS.login}" style="font-size:13.5px;color:var(--soft)">${esc(c.login)}</a>
  </div>
</div>

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
      <a href="${LINKS.console}" class="btn-ghost">${esc(c.explore)}</a>
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
<section class="alt pad" id="record">
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

<!-- ═══ CTA ═══════════════════════════════════════════════════
     id="cta": site genelinde 60'tan fazla sayfa bu çapaya bağlanıyor. -->
<section class="cta" id="cta">
  <div class="media" aria-hidden="true"></div>
  <div class="veil" aria-hidden="true"></div>
  <div class="inner">
    <h2>${esc(c.ctaHead)}</h2>
    <div>
      <div class="row">
        <a href="${LINKS.briefing}" class="btn" target="_blank" rel="noopener">${esc(c.brief)}</a>
        <a href="${LINKS.sales}" class="btn-ghost" target="_blank" rel="noopener">${esc(c.sales)}</a>
      </div>
      <div class="leaders">
        ${c.leaders.map((l) => `
        <div>
          <div class="n">${esc(l.n)}</div>
          <div class="r">${esc(l.r)}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</section>

</main>

<!-- ═══ FOOTER ════════════════════════════════════════════════ -->
<footer class="footer">
  <div>
    <span class="brand">${MARK(20)}STOAIX</span>
    <div class="copy">${esc(c.copyright)}</div>
  </div>
  <div class="footer-cols">
    ${c.footerCols.map((f, ci) => `
    <div>
      <h4>${esc(f.h)}</h4>
      ${f.items.map((item, ii) => `<a href="${LINKS.footer[lang][ci][ii]}">${esc(item)}</a>`).join('\n      ')}
    </div>`).join('')}
  </div>
</footer>

<script src="/js/v2.js?v=2" defer></script>
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
