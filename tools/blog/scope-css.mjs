/* ═══════════════════════════════════════════════════════════════════
   Eski blog yazılarının satır içi <style> bloğunu yeni tasarıma taşır.

   Yazıların içindeki özel bileşenler (karşılaştırma kartı, akış adımı,
   sohbet balonu…) korunur; bunların kuralları `.legacy` altına alınır.
   Yeni tasarımın üstlendiği her şey atılır:
     • sayfa iskeleti  — html, body, *, :root, nav, header, footer, hero, cta
     • tipografi       — yalnız etiketten oluşan seçiciler (h2, p, table…)
                         ve sarmalayıcılar (.post-body, .content…)
     • ortak bileşen   — SSS, kısa yanıt, vurgu, ilgili yazılar (css/blog.css)
     • yazı tipi       — font-family bildirimleri (Inter devralınır)
   ═══════════════════════════════════════════════════════════════════ */

/* Yeni tasarımın üstlendiği sınıflar: sayfa iskeleti, hero, eski CTA */
const CHROME_FAMILY = /^\.(nav|brand|footer|hero|cta|breadcrumb|logo)[\w-]*/;
const CHROME_EXACT = /^\.(post-meta|meta|badge|category-badge|post-category|post-date|post-read|post-description|lead-para|container|inner|wrap|content|post-body|post-content|article|toc|lead-para|direct-answer|highlight-box|warning-box|disclaimer-box|stat-box|internal-links|faq|faq-section|faq-item|faq-q|faq-a)(?![\w-])/;
const CHROME_TAG = /^(html|body|:root|nav|header|footer|main|article)(?![\w-])|^\*/;
const isChrome = (sel) => CHROME_TAG.test(sel) || CHROME_FAMILY.test(sel) || CHROME_EXACT.test(sel);

/* Yalnız etiket + sarmalayıcı sınıflardan oluşan seçici: yeni tipografiye bırakılır */
const WRAPPER = '(?:\\.(?:post-body|content|container|article|inner|post-content|hero-post-inner|wrap)|main|article)';
const TYPO = new RegExp(`^(?:${WRAPPER}\\s*[>+~]?\\s*)*[a-z][a-z0-9]*(?:\\s*[>+~]?\\s*[a-z][a-z0-9]*)*(?::{1,2}[a-z-]+(?:\\([^)]*\\))?)*$`, 'i');

const dropSelector = (sel) => isChrome(sel) || TYPO.test(sel);

/* font-family ve !important'sız font kısayolları atılır; geri kalan bildirimler aynen kalır. */
const cleanDecls = (body) => body
  .split(';')
  .filter((d) => d.trim() && !/^\s*font-family\s*:/i.test(d) && !/^\s*font\s*:/i.test(d))
  .join(';');

/* Üst düzey blokları ayırır: { … } dengeli. */
function blocks(css) {
  const out = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open === -1) break;
    let depth = 1;
    let j = open + 1;
    while (j < css.length && depth) { if (css[j] === '{') depth++; else if (css[j] === '}') depth--; j++; }
    out.push({ prelude: css.slice(i, open).trim(), body: css.slice(open + 1, j - 1) });
    i = j;
  }
  return out;
}

export function scopeCss(css, scope = '.legacy') {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, '');
  return blocks(src).map(({ prelude, body }) => {
    if (/^@(media|supports)/i.test(prelude)) {
      const inner = scopeCss(body, scope);
      return inner ? `${prelude}{${inner}}` : '';
    }
    if (/^@keyframes|^@-webkit-keyframes/i.test(prelude)) return `${prelude}{${body}}`;
    if (prelude.startsWith('@')) return '';
    const kept = prelude.split(',').map((s) => s.trim()).filter((s) => s && !dropSelector(s));
    const decls = cleanDecls(body);
    if (!kept.length || !decls.trim()) return '';
    return `${kept.map((s) => `${scope} ${s}`).join(',')}{${decls}}`;
  }).filter(Boolean).join('\n');
}
