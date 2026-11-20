/* Yayın öncesi kalite kapısı — eklenen metni tarar (GEOFlow + notfair veto mantığı).
   blocked     → push yok; kural ihlali (yasaklı kelime, sağlık reklamı vaadi)
   needs_review→ push olur, PR'da insan onayı ister (kaynaksız rakam, abartı, dolgu)
   passed      → temiz
   Puan 100'den düşer: ≥85 passed, ≥70 needs_review, altı blocked. */

export const PASS = 85;
export const REVIEW = 70;
const REVIEW_COST = 5;

/* Kesin kurallar (RUNBOOK): Türkçe metinde "ajan/agent" yok; sağlık reklamı yönetmeliği */
const BLOCK_RULES = [
  { id: 'ajan', re: /\bajan(?:ı|lar|lık|ımız)?\b/i, why: '"ajan" denmez: asistan / ekip üyesi', trOnly: false },
  { id: 'agent-tr', re: /\bagent(?:s|lar)?\b/i, why: 'Türkçe metinde "agent" denmez', trOnly: true },
  { id: 'tedavi-vaadi', re: /\b(kesin (?:sonuç|tedavi)|garantili tedavi|mucize|ağrısız garantisi|guaranteed (?:results|cure)|miracle)\b/i, why: 'sağlık reklamında sonuç vaadi yasak' },
];

/* İnsan bakmalı: kaynaksız rakam, üstünlük iddiası, dolgu */
const REVIEW_RULES = [
  { id: 'abartı', re: /\b(en iyi|bir numara|1 numara|lider|türkiye'nin en|the best|#1|number one|world-class|industry-leading)\b/i, why: 'kanıtsız üstünlük iddiası' },
  { id: 'dolgu', re: /\b(günümüzde|son yıllarda|dijital çağda|in today'?s (?:digital )?(?:world|landscape)|game[- ]changer|revolutioniz)/i, why: 'dolgu cümle (Information Gain sıfır)' },
  { id: 'belirsiz-kaynak', re: /\b(uzmanlar(?:a göre)?|araştırmalar gösteriyor|experts say|studies show)\b/i, why: 'kaynak adı yok' },
];

const CLAIM = /(?:%\s?\d+(?:[.,]\d+)?|\d+(?:[.,]\d+)?\s?%|\d+(?:[.,]\d+)?\s?[x×]\b|\d{1,3}(?:[.,]\d{3})+\+?)/g;

/* Kod yorumu ve dosya yolu metin değildir (ör. "tools/seo-agent") */
const stripCode = (line) => line
  .replace(/\/\*.*?(\*\/|$)|^\s*\*.*$|(^|\s)\/\/.*$/g, ' ')
  .replace(/[\w.-]*\/[\w./-]+/g, ' ');

export const textOf = (line) => stripCode(line)
  .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

/* lines: [{ file, text, tr, linked }] — linked: aynı satırda kaynak linki var mı */
export function gate(lines, allowedNumbers = new Set()) {
  const findings = [];
  for (const l of lines) {
    for (const r of BLOCK_RULES) {
      if (r.trOnly && !l.tr) continue;
      if (r.re.test(l.text)) findings.push({ level: 'blocked', rule: r.id, why: r.why, file: l.file, text: l.text.slice(0, 140) });
    }
    for (const r of REVIEW_RULES) {
      if (r.re.test(l.text)) findings.push({ level: 'needs_review', rule: r.id, why: r.why, file: l.file, text: l.text.slice(0, 140) });
    }
    const claims = (l.text.match(CLAIM) || []).filter((c) => !allowedNumbers.has(c.replace(/[^\d]/g, '')));
    if (claims.length && !l.linked) {
      findings.push({ level: 'needs_review', rule: 'kaynaksız-rakam', why: `kaynaksız rakam: ${claims.join(', ')}`, file: l.file, text: l.text.slice(0, 140) });
    }
  }
  const reviews = findings.filter((f) => f.level === 'needs_review').length;
  const blocked = findings.some((f) => f.level === 'blocked');
  const score = blocked ? 0 : Math.max(0, 100 - reviews * REVIEW_COST);
  const status = blocked || score < REVIEW ? 'blocked' : score < PASS ? 'needs_review' : 'passed';
  return { status, score, findings };
}

/* git diff -U0 çıktısından eklenen satırlar; aynı satır (şablon değişikliği) bir kez sayılır */
export function addedLines(diff) {
  const out = [];
  const seen = new Set();
  let file = null;
  for (const raw of diff.split('\n')) {
    if (raw.startsWith('+++ ')) { file = raw.replace(/^\+\+\+ (b\/)?/, ''); continue; }
    if (!raw.startsWith('+') || !file) continue;
    const line = raw.slice(1);
    const text = textOf(line);
    if (text.length < 12 || seen.has(text)) continue;
    seen.add(text);
    out.push({ file, text, linked: /href="https?:\/\/(?!(?:www\.)?stoaix\.com)/.test(line) });
  }
  return out;
}
