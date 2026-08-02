/* ═══════════════════════════════════════════════════════════
   STOAIX — LIVE STATS  (ana sayfa "şu anda canlı" sayaçları)
   Zamana sabitli model: değer = başlangıç + (şimdi − epoch) × oran.
   Sayı ASLA sıfırlanmaz; her yükleme bir öncekinden yüksek başlar.
   Canlı tik + odometre yuvarlanması bunun üstüne binen görsel katmandır.
   ═══════════════════════════════════════════════════════════ */
'use strict';

(function () {
  /* ─── YAPILANDIRMA — tek yer, kolay ayar ───────────────────
     start     : epoch anındaki değer
     everySec  : ortalama +1 aralığı [min, max] saniye
     Oran huniyi yansıtır: çok mesaj → daha az yeni müşteri → nadir satış
     (mesaj/müşteri ≈ 4,2 · dönüşüm ≈ %9,6)                         */
  var LIVE_STATS_CONFIG = {
    epoch: '2026-08-02T00:00:00Z',
    countUpMs: 1300,
    stats: {
      messages:  { start: 118900, everySec: [4, 7] },
      customers: { start: 32300,  everySec: [18, 28] },
      wins:      { start: 2890,   everySec: [180, 300] }
    }
  };

  var section = document.getElementById('live-stats');
  if (!section) return;

  var EPOCH   = Date.parse(LIVE_STATS_CONFIG.epoch);
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function isTR() {
    try { var l = localStorage.getItem('stoaix-lang'); if (l) return l === 'tr'; } catch (e) {}
    return document.documentElement.lang === 'tr';
  }
  function fmt(n) { return Math.floor(n).toLocaleString(isTR() ? 'tr-TR' : 'en-US'); }
  function rand(a, b) { return a + Math.random() * (b - a); }

  var counters = Object.keys(LIVE_STATS_CONFIG.stats).map(function (key) {
    var cfg = LIVE_STATS_CONFIG.stats[key];
    return {
      cfg: cfg,
      el: section.querySelector('[data-livestat="' + key + '"]'),
      perSec: 2 / (cfg.everySec[0] + cfg.everySec[1]),
      value: 0,
      cells: null
    };
  }).filter(function (c) { return !!c.el; });

  function target(c) {
    return Math.floor(c.cfg.start + Math.max(0, (Date.now() - EPOCH) / 1000) * c.perSec);
  }

  /* ─── Odometre hücreleri ──────────────────────────────── */
  function makeCell(ch, parent) {
    var cell = { ch: ch };
    if (ch >= '0' && ch <= '9') {
      var wrap = document.createElement('span'); wrap.className = 'livestat-digit';
      var roll = document.createElement('span'); roll.className = 'livestat-roll';
      var d    = document.createElement('span'); d.textContent = ch;
      roll.appendChild(d); wrap.appendChild(roll); parent.appendChild(wrap);
      cell.roll = roll;
    } else {
      var s = document.createElement('span'); s.className = 'livestat-sep'; s.textContent = ch;
      parent.appendChild(s); cell.node = s;
    }
    return cell;
  }

  function settle(roll) {
    roll.classList.remove('is-rolling');
    while (roll.children.length > 1) roll.removeChild(roll.firstChild);
  }

  function rollCell(cell, ch) {
    cell.ch = ch;
    if (!cell.roll) { cell.node.textContent = ch; return; }
    if (reduced)   { cell.roll.firstChild.textContent = ch; return; }
    var roll = cell.roll;
    if (roll.children.length > 1) settle(roll);
    var next = document.createElement('span'); next.textContent = ch;
    roll.appendChild(next);
    requestAnimationFrame(function () { roll.classList.add('is-rolling'); });
    clearTimeout(roll.rollTimer);
    roll.rollTimer = setTimeout(function () { settle(roll); }, 480);
  }

  function render(c, animate) {
    var str = fmt(c.value), i;
    c.el.setAttribute('aria-label', str);
    if (!animate || !c.cells || c.cells.length !== str.length) {
      c.el.textContent = '';
      c.cells = [];
      for (i = 0; i < str.length; i++) c.cells.push(makeCell(str.charAt(i), c.el));
      return;
    }
    for (i = 0; i < str.length; i++) {
      if (c.cells[i].ch !== str.charAt(i)) rollCell(c.cells[i], str.charAt(i));
    }
  }

  function flash(c) {
    if (reduced) return;
    c.el.classList.add('is-tick');
    clearTimeout(c.flashTimer);
    c.flashTimer = setTimeout(function () { c.el.classList.remove('is-tick'); }, 380);
  }

  /* ─── Canlı tik (zamana sabitli hedefe kilitli) ───────── */
  function tick(c) {
    var t = target(c);
    if (c.value < t) { c.value += 1; render(c, true); flash(c); }
    else { c.value = t; }
    var delay = rand(c.cfg.everySec[0], c.cfg.everySec[1]) * 1000;
    if (t - c.value > 3) delay *= 0.35;        /* geride kaldıysa hızlan */
    c.tickTimer = setTimeout(function () { tick(c); }, delay);
  }

  /* ─── Görünür olunca count-up, sonra canlı tik ────────── */
  function start() {
    counters.forEach(function (c) {
      var end = target(c);
      if (reduced) { c.value = end; render(c, false); return; }
      var t0 = performance.now();
      (function frame(now) {
        var p = Math.min(1, (now - t0) / LIVE_STATS_CONFIG.countUpMs);
        c.value = Math.floor(end * (1 - Math.pow(1 - p, 3)));   /* easeOut cubic */
        render(c, false);
        if (p < 1) requestAnimationFrame(frame);
        else { c.value = target(c); render(c, false); tick(c); }
      })(t0);
    });
  }

  var started = false, io = null, poll = null;
  function kick() {
    if (started) return;
    started = true;
    if (io) io.disconnect();
    if (poll) clearInterval(poll);
    window.removeEventListener('scroll', onScroll);
    start();
  }
  function inView() {
    var r = section.getBoundingClientRect();
    return r.top < window.innerHeight * 0.9 && r.bottom > 0;
  }
  function onScroll() { if (inView()) kick(); }

  if (inView()) { kick(); }
  else {
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) kick(); });
      }, { threshold: 0.25 });
      io.observe(section);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    /* Güvenlik ağı: IO/scroll olayı gelmeyen ortamlarda görünürlüğü döngüyle yokla */
    poll = setInterval(onScroll, 400);
    setTimeout(kick, 5000);
  }
})();
