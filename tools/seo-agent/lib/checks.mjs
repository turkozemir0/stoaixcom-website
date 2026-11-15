/* Denetimin tamamı: yapı + içerik + küme + fan-out. Saf fonksiyon; ağ yok.
   Çıktı JSON'u rapora ve bir sonraki haftanın karşılaştırmasına girer. */
import { clickDepth, inboundCounts } from './site.mjs';
import { infoGain, answerFirst, meta } from './content.mjs';
import { coverage } from './fanout.mjs';
import { citability } from './citability.mjs';
import { snapshot, drift, hreflangIssues, eeat, orgSameAs } from './technical.mjs';
import { crawlerAccess } from './robots.mjs';

export const MAX_DEPTH = 3;
const TITLE_MAX = 65;
const DESC_MAX = 165;
const STALE_DAYS = 180;
/* Reklam açılış sayfaları: bilinçli olarak site içinden linklenmez */
const AD_LANDING = /-(hizli-yanit|eski-lead-canlandirma)$|^\/(reklam|reklam-en|media)$/;


export function structure(pages) {
  const depth = clickDepth(pages);
  const inbound = inboundCounts(pages);
  const all = [...pages.keys()];
  const unreachable = all.filter((p) => !depth.has(p) && !AD_LANDING.test(p));
  const tooDeep = all.filter((p) => depth.get(p) > MAX_DEPTH);
  const noInbound = all.filter((p) => p !== '/' && !inbound.get(p) && !AD_LANDING.test(p));
  const dist = {};
  for (const d of depth.values()) dist[d] = (dist[d] || 0) + 1;
  return { pages: all.length, depthDist: dist, unreachable, tooDeep, noInbound };
}

/* moneyPaths: ürün / niyet / hub yolları (catalog.allPages) — ilk Information Gain turu bunlarla */
export function content(pages, moneyPaths = new Set(), today = new Date()) {
  const rows = [];
  for (const { path, html } of pages.values()) {
    const m = meta(html);
    if (m.noindex) continue;
    const ig = infoGain(html);
    const af = answerFirst(html);
    const cite = citability(html);
    const ageDays = m.modified ? Math.floor((today - new Date(m.modified)) / 86400000) : null;
    rows.push({
      path, money: moneyPaths.has(path), ...ig,
      answerQs: af.total, answerMisses: af.misses.length,
      titleLen: m.title.length, descLen: m.desc.length, faq: m.hasFaqSchema, ageDays,
      cite: cite.best, citeTop: cite.bestInTop,
    });
  }
  const money = rows.filter((r) => r.money);
  return {
    rows,
    avgScore: avg(rows.map((r) => r.score)),
    moneyAvgScore: avg(money.map((r) => r.score)),
    withFirstHand: rows.filter((r) => r.firstHand > 0).length,
    lowestMoney: [...money].sort((a, b) => a.score - b.score).slice(0, 10),
    citeAvgMoney: avg(money.map((r) => r.cite)),
    lowestCite: [...money].sort((a, b) => a.cite - b.cite).slice(0, 10),
    citeNotInTop: money.filter((r) => !r.citeTop).length,
    answerFirstMisses: rows.filter((r) => r.answerMisses > 0).sort((a, b) => b.answerMisses - a.answerMisses).slice(0, 10),
    longTitles: rows.filter((r) => r.titleLen > TITLE_MAX).map((r) => r.path),
    longDescs: rows.filter((r) => r.descLen > DESC_MAX).map((r) => r.path),
    stale: rows.filter((r) => r.ageDays !== null && r.ageDays > STALE_DAYS).map((r) => r.path),
  };
}

export function clusters(articles, clusterOf, fallback) {
  const sizes = {};
  for (const a of articles) {
    const c = clusterOf(a.slug);
    sizes[c] = (sizes[c] || 0) + 1;
  }
  return { sizes, unassigned: articles.filter((a) => clusterOf(a.slug) === fallback).map((a) => a.path) };
}

/* Teknik: tarayıcılar, hreflang, E-E-A-T, drift. prevSnapshot geçen haftanın fotoğrafı. */
export function technical(pages, robotsText, articlePaths, prevSnapshot = null) {
  const snaps = Object.fromEntries([...pages].map(([p, { html }]) => [p, snapshot(html)]));
  const posts = articlePaths.filter((p) => pages.has(p)).map((p) => ({ path: p, ...eeat(pages.get(p).html) }));
  const changes = prevSnapshot ? drift(prevSnapshot, snaps) : [];
  return {
    snapshot: snaps,
    robots: crawlerAccess(robotsText),
    hreflang: hreflangIssues(snaps).filter((i) => !i.minor),
    hreflangNoDefault: hreflangIssues(snaps).filter((i) => i.minor).length,
    eeat: {
      posts: posts.length,
      noAuthor: posts.filter((p) => !p.author).map((p) => p.path),
      noAuthorUrl: posts.filter((p) => p.author && !p.authorUrl).length,
      noVisibleDate: posts.filter((p) => !p.visibleDate).map((p) => p.path),
      badDateOrder: posts.filter((p) => !p.dateOrderOk).map((p) => p.path),
      orgSameAs: pages.has('/') ? orgSameAs(pages.get('/').html) : false,
    },
    drift: {
      hasBaseline: Boolean(prevSnapshot),
      critical: changes.filter((c) => c.level === 'CRITICAL'),
      warning: changes.filter((c) => c.level === 'WARNING'),
      info: changes.filter((c) => c.level === 'INFO').length,
    },
  };
}

export const fanout = (entries, pages) => entries.map((e) => coverage(e, pages));

const avg = (xs) => (xs.length ? Math.round((xs.reduce((s, x) => s + x, 0) / xs.length) * 10) / 10 : 0);
