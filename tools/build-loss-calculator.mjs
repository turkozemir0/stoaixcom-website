import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dictionary = {
  tr: {
    file: 'gelir-kaybi-hesaplayici.html', path: '/gelir-kaybi-hesaplayici', other: '/revenue-loss-calculator',
    title: 'Klinik Gelir Kaçağı Hesaplayıcısı | STOAIX',
    description: 'Klinik lead dönüşümünde her ay masada kalıyor olabilecek potansiyel ciroyu kendi verilerinizle hesaplayın.',
    back: 'Ana sayfa', kicker: 'STOAIX / GELİR KAÇAĞI',
    headline: 'Her ay ne kadar ciro <em>masada kalıyor?</em>',
    intro: 'Hastaya dönüşmeyen lead’lerin küçük bir kısmı kazanılsa, masada ne kadar ciro kalıyor?',
    inputs: 'Klinik verileriniz', example: 'Örnek değerler',
    leads: 'Aylık yeni lead', leadsHelp: 'Ay içinde gelen tekil başvurular',
    conversion: 'Lead’den hastaya dönüşüm oranı', conversionHelp: 'Yeni başvuruların yüzde kaçı ödeme yapan hasta oluyor?',
    target: 'Hedef dönüşüm oranı', targetHelp: 'Aynı lead kitlesi için ulaşılabilir oran',
    value: 'Hasta başına ortalama tahsilat', valueHelp: 'Bir yeni hastadan ortalama tahsilat',
    result: 'Masada kalan fırsat', resultScope: 'Tahmini', monthly: 'Her ay masada kalabilecek ciro',
    annual: 'Yıllık potansiyel', patients: 'Ek hasta / ay',
    formulaTitle: 'Hesap nasıl yapılıyor?',
    caution: 'Bu bir senaryo tahminidir; gerçekleşmiş kayıp veya getiri garantisi değildir.',
    method: 'Hedef oran ile mevcut oran arasındaki fark yüzde puan olarak hesaplanır. Yıllık tutar aylık sonucun 12 katıdır; maliyetler dahil değildir.',
    note: 'Örnek değerlerdir. Kendi verilerinizle değiştirin; para birimi dönüşümü yapılmaz.',
    cta: 'Bu açığı birlikte inceleyelim', bottom: 'STOAIX — Klinik büyümesinde görünürlük ve kontrol',
    help: 'Açıklamayı göster', close: 'Bildirimi kapat',
  },
  en: {
    file: 'revenue-loss-calculator.html', path: '/revenue-loss-calculator', other: '/gelir-kaybi-hesaplayici',
    title: 'Clinic Revenue Leakage Calculator | STOAIX',
    description: 'Estimate the potential revenue that could be left on the table each month from your clinic lead conversion gap.',
    back: 'Home', kicker: 'STOAIX / REVENUE LEAKAGE',
    headline: 'How much revenue is <em>left on the table?</em>',
    intro: 'If even a small share of unconverted leads became patients, how much revenue could be left on the table?',
    inputs: 'Your clinic numbers', example: 'Edit the example values',
    leads: 'New leads per month', leadsHelp: 'Unique inquiries received in a month',
    conversion: 'Lead-to-patient conversion rate', conversionHelp: 'What share of new leads become paying patients?',
    target: 'Target conversion rate', targetHelp: 'An achievable rate for the same group of leads',
    value: 'Average amount collected per patient', valueHelp: 'Average amount collected from a new patient',
    result: 'Opportunity left behind', resultScope: 'Estimate', monthly: 'Potential monthly revenue left on the table',
    annual: 'Annual potential', patients: 'Additional patients / month',
    formulaTitle: 'How is this calculated?',
    caution: 'This is a scenario estimate, not measured lost revenue or a guaranteed return.',
    method: 'The difference between target and current rates is measured in percentage points. Annual potential is 12 times the monthly amount; costs are excluded.',
    note: 'These are example values. Replace them with your data; currency selection does not convert rates.',
    cta: 'Review this gap together', bottom: 'STOAIX — Visibility and control for clinic growth',
    help: 'Show explanation', close: 'Dismiss notification',
  },
};

for (const [lang, c] of Object.entries(dictionary)) {
  const alt = lang === 'tr' ? 'en' : 'tr';
  const html = `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${c.title}</title>
  <meta name="description" content="${c.description}">
  <link rel="canonical" href="https://stoaix.com${c.path}">
  <link rel="alternate" hreflang="${lang}" href="https://stoaix.com${c.path}">
  <link rel="alternate" hreflang="${alt}" href="https://stoaix.com${c.other}">
  <link rel="stylesheet" href="/css/revenue-loss-calculator.css">
  <script src="/js/revenue-loss-calculator.js?v=1" defer></script>
</head>
<body>
  <a class="skip" href="#main">${lang === 'tr' ? 'İçeriğe geç' : 'Skip to content'}</a>
  <header class="top">
    <a class="brand" href="${lang === 'tr' ? '/' : '/en'}" aria-label="STOAIX"><span class="brand-mark" aria-hidden="true"></span>STOAIX</a>
    <nav class="top-links" aria-label="${lang === 'tr' ? 'Sayfa bağlantıları' : 'Page links'}">
      <a href="${lang === 'tr' ? '/' : '/en'}">${c.back}</a>
      <a href="/gelir-kaybi-hesaplayici" lang="tr" class="${lang === 'tr' ? 'active' : ''}">TR</a>
      <a href="/revenue-loss-calculator" lang="en" class="${lang === 'en' ? 'active' : ''}">EN</a>
    </nav>
  </header>
  <aside class="field-toast" id="field-toast" role="status" aria-live="polite" hidden>
    <button class="field-toast-close" id="field-toast-close" type="button" aria-label="${c.close}">×</button>
    <p class="field-toast-label" id="field-toast-label"></p>
    <strong class="field-toast-title" id="field-toast-title"></strong>
    <p class="field-toast-body" id="field-toast-body"></p>
    <a class="field-toast-link" id="field-toast-link" hidden></a>
  </aside>
  <main id="main">
    <div class="intro">
      <p class="kicker">${c.kicker}</p>
      <h1>${c.headline}</h1>
      <p>${c.intro}</p>
    </div>
    <div class="workspace">
      <section class="inputs" aria-labelledby="inputs-title">
        <div class="section-head"><h2 id="inputs-title">${c.inputs}</h2><span>${c.example}</span></div>
        <form id="loss-form" novalidate>
          <div class="fields">
            <div class="field"><div class="field-label"><label for="leads">${c.leads}</label><button id="help-leads" class="field-help" type="button" aria-label="${c.leads}: ${c.help}">?</button></div><input id="leads" name="leads" type="number" min="0" max="1000000" step="1" value="300" inputmode="numeric" aria-describedby="leads-help"><small id="leads-help">${c.leadsHelp}</small></div>
            <div class="field"><div class="field-label"><label for="conversion">${c.conversion}</label><button id="help-conversion" class="field-help" type="button" aria-label="${c.conversion}: ${c.help}">?</button></div><input id="conversion" name="conversion" type="number" min="0" max="100" step="0.1" value="6" inputmode="decimal" aria-describedby="conversion-help"><small id="conversion-help">${c.conversionHelp}</small></div>
            <div class="field"><div class="field-label"><label for="target">${c.target}</label><button id="help-target" class="field-help" type="button" aria-label="${c.target}: ${c.help}">?</button></div><input id="target" name="target" type="number" min="0" max="100" step="0.1" value="10" inputmode="decimal" aria-describedby="target-help"><small id="target-help">${c.targetHelp}</small></div>
            <div class="field"><div class="field-label"><label for="value">${c.value}</label><button id="help-value" class="field-help" type="button" aria-label="${c.value}: ${c.help}">?</button></div><div class="input-row"><input id="value" name="value" type="number" min="0" max="100000000" step="1" value="2500" inputmode="decimal" aria-describedby="value-help"><select name="currency" aria-label="${lang === 'tr' ? 'Para birimi' : 'Currency'}"><option value="EUR">EUR</option><option value="TRY">TRY</option><option value="GBP">GBP</option><option value="USD">USD</option></select></div><small id="value-help">${c.valueHelp}</small></div>
          </div>
          <p class="footnote">${c.note}</p>
          <p class="error" id="calc-error" role="alert"></p>
        </form>
      </section>
      <section class="results" id="calc-results" aria-labelledby="results-title">
        <div class="section-head"><h2 id="results-title">${c.result}</h2><span>${c.resultScope}</span></div>
        <p class="rate-explainer" id="rate-explainer"></p>
        <p class="result-label">${c.monthly}</p>
        <p class="big-number" id="monthly-value" aria-live="polite"></p>
        <div class="summary">
          <div><strong id="annual-value"></strong><span>${c.annual}</span></div>
          <div><strong id="patient-count"></strong><span>${c.patients}</span></div>
        </div>
        <a class="cta" href="https://calendly.com/ataulufer1/20" target="_blank" rel="noopener">${c.cta} →</a>
        <p class="disclaimer">${c.caution}</p>
        <details class="calc-details"><summary>${c.formulaTitle}</summary><p id="formula"></p><p>${c.method}</p></details>
      </section>
    </div>
  </main>
  <footer class="bottom"><span>${c.bottom}</span><a href="${lang === 'tr' ? '/' : '/en'}">${c.back} ↑</a></footer>
</body>
</html>\n`;
  writeFileSync(join(root, c.file), html, 'utf8');
  console.log(`Built ${c.file}`);
}
