/* İçerik ölçümleri — Information Gain ve AI'ın alıntılayabilirliği için vekil sinyaller.
   Skor bir "gerçek" değil, haftalık öncelik sırası için kaba bir pusula:
   en düşük skorlu para sayfaları önce elden geçer. */
import { visibleText, mainHtml } from './site.mjs';

/* Kimsenin yazamayacağı şey: ilk elden deneyim, kendi verimiz, kendi sürecimiz */
const FIRST_HAND = /\b(kurduğumuz|kurulumlarda|gördük|ölçtük|denedik|müşterilerimiz|sahada|bizim verimiz|we (?:saw|measured|tested|found|set up)|our (?:clients|data|setups)|in our (?:data|experience))\b/gi;
/* Herkesin yazabileceği dolgu cümleleri (consensus) */
const FILLER = /\b(günümüzde|son yıllarda|büyük önem taşı|oldukça önemli|vazgeçilmez|in today'?s|it is (?:important|essential)|plays a (?:key|crucial) role|game[- ]changer)\b/gi;
/* Özgüllük: birimli sayı (%, para, süre) */
const SPECIFIC = /\d+(?:[.,]\d+)?\s?(?:%|\$|£|€|₺|dk|dakika|sn|saniye|saat|gün|min(?:ute)?s?|sec(?:ond)?s?|hours?|days?)/gi;

const count = (text, re) => (text.match(re) || []).length;
const words = (text) => text.split(/\s+/).filter(Boolean).length;

export function infoGain(html) {
  const text = visibleText(mainHtml(html));
  const n = Math.max(words(text), 1);
  const per1k = (k) => (k * 1000) / n;
  const firstHand = count(text, FIRST_HAND);
  const specific = count(text, SPECIFIC);
  const filler = count(text, FILLER);
  /* 0–10: özgüllük en çok 5, ilk elden en çok 4, dolgu en çok −3, uzunluk bonusu yok */
  const score = Math.min(5, per1k(specific) / 2) + Math.min(4, firstHand * 1.5) - Math.min(3, per1k(filler));
  return {
    words: n, firstHand, specific, filler,
    score: Math.max(0, Math.round(score * 10) / 10),
  };
}

/* Answer-first: soru başlığının (H2/H3 "?") hemen ardından gelen ilk paragraf
   kısa ve kendi başına alıntılanabilir olmalı (≤ 60 kelime). */
const MAX_ANSWER_WORDS = 60;
export function answerFirst(html) {
  const body = mainHtml(html);
  const re = /<h([23])[^>]*>([\s\S]*?\?)\s*<\/h\1>([\s\S]*?)(?=<h[1-3][\s>]|$)/g;
  const misses = [];
  let total = 0;
  for (const m of body.matchAll(re)) {
    total++;
    const para = /<p[^>]*>([\s\S]*?)<\/p>/.exec(m[3]);
    const w = para ? words(visibleText(para[1])) : 0;
    if (!para || w > MAX_ANSWER_WORDS) misses.push({ q: visibleText(m[2]), words: w });
  }
  return { total, misses };
}

export function meta(html) {
  const title = (/<title>([\s\S]*?)<\/title>/.exec(html) || [, ''])[1].trim();
  const desc = (/<meta name="description" content="([^"]*)"/.exec(html) || [, ''])[1];
  const modified = (/"dateModified":\s*"([\d-]+)/.exec(html) || [, null])[1];
  return {
    title, desc, modified,
    hasFaqSchema: /"FAQPage"/.test(html),
    noindex: /<meta name="robots" content="[^"]*noindex/.test(html),
  };
}
