/* ═══════════════════════════════════════════════════════════════════
   STOAIX — şirket sayfaları üreteci (Hakkımızda + İletişim)
   Çıktı:  about.html       (TR, /about)
           about-en.html    (EN, /en/about — vercel.json rewrite ile)
           contact.html     (TR, /contact)
           contact-en.html  (EN, /en/contact — vercel.json rewrite ile)

   Ana sayfayla aynı tasarım: v2.css + ortak nav/footer (v2-chrome.mjs).
   Sayfaya özel stiller css/company.css'te; v2.css'in önbellek sürümü
   bu sayfalar yüzünden kırılmaz.

   🔴 İÇERİK KURALI: burada yalnızca doğrulanabilir bilgi durur. Uydurma
   müşteri adı, vaka çalışması ya da ana sayfada olmayan bir sayı yazmayın;
   eski sayfanın sorunu tam olarak buydu.

   Çalıştırma:  node tools/build-company.mjs
   ═══════════════════════════════════════════════════════════════════ */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { CONTENT, LINKS } from './v2-content.mjs';
import { esc, header, ctaSection, siteFooter } from './v2-chrome.mjs';
import { ANALYTICS_SNIPPET } from './site-analytics.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://stoaix.com';
const COMPANIES_HOUSE = 'https://find-and-update.company-information.service.gov.uk/company/17131250';
const EMAIL = 'hello@stoaix.com';
const WA_DISPLAY = '+90 506 118 54 79';
const EXT = 'target="_blank" rel="noopener"';

/* Şirket kaydı — iki sayfa da aynı bloğu gösterir. */
const FACTS = {
  tr: {
    head: 'Şirket bilgileri', note: 'Companies House üzerinden doğrulanabilir',
    rows: [
      ['Unvan', 'STOAIX Ltd'],
      ['Kayıt', 'İngiltere ve Galler'],
      ['Şirket numarası', `<a href="${COMPANIES_HOUSE}" ${EXT}>17131250</a>`],
      ['Kayıtlı adres', '4 Raven Road, Unit 1c3-1121, London, E18 1HB'],
      ['Kurucular', 'Ata Ulufer (CEO) · Emir Türköz (CTO)'],
      ['E-posta', `<a href="mailto:${EMAIL}">${EMAIL}</a>`],
    ],
  },
  en: {
    head: 'Company details', note: 'Verifiable on Companies House',
    rows: [
      ['Legal name', 'STOAIX Ltd'],
      ['Registered in', 'England and Wales'],
      ['Company number', `<a href="${COMPANIES_HOUSE}" ${EXT}>17131250</a>`],
      ['Registered office', '4 Raven Road, Unit 1c3-1121, London, E18 1HB'],
      ['Founders', 'Ata Ulufer (CEO) · Emir Türköz (CTO)'],
      ['Email', `<a href="mailto:${EMAIL}">${EMAIL}</a>`],
    ],
  },
};

const PAGES = {
  about: {
    tr: {
      file: 'about.html', path: '/about', schema: 'AboutPage',
      title: 'Hakkımızda — STOAIX',
      desc: 'STOAIX, klinik grupları için yapay zeka satış işletim sistemi. Ata Ulufer ve Emir Türköz tarafından kuruldu; Londra merkezli STOAIX Ltd.',
      eyebrow: 'Hakkımızda', proof: 'STOAIX Ltd. · Londra',
      h1: 'Hiçbir klinik, geç yanıt verdiği için hasta kaybetmesin diye kurduk.',
      lede: 'STOAIX, pazarlama bütçesiyle tedavi takvimi arasındaki katmanı işletir: talebi getirir, her lead’e dakikalar içinde döner, takibi tamamlar ve hastayı tedaviden sonra da elde tutar.',
      second: 'İletişime geçin',
      storyEye: 'Hikâye', storyH: 'Kaçan bir mesaj, kaçan bir hasta.',
      story: [
        '2023’te Ata ve Emir, Türkiye ve Birleşik Krallık’taki kliniklerle yakından çalışıyordu. Her seferinde aynı sorunla karşılaştılar: talepler gece yarısı, hafta sonu, Dubai’den, Londra’dan, İstanbul’dan geliyordu ve yanıt verecek kimse yoktu.',
        'Ertesi sabah geri dönüldüğünde hasta çoktan başka bir kliniğe randevu almıştı. Klinik daha kötü olduğu için değil, daha yavaş olduğu için.',
        'STOAIX bu sorundan doğdu. Bugün yalnızca ilk yanıtı değil, reklamdan randevuya, randevudan tedavi sonrasına kadar klinik büyümesinin tamamını tek bir gelir tablosunda işletiyor. Sizin kurallarınızla, sizin ekibinizle birlikte.',
      ],
      photoAlt: 'STOAIX kurucu ortakları Ata Ulufer ve Emir Türköz',
      photoCap: 'Ata Ulufer ve Emir Türköz, kurucu ortaklar',
      prinH: 'Nasıl çalışıyoruz', prinNote: 'Her kurulumda aynı dört ilke',
      principles: [
        { w: '01', t: 'Önce veri', d: 'Hiçbir şey varsayımla açılmaz. Her iş birliği arama kayıtları, yanıt süreleri ve lead kaynaklarının analiziyle başlar.' },
        { w: '02', t: 'Kontrol sizde', d: 'AI asistanlar sizin tedavi, fiyat aralığı ve eskalasyon kurallarınızla çalışır. Kuralların dışına çıkan her durum ekibinize devredilir.' },
        { w: '03', t: 'Adım adım', d: 'Tek kanal, tek klinik, gözetim altında başlarız. Her adım denetimli ve geri alınabilir; hiçbir şey tek seferde açılmaz.' },
        { w: '04', t: 'İş ortaklığı', d: 'Bir yazılım aboneliği gibi değil, iş ortağı gibi çalışırız. Aylık değerlendirmeyi atanmış müşteri lideriniz sizinle birlikte yürütür.' },
      ],
    },
    en: {
      file: 'about-en.html', path: '/en/about', schema: 'AboutPage',
      title: 'About — STOAIX',
      desc: 'STOAIX is the AI sales operating system for clinic groups. Founded by Ata Ulufer and Emir Türköz; STOAIX Ltd is based in London.',
      eyebrow: 'About', proof: 'STOAIX Ltd. · London',
      h1: 'We built STOAIX so no clinic loses a patient for answering too late.',
      lede: 'STOAIX runs the layer between your marketing budget and your treatment calendar: it generates demand, gets back to every lead within minutes, completes the follow-up and keeps patients after treatment.',
      second: 'Get in touch',
      storyEye: 'Our story', storyH: 'A missed message is a missed patient.',
      story: [
        'In 2023, Ata and Emir were working closely with clinics across Türkiye and the UK. The same problem kept surfacing: enquiries arrived at midnight, at weekends, from Dubai, London and Istanbul, and nobody was there to respond.',
        'By the time someone called back the next morning, the patient had already booked elsewhere. Not because the clinic was worse, just slower.',
        'STOAIX was born from that problem. Today it runs far more than the first reply: the whole of clinic growth, from the ad to the appointment and from the appointment to aftercare, on one revenue ledger. With your rules, alongside your team.',
      ],
      photoAlt: 'STOAIX co-founders Ata Ulufer and Emir Türköz',
      photoCap: 'Ata Ulufer and Emir Türköz, co-founders',
      prinH: 'How we work', prinNote: 'The same four principles in every deployment',
      principles: [
        { w: '01', t: 'Data first', d: 'Nothing is switched on by assumption. Every engagement starts with an audit of call recordings, response times and lead sources.' },
        { w: '02', t: 'You stay in control', d: 'AI agents work within your treatment, price-range and escalation rules. Anything outside those rules is handed to your team.' },
        { w: '03', t: 'Step by step', d: 'We start with one channel at one clinic, supervised. Every step is reviewed and reversible; nothing is switched on all at once.' },
        { w: '04', t: 'Partnership', d: 'We work as a partner, not a software subscription. Your assigned account lead runs the monthly review with you.' },
      ],
    },
  },
  contact: {
    tr: {
      file: 'contact.html', path: '/contact', schema: 'ContactPage',
      title: 'İletişim — STOAIX',
      desc: 'STOAIX ekibine ulaşın: tanışma görüşmesi planlayın, WhatsApp’tan yazın ya da hello@stoaix.com adresine e-posta gönderin.',
      eyebrow: 'İletişim', proof: 'STOAIX Ltd. · Londra',
      h1: 'Doğrudan ekibe ulaşın.',
      lede: 'Kliniğiniz için doğru kurulumu konuşmak, bir soru sormak ya da mevcut hesabınızla ilgili destek almak için aşağıdaki kanallardan birini seçin. Mesajınızı doğrudan ekibimiz okur.',
      chH: 'Size uygun kanalı seçin',
      channels: [
        { t: 'Tanışma görüşmesi', d: '20 dakikalık görüşmede hasta akışınıza bakar, hangi asistanların fark yaratacağını birlikte belirleriz.', go: 'Görüşme planla →', href: LINKS.briefing, ext: true },
        { t: 'WhatsApp', d: 'Kısa bir sorunuz varsa en hızlı yol.', go: `${WA_DISPLAY} →`, href: LINKS.whatsapp, ext: true },
        { t: 'E-posta', d: 'Genel sorular, iş birlikleri ve mevcut müşteri desteği için.', go: `${EMAIL} →`, href: `mailto:${EMAIL}` },
      ],
    },
    en: {
      file: 'contact-en.html', path: '/en/contact', schema: 'ContactPage',
      title: 'Contact — STOAIX',
      desc: 'Reach the STOAIX team: book an intro call, message us on WhatsApp or email hello@stoaix.com.',
      eyebrow: 'Contact', proof: 'STOAIX Ltd. · London',
      h1: 'Talk to the team directly.',
      lede: 'To discuss the right setup for your clinic, ask a question or get support with an existing account, pick one of the channels below. Your message is read by our team.',
      chH: 'Choose the channel that suits you',
      channels: [
        { t: 'Intro call', d: 'In a 20-minute call we look at your patient flow and work out which agents will make a difference.', go: 'Book a call →', href: LINKS.briefing, ext: true },
        { t: 'WhatsApp', d: 'The quickest route for a short question.', go: `${WA_DISPLAY} →`, href: LINKS.whatsapp, ext: true },
        { t: 'Email', d: 'General questions, partnerships and support for existing customers.', go: `${EMAIL} →`, href: `mailto:${EMAIL}` },
      ],
    },
  },
};

function head(p, lang, alt) {
  const c = CONTENT[lang];
  const self = ORIGIN + p.path;
  const trUrl = ORIGIN + alt.tr;
  const enUrl = ORIGIN + alt.en;
  return `<!DOCTYPE html>
<html lang="${c.htmlLang}" class="pal-ink">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.desc)}">
<meta name="theme-color" content="#0A0A0B" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#F1EEE8" media="(prefers-color-scheme: light)">
<link rel="icon" type="image/png" href="/assets/images/logo.png">
<link rel="canonical" href="${self}">
<link rel="alternate" hreflang="en" href="${enUrl}">
<link rel="alternate" hreflang="tr" href="${trUrl}">
<link rel="alternate" hreflang="x-default" href="${trUrl}">

<meta property="og:type" content="website">
<meta property="og:url" content="${self}">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:image" content="${ORIGIN}/assets/og-image.png">
<meta property="og:site_name" content="STOAIX">
<meta property="og:locale" content="${c.ogLocale}">
<meta property="og:locale:alternate" content="${lang === 'tr' ? 'en_GB' : 'tr_TR'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.title)}">
<meta name="twitter:description" content="${esc(p.desc)}">
<meta name="twitter:image" content="${ORIGIN}/assets/og-image.png">
<meta name="twitter:site" content="@stoaix">

<link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>${lang === 'tr' ? '\n<link rel="preload" href="/assets/fonts/inter-latin-ext.woff2" as="font" type="font/woff2" crossorigin>' : ''}
<link rel="stylesheet" href="/css/v2.css?v=7">
<link rel="stylesheet" href="/css/company.css?v=1">

<!-- Tema, ilk boyamadan önce uygulanır; tercih ana sayfayla ortak. -->
<script>
(function () {
  try {
    var t = localStorage.getItem('stoaix.theme');
    if (t !== 'ink' && t !== 'bone') t = 'ink';
    document.documentElement.className = 'pal-' + t;
  } catch (e) {}
})();
</script>

<script type="application/ld+json">
${JSON.stringify({
  '@context': 'https://schema.org',
  '@type': p.schema,
  url: self,
  name: p.title,
  inLanguage: c.htmlLang,
  mainEntity: {
    '@type': 'Organization',
    name: 'STOAIX',
    legalName: 'STOAIX Ltd',
    url: ORIGIN,
    email: EMAIL,
    logo: `${ORIGIN}/assets/logo-iconwithname.svg`,
    address: {
      '@type': 'PostalAddress', streetAddress: '4 Raven Road, Unit 1c3-1121',
      addressLocality: 'London', postalCode: 'E18 1HB', addressCountry: 'GB',
    },
    founder: [
      { '@type': 'Person', name: 'Ata Ulufer', jobTitle: 'CEO' },
      { '@type': 'Person', name: 'Emir Türköz', jobTitle: 'CTO' },
    ],
  },
}, null, 2).replace(/</g, '\\u003c')}
</script>${ANALYTICS_SNIPPET}
</head>
<body>
<a class="skip" href="#main">${esc(c.skip)}</a>

${header(c, lang, { base: lang === 'tr' ? '/' : '/en', langHref: alt, brandHref: lang === 'tr' ? '/' : '/en' })}

<main id="main">
`;
}

function tail(lang) {
  const c = CONTENT[lang];
  return `
</main>

${siteFooter(c, lang, { base: lang === 'tr' ? '/' : '/en' })}

<script src="/js/v2.js?v=4" defer></script>
</body>
</html>
`;
}

function hero(p, actions) {
  return `
<!-- ═══ HERO ══════════════════════════════════════════════════ -->
<section class="hero page-hero">
  <div class="hero-head">
    <p class="eyebrow">${esc(p.eyebrow)}</p>
    <div class="proof">${esc(p.proof)}</div>
  </div>
  <h1 class="page-title">${esc(p.h1)}</h1>
  <div class="hero-grid">
    <p>${esc(p.lede)}</p>${actions ? `
    <div class="row hero-actions">
      ${actions}
    </div>` : ''}
  </div>
</section>
`;
}

function facts(lang, alt) {
  const f = FACTS[lang];
  return `
<!-- ═══ ŞİRKET BİLGİLERİ ═══════════════════════════════════════ -->
<section class="pad${alt ? ' alt' : ''}">
  <div class="sec-head">
    <h2>${esc(f.head)}</h2>
    <div class="note">${esc(f.note)}</div>
  </div>
  <dl class="facts">
    ${f.rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('\n    ')}
  </dl>
</section>
`;
}

function about(lang) {
  const p = PAGES.about[lang];
  const c = CONTENT[lang];
  const alt = { tr: PAGES.about.tr.path, en: PAGES.about.en.path };
  const contactHref = PAGES.contact[lang].path;
  return head(p, lang, alt)
    + hero(p, `<a class="btn" href="${LINKS.briefing}" ${EXT}>${esc(c.brief)}</a>
      <a class="btn-ghost" href="${contactHref}">${esc(p.second)}</a>`)
    + `
<!-- ═══ HİKÂYE ════════════════════════════════════════════════ -->
<section class="pad">
  <div class="story">
    <figure>
      <picture>
        <source srcset="/assets/v2/founders.webp" type="image/webp">
        <img src="/assets/v2/founders.jpg" width="1000" height="1242" alt="${esc(p.photoAlt)}" loading="lazy" decoding="async">
      </picture>
      <figcaption>${esc(p.photoCap)}</figcaption>
    </figure>
    <div>
      <p class="eyebrow">${esc(p.storyEye)}</p>
      <h2>${esc(p.storyH)}</h2>
      ${p.story.map((t) => `<p>${esc(t)}</p>`).join('\n      ')}
    </div>
  </div>
</section>

<!-- ═══ İLKELER (ters zemin) ══════════════════════════════════ -->
<section class="alt pad">
  <div class="sec-head">
    <h2>${esc(p.prinH)}</h2>
    <div class="note">${esc(p.prinNote)}</div>
  </div>
  <div class="principles">
    ${p.principles.map((s) => `<div class="step">
      <div class="hd"><span class="w">${esc(s.w)}</span><span class="t">${esc(s.t)}</span></div>
      <p class="d">${esc(s.d)}</p>
    </div>`).join('\n    ')}
  </div>
</section>
${facts(lang, false)}
${ctaSection(c)}
` + tail(lang);
}

function contact(lang) {
  const p = PAGES.contact[lang];
  const alt = { tr: PAGES.contact.tr.path, en: PAGES.contact.en.path };
  return head(p, lang, alt)
    + hero(p, '')
    + `
<!-- ═══ KANALLAR ═══════════════════════════════════════════════ -->
<section class="pad channels-wrap">
  <h2 class="vh">${esc(p.chH)}</h2>
  <div class="channels">
    ${p.channels.map((ch) => `<a class="ch" href="${ch.href}"${ch.ext ? ` ${EXT}` : ''}>
      <span class="t">${esc(ch.t)}</span>
      <span class="d">${esc(ch.d)}</span>
      <span class="go">${esc(ch.go)}</span>
    </a>`).join('\n    ')}
  </div>
</section>
${facts(lang, true)}` + tail(lang);
}

for (const lang of ['tr', 'en']) {
  for (const [name, render] of [['about', about], ['contact', contact]]) {
    const file = PAGES[name][lang].file;
    const out = render(lang);
    writeFileSync(join(ROOT, file), out, 'utf8');
    console.log(`${file.padEnd(17)} ${(out.length / 1024).toFixed(1)} KB`);
  }
}
