/* ═══════════════════════════════════════════════════════════
   STOAIX SaaS Website — main.js
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── Navbar scroll behavior ─────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ─── Mobile hamburger menu ──────────────────────────────── */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();


/* ─── Channel tabs ───────────────────────────────────────── */
(function initChannelTabs() {
  const tabs = document.querySelectorAll('.ch-tab');
  const panels = document.querySelectorAll('.ch-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.querySelector(`.ch-panel[data-panel="${target}"]`);
      if (panel) panel.classList.add('active');
    });
  });
})();


/* ─── Billing tabs (monthly / quarterly / semi_annual / annual) */
(function initBillingTabs() {
  const tabsContainer = document.getElementById('billingTabs');
  if (!tabsContainer) return;

  const tabs = tabsContainer.querySelectorAll('.billing-tab');
  const priceNums = document.querySelectorAll('.price-num[data-monthly]');
  const pricingSection = document.getElementById('pricing');
  const onboardingPill = document.querySelector('.annual-onboarding-pill');
  const signupLinks = document.querySelectorAll('.pt-signup-link');

  let activeInterval = 'annual';

  // Billing totals lookup: plan → interval → label
  const billingTotals = {
    essential:    { monthly: 'Billed monthly', quarterly: 'Billed $537 every 3 months', semi_annual: 'Billed $954 every 6 months', annual: 'Billed $1,668/yr' },
    professional: { monthly: 'Billed monthly', quarterly: 'Billed $807 every 3 months', semi_annual: 'Billed $1,434 every 6 months', annual: 'Billed $2,508/yr' },
    business:     { monthly: 'Billed monthly', quarterly: 'Billed $1,617 every 3 months', semi_annual: 'Billed $2,874 every 6 months', annual: 'Billed $5,028/yr' },
  };

  function update() {
    // Animate prices
    priceNums.forEach(el => {
      const target = +el.dataset[activeInterval] || +el.dataset.monthly;
      animatePrice(el, target);
    });

    // Tab active state
    tabs.forEach(t => t.classList.toggle('active', t.dataset.interval === activeInterval));

    // Pricing section data attribute
    if (pricingSection) pricingSection.setAttribute('data-interval', activeInterval);

    // Onboarding pill visibility
    if (onboardingPill) {
      const show = activeInterval === 'annual';
      onboardingPill.style.opacity = show ? '1' : '0';
      onboardingPill.style.transform = show ? 'none' : 'translateY(-4px)';
      onboardingPill.style.pointerEvents = show ? '' : 'none';
    }

    // Billing notes
    document.querySelectorAll('.pt-billing-note[data-plan]').forEach(el => {
      const plan = el.dataset.plan;
      if (billingTotals[plan]) el.textContent = billingTotals[plan][activeInterval] || '';
    });

    // Signup links — add billing param
    signupLinks.forEach(link => {
      const url = new URL(link.href, window.location.origin);
      url.searchParams.set('billing', activeInterval);
      link.href = url.pathname + url.search;
    });

    // Savings badges — read prices from DOM, no hardcoded values
    const _lang = localStorage.getItem('stoaix-lang') || 'tr';
    const multipliers = { monthly: 1, quarterly: 3, semi_annual: 6, annual: 12 };
    const planMap = { essential: 0, professional: 1, business: 2 };
    document.querySelectorAll('.pt-savings-badge').forEach(el => {
      const plan = el.dataset.plan;
      const idx = planMap[plan];
      if (idx === undefined) return;
      const priceEl = priceNums[idx];
      if (!priceEl) return;
      const monthly = +priceEl.dataset.monthly;
      const current = +priceEl.dataset[activeInterval] || monthly;
      const savings = (monthly - current) * multipliers[activeInterval];
      if (savings > 0) {
        el.textContent = _lang === 'en'
          ? 'Save $' + savings.toLocaleString()
          : '$' + savings.toLocaleString() + ' Tasarruf';
        el.style.display = 'inline-block';
      } else {
        el.style.display = 'none';
      }
    });
  }

  function animatePrice(el, target) {
    const start = +el.textContent;
    if (start === target) return;
    const duration = 280;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * ease);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }

    requestAnimationFrame(step);
  }

  tabsContainer.addEventListener('click', (e) => {
    const tab = e.target.closest('.billing-tab');
    if (!tab || tab.dataset.interval === activeInterval) return;
    activeInterval = tab.dataset.interval;
    update();
  });

  // Initialize
  update();
})();


/* ─── Mobile pricing: compare-all toggle ─────────────── */
(function initMobilePricingToggle() {
  const btn = document.getElementById('mplanCompareToggle');
  if (!btn) return;
  const wrap = document.querySelector('.ptable-wrap');
  if (!wrap) return;
  btn.addEventListener('click', function() {
    const expanded = wrap.classList.toggle('expanded');
    btn.classList.toggle('expanded', expanded);
    btn.querySelector('span').textContent = expanded ? 'Hide comparison' : 'Compare all features';
    if (expanded) wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
})();


/* ─── Hero typewriter effect ─────────────────────────────── */
(function initHeroWords() {
  const wordEls    = document.querySelectorAll('.hero-word');
  const typewriter = document.querySelector('.hero-typewriter');
  if (!wordEls.length || !typewriter) return;

  const TYPING_SPEED  = 80;
  const ERASING_SPEED = 45;
  const PAUSE_AFTER   = 1800;
  const PAUSE_BEFORE  = 300;

  let wordIndex = 0;

  function getWords() {
    return Array.from(wordEls).map(el => el.textContent.trim());
  }

  function typeWord(word, done) {
    let i = 0;
    function tick() {
      typewriter.textContent = word.slice(0, ++i);
      if (i < word.length) setTimeout(tick, TYPING_SPEED);
      else done();
    }
    tick();
  }

  function eraseWord(done) {
    const text = typewriter.textContent;
    let i = text.length;
    function tick() {
      typewriter.textContent = text.slice(0, --i);
      if (i > 0) setTimeout(tick, ERASING_SPEED);
      else done();
    }
    tick();
  }

  function cycle() {
    const words = getWords();
    const word = words[wordIndex];
    wordIndex = (wordIndex + 1) % words.length;

    typeWord(word, () => {
      setTimeout(() => {
        eraseWord(() => setTimeout(cycle, PAUSE_BEFORE));
      }, PAUSE_AFTER);
    });
  }

  cycle();
})();


/* ─── Rotating words ─────────────────────────────────────── */
(function initRotatingWords() {
  const words = document.querySelectorAll('.rotating-word');
  if (!words.length) return;

  let current = 0;
  const INTERVAL = 2400;

  function next() {
    const prev = current;
    current = (current + 1) % words.length;

    words[prev].classList.add('exit');
    words[prev].classList.remove('active');

    // After exit transition, clean up
    setTimeout(() => {
      words[prev].classList.remove('exit');
    }, 450);

    words[current].classList.add('active');
  }

  setInterval(next, INTERVAL);
})();


/* ─── Count-up on scroll ─────────────────────────────────── */
(function initCountUp() {
  const els = document.querySelectorAll('[data-countup]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const el = entry.target;
      const target = parseFloat(el.dataset.countup);
      const suffix = el.dataset.suffix || '';
      const isFloat = String(el.dataset.countup).includes('.');
      const duration = 1600;
      const startTime = performance.now();

      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const val = target * ease;
        el.textContent = (isFloat ? val.toFixed(1) : Math.round(val).toLocaleString()) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = (isFloat ? target.toFixed(1) : target.toLocaleString()) + suffix;
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.4 });

  els.forEach(el => observer.observe(el));
})();


/* ─── Scroll reveal (IntersectionObserver) ───────────────── */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .stagger');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ─── Smooth anchor scroll ───────────────────────────────── */
(function initSmoothScroll() {
  const NAV_H = 68;
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_H - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ─── Pricing card hover glow ────────────────────────────── */
(function initCardGlow() {
  document.querySelectorAll('.price-card, .feature-card, .setup-step, .demo-placeholder, .screenshot-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
})();


/* ─── Hero card typing animation ────────────────────────── */
(function initTypingAnimation() {
  const indicator = document.querySelector('.typing-indicator');
  if (!indicator) return;

  // After a delay, show a "sent" message
  setTimeout(() => {
    const bubble = document.createElement('div');
    bubble.className = 'convo-msg convo-outgoing';
    bubble.innerHTML = `
      <div class="convo-bubble ai-bubble">
        Perfect! I've booked you in for Thursday at 2pm. You'll receive a confirmation via WhatsApp. Is there anything else I can help with?
      </div>
      <div class="convo-avatar ai-avatar">AI</div>
    `;

    if (indicator.parentElement) {
      indicator.parentElement.replaceChild(bubble, indicator);
    }
  }, 2800);
})();


/* ─── Aura canvas animation ──────────────────────────────── */
(function initAura() {
  const canvas = document.getElementById('aura-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.width  = 480;
  const H = canvas.height = 480;
  const cx = W / 2;
  const cy = H / 2;

  let t = 0;
  let isVisible = true;
  let rafId = null;

  // Pause when tab is hidden — saves CPU/battery
  document.addEventListener('visibilitychange', () => {
    isVisible = document.visibilityState === 'visible';
    if (isVisible && !rafId) rafId = requestAnimationFrame(drawFrame);
  });

  // Pause when canvas scrolls out of viewport
  const observer = new IntersectionObserver(entries => {
    isVisible = entries[0].isIntersecting;
    if (isVisible && !rafId) rafId = requestAnimationFrame(drawFrame);
  }, { threshold: 0 });
  observer.observe(canvas);

  const rings = [
    { offset: 0,    speed: 0.35, color: 'rgba(59,130,246,'  },
    { offset: 0.33, speed: 0.35, color: 'rgba(99,102,241,'  },
    { offset: 0.66, speed: 0.35, color: 'rgba(37,99,235,'   },
  ];

  function drawFrame() {
    rafId = null;
    if (!isVisible) return;
    ctx.clearRect(0, 0, W, H);

    // Background glow
    const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 220);
    bgGrad.addColorStop(0,   'rgba(37,99,235,0.25)');
    bgGrad.addColorStop(0.5, 'rgba(29,78,216,0.12)');
    bgGrad.addColorStop(1,   'rgba(37,99,235,0)');
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 220, 0, Math.PI * 2);
    ctx.fill();

    // Expanding pulse rings
    rings.forEach(ring => {
      const phase = (t * ring.speed + ring.offset) % 1;
      const r     = phase * 210;
      const alpha = (1 - phase) * 0.6;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = ring.color + alpha + ')';
      ctx.lineWidth   = 2 - phase;
      ctx.stroke();
    });

    // Mid glow ring (pulsing)
    const pulseScale = 1 + Math.sin(t * 1.5) * 0.06;
    const midR       = 80 * pulseScale;
    const midGrad    = ctx.createRadialGradient(cx, cy, midR * 0.5, cx, cy, midR * 1.3);
    midGrad.addColorStop(0,   'rgba(96,165,250,0.2)');
    midGrad.addColorStop(0.5, 'rgba(59,130,246,0.08)');
    midGrad.addColorStop(1,   'rgba(37,99,235,0)');
    ctx.fillStyle = midGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, midR * 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Core orb
    const coreR    = 36 + Math.sin(t * 2) * 4;
    const coreGrad = ctx.createRadialGradient(cx - 8, cy - 8, 0, cx, cy, coreR + 20);
    coreGrad.addColorStop(0,    '#bfdbfe');
    coreGrad.addColorStop(0.25, '#60a5fa');
    coreGrad.addColorStop(0.6,  '#2563eb');
    coreGrad.addColorStop(0.85, '#1d4ed8');
    coreGrad.addColorStop(1,    'rgba(29,78,216,0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, coreR + 20, 0, Math.PI * 2);
    ctx.fill();

    // Core highlight
    const hlGrad = ctx.createRadialGradient(cx - 10, cy - 10, 0, cx - 10, cy - 10, coreR * 0.7);
    hlGrad.addColorStop(0, 'rgba(255,255,255,0.7)');
    hlGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hlGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
    ctx.fill();

    t += 0.012;
    rafId = requestAnimationFrame(drawFrame);
  }

  rafId = requestAnimationFrame(drawFrame);
})();
