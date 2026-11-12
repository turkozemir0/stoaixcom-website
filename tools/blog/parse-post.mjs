/* ═══════════════════════════════════════════════════════════════════
   Eski blog yazısını okur, yeni şablonun ihtiyaç duyduğu parçalara ayırır.

   Yazılar ~12 farklı şablonla üretildi ama iskelet hep aynı:
     nav → hero (h1 + kategori + özet + tarih) → gövde sarmalayıcısı
     (.post-body | main.content | article | .container) → [CTA] → footer
   Gövdenin içindeki eski CTA kutuları, betikler ve stiller atılır;
   geri kalan HTML olduğu gibi taşınır.
   ═══════════════════════════════════════════════════════════════════ */

import { parseDocument } from 'htmlparser2';
import * as du from 'domutils';
import render from 'dom-serializer';
import { scopeCss } from './scope-css.mjs';

const hasClass = (el, re) => el.type === 'tag' && re.test(el.attribs.class || '');
const text = (el) => (el ? du.textContent(el).replace(/\s+/g, ' ').trim() : '');
const inner = (el) => render(el.children, { decodeEntities: false }).trim();
const find = (root, test) => du.findOne(test, root.children ?? root, true);
const meta = (head, attr, value) => {
  const el = find(head, (e) => e.name === 'meta' && e.attribs[attr] === value);
  return el ? el.attribs.content : null;
};

/* Gövdeden atılan parçalar: eski CTA'lar, betikler, gömülü stiller */
const DROP = (el) => el.type === 'script' || el.type === 'style' || el.name === 'script' || el.name === 'style'
  || hasClass(el, /(^| )(cta-box|cta-strip|cta-section|cta|action-box|start-box)( |$)/);

const BODY_WRAP = (e) => hasClass(e, /(^| )(post-body|content|container)( |$)/) || e.name === 'article' || (e.name === 'main' && !e.attribs.id);

function readHead(head) {
  const ld = du.findAll((e) => e.name === 'script' && e.attribs.type === 'application/ld+json', head.children)
    .map((e) => JSON.parse(du.textContent(e)));
  const alternates = du.findAll((e) => e.name === 'link' && e.attribs.rel === 'alternate' && e.attribs.hreflang, head.children)
    .map((e) => ({ hreflang: e.attribs.hreflang, href: e.attribs.href }));
  const canonical = find(head, (e) => e.name === 'link' && e.attribs.rel === 'canonical');
  return {
    title: text(find(head, (e) => e.name === 'title')),
    desc: meta(head, 'name', 'description') || '',
    canonical: canonical ? canonical.attribs.href : null,
    robots: meta(head, 'name', 'robots'),
    alternates,
    ld,
    css: du.findAll((e) => e.name === 'style', head.children).map((e) => du.textContent(e)).join('\n'),
  };
}

/* Hero: h1'in bulunduğu blok. Kategori, özet ve bilgi satırı sınıf adlarından okunur. */
function readHero(body) {
  const h1 = find(body, (e) => e.name === 'h1');
  if (!h1) throw new Error('h1 yok');
  /* h1'e en yakın "hero" sınıflı ata; yoksa doğrudan ebeveyni */
  let hero = h1.parent;
  for (let a = h1.parent; a && a.name !== 'body'; a = a.parent) if (hasClass(a, /hero|article-meta/)) { hero = a; break; }
  if (hero.name === 'body') hero = h1;
  const pick = (re) => text(find(hero, (e) => hasClass(e, re)));
  return {
    node: hero,
    h1: inner(h1),
    category: pick(/(^| )(post-category|category-badge|badge|hero-label)( |$)/),
    lede: pick(/(^| )(hero-lead|hero-desc|post-description|lead|hero-sub|subtitle|hero-subtitle|article-lead|intro)( |$)/),
    metaLine: pick(/(^| )(post-meta|meta|hero-meta)( |$)/),
  };
}

function clean(nodes) {
  du.findAll(DROP, nodes).forEach((e) => du.removeElement(e));
  du.filter((e) => e.type === 'script' || e.type === 'style', nodes, true).forEach((e) => du.removeElement(e));
  /* Hero'nun gövdenin içinde kaldığı şablonlarda (ör. .container) h1'i tekrarlama */
  du.findAll((e) => e.name === 'h1', nodes).forEach((e) => du.removeElement(e));
}

function readBody(body, heroNode) {
  const wrap = find(body, (e) => BODY_WRAP(e) && e !== heroNode && !du.existsOne((x) => x === e, heroNode.children ?? []));
  if (!wrap) throw new Error('gövde sarmalayıcısı yok');
  clean(wrap.children);
  return inner(wrap);
}

/* Açılış sayfası düzeni: hero'dan sonraki kardeş bloklar (nav, CTA, footer hariç) */
const PAGE_CHROME = (e) => e.type !== 'tag' || ['nav', 'footer', 'script', 'style', 'noscript'].includes(e.name)
  || hasClass(e, /(^| )(mobile-menu|cta-section|cta-strip|cta-box)( |$)/);

function readSiblings(heroNode) {
  const siblings = heroNode.parent.children;
  const after = siblings.slice(siblings.indexOf(heroNode) + 1).filter((e) => !PAGE_CHROME(e));
  if (!after.length) throw new Error('hero sonrası içerik yok');
  clean(after);
  return render(after, { decodeEntities: false }).trim();
}

const READ_TIME = /(\d+)\s*(dk|dak|dakika|min|minute)s?\.?\s*(okuma|read)?/i;

export function parsePost(html, { siblings = false } = {}) {
  const doc = parseDocument(html, { decodeEntities: false });
  const htmlEl = find(doc, (e) => e.name === 'html');
  const head = find(doc, (e) => e.name === 'head');
  const body = find(doc, (e) => e.name === 'body');
  const h = readHead(head);
  const hero = readHero(body);
  const content = siblings ? readSiblings(hero.node) : readBody(body, hero.node);
  const article = h.ld.flatMap((x) => (x['@graph'] ? x['@graph'] : [x]))
    .find((x) => /Article|BlogPosting/.test(x['@type']));
  const rt = (hero.metaLine.match(READ_TIME) || [])[1];
  return {
    lang: (htmlEl.attribs.lang || 'tr').toLowerCase().startsWith('en') ? 'en' : 'tr',
    htmlLang: htmlEl.attribs.lang || 'tr',
    ...h,
    css: scopeCss(h.css),
    hero,
    content,
    published: article?.datePublished?.slice(0, 10) || null,
    modified: article?.dateModified?.slice(0, 10) || article?.datePublished?.slice(0, 10) || null,
    readMinutes: rt ? Number(rt) : null,
    hasArticleLd: Boolean(article),
  };
}
