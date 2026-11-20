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

**CTR anomalisi (ilk 5'te, CTR < %2 → başlık/açıklama):**
${list(g.ctrAnomalies.map((r) => `${r.query} — ${r.page.replace(/^https?:\/\/[^/]+/, '')} · sıra ${r.pos.toFixed(1)} · ${r.impr} gösterim · CTR %${(r.ctr * 100).toFixed(1)}`))}

**Yamyamlaşma (aynı sorguda 2+ sayfa → birleştir ya da ayır):**
${list(g.cannibalization.map((c) => `${c.query}: ${c.pages.map((p) => `${p.page.replace(/^https?:\/\/[^/]+/, '')} (${p.pos.toFixed(1)})`).join(' / ')}`))}

**Düşen sayfalar (tık %30+ azaldı → içerik yenileme):**
${list(g.decaying.map((m) => `${m.page.replace(/^https?:\/\/[^/]+/, '')} ${m.prev} → ${m.clicks}`))}

Yeni sorgu ${g.newQueries} · kaybolan sorgu ${g.lostQueries}

**En çok değişen sayfalar:** ${g.movers.map((m) => `${m.page.replace(/^https?:\/\/[^/]+/, '')} ${m.delta > 0 ? '+' : ''}${m.delta}`).join(' · ') || '—'}
`;
}

function technicalSection(t) {
  if (!t) return '';
  const bots = (xs) => xs.map((b) => `${b.bot} ${b.allowed ? '✓' : '✗'}`).join(' · ');
  return `## 5. Teknik ve GEO

**AI tarayıcıları (robots.txt).** Arama/alıntı: ${bots(t.robots.search)}
Eğitim (politika kararı, hata değil): ${bots(t.robots.training)}
${t.robots.blockedSearch.length ? `**KRİTİK: engelli arama tarayıcısı: ${t.robots.blockedSearch.join(', ')}**` : 'Arama tarayıcılarının hepsi açık.'}

**Drift (geçen haftaya göre).** ${t.drift.hasBaseline ? `Kritik ${t.drift.critical.length} · uyarı ${t.drift.warning.length} · yeni sayfa ${t.drift.info}` : 'Taban yok; bu hafta taban kaydedildi.'}
${list(t.drift.critical.map((d) => `KRİTİK ${d.path}: ${d.what}`), '')}

**Hreflang.** ${t.hreflang.length} sorun (dönüş linki, geçersiz kod, kanonik dışı) · x-default'u olmayan ${t.hreflangNoDefault} sayfa (öneri)
${list(t.hreflang.slice(0, 15).map((h) => `${h.path}: ${h.issue}`), '')}

**E-E-A-T (${t.eeat.posts} yazı).** Yazarsız ${t.eeat.noAuthor.length} · yazar sayfası linki olmayan ${t.eeat.noAuthorUrl} · görünür tarihi olmayan ${t.eeat.noVisibleDate.length} · güncelleme < yayın tarihi ${t.eeat.badDateOrder.length} · Organization sameAs ${t.eeat.orgSameAs ? 'var' : '**yok**'}
`;
}

export function renderReport({ date, structure: s, content: c, clusters: k, fanout: f, gsc, technical: t }, prev = null) {
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
| Alıntılanabilirlik ort. (para sayfaları, en iyi pasaj 0–100) | ${c.citeAvgMoney}${delta(c.citeAvgMoney, prev?.content?.citeAvgMoney)} | ≥ 65 (B) |
| İyi pasajı ilk %30'da olmayan para sayfası | ${c.citeNotInTop}${delta(c.citeNotInTop, prev?.content?.citeNotInTop)} | 0 |
| Engelli AI arama tarayıcısı | ${t ? t.robots.blockedSearch.length : '—'} | 0 |
| Drift kritik değişiklik | ${t ? t.drift.critical.length : '—'} | 0 |
| Hreflang sorunu | ${t ? t.hreflang.length : '—'}${delta(t ? t.hreflang.length : 0, prev?.technical?.hreflang?.length)} | 0 |
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

En düşük alıntılanabilirlik (para sayfaları; en iyi pasaj puanı, A ≥80 · B ≥65 · C ≥50):

| Sayfa | En iyi pasaj | İlk %30'da iyi pasaj |
|---|---|---|
${c.lowestCite.map((r) => `| ${r.path} | ${r.cite} | ${r.citeTop ? 'var' : 'yok'} |`).join('\n')}

Answer-first ihlali (soru başlığından sonra ilk paragraf yok ya da 60 kelimeden uzun):
${list(c.answerFirstMisses.map((r) => `${r.path} — ${r.answerMisses}/${r.answerQs}`))}

Uzun başlık (>65): ${c.longTitles.length} · Uzun açıklama (>165): ${c.longDescs.length} · 180 günden eski: ${c.stale.length}

## 3. Query Fan-Out

${f.map((x) => `**${x.query}** (${x.market}) — ${x.answered}/${x.total}${x.missingPages.length ? ` · eksik sayfa: ${x.missingPages.join(', ')}` : ''}
${list(x.gaps.map((q) => `boşluk: ${q}`), '- boşluk yok')}`).join('\n\n')}

${gscSection(gsc, prev?.gsc)}
${technicalSection(t)}`;
}
