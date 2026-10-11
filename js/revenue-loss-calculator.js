/* The scenario uses percentage points, not a relative percentage increase.
   No patient or contact data leaves this page. */
(function () {
  'use strict';

  const form = document.getElementById('loss-form');
  if (!form) return;

  const lang = document.documentElement.lang === 'en' ? 'en' : 'tr';
  const locale = lang === 'en' ? 'en-GB' : 'tr-TR';
  const copy = {
    tr: {
      invalid: 'Geçerli değerler girin. Hedef oran mevcut orandan düşük veya %100’den yüksek olamaz.',
      rate: (current, target, gap) => `Dönüşüm: %${current} → %${target} · fark +${gap} yüzde puan`,
      formula: (leads, points, fraction, value) => `${leads} lead × ${points} yüzde puan (${fraction}) × ${value} = ayda masada kalıyor olabilecek ciro`,
      prompts: {
        leads: {
          label: 'STOAIX Ads', title: 'Lead sayısını artırmakta zorlanıyor musunuz?',
          body: 'STOAIX Ads, Meta reklamlarınızı AI ile analiz eder; günlük rapor ve öncelikli aksiyon planı sunar. Değişiklikler sizin onayınızla yapılır.',
          link: 'STOAIX Ads’i keşfedin →', href: '/stoaix-ads',
        },
        conversion: {
          label: 'DÖNÜŞÜM ORANI', title: 'Bu oran neyi gösterir?',
          body: 'Yeni başvuruların ödeme yapan hastaya dönüşen payıdır. Hızlı ilk yanıt ve düzenli takip, bu sürecin ölçülüp iyileştirilmesine yardımcı olur.',
          link: 'AI asistanları görün →', href: '/#specification',
        },
        target: {
          label: 'HEDEF ORAN', title: 'Hedefi nasıl seçmelisiniz?',
          body: 'Bugünkü oranın üstünde, ulaşılabilir gördüğünüz oranı girin. Hesap iki oran arasındaki farkı gösterir; hedef bir sonuç garantisi değildir.',
        },
        value: {
          label: 'HASTA DEĞERİ', title: 'Buraya hangi tutarı girmelisiniz?',
          body: 'Yeni bir hastadan ortalama tahsil ettiğiniz tutarı girin. Bu cirodur, kâr değildir; aynı dönüşüm farkının parasal etkisini belirler.',
        },
      },
    },
    en: {
      invalid: 'Enter valid values. The target cannot be below the current rate or above 100%.',
      rate: (current, target, gap) => `Conversion: ${current}% → ${target}% · +${gap} percentage points`,
      formula: (leads, points, fraction, value) => `${leads} leads × ${points} percentage points (${fraction}) × ${value} = potential monthly revenue left on the table`,
      prompts: {
        leads: {
          label: 'STOAIX Ads', title: 'Struggling to bring in more leads?',
          body: 'STOAIX Ads analyzes your Meta campaigns with AI, then provides daily reports and prioritized actions. Changes require your approval.',
          link: 'Explore STOAIX Ads →', href: '/stoaix-ads',
        },
        conversion: {
          label: 'CONVERSION RATE', title: 'What does this rate mean?',
          body: 'The share of new leads who become paying patients. Fast first responses and consistent follow-up can help you measure and improve this process.',
          link: 'See the AI assistants →', href: '/#specification',
        },
        target: {
          label: 'TARGET RATE', title: 'How should you set a target?',
          body: 'Enter a rate you believe is achievable above your current rate. The calculator uses the difference; the target is not a guaranteed outcome.',
        },
        value: {
          label: 'PATIENT VALUE', title: 'Which amount belongs here?',
          body: 'Enter the average amount collected from a new patient. This is revenue, not profit; it determines the monetary effect of the conversion gap.',
        },
      },
    },
  }[lang];

  const fields = {
    leads: form.elements.namedItem('leads'),
    conversion: form.elements.namedItem('conversion'),
    target: form.elements.namedItem('target'),
    value: form.elements.namedItem('value'),
    currency: form.elements.namedItem('currency'),
  };
  const output = (id) => document.getElementById(id);
  const fieldToast = output('field-toast');
  let previousLeads = Number(fields.leads.value);
  const seenPrompts = new Set();
  const number = (value, digits = 0) => new Intl.NumberFormat(locale, {
    maximumFractionDigits: digits,
  }).format(value);
  const money = (value) => new Intl.NumberFormat(locale, {
    style: 'currency', currency: fields.currency.value, minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(value);

  function update() {
    const leads = Number(fields.leads.value);
    const conversion = Number(fields.conversion.value);
    const target = Number(fields.target.value);
    const value = Number(fields.value.value);
    const valid = [leads, conversion, target, value].every(Number.isFinite)
      && fields.leads.value !== '' && fields.conversion.value !== ''
      && fields.target.value !== '' && fields.value.value !== ''
      && Number.isInteger(leads) && leads >= 0 && leads <= 1000000
      && conversion >= 0 && conversion <= 100
      && target >= conversion && target <= 100
      && value >= 0 && value <= 100000000;

    output('calc-error').textContent = valid ? '' : copy.invalid;
    output('calc-results').hidden = !valid;
    if (!valid) return;

    // Current and target are percentages; their difference is in percentage points.
    const improvement = target - conversion;
    const additionalPatients = leads * improvement / 100;
    const monthly = additionalPatients * value;
    const annual = monthly * 12;

    output('monthly-value').textContent = money(monthly);
    output('rate-explainer').textContent = copy.rate(number(conversion, 1), number(target, 1), number(improvement, 1));
    output('annual-value').textContent = money(annual);
    output('patient-count').textContent = number(additionalPatients, 2);
    output('formula').textContent = copy.formula(number(leads), number(improvement, 1), number(improvement / 100, 3), money(value));
  }

  function showPrompt(key) {
    const prompt = copy.prompts[key];
    output('field-toast-label').textContent = prompt.label;
    output('field-toast-title').textContent = prompt.title;
    output('field-toast-body').textContent = prompt.body;
    const link = output('field-toast-link');
    link.hidden = !prompt.href;
    link.href = prompt.href || '#';
    link.textContent = prompt.link || '';
    fieldToast.hidden = false;
    seenPrompts.add(key);
  }

  function maybeShowPrompt(event) {
    const key = ['leads', 'conversion', 'target', 'value'].find((name) => fields[name] === event.target);
    if (!key) return;
    const raw = fields[key].value;
    const next = Number(raw);
    if (raw === '' || !Number.isFinite(next) || next < 0) return;
    if (key === 'leads') {
      if (!Number.isInteger(next)) return;
      if (!seenPrompts.has('leads') && next > previousLeads) showPrompt('leads');
      previousLeads = next;
    } else if (!seenPrompts.has(key)) {
      showPrompt(key);
    }
  }

  output('field-toast-close').addEventListener('click', () => { fieldToast.hidden = true; });
  for (const key of ['leads', 'conversion', 'target', 'value']) {
    output(`help-${key}`).addEventListener('click', () => showPrompt(key));
  }
  form.addEventListener('input', (event) => { maybeShowPrompt(event); update(); });
  form.addEventListener('change', (event) => { maybeShowPrompt(event); update(); });
  form.addEventListener('submit', (event) => event.preventDefault());
  update();
})();
