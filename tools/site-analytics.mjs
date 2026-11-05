/* GA + Clarity + Meta Pixel: gecikmeli yükleme ve CTA dönüşüm olayları.
   Ana sayfa (build-v2) ve fiyatlandırma sayfası (build-pricing) aynı kodu basar. */
export const ANALYTICS_SNIPPET = `
<!-- Analytics: ilk kullanıcı etkileşiminde VEYA en geç ~3.5sn (idle) yüklenir. -->
<script>
(function () {
  var loaded = false;
  function loadAnalytics() {
    if (loaded) return; loaded = true;
    var g = document.createElement('script'); g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=G-53TMTQML2Q';
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); } window.gtag = gtag;
    gtag('js', new Date()); gtag('config', 'G-53TMTQML2Q');
    (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","wnyyri0jrz");
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1426016022664547'); fbq('track', 'PageView');
  }
  var evs = ['scroll','mousemove','touchstart','pointerdown','keydown','click'];
  function onFirst(){ evs.forEach(function(e){ window.removeEventListener(e, onFirst, {passive:true}); }); loadAnalytics(); }
  evs.forEach(function(e){ window.addEventListener(e, onFirst, {passive:true}); });
  if ('requestIdleCallback' in window) requestIdleCallback(loadAnalytics, { timeout: 3500 });
  else setTimeout(loadAnalytics, 3500);

  /* CTA tıklaması = iletişim dönüşümü; Calendly ve WhatsApp ayrı kanal olarak etiketlenir.
     Buton davranışı değişmez: link yeni sekmede açılır, olay arka planda gönderilir. */
  var ctaFired = {};
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href*="calendly.com"], a[href*="wa.me"]') : null;
    if (!a) return;
    var ch = a.href.indexOf('wa.me') > -1 ? 'whatsapp' : 'calendly-booking';
    if (ctaFired[ch]) return;
    ctaFired[ch] = true;
    loadAnalytics();
    var label = (a.textContent || '').trim().slice(0, 80);
    if (window.fbq)  fbq('track', 'Lead', { content_name: label, content_category: ch });
    if (window.gtag) gtag('event', 'generate_lead', { link_text: label, link_url: a.href, channel: ch });
  });
})();
</script>`;
