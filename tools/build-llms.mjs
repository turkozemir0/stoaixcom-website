/* ═══════════════════════════════════════════════════════════════════
   llms.txt / tr-llms.txt — ürün ve fiyat bölümü

   Yapay zekâ asistanlarının okuduğu özet dosyalarda ürün listesi, fiyat
   ve 4 pazarın sayfa adresleri tools/seo/catalog.mjs ve js/pricing.mjs'ten
   üretilir. Yalnız işaretler arasındaki bölüm değişir; dosyanın geri kalanı
   elle düzenlenmeye devam eder.

   Çalıştırma:  node tools/build-llms.mjs
   ═══════════════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PRICE_DATA } from '../js/pricing.mjs';
import { PRODUCTS, TOPICS, HUB, contentFor, urlFor } from './seo/catalog.mjs';
import { MARKET_ORDER } from './seo/markets.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const START = '<!-- products:start (tools/build-llms.mjs üretir, elle düzenlemeyin) -->';
const END = '<!-- products:end -->';
const MARKET_LABEL = { en: 'UK', au: 'AU', de: 'DE', tr: 'TR' };

function prices(item) {
  if (!item.price) return null;
  const agent = PRICE_DATA.agents.find((a) => a.id === item.price.agent);
  return item.price.options.map((k) => agent.opts.find((o) => o.k === k));
}

const COPY = {
  en: {
    head: '## Products, Prices and Pages (UK, Australia, Germany, Türkiye)',
    intro: `Each assistant is sold on its own, monthly, with no setup fee and no commitment. Prices are in US dollars, excluding VAT/GST. Each assistant includes ${PRICE_DATA.includedMessages.toLocaleString('en-GB')} messages or ${PRICE_DATA.includedMinutes.toLocaleString('en-GB')} minutes a month; above that, $${PRICE_DATA.overage.message} per message and $${PRICE_DATA.overage.minute} per minute. The annual plan is ${PRICE_DATA.annualDiscount * 100}% cheaper. The STOAIX CRM is free with every assistant. 30-day money-back guarantee. Ad spend for the advertising services is paid directly to Meta and Google.`,
    label: { text: 'written', voice: 'voice', mix: 'multichannel', a: '' },
    free: 'free with every assistant',
    hub: 'All assistants',
    aka: 'Also known as',
    m: 'en',
  },
  tr: {
    head: '## Ürünler, Fiyatlar ve Sayfalar (Birleşik Krallık, Avustralya, Almanya, Türkiye)',
    intro: `Her asistan ayrı ayrı, aylık, kurulum ücretsiz ve taahhütsüz alınır. Fiyatlar ABD doları, KDV hariçtir. Her asistana ayda ${PRICE_DATA.includedMessages.toLocaleString('tr-TR')} mesaj ya da ${PRICE_DATA.includedMinutes.toLocaleString('tr-TR')} dakika dahildir; üstü mesaj başına $${PRICE_DATA.overage.message}, dakika başına $${PRICE_DATA.overage.minute}. Yıllık anlaşma %${PRICE_DATA.annualDiscount * 100} daha ucuzdur. STOAIX CRM her asistanla ücretsizdir. 30 gün para iade garantisi vardır. Reklam hizmetlerinde reklam bütçesi doğrudan Meta ve Google'a ödenir.`,
    label: { text: 'yazılı', voice: 'sesli', mix: 'çok kanallı', a: '' },
    free: 'her asistanla ücretsiz',
    hub: 'Tüm asistanlar',
    aka: 'Diğer adları',
    topics: '## Arama konuları (Türkçe sayfalar)',
    topicsIntro: 'Kliniklerin aynı ihtiyacı farklı adlarla aradığı konular. Her sayfa bir arama niyetini karşılar; eş anlamlılar sayfanın içinde ve “Diğer adları” satırında.',
    m: 'tr',
  },
};

function section(lang) {
  const t = COPY[lang];
  const urls = (item) => MARKET_ORDER.map((m) => `${MARKET_LABEL[m]}: ${urlFor(item, m)}`).join(' · ');
  const lines = PRODUCTS.map((item) => {
    const c = contentFor(item, t.m);
    const p = prices(item);
    const price = p
      ? p.map((o) => `$${o.price.toLocaleString("en-US")}/mo${t.label[o.k] ? ` ${t.label[o.k]}` : ` (${o.label})`}`).join(', ')
      : t.free;
    const aka = c.aka ? ` ${t.aka}: ${c.aka.join(', ')}.` : '';
    return `- **${c.name}** — ${c.card} ${price}.${aka}\n  ${urls(item)}`;
  });
  /* Niyet sayfaları yalnız TR; İngilizce dosyaya girmez. */
  const topics = t.topics ? ['', t.topics, '', t.topicsIntro, '', ...TOPICS.map((item) => {
    const c = contentFor(item, t.m);
    return `- **${c.name}** — ${c.card}${c.aka ? ` ${t.aka}: ${c.aka.join(', ')}.` : ''}\n  ${urlFor(item, t.m)}`;
  })] : [];
  return [START, t.head, '', t.intro, '', `- **${t.hub}** — ${urls(HUB)}`, ...lines, ...topics, END].join('\n');
}

for (const [file, lang] of [['llms.txt', 'en'], ['tr-llms.txt', 'tr']]) {
  const path = join(ROOT, file);
  const src = readFileSync(path, 'utf8');
  const block = section(lang);
  let out;
  if (src.includes(START)) {
    out = src.slice(0, src.indexOf(START)) + block + src.slice(src.indexOf(END) + END.length);
  } else {
    /* İlk çalıştırma: tanıtım paragrafından sonraki ilk başlığın önüne koy. */
    const at = src.indexOf('\n## ');
    out = `${src.slice(0, at)}\n\n${block}\n${src.slice(at)}`;
  }
  writeFileSync(path, out);
  console.log(`${file}: ${PRODUCTS.length} ürün × ${MARKET_ORDER.length} pazar${COPY[lang].topics ? ` + ${TOPICS.length} konu` : ''}`);
}
