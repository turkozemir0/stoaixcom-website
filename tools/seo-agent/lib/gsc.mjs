/* Google Search Console (salt okunur). Servis hesabı anahtarı ortam değişkeninden gelir,
   repoya asla yazılmaz:
     GSC_SERVICE_ACCOUNT  servis hesabı JSON'u (ham ya da base64)
     GSC_SITE             mülk; varsayılan sc-domain:stoaix.com
   Değişken yoksa null döner; denetim GSC bölümünü "bağlı değil" diye geçer. */
import jwt from 'jsonwebtoken';

const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const WINDOW_DAYS = 28;
/* GSC verisi ~3 gün gecikmeli; son 3 günü sayma */
const LAG_DAYS = 3;
export const STRIKING = { minPos: 4, maxPos: 15, minImpr: 20 };

function readKey(raw) {
  const text = raw.trim().startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
  const key = JSON.parse(text);
  if (!key.client_email || !key.private_key) throw new Error('GSC_SERVICE_ACCOUNT: client_email/private_key eksik');
  return key;
}

async function accessToken(key) {
  const now = Math.floor(Date.now() / 1000);
  const assertion = jwt.sign(
    { iss: key.client_email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 },
    key.private_key, { algorithm: 'RS256' },
  );
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
  });
  if (!res.ok) throw new Error(`GSC token alınamadı: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

const iso = (d) => d.toISOString().slice(0, 10);
export function windows(today = new Date()) {
  const end = new Date(today); end.setUTCDate(end.getUTCDate() - LAG_DAYS);
  const start = new Date(end); start.setUTCDate(start.getUTCDate() - WINDOW_DAYS + 1);
  const prevEnd = new Date(start); prevEnd.setUTCDate(prevEnd.getUTCDate() - 1);
  const prevStart = new Date(prevEnd); prevStart.setUTCDate(prevStart.getUTCDate() - WINDOW_DAYS + 1);
  return { cur: [iso(start), iso(end)], prev: [iso(prevStart), iso(prevEnd)] };
}

async function query(token, site, [startDate, endDate], dimensions) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ startDate, endDate, dimensions, rowLimit: 5000 }),
  });
  if (!res.ok) throw new Error(`GSC sorgusu başarısız (${dimensions}): ${res.status} ${await res.text()}`);
  return (await res.json()).rows || [];
}

/* Eşikler (Ryze GSC analizi + RUNBOOK): ilk 5'te olup CTR'si %2'nin altındaki sorgu başlık/açıklama sorunudur;
   tıklaması %30'dan fazla düşen sayfa içerik yenileme adayıdır; aynı sorguda 2+ sayfa yamyamlaşmadır. */
export const CTR_ANOMALY = { maxPos: 5, maxCtr: 0.02, minImpr: 50 };
export const DECAY = { minPrevClicks: 10, drop: 0.3 };
export const CANNIBAL = { minImpr: 10 };

const toRows = (raw) => raw.map((r) => ({ query: r.keys[0], page: r.keys[1], clicks: r.clicks, impr: r.impressions, ctr: r.ctr, pos: r.position }));
const sumBy = (rows, key, val) => {
  const m = new Map();
  for (const r of rows) m.set(r[key], (m.get(r[key]) || 0) + r[val]);
  return m;
};

function cannibalization(rows) {
  const byQuery = new Map();
  for (const r of rows.filter((x) => x.impr >= CANNIBAL.minImpr)) {
    byQuery.set(r.query, [...(byQuery.get(r.query) || []), r]);
  }
  return [...byQuery].filter(([, rs]) => rs.length > 1)
    .map(([query, rs]) => ({ query, pages: rs.sort((a, b) => b.impr - a.impr).map((r) => ({ page: r.page, pos: r.pos, impr: r.impr })) }))
    .sort((a, b) => b.pages[0].impr - a.pages[0].impr)
    .slice(0, 15);
}

/* Saf analiz — testlenebilir. İki dönem de ['query','page'] boyutunda. */
export function analyze(curRaw, prevRaw = []) {
  const rows = toRows(curRaw);
  const prevRows = toRows(prevRaw);
  const striking = rows
    .filter((r) => r.pos >= STRIKING.minPos && r.pos <= STRIKING.maxPos && r.impr >= STRIKING.minImpr)
    .sort((a, b) => b.impr - a.impr)
    .slice(0, 25);
  const breadth = new Map();
  for (const r of rows) breadth.set(r.page, (breadth.get(r.page) || 0) + 1);
  const pageClicks = sumBy(rows, 'page', 'clicks');
  const prevPageClicks = sumBy(prevRows, 'page', 'clicks');
  const movers = [...new Set([...pageClicks.keys(), ...prevPageClicks.keys()])]
    .map((page) => ({ page, clicks: pageClicks.get(page) || 0, prev: prevPageClicks.get(page) || 0 }))
    .map((m) => ({ ...m, delta: m.clicks - m.prev }));
  const decaying = movers
    .filter((m) => m.prev >= DECAY.minPrevClicks && m.clicks < m.prev * (1 - DECAY.drop))
    .sort((a, b) => a.delta - b.delta);
  const ctrAnomalies = rows
    .filter((r) => r.pos <= CTR_ANOMALY.maxPos && r.ctr < CTR_ANOMALY.maxCtr && r.impr >= CTR_ANOMALY.minImpr)
    .sort((a, b) => b.impr - a.impr)
    .slice(0, 15);
  const curQ = new Set(rows.map((r) => r.query));
  const prevQ = new Set(prevRows.map((r) => r.query));
  return {
    totals: { clicks: rows.reduce((s, r) => s + r.clicks, 0), impr: rows.reduce((s, r) => s + r.impr, 0), queries: curQ.size },
    striking,
    breadth: [...breadth].map(([page, queries]) => ({ page, queries })).sort((a, b) => b.queries - a.queries).slice(0, 15),
    movers: [...movers].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)).slice(0, 10),
    decaying,
    ctrAnomalies,
    cannibalization: cannibalization(rows),
    newQueries: [...curQ].filter((q) => !prevQ.has(q)).length,
    lostQueries: [...prevQ].filter((q) => !curQ.has(q)).length,
  };
}

export async function fetchGsc(env = process.env) {
  if (!env.GSC_SERVICE_ACCOUNT) return null;
  const site = env.GSC_SITE || 'sc-domain:stoaix.com';
  const token = await accessToken(readKey(env.GSC_SERVICE_ACCOUNT));
  const w = windows();
  const [cur, prev] = await Promise.all([
    query(token, site, w.cur, ['query', 'page']),
    query(token, site, w.prev, ['query', 'page']),
  ]);
  return { site, window: w.cur, ...analyze(cur, prev) };
}
