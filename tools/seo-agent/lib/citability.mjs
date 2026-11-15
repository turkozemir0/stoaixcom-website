/* Pasaj alıntılanabilirliği — AI motoru sayfayı değil pasajı alıntılar.
   Kaynak: geo-seo-claude citability_scorer (TR uyarlaması). Ağırlıklar:
   cevap bloğu 30 · kendi başına anlamlı olma 25 · okunabilirlik 20 · veri yoğunluğu 15 · özgünlük 10.
   Skor bir pusula: en iyi pasaj zayıfsa ve sayfanın ilk %30'unda değilse yeniden yaz. */
import { visibleText, mainHtml } from './site.mjs';

const IDEAL_WORDS = [134, 167];
const ACCEPT_WORDS = [40, 300];
/* Alıntıların büyük kısmı sayfanın üst bölümünden gelir; en iyi pasaj buraya düşmeli */
export const TOP_SHARE = 0.3;

const DEFINITION = /\b(nedir|demektir|anlamına gelir|olarak tanımlanır|is an?|refers to|means|is defined as)\b|\s(bir|an?)\s[^.]{3,60}(dır|dir|dur|dür|tır|tir|tur|tür)\b/i;
const PRONOUN_START = /^(bu|bunlar|o|onlar|şu|this|that|these|those|it|they)\b/i;
const PRONOUNS = /\b(bu|bunu|bunun|onlar|onu|onun|şu|it|its|they|them|this|that|these|those)\b/gi;
const STAT = /\d+(?:[.,]\d+)?\s?(?:%|\$|£|€|₺|dk|dakika|saniye|saat|gün|minutes?|hours?|days?)|%\s?\d+/gi;
const SOURCE = /\b(göre|kaynak|araştırma|rapor|according to|research|report|study)\b/gi;
const ORIGINAL = /\b(kurulumlarda|ölçtük|gördük|bizim verimiz|we (?:found|measured|saw)|in practice|uygulamada|case study)\b/gi;

const count = (t, re) => (t.match(re) || []).length;
const words = (t) => t.split(/\s+/).filter(Boolean);

function sentences(text) {
  return text.split(/(?<=[.!?])\s+/).filter((s) => words(s).length > 2);
}

export function scorePassage(text, heading = '') {
  const w = words(text);
  const n = w.length;
  const sents = sentences(text);
  const first60 = w.slice(0, 60).join(' ');

  let answer = 0;
  if (DEFINITION.test(first60)) answer += 15;
  if (/\?$/.test(heading.trim())) answer += 8;
  if (sents[0] && words(sents[0]).length <= 30) answer += 7;

  let self = 0;
  if (n >= IDEAL_WORDS[0] && n <= IDEAL_WORDS[1]) self += 10;
  else if (n >= ACCEPT_WORDS[0] && n <= ACCEPT_WORDS[1]) self += 5;
  if (!PRONOUN_START.test(text.trim())) self += 7;
  if (count(text, PRONOUNS) / Math.max(n, 1) < 0.02) self += 8;

  const avgLen = sents.length ? n / sents.length : n;
  let read = 0;
  if (avgLen >= 10 && avgLen <= 20) read += 12;
  else if (avgLen > 5 && avgLen <= 25) read += 6;
  if (sents.length >= 2) read += 8;

  const stats = Math.min(15, count(text, STAT) * 4 + count(text, SOURCE) * 3);
  const unique = Math.min(10, count(text, ORIGINAL) * 5);

  const score = Math.min(answer, 30) + Math.min(self, 25) + Math.min(read, 20) + stats + unique;
  return { score, words: n };
}

export const grade = (s) => (s >= 80 ? 'A' : s >= 65 ? 'B' : s >= 50 ? 'C' : s >= 35 ? 'D' : 'F');

/* Başlıkla açılan bölümler → pasaj. Her pasaj: başlık + ardındaki paragraflar. */
export function passages(html) {
  const body = mainHtml(html);
  const parts = body.split(/(?=<h[23][\s>])/);
  const out = [];
  let offset = 0;
  const totalWords = Math.max(words(visibleText(body)).length, 1);
  for (const part of parts) {
    const heading = visibleText((/<h[23][^>]*>([\s\S]*?)<\/h[23]>/.exec(part) || [, ''])[1]);
    const paras = [...part.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => visibleText(m[1])).join(' ');
    const partWords = words(visibleText(part)).length;
    if (words(paras).length >= ACCEPT_WORDS[0]) {
      out.push({ heading, ...scorePassage(paras, heading), position: offset / totalWords });
    }
    offset += partWords;
  }
  return out;
}

export function citability(html) {
  const ps = passages(html);
  if (!ps.length) return { passages: 0, best: 0, avg: 0, bestInTop: false };
  const best = ps.reduce((a, b) => (b.score > a.score ? b : a));
  return {
    passages: ps.length,
    best: best.score,
    bestHeading: best.heading,
    avg: Math.round(ps.reduce((s, p) => s + p.score, 0) / ps.length),
    bestInTop: ps.some((p) => p.position < TOP_SHARE && p.score >= 50),
  };
}
