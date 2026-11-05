/* ═══════════════════════════════════════════════════════════════════
   STOAIX — fiyatlandırma sayfası üreteci
   Çıktı:  pricing.html (TR, /pricing — cleanUrls)

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
import { blocksHtml, categoryDefs, faqHtml, noteText, startsHtml, structuredData, tableHtml } from '../js/pricing.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const URL_SELF = 'https://stoaix.com/pricing';
const TITLE = 'STOAIX Fiyatlandırma';
const DESC = 'Pazarlamadan satışa kliniğinizi büyüten tek sistem. Diş, saç ekimi ve estetik klinikleri için yapay zekâ asistanlarının şeffaf fiyatları: yazılı ve sesli seçenekler, CRM ve tüm entegrasyonlar dahil, 30 gün para iade garantisi.';
const CALL = `href="${LINKS.briefing}" target="_blank" rel="noopener"`;

const html = `<!DOCTYPE html>
<html lang="tr" class="pal-ink">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${TITLE}</title>
<meta name="description" content="${DESC}">
<meta name="theme-color" content="#0A0A0B" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#F1EEE8" media="(prefers-color-scheme: light)">
<link rel="icon" type="image/png" href="/assets/images/logo.png">
<link rel="canonical" href="${URL_SELF}">

<meta property="og:type" content="website">
<meta property="og:url" content="${URL_SELF}">
<meta property="og:title" content="${TITLE}">
<meta property="og:description" content="${DESC}">
<meta property="og:image" content="https://stoaix.com/assets/og-image.png">
<meta property="og:site_name" content="STOAIX">
<meta property="og:locale" content="tr_TR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${TITLE}">
<meta name="twitter:description" content="${DESC}">
<meta name="twitter:image" content="https://stoaix.com/assets/og-image.png">
<meta name="twitter:site" content="@stoaix">

<link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-latin-ext.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/pricing.css?v=1">

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
  <a class="brand" href="/"><span class="mark" aria-hidden="true"></span>STOAIX</a>
  <nav class="nav-links" aria-label="Ana menü">
    <a href="/#platform">Platform</a>
    <a href="/#specification">AI Asistanlar</a>
    <a href="/stoaix-ads">STOAIX Ads</a>
    <a href="#top" class="on" aria-current="page">Fiyatlandırma</a>
  </nav>
  <div class="nav-right">
    <span class="switch" role="group" aria-label="Tema"><button type="button" id="th-dark" data-set-theme="ink" aria-pressed="true">Koyu</button><span class="sep">/</span><button type="button" id="th-light" data-set-theme="bone" aria-pressed="false">Açık</button></span>
    <span class="switch lang"><a href="/en" hreflang="en" style="opacity:.45">EN</a><span class="sep">/</span><span>TR</span></span>
    <a class="nav-cta" ${CALL}>Tanışma görüşmesi</a>
  </div>
</header>

<main id="top">
  <section class="hero gut">
    <span class="eyebrow">Şeffaf fiyatlandırma</span>
    <h1>Pazarlamadan satışa, kliniğinizi büyüten <em>tek sistem.</em></h1>
    <p>Hastayı getiren reklamdan randevuyu teyit eden asistana kadar her adım tek yerde. Fiyatlar açık: ihtiyacınız olanı seçer, yalnızca onun için ödersiniz.</p>
    <span class="guar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>30 gün para iade garantisi</span>
    <div class="seg" role="group" aria-label="Ödeme dönemi">
      <button type="button" id="bill-m" data-billing="monthly" aria-pressed="true">Aylık</button>
      <button type="button" id="bill-y" data-billing="yearly" aria-pressed="false">Yıllık<span class="off">−%20</span></button>
    </div>
    <div class="starts" id="starts" aria-label="Başlangıç fiyatları">${startsHtml()}</div>
    <a class="starts-more" href="#h-prices">Tüm asistanlar ve dahil olanlar ↓</a>
    <div class="incl"><span>CRM dahil</span><span>Tüm entegrasyonlar dahil</span><span>Kurulum dahil</span><span>Taahhüt yok</span></div>
  </section>

  <section class="sec gut" aria-labelledby="h-prices">
    <div class="wrap">
      <div class="sec-h">
        <span class="eyebrow">Tüm fiyatlar</span>
        <h2 id="h-prices">Her asistanın fiyatı ve içindekiler, tek tabloda</h2>
        <p>Yazılı asistanlar WhatsApp, Instagram ve web sitenizden gelen mesajlara; sesli asistanlar telefon aramalarına bakar. Fiyatlar aylık ve ABD doları cinsindendir.</p>
      </div>
      <div class="pt" id="priceTable" role="table" aria-label="Asistan fiyatları ve dahil olanlar">${tableHtml()}</div>
      <p class="pt-note" id="ptNote">${noteText()}</p>
    </div>
  </section>

  <section class="sec gut" aria-labelledby="h-team">
    <div class="wrap">
      <div class="sec-h">
        <span class="eyebrow">Takımınızı kurun</span>
        <h2 id="h-team">Kliniğinizin ihtiyacına göre asistanlarınızı seçin</h2>
        <p>Asistanlar üç alanda çalışır: hastayı getirir, gelen hastayı kaçırmaz, tedaviden sonra da elde tutar. Birlikte seçtikçe takım indirimi kendiliğinden uygulanır.</p>
        <div class="seg" role="group" aria-label="Ödeme dönemi">
          <button type="button" data-billing="monthly" aria-pressed="true">Aylık</button>
          <button type="button" data-billing="yearly" aria-pressed="false">Yıllık<span class="off">−%20</span></button>
        </div>
      </div>
      <div class="blocks" id="blocks">${blocksHtml()}</div>
      <p class="team-hint">Resepsiyonist, Takip Uzmanı ve Randevu Asistanı birlikte seçildiğinde <b>yazılıda $50, seslide $100</b> takım indirimi uygulanır.</p>
    </div>
  </section>

  <section class="sec gut" aria-labelledby="h-faq">
    <div class="sec-h">
      <span class="eyebrow">Sık sorulanlar</span>
      <h2 id="h-faq">Fiyatlar hakkında merak edilenler</h2>
    </div>
    <div class="faq" id="faq">${faqHtml()}</div>
  </section>

  <section class="cta">
    <div class="inner gut">
      <h2>Kliniğiniz için doğru takımı birlikte seçelim.</h2>
      <p>20 dakikalık görüşmede hasta akışınıza bakar, hangi asistanların fark yaratacağını birlikte belirleriz.</p>
      <a class="btn" ${CALL}>Tanışma görüşmesi planla</a>
    </div>
  </section>
</main>

<footer class="footer gut">
  <span class="brand" style="font-size:15px"><span class="mark" style="width:20px;height:20px" aria-hidden="true"></span>STOAIX</span>
  <span>© 2026 STOAIX Ltd. · Londra</span>
</footer>

<div class="tbar gut" id="tbar" hidden>
  <div class="faces" id="tbarFaces"></div>
  <div class="who"><div class="t" id="tbarNames"></div><div class="s" id="tbarNote"></div></div>
  <div class="sum"><div class="v num" id="tbarTotal"></div><div class="s num" id="tbarSub"></div></div>
  <a class="btn" ${CALL}>Görüşme planla</a>
</div>

<script type="module" src="/js/pricing.mjs?v=1"></script>
</body>
</html>
`;

writeFileSync(join(ROOT, 'pricing.html'), html, 'utf8');
console.log(`pricing.html ${(html.length / 1024).toFixed(1)} KB`);
