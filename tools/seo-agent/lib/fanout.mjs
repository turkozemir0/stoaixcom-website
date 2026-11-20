/* Query fan-out kapsaması: AI arama, sorgunun arkasındaki alt soruları da arar
   ve en çoğunu cevaplayan sayfayı alıntılar. Her ana sorgu için alt soru listesi
   fanout.json'da; bir alt soru, `match` desenlerinin HEPSİ kümenin sayfalarında
   geçiyorsa "cevaplanmış" sayılır (hub + destek sayfaları birlikte). */
import { visibleText, mainHtml } from './site.mjs';

export function coverage(entry, pages) {
  const text = entry.pages
    .map((p) => pages.get(p))
    .filter(Boolean)
    .map((pg) => visibleText(mainHtml(pg.html)).toLowerCase())
    .join(' \n ');
  const missingPages = entry.pages.filter((p) => !pages.has(p));
  const results = entry.fan.map((f) => ({
    q: f.q,
    answered: f.match.every((pat) => new RegExp(pat, 'i').test(text)),
  }));
  const answered = results.filter((r) => r.answered).length;
  return {
    query: entry.query, market: entry.market, pages: entry.pages, missingPages,
    answered, total: results.length,
    gaps: results.filter((r) => !r.answered).map((r) => r.q),
  };
}
