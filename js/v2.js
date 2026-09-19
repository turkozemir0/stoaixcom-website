/* ═══════════════════════════════════════════════════════════════════
   STOAIX v2 — etkileşim katmanı
   İçeriğin tamamı HTML'de statik olarak bulunur; bu dosya yalnızca
   davranışı yönetir: tema, sekmeler, daktilo, aktivite akışı, harita,
   mobil menü. JS yüklenmezse sayfa okunur durumda kalır.
   ═══════════════════════════════════════════════════════════════════ */
'use strict';

(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* ─── Tema (6a ink / 6b bone) ───────────────────────────────── */
  var themeBtns = document.querySelectorAll('[data-theme]');

  function setTheme(theme) {
    root.className = 'pal-' + theme;
    try { localStorage.setItem('stoaix.theme', theme); } catch (e) {}
    themeBtns.forEach(function (b) {
      var on = b.dataset.theme === theme;
      b.className = on ? 'on' : 'off';
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    drawMap();                       /* harita renkleri palete bağlı */
  }

  themeBtns.forEach(function (b) {
    b.addEventListener('click', function () { setTheme(b.dataset.theme); });
  });

  /* Sayfa açılışında head'deki bootstrap script temayı uygulamıştı;
     buton durumlarını onunla hizala. */
  (function syncTheme() {
    var theme = root.className.indexOf('bone') > -1 ? 'bone' : 'ink';
    themeBtns.forEach(function (b) {
      var on = b.dataset.theme === theme;
      b.className = on ? 'on' : 'off';
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  })();

  /* ─── Dil ───────────────────────────────────────────────────────
     Dil geçişi gerçek bir sayfa değişimidir (/v2 ↔ /tr/v2).
     Tercihi site genelindeki anahtara yazarız ki diğer sayfalarla
     tutarlı kalsın ve head'deki yönlendirme geri almasın. */
  document.querySelectorAll('[hreflang]').forEach(function (a) {
    a.addEventListener('click', function () {
      try {
        localStorage.setItem('stoaix-lang', a.getAttribute('hreflang'));
        sessionStorage.setItem('stoaix-v2-redirected', '1');
      } catch (e) {}
    });
  });

  /* ─── Konsol sekmeleri ──────────────────────────────────────── */
  var tabs = document.querySelectorAll('[data-tab]');

  function selectTab(key) {
    tabs.forEach(function (t) {
      var on = t.dataset.tab === key;
      t.className = on ? 'on' : 'off';
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    ['ov', 'cv', 'cm', 'cl'].forEach(function (k) {
      var p = document.getElementById('panel-' + k);
      if (!p) return;
      var on = k === key;
      p.classList.toggle('on', on);
      if (on) p.removeAttribute('hidden'); else p.setAttribute('hidden', '');
    });
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () { selectTab(t.dataset.tab); });
    t.addEventListener('keydown', function (e) {
      var keys = ['ov', 'cv', 'cm', 'cl'];
      var i = keys.indexOf(t.dataset.tab);
      var next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : -1;
      if (next < 0 || next >= keys.length) return;
      e.preventDefault();
      var btn = document.getElementById('tab-' + keys[next]);
      selectTab(keys[next]);
      if (btn) btn.focus();
    });
  });

  /* ─── Daktilo (96px H1 satırı) ──────────────────────────────────
     yaz 42ms/karakter → bekle 2200ms → sil 18ms/karakter → ara 220ms */
  (function typewriter() {
    var host = document.querySelector('.hero-line');
    var out = host && host.querySelector('.tw');
    if (!host || !out) return;

    var lines;
    try { lines = JSON.parse(host.dataset.tw || '[]'); } catch (e) { lines = []; }
    if (!lines.length) return;

    if (reduced) {
      /* Hareket azaltma: en uzun satırda sabit kal, animasyon yok. */
      out.textContent = lines.reduce(function (a, b) { return b.length > a.length ? b : a; });
      return;
    }

    var line = 0, n = 0, del = false;

    function tick() {
      var full = lines[line % lines.length];
      var wait;
      if (!del && n < full.length) { n++; wait = 42; }
      else if (!del) { del = true; wait = 2200; }
      else if (n > 0) { n--; wait = 18; }
      else { line++; del = false; wait = 220; }
      out.textContent = lines[line % lines.length].slice(0, n);
      setTimeout(tick, wait);
    }
    /* İlk satır HTML'de basılı geldiği için oradan devam et. */
    n = lines[0].length; del = true;
    setTimeout(tick, 2200);
  })();

  /* ─── Aktivite akışı — 2000ms'de bir satır kayar ────────────── */
  (function feedRotation() {
    var feeds = document.querySelectorAll('[data-rotate]');
    if (!feeds.length || reduced) return;
    setInterval(function () {
      if (document.hidden) return;
      feeds.forEach(function (f) {
        var first = f.querySelector('.item');
        if (first) f.appendChild(first);
      });
    }, 2000);
  })();

  /* ─── Mobil menü ────────────────────────────────────────────── */
  (function mobileNav() {
    var menu = document.getElementById('mnav');
    var openBtn = document.querySelector('.nav-burger[aria-controls]');
    if (!menu || !openBtn) return;

    function open() {
      menu.hidden = false;
      menu.classList.add('open');
      document.body.classList.add('menu-open');
      openBtn.setAttribute('aria-expanded', 'true');
      var first = menu.querySelector('a, button');
      if (first) first.focus();
    }
    function close() {
      menu.classList.remove('open');
      menu.hidden = true;
      document.body.classList.remove('menu-open');
      openBtn.setAttribute('aria-expanded', 'false');
      openBtn.focus();
    }

    openBtn.addEventListener('click', open);
    menu.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]') || e.target.closest('a')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) close();
    });
  })();

  /* ═══ HARİTA ══════════════════════════════════════════════════
     Gerçek coğrafya (Natural Earth / world-atlas 110m), yerelde
     barındırılır. Bölüm görüş alanına girmeden hiçbir şey indirilmez. */

  var CITIES = [
    { n: 'Istanbul', lat: 41.01, lon: 28.98, hub: true, anchor: 'end', dx: -12, dy: 15 },
    { n: 'Ankara', lat: 39.93, lon: 32.86 },
    { n: 'Izmir', lat: 38.42, lon: 27.14 },
    { n: 'Antalya', lat: 36.90, lon: 30.70 },
    { n: 'London', lat: 51.51, lon: -0.13, hub: true, anchor: 'end', dx: -12 },
    { n: 'Manchester', lat: 53.48, lon: -2.24 },
    { n: 'Berlin', lat: 52.52, lon: 13.40, hub: true },
    { n: 'Munich', lat: 48.14, lon: 11.58 },
    { n: 'Warsaw', lat: 52.23, lon: 21.01 },
    { n: 'Amsterdam', lat: 52.37, lon: 4.90 },
    { n: 'Milan', lat: 45.46, lon: 9.19 },
    { n: 'Madrid', lat: 40.42, lon: -3.70 },
    { n: 'Bucharest', lat: 44.43, lon: 26.10 },
    { n: 'Tbilisi', lat: 41.72, lon: 44.79 },
    { n: 'Baku', lat: 40.41, lon: 49.87, hub: true, dy: -10 },
    { n: 'Dubai', lat: 25.20, lon: 55.27, hub: true },
    { n: 'Riyadh', lat: 24.71, lon: 46.68 },
    { n: 'Doha', lat: 25.29, lon: 51.53 },
    { n: 'New York', lat: 40.71, lon: -74.01, hub: true },
    { n: 'Miami', lat: 25.76, lon: -80.19 },
    { n: 'Los Angeles', lat: 34.05, lon: -118.24 },
    { n: 'Toronto', lat: 43.65, lon: -79.38 }
  ];

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var LAND = null;
  var libsReady = null;

  function el(name, attrs) {
    var node = document.createElementNS(SVG_NS, name);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error('load failed: ' + src)); };
      document.head.appendChild(s);
    });
  }

  function ensureLibs() {
    if (libsReady) return libsReady;
    /* d3-geo, d3-array'e bağımlı olduğu için sıra önemli. */
    libsReady = loadScript('/js/vendor/d3-array.min.js')
      .then(function () { return loadScript('/js/vendor/d3-geo.min.js'); })
      .then(function () { return loadScript('/js/vendor/topojson-client.min.js'); })
      .then(function () { return fetch('/assets/v2/countries-110m.json'); })
      .then(function (r) { return r.json(); })
      .then(function (topo) {
        var fc = window.topojson.feature(topo, topo.objects.countries);
        LAND = {
          type: 'FeatureCollection',
          features: fc.features.filter(function (f) {
            return f.properties && f.properties.name !== 'Antarctica';
          })
        };
      });
    return libsReady;
  }

  function drawMap() {
    var host = document.getElementById('map');
    if (!host || !LAND || !window.d3) return;

    var cs = getComputedStyle(host);
    var w = host.clientWidth || 1000;
    var h = host.clientHeight || 430;
    var land = cs.getPropertyValue('--map-land').trim();
    var lineC = cs.getPropertyValue('--map-line').trim();
    var dot = cs.getPropertyValue('--accent').trim();
    var text = cs.getPropertyValue('--mid').trim();

    var proj = window.d3.geoNaturalEarth1().fitSize([w, h], LAND);
    var path = window.d3.geoPath(proj);

    var svg = el('svg', { width: w, height: h, viewBox: '0 0 ' + w + ' ' + h });
    var gLand = el('g', {});
    LAND.features.forEach(function (f) {
      var d = path(f);
      if (!d) return;
      gLand.appendChild(el('path', {
        d: d, fill: land, stroke: lineC, 'stroke-width': 0.7
      }));
    });
    svg.appendChild(gLand);

    var gDots = el('g', {});
    CITIES.forEach(function (city) {
      var p = proj([city.lon, city.lat]);
      if (!p) return;
      var g = el('g', { transform: 'translate(' + p[0] + ',' + p[1] + ')' });
      if (city.hub) {
        g.appendChild(el('circle', { r: 10, fill: dot, opacity: 0.16 }));
        var label = el('text', {
          x: city.dx != null ? city.dx : 12,
          y: city.dy != null ? city.dy : 4,
          'text-anchor': city.anchor || 'start',
          'font-size': 11, 'font-weight': 600, fill: text,
          'font-family': '-apple-system, system-ui, sans-serif'
        });
        label.textContent = city.n;
        g.appendChild(label);
      }
      g.appendChild(el('circle', { r: city.hub ? 3.6 : 2.4, fill: dot }));
      gDots.appendChild(g);
    });
    svg.appendChild(gDots);

    host.textContent = '';
    host.appendChild(svg);
  }

  (function initMap() {
    var host = document.getElementById('map');
    if (!host) return;

    function start() {
      ensureLibs().then(drawMap).catch(function () {
        /* Harita çizilemezse bölüm ülke listesiyle anlamlı kalır. */
      });
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) {
          io.disconnect();
          start();
        }
      }, { rootMargin: '300px' });
      io.observe(host);
    } else {
      start();
    }

    var rz;
    window.addEventListener('resize', function () {
      clearTimeout(rz);
      rz = setTimeout(drawMap, 200);
    });
  })();
})();
