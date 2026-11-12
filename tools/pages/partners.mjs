/* ═══════════════════════════════════════════════════════════════════
   /partners — partner programı (İngilizce)
   Prim kademeleri: Ata, 21 Eki 2026 (ciro üzerinden %10 / %20 / %30).
   Fiyatlar js/pricing.mjs'den. Eski sayfadaki $399 paket örnekleri ve
   "5 dakikada canlı" ifadesi güncel olmadığı için taşınmadı.
   ═══════════════════════════════════════════════════════════════════ */

import { PRICE_DATA } from '../../js/pricing.mjs';
import { hero, facts, qa, cards, steps, table, faq, page, LINKS } from './sections.mjs';

const REGISTER = 'https://partner.stoaix.com/register';
const TIERS = [
  ['Starter', '1–4 active clinics', '10%'],
  ['Growth', '5–9 active clinics', '20%'],
  ['Pro', '10+ active clinics', '30%'],
];
const EXAMPLE = { clinics: 5, agent: 'rec', opt: 'voice', rate: 0.2 };

const priceOf = (id, k) => PRICE_DATA.agents.find((a) => a.id === id).opts.find((o) => o.k === k).price;
const lowest = (id) => Math.min(...PRICE_DATA.agents.find((a) => a.id === id).opts.map((o) => o.price));
const usd = (n) => `$${n.toLocaleString('en-GB')}`;

function exampleLine() {
  const monthly = priceOf(EXAMPLE.agent, EXAMPLE.opt);
  const earn = EXAMPLE.clinics * monthly * EXAMPLE.rate;
  return `Example: ${EXAMPLE.clinics} clinics each on the voice AI receptionist (${usd(monthly)}/mo) puts you in the Growth tier: ${EXAMPLE.clinics} × ${usd(monthly)} × ${EXAMPLE.rate * 100}% = ${usd(earn)} every month, for as long as they stay.`;
}

const FAQ = [
  ['Does it cost anything to join?', 'No. There is no fee to join the referral programme and no target you have to hit.'],
  ['Do I need technical skills?', 'No. You introduce the clinic. STOAIX runs the demo if you want, sets the assistants up and supports the clinic afterwards.'],
  ['Who runs the sales call?', 'Your choice: you sell it yourself, you hand the meeting to us, or we run it together.'],
  ['How is commission calculated?', 'As a percentage of what your clinics pay STOAIX each month. When you move up a tier, the new rate applies to all your active clinics, not just new ones.'],
  ['Is there a cap or an end date?', 'No cap. You earn every month the clinic stays a paying customer.'],
  ['Can I sell it under my own brand?', 'White-label is available for agencies. We go through the terms on the partner call.'],
];

export function partnersPage() {
  const body = [
    hero({
      lang: 'en', crumbName: 'Partner programme', eyebrow: 'Partner programme', proof: '90+ agencies already partnering',
      h1: 'Refer clinics to STOAIX. Earn every month they stay.',
      lede: 'For agencies, consultants and freelancers who already work with clinics. You make the introduction; we handle the demo, setup and support. You earn a share of what the clinic pays, every month.',
      actions: [{ t: 'Become a partner', href: REGISTER }, { t: 'Book a partner call', href: LINKS.briefing }],
    }),
    facts([
      ['Commission', '10% to 30% of monthly revenue'],
      ['Cost to join', 'Free'],
      ['First step', 'Short partner call with Ata Ulufer, co-founder'],
    ]),
    cards('Who it is for', [
      { t: 'Digital marketing agencies', d: 'Add AI patient communication to the services you already sell to clinics.' },
      { t: 'Healthcare consultants', d: 'Your clients trust your advice. STOAIX gives you a product to recommend.' },
      { t: 'Tech and AI freelancers', d: 'Swap one-off projects for monthly income from clinics that stay.' },
      { t: 'Sales professionals', d: 'Introduce clinics you know and earn on every month they pay.' },
      { t: 'CRM and software resellers', d: 'A natural add-on for clinics already using practice software.' },
      { t: 'Business coaches', d: 'Recommend STOAIX to clinic owners you coach.' },
    ]),
    qa('What your clinics buy', [
      'Clinics pick the assistants they need, one by one: AI receptionist, follow-up, appointment reminders, reactivation, reviews, pre- and post-treatment care, plus Meta and Google ads management.',
      `Prices start at ${usd(lowest('conf'))} a month (reminders) and ${usd(lowest('rec'))} a month for the AI receptionist. The clinic CRM is included free, there is no setup fee and every plan has a 30-day money-back guarantee.`,
    ], { alt: true, extra: '\n      <p><a class="more" href="/en/ai-assistants">See all assistants →</a></p>' }),
    qa('What you earn', [
      'Commission is a share of what your clinics pay us each month. Your tier rises automatically as you add clinics, and the new rate applies to every active clinic.',
      exampleLine(),
    ], { extra: table(['Tier', 'Active clinics', 'Commission'], TIERS.map(([t, n, r]) => [t, n, r])) }),
    steps('How it works', [
      { t: 'Partner call', d: 'A short call with Ata to check the fit and walk you through the product and the pitch.' },
      { t: 'Find the clinic', d: 'Sell it yourself, pass the meeting to us, or run a joint call. Your link tracks every clinic you bring.' },
      { t: 'We set it up', d: 'STOAIX sets the assistants up, connects the clinic’s channels and supports them from then on.' },
      { t: 'You earn monthly', d: 'Commission is paid every month the clinic stays, with no cap.' },
    ]),
    cards('What you get', [
      { t: 'Partner dashboard', d: 'Every clinic you referred, its status and your earnings.' },
      { t: 'Sales material', d: 'Pitch scripts, email templates and demo material written for clinic owners.' },
      { t: 'A direct contact', d: 'One person at STOAIX for you and your clinics.' },
    ]),
    faq('Frequently asked questions', FAQ),
  ].join('');
  return page({
    lang: 'en', slug: 'partners', crumbName: 'Partner programme', faqItems: FAQ, body,
    title: 'Partner Programme: Earn 10–30% Referring Clinics | STOAIX',
    desc: 'Refer clinics to STOAIX and earn 10% to 30% of what they pay, every month they stay. Free to join; we handle demo, setup and support.',
  });
}
