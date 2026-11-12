/* ═══════════════════════════════════════════════════════════════════
   Elle yazılan v2 sayfaları (tools/pages/*) → kök HTML dosyaları
   Çalıştırma:  node tools/build-pages.mjs
   ═══════════════════════════════════════════════════════════════════ */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { partnersPage } from './pages/partners.mjs';
import { mediaPage } from './pages/media.mjs';
import { landingPage } from './pages/landing.mjs';
import { HIZLI_YANIT } from './pages/landing-hizli-yanit.mjs';
import { ESKI_LEAD } from './pages/landing-eski-lead.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = {
  'partners.html': partnersPage,
  'media.html': mediaPage,
  ...Object.fromEntries([...HIZLI_YANIT, ...ESKI_LEAD].map((d) => [`${d.slug}.html`, () => landingPage(d)])),
};

for (const [file, render] of Object.entries(PAGES)) {
  writeFileSync(join(ROOT, file), render());
  console.log(`Built ${file}`);
}
