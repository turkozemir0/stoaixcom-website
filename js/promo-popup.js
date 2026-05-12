/* ═══════════════════════════════════════════════════════════
   STOAIX — Promo Pop-up Discount System
   ═══════════════════════════════════════════════════════════ */
'use strict';

(async function promoPopup() {
  // ── Page filter: skip auth/checkout/admin pages ──────────
  const path = window.location.pathname.toLowerCase()
  const blocked = ['/signup', '/checkout', '/login', '/admin']
  if (blocked.some(p => path.startsWith(p))) return

  // ── Guards ───────────────────────────────────────────────
  if (localStorage.getItem('stoaix-promo-dismissed')) return

  const savedCode = localStorage.getItem('stoaix-promo-code')
  const savedExpiry = localStorage.getItem('stoaix-promo-expiry')
  if (savedCode && savedExpiry && new Date(savedExpiry) > new Date()) return

  // ── Kill switch ──────────────────────────────────────────
  try {
    const statusRes = await fetch('/api/promo/status')
    const { enabled } = await statusRes.json()
    if (!enabled) return
  } catch { return }

  // ── Language helper ──────────────────────────────────────
  const _lang = localStorage.getItem('stoaix-lang') || 'tr'
  const t = (en, tr) => _lang !== 'en' ? tr : en

  // ── Visitor ID ───────────────────────────────────────────
  let visitorId = localStorage.getItem('stoaix-visitor-id')
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('stoaix-visitor-id', visitorId)
  }

  // ── reCAPTCHA ────────────────────────────────────────────
  const RECAPTCHA_SITE_KEY = '6Ld3QbwsAAAAAJOdmYVUTV3C7T5eUyeuS-CCKX1M'
  let recaptchaReady = false

  function loadRecaptcha() {
    if (document.querySelector('script[src*="recaptcha/api.js"]')) {
      recaptchaReady = true
      return
    }
    const s = document.createElement('script')
    s.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
    s.onload = () => { recaptchaReady = true }
    document.head.appendChild(s)
  }

  async function getRecaptchaToken(action) {
    if (!recaptchaReady || typeof grecaptcha === 'undefined') return ''
    try {
      return await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action })
    } catch { return '' }
  }

  // ── Analytics helper ─────────────────────────────────────
  function trackEvent(event, popupType, code) {
    const payload = JSON.stringify({ event, popupType, visitorId, code })
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/promo/event', new Blob([payload], { type: 'application/json' }))
    } else {
      fetch('/api/promo/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload }).catch(() => {})
    }
  }

  // ── State ────────────────────────────────────────────────
  let state = 'idle' // idle | timed_open | exit_open | done
  let overlay = null
  let countdownInterval = null

  // ── Build popup HTML ─────────────────────────────────────
  function createPopupHTML(type) {
    const isTimed = type === 'timed'
    const title = isTimed
      ? t('You have a 10% discount!', '%10 indiriminiz var!')
      : t('10% discount — last chance!', '%10 indirim — son fırsat!')
    const subtitle = isTimed
      ? t('Limited Offer', 'Sınırlı Teklif')
      : t('This is our final offer.', 'Bu son teklifimiz.')
    const validity = isTimed
      ? t('Valid for 60 minutes', '60 dakika geçerli')
      : t('Valid for 12 hours', '12 saat geçerli')

    return `
      <div class="promo-modal" role="dialog" aria-modal="true">
        <button class="promo-close" aria-label="Close">&times;</button>
        <div class="promo-badge-label">${subtitle}</div>
        <h2 class="promo-title">${title}</h2>
        <div class="promo-countdown" id="promoCountdown"></div>
        <div class="promo-validity">${validity}</div>

        <form class="promo-form" id="promoForm">
          <div class="promo-form-row">
            <input type="text" class="promo-input" id="promoFirstName" placeholder="${t('First name', 'Ad')}" required autocomplete="given-name" />
            <input type="text" class="promo-input" id="promoLastName" placeholder="${t('Last name', 'Soyad')}" required autocomplete="family-name" />
          </div>
          <input type="tel" class="promo-input" id="promoPhone" placeholder="${t('Phone', 'Telefon')}" required autocomplete="tel" />
          <button type="submit" class="promo-submit" id="promoSubmitBtn">${t('Get my discount code', 'İndirim kodumu al')}</button>
        </form>

        <div class="promo-success" id="promoSuccess" style="display:none">
          <div class="promo-success-label">${t('Your discount code', 'İndirim kodunuz')}</div>
          <div class="promo-code-display" id="promoCodeDisplay"></div>
          <button class="promo-copy-btn" id="promoCopyBtn">${t('Copy', 'Kopyala')}</button>
          <div class="promo-success-note" id="promoSuccessNote"></div>
        </div>

        <div class="promo-error" id="promoError" style="display:none"></div>
      </div>`
  }

  // ── Show popup ───────────────────────────────────────────
  function showPopup(type) {
    if (state === 'done') return

    // Create overlay
    overlay = document.createElement('div')
    overlay.className = 'promo-overlay'
    overlay.innerHTML = createPopupHTML(type)
    document.body.appendChild(overlay)

    // Force reflow then animate in
    overlay.offsetHeight
    overlay.classList.add('promo-visible')

    state = type === 'timed' ? 'timed_open' : 'exit_open'
    trackEvent('popup_shown', type)

    // Start countdown
    const countdownEl = document.getElementById('promoCountdown')
    const totalSec = type === 'timed' ? 3600 : 43200 // 60min or 12h
    let remaining = totalSec
    function updateCountdown() {
      const h = Math.floor(remaining / 3600)
      const m = Math.floor((remaining % 3600) / 60)
      const s = remaining % 60
      if (h > 0) {
        countdownEl.textContent = `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      } else {
        countdownEl.textContent = `${m}:${String(s).padStart(2, '0')}`
      }
      remaining--
      if (remaining < 0) clearInterval(countdownInterval)
    }
    updateCountdown()
    countdownInterval = setInterval(updateCountdown, 1000)

    // ── Close button ──
    const closeBtn = overlay.querySelector('.promo-close')
    closeBtn.addEventListener('click', () => {
      closePopup(type)
    })

    // ── Overlay click ──
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePopup(type)
    })

    // ── Form submit ──
    const form = document.getElementById('promoForm')
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const btn = document.getElementById('promoSubmitBtn')
      const errorEl = document.getElementById('promoError')
      btn.disabled = true
      btn.textContent = '...'
      errorEl.style.display = 'none'

      try {
        const recaptchaToken = await getRecaptchaToken('promo_popup')

        const res = await fetch('/api/promo/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: document.getElementById('promoFirstName').value.trim(),
            lastName: document.getElementById('promoLastName').value.trim(),
            phone: document.getElementById('promoPhone').value.trim(),
            popupType: type,
            visitorId,
            recaptchaToken,
          }),
        })

        const data = await res.json()

        if (!res.ok || !data.success) {
          errorEl.textContent = data.error || t('Something went wrong', 'Bir hata oluştu')
          errorEl.style.display = 'block'
          btn.disabled = false
          btn.textContent = t('Get my discount code', 'İndirim kodumu al')
          return
        }

        trackEvent('form_submitted', type, data.code)

        // Save to localStorage
        localStorage.setItem('stoaix-promo-code', data.code)
        localStorage.setItem('stoaix-promo-expiry', data.expiresAt)
        localStorage.setItem('stoaix-promo-dismissed', '1')

        // Show success view
        document.getElementById('promoForm').style.display = 'none'
        const successEl = document.getElementById('promoSuccess')
        successEl.style.display = 'block'
        document.getElementById('promoCodeDisplay').textContent = data.code

        const validityNote = type === 'timed'
          ? t('Valid for 60 minutes', '60 dakika geçerli')
          : t('Valid for 12 hours', '12 saat geçerli')
        document.getElementById('promoSuccessNote').textContent =
          t('Automatically applied at checkout. ', 'Ödeme sayfasında otomatik uygulanır. ') + validityNote

        // Copy button
        document.getElementById('promoCopyBtn').addEventListener('click', () => {
          navigator.clipboard.writeText(data.code).then(() => {
            document.getElementById('promoCopyBtn').textContent = t('Copied!', 'Kopyalandı!')
            trackEvent('code_copied', type, data.code)
            setTimeout(() => {
              document.getElementById('promoCopyBtn').textContent = t('Copy', 'Kopyala')
            }, 2000)
          })
        })

        state = 'done'
      } catch (err) {
        errorEl.textContent = t('Network error. Please try again.', 'Ağ hatası. Tekrar deneyin.')
        errorEl.style.display = 'block'
        btn.disabled = false
        btn.textContent = t('Get my discount code', 'İndirim kodumu al')
      }
    })
  }

  // ── Close popup ──────────────────────────────────────────
  function closePopup(type) {
    if (!overlay) return
    if (countdownInterval) clearInterval(countdownInterval)
    trackEvent('popup_dismissed', type)

    overlay.classList.remove('promo-visible')
    setTimeout(() => {
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay)
      overlay = null
    }, 300)

    if (type === 'timed' && state !== 'done') {
      // Show exit intent popup after 2.5s delay
      setTimeout(() => {
        if (state === 'done') return
        showPopup('exit_intent')
      }, 2500)
    } else {
      // Exit intent dismissed — mark as done
      localStorage.setItem('stoaix-promo-dismissed', '1')
      state = 'done'
    }
  }

  // ── Timer logic (cross-page) ─────────────────────────────
  loadRecaptcha()

  const firstVisit = localStorage.getItem('stoaix-first-visit')
  if (!firstVisit) {
    localStorage.setItem('stoaix-first-visit', String(Date.now()))
  }

  const elapsed = Date.now() - Number(firstVisit || Date.now())
  const remaining = Math.max(0, 60000 - elapsed)

  if (remaining === 0) {
    // Already past 60s — show immediately
    showPopup('timed')
  } else {
    setTimeout(() => showPopup('timed'), remaining)
  }
})();
