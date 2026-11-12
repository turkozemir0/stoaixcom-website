/* ═══════════════════════════════════════════════════════════════════
   /media — kurucuların LinkedIn hesapları (İngilizce)
   ═══════════════════════════════════════════════════════════════════ */

import { hero, cards, page } from './sections.mjs';

const FOUNDERS = [
  { t: 'Ata Ulufer', d: 'Co-founder & CEO', href: 'https://www.linkedin.com/in/ata-ulufer-stoaix/' },
  { t: 'Emir Türköz', d: 'Co-founder & CTO', href: 'https://www.linkedin.com/in/emir-turkoz-stoaix/' },
];

export function mediaPage() {
  const body = [
    hero({
      lang: 'en', crumbName: 'Media', eyebrow: 'Media',
      h1: 'Founders\' LinkedIn posts',
      lede: 'Insights and updates from the STOAIX founding team.',
    }),
    cards('STOAIX on LinkedIn', FOUNDERS.map((f) => ({ ...f, go: 'Follow on LinkedIn' }))),
  ].join('');
  return page({
    lang: 'en', slug: 'media', crumbName: 'Media', body,
    title: 'Media — STOAIX on LinkedIn',
    desc: 'Follow STOAIX founders Ata Ulufer (CEO) and Emir Türköz (CTO) on LinkedIn. Latest posts, insights, and updates from our leadership team.',
  });
}
