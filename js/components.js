/* ═══════════════════════════════════════════════════════════
   STOAIX — components.js
   Injects navbar, logo-slider, and footer into every marketing page.
   This script must be listed BEFORE main.js so event listeners
   in main.js bind to the freshly-injected elements.
   ═══════════════════════════════════════════════════════════ */

'use strict';

(function () {

  /* ─── Component templates ──────────────────────────────── */

  const NAVBAR_HTML = `
  <nav class="navbar" id="navbar">
    <div class="nav-inner">
      <a href="/" class="nav-logo">
        <img fetchpriority="high" src="/assets/logo-iconwithname.svg" class="nav-logo-wordmark" alt="STOAIX" />
      </a>

      <div class="nav-links">
        <div class="nav-dropdown-item">
          <button class="nav-link-btn">Product <span class="nav-chevron">↓</span></button>
          <div class="nav-dropdown">
            <div class="dropdown-inner">
              <a href="/#features" class="dropdown-link">
                <span class="dropdown-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 18.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z"/>
                    <path d="M19.14 19.14 22 22M2 22l2.86-2.86"/>
                    <path d="M12 12v-2M12 8v-.5"/>
                  </svg>
                </span>
                <div>
                  <div class="dropdown-title">Voice AI</div>
                  <div class="dropdown-desc">Answer every call, 24/7</div>
                </div>
              </a>
              <a href="/#channels" class="dropdown-link">
                <span class="dropdown-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </span>
                <div>
                  <div class="dropdown-title">WhatsApp &amp; Chat</div>
                  <div class="dropdown-desc">Automate message channels</div>
                </div>
              </a>
              <a href="/#features" class="dropdown-link">
                <span class="dropdown-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                  </svg>
                </span>
                <div>
                  <div class="dropdown-title">CRM &amp; Pipeline</div>
                  <div class="dropdown-desc">Track and score every lead</div>
                </div>
              </a>
              <a href="/#features" class="dropdown-link">
                <span class="dropdown-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                </span>
                <div>
                  <div class="dropdown-title">Integrations</div>
                  <div class="dropdown-desc">Connect your existing tools</div>
                </div>
              </a>
            </div>
          </div>
        </div>
        <a href="/#pricing" class="nav-link">Pricing</a>
        <a href="/case-studies.html" class="nav-link">Case Studies</a>
        <div class="nav-dropdown-item">
          <button class="nav-link-btn">Solutions <span class="nav-chevron">↓</span></button>
          <div class="nav-dropdown">
            <div class="dropdown-inner">
              <a href="/healthcare-clinics.html" class="dropdown-link">
                <span class="dropdown-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                </span>
                <div>
                  <div class="dropdown-title">Healthcare Clinics</div>
                  <div class="dropdown-desc">Hair transplant, dental, aesthetics</div>
                </div>
              </a>
              <a href="/partners.html" class="dropdown-link">
                <span class="dropdown-icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </span>
                <div>
                  <div class="dropdown-title">Partner Program</div>
                  <div class="dropdown-desc">Earn up to 50% recurring commission</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="nav-actions">
        <a href="/login.html" class="nav-login">Log in</a>
        <a href="/signup.html" class="btn-primary btn-sm">Start free trial</a>
      </div>

      <button class="nav-hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <div class="mobile-menu" id="mobileMenu">
    <a href="/#features">Product</a>
    <a href="/#pricing">Pricing</a>
    <a href="/case-studies.html">Case Studies</a>
    <a href="/healthcare-clinics.html">Healthcare Clinics</a>
    <a href="/partners.html">Partner Program</a>
    <a href="/login.html" class="nav-login">Log in</a>
    <a href="/signup.html" class="btn-primary">Start free trial</a>
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
        <a href="/" class="nav-logo">
          <img fetchpriority="high" src="/assets/logo-iconwithname.svg" class="nav-logo-wordmark" alt="STOAIX" />
        </a>
        <p class="footer-tagline">AI receptionist for any business. Answer every call, handle every message, convert every lead.</p>
        <div class="footer-socials">
          <a href="#" class="social-link" aria-label="X / Twitter">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="#" class="social-link" aria-label="LinkedIn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
          <a href="#" class="social-link" aria-label="YouTube">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
              <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02"/>
            </svg>
          </a>
        </div>
      </div>

      <div class="footer-cols">
        <div class="footer-col">
          <div class="footer-col-title">Product</div>
          <a href="#">Voice AI</a>
          <a href="#">WhatsApp Chatbot</a>
          <a href="#">Web Chat Widget</a>
          <a href="#">Outbound AI</a>
          <a href="#">CRM &amp; Pipeline</a>
          <a href="#">Integrations</a>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">Solutions</div>
          <a href="/healthcare-clinics.html">Healthcare Clinics</a>
          <a href="#">Real Estate</a>
          <a href="#">Education</a>
          <a href="#">E-Commerce</a>
          <a href="/partners.html">Agencies &amp; Resellers</a>
          <a href="/partners.html">White Label</a>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">Company</div>
          <a href="/about.html">About Us</a>
          <a href="#">Blog</a>
          <a href="/case-studies.html">Case Studies</a>
          <a href="/partners.html">Partners</a>
          <a href="#">Careers</a>
          <a href="mailto:hello@stoaix.com">hello@stoaix.com</a>
        </div>
        <div class="footer-col">
          <div class="footer-col-title">Legal</div>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
          <a href="#">GDPR</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <span>© 2026 STOAIX Ltd. — London, UK</span>
        <span>Made for businesses that refuse to miss a lead.</span>
      </div>
    </div>
  </footer>`;


  const PRICING_HTML = `
  <section class="pricing-section" id="pricing">
    <div class="container">
      <div class="section-header reveal">
        <div class="section-badge">Pricing</div>
        <h2 class="section-headline centered">Simple, transparent pricing.</h2>
        <p class="section-sub centered">Start free. Scale when you're ready. No contracts, cancel anytime.</p>

        <div class="billing-toggle">
          <span class="toggle-label toggle-monthly" id="label-monthly">Monthly</span>
          <button class="toggle-switch annual" id="billingToggle" aria-label="Toggle billing period">
            <span class="toggle-knob"></span>
          </button>
          <span class="toggle-label active-label" id="label-annual">Annual <span class="save-badge">Save 20%</span></span>
        </div>
      </div>

      <div class="pricing-grid reveal">

        <div class="price-card">
          <div class="price-tier">Essential</div>
          <div class="price-amount">
            <span class="price-currency">$</span>
            <span class="price-num" data-monthly="79" data-annual="63">79</span>
            <span class="price-period">/mo</span>
          </div>
          <div class="price-sub">Chat, CRM &amp; automation to get started</div>
          <a href="signup.html?plan=essential" class="btn-outline btn-full">Get started</a>
          <div class="price-trial-note has-trial">7-day free trial</div>
          <ul class="price-features">
            <li>Full CRM</li>
            <li>WhatsApp &amp; Instagram — Unlimited</li>
            <li>Knowledge base — Unlimited</li>
            <li>Chat AI &amp; Workflow</li>
            <li class="inactive">Voice agent</li>
            <li class="inactive">Advanced analytics</li>
            <li>Team members — 5</li>
          </ul>
        </div>

        <div class="price-card">
          <div class="price-tier">Professional</div>
          <div class="price-amount">
            <span class="price-currency">$</span>
            <span class="price-num" data-monthly="149" data-annual="119">149</span>
            <span class="price-period">/mo</span>
          </div>
          <div class="price-sub">Add Voice AI to your stack</div>
          <a href="signup.html?plan=professional" class="btn-outline btn-full">Get started</a>
          <div class="price-trial-note has-trial">7-day free trial</div>
          <ul class="price-features">
            <li>Everything in Essential</li>
            <li>Voice inbound — 150 min/mo</li>
            <li>Advanced analytics</li>
            <li>Multi-pipeline — 3</li>
            <li class="inactive">Voice outbound</li>
            <li class="inactive">Multi-language voice</li>
            <li>Team members — 10</li>
          </ul>
        </div>

        <div class="price-card price-card-featured">
          <div class="featured-badge">Best Value</div>
          <div class="price-tier">Business</div>
          <div class="price-amount">
            <span class="price-currency">$</span>
            <span class="price-num" data-monthly="299" data-annual="239">299</span>
            <span class="price-period">/mo</span>
          </div>
          <div class="price-sub">The full system — voice, chat &amp; pipeline</div>
          <a href="signup.html?plan=business" class="btn-primary btn-full">Get started</a>
          <div class="price-trial-note no-trial">No free trial</div>
          <ul class="price-features">
            <li>Everything in Professional</li>
            <li>Voice in+outbound — 300 min/mo</li>
            <li>All voice workflows</li>
            <li>Multi-language voice (8 languages)</li>
            <li>Analytics export</li>
            <li>Multi-pipeline — Unlimited</li>
            <li>Team members — 20</li>
          </ul>
        </div>

        <div class="price-card price-card-enterprise">
          <div class="featured-badge enterprise-badge">Limited Spots</div>
          <div class="price-tier">Custom</div>
          <div class="price-amount">
            <span class="price-custom">Custom Pricing</span>
          </div>
          <div class="price-sub">Done-with-you. Built around your business.</div>
          <a href="https://calendly.com/ataulufer1/30min" target="_blank" rel="noopener noreferrer" class="btn-primary btn-full btn-enterprise">Book a call</a>
          <ul class="price-features">
            <li>Everything in Business</li>
            <li>Custom minute packages</li>
            <li>Unlimited users</li>
            <li>Dedicated support</li>
            <li>Custom integrations</li>
            <li>SLA guarantee</li>
            <li>Price — Custom</li>
          </ul>
        </div>

      </div>

      <div class="pricing-note reveal">
        <span>Voice AI usage: $0.15/min after plan limit · </span>
        <span>Essential & Professional: 7-day free trial · </span>
        <span>Annual billing saves 20%</span>
      </div>
    </div>
  </section>`;


  /* ─── Injection logic ──────────────────────────────────── */

  function replaceWithFragment(existingEl, html) {
    const frag = document.createRange().createContextualFragment(html);
    existingEl.parentNode.insertBefore(frag, existingEl);
    existingEl.remove();
  }

  function init() {
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
  }

  // With defer, readyState is already 'interactive' — run immediately.
  // Fallback for non-defer usage.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
