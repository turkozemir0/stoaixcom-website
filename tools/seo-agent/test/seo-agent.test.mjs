import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeHref, clickDepth } from '../lib/site.mjs';
import { infoGain, answerFirst } from '../lib/content.mjs';
import { coverage } from '../lib/fanout.mjs';
import { analyze, windows } from '../lib/gsc.mjs';
import { structure } from '../lib/checks.mjs';
import { clusterOf, FALLBACK_CLUSTER } from '../../seo/topical-map.mjs';
import { withClusterBox, CLUSTER_START, CLUSTER_END } from '../../seo/articles.mjs';

const page = (path, links, html = '') => [path, { path, html, links: new Set(links) }];

test('normalizeHref folds .html, trailing slash and host variants into one path', () => {
  assert.equal(normalizeHref('https://www.stoaix.com/klinik-crm.html'), '/klinik-crm');
  assert.equal(normalizeHref('/blog/'), '/blog');
  assert.equal(normalizeHref('https://calendly.com/x'), null);
});

test('clickDepth counts clicks from home and leaves unreachable pages out', () => {
  const pages = new Map([page('/', ['/a']), page('/a', ['/b']), page('/b', []), page('/island', ['/'])]);
  const depth = clickDepth(pages);
  assert.equal(depth.get('/b'), 2);
  assert.equal(depth.has('/island'), false);
});

test('structure ignores ad landing pages when listing unreachable pages', () => {
  const pages = new Map([page('/', []), page('/dis-klinigi-hizli-yanit', []), page('/orphan', [])]);
  assert.deepEqual(structure(pages).unreachable, ['/orphan']);
});

test('infoGain scores specific, first-hand text above consensus filler', () => {
  const commodity = '<main><p>Günümüzde yapay zekâ oldukça önemli ve vazgeçilmez bir araçtır.</p></main>';
  const gain = '<main><p>Kurduğumuz 12 klinikte ilk yanıt 4 dakikadan 40 saniyeye indi; cevapsız arama %31 azaldı. Bunu sahada ölçtük.</p></main>';
  assert.ok(infoGain(gain).score > infoGain(commodity).score);
  assert.equal(infoGain(commodity).firstHand, 0);
});

test('answerFirst flags a question heading followed by a long paragraph', () => {
  const long = Array(80).fill('kelime').join(' ');
  const html = `<main><h2>Ne kadar?</h2><p>Aylık $300.</p><h2>Nasıl çalışır?</h2><p>${long}</p></main>`;
  const r = answerFirst(html);
  assert.equal(r.total, 2);
  assert.equal(r.misses.length, 1);
});

test('fan-out coverage reports unanswered sub-questions and missing pages', () => {
  const pages = new Map([page('/x', [], '<main>KVKK uyumlu, aylık $300</main>')]);
  const r = coverage({ query: 'q', market: 'tr', pages: ['/x', '/nope'], fan: [
    { q: 'kvkk?', match: ['kvkk'] }, { q: 'dil?', match: ['arapça'] },
  ] }, pages);
  assert.equal(r.answered, 1);
  assert.deepEqual(r.gaps, ['dil?']);
  assert.deepEqual(r.missingPages, ['/nope']);
});

test('GSC analyze picks striking-distance queries in positions 4–15 only', () => {
  const row = (q, pos, impr) => ({ keys: [q, 'https://stoaix.com/p'], clicks: 1, impressions: impr, ctr: 0.01, position: pos });
  const r = analyze([row('top', 2, 500), row('near', 8, 300), row('far', 30, 900), row('thin', 9, 5)], []);
  assert.deepEqual(r.striking.map((x) => x.query), ['near']);
});

test('GSC windows are two consecutive 28-day ranges ending 3 days ago', () => {
  const w = windows(new Date('2026-11-15T00:00:00Z'));
  assert.deepEqual(w.cur, ['2026-10-16', '2026-11-12']);
  assert.equal(w.prev[1], '2026-10-15');
});

test('clusterOf routes slugs to their product hub and unknowns to the fallback', () => {
  assert.equal(clusterOf('dis-klinigi-no-show-azaltma'), 'reminders');
  assert.equal(clusterOf('ai-chatbot-crm-baglantisi'), 'chatbot');
  assert.equal(clusterOf('saglik-turizmi-ai-resepsiyonist'), 'st-yapay-zeka');
  assert.equal(clusterOf('ozel-klinik-finansal-yonetim-rehberi'), FALLBACK_CLUSTER);
});

test('withClusterBox inserts once and replaces on later builds (idempotent)', () => {
  const html = '<section><article>x</article>\n</section><footer></footer>';
  const box = (n) => `${CLUSTER_START}\n<p>${n}</p>\n${CLUSTER_END}`;
  const once = withClusterBox(html, box(1));
  const twice = withClusterBox(once, box(2));
  assert.equal(withClusterBox(once, box(1)), once);
  assert.equal(twice.split(CLUSTER_START).length, 2);
  assert.match(twice, /<p>2<\/p>/);
});
