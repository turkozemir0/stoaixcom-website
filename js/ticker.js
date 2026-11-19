/* ═══════════════════════════════════════════════════════════════════
   STOAIX — kayan duyuru bandı davranışı
   İşaretleme tools/v2-chrome.mjs → ticker(); stil css/ticker.css.
   JS yüklenmezse bant CSS animasyonuyla yine akar; bu dosya yalnızca
   "canlılık" katmanını ekler:
     · Web Animations ile sabit px/sn hız (mesaj uzunluğundan bağımsız)
     · sayfa hızlı kaydırılınca bant hızlanır, sonra yumuşakça sakinleşir
     · fare üzerine gelince yavaşlayıp durur, ayrılınca yeniden açılır
     · ekran dışındayken durur (pil), durdur/başlat düğmesi
     · demo bağlantısı popup'ı sayfa yenilemeden açar
   ═══════════════════════════════════════════════════════════════════ */
'use strict';

(function () {
  var bar = document.querySelector('[data-tk]');
  if (!bar || bar.__tk) return;
  bar.__tk = true;

  var track = bar.querySelector('.tk-track');
  var view = bar.querySelector('.tk-view');
  var first = bar.querySelector('.tk-list');
  var btn = bar.querySelector('.tk-ctl');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function track_(name) {
    try { if (typeof window.gtag === 'function') window.gtag('event', name, {}); } catch (e) {}
  }

  /* ─── Demo bağlantısı ─────────────────────────────────────────
     Popup yüklendiyse sayfa yenilenmeden açılır; henüz yüklenmediyse
     (ilk 1-2 sn) bağlantının kendisi ?demopopup=preview ile açar. */
  bar.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-tk-demo]');
    if (!a) return;
    track_('ticker_demo_click');
    if (typeof window.stxOpenDemo === 'function') {
      e.preventDefault();
      window.stxOpenDemo('ticker');
    }
  });

  var paused = false;
  function setPaused(p) {
    paused = p;
    btn.setAttribute('aria-pressed', p ? 'true' : 'false');
    btn.setAttribute('aria-label', btn.getAttribute(p ? 'data-play' : 'data-pause'));
  }

  /* ─── Hareket azaltma: akış yok, mesajlar yerinde sırayla değişir ── */
  if (reduced) {
    var items = first.querySelectorAll('li');
    var idx = 0;
    first.classList.add('tk-rot');
    items[0].classList.add('on');
    bar.classList.add('tk-on');
    setInterval(function () {
      if (paused || document.hidden) return;
      items[idx].classList.remove('on');
      idx = (idx + 1) % items.length;
      items[idx].classList.add('on');
    }, 4000);
    btn.addEventListener('click', function () { setPaused(!paused); });
    return;
  }

  if (typeof track.animate !== 'function') return;   /* CSS animasyonu kalır */

  /* ─── Akış ────────────────────────────────────────────────────── */
  function speed() { return window.innerWidth < 640 ? 36 : 44; }   /* px/sn */
  var dur = 90000;
  var anim;

  function measure() {
    var w = first.getBoundingClientRect().width;
    return w > 0 ? (w / speed()) * 1000 : dur;
  }

  bar.classList.add('tk-on');             /* CSS animasyonunu kapatır */
  dur = measure();
  anim = track.animate(
    [{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(-50%,0,0)' }],
    { duration: dur, iterations: Infinity }
  );

  /* Yazı tipi geç yüklenir ya da pencere değişirse süreyi, bulunduğu
     noktayı koruyarak güncelle — zıplama olmaz. */
  function retime() {
    var next = measure();
    if (Math.abs(next - dur) < 50) return;
    var t = anim.currentTime || 0;
    var frac = (t % dur) / dur;
    dur = next;
    try {
      anim.effect.updateTiming({ duration: dur });
      anim.currentTime = frac * dur;
    } catch (e) {}
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(retime);
  var rz;
  window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(retime, 200); });

  /* ─── Hız: hedefe yumuşak yaklaşan tek döngü ──────────────────────
     Döngü yalnız hız değişirken çalışır; sakinleşince kendini durdurur. */
  var rate = 1, boost = 0, hover = false, visible = true;
  var raf = 0, lastT = 0;

  function goal() {
    return (paused || hover || !visible) ? 0 : 1 + boost;
  }
  function loop(now) {
    /* Zamana bağlı: kare seyrekleşse de (zayıf cihaz, arka plan) doğru hızda
       yaklaşır; çok uzun boşlukta doğrudan hedefe oturur. */
    var dt = lastT ? Math.min(1000, now - lastT) : 16;
    lastT = now;
    boost *= Math.pow(0.93, dt / 16);
    if (boost < 0.01) boost = 0;
    var g = goal();
    rate += (g - rate) * Math.min(1, dt / 260);
    if (Math.abs(g - rate) < 0.003 && boost === 0) {
      rate = g;
      anim.playbackRate = rate;
      raf = 0;
      lastT = 0;
      return;
    }
    anim.playbackRate = rate;
    raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }

  /* Kaydırma hızı → kısa süreli canlanma (en fazla ~3,5x). */
  var lastY = window.scrollY, lastS = performance.now();
  window.addEventListener('scroll', function () {
    var now = performance.now();
    var v = Math.abs(window.scrollY - lastY) / Math.max(16, now - lastS);   /* px/ms */
    lastY = window.scrollY;
    lastS = now;
    /* Görünmezken de biriktir: yukarı dönünce bant canlı karşılar. */
    if (paused) return;
    boost = Math.min(2.5, boost + v * 0.5);
    kick();
  }, { passive: true });

  /* Fare: yavaşla, dur. Dokunmatikte hover yok sayılır. */
  view.addEventListener('pointerenter', function (e) {
    if (e.pointerType !== 'mouse') return;
    hover = true; kick();
  });
  view.addEventListener('pointerleave', function () { hover = false; kick(); });
  /* Klavye ile odaklanınca (demo bağlantısı) dur. */
  bar.addEventListener('focusin', function () { hover = true; kick(); });
  bar.addEventListener('focusout', function () { hover = false; kick(); });

  btn.addEventListener('click', function () {
    setPaused(!paused);
    track_(paused ? 'ticker_pause' : 'ticker_play');
    kick();
  });

  /* Ekran dışındayken durdur. */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      kick();
    }).observe(bar);
  }
})();
