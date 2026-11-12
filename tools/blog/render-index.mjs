/* ═══════════════════════════════════════════════════════════════════
   blog/index.html — taşınmış yazıların başlık kartları
   Türkçe ve İngilizce yazılar iki ayrı bölümde, en yeniden eskiye.
   Kart bilgileri yazının kendi head'inden ve hero'sundan okunur.
   ═══════════════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { esc } from '../v2-chrome.mjs';
import { pageHead, pageTail, crumbs, COPY, ORIGIN, GENERATOR } from './render-post.mjs';

const pick = (html, re) => (html.match(re) || [])[1] || '';
const unesc = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const plain = (s) => unesc(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

function readCard(dir, file) {
  const html = readFileSync(join(dir, file), 'utf8');
  if (!html.includes(`content="${GENERATOR}"`)) return null;
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) return null;
  return {
    href: `/blog/${file.replace(/\.html$/, '')}`,
    lang: pick(html, /<html lang="([a-z]+)/),
    title: plain(pick(html, /<h1 class="page-title">([\s\S]*?)<\/h1>/)),
    desc: unesc(pick(html, /<meta name="description" content="([^"]*)"/)),
    category: unesc(pick(html, /<p class="eyebrow">([^<]*)<\/p>/)),
    date: pick(html, /article:published_time" content="([^"]+)"/),
  };
}

const PAGE = {
  title: 'Blog — Özel klinikler için hasta iletişimi ve büyüme rehberleri | STOAIX',
  desc: 'Özel klinik sahipleri için rehberler: kaçan aramalar, WhatsApp takibi, randevu hatırlatma, gelmeyen hasta, yapay zekâ resepsiyonist ve klinik CRM. Türkçe ve İngilizce.',
  eyebrow: 'Blog',
  h1: 'Klinik sahipleri için rehberler',
  lede: 'Hasta iletişimi, randevu, takip ve yapay zekâ asistanları üzerine yazılar. Her yazı tek bir soruya cevap verir.',
  sections: { tr: 'Türkçe yazılar', en: 'In English' },
};

const card = (p) => `
    <a class="post-card" href="${p.href}"${p.lang === 'en' ? ' hreflang="en" lang="en"' : ''}>
      ${p.category ? `<span class="k">${esc(p.category)}</span>` : ''}
      <span class="t">${esc(p.title)}</span>
      <span class="d">${esc(p.desc)}</span>
      ${p.date ? `<span class="m"><time datetime="${p.date}">${p.date}</time></span>` : ''}
    </a>`;

export function renderIndex(dir) {
  const posts = readdirSync(dir).filter((f) => f.endsWith('.html') && f !== 'index.html')
    .map((f) => readCard(dir, f)).filter(Boolean)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
  const byLang = { tr: posts.filter((p) => p.lang === 'tr'), en: posts.filter((p) => p.lang === 'en') };
  const ld = [{
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'STOAIX Blog',
    url: `${ORIGIN}/blog`,
    description: PAGE.desc,
    publisher: { '@type': 'Organization', name: 'STOAIX', url: ORIGIN },
    blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: ORIGIN + p.href, ...(p.date ? { datePublished: p.date } : {}) })),
  }];
  const html = `${pageHead({ lang: 'tr', htmlLang: 'tr', title: PAGE.title, desc: PAGE.desc, canonical: `${ORIGIN}/blog`, ogType: 'website', ld })}
<!-- ═══ HERO ══════════════════════════════════════════════════ -->
<section class="hero page-hero post-hero">
  ${crumbs('tr', [{ name: COPY.tr.home, href: '/' }, { name: 'Blog', href: '/blog' }])}
  <div class="hero-head">
    <p class="eyebrow">${PAGE.eyebrow}</p>
    <div class="proof">${posts.length} yazı</div>
  </div>
  <h1 class="page-title">${esc(PAGE.h1)}</h1>
  <div class="hero-grid">
    <p>${esc(PAGE.lede)}</p>
  </div>
</section>
${Object.entries(byLang).filter(([, list]) => list.length).map(([lang, list]) => `
<section class="pad"${lang === 'en' ? ' lang="en"' : ''}>
  <div class="sec-head">
    <h2>${esc(PAGE.sections[lang])}</h2>
    <span class="note">${list.length}</span>
  </div>
  <div class="post-list">${list.map(card).join('')}
  </div>
</section>`).join('\n')}
${pageTail('tr')}`;
  writeFileSync(join(dir, 'index.html'), html);
  return posts.length;
}
