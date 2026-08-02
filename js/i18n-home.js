/* ═══════════════════════════════════════════════════════════
   STOAIX — i18n.js  (EN ↔ TR language toggle)
   ═══════════════════════════════════════════════════════════ */
'use strict';

/* ─── Tags whose subtrees we never translate ─────────────── */
const SKIP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'CODE', 'PRE',
  'SVG', 'PATH', 'CIRCLE', 'LINE', 'RECT', 'POLYLINE',
  'POLYGON', 'ELLIPSE', 'G', 'DEFS', 'USE', 'CLIPPATH', 'CANVAS'
]);

/* ─── Page pairs: TR slug ↔ EN slug for Kategori B pages ─ */
const PAGE_PAIRS = {
  '/dis-klinigi-icin-ai': '/ai-receptionist-dental-clinic-uk',
  '/estetik-klinik-icin-ai': '/ai-receptionist-aesthetic-clinic-uk',
  '/sac-ekimi-klinigi-icin-ai': '/ai-receptionist-hair-transplant-clinic',
  '/ai-resepsiyonist-nedir': '/what-is-ai-receptionist-clinic',
  '/ai-resepsiyonist-vs-cagri-merkezi': '/ai-receptionist-vs-answering-service-uk',
  '/ai-resepsiyonist-vs-insan-sekreter': '/ai-receptionist-vs-human-receptionist-uk',
  '/klinik-kaynaklari': '/clinic-resources',
  '/klinik-lead-kaybi-kontrol-listesi': '/clinic-lead-leak-checklist',
  '/whatsapp-follow-up-mesajlari-klinik': '/clinic-whatsapp-follow-up-messages',
  '/eski-lead-reactivation-kit': '/old-lead-reactivation-kit',
  '/klinik-lead-management-starter-kit': '/clinic-lead-management-starter-kit-en',
  '/randevu-no-show-azaltma-paketi': '/appointment-no-show-reduction-kit',
  '/blog/kacirilmis-aramalar-ozel-klinik-maliyet': '/blog/missed-calls-cost-private-clinic',
  '/blog/saglik-turizmi-ai-resepsiyonist': '/blog/health-tourism-ai-receptionist',
};
// Ters eşleştirmeleri otomatik ekle (EN → TR)
Object.keys(PAGE_PAIRS).forEach(k => { PAGE_PAIRS[PAGE_PAIRS[k]] = k; });

const TR_ONLY_PAGES = new Set([
  '/sik-sorulan-sorular',
  '/dis-klinigi-hizli-yanit', '/dis-klinigi-eski-lead-canlandirma',
  '/estetik-klinik-hizli-yanit', '/estetik-klinik-eski-lead-canlandirma',
  '/sac-ekimi-hizli-yanit', '/sac-ekimi-eski-lead-canlandirma',
  '/blog/turkiye-klinikler-icin-ai-cozumleri-2026',
]);

/* ─── Helpers ────────────────────────────────────────────── */
function norm(s) { return s.replace(/\s+/g, ' ').trim(); }

function translateTree(root, dict) {
  if (!root) return;
  if (root.nodeType === Node.TEXT_NODE) {
    const n = norm(root.nodeValue);
    if (n && Object.prototype.hasOwnProperty.call(dict, n)) {
      root.nodeValue = dict[n];
    }
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE) return;
  if (SKIP_TAGS.has(root.tagName)) return;
  /* translate placeholder / aria-label / title attrs */
  ['placeholder', 'title', 'aria-label'].forEach(attr => {
    if (root.hasAttribute(attr)) {
      const v = norm(root.getAttribute(attr));
      if (dict[v]) root.setAttribute(attr, dict[v]);
    }
  });
  root.childNodes.forEach(c => translateTree(c, dict));
}

function getPath() {
  const parts = window.location.pathname
    .replace(/\.html$/, '').replace(/\/+$/, '')
    .split('/').filter(Boolean);
  if (parts[0] === 'en' || parts[0] === 'tr') parts.shift();
  return '/' + parts.join('/') || '/';
}

/* ─── Language toggle button ─────────────────────────────── */
function createToggleEl(activeLang, onToggle) {
  const w = document.createElement('div');
  w.className = 'lang-toggle';
  w.innerHTML =
    '<button class="lang-btn' + (activeLang === 'en' ? ' lang-active' : '') + '" data-lang="en">EN</button>' +
    '<span class="lang-sep">|</span>' +
    '<button class="lang-btn' + (activeLang === 'tr' ? ' lang-active' : '') + '" data-lang="tr">TR</button>';
  w.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.lang !== activeLang) onToggle(btn.dataset.lang);
    });
  });
  return w;
}

function injectToggle(activeLang, onToggle) {
  const nav = document.querySelector('.nav-actions');
  if (nav && !nav.querySelector('.lang-toggle')) {
    nav.insertBefore(createToggleEl(activeLang, onToggle), nav.firstChild);
  }

  const mobileMenu = document.querySelector('#mobileMenu');
  if (mobileMenu && !mobileMenu.querySelector('.lang-toggle')) {
    mobileMenu.appendChild(createToggleEl(activeLang, onToggle));
  }

  /* Fallback: Kategori B sayfalar — minimal <nav> var, .nav-actions yok */
  if (!nav && !mobileMenu) {
    const simpleNav = document.querySelector('nav');
    if (simpleNav && !simpleNav.querySelector('.lang-toggle')) {
      simpleNav.appendChild(createToggleEl(activeLang, onToggle));
    }
  }
}

/* ═══════════════════════════════════════════════════════════
   TRANSLATION DICTIONARIES
   ═══════════════════════════════════════════════════════════ */

/* ─── Shared (navbar / footer / common CTAs) ─────────────── */
const TR_COMMON = {
  'Product': 'Ürün',
  'Voice AI': 'Sesli AI',
  'Answer every call, 24/7': 'Her aramayı yanıtla, 7/24',
  'WhatsApp & Chat': 'WhatsApp & Chat',
  'Automate message channels': 'Mesaj kanallarını otomatikleştir',
  'CRM & Pipeline': 'CRM ve Pipeline',
  'Track and score every lead': 'Her lead\'i takip et ve puanla',
  'Integrations': 'Entegrasyonlar',
  'Connect your existing tools': 'Mevcut araçlarını bağla',
  'Pricing': 'Fiyatlandırma',
  'Solutions': 'Çözümler',
  'Healthcare Clinics': 'Sağlık Klinikleri',
  'Hair transplant, dental, aesthetics': 'Saç ekimi, diş, estetik',
  'Partner Program': 'Partner Programı',
  'Earn up to 50% recurring commission': '%50\'ye kadar aylık komisyon kazanın',
  'Log in': 'Giriş yap',
  'Start free trial': 'Denemeyi Başlat',
  'Subscribe now': 'Hemen Abone Ol',
  'Contact us': 'İletişime Geç',
  'Book a call': 'Toplantı Planla',
  'Features': 'Özellikler',
  'Healthcare': 'Sağlık',
  'Partners': 'Partnerler',
  'AI receptionist for healthcare clinics. Answer every call, handle every message, convert every lead.': 'Sağlık klinikleri için AI resepsiyonist. Her aramayı yanıtlar, her mesajı karşılar, her fırsatı hastaya dönüştürür.',
  'WhatsApp Chatbot': 'WhatsApp Chatbot',
  'Web Chat Widget': 'Web Chat Widget',
  'Outbound AI': 'Outbound AI',
  'Real Estate': 'Gayrimenkul',
  'Education': 'Eğitim',
  'E-Commerce': 'E-Ticaret',
  'Agencies & Resellers': 'Ajanslar ve Bayiler',
  'White Label': 'Beyaz Etiket',
  'About': 'Hakkımızda',
  'Blog': 'Blog',
  'Media': 'Medya',
  'STOAIX on LinkedIn': 'LinkedIn\'de STOAIX',
  'Co-founder & CEO': 'Kurucu Ortak & CEO',
  'Co-founder & CTO': 'Kurucu Ortak & CTO',
  'Follow on LinkedIn': 'LinkedIn\'de takip et',
  'Careers': 'Kariyer',
  'Privacy Policy': 'Gizlilik Politikası',
  'Terms of Service': 'Kullanım Koşulları',
  'Cookie Policy': 'Çerez Politikası',
  'GDPR': 'KVKK',
  '© 2026 STOAIX Ltd. — London, UK': '© 2026 STOAIX Ltd. — Londra, UK',
  'Made for clinics that refuse to miss a patient.': 'Tek bir hastayı bile kaçırmak istemeyen klinikler için.',
  'Monthly': 'Aylık',
  '3 Months': '3 Ay',
  '6 Months': '6 Ay',
  'Annual': 'Yıllık',
  'Save 10%': '%10 Tasarruf',
  'Save 20%': '%20 Tasarruf',
  'Save 30%': '%30 Tasarruf',
  'Most popular': 'En Popüler',
  'Company': 'Şirket',
  'Legal': 'Yasal',
  /* promo popup */
  'Limited Offer': 'Sınırlı Teklif',
  'You have a 10% discount!': '%10 indiriminiz var!',
  'Get my discount code': 'İndirim kodumu al',
  '10% discount — last chance!': '%10 indirim — son fırsat!',
  'This is our final offer.': 'Bu son teklifimiz.',
  'Your discount code': 'İndirim kodunuz',
  'Copy': 'Kopyala',
  'Copied!': 'Kopyalandı!',
  'Valid for 60 minutes': '60 dakika geçerli',
  'Valid for 12 hours': '12 saat geçerli',
  'First name': 'Ad',
  'Last name': 'Soyad',
  'Phone': 'Telefon',
};

/* ─── Index page ─────────────────────────────────────────── */
const TR_INDEX = Object.assign({}, TR_COMMON, {
  'STOAIX — AI Voice & Chat Platform for Any Business': 'STOAIX — Her İşletme İçin AI Ses ve Chat Platformu',
  '3-day free trial · No credit card required': '3 günlük ücretsiz deneme · Kredi kartı gerekmez',
  'Free trial available': 'Ücretsiz deneme mevcut',
  'receptionist': 'resepsiyonist',
  'call center': 'çağrı merkezi',
  'sales agent': 'satış temsilcisi',
  'chatbot': 'chatbot',
  'voice agent': 'sesli ajan',
  'CRM': 'CRM',
  'Your AI': 'Yapay Zeka',
  'live in minutes.': 'dakikalar içinde hazır.',
  'Voice calls, WhatsApp, and web chat — fully automated.': 'Sesli aramalar, WhatsApp ve web chat — tamamen otomatik.',
  'No code. No meetings. Works for any business.': 'Kod gerektirmez. Toplantı gerektirmez. Her işletme için çalışır.',
  'Watch demo': 'Demo İzle',
  'Trusted by clinics, agencies, and businesses across': 'Klinikler, ajanslar ve işletmelerin tercihi —',
  '12+ countries': '12+ ülkede',
  'Powered by the best. Connects with everything.': 'En iyi teknolojilerle güçlendirildi. Her şeyle entegre olur.',
  'What is STOAIX?': 'STOAIX nedir?',
  'Stop missing leads.': 'Lead kaçırmayı durdurun.',
  'Start converting them.': 'Dönüştürmeye başlayın.',
  'Every unanswered call is a lead handed to your competitor. STOAIX deploys an AI agent that never sleeps — it picks up every call, replies to every message, and books appointments while you focus on what you do best.': 'Yanıtsız her çağrı, rakibinize hediye edilmiş bir lead\'dir. STOAIX hiç uyumayan bir AI ajan devreye sokar — her aramayı karşılar, her mesajı yanıtlar ve siz asıl işinize odaklanırken randevuları planlar.',
  'See how it works': 'Nasıl çalıştığını gör',
  'Voice AI Receptionist': 'Sesli AI Resepsiyonist',
  'Answers every inbound call in your language, 24/7. Books appointments, answers FAQs, and hands off to your team when needed.': 'Gelen her aramayı kendi dilinizde 7/24 yanıtlar. Randevu oluşturur, sık sorulan soruları yanıtlar ve gerektiğinde ekibinize aktarır.',
  'WhatsApp & Chat Automation': 'WhatsApp ve Chat Otomasyonu',
  'The same AI brain across WhatsApp, web chat, and Instagram DM. One knowledge base, every channel covered.': 'WhatsApp, web chat ve Instagram DM\'de tek bir AI. Tek bilgi tabanı, tüm kanallar kapsanır.',
  'Smart CRM & Lead Pipeline': 'Akıllı CRM ve Lead Pipeline',
  'Every conversation auto-logged. Leads scored, qualified, and routed — without anyone touching a spreadsheet.': 'Her konuşma otomatik olarak kaydedilir. Lead\'ler puanlanır, nitelendirilir ve yönlendirilir — kimse elektronik tabloya dokunmadan.',
  '15+ Languages by Default': 'Varsayılan Olarak 15+ Dil',
  'English, Turkish, Arabic, Spanish, French, Russian, German and more. Your AI detects and switches languages automatically — no setup needed.': 'İngilizce, Türkçe, Arapça, İspanyolca, Fransızca, Rusça, Almanca ve daha fazlası. AI\'ınız dili otomatik olarak algılar ve geçiş yapar — herhangi bir kurulum gerekmez.',
  'Works for every business': 'Her işletme için çalışır',
  'AI that': 'AI,',
  'talks like your team.': 'ekibiniz gibi konuşur.',
  'Built for': 'Şunlar için:',
  'dental clinics.': 'diş klinikleri.',
  'hair transplants.': 'saç ekimi klinikleri.',
  'real estate agencies.': 'gayrimenkul ajansları.',
  'education centers.': 'eğitim merkezleri.',
  'e-commerce brands.': 'e-ticaret markaları.',
  'law firms.': 'hukuk firmaları.',
  'any business.': 'her tür işletme.',
  'Always answering': '7/24 Yanıtlıyor',
  'Auto-detected': 'Otomatik Algılama',
  'Time to go live': 'Yayına Geçiş Süresi',
  'Setup fee': 'Kurulum Ücreti',
  'Omnichannel': 'Çok Kanallı',
  'Every channel.': 'Her kanal.',
  'One platform.': 'Tek platform.',
  'Your customers reach you however they want. STOAIX handles all of it — from the same dashboard, with the same AI brain.': 'Müşterileriniz size istedikleri kanaldan ulaşır. STOAIX hepsini tek bir dashboard\'dan, aynı AI ile yönetir.',
  'WhatsApp': 'WhatsApp',
  'Web Chat': 'Web Chat',
  'Outbound': 'Outbound',
  'Instagram DM': 'Instagram DM',
  'Inbound calls, handled instantly.': 'Gelen aramalar anında karşılanır.',
  'Your AI agent picks up every call — no hold music, no voicemail. It answers questions, takes appointment requests, and transfers to your team only when necessary. Works in 15+ languages out of the box — detects the caller\'s language automatically.': 'AI ajanınız her aramayı karşılar — bekleme müziği yok, sesli mesaj yok. Soruları yanıtlar, randevu talepleri alır ve yalnızca gerektiğinde ekibinize aktarır. Kutusundan çıktığı gibi 15+ dilde çalışır — arayanın dilini otomatik olarak algılar.',
  'Instant pickup, zero hold time': 'Anında yanıt, sıfır bekleme süresi',
  'Full call recording + transcript': 'Tam çağrı kaydı ve transkript',
  'Smart handoff — human when needed': 'Akıllı aktarım — gerektiğinde insana yönlendir',
  'Appointment booking included': 'Randevu oluşturma dahil',
  'Incoming call': 'Gelen Arama',
  'Appointment booked': 'Randevu Oluşturuldu',
  'CRM updated': 'CRM Güncellendi',
  'WhatsApp automation that feels human.': 'İnsan gibi hissettiren WhatsApp otomasyonu.',
  'The same AI knowledge base — now in your customers\' most-used app. Handle price inquiries, FAQs, document collection, and appointment confirmations over WhatsApp, 24/7.': 'Aynı AI bilgi tabanı — artık müşterilerinizin en çok kullandığı uygulamada. Fiyat sorguları, sık sorulan sorular, belge toplama ve randevu onaylarını WhatsApp üzerinden 7/24 yönetin.',
  'Official WhatsApp Business API': 'Resmi WhatsApp Business API',
  'Media & document collection': 'Medya ve belge toplama',
  'Multilingual auto-detection': 'Otomatik dil algılama',
  'Human handoff in 1 tap': 'Tek dokunuşla insana aktar',
  'Online': 'Çevrimiçi',
  'Convert website visitors into booked leads.': 'Web sitesi ziyaretçilerini randevulu müşterilere dönüştürün.',
  'A smart chat widget on your site that does more than answer questions — it qualifies visitors, collects their details, and books appointments directly in your calendar.': 'Sitenizde yalnızca soru yanıtlamakla kalmayan akıllı bir chat widget\'ı — ziyaretçileri nitelendirir, bilgilerini toplar ve randevuları doğrudan takviminize ekler.',
  '1-line embed, any website': '1 satır kod, her web sitesine uyumlu',
  'Lead qualification built-in': 'Dahili lead nitelendirme',
  'Calendar integration': 'Takvim entegrasyonu',
  'Fully branded to your business': 'İşletmenize özel tasarım',
  'AI Assistant': 'AI Asistan',
  'Hi! I\'m here to help. What are you looking for today?': 'Merhaba! Size yardımcı olmak için buradayım. Bugün ne arıyorsunuz?',
  'Treatment prices': 'Tedavi fiyatları',
  'Book appointment': 'Randevu Al',
  'Find us': 'Bize Ulaşın',
  'Your AI calls leads before your competitor does.': 'AI\'ınız, lead\'leri rakibinizden önce arar.',
  'New lead comes in at midnight? Your AI agent calls them back within 60 seconds. Set up automated outbound sequences for lead follow-up, appointment reminders, and reactivation campaigns.': 'Gece yarısı yeni bir lead mi geldi? AI ajanınız 60 saniye içinde geri arar. Lead takibi, randevu hatırlatıcıları ve yeniden aktivasyon kampanyaları için otomatik diziler oluşturun.',
  'First call within 60 seconds': '60 saniye içinde ilk arama',
  'Automated follow-up sequences': 'Otomatik takip dizileri',
  'Old lead reactivation': 'Eski lead\'leri yeniden devreye alma',
  'No-show prevention reminders': 'Gelmeme önleme hatırlatıcıları',
  'Outbound Campaign': 'Outbound Kampanya',
  'Leads dialled': 'Aranan Lead\'ler',
  'Connected': 'Bağlandı',
  'Booked': 'Rezerve Edildi',
  'Lead created — 11:47 PM': 'Lead oluşturuldu — 23:47',
  'AI call placed — 11:47 PM (60s later)': 'AI araması yapıldı — 23:47 (60 sn sonra)',
  'Voicemail left — 11:48 PM': 'Sesli mesaj bırakıldı — 23:48',
  'Follow-up SMS — 9:00 AM': 'Takip SMS\'i — 09:00',
  'WhatsApp — Day 3': 'WhatsApp — 3. Gün',
  'Turn DMs into booked appointments.': 'DM\'leri randevuya dönüştürün.',
  'Instagram DMs are your highest-intent leads — and most businesses reply hours later. STOAIX responds instantly, qualifies the lead, and moves them toward booking before they check a competitor.': 'Instagram DM\'leri en yüksek satın alma niyetli lead\'lerinizdir — çoğu işletme saatler sonra yanıt verir. STOAIX anında karşılık verir, lead\'i nitelendirir ve rakip araştırmadan önce randevuya yönlendirir.',
  'Instant DM responses': 'Anında DM yanıtı',
  'Story reply automation': 'Story yanıtı otomasyonu',
  'Link to WhatsApp or booking page': 'WhatsApp veya randevu sayfasına yönlendirme',
  'Lead captured to CRM automatically': 'Lead otomatik olarak CRM\'e kaydedilir',
  'Live Demo': 'Canlı Demo',
  'See it in action.': 'Canlı görün.',
  'From WhatsApp to voice calls, in 15+ languages — explore how AI handles your entire patient journey.': 'WhatsApp\'tan sesli aramalara, 15+ dilde — AI\'ın tüm hasta yolculuğunuzu nasıl yönettiğini keşfedin.',
  'En iyi deneyim için masaüstünden görüntüleyin': 'Best viewed on desktop',
  /* Live stats — canlı sayaç bölümü */
  'LIVE': 'CANLI',
  'Live right now — working across every channel': 'Şu anda canlı — her kanalda çalışıyor',
  'Customer messages answered': 'Yanıtlanan müşteri mesajı',
  'New customers engaged': 'Karşılanan yeni müşteri',
  'Conversations won': 'Satışa dönen görüşme',
  'Coming Soon': 'Yakında',
  'Interactive Voice Demo': 'Sesli Canlı Demo',
  'Speak with STOAIX\'s AI agent live — no signup required. Ask questions, hear the voice, book an appointment in real time.': 'STOAIX AI ajanıyla canlı konuşun — kayıt gerekmez. Sorular sorun, sesi dinleyin, gerçek zamanlı randevu alın.',
  'Platform': 'Platform',
  'Built for results,': 'Sonuç odaklı tasarım,',
  'not complexity.': 'gereksiz karmaşıklık değil.',
  'A clean dashboard that gives you everything you need — calls, leads, conversations, and performance — in one place.': 'Tüm ihtiyaçlarınızı tek bir yerde toplayan sade bir dashboard — aramalar, lead\'ler, konuşmalar ve performans.',
  'Dashboard Overview': 'Dashboard Genel Bakışı',
  'CRM Pipeline': 'CRM Pipeline',
  'Call Transcript': 'Çağrı Transkripti',
  'Effortless setup': 'Zahmetsiz kurulum',
  'Live in 5 minutes.': '5 dakikada yayında.',
  'No engineer needed.': 'Geliştirici gerekmez.',
  'Tell us about your business': 'İşletmenizi bize anlatın',
  'Answer a few questions. Paste your FAQs or let our AI generate them from your website. Your knowledge base is ready instantly.': 'Birkaç soruyu yanıtlayın. Sık sorulan sorularınızı yapıştırın ya da AI\'ımızın web sitenizden otomatik oluşturmasına izin verin. Bilgi tabanınız anında hazır.',
  'Configure your AI agent': 'AI ajanınızı yapılandırın',
  'Choose your agent\'s name, voice, and channels. Set your booking rules and handoff conditions. All without writing a single line of code.': 'Ajanınızın adını, sesini ve kanallarını seçin. Randevu kurallarını ve aktarım koşullarını belirleyin. Tek bir satır kod yazmadan.',
  'Go live': 'Yayına alın',
  'Forward your number. Add the chat widget. Connect WhatsApp. Your AI agent is answering calls and messages — right now.': 'Numaranızı yönlendirin. Chat widget\'ını ekleyin. WhatsApp\'ı bağlayın. AI ajanınız aramaları ve mesajları şu an yanıtlıyor.',
  'Simple, transparent pricing.': 'Sade ve şeffaf fiyatlandırma.',
  'Start free. Scale when you\'re ready. No contracts, cancel anytime.': 'Ücretsiz başlayın. Hazır olduğunuzda büyütün. Sözleşme yok, istediğiniz zaman iptal edin.',
  /* --- Plan badge names --- */
  'Most Popular': 'En Popüler',
  'Best Value': 'En Çok Tercih Edilen',
  'Limited Spots': 'Sınırlı Kontenjan',
  /* --- Plan names --- */
  'Enterprise': 'Enterprise',
  /* --- Comparison table: billing notes --- */
  'Billed monthly': 'Aylık fatura edilir',
  'Billed $537 every 3 months': '3 ayda bir $537 fatura edilir',
  'Billed $807 every 3 months': '3 ayda bir $807 fatura edilir',
  'Billed $1,617 every 3 months': '3 ayda bir $1.617 fatura edilir',
  'Billed $954 every 6 months': '6 ayda bir $954 fatura edilir',
  'Billed $1,434 every 6 months': '6 ayda bir $1.434 fatura edilir',
  'Billed $2,874 every 6 months': '6 ayda bir $2.874 fatura edilir',
  'Billed $1,668/yr': 'Yıllık $1.668 fatura edilir',
  'Billed $2,508/yr': 'Yıllık $2.508 fatura edilir',
  'Billed $5,028/yr': 'Yıllık $5.028 fatura edilir',
  'Custom billing': 'Özel faturalama',
  'From $999': "$999'dan başlayarak",
  /* --- Comparison table: feature groups --- */
  'Core': 'Temel',
  'Voice AI': 'Sesli AI',
  'Analytics & Pipeline': 'Analitik & Pipeline',
  'Support': 'Destek',
  /* --- Comparison table: feature rows --- */
  'Full CRM': 'Tam CRM',
  'WhatsApp & Instagram': 'WhatsApp ve Instagram',
  'Knowledge Base': 'Bilgi Tabanı',
  'Chat AI & Workflow': 'Yapay Zeka Resepsiyonist ve İş Akışları',
  'Team Members': 'Ekip Üyesi',
  'Voice AI — Inbound': 'Sesli AI — Gelen',
  'Voice AI — Outbound': 'Sesli AI — Giden',
  'All Voice Workflows': 'Tüm Ses İş Akışları',
  'Multi-language Voice': 'Çok Dilli Ses',
  'Advanced Analytics': 'Gelişmiş Analitik',
  'Analytics Export': 'Analitik Dışa Aktarım',
  'Multi-pipeline': 'Çoklu Pipeline',
  'AI Support': 'AI Destek',
  'Dedicated Support': 'Özel Destek',
  'SLA Guarantee': 'SLA Garantisi',
  'Custom Integrations': 'Özel Entegrasyonlar',
  'Custom Minute Packages': 'Özel Dakika Paketleri',
  /* --- Comparison table: cell values --- */
  'Unlimited': 'Sınırsız',
  '150 min/mo': '150 dk/ay',
  '300 min/mo': '300 dk/ay',
  '8 languages': '8 dil',
  '3 pipelines': '3 pipeline',
  'shared pool with outbound': 'giden aramalarla ortak havuz',
  /* --- Add-ons section --- */
  'Add-ons': 'Eklentiler',
  'Weekly 30-min 1:1 session · 4 sessions/month · Priority response': 'Haftada 1 kez 30 dk birebir seans · Ayda 4 seans · Öncelikli yanıt',
  'Annual subscribers get the first 14 days of onboarding free.': 'Yıllık aboneler ilk 14 gün onboarding desteğini ücretsiz alır.',
  /* --- Annual onboarding pill & plan taglines --- */
  'Annual plan includes 14 days free onboarding': 'Yıllık plan 14 gün ücretsiz onboarding içerir',
  'For solo & small teams': 'Bireysel ve küçük ekipler için',
  'For growing businesses': 'Büyüyen işletmeler için',
  'For scaling operations': 'Büyüyen operasyonlar için',
  'For large organisations': 'Büyük organizasyonlar için',
  /* --- Dedicated Support add-on tag & checkout --- */
  'Add-on: $99/mo': 'Eklenti: $99/ay',
  'Dedicated Support add-on': 'Özel Destek eklentisi',
  'Weekly 1:1 · 4 sessions/mo · Priority response': 'Haftada 1 birebir · Ayda 4 seans · Öncelikli yanıt',
  /* --- Trial / CTA notes --- */
  '3-day free trial': '3 günlük ücretsiz deneme',
  'No free trial': 'Ücretsiz deneme yok',
  /* --- Pricing note footer --- */
  'Voice AI overage: $0.15/min after plan limit · ': 'Sesli AI fazlası: Plan limitinden sonra $0,15/dk · ',
  'Essential: 3-day free trial': 'Essential: 3 günlük ücretsiz deneme',
  /* --- Old pricing strings kept for legacy compatibility --- */
  'Chat, CRM & automation to get started': 'Başlamak için chat, CRM ve otomasyon',
  'Add Voice AI to your stack': 'Sesli AI\'ı stack\'inize ekleyin',
  'The full system — voice, chat & pipeline': 'Tam sistem — ses, chat ve pipeline',
  'Done-with-you. Built around your business.': 'Sizinle birlikte. İşletmenize özel.',
  'WhatsApp & Instagram — Unlimited': 'WhatsApp ve Instagram (AI) — Sınırsız',
  'Knowledge base — Unlimited': 'Bilgi tabanı — Sınırsız',
  'Team members — 5': 'Ekip üyesi — 5',
  'Everything in Essential': 'Essential\'daki her şey',
  'Voice inbound — 150 min/mo': 'Sesli gelen arama — 150 dk/ay',
  'Advanced analytics': 'Gelişmiş analitik',
  'Multi-pipeline — 3': 'Çoklu pipeline — 3',
  'Voice outbound': 'Sesli giden arama',
  'Multi-language voice': 'Çok dilli ses',
  'Team members — 10': 'Ekip üyesi — 10',
  'Everything in Professional': 'Professional\'daki her şey',
  'Voice in+outbound — 300 min/mo': 'Sesli gelen+giden — 300 dk/ay',
  'All voice workflows': 'Tüm ses iş akışları',
  'Multi-language voice (8 languages)': 'Çok dilli ses (8 dil)',
  'Analytics export': 'Analitik dışa aktarma',
  'Multi-pipeline — Unlimited': 'Çoklu pipeline — Sınırsız',
  'Team members — 20': 'Ekip üyesi — 20',
  'Everything in Business': 'Business\'daki her şey',
  'Custom minute packages': 'Özel dakika paketleri',
  'Unlimited users': 'Sınırsız kullanıcı',
  'Dedicated support': 'Özel destek',
  'Custom integrations': 'Özel entegrasyonlar',
  'SLA guarantee': 'SLA garantisi',
  'Price — Custom': 'Fiyat — Özel',
  /* --- Pricing: mobil kart özellik stringleri --- */
  '5 Team Members': '5 Ekip Üyesi',
  '10 Team Members': '10 Ekip Üyesi',
  '20 Team Members': '20 Ekip Üyesi',
  '1,000 Conversations / mo': '1.000 AI Konuşma / Ay',
  '2,000 Conversations / mo': '2.000 AI Konuşma / Ay',
  '5,000 Conversations / mo': '5.000 AI Konuşma / Ay',
  'Conversations / mo': 'AI Konuşma / Ay',
  'Everything in Essential, plus:': 'Essential planındaki her şey, artı:',
  'Everything in Professional, plus:': 'Professional planındaki her şey, artı:',
  'Everything in Business, plus:': 'Business planındaki her şey, artı:',
  'Voice AI — 200 min/mo': 'Sesli AI (Gelen veya Giden Arama)',
  'Voice AI — 500 min/mo + Outbound': 'Sesli Gelen ve Giden Aramalar',
  'Multi-language Voice (8 languages)': 'Çok Dilli Yapay Zeka Çağrılar (15+)',
  'Unlimited Voice AI': 'Sınırsız Sesli AI',
  /* --- Pricing: karşılaştırma tablosu hücre değerleri --- */
  '200 min/mo': '200 dk/ay',
  '500 min/mo': '500 dk/ay',
  /* --- Pricing: toggle butonu --- */
  'Compare all features': 'Tüm Özellikleri Karşılaştır',
  'Hide comparison': 'Karşılaştırmayı Gizle',
  /* --- Pricing: eksik badge --- */
  'Most Valuable': 'En Değerlisi',
  /* --- Pricing: footer notu (güncel $0.19 fiyatı) --- */
  'Voice AI overage: $0.19/min after plan limit · ': 'Sesli AI fazlası: Plan limitinden sonra $0,19/dk · ',
  /* --- Legacy pricing strings (kept for compatibility) --- */
  'WhatsApp & web chat to get started': 'Başlamak için WhatsApp ve web chat',
  'Add Voice AI to your channels': 'Kanallarınıza Sesli AI ekleyin',
  'Full system. Outbound included.': 'Eksiksiz sistem. Outbound dahil.',
  'Manage multiple clients from one dashboard': 'Tüm müşterilerinizi tek panelden yönetin',
  'WhatsApp messages — 500/mo': 'WhatsApp mesajı — 500/ay',
  'WhatsApp messages — 2,000/mo': 'WhatsApp mesajı — 2.000/ay',
  'WhatsApp messages — 5,000/mo': 'WhatsApp mesajı — 5.000/ay',
  'WhatsApp messages — Unlimited': 'WhatsApp mesajı — Sınırsız',
  'Voice agent': 'Sesli ajan',
  'Voice agent — 60 min/mo': 'Sesli ajan — 60 dk/ay',
  'Voice agent — 200 min/mo': 'Sesli ajan — 200 dk/ay',
  'Voice agent — Unlimited': 'Sesli ajan — Sınırsız',
  'Kanban board': 'Kanban panosu',
  'CSV import': 'CSV içe aktarma',
  'Outbound webhook': 'Outbound webhook',
  'Team members — 1': 'Ekip üyesi — 1',
  'Team members — 3': 'Ekip üyesi — 3',
  'Team members — Unlimited': 'Ekip üyesi — Sınırsız',
  'Voice AI usage: $0.15/min after plan limit · ': 'Sesli AI kullanımı: Plan limitinden sonra $0,15/dk · ',
  'All plans: 3-day free trial, no credit card · ': 'Tüm planlarda: 3 günlük ücretsiz deneme, kredi kartı gerekmez · ',
  'Save up to 30% with annual billing': 'Yıllık ödemede %30\'a kadar tasarruf',
  'Partners & White Label': 'Partnerler ve Beyaz Etiket',
  'Build your own': 'Kendi',
  'AI business.': 'AI işletmenizi kurun.',
  'Sell STOAIX under your own brand. White-label our platform, set your own prices, keep the margin. Perfect for agencies, consultants, and resellers worldwide.': 'STOAIX\'i kendi markanız altında satın. Platformumuzu beyaz etiketleyin, kendi fiyatlarınızı belirleyin, kârı cebinize koyun. Ajanslar, danışmanlar ve dünya genelindeki bayiler için biçilmiş kaftan.',
  'Your brand, zero dev cost': 'Markanız, sıfır geliştirme maliyeti',
  'Custom domain, logo, agent name — STOAIX invisible': 'Özel domain, logo, ajan adı — STOAIX arka planda kalır',
  '~40% margin per client': 'Müşteri başına ~%40 kâr marjı',
  '10 Advanced clients = ~$1,600/mo recurring profit': '10 Advanced müşteri = aylık ~1.600$ tekrarlayan kâr',
  'Sell globally': 'Globale satın',
  'No geography limits. Any sector. Any language.': 'Coğrafi sınır yok. Her sektör. Her dil.',
  'Become a partner': 'Partner Olun',
  'Example: 10 Advanced clients': 'Örnek: 10 Advanced müşteri',
  'STOAIX wholesale (10 × $199)': 'STOAIX toptan fiyatı (10 × $199)',
  'Your platform fee': 'Platform ücretiniz',
  'Your revenue (10 × $399)': 'Geliriniz (10 × $399)',
  'Net profit': 'Net kâr',
  '+ Activation fee: $1,497 one-time': '+ Aktivasyon ücreti: tek seferlik $1.497',
  'Your AI receptionist is': 'AI resepsiyonistiniz',
  'one signup away.': 'bir kayıt kadar uzağınızda.',
  '3-day free trial. No credit card. Set up in minutes.': '3 günlük ücretsiz deneme. Kredi kartı gerekmez. Dakikalar içinde kurulum.',
  'Start your free trial': 'Ücretsiz Denemeyi Başlatın',
  'Talk to sales': 'Satış Ekibiyle Konuşun',
  'No contracts · Cancel anytime · 3-day free trial': 'Sözleşme yok · İstediğiniz zaman iptal edin · 3 günlük ücretsiz deneme',
  'Voice AI': 'Sesli AI',
  'WhatsApp Chatbot': 'WhatsApp Chatbot',
  'Web Chat Widget': 'Web Chat Widget',
  'Outbound AI': 'Outbound AI',
  'Healthcare Clinics': 'Sağlık Klinikleri',
  'Real Estate': 'Gayrimenkul',
  'Education': 'Eğitim',
  'E-Commerce': 'E-Ticaret',
  'Agencies & Resellers': 'Ajanslar & Bayiler',
  'White Label': 'Beyaz Etiket',
  /* --- Legacy enterprise plan strings --- */
  'Most Exclusive': 'En Özel',
  'Custom Pricing': 'Özel Fiyatlandırma',
  'Done-with-you. Fully managed. Built around your business.': 'Sizinle birlikte. Tamamen yönetilen. İşletmenize özel.',
  'Book a Meeting': 'Toplantı Ayarlayın',
  'Everything in the lower-tier plans': 'Alt katman planlardaki her şey',
  'Direct 1-on-1 business development partnership': 'Birebir iş geliştirme ortaklığı',
  'AI operations consulting & full implementation': 'AI operasyonları danışmanlığı ve tam uygulama',
  'Custom AI workflows tailored to your business': 'İşletmenize özel AI iş akışları',
  'Multi-location / multi-branch support': 'Çok lokasyon / çok şube desteği',
  'Dedicated account management & ongoing support': 'Özel hesap yönetimi ve süregelen destek',
  'No SaaS self-service — fully managed, done-with-you model': 'Self-servis SaaS yok — tamamen yönetilen, birlikte yapılan model',
  /* --- Mobile nav CTA --- */
  'Start Free Trial': 'Ücretsiz Deneyin',
  /* --- Revenue calculator section --- */
  'Revenue Calculator': 'Gelir Hesaplayıcı',
  'How much are missed enquiries costing you?': 'Kaçırılan başvurular size ne kadar kaybettiriyor?',
  'See the real revenue impact of every unanswered call and message.': 'Her yanıtsız arama ve mesajın gerçek gelir etkisini görün.',
  'Average appointment value (£)': 'Ortalama randevu değeri (£)',
  'Missed enquiries per week': 'Haftada kaçırılan başvuru sayısı',
  'Conversion rate (%)': 'Dönüşüm oranı (%)',
  'Lost per month': 'Aylık kayıp',
  'in missed bookings': 'kaçırılan randevularda',
  'Lost per year': 'Yıllık kayıp',
  'walking out the door': 'kapıdan çıkıp gidiyor',
  'Recover this revenue — free for 3 days': 'Ücretsiz Klinik Analizi',
  'No credit card required to start your trial.': 'Uzman ekibimizle 30 dakikalık ücretsiz görüşme ayarlayın.',
  /* --- Hero trust badge --- */
  'Built on insights from': 'Temelinde yatan:',
  '500+ clinic audits': '500+ klinik denetimi',
  /* --- Channels grid --- */
  'Answers every call, 24/7, in 15+ languages': 'Her aramayı 24/7, 15+ dilde yanıtlar',
  'Price queries, bookings & FAQs — automated': 'Fiyat sorguları, randevular ve SSS — otomatik',
  'Qualify visitors and book them on the spot': 'Ziyaretçileri nitelendirin, anında randevu alın',
  'Calls new leads within 60 seconds of enquiry': 'Yeni başvurulara 60 saniye içinde arar',
  'Turns DMs and story replies into bookings': 'DM\'leri ve hikaye yanıtlarını randevuya dönüştürür',
  /* --- Setup steps (compact) --- */
  'Tell us about your business': 'İşletmenizi tanıtın',
  'Configure your AI agent': 'AI ajanınızı yapılandırın',
  'Go live': 'Yayına alın',
  /* --- Live updates ticker (üst şerit) --- */
  'STOAIX Live': 'STOAIX Canlı',
  'New module': 'Yeni modül',
  'New feature': 'Yeni özellik',
  'Now live': 'Yayında',
  'Just shipped': 'Yeni eklendi',
  'Your social media content is now created, scheduled & published by STOAIX': 'Sosyal medya içerikleriniz artık STOAIX tarafından üretiliyor, planlanıyor ve yayınlanıyor',
  'Voice AI now speaks 15+ languages with automatic native voice switching': 'Sesli AI artık 15+ dilde konuşuyor — otomatik yerel ses geçişiyle',
  'New voice engine delivers natural, near real-time conversations': 'Yeni ses motoru doğal ve gerçek zamana yakın konuşmalar sunuyor',
  'Online booking now adds a Google Meet link and emails the invite automatically': 'Online randevu artık otomatik Google Meet linki ekliyor ve daveti e-postayla gönderiyor',
  'New leads flow into your sales pipeline automatically — no manual work': 'Yeni lead\'ler satış pipeline\'ınıza otomatik düşüyor — manuel iş yok',
  'Automated SEO engine gets your clinic found in Google and AI search': 'Otomatik SEO motoru kliniğinizi Google\'da ve yapay zeka aramalarında bulunur kılıyor',
  'Connect multiple WhatsApp numbers to a single AI brain': 'Tek bir yapay zekâya birden fazla WhatsApp numarası bağlayın',
  'Reactivation engine re-engages your old leads and books them again': 'Reaktivasyon motoru eski lead\'lerinizi yeniden devreye alıp tekrar randevuya çeviriyor',
  'Voice AI connects to 444, mobile, 0850, landline and international numbers': '444, cep, 0850, 0212 ve uluslararası numaralara Sesli Yapay Zeka Asistanı bağlanıyor',
  'AI support assistant answers every question using your own knowledge base': 'Yapay Zeka Destek Asistanı tüm soruları sizin bilgilerinizle yanıtlıyor',
  'STOAIX updates every week — your platform stays live': 'STOAIX her hafta güncelleniyor — platformunuz sürekli canlı',
  /* --- v2 tasarım yenileme (sağlık odağı metin değişiklikleri) --- */
  'No code. No meetings.': 'Kod yok. Toplantı yok.',
  'Tell us about your clinic': 'Kliniğinizi tanıtın',
  'Your patients reach you however they want. STOAIX handles all of it — from the same dashboard, with the same AI brain.': 'Hastalarınız size istedikleri kanaldan ulaşır. STOAIX hepsini tek panelden, aynı AI beyniyle karşılar.',
});

/* ─── Partners page ──────────────────────────────────────── */
const TR_PARTNERS = {};  /* i18n-home: ana sayfada kullanilmiyor */

/* ─── Healthcare Clinics page ────────────────────────────── */
const TR_HEALTHCARE = {};  /* i18n-home: ana sayfada kullanilmiyor */

/* ─── Case Studies listing page ─────────────────────────── */
const TR_CASE_STUDIES = Object.assign({}, TR_COMMON, {
  'Case Studies — Real Results with STOAIX AI': 'Vaka Çalışmaları — STOAIX AI ile Gerçek Sonuçlar',
  'Case Studies': 'Vaka Çalışmaları',
  'Real clinics.': 'Gerçek klinikler.',
  'Real results.': 'Gerçek sonuçlar.',
  'See how healthcare businesses across 12+ countries use STOAIX to cut response times, fill calendars, and reactivate thousands of cold leads.': '12\'den fazla ülkedeki sağlık işletmelerinin yanıt sürelerini nasıl kısalttığını, takvimleri nasıl doldurduğunu ve binlerce soğuk lead\'i nasıl yeniden aktive ettiğini görün.',
  'Avg. first response': 'Ort. ilk yanıt',
  'Admin time saved': 'Tasarruf edilen yönetim süresi',
  'Show-up rate lift': 'Gösterme oranı artışı',
  'All': 'Tümü',
  'Hair Transplant': 'Saç Ekimi',
  'Dental': 'Diş',
  'Aesthetic': 'Estetik',
  'Physiotherapy': 'Fizyoterapi',
  '4 case studies · Healthcare clinics': '4 vaka çalışması · Sağlık klinikleri',
  'From 8-hour delays to instant AI replies — without adding a single team member.': '8 saatlik gecikmelerden anında AI yanıtlarına — tek bir ekip üyesi eklemeden.',
  'An Istanbul health-tourism clinic was losing international leads while they slept. STOAIX deployed a multilingual AI agent that responded in 4 minutes, qualified every lead, and booked video consultations automatically.': 'İstanbul\'daki bir sağlık turizmi kliniği, uyurken uluslararası lead\'lerini kaybediyordu. STOAIX, 4 dakikada yanıt veren, her lead\'i niteleyen ve otomatik olarak görüntülü konsültasyonlar rezerve eden çok dilli bir AI ajanı devreye aldı.',
  'Sales conversion': 'Satış dönüşümü',
  'Cold leads reactivated': 'Yeniden aktive edilen soğuk lead\'ler',
  'Read case study': 'Vaka çalışmasını oku',
  'Systematised a 3-month implant sales cycle without adding headcount.': 'Personel artırmadan 3 aylık implant satış döngüsünü sistematize etti.',
  'A South London dental practice specialising in high-ticket implants automated a 90-day follow-up sequence. Leads that used to go cold now convert — and patients who confirmed actually showed up.': 'Yüksek biletli implantlarda uzmanlaşmış bir Güney Londra diş kliniği, 90 günlük takip dizisini otomatikleştirdi. Eskiden soğuyan lead\'ler artık dönüşüyor — ve onaylayan hastalar gerçekten geliyor.',
  'Show-up rate': 'Geliş oranı',
  'Cold inquiries reactivated': 'Yeniden aktive edilen soğuk sorgular',
  '12,000 forgotten leads. 240 new bookings. 6 weeks.': '12.000 unutulan lead. 240 yeni rezervasyon. 6 hafta.',
  'A medical aesthetic clinic had three years of cold inquiries sitting untouched in their CRM. STOAIX launched a segmented re-activation campaign — and turned archived data into a revenue pipeline.': 'Bir medikal estetik kliniğinin CRM\'inde üç yıllık dokunulmamış soğuk sorgular birikiyordu. STOAIX segmentli bir yeniden aktivasyon kampanyası başlattı — ve arşivlenmiş verileri gelir boru hattına dönüştürdü.',
  'Re-activation conversion': 'Yeniden aktivasyon dönüşümü',
  'Avg. first response': 'Ort. ilk yanıt',
  '3 clinics, zero admin. 80% time saved.': '3 klinik, sıfır yönetim yükü. %80 zaman tasarrufu.',
  'A 3-location physiotherapy chain eliminated repetitive admin, re-engaged 6,200 lapsed patients, and freed their staff to focus on what matters most: patient care.': '3 lokasyonlu bir fizyoterapi zinciri, tekrarlayan yönetim işlerini ortadan kaldırdı, 6.200 hareketsiz hastayı yeniden devreye aldı ve personelini en önemli şeye odaklanmaya serbest bıraktı: hasta bakımı.',
  'Admin time saved': 'Tasarruf edilen yönetim süresi',
  'Lapsed patients re-engaged': 'Yeniden devreye alınan hasta',
  'Your clinic could be next.': 'Sıradaki klinik sizin olabilir.',
  'Join healthcare businesses across 12+ countries using STOAIX to turn enquiries into appointments — automatically.': '12\'den fazla ülkedeki sağlık işletmelerine katılın ve sorguları randevulara dönüştürün — otomatik olarak.',
  'See all case studies': 'Tüm vaka çalışmalarını gör',
});

/* ─── Case study detail pages (shared) ──────────────────── */
const TR_CASE_STUDY_BASE = Object.assign({}, TR_COMMON, {
  'Home': 'Ana Sayfa',
  'Case Studies': 'Vaka Çalışmaları',
  'At a glance': 'Özet',
  'Sector': 'Sektör',
  'Location': 'Lokasyon',
  'Channels': 'Kanallar',
  'Languages': 'Diller',
  'Timeline': 'Süreç',
  'Other case studies': 'Diğer vaka çalışmaları',
  'Start your free trial': 'Ücretsiz deneyin',
  'Your clinic could be next.': 'Sıradaki klinik sizin olabilir.',
  'Join healthcare businesses across 12+ countries using STOAIX to turn enquiries into appointments — automatically.': '12\'den fazla ülkedeki sağlık işletmelerine katılın ve sorguları randevulara dönüştürün — otomatik olarak.',
  'Start free trial': 'Ücretsiz deneyin',
  'See all case studies': 'Tüm vaka çalışmalarını gör',
  'Results in 6 weeks': '6 haftada sonuç',
  'Results in 8 weeks': '8 haftada sonuç',
  'Results in 10 weeks': '10 haftada sonuç',
  'Health-tourism clinic': 'Sağlık turizmi kliniği',
  'Implant practice': 'İmplant kliniği',
  'Medical aesthetics': 'Medikal estetik',
  '3-location chain': '3 lokasyonlu zincir',
});

const TR_CASE_HAIR = Object.assign({}, TR_CASE_STUDY_BASE, {
  'Hair Transplant Clinic Case Study — STOAIX': 'Saç Ekimi Kliniği Vaka Çalışması — STOAIX',
  'Hair Transplant': 'Saç Ekimi',
  'From 8-hour delays to': '8 saatlik gecikmelerden',
  '4-minute AI responses': '4 dakikalık AI yanıtlarına',
  'Istanbul, Turkey': 'İstanbul, Türkiye',
  '8h → 4 min': '8 saat → 4 dakika',
  '240 bookings in 6 weeks': '6 haftada 240 rezervasyon',
  '80% admin time saved': '%80 yönetim süresi tasarrufu',
  '+40% show-up rate lift': '+%40 geliş oranı artışı',
});

const TR_CASE_DENTAL = Object.assign({}, TR_CASE_STUDY_BASE, {
  'Dental Clinic Case Study — STOAIX': 'Diş Kliniği Vaka Çalışması — STOAIX',
  'Dental Clinic': 'Diş Kliniği',
  'A 90-day sales cycle,': '90 günlük satış döngüsü,',
  'automated end-to-end': 'uçtan uca otomatikleştirildi',
  'South London, UK': 'Güney Londra, İngiltere',
  '8h → 4 min response': '8 saat → 4 dk yanıt',
  '240 bookings in 6 weeks': '6 haftada 240 rezervasyon',
  '80% admin time saved': '%80 yönetim süresi tasarrufu',
});

const TR_CASE_AESTHETIC = Object.assign({}, TR_CASE_STUDY_BASE, {
  'Aesthetic Clinic Case Study — STOAIX': 'Estetik Kliniği Vaka Çalışması — STOAIX',
  'Aesthetic Clinic': 'Estetik Klinik',
  '12,000 forgotten leads.': '12.000 unutulan lead.',
  '240 new bookings.': '240 yeni rezervasyon.',
  'London, UK': 'Londra, İngiltere',
  '8h → 4 min response': '8 saat → 4 dk yanıt',
  '+40% show-up rate lift': '+%40 geliş oranı artışı',
  '80% admin time saved': '%80 yönetim süresi tasarrufu',
});

const TR_CASE_PHYSIO = Object.assign({}, TR_CASE_STUDY_BASE, {
  'Physiotherapy Chain Case Study — STOAIX': 'Fizyoterapi Zinciri Vaka Çalışması — STOAIX',
  'Physiotherapy': 'Fizyoterapi',
  '3 clinics, zero admin burden,': '3 klinik, sıfır yönetim yükü,',
  '6,200 patients re-engaged': '6.200 yeniden aktive edilen hasta',
  'United Kingdom': 'Birleşik Krallık',
  '8h → 4 min response': '8 saat → 4 dk yanıt',
  '+40% show-up rate lift': '+%40 geliş oranı artışı',
  '240 bookings in 6 weeks': '6 haftada 240 rezervasyon',
});

/* ─── About Us page ──────────────────────────────────────── */
const TR_ABOUT = {};  /* i18n-home: ana sayfada kullanilmiyor */

/* ─── Login page ─────────────────────────────────────────── */
const TR_LOGIN = {};  /* i18n-home: ana sayfada kullanilmiyor */

/* ─── Signup page ────────────────────────────────────────── */
const TR_SIGNUP = {};  /* i18n-home: ana sayfada kullanilmiyor */

/* ─── Checkout page ──────────────────────────────────────── */
const TR_CHECKOUT = {};  /* i18n-home: ana sayfada kullanilmiyor */

/* ─── Media page ─────────────────────────────────────────── */
const TR_MEDIA = {};  /* i18n-home: ana sayfada kullanilmiyor */

const TR_DEMO = {};  /* i18n-home: ana sayfada kullanilmiyor */

/* ═══════════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════════ */
(function initI18n() {
  const path = getPath();

  const DICT_MAP = {
    '/': TR_INDEX,
    '/index': TR_INDEX,
    '/partners': TR_PARTNERS,
    '/healthcare-clinics': TR_HEALTHCARE,
    '/login': TR_LOGIN,
    '/signup': TR_SIGNUP,
    '/checkout': TR_CHECKOUT,
    '/case-studies': TR_CASE_STUDIES,
    '/case-study-hair-transplant': TR_CASE_HAIR,
    '/case-study-dental': TR_CASE_DENTAL,
    '/case-study-aesthetic': TR_CASE_AESTHETIC,
    '/case-study-physiotherapy': TR_CASE_PHYSIO,
    '/about': TR_ABOUT,
    '/media': TR_MEDIA,
    '/demo-interactive': TR_DEMO,
  };

  const dict = DICT_MAP[path] || null;

  const urlLocale = (function () {
    const seg = window.location.pathname.split('/').filter(Boolean)[0];
    return (seg === 'en' || seg === 'tr') ? seg : null;
  })();

  /* ── Faz 2.1: İlk ziyarette tarayıcı dil tespiti ────── */
  if (!localStorage.getItem('stoaix-lang') && !urlLocale) {
    const browserLang = (navigator.language || '').toLowerCase();
    localStorage.setItem('stoaix-lang', browserLang.startsWith('tr') ? 'tr' : 'en');
  }

  /* ── Faz 1.2: Sayfa dilini doğru tespit et ───────────── */
  const htmlLang = document.documentElement.lang;
  const isNativeTR = htmlLang === 'tr';
  const isNativeEN = htmlLang === 'en' && (PAGE_PAIRS[path] || !DICT_MAP[path]);

  let activeLang;
  if (isNativeTR) {
    activeLang = 'tr';
  } else if (isNativeEN) {
    activeLang = 'en';           /* Native EN Kategori B — çeviri yok, EN zorla */
  } else {
    activeLang = urlLocale || localStorage.getItem('stoaix-lang') || 'tr';
  }

  /* ── Faz 2.2: TR sayfaya düşen EN kullanıcıyı yönlendir  */
  if (!sessionStorage.getItem('stoaix-redirected') && isNativeTR &&
      localStorage.getItem('stoaix-lang') === 'en' && PAGE_PAIRS[path]) {
    sessionStorage.setItem('stoaix-redirected', '1');
    window.location.replace(PAGE_PAIRS[path]);
    return;
  }

  /* ── Faz 1.3: handleToggle — sayfa eşleştirmeli ──────── */
  function handleToggle(targetLang) {
    localStorage.setItem('stoaix-lang', targetLang);
    /* Doğrudan karşılık sayfası varsa oraya git */
    if (PAGE_PAIRS[path]) {
      window.location.href = PAGE_PAIRS[path];
      return;
    }
    /* TR-only sayfa, EN'e geçilemez */
    if (TR_ONLY_PAGES.has(path) && targetLang === 'en') return;
    /* Kategori A (aynı dosya, JS çeviri): prefix ile yönlendir */
    window.location.href = '/' + targetLang + (path === '/' ? '' : path);
  }

  /* ── Faz 1.6: Native TR sayfalarda translateTree'yi engelle */
  function applyTranslation() {
    if (isNativeTR) return;           /* Zaten Türkçe, çevirme */
    if (activeLang !== 'tr') return;
    const activeDict = dict || TR_COMMON;
    translateTree(document.body, activeDict);
    const t = norm(document.title);
    if (activeDict[t]) document.title = activeDict[t];
  }

  function boot() {
    injectToggle(activeLang, handleToggle);

    /* ── Faz 1.5: TR-only sayfalarda EN butonunu devre dışı bırak */
    if (TR_ONLY_PAGES.has(path)) {
      document.querySelectorAll('.lang-btn[data-lang="en"]').forEach(function(btn) {
        btn.disabled = true;
        btn.style.opacity = '0.35';
        btn.style.cursor = 'default';
      });
    }

    applyTranslation();

    /* ── Faz 3.1: <html lang> dinamik güncelleme ────────── */
    document.documentElement.lang = activeLang === 'tr' ? 'tr' : 'en';
  }

  /* Run as early as possible to avoid flash */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
