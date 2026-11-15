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

/* Saf analiz — testlenebilir */
export function analyze(curRows, prevPageRows) {
  const rows = curRows.map((r) => ({ query: r.keys[0], page: r.keys[1], clicks: r.clicks, impr: r.impressions, ctr: r.ctr, pos: r.position }));
  const striking = rows
    .filter((r) => r.pos >= STRIKING.minPos && r.pos <= STRIKING.maxPos && r.impr >= STRIKING.minImpr)
    .sort((a, b) => b.impr - a.impr)
    .slice(0, 25);
  const breadth = new Map();
  for (const r of rows) breadth.set(r.page, (breadth.get(r.page) || 0) + 1);
  const prev = new Map(prevPageRows.map((r) => [r.keys[0], r.clicks]));
  const pageClicks = new Map();
  for (const r of rows) pageClicks.set(r.page, (pageClicks.get(r.page) || 0) + r.clicks);
  const movers = [...pageClicks].map(([page, clicks]) => ({ page, clicks, prev: prev.get(page) || 0, delta: clicks - (prev.get(page) || 0) }))
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta)).slice(0, 10);
  return {
    totals: { clicks: rows.reduce((s, r) => s + r.clicks, 0), impr: rows.reduce((s, r) => s + r.impr, 0), queries: new Set(rows.map((r) => r.query)).size },
    striking,
    breadth: [...breadth].map(([page, queries]) => ({ page, queries })).sort((a, b) => b.queries - a.queries).slice(0, 15),
    movers,
  };
}

export async function fetchGsc(env = process.env) {
  if (!env.GSC_SERVICE_ACCOUNT) return null;
  const site = env.GSC_SITE || 'sc-domain:stoaix.com';
  const token = await accessToken(readKey(env.GSC_SERVICE_ACCOUNT));
  const w = windows();
  const [cur, prevPages] = await Promise.all([
    query(token, site, w.cur, ['query', 'page']),
    query(token, site, w.prev, ['page']),
  ]);
  return { site, window: w.cur, ...analyze(cur, prevPages) };
}
