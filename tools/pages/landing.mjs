/* ═══════════════════════════════════════════════════════════════════
   Reklam açılış sayfaları: diş / estetik / saç ekimi × hızlı yanıt,
   eski lead canlandırma. Metinler eski sayfalardan aynen alındı
   (Ata, 12 Kas: kaynaksız rakamlara dokunulmaz). Fiyatlar js/pricing.mjs.
   Veri: landing-hizli-yanit.mjs, landing-eski-lead.mjs
   ═══════════════════════════════════════════════════════════════════ */

import { PRICE_DATA } from '../../js/pricing.mjs';
import { esc } from '../v2-chrome.mjs';
import { hero, qa, cards, steps, page, LINKS } from './sections.mjs';

const SHEET = '/css/landing.css?v=1';
const usd = (n) => `$${n.toLocaleString('tr-TR')}`;
const optPrice = (id, k) => PRICE_DATA.agents.find((a) => a.id === id).opts.find((o) => o.k === k).price;
const pct = (s) => Number(String(s).replace(/\D/g, '')) || 0;

const chat = ({ stamp, q, a }) => `
  <div class="lp-chat" aria-label="Örnek konuşma">
    <div class="hd"><span class="who">STOAIX — Klinik Asistanı</span><span class="live">Aktif · 7/24</span></div>
    <div class="body">
      <div class="stamp">${esc(stamp)}</div>
      <div class="b in">${esc(q)}</div>
      <div class="b out">${esc(a)}</div>
      <div class="note">8 saniyede yanıt verildi</div>
    </div>
  </div>`;

const stats = (rows, wide) => `
  <dl class="lp-stats${wide ? ' wide' : ''}">
    ${rows.map(([n, l]) => `<div><dt>${esc(n)}</dt><dd>${esc(l)}</dd></div>`).join('\n    ')}
  </dl>`;

export const demo = (chatData, rows) => (chatData
  ? `\n<section class="pad lp-demo">${chat(chatData)}${stats(rows)}\n</section>\n`
  : `\n<section class="pad facts-wrap">${stats(rows, true)}\n</section>\n`);

export const bars = (rows) => `
      <div class="lp-bars">
        ${rows.map(([l, v], i) => `<div class="r${i ? '' : ' top'}"><span class="l">${esc(l)}</span><span class="v">${esc(v)}</span><span class="bar"><i style="width:${pct(v)}%"></i></span></div>`).join('\n        ')}
      </div>`;

export const nums = (h, lede, items, { alt = false } = {}) => `
<section class="pad${alt ? ' alt' : ''}">
  <div class="sec-head">
    <h2>${esc(h)}</h2>
  </div>
  <p class="lp-lede">${esc(lede)}</p>
  <div class="lp-nums">
    ${items.map((x) => `<div><p class="n">${esc(x.n)}</p><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p></div>`).join('\n    ')}
  </div>
</section>
`;

const side = (cls, s) => `<div class="${cls}"><p class="k">${esc(s.k)}</p><h3>${esc(s.t)}</h3><ul>${s.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`;

export const versus = ({ h, lede, no, yes }) => `
<section class="pad">
  <div class="sec-head">
    <h2>${esc(h)}</h2>
  </div>
  <p class="lp-lede">${esc(lede)}</p>
  <div class="lp-vs">
    ${side('no', no)}
    ${side('yes', yes)}
  </div>
</section>
`;

export const list = (items) => `
      <ul class="lp-list">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;

const PRICING = {
  rec: () => [
    `Anlık yanıtı Resepsiyonist asistanı verir: yazılı (WhatsApp, Instagram, web sohbeti) aylık ${usd(optPrice('rec', 'text'))}, sesli aylık ${usd(optPrice('rec', 'voice'))}.`,
    'Klinik CRM\'i ücretsiz dahil, kurulum ücreti yok, her planda 30 gün para iade garantisi var.',
  ],
  react: () => [
    `Eski listeyi Canlandırma Uzmanı çalışır: yazılı veya sesli aylık ${usd(optPrice('react', 'text'))}, ikisi birlikte (karma) aylık ${usd(optPrice('react', 'mix'))}.`,
    'Klinik CRM\'i ücretsiz dahil, kurulum ücreti yok, her planda 30 gün para iade garantisi var.',
  ],
};

function pricing(agent, sister) {
  const links = `\n      <p class="fine">Sözleşme yok · İstediğinde iptal et · Kurulum ücretsiz</p>
      <p><a class="more" href="/pricing">Tüm fiyatlar →</a>&nbsp;&nbsp;&nbsp;<a class="more" href="${sister.href}">${esc(sister.t)} →</a></p>`;
  return qa('Fiyat', PRICING[agent](), { alt: true, extra: links });
}

/* d: tek sayfanın verisi. extra: istatistiklerden sonra eklenecek hazır bölümler. */
export function landingPage(d) {
  const body = [
    hero({
      lang: 'tr', crumbName: d.crumb, eyebrow: d.eyebrow, proof: d.proof, h1: d.h1, lede: d.lede,
      actions: d.actions.map((t) => ({ t, href: LINKS.briefing })),
    }),
    demo(d.chat, d.stats),
    ...(d.extra || []),
    d.rule ? qa(d.rule.h, [d.rule.lede], { alt: true, extra: bars(d.rule.rows) + d.rule.after.map((p) => `\n      <p>${esc(p)}</p>`).join('') }) : '',
    d.pain ? nums(d.pain.h, d.pain.lede, d.pain.items) : '',
    d.features ? cards(d.features.h, d.features.items, { lede: d.features.lede }) : '',
    steps(d.how.h, d.how.steps),
    d.vs ? versus(d.vs) : '',
    pricing(d.agent, d.sister),
  ].join('');
  return page({ lang: 'tr', slug: d.slug, title: d.title, desc: d.desc, crumbName: d.crumb, body, sheets: [SHEET], ctaHead: d.close });
}
