/* ═══════════════════════════════════════════════════════════
   STOAIX — Lead Loss Calculator Pop-up
   "Cost of inaction" calculator: visitor quantifies the revenue
   they lose from missed leads, then books a call to recover it.
   Fully client-side (no backend), bilingual (EN/TR).
   ═══════════════════════════════════════════════════════════ */
'use strict';

(function leadCalcPopup() {
  // ── Master switch — flip to false to disable site-wide ───
  const ENABLED = true;

  // ── Config ───────────────────────────────────────────────
  const CALENDLY_URL = 'https://calendly.com/ataulufer1/20';
  const SHOW_DELAY_MS = 17000;        // cumulative time on site before timed trigger
  const DISMISS_COOLDOWN_DAYS = 14;   // don't re-show this long after a dismiss
  const BOOKED_COOLDOWN_DAYS = 30;    // don't re-show this long after CTA click

  const LEADS = { min: 5, max: 100, step: 5, def: 20 };
  const VALUE = { min: 200, max: 10000, step: 100, def: 1000 };

  if (!ENABLED) return;

  // ── Preview mode: add ?leadcalc=preview to any URL to open
  //    instantly and bypass all cooldown guards (for testing) ─
  const preview = /[?&#]leadcalc=preview/.test(window.location.search + window.location.hash);

  // ── Page filter: skip auth/checkout/admin pages ──────────
  const path = window.location.pathname.toLowerCase();
  const blocked = ['/signup', '/checkout', '/login', '/admin'];
  if (!preview && blocked.some(p => path.startsWith(p))) return;

  // ── Guards (cooldowns) ───────────────────────────────────
  const now = Date.now();
  const day = 86400000;
  const dismissedAt = Number(localStorage.getItem('stoaix-leadcalc-dismissed') || 0);
  const bookedAt = Number(localStorage.getItem('stoaix-leadcalc-booked') || 0);
  if (!preview && dismissedAt && now - dismissedAt < DISMISS_COOLDOWN_DAYS * day) return;
  if (!preview && bookedAt && now - bookedAt < BOOKED_COOLDOWN_DAYS * day) return;

  // ── Language helper (default TR) ─────────────────────────
  const _lang = localStorage.getItem('stoaix-lang') || 'tr';
  const t = (en, tr) => _lang !== 'en' ? tr : en;

  // ── Number formatting ────────────────────────────────────
  const nf = new Intl.NumberFormat('en-US');
  const money = n => '$' + nf.format(Math.round(n));

  // ── State ────────────────────────────────────────────────
  let overlay = null;
  let shown = false;
  let timer = null;

  // ── Build popup HTML ─────────────────────────────────────
  function createHTML() {
    return `
      <div class="lc-modal" role="dialog" aria-modal="true" aria-labelledby="lcTitle">
        <button class="lc-close" aria-label="${t('Close', 'Kapat')}">&times;</button>
        <div class="lc-badge">${t('Lost Revenue Calculator', 'Kayıp Gelir Hesabı')}</div>
        <h2 class="lc-title" id="lcTitle">${t('How many leads did you miss this month?', 'Bu ay kaç lead kaçırdınız?')}</h2>
        <p class="lc-sub">${t('Every unanswered call is a lost customer. Let\'s put a number on it.', 'Cevaplanmayan her arama, kaçan bir müşteri. Gelin rakamı birlikte görelim.')}</p>

        <div class="lc-field">
          <div class="lc-field-head">
            <label class="lc-label" for="lcLeads">${t('Missed leads per month', 'Ayda kaçırılan lead')}</label>
            <output class="lc-out" id="lcLeadsOut">${LEADS.def}</output>
          </div>
          <input type="range" class="lc-range" id="lcLeads"
            min="${LEADS.min}" max="${LEADS.max}" step="${LEADS.step}" value="${LEADS.def}"
            aria-label="${t('Missed leads per month', 'Ayda kaçırılan lead')}" />
          <div class="lc-scale"><span>${LEADS.min}</span><span>${LEADS.max}+</span></div>
        </div>

        <div class="lc-field">
          <div class="lc-field-head">
            <label class="lc-label" for="lcValue">${t('What a lead is worth to you', 'Bir lead\'in sizin için değeri')}</label>
            <output class="lc-out" id="lcValueOut">${money(VALUE.def)}</output>
          </div>
          <input type="range" class="lc-range" id="lcValue"
            min="${VALUE.min}" max="${VALUE.max}" step="${VALUE.step}" value="${VALUE.def}"
            aria-label="${t('What a lead is worth to you', 'Bir lead\'in sizin için değeri')}" />
          <div class="lc-scale"><span>${money(VALUE.min)}</span><span>${money(VALUE.max)}</span></div>
        </div>

        <div class="lc-total">
          <div class="lc-total-label">${t('Estimated revenue you lose every month', 'Her ay kaybettiğiniz tahmini gelir')}</div>
          <div class="lc-total-amount" id="lcTotal">${money(LEADS.def * VALUE.def)}</div>
          <div class="lc-total-annual" id="lcAnnual">${t('That\'s around', 'Bu, yılda yaklaşık')} <strong>${money(LEADS.def * VALUE.def * 12)}</strong> ${t('per year', 'demek')}</div>
        </div>

        <a href="${CALENDLY_URL}" target="_blank" rel="noopener" class="lc-cta" id="lcCta">
          ${t('Book a meeting now', 'Hemen Toplantı Planlayın')}
        </a>
        <div class="lc-reassure">${t('Free 15-min call · See exactly how · No commitment', 'Ücretsiz 15 dakika · Nasıl olduğunu görün · Taahhüt yok')}</div>
      </div>`;
  }

  // ── Animated count-up for the total ──────────────────────
  const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let totalRAF = null;
  let displayedTotal = LEADS.def * VALUE.def;

  function animateTotal(to) {
    const el = document.getElementById('lcTotal');
    if (!el) return;
    if (reduceMotion) {
      displayedTotal = to;
      el.textContent = money(to);
      return;
    }
    const from = displayedTotal;
    const dur = 380;
    let start = null;
    if (totalRAF) cancelAnimationFrame(totalRAF);
    function step(ts) {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      const val = from + (to - from) * eased;
      el.textContent = money(val);
      if (p < 1) {
        totalRAF = requestAnimationFrame(step);
      } else {
        displayedTotal = to;
      }
    }
    totalRAF = requestAnimationFrame(step);
  }

  // ── Update fill + outputs on slider input ────────────────
  function setFill(range) {
    const pct = ((range.value - range.min) / (range.max - range.min)) * 100;
    range.style.setProperty('--fill', pct + '%');
  }

  function recalc() {
    const leadsEl = document.getElementById('lcLeads');
    const valueEl = document.getElementById('lcValue');
    const leads = Number(leadsEl.value);
    const value = Number(valueEl.value);
    const total = leads * value;

    document.getElementById('lcLeadsOut').textContent = leads;
    document.getElementById('lcValueOut').textContent = money(value);
    setFill(leadsEl);
    setFill(valueEl);
    animateTotal(total);

    const annual = document.getElementById('lcAnnual');
    annual.innerHTML = `${t('That\'s around', 'Bu, yılda yaklaşık')} <strong>${money(total * 12)}</strong> ${t('per year', 'demek')}`;
  }

  // ── Show / close ─────────────────────────────────────────
  function show() {
    if (shown) return;
    shown = true;
    detachTriggers();

    overlay = document.createElement('div');
    overlay.className = 'lc-overlay';
    overlay.innerHTML = createHTML();
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // animate in
    overlay.offsetHeight;
    overlay.classList.add('lc-visible');

    // init sliders
    const leadsEl = document.getElementById('lcLeads');
    const valueEl = document.getElementById('lcValue');
    setFill(leadsEl);
    setFill(valueEl);
    leadsEl.addEventListener('input', recalc);
    valueEl.addEventListener('input', recalc);

    // close handlers
    overlay.querySelector('.lc-close').addEventListener('click', () => close(true));
    overlay.addEventListener('click', e => { if (e.target === overlay) close(true); });
    document.addEventListener('keydown', onKey);

    // CTA — mark as booked so we stop nagging this visitor
    document.getElementById('lcCta').addEventListener('click', () => {
      localStorage.setItem('stoaix-leadcalc-booked', String(Date.now()));
    });
  }

  function close(markDismissed) {
    if (!overlay) return;
    if (markDismissed) localStorage.setItem('stoaix-leadcalc-dismissed', String(Date.now()));
    document.removeEventListener('keydown', onKey);
    overlay.classList.remove('lc-visible');
    document.body.style.overflow = '';
    const ref = overlay;
    overlay = null;
    setTimeout(() => { if (ref && ref.parentNode) ref.parentNode.removeChild(ref); }, 300);
  }

  function onKey(e) {
    if (e.key === 'Escape') close(true);
  }

  // ── Triggers: cumulative timer OR exit-intent ────────────
  function onExitIntent(e) {
    // fire only when the cursor leaves through the top of the viewport
    if (e.clientY <= 0) show();
  }

  function detachTriggers() {
    if (timer) clearTimeout(timer);
    document.removeEventListener('mouseleave', onExitIntent);
  }

  function arm() {
    if (preview) { show(); return; }

    // cross-page cumulative timer
    let firstVisit = Number(localStorage.getItem('stoaix-leadcalc-first-visit') || 0);
    if (!firstVisit) {
      firstVisit = Date.now();
      localStorage.setItem('stoaix-leadcalc-first-visit', String(firstVisit));
    }
    const elapsed = Date.now() - firstVisit;
    const remaining = Math.max(0, SHOW_DELAY_MS - elapsed);
    timer = setTimeout(show, remaining);

    // exit-intent (desktop)
    document.addEventListener('mouseleave', onExitIntent);
  }

  arm();
})();
