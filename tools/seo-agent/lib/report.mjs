/* Haftalık rapor (Markdown). Geçen haftanın JSON'u verilirse farkları da yazar. */

const delta = (cur, prev) => {
  if (prev === undefined || prev === null) return '';
  const d = Math.round((cur - prev) * 10) / 10;
  return d === 0 ? ' (=)' : ` (${d > 0 ? '+' : ''}${d})`;
};
const list = (xs, empty = '—') => (xs.length ? xs.map((x) => `- ${x}`).join('\n') : empty);

function gscSection(g, prev) {
  if (!g) return '## 4. Ölçüm — Search Console\n\nBağlı değil. `GSC_SERVICE_ACCOUNT` tanımlanınca vurmaya yakın sorgular (4–15. sıra), sorgu genişliği ve tıklama değişimi burada görünür.\n';
  if (g.error) return `## 4. Ölçüm — Search Console\n\nHata: ${g.error}\n`;
  return `## 4. Ölçüm — Search Console (${g.window.join(' → ')})

Tıklama ${g.totals.clicks}${delta(g.totals.clicks, prev?.totals?.clicks)} · Gösterim ${g.totals.impr}${delta(g.totals.impr, prev?.totals?.impr)} · Farklı sorgu ${g.totals.queries}${delta(g.totals.queries, prev?.totals?.queries)}

**Vurmaya yakın (4–15. sıra) — her birine tek dokunuş: başlık, ilk paragraf ya da bir SSS:**

| Sorgu | Sayfa | Sıra | Gösterim | Tık |
|---|---|---|---|---|
${g.striking.map((r) => `| ${r.query} | ${r.page.replace(/^https?:\/\/[^/]+/, '')} | ${r.pos.toFixed(1)} | ${r.impr} | ${r.clicks} |`).join('\n') || '| — | | | | |'}

**Sorgu genişliği (konu otoritesi vekili):** ${g.breadth.slice(0, 8).map((b) => `${b.page.replace(/^https?:\/\/[^/]+/, '')} ${b.queries}`).join(' · ')}

**En çok değişen sayfalar:** ${g.movers.map((m) => `${m.page.replace(/^https?:\/\/[^/]+/, '')} ${m.delta > 0 ? '+' : ''}${m.delta}`).join(' · ') || '—'}
`;
}

export function renderReport({ date, structure: s, content: c, clusters: k, fanout: f, gsc }, prev = null) {
  const fanTotal = f.reduce((a, x) => a + x.answered, 0);
  const fanAll = f.reduce((a, x) => a + x.total, 0);
  const prevFan = prev ? prev.fanout.reduce((a, x) => a + x.answered, 0) : null;
  return `# SEO-GEO haftalık rapor — ${date}

Üreten: \`npm run seo:audit\` (tools/seo-agent). Ölçüt kaynakları: Information Gain, Topical Authority, Query Fan-Out çerçeveleri (docs/seo-agent/RUNBOOK.md).

## Özet

| Ölçü | Bu hafta | Hedef |
|---|---|---|
| Ana sayfadan ulaşılamayan sayfa | ${s.unreachable.length}${delta(s.unreachable.length, prev?.structure?.unreachable?.length)} | 0 |
| 3 tıktan derin sayfa | ${s.tooDeep.length}${delta(s.tooDeep.length, prev?.structure?.tooDeep?.length)} | 0 |
| Hub'a bağlanamayan yazı | ${k.unassigned.length}${delta(k.unassigned.length, prev?.clusters?.unassigned?.length)} | 0 |
| Fan-out kapsaması | ${fanTotal}/${fanAll}${delta(fanTotal, prevFan)} | tamamı |
| Information Gain ort. (para sayfaları, 0–10) | ${c.moneyAvgScore}${delta(c.moneyAvgScore, prev?.content?.moneyAvgScore)} | ≥ 5 |
| İlk elden bilgi içeren sayfa | ${c.withFirstHand}${delta(c.withFirstHand, prev?.content?.withFirstHand)} | her para sayfası |

## 1. Yapı — Topical Authority

Tıklama derinliği dağılımı: ${Object.entries(s.depthDist).map(([d, n]) => `${d} tık: ${n}`).join(' · ')}

Ulaşılamayan:
${list(s.unreachable)}

Gelen linki olmayan:
${list(s.noInbound)}

Kümeler (yazı sayısı): ${Object.entries(k.sizes).map(([id, n]) => `${id} ${n}`).join(' · ')}

Hub'a düşen (kural eklenmeli, tools/seo/topical-map.mjs):
${list(k.unassigned.slice(0, 20))}

## 2. İçerik — Information Gain

En düşük skorlu para sayfaları (bu haftanın yeniden yazım adayları):

| Sayfa | Skor | Özgül sayı | İlk elden | Dolgu | Kelime |
|---|---|---|---|---|---|
${c.lowestMoney.map((r) => `| ${r.path} | ${r.score} | ${r.specific} | ${r.firstHand} | ${r.filler} | ${r.words} |`).join('\n')}

Answer-first ihlali (soru başlığından sonra ilk paragraf yok ya da 60 kelimeden uzun):
${list(c.answerFirstMisses.map((r) => `${r.path} — ${r.answerMisses}/${r.answerQs}`))}

Uzun başlık (>65): ${c.longTitles.length} · Uzun açıklama (>165): ${c.longDescs.length} · 180 günden eski: ${c.stale.length}

## 3. Query Fan-Out

${f.map((x) => `**${x.query}** (${x.market}) — ${x.answered}/${x.total}${x.missingPages.length ? ` · eksik sayfa: ${x.missingPages.join(', ')}` : ''}
${list(x.gaps.map((q) => `boşluk: ${q}`), '- boşluk yok')}`).join('\n\n')}

${gscSection(gsc, prev?.gsc)}`;
}
