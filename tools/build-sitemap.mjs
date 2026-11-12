/* ═══════════════════════════════════════════════════════════════════
   Site haritası üreteci — sitemap.xml

   Üç kaynaktan okur:
     1. CORE   — elle yazılmış ana sayfalar (dil çiftleriyle)
     2. SEO    — tools/seo/catalog.mjs içindeki 4 pazar × ürün sayfaları
     3. Blog   — blog/*.html (noindex olanlar hariç)

   Diskte dosyası olmayan ya da noindex olan adres haritaya girmez.
   Çalıştırma:  node tools/build-sitemap.mjs
   ═══════════════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { allPages, urlFor } from './seo/catalog.mjs';
import { MARKETS, MARKET_ORDER, ORIGIN, UPDATED } from './seo/markets.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/* [tr yolu, en yolu] — en yolu null ise sayfanın tek dili vardır.
   Dosya kontrolü için: /en/about → about-en.html (vercel.json rewrite). */
const CORE_PAIRS = [
  ['/', '/en', 'index.html', 'index-en.html'],
  ['/pricing', '/en/pricing', 'pricing.html', 'pricing-en.html'],
  ['/about', '/en/about', 'about.html', 'about-en.html'],
  ['/contact', '/en/contact', 'contact.html', 'contact-en.html'],
  ['/gelir-kaybi-hesaplayici', '/revenue-loss-calculator', 'gelir-kaybi-hesaplayici.html', 'revenue-loss-calculator.html'],
  ['/klinik-kaynaklari', '/clinic-resources', 'klinik-kaynaklari.html', 'clinic-resources.html'],
  ['/klinik-lead-kaybi-kontrol-listesi', '/clinic-lead-leak-checklist', 'klinik-lead-kaybi-kontrol-listesi.html', 'clinic-lead-leak-checklist.html'],
  ['/whatsapp-follow-up-mesajlari-klinik', '/clinic-whatsapp-follow-up-messages', 'whatsapp-follow-up-mesajlari-klinik.html', 'clinic-whatsapp-follow-up-messages.html'],
  ['/eski-lead-reactivation-kit', '/old-lead-reactivation-kit', 'eski-lead-reactivation-kit.html', 'old-lead-reactivation-kit.html'],
  ['/klinik-lead-management-starter-kit', '/clinic-lead-management-starter-kit-en', 'klinik-lead-management-starter-kit.html', 'clinic-lead-management-starter-kit-en.html'],
  ['/randevu-no-show-azaltma-paketi', '/appointment-no-show-reduction-kit', 'randevu-no-show-azaltma-paketi.html', 'appointment-no-show-reduction-kit.html'],
  ['/ai-resepsiyonist-nedir', '/what-is-ai-receptionist-clinic', 'ai-resepsiyonist-nedir.html', 'what-is-ai-receptionist-clinic.html'],
];

/* Tek dilli sayfalar */
const CORE_SINGLE = [
  'media', 'stoaix-ads', 'privacy-policy', 'terms', 'cookie-policy', 'sik-sorulan-sorular',
  'ai-resepsiyonist-vs-insan-sekreter', 'ai-resepsiyonist-vs-cagri-merkezi',
  'ai-receptionist-dental-clinic-uk', 'ai-receptionist-aesthetic-clinic-uk', 'ai-receptionist-hair-transplant-clinic',
  'ai-receptionist-physiotherapy-clinic-uk', 'ai-receptionist-private-gp-uk', 'ai-receptionist-dermatology-clinic-uk',
  'ai-receptionist-vs-human-receptionist-uk', 'ai-receptionist-vs-answering-service-uk',
  'missed-calls-private-clinic-uk', 'reduce-no-shows-private-clinic-uk',
  'sac-ekimi-eski-lead-canlandirma', 'dis-klinigi-eski-lead-canlandirma', 'estetik-klinik-eski-lead-canlandirma',
  'sac-ekimi-hizli-yanit', 'dis-klinigi-hizli-yanit', 'estetik-klinik-hizli-yanit',
  'dis-klinigi-icin-ai', 'estetik-klinik-icin-ai', 'sac-ekimi-klinigi-icin-ai',
];

const read = (file) => readFileSync(join(ROOT, file), 'utf8');
const isIndexable = (file) => existsSync(join(ROOT, file)) && !/<meta[^>]+name="robots"[^>]+noindex/i.test(read(file));

/* Sayfanın kendi beyan ettiği son güncelleme tarihi (JSON-LD dateModified) */
function lastmodOf(file) {
  const m = read(file).match(/"dateModified":\s*"(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}

const alt = (hreflang, href) => `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}"/>`;

function urlEntry(loc, { lastmod = null, alternates = [] } = {}) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
    ...alternates,
    '  </url>',
  ].join('\n');
}

function coreEntries() {
  const pairs = CORE_PAIRS.filter(([, , trFile, enFile]) => isIndexable(trFile) && isIndexable(enFile))
    .flatMap(([tr, en, trFile, enFile]) => {
      const alternates = [alt('tr', ORIGIN + tr), alt('en', ORIGIN + en), alt('x-default', ORIGIN + en)];
      return [
        urlEntry(ORIGIN + tr, { lastmod: lastmodOf(trFile), alternates }),
        urlEntry(ORIGIN + en, { lastmod: lastmodOf(enFile), alternates }),
      ];
    });
  const singles = CORE_SINGLE.filter((p) => isIndexable(`${p}.html`))
    .map((p) => urlEntry(`${ORIGIN}/${p}`, { lastmod: lastmodOf(`${p}.html`) }));
  return [...pairs, ...singles];
}

function seoEntries() {
  return allPages().map(({ item, m }) => urlEntry(urlFor(item, m), {
    lastmod: UPDATED,
    alternates: [
      ...MARKET_ORDER.map((k) => alt(MARKETS[k].hreflang, urlFor(item, k))),
      alt('x-default', urlFor(item, 'en')),
    ],
  }));
}

function blogEntries() {
  const posts = readdirSync(join(ROOT, 'blog'))
    .filter((f) => f.endsWith('.html') && f !== 'index.html')
    .map((f) => `blog/${f}`)
    .filter(isIndexable)
    .sort();
  return [
    urlEntry(`${ORIGIN}/blog`),
    ...posts.map((f) => urlEntry(`${ORIGIN}/${f.replace(/\.html$/, '')}`, { lastmod: lastmodOf(f) })),
  ];
}

const sections = [['Ana sayfalar', coreEntries()], ['Ürün ve hizmet sayfaları (4 pazar)', seoEntries()], ['Blog', blogEntries()]];
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Üretildi: tools/build-sitemap.mjs — elle düzenlemeyin -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sections.map(([title, entries]) => `\n  <!-- ${title} -->\n${entries.join('\n')}`).join('\n')}
</urlset>
`;

writeFileSync(join(ROOT, 'sitemap.xml'), xml);
console.log(`sitemap.xml: ${sections.map(([t, e]) => `${t} ${e.length}`).join(' · ')}`);
