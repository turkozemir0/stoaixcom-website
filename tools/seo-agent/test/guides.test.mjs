import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toHtml, faqOf } from '../../guides/markdown.mjs';
import { seriesOf, seriesBox, seriesNote } from '../../guides/series.mjs';

test('markdown: an image line becomes a lazy figure with caption', () => {
  const html = toHtml('![Akış şeması](/assets/guides/a.svg "Hasta adayının ilk 72 saati")');
  assert.match(html, /^<figure class="guide-fig">/);
  assert.match(html, /<img src="\/assets\/guides\/a.svg" alt="Akış şeması" loading="lazy" decoding="async" width="1200" height="675">/);
  assert.match(html, /<figcaption>Hasta adayının ilk 72 saati<\/figcaption>/);
});

test('markdown: an image without caption has no figcaption', () => {
  const html = toHtml('![Diyagram](/assets/guides/b.svg)');
  assert.doesNotMatch(html, /figcaption/);
});

test('markdown: external links open safely, internal links stay plain', () => {
  const html = toHtml('Kaynak: [HBR](https://hbr.org/x) ve [CRM](/klinik-crm).');
  assert.match(html, /<a href="https:\/\/hbr.org\/x" rel="noopener">HBR<\/a>/);
  assert.match(html, /<a href="\/klinik-crm">CRM<\/a>/);
});

test('faq: questions under the FAQ heading become pairs', () => {
  const faq = faqOf('## Giriş\nmetin\n\n## Sık sorulan sorular\n\n### Soru bir?\nCevap bir.\n\n### Soru iki?\nCevap iki.\n\n## Son\nx');
  assert.deepEqual(faq.map((f) => f.q), ['Soru bir?', 'Soru iki?']);
});

const guide = (id, part, slug) => ({
  id,
  versions: { tr: { lang: 'tr', series: 'aday', part: String(part), slug, h1: `Başlık ${part}` } },
});

test('series: members are grouped per language and ordered by part', () => {
  const guides = [guide('c2', 2, 'iki'), guide('p', 0, 'ana'), guide('c1', 1, 'bir'), { id: 'x', versions: { tr: { lang: 'tr', slug: 'yalniz' } } }];
  const s = seriesOf(guides, guides[0].versions.tr);
  assert.deepEqual(s.map((v) => v.slug), ['ana', 'bir', 'iki']);
  assert.deepEqual(seriesOf(guides, guides[3].versions.tr), []);
});

test('series: box links every member except the current page', () => {
  const guides = [guide('p', 0, 'ana'), guide('c1', 1, 'bir'), guide('c2', 2, 'iki')];
  const box = seriesBox(seriesOf(guides, guides[1].versions.tr), guides[1].versions.tr);
  assert.match(box, /<a href="\/blog\/ana">Başlık 0<\/a>/);
  assert.match(box, /<a href="\/blog\/iki">Başlık 2<\/a>/);
  assert.match(box, /aria-current="page">Başlık 1</);
  assert.doesNotMatch(box, /href="\/blog\/bir"/);
});

test('series: cluster note points to the pillar, pillar gets none', () => {
  const guides = [guide('p', 0, 'ana'), guide('c1', 1, 'bir')];
  const members = seriesOf(guides, guides[1].versions.tr);
  assert.match(seriesNote(members, guides[1].versions.tr), /href="\/blog\/ana"/);
  assert.equal(seriesNote(members, guides[0].versions.tr), '');
});
