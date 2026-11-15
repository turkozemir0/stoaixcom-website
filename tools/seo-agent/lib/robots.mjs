/* robots.txt denetimi — her yapay zekâ tarayıcısı için ayrı karar.
   Arama/alıntı tarayıcıları kapalıysa AI cevaplarında görünemeyiz: KRİTİK.
   Eğitim tarayıcıları politika kararıdır (Ata'nın), hata sayılmaz.
   Google-Extended Google Arama'yı ve AI Overviews'u ETKİLEMEZ; yalnız Gemini eğitimi. */

export const SEARCH_BOTS = ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot', 'DuckAssistBot', 'Applebot'];
export const USER_BOTS = ['ChatGPT-User', 'Claude-User', 'Perplexity-User'];
export const TRAINING_BOTS = ['GPTBot', 'ClaudeBot', 'CCBot', 'Google-Extended', 'Applebot-Extended', 'meta-externalagent'];

/* Ardışık User-agent satırları tek grup; ardından gelen Allow/Disallow o grubundur */
export function parseRobots(text) {
  const groups = [];
  let cur = null;
  for (const raw of text.split('\n')) {
    const line = raw.replace(/#.*/, '').trim();
    const m = /^([A-Za-z-]+)\s*:\s*(.*)$/.exec(line);
    if (!m) continue;
    const [, field, value] = m;
    const key = field.toLowerCase();
    if (key === 'user-agent') {
      if (!cur || cur.rules.length) { cur = { agents: [], rules: [] }; groups.push(cur); }
      cur.agents.push(value.toLowerCase());
    } else if ((key === 'allow' || key === 'disallow') && cur) {
      cur.rules.push({ allow: key === 'allow', path: value });
    }
  }
  return groups;
}

/* En uzun eşleşen kural kazanır; eşitlikte Allow. Boş Disallow = her şey serbest. */
export function isAllowed(groups, agent, path = '/') {
  const ua = agent.toLowerCase();
  const group = groups.find((g) => g.agents.includes(ua)) || groups.find((g) => g.agents.includes('*'));
  if (!group) return true;
  let best = null;
  for (const r of group.rules) {
    if (!r.path || !path.startsWith(r.path.replace(/\*$/, ''))) continue;
    if (!best || r.path.length > best.path.length || (r.path.length === best.path.length && r.allow)) best = r;
  }
  return best ? best.allow : true;
}

export function crawlerAccess(robotsText, samplePaths = ['/', '/blog']) {
  const groups = parseRobots(robotsText);
  const check = (bots) => bots.map((bot) => ({ bot, allowed: samplePaths.every((p) => isAllowed(groups, bot, p)) }));
  const search = check([...SEARCH_BOTS, ...USER_BOTS]);
  return {
    search,
    training: check(TRAINING_BOTS),
    blockedSearch: search.filter((b) => !b.allowed).map((b) => b.bot),
    hasSitemap: /^\s*sitemap\s*:/im.test(robotsText),
  };
}
