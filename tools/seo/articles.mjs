/* Blog yazılarının özet listesi + küme bağlantı blokları.
   Konu haritası (topical-map.mjs) hangi yazının hangi hub'a ait olduğunu söyler;
   burada iki yönlü bağ kurulur:
     • hub sayfası → kümedeki yazılar  (articlesSection, build-seo)
     • yazı → hub + kardeşleri          (clusterBox, migrate-blog-v2)
   Kaynak blog/*.html; yeni yazı eklendiğinde `npm run site` kendiliğinden günceller. */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { esc } from '../v2-chrome.mjs';
import { clusterOf, siblingsOf, marketForLang, FALLBACK_CLUSTER, ROOT_PAGES } from './topical-map.mjs';
import { HUB, byId, marketsOf, contentFor, pathFor } from './catalog.mjs';

const MAX_PER_HUB = 8;

const COPY = {
  tr: { listH: 'Bu konuda yazılar', boxH: 'Bu yazı şu konunun parçası', more: 'Aynı konuda' },
  en: { listH: 'Further reading', boxH: 'This article is part of', more: 'More on this topic' },
  de: { listH: 'Weiterlesen', boxH: 'Teil des Themas', more: 'Mehr zum Thema' },
};

const clean = (s) => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

export function parseArticle(html, slug, dir = '/blog') {
  const lang = /<html lang="en/.test(html) ? 'en' : 'tr';
  const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html);
  const title = h1 ? clean(h1[1]) : slug;
  return { slug, path: `${dir}/${slug}`, title, lang, isPost: dir === '/blog' };
}

export function loadArticles(root) {
  const dir = join(root, 'blog');
  if (!existsSync(dir)) return [];
  const posts = readdirSync(dir)
    .filter((f) => f.endsWith('.html') && f !== 'index.html')
    .sort()
    .map((f) => parseArticle(readFileSync(join(dir, f), 'utf8'), f.replace(/\.html$/, '')));
  const pages = ROOT_PAGES
    .filter((slug) => existsSync(join(root, `${slug}.html`)))
    .map((slug) => parseArticle(readFileSync(join(root, `${slug}.html`), 'utf8'), slug, ''));
  /* Tanım sayfaları önce: hub listesinde ilk onlar görünsün */
  return [...pages, ...posts];
}

/* Yazının hub'ı: kümesinin o pazarda sayfası yoksa genel asistanlar hub'ı */
export function hubFor(article) {
  const m = marketForLang(article.lang);
  const id = clusterOf(article.slug);
  const item = id === FALLBACK_CLUSTER ? HUB : byId(id);
  return { item: marketsOf(item).includes(m) ? item : HUB, m };
}

/* Bir hub sayfasında listelenecek yazılar (aynı dil, en fazla MAX_PER_HUB) */
export function articlesFor(articles, item, m) {
  const lang = m === 'tr' ? 'tr' : m === 'de' ? 'de' : 'en';
  return articles
    .filter((a) => a.lang === lang && hubFor(a).item === item)
    .slice(0, MAX_PER_HUB);
}

export function articlesSection(articles, item, m) {
  const list = articlesFor(articles, item, m);
  if (!list.length) return '';
  const t = COPY[m === 'tr' ? 'tr' : m === 'de' ? 'de' : 'en'];
  return `
<!-- ═══ KÜME YAZILARI ═════════════════════════════════════════ -->
<section class="pad related">
  <div class="sec-head">
    <h2>${esc(t.listH)}</h2>
  </div>
  <ul class="cluster-list">
    ${list.map((a) => `<li><a href="${a.path}">${esc(a.title)}</a></li>`).join('\n    ')}
  </ul>
</section>
`;
}

/* Yazının altına konan küme kutusu; işaretleri sayesinde her derlemede yenilenir */
export const CLUSTER_START = '<!-- ═══ KÜME (tools/seo/articles.mjs) -->';
export const CLUSTER_END = '<!-- ═══ /KÜME -->';

export function clusterBox(articles, article) {
  const { item, m } = hubFor(article);
  const t = COPY[article.lang];
  const hub = contentFor(item, m);
  const sibs = siblingsOf(articles, article);
  return `${CLUSTER_START}
<section class="pad post-cluster">
  <p class="eyebrow">${esc(t.boxH)}</p>
  <p class="cluster-hub"><a href="${pathFor(item, m)}">${esc(hub.name)} →</a></p>
  ${sibs.length ? `<p class="eyebrow">${esc(t.more)}</p>
  <ul class="cluster-list">
    ${sibs.map((a) => `<li><a href="${a.path}">${esc(a.title)}</a></li>`).join('\n    ')}
  </ul>` : ''}
</section>
${CLUSTER_END}`;
}

const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* Kutu yoksa yazı bölümünden hemen sonra ekler, varsa yenisiyle değiştirir */
export function withClusterBox(html, box) {
  const re = new RegExp(`${escRe(CLUSTER_START)}[\\s\\S]*?${escRe(CLUSTER_END)}`);
  if (re.test(html)) return html.replace(re, () => box);
  return html.replace(/(<\/article>\s*<\/section>)/, (m) => `${m}\n${box}`);
}
