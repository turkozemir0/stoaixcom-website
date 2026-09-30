/* ═══════════════════════════════════════════════════════════════════
   Microsoft Clarity — Data Export API'den davranış verisi çekme

   Kullanım:
     node tools/clarity-cek.mjs                      → 1 gün, URL kırılımı
     node tools/clarity-cek.mjs 3 URL Source         → 3 gün, iki boyut
     node tools/clarity-cek.mjs --oku <dosya>        → kayıtlı yanıtı yeniden oku

   Token: `.env.local` içinde `CLARITY_API_TOKEN=...` (dosya gitignore'da).

   🔴 GÜNDE 10 İSTEK SINIRI VAR — proje başına, ve sıfırlanması 24 saati
   buluyor. Bu yüzden her yanıt `_clarity/` altına HAM olarak kaydediliyor
   ve aynı veriyi tekrar incelemek için `--oku` kullanılıyor. Aynı sorguyu
   iki kez çalıştırmak günlük bütçenin beşte birini yakar.

   ⚠️ API en fazla 3 GÜN geriye gidiyor (`numOfDays` 1–3) ve en fazla 3
   boyut kabul ediyor. Daha eskisi ya da daha derini bu uçtan alınamıyor;
   oturum kayıtları ve ısı haritaları yalnız Clarity arayüzünde.
   ═══════════════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const KAYIT_DIZINI = join(ROOT, '_clarity');
const UC = 'https://www.clarity.ms/export-data/api/v1/project-live-insights';

/* Geçerli boyutlar — API bunların dışındakini reddediyor. */
const BOYUTLAR = new Set([
  'Browser', 'Device', 'Country/Region', 'OS', 'Source', 'Medium',
  'Campaign', 'Channel', 'URL', 'OperatingSystem',
]);

function jetonAl() {
  const yollar = ['.env.local', '.env'];
  for (const y of yollar) {
    const p = join(ROOT, y);
    if (!existsSync(p)) continue;
    const m = readFileSync(p, 'utf8').match(/^\s*CLARITY_API_TOKEN\s*=\s*(.+)\s*$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, '');
  }
  return process.env.CLARITY_API_TOKEN || null;
}

async function cek(gun, boyutlar, jeton) {
  const q = new URLSearchParams({ numOfDays: String(gun) });
  boyutlar.forEach((b, i) => q.set(`dimension${i + 1}`, b));

  const res = await fetch(`${UC}?${q}`, {
    headers: { Authorization: `Bearer ${jeton}` },
  });

  const metin = await res.text();
  if (!res.ok) {
    // 🔑 HATA GÖVDESİNİ AYNEN BASIYORUZ. Clarity sınır aşımını da,
    //   geçersiz jetonu da 4xx ile döndürüyor; ayrımı yalnız gövde
    //   söylüyor ve tahmin etmek günlük bütçeden bir istek daha yakar.
    throw new Error(`HTTP ${res.status}\n${metin.slice(0, 500)}`);
  }
  return JSON.parse(metin);
}

/* ─── Yanıtı okunur tabloya çevir ──────────────────────────────── */
function ozetle(veri) {
  if (!Array.isArray(veri)) {
    console.log(JSON.stringify(veri, null, 1).slice(0, 2000));
    return;
  }

  for (const blok of veri) {
    const ad = blok.metricName ?? '(isimsiz)';
    const satirlar = blok.information ?? [];
    if (!satirlar.length) continue;

    console.log(`\n═══ ${ad} ═══`);

    /* Sütunları satırlardan türet: metrik türüne göre alanlar değişiyor
       (trafik oturum sayısı verirken, rage click sayaç veriyor). */
    const sutunlar = [...new Set(satirlar.flatMap((s) => Object.keys(s)))];
    const gen = Object.fromEntries(
      sutunlar.map((c) => [c, Math.max(c.length, ...satirlar.map((s) => String(s[c] ?? '').length))])
    );

    console.log(sutunlar.map((c) => c.padEnd(gen[c])).join('  '));
    console.log(sutunlar.map((c) => '─'.repeat(gen[c])).join('  '));
    for (const s of satirlar.slice(0, 25)) {
      console.log(sutunlar.map((c) => String(s[c] ?? '').padEnd(gen[c])).join('  '));
    }
    if (satirlar.length > 25) console.log(`… ${satirlar.length - 25} satır daha (ham dosyada)`);
  }
}

/* ─── Çalıştır ─────────────────────────────────────────────────── */
const argv = process.argv.slice(2);

if (argv[0] === '--oku') {
  const p = argv[1] ? join(KAYIT_DIZINI, argv[1]) : null;
  if (!p || !existsSync(p)) {
    console.error('Kayıtlı dosya bulunamadı. _clarity/ içeriğine bak.');
    process.exit(1);
  }
  ozetle(JSON.parse(readFileSync(p, 'utf8')));
  process.exit(0);
}

const gun = Math.min(3, Math.max(1, Number(argv[0]) || 1));
const boyutlar = (argv.slice(1).length ? argv.slice(1) : ['URL']).slice(0, 3);

for (const b of boyutlar) {
  if (!BOYUTLAR.has(b)) {
    console.error(`Geçersiz boyut: "${b}"\nGeçerliler: ${[...BOYUTLAR].join(', ')}`);
    process.exit(1);
  }
}

const jeton = jetonAl();
if (!jeton) {
  console.error(
    [
      '',
      'CLARITY_API_TOKEN bulunamadı.',
      '',
      '  1. clarity.microsoft.com → proje → Settings → Data Export',
      '  2. "Generate new API token" ile bir jeton üret',
      '  3. Depo kökünde .env.local dosyasına yaz:',
      '',
      '     CLARITY_API_TOKEN=<jeton>',
      '',
      '  (.env* gitignore\'da, commit edilmez)',
      '',
    ].join('\n')
  );
  process.exit(1);
}

if (!existsSync(KAYIT_DIZINI)) mkdirSync(KAYIT_DIZINI, { recursive: true });

console.log(`Clarity → ${gun} gün · boyut: ${boyutlar.join(', ')}`);

try {
  const veri = await cek(gun, boyutlar, jeton);
  /* Zaman damgası çağıran taraftan değil, burada üretiliyor; dosya adı
     çakışmasın diye saniye hassasiyetinde. */
  const damga = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const dosya = `${damga}_${gun}g_${boyutlar.join('-').replace(/\//g, '')}.json`;
  writeFileSync(join(KAYIT_DIZINI, dosya), JSON.stringify(veri, null, 1), 'utf8');
  console.log(`ham yanıt: _clarity/${dosya}`);
  ozetle(veri);
} catch (err) {
  console.error('\nÇekilemedi:', err.message);
  process.exit(1);
}
