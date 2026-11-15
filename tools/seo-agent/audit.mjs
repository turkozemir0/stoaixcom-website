/* ═══════════════════════════════════════════════════════════════════
   SEO-GEO asistanı — haftalık denetim.
     npm run seo:audit            → reports/seo/<tarih>.md + .json
     npm run seo:audit -- --stdout  (dosya yazmaz, raporu basar)
   Önce `npm run site` çalışmış olmalı (denetim diskteki HTML'i okur).
   Search Console için GSC_SERVICE_ACCOUNT gerekir; yoksa o bölüm atlanır.
   ═══════════════════════════════════════════════════════════════════ */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadSite } from './lib/site.mjs';
import { structure, content, clusters, fanout } from './lib/checks.mjs';
import { renderReport } from './lib/report.mjs';
import { fetchGsc } from './lib/gsc.mjs';
import { loadArticles } from '../seo/articles.mjs';
import { clusterOf, FALLBACK_CLUSTER } from '../seo/topical-map.mjs';
import { allPages } from '../seo/catalog.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, 'reports', 'seo');
const toStdout = process.argv.includes('--stdout');

function previousReport(date) {
  if (!existsSync(OUT)) return null;
  const last = readdirSync(OUT).filter((f) => f.endsWith('.json') && f < `${date}.json`).sort().pop();
  return last ? JSON.parse(readFileSync(join(OUT, last), 'utf8')) : null;
}

async function gscOrError() {
  try {
    return await fetchGsc();
  } catch (e) {
    console.error(`GSC: ${e.message}`);
    return { error: e.message.slice(0, 200) };
  }
}

async function main() {
  const date = new Date().toISOString().slice(0, 10);
  const { pages, missing } = loadSite(ROOT);
  if (missing.length) console.error(`sitemap'te olup diskte olmayan: ${missing.length}`);
  const money = new Set(allPages().map((p) => p.path));
  const { entries } = JSON.parse(readFileSync(join(ROOT, 'tools', 'seo-agent', 'fanout.json'), 'utf8'));

  const c = content(pages, money);
  const result = {
    date,
    structure: structure(pages),
    content: { ...c, rows: undefined },
    clusters: clusters(loadArticles(ROOT), clusterOf, FALLBACK_CLUSTER),
    fanout: fanout(entries, pages),
    gsc: await gscOrError(),
  };
  const md = renderReport(result, previousReport(date));
  if (toStdout) { console.log(md); return; }
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, `${date}.json`), `${JSON.stringify({ ...result, pagesScores: c.rows }, null, 2)}\n`);
  writeFileSync(join(OUT, `${date}.md`), md);
  console.log(`rapor: reports/seo/${date}.md`);
}

main().catch((e) => { console.error(e); process.exitCode = 1; });
