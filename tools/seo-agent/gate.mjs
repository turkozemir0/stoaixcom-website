/* ═══════════════════════════════════════════════════════════════════
   Yayın öncesi kalite kapısı.
     npm run seo:gate                 → origin/main'e göre eklenen metin + drift + robots
     npm run seo:gate -- --base=<ref> → başka bir tabana göre
   Çıkış kodu 1 = blocked: rutin push etmez, sorunu PR yerine rapora yazar.
   needs_review: push olur, bulgular PR açıklamasına "Ata/Emir onayı" diye girer.
   Önce `npm run site` çalışmış olmalı.
   ═══════════════════════════════════════════════════════════════════ */
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { gate, addedLines } from './lib/gate.mjs';
import { loadSite } from './lib/site.mjs';
import { snapshot, drift } from './lib/technical.mjs';
import { crawlerAccess } from './lib/robots.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORTS = join(ROOT, 'reports', 'seo');
const base = (process.argv.find((a) => a.startsWith('--base=')) || '--base=origin/main').slice(7);
/* İçerik kaynakları: elle yazılan HTML + üretici veri dosyaları */
const SOURCES = ['*.html', 'blog/*.html', 'tools/seo/products/*.mjs', 'tools/seo/topics/*.mjs', 'tools/seo/*.mjs', 'tools/v2-content.mjs'];

function diffAgainst(ref) {
  try {
    return execFileSync('git', ['diff', '-U0', ref, '--', ...SOURCES], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  } catch (e) {
    throw new Error(`git diff ${ref} alınamadı: ${e.message.split('\n')[0]}`);
  }
}

/* Türkçe mi: HTML'de lang="tr"; veri dosyalarında yol (en/de/au değilse TR kabul) */
function isTurkish(file) {
  const abs = join(ROOT, file);
  if (file.endsWith('.html') && existsSync(abs)) return /<html[^>]+lang="tr"/.test(readFileSync(abs, 'utf8').slice(0, 500));
  return !/(^|\/)(en|de|en-au)\/|-en\.|_en\./.test(file);
}

/* Sitede zaten doğrulanmış rakamlar: fiyat kaynağındaki sayılar */
function allowedNumbers() {
  const src = readFileSync(join(ROOT, 'js', 'pricing.mjs'), 'utf8');
  return new Set((src.match(/\b\d+\b/g) || []));
}

function lastSnapshot() {
  const file = join(REPORTS, 'snapshot.json');
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
}

function main() {
  const lines = addedLines(diffAgainst(base)).map((l) => ({ ...l, tr: isTurkish(l.file) }));
  const result = gate(lines, allowedNumbers());

  const { pages } = loadSite(ROOT);
  const cur = Object.fromEntries([...pages].map(([p, { html }]) => [p, snapshot(html)]));
  const prev = lastSnapshot();
  const critical = prev ? drift(prev, cur).filter((d) => d.level === 'CRITICAL') : [];
  const robots = crawlerAccess(readFileSync(join(ROOT, 'robots.txt'), 'utf8'));
  const status = critical.length || robots.blockedSearch.length ? 'blocked' : result.status;

  console.log(`# Kalite kapısı: ${status} (içerik puanı ${result.score}, taban ${base}, ${lines.length} yeni satır)`);
  for (const f of result.findings) console.log(`- [${f.level}] ${f.rule} — ${f.why} — ${f.file}: "${f.text}"`);
  for (const d of critical) console.log(`- [blocked] drift — ${d.path}: ${d.what}`);
  for (const b of robots.blockedSearch) console.log(`- [blocked] robots — ${b} arama tarayıcısı engelli`);
  if (!prev) console.log('- [bilgi] drift tabanı yok; önce `npm run seo:audit` çalıştır');
  if (status === 'blocked') process.exitCode = 1;
}

try { main(); } catch (e) { console.error(e.message); process.exitCode = 2; }
