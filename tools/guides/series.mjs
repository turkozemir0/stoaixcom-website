/* ═══════════════════════════════════════════════════════════════════
   Rehber serisi (pillar ↔ küme yazıları)

   Ön bilgide "series: <id>" ve "part: <sıra>" olan yazılar bir seri olur.
   part 0 ana rehberdir (pillar); 1, 2, … onun bölümleridir. Seri dil dil
   kurulur: TR yazı yalnız TR kardeşlerine bağlanır.

   • seriesNote: bölüm yazısının başına "bu yazı … rehberinin parçası" notu
   • seriesBox:  yazının sonuna serinin tüm bölümleri (bulunulan sayfa işaretli)
   ═══════════════════════════════════════════════════════════════════ */

import { esc } from '../v2-chrome.mjs';

const COPY = {
  tr: { label: 'Rehber serisi', pillar: 'Ana rehber', note: (a) => `Bu yazı ${a} serisinin bir bölümüdür.` },
  en: { label: 'Guide series', pillar: 'Main guide', note: (a) => `This article is part of the ${a} series.` },
  de: { label: 'Leitfaden-Reihe', pillar: 'Hauptleitfaden', note: (a) => `Dieser Beitrag ist Teil der Reihe ${a}.` },
};

const href = (v) => `/blog/${v.slug}`;
const isPillar = (v) => Number(v.part) === 0;

/* Aynı seri ve dildeki yazılar, part sırasıyla; seri yoksa [] */
export function seriesOf(guides, current) {
  if (!current.series) return [];
  return guides
    .map((g) => g.versions[current.lang])
    .filter((v) => v && v.series === current.series)
    .sort((a, b) => Number(a.part) - Number(b.part));
}

const item = (v, current) => (v.slug === current.slug
  ? `<li><span aria-current="page">${esc(v.h1)}</span></li>`
  : `<li><a href="${href(v)}">${esc(v.h1)}</a></li>`);

export function seriesBox(members, current) {
  if (members.length < 2) return '';
  const t = COPY[current.lang];
  const pillar = members.find(isPillar);
  const parts = members.filter((v) => !isPillar(v));
  return `<nav class="guide-series" aria-label="${esc(t.label)}">
<p class="eyebrow">${esc(t.label)}</p>
${pillar ? `<p class="series-pillar">${esc(t.pillar)}: ${pillar.slug === current.slug ? `<span aria-current="page">${esc(pillar.h1)}</span>` : `<a href="${href(pillar)}">${esc(pillar.h1)}</a>`}</p>` : ''}
<ol class="series-list">
${parts.map((v) => item(v, current)).join('\n')}
</ol>
</nav>`;
}

export function seriesNote(members, current) {
  const pillar = members.find(isPillar);
  if (!pillar || isPillar(current)) return '';
  const t = COPY[current.lang];
  return `<p class="series-note">${t.note(`<a href="${href(pillar)}">${esc(pillar.h1)}</a>`)}</p>`;
}

/* Yazının sonundaki imza: kim yazdı, hangi ilkelerle */
const BYLINE = {
  tr: (href) => `Yazan: STOAIX ekibi. Bu rehber <a href="${href}">yayın ilkelerimize</a> göre hazırlandı: sayılar kaynaklarıyla birlikte verilir, örnekler kurgudur, tıbbi karar hekime aittir.`,
  en: (href) => `Written by the STOAIX team under our <a href="${href}">editorial policy</a>: figures are linked to their sources, examples are fictional and clinical decisions stay with the clinician.`,
  de: (href) => `Verfasst vom STOAIX-Team nach unseren <a href="${href}">Redaktionsrichtlinien</a>: Zahlen sind mit Quellen verlinkt, Beispiele sind erfunden, die medizinische Entscheidung liegt bei der Ärztin oder dem Arzt.`,
};

export const byline = (lang, href) => `<p class="guide-byline">${BYLINE[lang](href)}</p>`;

/* Seri kutusu ve figürler için sayfaya gömülen küçük stil */
export const GUIDE_CSS = `.prose .series-note { font-size:15px; color:var(--soft); border-left:2px solid var(--accent); padding-left:12px; }
.guide-series { margin:40px 0 0; padding:22px 24px; border:1px solid var(--line); border-radius:14px; }
.guide-series .series-pillar { font-weight:630; margin:6px 0 12px; }
.guide-series .series-list { margin:0; padding-left:22px; display:grid; gap:8px; }
.guide-series [aria-current] { font-weight:630; }
.prose .guide-byline { font-size:14px; color:var(--soft); margin-top:32px; padding-top:16px; border-top:1px solid var(--line-soft); }
.prose .guide-fig { margin:8px 0 30px; }
.prose .guide-fig img { display:block; width:100%; height:auto; border-radius:14px; border:1px solid var(--line-soft); }
.prose .guide-fig figcaption { font-size:14px; color:var(--soft); margin-top:10px; }`;
