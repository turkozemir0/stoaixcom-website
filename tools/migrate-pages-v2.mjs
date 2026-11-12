/* ═══════════════════════════════════════════════════════════════════
   Eski tasarımdaki kök içerik sayfalarını v2'ye taşır
   (karşılaştırmalar, UK branş sayfaları, kaynak/kit sayfaları, SSS).

   Blog dönüştürücüsünün parçalarını kullanır; fark: içerik hero'dan
   sonraki bloklardan okunur ve sayfa yolunda "Blog" halkası yoktur.

   Kapsam dışı: reklam açılış sayfaları (*-hizli-yanit, *-eski-lead-
   canlandirma, media). Kendi etkileşimli fiyat bileşenleri ve styles.css
   tasarımları var; reklam testleri bitene kadar oldukları gibi kalır.

   Çalıştırma:  node tools/migrate-pages-v2.mjs [--dry]
   ═══════════════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parsePost } from './blog/parse-post.mjs';
import { renderPost, refreshFooter, GENERATOR, ORIGIN } from './blog/render-post.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const isDry = process.argv.includes('--dry');

export const PAGES = [
  'ai-resepsiyonist-nedir', 'what-is-ai-receptionist-clinic', 'sik-sorulan-sorular',
  'ai-resepsiyonist-vs-insan-sekreter', 'ai-resepsiyonist-vs-cagri-merkezi',
  'ai-receptionist-vs-human-receptionist-uk', 'ai-receptionist-vs-answering-service-uk',
  'ai-receptionist-dental-clinic-uk', 'ai-receptionist-aesthetic-clinic-uk', 'ai-receptionist-hair-transplant-clinic',
  'ai-receptionist-physiotherapy-clinic-uk', 'ai-receptionist-private-gp-uk', 'ai-receptionist-dermatology-clinic-uk',
  'missed-calls-private-clinic-uk', 'reduce-no-shows-private-clinic-uk',
  'dis-klinigi-icin-ai', 'estetik-klinik-icin-ai', 'sac-ekimi-klinigi-icin-ai',
  'whatsapp-follow-up-mesajlari-klinik', 'clinic-whatsapp-follow-up-messages',
  'randevu-no-show-azaltma-paketi', 'appointment-no-show-reduction-kit',
  'klinik-kaynaklari', 'clinic-resources', 'klinik-lead-kaybi-kontrol-listesi', 'clinic-lead-leak-checklist',
  'eski-lead-reactivation-kit', 'old-lead-reactivation-kit',
  'klinik-lead-management-starter-kit', 'clinic-lead-management-starter-kit-en',
];

/* h1 ve metnin tek kapta olduğu sayfalar (yasal metinler) */
export const CONTAINER_PAGES = ['privacy-policy', 'terms', 'cookie-policy'];

const plain = (html) => html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

function migrate(slug, opts) {
  const path = join(ROOT, `${slug}.html`);
  const src = readFileSync(path, 'utf8');
  if (src.includes(`content="${GENERATOR}"`)) {
    const next = refreshFooter(src);
    if (!isDry && next !== src) writeFileSync(path, next);
    return 'skip';
  }
  const p = parsePost(src, opts);
  const page = {
    ...p,
    canonical: p.canonical || `${ORIGIN}/${slug}`,
    plainH1: plain(p.hero.h1),
    section: null,
    category: plain(p.hero.category),
    lede: (opts.container && plain(p.hero.metaLine).replace(/\s*\|\s*/g, ' · ')) || p.hero.lede || p.desc,
  };
  if (!isDry) writeFileSync(path, renderPost(page));
  return 'ok';
}

const tally = { ok: 0, skip: 0, fail: [] };
const jobs = [...PAGES.map((s) => [s, { siblings: true }]), ...CONTAINER_PAGES.map((s) => [s, { container: true }])];
for (const [slug, opts] of jobs) {
  try { tally[migrate(slug, opts)]++; } catch (e) { tally.fail.push(`${slug}: ${e.message}`); }
}
console.log(`sayfalar: ${tally.ok} taşındı · ${tally.skip} zaten v2 · ${tally.fail.length} hata${isDry ? ' (deneme)' : ''}`);
tally.fail.forEach((x) => console.log(`  ✗ ${x}`));
if (tally.fail.length) process.exitCode = 1;
