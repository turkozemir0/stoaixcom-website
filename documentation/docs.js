/* ═══════════════════════════════════════════════════════════
   STOAIX — docs.js
   Sidebar, search, markdown render, hash routing.
   Zero dependencies — vanilla JS only.
   ═══════════════════════════════════════════════════════════ */

'use strict';

(function () {

  var DATA       = window.DOCS_DATA       || [];
  var CATEGORIES = window.DOCS_CATEGORIES || [];

  /* ── DOM refs ────────────────────────────────────────── */

  var sidebar       = document.getElementById('docsSidebar');
  var content       = document.getElementById('docsContent');
  var searchInput   = document.getElementById('docsSearch');
  var searchResults = document.getElementById('docsSearchResults');
  var mobileToggle  = document.getElementById('docsMobileToggle');
  var overlay       = document.getElementById('docsSidebarOverlay');

  /* ── Simple markdown → HTML ──────────────────────────── */

  function md(src) {
    if (!src) return '';
    var html = src;

    // Code blocks (``` ... ```)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, function (_, lang, code) {
      return '<pre><code>' + esc(code.trim()) + '</code></pre>';
    });

    // Tables
    html = html.replace(/^(\|.+\|)\n(\|[\s\-:|]+\|)\n((?:\|.+\|\n?)+)/gm, function (_, header, sep, body) {
      var ths = header.split('|').filter(Boolean).map(function (c) { return '<th>' + c.trim() + '</th>'; }).join('');
      var rows = body.trim().split('\n').map(function (row) {
        var tds = row.split('|').filter(Boolean).map(function (c) { return '<td>' + c.trim() + '</td>'; }).join('');
        return '<tr>' + tds + '</tr>';
      }).join('');
      return '<table><thead><tr>' + ths + '</tr></thead><tbody>' + rows + '</tbody></table>';
    });

    // Headings
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr>');

    // Bold + italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

    // Blockquote
    html = html.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>');

    // Ordered lists
    html = html.replace(/(?:^|\n)((?:\d+\. .+\n?)+)/g, function (_, block) {
      var items = block.trim().split('\n').map(function (line) {
        return '<li>' + line.replace(/^\d+\.\s*/, '') + '</li>';
      }).join('');
      return '<ol>' + items + '</ol>';
    });

    // Unordered lists
    html = html.replace(/(?:^|\n)((?:- .+\n?)+)/g, function (_, block) {
      var items = block.trim().split('\n').map(function (line) {
        return '<li>' + line.replace(/^-\s*/, '') + '</li>';
      }).join('');
      return '<ul>' + items + '</ul>';
    });

    // Paragraphs — wrap remaining bare text lines
    html = html.replace(/^(?!<[a-z]|$)(.+)$/gm, '<p>$1</p>');

    // Clean up empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, '');

    return html;
  }

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ── Build sidebar ───────────────────────────────────── */

  function buildSidebar() {
    var html = '';
    CATEGORIES.forEach(function (cat) {
      var articles = DATA.filter(function (d) { return d.category === cat.key; });
      if (!articles.length) return;

      html += '<div class="docs-sidebar-category" data-cat="' + cat.key + '">';
      html += '<button class="docs-category-btn" type="button">';
      html += '<span class="docs-category-icon">' + cat.icon + '</span>';
      html += '<span>' + cat.label + '</span>';
      html += '<span class="docs-category-chevron">&#9654;</span>';
      html += '</button>';
      html += '<div class="docs-category-items">';
      articles.forEach(function (a) {
        html += '<a class="docs-article-link" href="#' + cat.key + '/' + a.id + '" data-id="' + a.id + '">' + a.title + '</a>';
      });
      html += '</div></div>';
    });
    sidebar.innerHTML = html;

    // Category toggle
    sidebar.querySelectorAll('.docs-category-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var parent = btn.parentElement;
        parent.classList.toggle('open');
      });
    });

    // Article click
    sidebar.querySelectorAll('.docs-article-link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var id = link.dataset.id;
        navigateTo(id);
        closeMobileSidebar();
      });
    });
  }

  /* ── Navigate to article ─────────────────────────────── */

  function navigateTo(articleId) {
    var article = DATA.find(function (d) { return d.id === articleId; });
    if (!article) return;

    // Update hash without triggering hashchange
    var hash = '#' + article.category + '/' + article.id;
    history.replaceState(null, '', hash);

    // Render content
    content.innerHTML = '<article class="docs-article">' + md(article.content) + '</article>';

    // Scroll content to top
    content.scrollTop = 0;
    window.scrollTo(0, 0);

    // Update active state
    sidebar.querySelectorAll('.docs-article-link').forEach(function (link) {
      link.classList.toggle('active', link.dataset.id === articleId);
    });

    // Open parent category
    var catEl = sidebar.querySelector('[data-cat="' + article.category + '"]');
    if (catEl && !catEl.classList.contains('open')) {
      catEl.classList.add('open');
    }
  }

  /* ── Hash routing ────────────────────────────────────── */

  function handleHash() {
    var hash = location.hash.replace('#', '');
    if (!hash) {
      showWelcome();
      return;
    }
    var parts = hash.split('/');
    var articleId = parts.length > 1 ? parts[1] : parts[0];
    var article = DATA.find(function (d) { return d.id === articleId; });
    if (article) {
      navigateTo(article.id);
    } else {
      showWelcome();
    }
  }

  function showWelcome() {
    // Show first article by default
    if (DATA.length) {
      navigateTo(DATA[0].id);
      // Open first category
      var first = sidebar.querySelector('.docs-sidebar-category');
      if (first) first.classList.add('open');
    }
  }

  /* ── Search ──────────────────────────────────────────── */

  var searchTimeout;

  function onSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(doSearch, 200);
  }

  function doSearch() {
    var query = searchInput.value.trim().toLowerCase();
    if (!query) {
      searchResults.classList.remove('open');
      searchResults.innerHTML = '';
      return;
    }

    var results = DATA.filter(function (d) {
      return d.title.toLowerCase().indexOf(query) !== -1 ||
             d.content.toLowerCase().indexOf(query) !== -1 ||
             (d.tags && d.tags.some(function (t) { return t.toLowerCase().indexOf(query) !== -1; }));
    });

    if (!results.length) {
      searchResults.innerHTML = '<div class="docs-search-result"><div class="docs-search-result-title">Sonuç bulunamadı</div></div>';
      searchResults.classList.add('open');
      return;
    }

    var html = results.slice(0, 8).map(function (r) {
      var cat = CATEGORIES.find(function (c) { return c.key === r.category; });
      var catLabel = cat ? cat.icon + ' ' + cat.label : r.category;
      return '<div class="docs-search-result" data-id="' + r.id + '">' +
             '<div class="docs-search-result-title">' + r.title + '</div>' +
             '<div class="docs-search-result-cat">' + catLabel + '</div>' +
             '</div>';
    }).join('');

    searchResults.innerHTML = html;
    searchResults.classList.add('open');

    searchResults.querySelectorAll('.docs-search-result').forEach(function (el) {
      el.addEventListener('click', function () {
        var id = el.dataset.id;
        if (id) {
          navigateTo(id);
          searchInput.value = '';
          searchResults.classList.remove('open');
          searchResults.innerHTML = '';
          closeMobileSidebar();
        }
      });
    });
  }

  /* ── Close search on outside click ───────────────────── */

  document.addEventListener('click', function (e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.remove('open');
    }
  });

  /* ── Mobile sidebar ──────────────────────────────────── */

  function closeMobileSidebar() {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('mobile-open');
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', function () {
      var isOpen = sidebar.classList.contains('mobile-open');
      if (isOpen) {
        closeMobileSidebar();
      } else {
        sidebar.classList.add('mobile-open');
        overlay.classList.add('mobile-open');
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMobileSidebar);
  }

  /* ── Init ────────────────────────────────────────────── */

  function init() {
    buildSidebar();
    searchInput.addEventListener('input', onSearch);
    window.addEventListener('hashchange', handleHash);
    handleHash();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
