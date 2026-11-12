/* ═══════════════════════════════════════════════════════════════════
   Tek tek yazılan v2 sayfaları için bölüm parçaları
   (partner programı, reklam açılış sayfaları …). İskelet ve sınıflar
   ürün sayfalarıyla aynı: v2.css + company.css + seo.css.
   ═══════════════════════════════════════════════════════════════════ */

import { esc } from '../v2-chrome.mjs';
import { pageHead, pageTail, crumbs, COPY, ORIGIN } from '../blog/render-post.mjs';

export const LINKS = {
  briefing: 'https://calendly.com/ataulufer1/20',
};
const EXT = 'target="_blank" rel="noopener"';
const isExternal = (href) => /^https?:/.test(href);
const linkAttrs = (href) => (isExternal(href) ? ` ${EXT}` : '');

export function hero({ lang, crumbName, eyebrow, proof, h1, lede, actions = [] }) {
  const home = lang === 'tr' ? '/' : '/en';
  return `
<!-- ═══ HERO ══════════════════════════════════════════════════ -->
<section class="hero page-hero">
  ${crumbs(lang, [{ name: COPY[lang].home, href: home }, { name: crumbName }])}
  <div class="hero-head">
    <p class="eyebrow">${esc(eyebrow)}</p>
    ${proof ? `<div class="proof">${esc(proof)}</div>` : ''}
  </div>
  <h1 class="page-title">${esc(h1)}</h1>
  <div class="hero-grid">
    <p>${esc(lede)}</p>
    <div class="row hero-actions">
      ${actions.map((a, i) => `<a class="${i ? 'btn-ghost' : 'btn'}" href="${a.href}"${linkAttrs(a.href)}>${esc(a.t)}</a>`).join('\n      ')}
    </div>
  </div>
</section>
`;
}

export const facts = (rows) => `
<section class="pad facts-wrap">
  <dl class="facts">
    ${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('\n    ')}
  </dl>
</section>
`;

export const qa = (h, paras, { alt = false, extra = '' } = {}) => `
<section class="pad${alt ? ' alt' : ''}">
  <div class="qa">
    <h2>${esc(h)}</h2>
    <div class="qa-body">
      ${paras.map((p) => `<p>${esc(p)}</p>`).join('\n      ')}${extra}
    </div>
  </div>
</section>
`;

export const cards = (h, items, { alt = false, lede = '' } = {}) => `
<section class="pad${alt ? ' alt' : ''} related">
  <div class="sec-head">
    <h2>${esc(h)}</h2>
  </div>${lede ? `\n  <p class="lp-lede">${esc(lede)}</p>` : ''}
  <div class="channels">
    ${items.map((x) => (x.href
    ? `<a class="ch" href="${x.href}"${linkAttrs(x.href)}><span class="t">${esc(x.t)}</span><span class="d">${esc(x.d)}</span>${x.go ? `<span class="go">${esc(x.go)} →</span>` : ''}</a>`
    : `<div class="ch"><span class="t">${esc(x.t)}</span><span class="d">${esc(x.d)}</span>${x.go ? `<span class="go">${esc(x.go)}</span>` : ''}</div>`)).join('\n    ')}
  </div>
</section>
`;

export const steps = (h, items, { alt = true } = {}) => `
<section class="pad${alt ? ' alt' : ''}">
  <div class="sec-head">
    <h2>${esc(h)}</h2>
  </div>
  <ol class="principles steps-list">
    ${items.map((s, i) => `<li class="step">
      <div class="hd"><span class="w">${String(i + 1).padStart(2, '0')}</span><span class="t">${esc(s.t)}</span></div>
      <p class="d">${esc(s.d)}</p>
    </li>`).join('\n    ')}
  </ol>
</section>
`;

/* Tablo: ilk sütun satır başlığı. Hücreler düz metin. */
export const table = (head, rows) => `
      <div class="scroll-x"><table class="tbl sx">
        <thead><tr>${head.map((x) => `<th scope="col">${esc(x)}</th>`).join('')}</tr></thead>
        <tbody>
          ${rows.map(([first, ...rest]) => `<tr><th scope="row">${esc(first)}</th>${rest.map((x) => `<td>${esc(x)}</td>`).join('')}</tr>`).join('\n          ')}
        </tbody>
      </table></div>`;

export const faq = (h, items) => `
<section class="pad" id="faq">
  <div class="sec-head">
    <h2>${esc(h)}</h2>
  </div>
  ${items.map(([q, a]) => `<div class="faq-row">
    <h3 class="q">${esc(q)}</h3>
    <p class="a">${esc(a)}</p>
  </div>`).join('\n  ')}
</section>
`;

/* Sayfa: head + bölümler + CTA/footer. JSON-LD: WebPage, BreadcrumbList, varsa FAQPage. */
export function page({ lang, slug, title, desc, crumbName, faqItems = [], body, robots, sheets = [], ctaHead }) {
  const canonical = `${ORIGIN}/${slug}`;
  const home = lang === 'tr' ? '/' : '/en';
  const ld = [
    { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description: desc, url: canonical, inLanguage: lang,
      publisher: { '@type': 'Organization', name: 'STOAIX', url: ORIGIN } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: COPY[lang].home, item: ORIGIN + home },
      { '@type': 'ListItem', position: 2, name: crumbName, item: canonical },
    ] },
    ...(faqItems.length ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems.map(([q, a]) => ({
      '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }] : []),
  ];
  return `${pageHead({ lang, htmlLang: lang, title, desc, canonical, robots, ogType: 'website', ld, sheets: ['/css/seo.css?v=1', ...sheets] })}
${body}
${pageTail(lang, { ctaHead })}`;
}
