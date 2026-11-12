/* ═══════════════════════════════════════════════════════════════════
   STOAIX SEO — katalog: hangi sayfa hangi adreste, hangi dosyada
   Üreteç (tools/build-seo.mjs), site haritası ve bağlantı denetimi aynı
   listeyi buradan okur; adres tek yerde tanımlı kalır.
   ═══════════════════════════════════════════════════════════════════ */

import { MARKETS, MARKET_ORDER, ORIGIN, uiFor } from './markets.mjs';
import receptionist from './products/receptionist.mjs';
import chatbot from './products/chatbot.mjs';
import followup from './products/followup.mjs';
import reminders from './products/reminders.mjs';
import reactivation from './products/reactivation.mjs';
import reviews from './products/reviews.mjs';
import preop from './products/preop.mjs';
import aftercare from './products/aftercare.mjs';
import ads from './products/ads.mjs';
import growth from './products/growth.mjs';
import crm from './products/crm.mjs';
import hub from './hub.mjs';
import { TOPICS } from './topics/index.mjs';

/* Sıra: hub ve footer listesinde görünen sıra (çoğu kliniğin ilk ihtiyacı başta). */
export const PRODUCTS = [receptionist, chatbot, followup, reminders, reactivation, reviews, preop, aftercare, ads, growth, crm];
export const HUB = hub;
export { TOPICS };
/* Ürünler + niyet sayfaları: related ve hub grupları id'yi buradan bulur. */
export const ALL = [...PRODUCTS, ...TOPICS];
export const byId = (id) => {
  const item = [HUB, ...ALL].find((p) => p.id === id);
  if (!item) throw new Error(`katalogda "${id}" yok`);
  return item;
};
/* Niyet sayfaları yalnız kendi pazarlarında yayımlanır (çoğu yalnız TR). */
export const marketsOf = (item) => item.markets || MARKET_ORDER;

/* AU, EN metnini devralırken iki şey değişir: fiyat US$ ile yazılır,
   acil durum numarası 000 olur. */
const AU_SWAPS = [[/(?<!US)\$(?=\d)/g, () => 'US$'], [/999 or NHS 111/g, () => '000']];
const toAu = (v) => {
  if (typeof v === 'string') return AU_SWAPS.reduce((s, [re, to]) => s.replace(re, to), v);
  if (Array.isArray(v)) return v.map(toAu);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, toAu(x)]));
  return v;
};

/* Ürünün içeriği: AU, EN içeriğinin üstüne yalnız farklı alanları yazar;
   faqExtra verilirse EN sorularının sonuna eklenir. */
export function contentFor(item, m) {
  if (m !== 'au') return item[m];
  const { faqExtra = [], ...au } = item.au || {};
  const base = toAu(item.en);
  return { ...base, faq: [...(base.faq || []), ...faqExtra], ...au };
}

export const pathFor = (item, m) => `${MARKETS[m].prefix}/${item.slugs[m]}`;
export const urlFor = (item, m) => ORIGIN + pathFor(item, m);
export const fileFor = (item, m) => (m === 'tr' ? `${item.slugs.tr}.html` : `${MARKETS[m].prefix.slice(1)}/${item.slugs[m]}.html`);

/* Üretilen tüm sayfalar — { item, m, file, path, lang } */
export function allPages() {
  return [HUB, ...ALL].flatMap((item) => marketsOf(item).map((m) => ({
    item, m, file: fileFor(item, m), path: pathFor(item, m), lang: MARKETS[m].lang,
  })));
}

/* Ana site footer'ı (build-v2, build-company) için ürün sütunu: TR sitesi TR
   sayfalara, EN sitesi EN sayfalara bağlanır. Sütun ile bağlantılar aynı
   sırada döner; footer() bunları yan yana okur. */
export function withProductsColumn(c, lang, links) {
  const m = lang === 'tr' ? 'tr' : 'en';
  const items = [HUB, ...PRODUCTS.filter((p) => p.id !== 'crm')];
  const col = { h: uiFor(m).hub, items: items.map((p) => (p === HUB ? uiFor(m).all : contentFor(p, m).name)) };
  return {
    c: { ...c, footerCols: [c.footerCols[0], col, ...c.footerCols.slice(1)] },
    links: [links[0], items.map((p) => pathFor(p, m)), ...links.slice(1)],
  };
}
