/* ═══════════════════════════════════════════════════════════════════
   Rehber yazıları için küçük Markdown → HTML dönüştürücü.
   Yalnız yazılarda kullandığımız parçalar: ## / ### başlık, paragraf,
   - ve 1. listeler, > alıntı, | tablo |, **kalın**, *eğik*, [bağlantı](/yol).
   Bağımlılık yok; çıktı .prose stillerine oturur.
   ═══════════════════════════════════════════════════════════════════ */

import { esc } from '../v2-chrome.mjs';

export const slugify = (s) => s.toLowerCase()
  .replace(/[ıİ]/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/ß/g, 'ss').replace(/ä/g, 'a')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function inline(text) {
  return esc(text)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, href) => `<a href="${href}">${t}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
}

const isTableRow = (l) => /^\|.*\|$/.test(l.trim());
const cells = (l) => l.trim().slice(1, -1).split('|').map((c) => c.trim());

function table(rows) {
  const [head, , ...body] = rows;
  return `<table>
<thead><tr>${cells(head).map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>
<tbody>
${body.map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('\n')}
</tbody>
</table>`;
}

/* Blok blok okur; boş satır bloğu bitirir. */
export function toHtml(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  const out = [];
  let i = 0;
  const take = (test) => {
    const block = [];
    while (i < lines.length && lines[i].trim() && test(lines[i])) block.push(lines[i++]);
    return block;
  };
  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();
    if (!t) { i++; continue; }
    const h = /^(#{2,4})\s+(.*)$/.exec(t);
    if (h) {
      const level = h[1].length;
      out.push(`<h${level} id="${slugify(h[2])}">${inline(h[2])}</h${level}>`);
      i++;
    } else if (isTableRow(t)) {
      out.push(table(take((l) => isTableRow(l))));
    } else if (/^>\s?/.test(t)) {
      const quote = take((l) => /^>\s?/.test(l.trim())).map((l) => l.trim().replace(/^>\s?/, ''));
      out.push(`<blockquote>${quote.join('\n').split(/\n{2,}|\n(?=\S)/).filter(Boolean).map((p) => `<p>${inline(p)}</p>`).join('')}</blockquote>`);
    } else if (/^[-*]\s+/.test(t)) {
      const items = take((l) => /^[-*]\s+/.test(l.trim())).map((l) => l.trim().replace(/^[-*]\s+/, ''));
      out.push(`<ul>\n${items.map((x) => `<li>${inline(x)}</li>`).join('\n')}\n</ul>`);
    } else if (/^\d+\.\s+/.test(t)) {
      const items = take((l) => /^\d+\.\s+/.test(l.trim())).map((l) => l.trim().replace(/^\d+\.\s+/, ''));
      out.push(`<ol>\n${items.map((x) => `<li>${inline(x)}</li>`).join('\n')}\n</ol>`);
    } else {
      const para = take((l) => !/^(#{2,4}\s|>|[-*]\s|\d+\.\s|\|)/.test(l.trim()));
      out.push(`<p>${inline(para.map((l) => l.trim()).join(' '))}</p>`);
    }
  }
  return out.join('\n');
}

/* "## Sık sorulan sorular" altındaki ### soru + paragraf çiftleri → FAQPage */
const FAQ_HEAD = /^##\s+(Sık sorulan sorular|Frequently asked questions|Häufige Fragen)\s*$/im;

export function faqOf(md) {
  const at = md.search(FAQ_HEAD);
  if (at < 0) return [];
  const rest = md.slice(at).split('\n').slice(1);
  const end = rest.findIndex((l) => /^##\s/.test(l));
  const block = (end < 0 ? rest : rest.slice(0, end)).join('\n');
  return block.split(/^###\s+/m).slice(1).map((chunk) => {
    const [q, ...a] = chunk.split('\n');
    return { q: q.trim(), a: a.join(' ').replace(/\s+/g, ' ').replace(/\*\*|\[|\]\([^)]*\)/g, '').trim() };
  }).filter((x) => x.q && x.a);
}

export const plainWords = (md) => md.replace(/[#>*|[\]()-]/g, ' ').split(/\s+/).filter(Boolean).length;
