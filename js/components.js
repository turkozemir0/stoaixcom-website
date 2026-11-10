/* ═══════════════════════════════════════════════════════════
   STOAIX — components.js
   Injects navbar, logo-slider, and footer into every marketing page.
   This script must be listed BEFORE main.js so event listeners
   in main.js bind to the freshly-injected elements.
   ═══════════════════════════════════════════════════════════ */

'use strict';

(function () {

  /* Şablonlar init() anında üretilir: components.js bazı sayfalarda defer
     olmadan, i18n.js etiketinden ÖNCE yükleniyor. Dil kararı betik
     yüklenirken verilseydi i18n.js henüz DOM'da olmazdı ve sayfa
     "i18n yok → İngilizce" sanılırdı (metin Türkçe, linkler /en olurdu). */
  function templates() {
    /* ─── Dil ve hedefler ──────────────────────────────────────
       i18n.js ile aynı karar: lang="tr" sayfa doğrudan Türkçedir — i18n onu
       çevirmez, metni burada Türkçe basarız. Diğer sayfalarda metin İngilizce
       basılır, i18n sözlüğü (TR_COMMON) gerekirse çevirir. i18n yüklemeyen
       sayfalar (yasal metinler) hep İngilizcedir.
       Linkler ziyaretçinin dilindeki yeni tasarımlı sayfalara gider; eski
       /modules, /case-studies, /healthcare-clinics vercel.json'da yönlendirilir. */
    const NATIVE_TR = document.documentElement.lang === 'tr';
    const HAS_I18N = !!document.querySelector('script[src*="i18n"]');
    const IS_TR = NATIVE_TR || (HAS_I18N && (function () {
      const seg = location.pathname.split('/').filter(Boolean)[0];
      if (seg === 'tr' || seg === 'en') return seg === 'tr';
      try {
        const saved = localStorage.getItem('stoaix-lang');
        if (saved === 'tr' || saved === 'en') return saved === 'tr';
      } catch (e) {}
      return (navigator.language || '').toLowerCase().startsWith('tr');
    })());
    const t = (en, tr) => (NATIVE_TR ? tr : en);
    /* Dile bağlı link: iki hedef de yazılır, init() i18n'in son kararına hizalar. */
    const H = (tr, en) => `href="${IS_TR ? tr : en}" data-href-tr="${tr}" data-href-en="${en}"`;
    const CALL = 'https://calendly.com/ataulufer1/20';
    const NEW_TAG = '<span style="margin-left:6px;padding:2px 5px;border-radius:5px;background:var(--blue-tint);color:var(--blue);font-size:9.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;vertical-align:1.5px">new</span>';
    /* Linksiz footer satırı: .footer-col a ile aynı görünüm. */
    const PLAIN = 'display:block;font-size:.85rem;color:var(--text-2);margin-bottom:10px';
    const CLINICS = NATIVE_TR
      ? ['Diş klinikleri', 'Saç ekimi klinikleri', 'Estetik cerrahi', 'Medikal estetik', 'Dermatoloji', 'Göz klinikleri', 'Fizyoterapi', 'Çok şubeli klinik grupları']
      : ['Dental clinics', 'Hair transplant clinics', 'Aesthetic surgery', 'Medical aesthetics', 'Dermatology', 'Ophthalmology', 'Physiotherapy', 'Multi-site clinic groups'];


    /* ─── Component templates ──────────────────────────────── */

    const NAVBAR_HTML = `
    <nav class="navbar" id="navbar">
      <div class="nav-inner">
        <a ${H('/', '/en')} class="nav-logo">
          <img fetchpriority="high" src="/assets/logo-iconwithname.svg" class="nav-logo-wordmark" alt="STOAIX" />
        </a>

        <div class="nav-links">
          <a ${H('/#platform', '/en#platform')} class="nav-link">Platform</a>
          <a href="/stoaix-ads" class="nav-link">STOAIX Ads${NEW_TAG}</a>
          <a ${H('/pricing', '/en/pricing')} class="nav-link">${t('Pricing', 'Fiyatlandırma')}</a>
          <a ${H('/about', '/en/about')} class="nav-link">${t('About', 'Hakkımızda')}</a>
          <a ${H('/contact', '/en/contact')} class="nav-link">${t('Contact us', 'İletişim')}</a>
        </div>

        <div class="nav-actions">
          <a href="${CALL}" class="btn-primary btn-sm" target="_blank" rel="noopener noreferrer">${t('Book a call', 'Tanışma görüşmesi')}</a>
        </div>

        <button class="nav-hamburger" id="hamburger" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>

    <div class="mobile-menu" id="mobileMenu">
      <a ${H('/#platform', '/en#platform')}>Platform</a>
      <a href="/stoaix-ads">STOAIX Ads${NEW_TAG}</a>
      <a ${H('/pricing', '/en/pricing')}>${t('Pricing', 'Fiyatlandırma')}</a>
      <a ${H('/about', '/en/about')}>${t('About', 'Hakkımızda')}</a>
      <a ${H('/contact', '/en/contact')}>${t('Contact us', 'İletişim')}</a>
      <a href="${CALL}" class="btn-primary" target="_blank" rel="noopener noreferrer">${t('Book a call', 'Tanışma görüşmesi')}</a>
    </div>`;

    const MARQUEE_HTML = `
    <section class="marquee-section">
      <p class="marquee-label">Powered by the best. Connects with everything.</p>
      <div class="marquee-track-wrapper">
        <div class="marquee-fade marquee-fade-left"></div>
        <div class="marquee-fade marquee-fade-right"></div>

        <div class="marquee-track">
          <div class="marquee-inner marquee-left">
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/whatsapp.svg" alt="WhatsApp">WhatsApp</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/zapier.svg" alt="Zapier">Zapier</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/make.svg" alt="Make">Make</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/hubspot.svg" alt="HubSpot">HubSpot</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/salesforce.svg" alt="Salesforce">Salesforce</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/twilio.svg" alt="Twilio">Twilio</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/gohighlevel.png" alt="Go High Level">Go High Level</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/calendly.svg" alt="Calendly">Calendly</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/pipedrive.png" alt="Pipedrive">Pipedrive</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/zoho.svg" alt="Zoho CRM">Zoho CRM</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/googleads.svg" alt="Google Ads">Google Ads</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/tiktok.svg" alt="TikTok">TikTok</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/linkedin.svg" alt="LinkedIn">LinkedIn</div>
            <!-- Duplicate for seamless loop -->
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/whatsapp.svg" alt="WhatsApp">WhatsApp</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/zapier.svg" alt="Zapier">Zapier</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/make.svg" alt="Make">Make</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/hubspot.svg" alt="HubSpot">HubSpot</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/salesforce.svg" alt="Salesforce">Salesforce</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/twilio.svg" alt="Twilio">Twilio</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/gohighlevel.png" alt="Go High Level">Go High Level</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/calendly.svg" alt="Calendly">Calendly</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/pipedrive.png" alt="Pipedrive">Pipedrive</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/zoho.svg" alt="Zoho CRM">Zoho CRM</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/googleads.svg" alt="Google Ads">Google Ads</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/tiktok.svg" alt="TikTok">TikTok</div>
            <div class="logo-pill"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/linkedin.svg" alt="LinkedIn">LinkedIn</div>
          </div>
        </div>

        <div class="marquee-track">
          <div class="marquee-inner marquee-right">
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/instagram.svg" alt="Instagram">Instagram DM</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/telegram.svg" alt="Telegram">Telegram</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/facebook.svg" alt="Facebook">Facebook</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/googlecalendar.svg" alt="Google Calendar">Google Calendar</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/slack.svg" alt="Slack">Slack</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/dentsoft.png" alt="Dentsoft">Dentsoft</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/komocrm.png" alt="Komo CRM">Komo CRM</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/typeform.svg" alt="Typeform">Typeform</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/notion.svg" alt="Notion">Notion</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/airtable.svg" alt="Airtable">Airtable</div>
            <div class="logo-pill logo-pill-dim">Webhook API</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/dentally.png" alt="Dentally">Dentally</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/pabau.png" alt="Pabau">Pabau</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/fresha.png" alt="Fresha">Fresha</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/acuity.png" alt="Acuity Scheduling">Acuity Scheduling</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/freshworks.png" alt="Freshworks">Freshworks</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/youtube.svg" alt="YouTube">YouTube</div>
            <!-- Duplicate -->
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/instagram.svg" alt="Instagram">Instagram DM</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/telegram.svg" alt="Telegram">Telegram</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/facebook.svg" alt="Facebook">Facebook</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/googlecalendar.svg" alt="Google Calendar">Google Calendar</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/slack.svg" alt="Slack">Slack</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/dentsoft.png" alt="Dentsoft">Dentsoft</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/komocrm.png" alt="Komo CRM">Komo CRM</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/typeform.svg" alt="Typeform">Typeform</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/notion.svg" alt="Notion">Notion</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/airtable.svg" alt="Airtable">Airtable</div>
            <div class="logo-pill logo-pill-dim">Webhook API</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/dentally.png" alt="Dentally">Dentally</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/pabau.png" alt="Pabau">Pabau</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/fresha.png" alt="Fresha">Fresha</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/acuity.png" alt="Acuity Scheduling">Acuity Scheduling</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/freshworks.png" alt="Freshworks">Freshworks</div>
            <div class="logo-pill logo-pill-dim"><img loading="lazy" decoding="async" class="pill-logo" src="/assets/logos/youtube.svg" alt="YouTube">YouTube</div>
          </div>
        </div>
      </div>
    </section>`;

    const FOOTER_HTML = `
    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <a ${H('/', '/en')} class="nav-logo">
            <img fetchpriority="high" src="/assets/logo-iconwithname.svg" class="nav-logo-wordmark" alt="STOAIX" />
          </a>
          <p class="footer-tagline">${t('The AI sales operating system for clinic groups.', 'Klinik grupları için yapay zeka satış işletim sistemi.')}</p>
          <div class="footer-socials">
            <a href="https://www.linkedin.com/company/stoaix-ai" class="social-link" aria-label="LinkedIn" target="_blank" rel="noopener">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/stoaix.ai" class="social-link" aria-label="Instagram" target="_blank" rel="noopener">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="https://www.youtube.com/@stoaix" class="social-link" aria-label="YouTube" target="_blank" rel="noopener">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="footer-cols">
          <div class="footer-col">
            <div class="footer-col-title">Platform</div>
            <a ${H('/#specification', '/en#specification')}>${t('AI agents', 'AI asistanlar')}</a>
            <a ${H('/#revenue-calculator', '/en#revenue-calculator')}>${t('Growth', 'Büyüme')}</a>
            <a ${H('/#integrations', '/en#integrations')}>${t('Integrations', 'Entegrasyonlar')}</a>
            <a ${H('/#governance', '/en#governance')}>${t('Security', 'Güvenlik')}</a>
          </div>
          <div class="footer-col">
            <div class="footer-col-title">${t('Solutions', 'Çözümler')}</div>
            ${CLINICS.map((c) => `<span style="${PLAIN}">${c}</span>`).join('\n          ')}
          </div>
          <div class="footer-col">
            <div class="footer-col-title">${t('Company', 'Şirket')}</div>
            <a ${H('/about', '/en/about')}>${t('About', 'Hakkımızda')}</a>
            <a ${H('/contact', '/en/contact')}>${t('Contact us', 'İletişim')}</a>
          </div>
          <div class="footer-col">
            <div class="footer-col-title">${t('Legal', 'Yasal')}</div>
            <a href="/privacy-policy">${t('Privacy Policy', 'Gizlilik Politikası')}</a>
            <a href="/terms">${t('Terms of Service', 'Kullanım Koşulları')}</a>
            <a href="/cookie-policy">${t('Cookie Policy', 'Çerez Politikası')}</a>
            <a href="/privacy-policy#gdpr">${t('GDPR', 'KVKK')}</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container footer-bottom-inner">
          <span>${t('© 2026 STOAIX Ltd. — London, UK', '© 2026 STOAIX Ltd. — Londra, Birleşik Krallık')}</span>
          <span style="font-size:0.7rem;color:var(--text-3);opacity:0.7;">Protected by reCAPTCHA — <a href="https://policies.google.com/privacy" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;">Privacy</a> · <a href="https://policies.google.com/terms" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;">Terms</a></span>
          <span>${t('Made for clinics that refuse to miss a patient.', 'Tek bir hastayı bile kaçırmak istemeyen klinikler için.')}</span>
        </div>
      <div class="container footer-bottom-inner footer-legal" style="padding-top:0;justify-content:center;text-align:center;font-size:.72rem;opacity:.8;">STOAIX LTD · Registered in England and Wales · Company No. 17131250 · Registered office: 4 Raven Road, Unit 1c3-1121, London, E18 1HB</div>
      </div>
    </footer>`;


    /* Eski paket tablosu (Text AI $200 · Professional · Business · Enterprise)
       güncel fiyatlandırmayla çelişiyordu. Fiyatın tek kaynağı artık /pricing
       (js/pricing.mjs); bu bölüm yalnızca oraya yönlendirir. */
    const PRICING_HTML = `
    <section class="pricing-section" id="pricing">
      <div class="container">
        <div class="section-header reveal">
          <div class="section-badge">${t('Pricing', 'Fiyatlandırma')}</div>
          <h2 class="section-headline centered">${t('Transparent pricing, on one page.', 'Şeffaf fiyatlar, tek sayfada.')}</h2>
          <p class="section-sub centered">${t('Choose the AI agents your clinic needs and pay only for those. Every agent’s price and what’s included is on the pricing page.', 'Kliniğinizin ihtiyacı olan AI asistanları seçin, yalnızca onlar için ödeyin. Her asistanın fiyatı ve içindekiler fiyatlandırma sayfasında.')}</p>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:28px">
            <a ${H('/pricing', '/en/pricing')} class="btn-primary">${t('See pricing', 'Fiyatları görün')} →</a>
            <a href="${CALL}" class="btn-outline" target="_blank" rel="noopener noreferrer">${t('Book a call', 'Tanışma görüşmesi')}</a>
          </div>
        </div>
      </div>
    </section>`;

    return { NAVBAR_HTML, MARQUEE_HTML, FOOTER_HTML, PRICING_HTML };
  }



  /* ─── Injection logic ──────────────────────────────────── */

  function replaceWithFragment(existingEl, html) {
    const frag = document.createRange().createContextualFragment(html);
    existingEl.parentNode.insertBefore(frag, existingEl);
    existingEl.remove();
  }

  function init() {
    const { NAVBAR_HTML, MARQUEE_HTML, FOOTER_HTML, PRICING_HTML } = templates();
    const navEl      = document.getElementById('navbar');
    const mobileEl   = document.getElementById('mobileMenu');
    const marqueeEl  = document.querySelector('.marquee-section');
    const footerEl   = document.querySelector('footer.footer');
    const pricingEl  = document.getElementById('pricing-inject');

    // ── Navbar ──────────────────────────────────────────────
    if (navEl) {
      // Replace existing nav + mobile-menu with component version
      replaceWithFragment(navEl, NAVBAR_HTML);
      if (mobileEl) mobileEl.remove();
    }
    // Pages without a navbar don't get one injected (auth/app pages)

    // ── Marquee ─────────────────────────────────────────────
    // Position is always hardcoded in HTML (after the hero section).
    // JS only replaces the content to keep it in sync with this template.
    if (marqueeEl) {
      replaceWithFragment(marqueeEl, MARQUEE_HTML);
    }

    // ── Footer ──────────────────────────────────────────────
    if (footerEl) {
      replaceWithFragment(footerEl, FOOTER_HTML);
    }
    // Pages without a footer don't get one injected (auth/app pages)

    // ── Pricing ─────────────────────────────────────────────
    if (pricingEl) {
      pricingEl.insertAdjacentHTML('afterend', PRICING_HTML);
      pricingEl.remove();
    }

    // i18n.js dil kararını bu betikten SONRA verir ve <html lang>'i günceller
    // (ör. sözlüğü olmayan İngilizce sayfa Türkçe tarayıcıda İngilizce kalır).
    // Linkleri o son karara hizala: metin ve hedef hep aynı dilde olsun.
    window.addEventListener('load', function () {
      const lang = document.documentElement.lang === 'tr' ? 'tr' : 'en';
      document.querySelectorAll('[data-href-' + lang + ']').forEach(function (a) {
        a.setAttribute('href', a.getAttribute('data-href-' + lang));
      });
    });

    // The former lead-loss pop-up assumed every missed lead became a paying
    // patient. The scenario calculator now lives on the homepage and its own page.
  }

  // With defer, readyState is already 'interactive' — run immediately.
  // Fallback for non-defer usage.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
