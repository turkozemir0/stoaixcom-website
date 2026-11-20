import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crawlerAccess, isAllowed, parseRobots } from '../lib/robots.mjs';
import { scorePassage, citability, grade } from '../lib/citability.mjs';
import { snapshot, drift, hreflangIssues, eeat } from '../lib/technical.mjs';
import { gate, addedLines } from '../lib/gate.mjs';
import { analyze } from '../lib/gsc.mjs';

test('robots: a bot named in its own group ignores the * group', () => {
  const groups = parseRobots('User-agent: *\nDisallow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\nDisallow: /admin/\n');
  assert.equal(isAllowed(groups, 'OAI-SearchBot', '/blog'), true);
  assert.equal(isAllowed(groups, 'OAI-SearchBot', '/admin/x'), false);
  assert.equal(isAllowed(groups, 'GPTBot', '/'), false);
});

test('robots: blocked search crawler is reported, blocked training crawler is only policy', () => {
  const r = crawlerAccess('User-agent: *\nAllow: /\n\nUser-agent: PerplexityBot\nUser-agent: GPTBot\nDisallow: /\n');
  assert.deepEqual(r.blockedSearch, ['PerplexityBot']);
  assert.equal(r.training.find((b) => b.bot === 'GPTBot').allowed, false);
});

const para = (n, s) => Array.from({ length: n }, () => s).join(' ');

test('citability: a self-contained definition passage outscores a pronoun-led one', () => {
  const good = `AI resepsiyonist, kliniğe gelen mesajlara 7/24 cevap veren bir yazılımdır. ${para(12, 'Klinik WhatsApp hattına gelen soru 30 saniyede cevaplanır ve randevu takvime yazılır.')}`;
  const bad = para(14, 'Bu da onu çok iyi yapar ve onlar bunu sever.');
  assert.ok(scorePassage(good, 'AI resepsiyonist nedir?').score > scorePassage(bad).score + 20);
  assert.equal(grade(85), 'A');
  assert.equal(grade(20), 'F');
});

test('citability: finds whether a strong passage sits in the top 30% of the page', () => {
  const block = (h, t) => `<h2>${h}</h2><p>${t}</p>`;
  const strong = `AI resepsiyonist, kliniğe gelen mesajlara 7/24 cevap veren bir yazılımdır. ${para(12, 'Klinik WhatsApp hattına gelen soru 30 saniyede cevaplanır ve randevu takvime yazılır.')}`;
  const weak = para(30, 'Bu da onu çok iyi yapar ve onlar bunu sever.');
  const top = citability(`<main>${block('AI resepsiyonist nedir?', strong)}${block('Diğer', weak)}${block('Daha', weak)}${block('Son', weak)}</main>`);
  const bottom = citability(`<main>${block('A', weak)}${block('B', weak)}${block('C', weak)}${block('AI resepsiyonist nedir?', strong)}</main>`);
  assert.equal(top.bestInTop, true);
  assert.equal(bottom.bestInTop, false);
});

const page = (extra = '') => `<title>T</title><meta name="description" content="D"><link rel="canonical" href="https://stoaix.com/a">${extra}<h1>Başlık</h1><script type="application/ld+json">{"@type": "Article"}</script>`;

test('drift: noindex and canonical changes are CRITICAL, title change is WARNING', () => {
  const before = { '/a': snapshot(page()), '/gone': snapshot(page()) };
  const after = { '/a': snapshot(page('<meta name="robots" content="noindex">').replace('<title>T', '<title>T2').replace('/a"', '/b"')) };
  const levels = drift(before, after).map((d) => `${d.level}:${d.what.split(':')[0]}`);
  assert.ok(levels.includes('CRITICAL:noindex eklendi'));
  assert.ok(levels.includes('CRITICAL:canonical değişti'));
  assert.ok(levels.includes("CRITICAL:sayfa sitemap'ten düştü"));
  assert.ok(levels.includes('WARNING:başlık değişti'));
});

test('hreflang: flags invalid codes, missing x-default and missing return links', () => {
  const alt = (pairs) => pairs.map(([c, u]) => `<link rel="alternate" hreflang="${c}" href="https://stoaix.com${u}">`).join('');
  const snaps = {
    '/en/x': snapshot(`<link rel="canonical" href="https://stoaix.com/en/x">${alt([['en', '/en/x'], ['en-uk', '/en/x'], ['tr', '/x']])}`),
    '/x': snapshot(`<link rel="canonical" href="https://stoaix.com/x">${alt([['tr', '/x'], ['x-default', '/x']])}`),
  };
  const issues = hreflangIssues(snaps).map((i) => `${i.path} ${i.issue}`);
  assert.ok(issues.includes('/en/x geçersiz kod: en-uk'));
  assert.ok(issues.includes('/en/x x-default yok'));
  assert.ok(issues.includes('/en/x tr dönüş linki yok: /x'));
  assert.ok(!issues.some((i) => i.startsWith('/x ')));
});

test('eeat: reads author, author url, visible date and honest modified date', () => {
  const html = '"author": {"@type": "Person", "name": "Ata", "url": "https://stoaix.com/about"} "datePublished": "2026-04-07" "dateModified": "2026-03-01" <time datetime="2026-04-07">';
  assert.deepEqual(eeat(html), { author: true, authorUrl: true, visibleDate: true, dateOrderOk: false });
});

test('gate: forbidden word blocks, unsourced number needs review, sourced number passes', () => {
  const l = (text, extra = {}) => ({ file: 'x.html', text, tr: true, linked: false, ...extra });
  assert.equal(gate([l('Klinik için yapay zekâ ajanı kurduk')]).status, 'blocked');
  const r = gate([l('No-show oranı %23 düşer')]);
  assert.equal(r.findings[0].rule, 'kaynaksız-rakam');
  assert.equal(gate([l('No-show oranı %23 düşer', { linked: true })]).status, 'passed');
  assert.equal(gate([l('Aylık 200 dolar, %20 indirim')], new Set(['20', '200'])).status, 'passed');
  assert.equal(gate([l('The agent replies', { tr: false })]).status, 'passed');
});

test('gate: addedLines skips code comments, file paths and repeated template lines', () => {
  const diff = [
    '+++ b/tools/seo/x.mjs',
    '+/* SEO asistanı (tools/seo-agent) raporlar */',
    '+++ b/a.html', '+<p>Kliniğiniz için yeni bir cümle.</p>',
    '+++ b/b.html', '+<p>Kliniğiniz için yeni bir cümle.</p>',
  ].join('\n');
  const lines = addedLines(diff);
  assert.equal(lines.length, 1);
  assert.equal(lines[0].file, 'a.html');
});

test('GSC analyze finds CTR anomalies, decaying pages and cannibalization', () => {
  const row = (q, page, pos, impr, clicks, ctr = clicks / impr) => ({ keys: [q, `https://stoaix.com${page}`], clicks, impressions: impr, ctr, position: pos });
  const cur = [row('klinik crm', '/a', 3, 400, 2), row('klinik crm', '/b', 9, 120, 1), row('x', '/c', 6, 30, 3)];
  const prev = [row('klinik crm', '/a', 3, 400, 40), row('eski', '/c', 6, 30, 3)];
  const r = analyze(cur, prev);
  assert.deepEqual(r.ctrAnomalies.map((x) => x.page), ['https://stoaix.com/a']);
  assert.deepEqual(r.decaying.map((x) => x.page), ['https://stoaix.com/a']);
  assert.equal(r.cannibalization[0].query, 'klinik crm');
  assert.equal(r.newQueries, 1);
  assert.equal(r.lostQueries, 1);
});
