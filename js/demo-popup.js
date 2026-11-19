/* ═══════════════════════════════════════════════════════════════════
   STOAIX — "kliniğinize özel demo" popup'ı
   v2.js tarafından sayfa yüklendikten sonra çekilir (bkz. v2.js sonu).
   Fiyat sayfaları v2.js yüklemiyor; orada tools/build-pricing.mjs
   doğrudan <script> basar. Dosya değişince İKİ yerdeki ?v= de artar.

   Akış bilerek iki adımlı ve ikinci adım baştan gösterilmez:
     1) Web sitesi  →  2) Cep numarası (ülke kodu sayfa dilinden)  →  bitti
   Numara sunucuda libphonenumber ile doğrulanır (api/auth/[action].js,
   `demo-lead`); geçersizse kullanıcı aynı adımda kalır.

   Test: herhangi bir sayfaya ?demopopup=preview ekle — süre, hariç
   sayfalar ve "daha önce kapattı" kayıtları yok sayılır.
   ═══════════════════════════════════════════════════════════════════ */
'use strict';

(function () {
  if (window.__stxDemoPopup) return;
  window.__stxDemoPopup = true;

  var preview = /[?&]demopopup=preview/.test(location.search);
  var SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;    /* kapatana 7 gün gösterme */
  var K_SENT = 'stoaix.demo.sent';
  var K_SNOOZE = 'stoaix.demo.snoozed';
  var K_SEEN_MS = 'stoaix.demo.ms';          /* oturum boyunca biriken süre */

  /* Bekleme süresi, sekme görünürken geçen ve sayfalar arasında BİRİKEN
     süredir. Clarity (Kas 2026): ana sayfada mobil ort. ~60 sn kalınıyor,
     25 sn çoğunluğu yakalıyor. Fiyat sayfası reklam trafiğinin inişi ve
     orada ort. 150–430 sn kalınıyor; karar veremeyene 60 sn'de çıkar. */
  var PRICING = /^\/(?:en\/|tr\/)?pricing(?:-en)?(?:\.html)?\/?$/i;
  var DELAY_MS = PRICING.test(location.pathname) ? 60000 : 25000;

  /* Kendi eylemi olan sayfalar: iletişim, funnel, ödeme, hesaplayıcı. */
  var EXCLUDE = /^\/(?:en\/|tr\/)?(?:contact(?:-en)?|reklam(?:-en)?|signup|checkout|modules-checkout|login|forgot-password|reset-password|stoaix-ads|product|revenue-loss-calculator|gelir-kaybi-hesaplayici)(?:\.html)?\/?$/i;

  function store(k, v) {
    try {
      if (v === undefined) return localStorage.getItem(k);
      localStorage.setItem(k, v);
    } catch (e) { return null; }
  }
  function session(k, v) {
    try {
      if (v === undefined) return sessionStorage.getItem(k);
      sessionStorage.setItem(k, v);
    } catch (e) { return null; }
  }

  if (!preview) {
    if (EXCLUDE.test(location.pathname)) return;
    if (navigator.webdriver) return;
    if (store(K_SENT)) return;
    var snoozed = Number(store(K_SNOOZE) || 0);
    if (snoozed && Date.now() - snoozed < SNOOZE_MS) return;
  }

  /* ─── Dil ve varsayılan ülke ───────────────────────────────────── */
  var htmlLang = (document.documentElement.lang || 'en').toLowerCase();
  var lang = htmlLang.indexOf('tr') === 0 ? 'tr' : htmlLang.indexOf('de') === 0 ? 'de' : 'en';
  var defaultCountry = lang === 'tr' ? 'TR' : lang === 'de' ? 'DE' : htmlLang === 'en-au' ? 'AU' : 'GB';

  var COUNTRIES = [
    ['TR', '+90', 'Türkiye', '532 000 00 00'],
    ['GB', '+44', 'United Kingdom', '7400 123456'],
    ['DE', '+49', 'Deutschland', '1512 3456789'],
    ['AU', '+61', 'Australia', '412 345 678'],
    ['IE', '+353', 'Ireland', '85 012 3456'],
    ['AT', '+43', 'Österreich', '664 123456'],
    ['CH', '+41', 'Schweiz', '78 123 45 67'],
    ['NL', '+31', 'Nederland', '6 12345678'],
    ['FR', '+33', 'France', '6 12 34 56 78'],
    ['US', '+1', 'United States', '201 555 0123'],
    ['CA', '+1', 'Canada', '506 234 5678'],
    ['AE', '+971', 'UAE', '50 123 4567'],
    ['SA', '+966', 'Saudi Arabia', '51 234 5678'],
    ['AZ', '+994', 'Azərbaycan', '40 123 45 67'],
    ['CY', '+357', 'Cyprus', '96 123456']
  ];

  var T = {
    tr: {
      label: 'Ücretsiz demo',
      eyebrow: 'Ücretsiz demo',
      title: 'Kliniğinize özel AI Asistan demosu hazırlayalım.',
      sub: 'Hastalarınıza sitenizdeki bilgilerle, sizin adınıza yanıt veren asistanı ücretsiz kuralım.',
      preview: 'Önizleme',
      patient: 'Hasta',
      ask: 'Yarın için randevu var mı?',
      reply: 'Merhaba, yarın 14:30 ve 16:00 müsait. Hangisi sizin için uygun?',
      hostPh: 'kliniginiz.com',
      siteLabel: 'Web siteniz',
      next: 'Demomu hazırla',
      fine: 'Ücretsiz · Taahhüt yok',
      siteErr: 'Geçerli bir web sitesi adresi yazın (ör. kliniginiz.com).',
      eyebrow2: 'Son adım',
      title2: 'Demonuz hazır olunca nereye gönderelim?',
      sub2: 'Demonuzu WhatsApp üzerinden ileteceğiz.',
      change: 'Değiştir',
      phoneLabel: 'Cep telefonu',
      codeLabel: 'Ülke kodu',
      send: 'Demoyu gönder',
      sending: 'Gönderiliyor…',
      consent: 'Göndererek demonuz için WhatsApp ve telefonla size ulaşmamızı kabul edersiniz.',
      privacy: 'Gizlilik politikası',
      errInvalid: 'Bu kayıtlı bir numara değil. Numarayı kontrol edip tekrar deneyin.',
      errMobile: 'Bu bir sabit hat görünüyor. Demoyu WhatsApp’tan göndereceğimiz için cep numaranızı yazın.',
      errRate: 'Çok fazla deneme yapıldı. Birkaç dakika sonra tekrar deneyin.',
      errNet: 'Bağlantı kurulamadı. Tekrar deneyin.',
      doneTitle: 'Talebiniz alındı.',
      done: function (h, p) { return h + ' için demonuzu hazırlıyoruz. Hazır olduğunda ' + p + ' numarasına WhatsApp’tan göndereceğiz.'; },
      close: 'Kapat'
    },
    en: {
      label: 'Free demo',
      eyebrow: 'Free demo',
      title: 'Let us build an AI receptionist demo for your website.',
      sub: 'We’ll build you a free assistant that answers patients in your name, trained on your website.',
      preview: 'Preview',
      patient: 'Patient',
      ask: 'Anything free tomorrow?',
      reply: 'Hi, we have 2:30pm and 4pm free tomorrow. Which suits you best?',
      hostPh: htmlLang === 'en-au' ? 'yourclinic.com.au' : 'yourclinic.co.uk',
      siteLabel: 'Your website',
      next: 'Build my demo',
      fine: 'Free · No commitment',
      siteErr: 'Enter a valid website address (e.g. ' + (htmlLang === 'en-au' ? 'yourclinic.com.au' : 'yourclinic.co.uk') + ').',
      eyebrow2: 'Last step',
      title2: 'Where should we send your demo?',
      sub2: 'We’ll send it to you on WhatsApp.',
      change: 'Change',
      phoneLabel: 'Mobile number',
      codeLabel: 'Country code',
      send: 'Send my demo',
      sending: 'Sending…',
      consent: 'By sending, you agree that we may contact you on WhatsApp and by phone about your demo.',
      privacy: 'Privacy policy',
      errInvalid: 'This isn’t a registered number. Please check it and try again.',
      errMobile: 'That looks like a landline. We send demos on WhatsApp, so please enter your mobile number.',
      errRate: 'Too many attempts. Please try again in a few minutes.',
      errNet: 'Couldn’t connect. Please try again.',
      doneTitle: 'Got it.',
      done: function (h, p) { return 'We’re preparing the demo for ' + h + '. When it’s ready, we’ll send it to ' + p + ' on WhatsApp.'; },
      close: 'Close'
    },
    de: {
      label: 'Kostenlose Demo',
      eyebrow: 'Kostenlose Demo',
      title: 'Wir erstellen eine KI-Rezeptions-Demo für Ihre Website.',
      sub: 'Wir richten kostenlos einen Assistenten ein, der Ihren Patienten mit den Inhalten Ihrer Website antwortet.',
      preview: 'Vorschau',
      patient: 'Patient',
      ask: 'Haben Sie morgen einen Termin frei?',
      reply: 'Hallo, morgen sind 14:30 und 16:00 Uhr frei. Welche Uhrzeit passt Ihnen?',
      hostPh: 'ihre-praxis.de',
      siteLabel: 'Ihre Website',
      next: 'Demo erstellen',
      fine: 'Kostenlos · Unverbindlich',
      siteErr: 'Bitte geben Sie eine gültige Website ein (z. B. ihre-praxis.de).',
      eyebrow2: 'Letzter Schritt',
      title2: 'Wohin dürfen wir Ihre Demo senden?',
      sub2: 'Wir senden sie Ihnen per WhatsApp.',
      change: 'Ändern',
      phoneLabel: 'Handynummer',
      codeLabel: 'Ländervorwahl',
      send: 'Demo senden',
      sending: 'Wird gesendet…',
      consent: 'Mit dem Absenden stimmen Sie zu, dass wir Sie zu Ihrer Demo per WhatsApp und Telefon kontaktieren.',
      privacy: 'Datenschutz',
      errInvalid: 'Diese Nummer ist nicht vergeben. Bitte prüfen Sie sie und versuchen Sie es erneut.',
      errMobile: 'Das sieht nach einer Festnetznummer aus. Wir senden Demos per WhatsApp – bitte geben Sie Ihre Handynummer ein.',
      errRate: 'Zu viele Versuche. Bitte versuchen Sie es in ein paar Minuten erneut.',
      errNet: 'Keine Verbindung. Bitte erneut versuchen.',
      doneTitle: 'Vielen Dank.',
      done: function (h, p) { return 'Wir bereiten die Demo für ' + h + ' vor. Sobald sie fertig ist, senden wir sie per WhatsApp an ' + p + '.'; },
      close: 'Schließen'
    }
  }[lang];

  /* ─── Ölçüm ────────────────────────────────────────────────────── */
  function track(name, params) {
    try { if (typeof window.gtag === 'function') window.gtag('event', name, params || {}); } catch (e) {}
    try { if (typeof window.clarity === 'function') window.clarity('event', name); } catch (e) {}
  }
  function cookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : undefined;
  }

  /* ─── Stil (site tokenlarını kullanır: ink/bone ile birlikte değişir) ─ */
  var css = '' +
    '.dp-lock{overflow:hidden}' +
    '.dp-backdrop{position:fixed;inset:0;z-index:60;background:rgba(6,6,8,.58);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;transition:opacity .28s ease}' +
    '.dp-backdrop.in{opacity:1}' +
    '.dp{position:relative;width:100%;max-width:468px;max-height:calc(100vh - 48px);overflow:auto;background:var(--panel);color:var(--fg);border:1px solid var(--line);box-shadow:0 30px 80px -20px rgba(0,0,0,.55);transform:translateY(14px);transition:transform .32s cubic-bezier(.2,.8,.2,1)}' +
    '.dp-backdrop.in .dp{transform:none}' +
    '.dp::before{content:"";display:block;height:3px;background:var(--accent)}' +
    '.dp-in{padding:34px 34px 28px}' +
    '.dp-x{position:absolute;top:14px;right:12px;width:40px;height:40px;border:0;background:none;color:var(--dim);font-size:24px;line-height:1;cursor:pointer;font-family:inherit}' +
    '.dp-x:hover{color:var(--fg)}' +
    '.dp h2:focus{outline:none}' +
    '.dp-eyebrow{display:flex;align-items:center;gap:9px;font-size:12px;font-weight:620;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin:0 0 14px}' +
    '.dp-dot{width:7px;height:7px;border-radius:100px;background:var(--accent);box-shadow:0 0 0 0 var(--accent);animation:dp-pulse 2s infinite}' +
    '@keyframes dp-pulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--accent) 55%,transparent)}70%{box-shadow:0 0 0 9px transparent}100%{box-shadow:0 0 0 0 transparent}}' +
    '.dp h2{font-size:25px;line-height:1.18;font-weight:680;letter-spacing:-.02em;margin:0 30px 10px 0}' +
    '.dp-sub{font-size:15px;line-height:1.5;color:var(--soft);margin:0 0 22px}' +
    /* Ana sayfadaki .console / .transcript bileşeninin küçük hali. */
    '.dp-con{border:1px solid var(--line);background:var(--bg);margin:0 0 22px}' +
    '.dp-con-bar{display:flex;align-items:center;gap:12px;padding:10px 14px;border-bottom:1px solid var(--line-soft)}' +
    '.dp-dots{display:flex;gap:5px;flex:none}' +
    '.dp-dots i{width:7px;height:7px;border-radius:100px;background:var(--line)}' +
    '.dp-con-t{flex:1;min-width:0;font-size:12.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.dp-pill{flex:none;display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:600;padding:4px 9px;border:1px solid var(--line);color:var(--soft)}' +
    '.dp-tr{padding:14px;display:grid;gap:9px}' +
    '.dp-line{display:grid;grid-template-columns:54px minmax(0,1fr);gap:12px;align-items:baseline}' +
    '.dp-w{font-size:11px;font-weight:640;letter-spacing:.06em;text-transform:uppercase;color:var(--dim)}' +
    '.dp-w.ai{color:var(--accent)}' +
    '.dp-m{font-size:14px;line-height:1.45;background:var(--bub,rgba(127,127,127,.07));padding:10px 12px}' +
    '.dp-label{display:block;font-size:12px;font-weight:620;letter-spacing:.08em;text-transform:uppercase;color:var(--dim);margin:0 0 8px}' +
    '.dp-row{display:flex;gap:0}' +
    '.dp input,.dp select{font:inherit;font-size:16px;color:var(--fg);background:var(--bg);border:1px solid var(--line);border-radius:0;padding:15px 14px;min-width:0;outline:none;-webkit-appearance:none;appearance:none}' +
    '.dp input:focus{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent)}' +
    '.dp input.bad{border-color:#E5484D;box-shadow:0 0 0 1px #E5484D}' +
    '.dp-row input{flex:1}' +
    '.dp-btn{font:inherit;font-size:15px;font-weight:620;border:0;cursor:pointer;background:var(--btn-bg);color:var(--btn-fg);padding:15px 20px;white-space:nowrap;display:inline-flex;align-items:center;justify-content:center;gap:8px}' +
    '.dp-btn:hover{opacity:.88}' +
    '.dp-btn[disabled]{opacity:.55;cursor:default}' +
    '.dp-btn.full{width:100%;margin-top:14px;padding:17px 20px}' +
    '.dp-fine{font-size:12.5px;color:var(--dim);margin:12px 0 0}' +
    '.dp-err{font-size:13.5px;line-height:1.4;color:#E5484D;margin:10px 0 0;min-height:0}' +
    '.dp-err:empty{display:none}' +
    '.dp-chip{display:inline-flex;align-items:center;gap:8px;font-size:13px;border:1px solid var(--line);padding:7px 10px;margin:0 0 18px;max-width:100%}' +
    '.dp-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.dp-chip button{font:inherit;font-size:12px;border:0;background:none;color:var(--accent);cursor:pointer;padding:0 0 0 4px;text-decoration:underline;text-underline-offset:2px}' +
    '.dp-cc{position:relative;flex:none;border:1px solid var(--line);border-right:0;background:var(--bg);display:flex;align-items:center;padding:0 30px 0 14px;font-size:16px;font-weight:560}' +
    '.dp-cc::after{content:"";position:absolute;right:12px;top:50%;width:6px;height:6px;border-right:1.5px solid var(--dim);border-bottom:1.5px solid var(--dim);transform:translateY(-70%) rotate(45deg)}' +
    '.dp-cc select{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;border:0;padding:0}' +
    '.dp-cc:focus-within{border-color:var(--accent);border-right:1px solid var(--accent)}' +
    '.dp-consent{font-size:12px;line-height:1.5;color:var(--dim);margin:14px 0 0}' +
    '.dp-consent a{text-decoration:underline;text-underline-offset:2px}' +
    '.dp-ok{width:44px;height:44px;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;margin:0 0 18px}' +
    '.dp-hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;opacity:0}' +
    '.dp-step{animation:dp-fade .3s ease}' +
    '@keyframes dp-fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}' +
    '@media (max-width:640px){' +
      '.dp-backdrop{align-items:flex-end;padding:0}' +
      '.dp{max-width:none;max-height:92vh;transform:translateY(100%);border-left:0;border-right:0;border-bottom:0}' +
      '.dp-in{padding:28px 20px calc(22px + env(safe-area-inset-bottom))}' +
      '.dp h2{font-size:22px}' +
      '.dp-sub{font-size:14.5px;margin-bottom:18px}' +
      '.dp-con{margin-bottom:18px}' +
      '.dp-row.stack{flex-direction:column}' +
      '.dp-row.stack .dp-btn{width:100%;margin-top:10px;padding:17px 20px}' +
    '}' +
    '@media (prefers-reduced-motion:reduce){.dp-backdrop,.dp{transition:none}.dp-dot,.dp-step{animation:none}}';

  /* ─── İşaretleme ──────────────────────────────────────────────── */
  var privacyHref = '/privacy-policy';
  var countryOptions = COUNTRIES.map(function (c) {
    return '<option value="' + c[0] + '"' + (c[0] === defaultCountry ? ' selected' : '') + '>' + c[2] + ' ' + c[1] + '</option>';
  }).join('');

  var html = '' +
    '<div class="dp" role="dialog" aria-modal="true" aria-labelledby="dpTitle">' +
      '<button type="button" class="dp-x" data-dp-close aria-label="' + T.close + '">×</button>' +
      '<div class="dp-in">' +

        /* 1 — web sitesi */
        '<form class="dp-step" data-step="1" novalidate>' +
          '<p class="dp-eyebrow">' + T.eyebrow + '</p>' +
          '<h2 id="dpTitle">' + T.title + '</h2>' +
          '<p class="dp-sub">' + T.sub + '</p>' +
          '<div class="dp-con" aria-hidden="true">' +
            '<div class="dp-con-bar"><span class="dp-dots"><i></i><i></i><i></i></span><span class="dp-con-t" data-dp-host></span><span class="dp-pill"><span class="dp-dot"></span>' + T.preview + '</span></div>' +
            '<div class="dp-tr">' +
              '<div class="dp-line"><span class="dp-w">' + T.patient + '</span><span class="dp-m">' + T.ask + '</span></div>' +
              '<div class="dp-line"><span class="dp-w ai">AI</span><span class="dp-m">' + T.reply + '</span></div>' +
            '</div>' +
          '</div>' +
          '<label class="dp-label" for="dpSite">' + T.siteLabel + '</label>' +
          '<div class="dp-row stack">' +
            '<input id="dpSite" name="website" type="text" inputmode="url" autocomplete="url" autocapitalize="off" spellcheck="false" placeholder="' + T.hostPh + '" maxlength="200">' +
            '<button type="submit" class="dp-btn">' + T.next + ' <span aria-hidden="true">→</span></button>' +
          '</div>' +
          '<p class="dp-err" role="alert" data-dp-err></p>' +
          '<p class="dp-fine">' + T.fine + '</p>' +
        '</form>' +

        /* 2 — telefon */
        '<form class="dp-step" data-step="2" novalidate hidden>' +
          '<div class="dp-chip"><span>✓ <span data-dp-host></span></span><button type="button" data-dp-back>' + T.change + '</button></div>' +
          '<p class="dp-eyebrow">' + T.eyebrow2 + '</p>' +
          '<h2 tabindex="-1">' + T.title2 + '</h2>' +
          '<p class="dp-sub">' + T.sub2 + '</p>' +
          '<label class="dp-label" for="dpPhone">' + T.phoneLabel + '</label>' +
          '<div class="dp-row">' +
            '<label class="dp-cc"><span data-dp-dial></span><select name="country" aria-label="' + T.codeLabel + '">' + countryOptions + '</select></label>' +
            '<input id="dpPhone" name="phone" type="tel" inputmode="tel" autocomplete="tel-national" maxlength="24">' +
          '</div>' +
          '<input class="dp-hp" name="company_url" tabindex="-1" autocomplete="off" aria-hidden="true">' +
          '<p class="dp-err" role="alert" data-dp-err></p>' +
          '<button type="submit" class="dp-btn full">' + T.send + ' <span aria-hidden="true">→</span></button>' +
          '<p class="dp-consent">' + T.consent + ' <a href="' + privacyHref + '" target="_blank" rel="noopener">' + T.privacy + '</a></p>' +
        '</form>' +

        /* 3 — bitti */
        '<div class="dp-step" data-step="3" hidden>' +
          '<div class="dp-ok" aria-hidden="true">✓</div>' +
          '<h2 tabindex="-1">' + T.doneTitle + '</h2>' +
          '<p class="dp-sub" data-dp-done></p>' +
          '<button type="button" class="dp-btn full" data-dp-close>' + T.close + '</button>' +
        '</div>' +

      '</div>' +
    '</div>';

  /* ─── Durum ───────────────────────────────────────────────────── */
  var backdrop, dialog, lastFocus, openedAt, website = '', host = '', sent = false;

  function normalizeHost(raw) {
    var s = String(raw || '').trim().toLowerCase().replace(/\s+/g, '');
    if (!s) return '';
    s = s.replace(/^https?:\/\//, '').replace(/^www\./, '').split(/[/?#]/)[0];
    return /^([a-z0-9-]+\.)+[a-z¡-￿]{2,}$/i.test(s) ? s : '';
  }

  function $(sel, ctx) { return (ctx || dialog).querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(dialog.querySelectorAll(sel)); }

  function setHost(h) {
    var shown = h || T.hostPh;
    $$('[data-dp-host]').forEach(function (el) { el.textContent = shown; });
  }

  function showStep(n) {
    $$('.dp-step').forEach(function (el) { el.hidden = el.getAttribute('data-step') !== String(n); });
    var step = $('[data-step="' + n + '"]');
    var mobile = window.matchMedia('(max-width:640px)').matches;
    var target = n === 1 ? (mobile ? null : $('#dpSite')) : n === 2 ? $('#dpPhone') : $('h2', step);
    if (n === 2 && mobile) target = $('h2', step);
    if (target) setTimeout(function () { target.focus(); }, 60);
  }

  function setErr(form, msg, input) {
    $('[data-dp-err]', form).textContent = msg || '';
    if (input) input.classList.toggle('bad', !!msg);
  }

  function syncDial() {
    var sel = $('select[name="country"]');
    var c = COUNTRIES.filter(function (x) { return x[0] === sel.value; })[0] || COUNTRIES[0];
    $('[data-dp-dial]').textContent = c[1];
    $('#dpPhone').placeholder = c[3];
  }

  /* ─── Aç / kapat ──────────────────────────────────────────────── */
  function open() {
    if (backdrop) return;
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    backdrop = document.createElement('div');
    backdrop.className = 'dp-backdrop';
    backdrop.innerHTML = html;
    dialog = backdrop.firstChild;
    document.body.appendChild(backdrop);

    lastFocus = document.activeElement;
    document.documentElement.classList.add('dp-lock');
    openedAt = Date.now();
    setHost('');
    syncDial();
    wire();
    requestAnimationFrame(function () { requestAnimationFrame(function () { backdrop.classList.add('in'); }); });
    showStep(1);
    track('demo_popup_view', { lang: lang });
  }

  function close(reason) {
    if (!backdrop) return;
    if (!sent && !preview) store(K_SNOOZE, String(Date.now()));
    track('demo_popup_close', { step: currentStep(), reason: reason || 'button' });
    backdrop.classList.remove('in');
    document.documentElement.classList.remove('dp-lock');
    var el = backdrop;
    backdrop = null;
    setTimeout(function () { el.remove(); }, 300);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function currentStep() {
    var s = $$('.dp-step').filter(function (el) { return !el.hidden; })[0];
    return s ? Number(s.getAttribute('data-step')) : 0;
  }

  /* ─── Davranış ────────────────────────────────────────────────── */
  function wire() {
    var f1 = $('[data-step="1"]');
    var f2 = $('[data-step="2"]');
    var site = $('#dpSite');
    var phone = $('#dpPhone');
    var select = $('select[name="country"]');

    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) close('backdrop');
      if (e.target.closest('[data-dp-close]')) close('button');
    });

    backdrop.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close('escape'); return; }
      if (e.key !== 'Tab') return;
      var f = $$('button, input:not(.dp-hp), select, a[href]').filter(function (el) {
        return el.offsetParent !== null && !el.closest('[hidden]');
      });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    site.addEventListener('input', function () {
      setHost(normalizeHost(site.value));
      if (site.classList.contains('bad')) setErr(f1, '', site);
    });

    f1.addEventListener('submit', function (e) {
      e.preventDefault();
      var h = normalizeHost(site.value);
      if (!h) { setErr(f1, T.siteErr, site); site.focus(); return; }
      setErr(f1, '', site);
      website = site.value.trim();
      host = h;
      setHost(h);
      track('demo_popup_step1', { lang: lang });
      showStep(2);
    });

    $('[data-dp-back]').addEventListener('click', function () { showStep(1); });

    select.addEventListener('change', function () { syncDial(); setErr(f2, '', phone); });
    phone.addEventListener('input', function () {
      if (phone.classList.contains('bad')) setErr(f2, '', phone);
    });

    f2.addEventListener('submit', function (e) {
      e.preventDefault();
      var raw = phone.value.trim();
      var digits = raw.replace(/\D/g, '');
      if (digits.length < 6) { setErr(f2, T.errInvalid, phone); phone.focus(); return; }

      var btn = $('.dp-btn', f2);
      var label = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = T.sending;
      setErr(f2, '', phone);

      var eventId = 'demo_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      var body = {
        website: website,
        phone: raw,
        country: select.value,
        lang: lang,
        page: location.href.split('#')[0],
        referrer: document.referrer || '',
        elapsed: Date.now() - openedAt,
        company_url: $('.dp-hp').value,
        eventId: eventId,
        fbc: cookie('_fbc'),
        fbp: cookie('_fbp')
      };

      fetch('/api/auth/demo-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, j: j }; });
      }).then(function (res) {
        btn.disabled = false;
        btn.innerHTML = label;
        if (res.status === 200 && res.j.ok) {
          sent = true;
          if (!preview) store(K_SENT, String(Date.now()));
          $('[data-dp-done]').textContent = T.done(host, res.j.phone || raw);
          showStep(3);
          track('generate_lead', { form: 'demo_popup', lang: lang });
          try { if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: 'demo-popup' }, { eventID: eventId }); } catch (err) {}
          return;
        }
        var code = res.j && res.j.error;
        var msg = code === 'phone_not_mobile' ? T.errMobile
          : code === 'website_invalid' ? T.siteErr
          : code === 'rate_limited' ? T.errRate
          : code === 'phone_invalid' ? T.errInvalid
          : T.errNet;
        if (code === 'website_invalid') { showStep(1); setErr(f1, msg, site); return; }
        setErr(f2, msg, code === 'rate_limited' ? null : phone);
        track('demo_popup_error', { code: code || 'network' });
        phone.focus();
      }).catch(function () {
        btn.disabled = false;
        btn.innerHTML = label;
        setErr(f2, T.errNet, null);
      });
    });
  }

  /* ─── Tetikleyici: sekme görünürken geçen, sayfalar arası biriken süre ─ */
  if (preview) { open(); return; }

  var visibleMs = Number(session(K_SEEN_MS) || 0);
  var tick = setInterval(function () {
    if (document.visibilityState !== 'visible') return;
    if (document.body.classList.contains('menu-open')) return;
    visibleMs += 1000;
    session(K_SEEN_MS, String(visibleMs));
    if (visibleMs >= DELAY_MS) {
      clearInterval(tick);
      open();
    }
  }, 1000);
})();
