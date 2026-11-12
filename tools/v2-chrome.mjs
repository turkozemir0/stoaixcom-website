/* ═══════════════════════════════════════════════════════════════════
   STOAIX v2 — ortak sayfa çerçevesi: nav, mobil menü, CTA ve footer
   Ana sayfa (build-v2.mjs) ve alt sayfalar (build-company.mjs) aynı
   işaretlemeyi buradan alır; nav ya da footer değişince tek yer güncellenir.

   base: bölüm çapalarının önüne gelir. Ana sayfada '' (salt #platform),
   alt sayfada '/' ya da '/en' — alt sayfada salt çapa hiçbir yere gitmez.
   ═══════════════════════════════════════════════════════════════════ */

import { LINKS } from './v2-content.mjs';
import { withProductsColumn } from './seo/catalog.mjs';

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Marka işareti — gerçek marka formu. Handoff'un SVG'si kendi PNG'sinden
   farklı çizilmişti (yapraklar ters yönde), o yüzden PNG esas alındı.
   Tema başına iki dosya; görünürlüğü CSS yönetir. */
export const MARK = (size) =>
  `<span class="mark" style="width:${size}px;height:${size}px" aria-hidden="true"></span>`;

const navIds = ['platform', 'specification', 'deployment', 'governance', 'footprint'];

/* Dil anahtarı varsayılan olarak EN / TR. SEO sayfaları dört pazar taşır
   (EN, AU, DE, TR); onlar `langs` ile kendi listelerini verir:
   [{ code: 'en', label: 'EN', href: '/en/…', on: true }, …] */
function langSwitch(langs, withCurrent) {
  return langs.map((l) => `<a href="${l.href}" hreflang="${l.code}" class="${l.on ? 'on' : 'off'}"${l.on && withCurrent ? ' aria-current="true"' : ''}>${esc(l.label)}</a>`)
    .join('<span class="sep" aria-hidden="true">/</span>');
}

export function header(c, lang, { base = '', langHref = { en: '/en', tr: '/' }, brandHref = '/', langs = null } = {}) {
  const isTR = lang === 'tr';
  const switchLangs = langs || [
    { code: 'en', label: 'EN', href: langHref.en, on: !isTR },
    { code: 'tr', label: 'TR', href: langHref.tr, on: isTR },
  ];
  return `<!-- ═══ NAV ═══════════════════════════════════════════════════ -->
<header class="nav">
  <a class="brand" href="${brandHref}">${MARK(24)}STOAIX</a>
  <nav class="nav-links" aria-label="${esc([...c.nav.slice(0, 2), 'STOAIX Ads', c.pricing.nav, ...c.nav.slice(2)].join(', '))}">
    ${c.nav.map((n, i) => `<a href="${base}#${navIds[i]}">${esc(n)}</a>${i === 1 ? `\n    <a href="/stoaix-ads">STOAIX Ads<span class="tag-new">new</span></a>\n    <a href="${c.pricing.href}">${esc(c.pricing.nav)}</a>` : ''}`).join('\n    ')}
  </nav>
  <div class="nav-right">
    <span class="switch" role="group" aria-label="${esc(c.themeLabel)}">
      <button type="button" data-theme="ink" class="on" aria-pressed="true">${esc(c.dark)}</button><span class="sep" aria-hidden="true">/</span><button type="button" data-theme="bone" class="off" aria-pressed="false">${esc(c.light)}</button>
    </span>
    <span class="switch" role="group" aria-label="${esc(c.langLabel)}">
      ${langSwitch(switchLangs, true)}
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
  ${c.nav.map((n, i) => `<a class="mlink" href="${base}#${navIds[i]}">${esc(n)}</a>${i === 1 ? `\n  <a class="mlink" href="/stoaix-ads">STOAIX Ads<span class="tag-new">new</span></a>\n  <a class="mlink" href="${c.pricing.href}">${esc(c.pricing.nav)}</a>` : ''}`).join('\n  ')}
  <div class="mnav-switches">
    <span class="switch" role="group" aria-label="${esc(c.themeLabel)}">
      <button type="button" data-theme="ink" class="on" aria-pressed="true">${esc(c.dark)}</button><span class="sep" aria-hidden="true">/</span><button type="button" data-theme="bone" class="off" aria-pressed="false">${esc(c.light)}</button>
    </span>
    <span class="switch" role="group" aria-label="${esc(c.langLabel)}">
      ${langSwitch(switchLangs, false)}
    </span>
  </div>
  <div class="mnav-foot">
    <a class="btn" href="${LINKS.briefing}" target="_blank" rel="noopener">${esc(c.brief)}</a>
  </div>
</div>`;
}

export function ctaSection(c) {
  return `<!-- ═══ CTA ═══════════════════════════════════════════════════
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
      <a class="wa" href="${LINKS.whatsapp}" target="_blank" rel="noopener"><svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38a9.86 9.86 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.12-2.9-6.99A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.16 0 4.19.84 5.72 2.37a8.05 8.05 0 0 1 2.37 5.73c0 4.46-3.63 8.09-8.1 8.09a8.1 8.1 0 0 1-4.12-1.13l-.3-.18-3.05.8.81-2.97-.2-.31a8.02 8.02 0 0 1-1.23-4.3c.01-4.46 3.64-8.09 8.1-8.09Zm4.68 11.44c-.08-.13-.29-.21-.61-.37-.31-.16-1.84-.91-2.13-1.01-.29-.11-.5-.16-.71.16-.21.31-.8 1-.98 1.21-.18.21-.36.24-.67.08-.31-.16-1.31-.48-2.5-1.54-.92-.82-1.55-1.84-1.73-2.15-.18-.31-.02-.48.14-.63.14-.14.31-.36.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.7-1.69-.96-2.31-.25-.6-.51-.52-.7-.53l-.6-.01c-.21 0-.55.08-.83.39-.29.31-1.09 1.06-1.09 2.6 0 1.53 1.11 3.01 1.27 3.22.16.21 2.19 3.35 5.32 4.7.74.32 1.32.51 1.77.65.74.24 1.42.2 1.96.12.6-.09 1.84-.75 2.1-1.48.26-.72.26-1.34.18-1.47Z"/></svg><span>${esc(c.wa)}</span></a>
      <div class="leaders">
        ${c.leaders.map((l) => `
        <div>
          <div class="n">${esc(l.n)}</div>
          <div class="r">${esc(l.r)}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</section>`;
}

export function footer(c, lang, { base = '', links = LINKS.footer[lang] } = {}) {
  return `<!-- ═══ FOOTER ════════════════════════════════════════════════ -->
<footer class="footer">
  <div>
    <span class="brand">${MARK(20)}STOAIX</span>
    <div class="copy">${esc(c.copyright)}</div>
    <div class="copy" style="font-size:.72rem;opacity:.8;margin-top:6px;max-width:380px;">STOAIX LTD · Registered in England and Wales · Company No. 17131250 · Registered office: 4 Raven Road, Unit 1c3-1121, London, E18 1HB</div>
  </div>
  <div class="footer-cols">
    ${c.footerCols.map((f, ci) => `
    <div>
      <h4>${esc(f.h)}</h4>
      ${f.items.map((item, ii) => {
        const href = links[ci][ii];
        const to = href && href[0] === '#' ? base + href : href;
        return href ? `<a href="${to}">${esc(item)}</a>` : `<span>${esc(item)}</span>`;
      }).join('\n      ')}
    </div>`).join('')}
  </div>
</footer>`;
}

/* Ana site footer'ı: footer() + ürün sayfalarına giden "Yapay zekâ asistanları" sütunu */
export function siteFooter(c, lang, opts = {}) {
  const { c: withCol, links } = withProductsColumn(c, lang, LINKS.footer[lang]);
  return footer(withCol, lang, { ...opts, links });
}
