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
  'Book a call': 'Görüşme Planla',
  'Features': 'Özellikler',
  'Healthcare': 'Sağlık',
  'Partners': 'Partnerler',
  'AI receptionist for any business. Answer every call, handle every message, convert every lead.': 'Her işletme için AI resepsiyonist. Her aramayı yanıtla, her mesajı yönet, her lead\'i dönüştür.',
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
  'Careers': 'Kariyer',
  'Privacy Policy': 'Gizlilik Politikası',
  'Terms of Service': 'Kullanım Koşulları',
  'Cookie Policy': 'Çerez Politikası',
  'GDPR': 'KVKK',
  '© 2026 STOAIX Ltd. — London, UK': '© 2026 STOAIX Ltd. — Londra, UK',
  'Made for businesses that refuse to miss a lead.': 'Lead kaçırmayan işletmeler için tasarlandı.',
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
  'Chat AI & Workflow': 'Chat AI ve İş Akışı',
  'Team Members': 'Ekip Üyeleri',
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
  'Essential & Professional: 3-day free trial · ': 'Essential ve Professional: 3 günlük ücretsiz deneme · ',
  /* --- Old pricing strings kept for legacy compatibility --- */
  'Chat, CRM & automation to get started': 'Başlamak için chat, CRM ve otomasyon',
  'Add Voice AI to your stack': 'Sesli AI\'ı stack\'inize ekleyin',
  'The full system — voice, chat & pipeline': 'Tam sistem — ses, chat ve pipeline',
  'Done-with-you. Built around your business.': 'Sizinle birlikte. İşletmenize özel.',
  'WhatsApp & Instagram — Unlimited': 'WhatsApp ve Instagram — Sınırsız',
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
});

/* ─── Partners page ──────────────────────────────────────── */
const TR_PARTNERS = Object.assign({}, TR_COMMON, {
  'Partner Program — STOAIX | Earn Recurring Revenue Selling AI Automation': 'Partner Programı — STOAIX | AI Otomasyonu Satarak Tekrarlayan Gelir Kazanın',
  'Partner Program — Now Open': 'Partner Programı — Başvurular Açık',
  'Sell AI automation.': 'AI otomasyonu satın.',
  'Earn recurring revenue.': 'Tekrarlayan gelir elde edin.',
  'Refer clients or go white-label. Earn up to 40% recurring commission on every active client — no technical background required.': 'Müşteri yönlendirin veya white-label seçin. Her aktif müşteriden %40\'a kadar aylık komisyon kazanın — teknik bilgi gerekmez.',
  'Apply to Partner Program': 'Partner Programına Başvurun',
  'See commission tiers': 'Komisyon kademelerini inceleyin',
  '$0 to join · No technical skills required · Recurring commissions': 'Ücretsiz katılım · Teknik bilgi gerekmez · Aylık tekrarlayan komisyon',
  'Max recurring commission': 'Maks. aylık komisyon',
  'Affiliate tiers': 'Affiliate kademeleri',
  'Cost to join': 'Katılım ücreti',
  'Languages supported': 'Desteklenen diller',
  'Who it\'s for': 'Kimler için uygun',
  'Two ways to partner with STOAIX': 'STOAIX ile iş ortağı olmanın iki yolu',
  'Whether you want to refer clients casually or build a full AI agency business, there\'s a tier for you.': 'İster zaman zaman müşteri yönlendirin, ister tam kapsamlı bir AI ajans işi kurun — size uygun bir kademe var.',
  'Affiliate / Referral Partner': 'Affiliate / Yönlendirme Ortağı',
  'You have a network — clients, followers, or contacts who need AI automation. Refer them and earn recurring commission every month they stay.': 'Bir ağınız var — AI otomasyonuna ihtiyaç duyan müşteriler, takipçiler veya bağlantılar. Onları yönlendirin, aktif kaldıkları her ay komisyon kazanın.',
  'Start earning from the very first referral': 'İlk yönlendirmeden itibaren kazanmaya başlayın',
  '10–30% recurring commission (rises with active clients)': 'Aylık %10–30 komisyon (aktif müşteri sayısıyla birlikte artar)',
  'STOAIX handles all onboarding and support': 'Tüm onboarding ve destek süreçlerini STOAIX yönetir',
  'Great for: consultants, coaches, business networks': 'İdeal profiller: danışmanlar, koçlar, iş ağları',
  'Agency / White-Label Partner': 'Ajans / Beyaz Etiket Ortağı',
  'Build your own AI agency on top of STOAIX infrastructure. Sell under your brand, manage multiple clients from one dashboard, keep the margin.': 'STOAIX altyapısı üzerine kendi AI ajansınızı kurun. Kendi markanızla satın, tek panelden tüm müşterilerinizi yönetin, kârı cebinize koyun.',
  '40% recurring commission on every active client': 'Her aktif müşteriden %40 aylık komisyon',
  'White-label: your logo, your domain, your brand': 'Beyaz etiket: logonuz, domaininiz, markanız',
  'One-time setup fee — no ongoing platform cost': 'Tek seferlik kurulum ücreti — süregelen platform maliyeti yok',
  'Great for: digital agencies, AI consultants, resellers': 'İdeal profiller: dijital ajanslar, AI danışmanları, bayiler',
  'Why STOAIX': 'Neden STOAIX',
  'Your clients save $400–$600/month vs. building it themselves': 'Müşterileriniz, kendi başlarına kurmayla kıyaslandığında ayda $400–$600 tasarruf eder',
  'The typical AI agency stack (VAPI + GHL + Make/N8N) costs $800–$1,000/mo and takes weeks to set up. STOAIX Agency is $499/mo — everything included, live in minutes.': 'Tipik bir AI ajans altyapısı (VAPI + GHL + Make/N8N) aylık $800–$1.000\'e mal olur ve kurulumu haftalar alır. STOAIX Agency ise $499/ay — her şey dahil, dakikalar içinde hazır.',
  'Feature': 'Özellik',
  'Monthly cost': 'Aylık maliyet',
  'Voice AI': 'Sesli AI',
  'WhatsApp + Web Chat': 'WhatsApp + Web Chat',
  'CRM + Pipeline': 'CRM + Pipeline',
  'Multi-client management': 'Çok müşteri yönetimi',
  'Setup time': 'Kurulum süresi',
  'Languages': 'Diller',
  'VAPI — separate billing, usage caps': 'VAPI — ayrı faturalama, kullanım sınırları',
  'Included — inbound + outbound': 'Dahil — gelen ve giden aramalar',
  'Extra integration + cost': 'Ek entegrasyon ve ek maliyet',
  'Included — same knowledge base': 'Dahil — tek bilgi tabanı',
  'GHL subscription required': 'GHL aboneliği gerektirir',
  'Built-in — lead scoring + follow-up': 'Dahili — lead puanlama ve takip',
  'Manual per-client setup': 'Her müşteri için manuel kurulum',
  'Reseller dashboard — one panel': 'Bayi paneli — tek ekran',
  '2–4 weeks per client': 'Müşteri başına 2–4 hafta',
  'Under 5 minutes — self-serve': '5 dakikadan kısa — self-servis',
  'Manual prompt engineering': 'Manuel prompt ayarları',
  '15+ languages — native support': '15+ dil — yerleşik destek',
  'Commission structure': 'Komisyon yapısı',
  '3 tiers. Rises as your client base grows.': '3 kademe. Müşteri tabanınız büyüdükçe oran yükselir.',
  'Commission is recurring — you earn every month your referred clients stay active. Tier is based on your current active client count and adjusts dynamically.': 'Komisyon aylık tekrarlanır — yönlendirdiğiniz müşteriler aktif kaldıkça kazanmaya devam edersiniz. Kademe, anlık aktif müşteri sayısına göre otomatik olarak güncellenir.',
  'Tier': 'Kademe',
  'Commission': 'Komisyon',
  'Active clients': 'Aktif müşteriler',
  'Notes': 'Notlar',
  'Default tier — anyone can join': 'Başlangıç kademesi — herkese açık',
  'Consistent referral track record': 'Düzenli yönlendirme geçmişi',
  'High-volume affiliate partner': 'Yüksek hacimli affiliate ortağı',
  'Recurring monthly': 'Aylık tekrarlayan',
  '1–5 active clients': '1–5 aktif müşteri',
  '5–10 active clients': '5–10 aktif müşteri',
  '10–20 active clients': '10–20 aktif müşteri',
  'Sign up instantly, no approval needed': 'Anında kayıt, onay gerekmez',
  'Tier auto-adjusts with active count': 'Kademe aktif müşteri sayısına göre otomatik güncellenir',
  'Tier drops if active count falls': 'Aktif sayı düşerse kademe de düşer',
  'White Label': 'Beyaz Etiket',
  'Sell STOAIX as your own product.': 'STOAIX\'i kendi ürününüz olarak satın.',
  'Choose a white-label package and run the entire platform under your brand — your logo, your domain, your pricing. Earn 40% on every active client, every month.': 'Bir beyaz etiket paketi seçin ve tüm platformu kendi markanız altında işletin — logonuz, domaininiz, fiyatlandırmanız. Her aktif müşteriden her ay %40 kazanın.',
  'WL Basic — $997': 'WL Basic — $997',
  'Full white-label setup under your brand. One-time fee, no recurring platform cost. Earn 40% commission on every client you manage.': 'Markanız altında eksiksiz beyaz etiket kurulumu. Tek seferlik ücret, süregelen platform maliyeti yok. Yönettiğiniz her müşteriden %40 komisyon kazanın.',
  'Your logo, domain, and brand throughout': 'Her yerde kendi logonuz, domaininiz ve markanız',
  '40% recurring commission on all active clients': 'Tüm aktif müşterilerden %40 aylık komisyon',
  'Partner dashboard to track clients & commissions': 'Müşterileri ve komisyonları takip etmek için partner paneli',
  'Dedicated onboarding support': 'Özel başlangıç desteği',
  'WL Pro — $1,497': 'WL Pro — $1.497',
  'Everything in WL Basic plus a 4-session live sales training program. Learn how to close AI automation deals and build a repeatable pipeline.': 'WL Basic\'teki her şeye ek olarak 4 oturumlu canlı satış eğitimi. AI otomasyon tekliflerini nasıl kapatacağınızı ve tekrarlanabilir bir satış süreci nasıl oluşturacağınızı öğrenin.',
  'Everything in WL Basic': 'WL Basic\'teki her şey',
  '4 live sales training sessions (1 month)': '4 canlı satış eğitimi oturumu (1 ay)',
  'Discovery call & closing frameworks': 'Keşif görüşmesi ve kapanış teknikleri',
  'Process': 'Süreç',
  'Three steps to your first commission': 'İlk komisyonunuza giden üç adım',
  'No technical setup. No waiting. You find clients — we handle everything else.': 'Teknik kurulum yok. Bekleme yok. Müşterileri siz bulun — geri kalanını biz hallederiz.',
  'Sign up instantly': 'Hemen kayıt olun',
  'Fill in your details and your affiliate account is ready in minutes. You get a unique referral link and access to your partner dashboard immediately.': 'Bilgilerinizi doldurun, affiliate hesabınız dakikalar içinde hazır. Anında benzersiz bir yönlendirme bağlantısı ve partner panelinize erişim elde edersiniz.',
  'Refer or sell': 'Yönlendirin veya satın',
  'Share your link or run the sales call yourself. STOAIX handles onboarding, support, and technical setup — you just connect the client.': 'Bağlantınızı paylaşın ya da satış görüşmesini bizzat siz yapın. STOAIX onboarding, destek ve teknik kurulumu yönetir — siz sadece müşteriyi bağlarsınız.',
  'Earn every month': 'Her ay kazanmaya devam edin',
  'Commission is paid monthly, recurring for as long as the client stays active. The more active clients you have, the higher your tier and commission rate.': 'Komisyon aylık ödenir; müşteri aktif olduğu sürece tekrarlanır. Aktif müşteri sayınız arttıkça kademeniz ve komisyon oranınız da yükselir.',
  'Ready to earn recurring revenue from AI?': 'AI\'dan aylık tekrarlayan gelir elde etmeye hazır mısınız?',
  'Sign up takes 2 minutes. Your referral link is ready instantly. Start earning the same day.': 'Kayıt 2 dakika sürer. Yönlendirme bağlantınız anında hazır. Aynı gün kazanmaya başlayın.',
  'Apply Now': 'Hemen Başvurun',
  'Ask a question': 'Soru sorun',

  /* ── Hero (new copy) ── */
  'Build recurring income. Sell AI to': 'Tekrarlayan gelir elde et. AI sat',
  'No code. No setup. No other tools to learn. Just sell — and earn 10–40% recurring commission every month your clients stay active.': 'Kod yok. Kurulum yok. Başka araç yok. Sadece sat — müşterilerin aktif kaldığı her ay %10–40 komisyon kazan.',
  'Apply — It\'s Free': 'Başvur — Ücretsiz',
  'See how it works': 'Nasıl çalıştığını gör',
  'Free to join': 'Ücretsiz katılım',
  'No technical skills needed': 'Teknik bilgi gerekmez',
  'Commission paid monthly': 'Komisyon aylık ödenir',

  /* ── Marquee ── */
  'Powered by the best. Connects with everything.': 'En iyilerle güçlendirildi. Her şeyle entegre çalışır.',

  /* ── Stats bar ── */
  'Cost to join — ever': 'Katılım ücreti — hiç',
  'Pre-built AI workflows': 'Hazır AI iş akışları',

  /* ── Who section ── */
  'Is this for you?': 'Bu sizin için mi?',
  'You already know businesses that need this.': 'Bu ürüne ihtiyaç duyan işletmeleri zaten tanıyorsunuz.',
  'No technical background needed. If you work with businesses, you\'re the right fit.': 'Teknik bilgiye gerek yok. İşletmelerle çalışıyorsanız, tam aradığımız kişisiniz.',
  'Digital Marketing Agencies': 'Dijital Pazarlama Ajansları',
  'Healthcare Consultants': 'Sağlık Danışmanları',
  'Tech & AI Freelancers': 'Teknoloji & AI Freelancerları',
  'Sales Professionals': 'Satış Profesyonelleri',
  'CRM & SaaS Resellers': 'CRM & SaaS Bayileri',
  'Business Coaches & Trainers': 'İş Koçları & Eğitmenler',
  'Add AI automation to your service stack. Earn 40% recurring on every client.': 'Hizmet portföyünüze AI otomasyonu ekleyin. Her müşteriden %40 aylık komisyon kazanın.',
  'You have the trust. STOAIX has the product. A natural fit.': 'Güven sizde. Ürün STOAIX\'te. Mükemmel bir uyum.',
  'Stop one-off projects. Build recurring revenue from a growing client base.': 'Tek seferlik projelere son verin. Büyüyen müşteri tabanından tekrarlayan gelir elde edin.',
  'Close deals. Earn recurring commissions that grow with every new client.': 'Anlaşmaları kapatın. Her yeni müşteriyle büyüyen aylık komisyon kazanın.',
  'A natural add-on to any software stack. Commission that compounds fast.': 'Her yazılım ekosistemiyle uyumlu bir eklenti. Hızla büyüyen komisyon.',
  'Recommend STOAIX to your clients. Earn recurring commission every month they use it.': 'STOAIX\'i müşterilerinize önerin. Kullandıkları her ay aylık komisyon kazanın.',

  /* ── Product section ── */
  'The product': 'Ürün',
  'Every business has the same problem. STOAIX solves it.': 'Her işletmenin aynı sorunu var. STOAIX çözüyor.',
  'Every business loses revenue to missed calls, slow follow-up, and manual work. STOAIX fixes all of it.': 'Her işletme cevapsız aramalar, yavaş takip ve manuel işler yüzünden gelir kaybediyor. STOAIX hepsini çözüyor.',
  'The problem every business has': 'Her işletmenin yaşadığı sorun',
  'Missed calls, slow replies, no follow-up — leads go cold and convert elsewhere. Every day.': 'Cevapsız aramalar, yavaş yanıtlar, takip yok — leadler soğuyor ve rakibe gidiyor. Her gün.',
  'Missed calls = lost revenue, every single day': 'Cevapsız arama = her gün kaybedilen gelir',
  'Slow WhatsApp & chat responses kill conversions': 'Yavaş WhatsApp & chat yanıtları dönüşümleri öldürüyor',
  'Manual lead follow-up is inconsistent and incomplete': 'Manuel lead takibi tutarsız ve eksik',
  'What STOAIX does for them': 'STOAIX ne yapıyor',
  'One platform — voice, WhatsApp, web chat, CRM. Automatic. 24/7. Any language.': 'Tek platform — ses, WhatsApp, web chat, CRM. Otomatik. 7/24. Her dilde.',
  'AI Voice: answers every call, qualifies, and books 24/7': 'AI Ses: her aramayı yanıtlar, nitelendirir ve randevu alır — 7/24',
  'WhatsApp & Web Chat: instant replies and automated follow-up': 'WhatsApp & Web Chat: anında yanıt ve otomatik takip',
  'CRM & Pipeline: every lead scored, tracked, and nurtured': 'CRM & Pipeline: her lead puanlanır, takip edilir ve beslenir',
  '15+ languages — works for international customers too': '15+ dil — yabancı müşteriler için de çalışır',

  /* ── Why STOAIX section ── */
  'Why STOAIX is different to sell': 'STOAIX\'i satmak neden farklı',
  'No N8N. No VAPI. No Make. One platform — already built.': 'N8N yok. VAPI yok. Make yok. Tek platform — hazır.',
  'While others juggle 5 tools and months of setup, you sell a single platform that\'s already live. You focus on sales — we handle the rest.': 'Diğerleri 5 araçla aylarca uğraşırken, siz zaten canlıda olan tek bir platformu satıyorsunuz. Siz satışa odaklanın — geri kalanını biz halledelim.',
  '20+ pre-built AI workflows, ready to deploy': '20\'den fazla hazır AI iş akışı, hemen devreye alınabilir',
  'Missed call recovery, lead follow-up, appointment reminders, re-engagement — all built, all tested. You don\'t configure anything.': 'Cevapsız arama kurtarma, lead takibi, randevu hatırlatmaları, yeniden etkileşim — hepsi hazır, hepsi test edildi. Hiçbir şeyi ayarlamanız gerekmez.',
  'No VAPI, no GHL, no Make — one platform': 'VAPI yok, GHL yok, Make yok — tek platform',
  'Voice AI, WhatsApp, Web Chat, CRM — all in one. Your clients get more, pay less. That\'s your pitch.': 'Sesli AI, WhatsApp, Web Chat, CRM — hepsi tek platformda. Müşterileriniz daha fazlasını alır, daha az öder. Bu sizin satış argümanınız.',
  'Live in under 5 minutes — no setup needed': '5 dakikadan kısa sürede canlıda — kurulum gerekmez',
  'You close the deal. We onboard the client. Live in minutes — clients see results fast, stay longer, and you keep earning.': 'Siz anlaşmayı kapatın. Müşterinin onboardingini biz yapalım. Dakikalar içinde canlıda — müşteriler hızlı sonuç görür, daha uzun kalır ve siz kazanmaya devam edersiniz.',
  'We handle all support — you just refer': 'Tüm desteği biz yönetiyoruz — siz sadece yönlendirin',
  'Technical questions, onboarding, troubleshooting — all on us. You make introductions. We handle the rest.': 'Teknik sorular, onboarding, sorun giderme — hepsi bizde. Siz tanıştırın, geri kalanı biz halledelim.',

  /* ── Earnings section ── */
  'What you earn': 'Ne kadar kazanırsınız',
  'Recurring. Every month. For as long as they stay.': 'Tekrarlayan. Her ay. Aktif kaldıkları sürece.',
  'Every active client pays you — every month. Build a portfolio of 10 clients and earn $900+ monthly, automatically.': 'Her aktif müşteri size ödeme yapar — her ay. 10 müşteriden oluşan bir portföy kurun ve aylık otomatik olarak $900+ kazanın.',
  '3 Active Clients': '3 Aktif Müşteri',
  'per month, recurring': 'aylık, tekrarlayan',
  '3 clients × $299/mo plan × 30% commission': '3 müşteri × $299/ay plan × %30 komisyon',
  'Starter to Pro tier — automatic as you grow': 'Starter\'dan Pro kademeye — büyüdükçe otomatik',
  '10 Active Clients': '10 Aktif Müşteri',
  '10 clients × $299/mo plan × 30% commission': '10 müşteri × $299/ay plan × %30 komisyon',
  'Pro tier unlocked — tier adjusts automatically': 'Pro kademe açıldı — kademe otomatik güncellenir',
  'White-Label: 15 Clients': 'Beyaz Etiket: 15 Müşteri',
  '15 clients × $299/mo × 40% white-label rate': '15 müşteri × $299/ay × %40 beyaz etiket oranı',
  'Sell under your own brand — you set the margin': 'Kendi markanızla satın — marjı siz belirleyin',

  /* ── Partnership types ── */
  'Partnership types': 'Ortaklık türleri',
  'Two ways to work with us. You choose the level.': 'Bizimle çalışmanın iki yolu. Seviyeyi siz seçin.',
  'Start referring and earn from day one. Or white-label the platform and sell it as your own brand.': 'Hemen yönlendirmeye başlayın ve ilk günden itibaren kazanın. Ya da platformu beyaz etiketle kendi markanızda satın.',
  'Affiliate / Referral': 'Affiliate / Yönlendirme',
  'Refer clients. Earn passively.': 'Müşteri yönlendirin. Pasif gelir elde edin.',
  'recurring monthly commission': 'aylık tekrarlayan komisyon',
  'Make the introduction. We handle everything else — demo, onboarding, support. You earn monthly, automatically.': 'Tanıştırmanızı yapın. Demo, onboarding, destek — geri kalanını biz halledelim. Siz aylık otomatik olarak kazanın.',
  'No technical knowledge required': 'Teknik bilgi gerekmez',
  'STOAIX manages onboarding & support for every client': 'Her müşteri için onboarding ve desteği STOAIX yönetir',
  'Commission rises automatically as your client base grows': 'Müşteri tabanınız büyüdükçe komisyon otomatik yükselir',
  'Best for: consultants, coaches, sales professionals': 'İdeal profil: danışmanlar, koçlar, satış profesyonelleri',
  'Agency / White-Label': 'Ajans / Beyaz Etiket',
  'recurring monthly commission — or set your own pricing': 'aylık tekrarlayan komisyon — ya da kendi fiyatınızı belirleyin',
  'Your brand. Your pricing. Our infrastructure. Manage all clients from one dashboard — you control the relationship, we power the product.': 'Markanız. Fiyatlandırmanız. Bizim altyapımız. Tüm müşterileri tek panelden yönetin — ilişkiyi siz kontrol edin, ürünü biz güçlendirelim.',
  'Full white-label: your brand on every screen': 'Tam beyaz etiket: her ekranda sizin markanız',
  'Set your own pricing — earn the full margin above cost': 'Kendi fiyatınızı belirleyin — maliyetin üzerindeki tüm marjı kazanın',
  'Multi-client dashboard — manage everything in one place': 'Çok müşterili panel — her şeyi tek yerden yönetin',
  'Best for: digital agencies, AI consultants, tech resellers': 'İdeal profil: dijital ajanslar, AI danışmanları, teknoloji bayileri',

  /* ── Commission tiers ── */
  'The more you grow, the more you earn.': 'Ne kadar büyürseniz, o kadar çok kazanırsınız.',
  'Your tier adjusts automatically as your client base grows. No application. No approval. Just keep referring.': 'Müşteri tabanınız büyüdükçe kademeniz otomatik güncellenir. Başvuru yok. Onay yok. Sadece yönlendirmeye devam edin.',
  'What changes': 'Ne değişiyor',
  'Starter': 'Başlangıç',
  'Entry': 'Giriş',
  'Open to everyone — start earning from client #1. No approval, no waiting.': 'Herkese açık — 1. müşteriden itibaren kazanmaya başlayın. Onay yok, bekleme yok.',
  'Recurring monthly': 'Aylık tekrarlayan',
  '1–4 active clients': '1–4 aktif müşteri',
  'You get a referral link and partner dashboard immediately upon signing up.': 'Kayıt olduğunuzda anında yönlendirme bağlantısı ve partner paneli alırsınız.',
  'Growth': 'Büyüme',
  'Popular': 'Popüler',
  'Automatically unlocked. No action needed from you.': 'Otomatik açılır. Sizden herhangi bir işlem gerekmez.',
  '5–9 active clients': '5–9 aktif müşteri',
  'Commission rate upgrades automatically on all active clients — not just new ones.': 'Komisyon oranı tüm aktif müşteriler için otomatik yükselir — sadece yeniler için değil.',
  'Pro': 'Pro',
  'Top Tier': 'En Yüksek Kademe',
  'For high-volume partners building a serious book of business.': 'Ciddi bir müşteri portföyü oluşturan yüksek hacimli ortaklar için.',
  '10+ active clients': '10+ aktif müşteri',
  'At 10 clients on a $299 plan, you\'re earning $897/mo recurring — automatically.': '10 müşteri, $299 plan ile ayda $897 aylık tekrarlayan gelir — otomatik olarak.',

  /* ── White label packages ── */
  'White-label packages': 'Beyaz etiket paketleri',
  'Your brand. Our infrastructure. Their results.': 'Sizin markanız. Bizim altyapımız. Onların sonuçları.',
  'White-label partners earn 40% on every active client — or set your own pricing and keep even more. A one-time setup fee, no recurring platform cost. Pay once, earn forever.': 'Beyaz etiket ortaklar her aktif müşteriden %40 kazanır — ya da kendi fiyatınızı belirleyin ve daha fazla kazanın. Tek seferlik kurulum ücreti, süregelen platform maliyeti yok. Bir kez öde, sonsuza kadar kazan.',
  'one-time setup fee · no monthly platform cost': 'tek seferlik kurulum ücreti · aylık platform maliyeti yok',
  'WL Basic — Full White-Label Access': 'WL Basic — Tam Beyaz Etiket Erişimi',
  'Your logo, your domain, your clients. We configure the backend — you own the front.': 'Logonuz, domaininiz, müşterileriniz. Backend\'i biz ayarlıyoruz — frontend sizin.',
  'Custom branding: logo, domain, and color scheme': 'Özel marka: logo, domain ve renk şeması',
  'Multi-client reseller dashboard': 'Çok müşterili bayi paneli',
  'Dedicated onboarding & technical support': 'Özel onboarding ve teknik destek',
  'Apply for WL Basic': 'WL Basic\'e Başvur',
  'one-time setup fee · includes sales training program': 'tek seferlik kurulum ücreti · satış eğitim programı dahil',
  'WL Pro — Full Access + Sales Training': 'WL Pro — Tam Erişim + Satış Eğitimi',
  'Everything in WL Basic, plus 4 live training sessions. Learn to pitch, demo, and close — fast.': 'WL Basic\'teki her şey, artı 4 canlı eğitim oturumu. Pitchlemyi, demoyu ve kapanışı hızla öğrenin.',
  '4 live sales training sessions (over 1 month)': '4 canlı satış eğitimi oturumu (1 ay süresince)',
  'Discovery call frameworks & objection handling': 'Keşif görüşmesi çerçevesi ve itiraz yönetimi',
  'Closing scripts tailored for healthcare clinic owners': 'Sağlık kliniği sahipleri için özelleştirilmiş kapanış scriptleri',
  'Apply for WL Pro': 'WL Pro\'ya Başvur',

  /* ── How it works ── */
  'From application to first commission in days.': 'Başvurudan ilk komisyona — günler içinde.',
  'Apply, refer, earn. That\'s the whole process.': 'Başvur, yönlendir, kazan. Süreç bu kadar.',
  'Apply in 2 minutes': '2 dakikada başvur',
  'Short form. Tell us who you work with. Dashboard and referral link ready immediately.': 'Kısa form. Kimlerle çalıştığınızı söyleyin. Panel ve yönlendirme bağlantısı anında hazır.',
  'Make the introduction': 'Tanıştırın',
  'Share your link or introduce us directly. We provide pitch scripts, email templates, and demo materials.': 'Linkinizi paylaşın ya da doğrudan tanıştırın. Pitch scriptleri, e-posta şablonları ve demo materyalleri sağlıyoruz.',
  'Client goes live, you start earning. Monthly, no caps, no expiry. More clients = higher tier, higher rate.': 'Müşteri canlıya geçer, siz kazanmaya başlarsınız. Aylık, sınır yok, son kullanma tarihi yok. Daha fazla müşteri = daha yüksek kademe, daha yüksek oran.',

  /* ── Partner support ── */
  'Partner support': 'Partner desteği',
  'You\'re not selling alone. We back every partner.': 'Yalnız satmıyorsunuz. Her partnerin arkasındayız.',
  'We want you to succeed. That means giving you real resources — not just a referral link and a good-luck message.': 'Başarınızı istiyoruz. Bu, gerçek kaynaklar sunmak demek — sadece yönlendirme linki ve başarılar dileklerinden ibaret değil.',
  'Live partner dashboard': 'Canlı partner paneli',
  'Every client, their status, and your earnings — all in real time.': 'Her müşteri, durumları ve kazancınız — hepsi gerçek zamanlı.',
  'Sales & marketing materials': 'Satış ve pazarlama materyalleri',
  'Email templates, pitch decks, demo scripts — written for selling to clinic owners.': 'E-posta şablonları, pitch destesi, demo scriptleri — klinik sahiplerine satış için yazılmış.',
  'Direct partner support': 'Doğrudan partner desteği',
  'A dedicated STOAIX contact for you and your clients. We stay in it with you.': 'Siz ve müşterileriniz için özel bir STOAIX iletişim kişisi. Süreçte sizinle birlikte kalıyoruz.',
  'Fast onboarding for your clients': 'Müşterileriniz için hızlı onboarding',
  'Live in under 5 minutes. No setup. Clients see results fast — and stick around.': '5 dakikadan kısa sürede canlıda. Kurulum yok. Müşteriler hızlı sonuç görür — ve kalır.',

  /* ── Competitive advantage ── */
  'Your competitive advantage': 'Rekabet avantajınız',
  'Your clients save $400–$600/month compared to building it themselves.': 'Müşterileriniz, kendi başlarına kurmayla kıyaslandığında ayda $400–$600 tasarruf eder.',
  'Competitors spend $800–$1,000+/month piecing together 5 tools. STOAIX is $299–$499/month — live in minutes, zero setup. Easy pitch.': 'Rakipler 5 aracı bir araya getirmek için aylık $800–$1.000+ harcıyor. STOAIX $299–$499/ay — dakikalar içinde canlıda, sıfır kurulum. Kolay satış.',
  'VAPI + GHL + Make / N8N': 'VAPI + GHL + Make / N8N',
  'STOAIX — All Included': 'STOAIX — Her Şey Dahil',
  'Voice AI (inbound + outbound)': 'Sesli AI (gelen + giden)',
  'Included — unlimited inbound': 'Dahil — sınırsız gelen arama',
  'Separate integration + additional cost': 'Ayrı entegrasyon + ek maliyet',
  'CRM + Pipeline management': 'CRM + Pipeline yönetimi',
  'Manual setup per client': 'Her müşteri için manuel kurulum',
  'Time to go live': 'Canlıya geçiş süresi',
  'Language support': 'Dil desteği',
  'Manual prompt engineering per language': 'Her dil için manuel prompt ayarı',

  /* ── CTA ── */
  'One sale. Monthly income. Forever.': 'Bir satış. Aylık gelir. Sonsuza kadar.',
  'Apply today. Get your link within 24 hours. Start earning from your first referral.': 'Bugün başvurun. 24 saat içinde linkinizi alın. İlk yönlendirmeden kazanmaya başlayın.',
  'Apply Now — It\'s Free': 'Hemen Başvurun — Ücretsiz',
  'Ask us a question': 'Bize soru sorun',
  '$0 to join · No technical skills required · Commission paid monthly': 'Ücretsiz katılım · Teknik bilgi gerekmez · Komisyon aylık ödenir',
});

/* ─── Healthcare Clinics page ────────────────────────────── */
const TR_HEALTHCARE = Object.assign({}, TR_COMMON, {
  'Built for healthcare clinics': 'Sağlık klinikleri için tasarlandı',
  // Pain section
  'The real cost': 'Gerçek Maliyet',
  'Four ways your clinic leaks revenue every day': 'Kliniğinizin her gün gelir kaybettiği dört yol',
  'Every clinic we talk to — hair transplant, dental, aesthetic — faces the same four problems.': 'Konuştuğumuz her klinik — saç ekimi, diş, estetik — aynı dört problemle karşı karşıya.',
  'Slow first response': 'Yavaş ilk yanıt',
  'The first clinic to respond wins the patient. When a lead calls after hours, waits in a WhatsApp queue, or spends 10 minutes getting FAQ answers — intent cools fast. Most clinics respond in hours. Your competitor responds in seconds.': 'İlk yanıt veren klinik hastayı kazanır. Bir lead mesai dışı aradığında, WhatsApp kuyruğunda beklediğinde veya SSS yanıtları için 10 dakika harcadığında — niyet hızla soğur. Çoğu klinik saatler içinde yanıt verir. Rakibiniz saniyeler içinde.',
  'No follow-up system': 'Follow-up sistemi yok',
  'A patient says "I\'ll think about it." Day 3 — no call. Day 7 — no message. Converting a lead takes 5–8 touchpoints on average. Without an automated sequence, most leads get one attempt and are permanently forgotten.': 'Hasta "Düşüneceğim" diyor. 3. gün — arama yok. 7. gün — mesaj yok. Bir lead\'i dönüştürmek ortalama 5–8 temas noktası gerektirir. Otomatik bir seri olmadan, çoğu lead tek girişimle kalıcı olarak unutulur.',
  'Booked but never arrived': 'Randevu alındı, hasta gelmedi',
  'A consultation is confirmed. No reminder at 24 hours. No confirmation message the morning of. The patient forgets, double-books, or chooses a competitor who followed up. Every empty chair is a paid acquisition that never converted.': 'Konsültasyon onaylandı. 24 saat öncesinde hatırlatma yok. Sabah konfirmasyon mesajı yok. Hasta unutuyor, çift rezervasyon yapıyor ya da takip eden rakibi tercih ediyor. Her boş sandalye, dönüşüme ulaşamamış ücretli bir kazanımdır.',
  'Thousands of cold leads sitting idle': 'Binlerce soğuk lead bekliyor',
  'Across 800+ clinics we\'ve spoken with, the average lead acquisition cost is ~$15. Most hold thousands of old enquiries — never re-engaged, never re-qualified. That\'s tens of thousands in paid acquisition left completely on the table.': 'Görüştüğümüz 800\'den fazla klinikte ortalama lead edinim maliyeti ~15 dolardır. Çoğu klinik binlerce eski sorguyu elinde tutuyor — hiç yeniden temas kurulmamış, hiç yeniden nitelendirilmemiş. Bu, tamamen masada bırakılmış onlarca bin dolarlık ücretli edinimdir.',
  // Hero animated word translations
  'Your AI': 'AI',
  'receptionist': 'resepsiyonist',
  'call center': 'çağrı merkezi',
  'sales agent': 'satış temsilcisi',
  'chatbot': 'chatbot',
  'voice agent': 'sesli ajan',
  'live in minutes.': 'dakikalar içinde hazır.',
  // Hero sub
  'Answers every call 24/7. Qualifies patients, books consultations, and follows up on cold leads — all without a single meeting with us.': '7/24 her aramayı yanıtlar. Hastaları nitelendirir, konsültasyon randevusu planlar ve soğuk lead\'leri takip eder — bizimle tek bir toplantı bile olmadan.',
  'Available in': 'Şu dillerde mevcut:',
  'and more.': 've daha fazlası.',
  // Rotating language names
  'Russian': 'Rusça',
  'German': 'Almanca',
  'French': 'Fransızca',
  'Spanish': 'İspanyolca',
  'Italian': 'İtalyanca',
  'Dutch': 'Hollandaca',
  'Portuguese': 'Portekizce',
  'Japanese': 'Japonca',
  'Korean': 'Korece',
  'Chinese': 'Çince',
  'Hindi': 'Hintçe',
  'Polish': 'Lehçe',
  // Who it's for section
  "Who it's for": 'Kimler İçin?',
  'Built for every healthcare clinic vertical': 'Her sağlık kliniği dikeyi için tasarlandı',
  'Configure your AI for your specific procedure type, patient profile, and intake requirements — all within the same platform.': 'Prosedür türünüze, hasta profilinize ve kabul gereksinimlerinize özel AI\'ınızı yapılandırın — hepsi aynı platformda.',
  'High-value international patients, long decision cycles, and multilingual enquiries. STOAIX handles the volume, qualifies FUE vs. DHI conversations, and surfaces ready leads.': 'Yüksek değerli uluslararası hastalar, uzun karar süreçleri ve çok dilli sorgular. STOAIX hacmi yönetir, FUE - DHI görüşmelerini nitelendirir ve hazır lead\'leri öne çıkarır.',
  'Implants, veneers, zirconia — patients ask the same questions 50 times a day. STOAIX answers all of them instantly, collects treatment history, and books around your schedule.': 'İmplant, veneer, zirkonyum — hastalar aynı soruları günde 50 kez soruyor. STOAIX hepsini anında yanıtlar, tedavi geçmişini toplar ve takviminize göre randevu oluşturur.',
  'High-ticket, high-sensitivity procedures. STOAIX warms the lead, collects photos and health history, and routes only pre-qualified patients to your surgeons.': 'Yüksek ücretli, hassas prosedürler. STOAIX lead\'i ısıtır, fotoğraf ve sağlık geçmişini toplar ve yalnızca ön nitelikli hastaları cerrahlarınıza yönlendirir.',
  'Botox, fillers, PRP — high enquiry volume, repeat patients, seasonal spikes. STOAIX manages appointment reminders, follow-up sequences, and re-engagement campaigns.': 'Botoks, dolgu, PRP — yüksek sorgu hacmi, tekrar eden hastalar, mevsimsel zirveler. STOAIX randevu hatırlatmalarını, takip dizilerini ve yeniden etkileşim kampanyalarını yönetir.',
  // Multilingual section
  'Multilingual': 'Çok Dilli',
  'Healthcare tourism patients come from Turkey, the UK, Europe, and the Middle East. STOAIX switches languages mid-conversation based on what the patient speaks — no configuration needed, no human translator required.': 'Sağlık turizmi hastaları Türkiye, İngiltere, Avrupa ve Orta Doğu\'dan geliyor. STOAIX, hastanın konuştuğu dile göre konuşma ortasında dil değiştirir — yapılandırma gerekmez, insan tercüman gerekmez.',
  'Turkish, English, and Arabic are included in the Business plan. Additional languages are available as add-ons: Russian, German, French, Spanish, and more.': 'Türkçe, İngilizce ve Arapça tüm ücretli planlara dahildir. 15\'ten fazla dil toplam — Rusça, Almanca, Fransızca, İspanyolca ve daha fazlası eklenti olarak mevcuttur.',
  'Turkish, English, and Arabic are included in all paid plans. 15+ languages total — Russian, German, French, Spanish, and more available as add-ons.': 'Türkçe, İngilizce ve Arapça tüm ücretli planlara dahildir. 15\'ten fazla dil toplam — Rusça, Almanca, Fransızca, İspanyolca ve daha fazlası eklenti olarak mevcuttur.',
  'Start with all three languages': 'Üç dille hemen başlayın',
  'Get started with 15+ languages': '15+ dille hemen başlayın',
  'Your patients speak many languages. STOAIX speaks them all.': 'Hastalarınız birçok dil konuşuyor. STOAIX hepsini konuşuyor.',
  // Getting Started section
  'Getting started': 'Başlarken',
  'Live in under 5 minutes': '5 dakikadan kısa sürede yayında',
  'Fully self-serve. No meetings with our team. The guided setup walks you through every step.': 'Tamamen self-servis. Ekibimizle toplantı yok. Rehberli kurulum her adımda size yol gösterir.',
  'Go live': 'Yayına alın',
  'Setup fee': 'Kurulum ücreti',
  // Feature card body texts
  '15+ languages supported. The AI detects the patient\'s language and continues natively — no configuration, no translator required.': '15\'ten fazla dil destekleniyor. AI, hastanın dilini otomatik olarak algılar ve doğal şekilde konuşmayı sürdürür — yapılandırma gerekmez, tercüman gerekmez.',
  'Turkish, English, and Arabic included. The AI detects the patient\'s language and continues natively — no configuration, no translator required.': '15\'ten fazla dil destekleniyor. AI, hastanın dilini otomatik olarak algılar ve doğal şekilde konuşmayı sürdürür — yapılandırma gerekmez, tercüman gerekmez.',
  'Connect to your existing calendar, booking system, or CRM. Triggers on new lead, booking confirmed, or handoff ready — no developer needed.': 'Mevcut takviminize, rezervasyon sisteminize veya CRM\'inize bağlanın. Yeni lead, rezervasyon onayı veya devir hazır tetikleyicileri — geliştirici gerekmez.',
  // FAQ section
  'Common questions': 'Sık Sorulan Sorular',
  'How long does setup actually take?': 'Kurulum gerçekte ne kadar sürer?',
  'Under 5 minutes for a basic configuration. The guided setup wizard walks you through adding your procedures, FAQs, intake questions, and connecting your phone number. You don\'t need to talk to us, read documentation, or wait for anything to be approved. If you want us to handle the setup for you, the Onboarding Add-on ($297 one-time) includes a 60-minute session where we build it together.': 'Temel yapılandırma için 5 dakikanın altında. Rehberli kurulum sihirbazı, prosedürlerinizi, SSS\'lerinizi, kabul sorularınızı ekleme ve telefon numaranızı bağlama konusunda size adım adım yol gösterir. Bizimle konuşmanıza, belge okumanıza veya herhangi bir onay beklemenize gerek yoktur. Kurulumu sizin yerinize yapmamızı istiyorsanız, Onboarding Add-on ($297 tek seferlik) birlikte inşa ettiğimiz 60 dakikalık bir oturumu kapsar.',
  'Does STOAIX replace my reception team?': 'STOAIX resepsiyon ekibimin yerini alır mı?',
  'No — STOAIX handles the repetitive, high-volume layer: answering FAQs, qualifying patients, collecting intake information, and booking consultations. When a patient is serious or has a complex question, the AI immediately transfers to your team with full context already captured. Your staff spends less time on routine calls and more time on closing consultations.': 'Hayır — STOAIX tekrarlayan, yüksek hacimli katmanı yönetir: SSS\'leri yanıtlama, hastaları nitelendirme, kabul bilgilerini toplama ve konsültasyon rezervasyonu yapma. Bir hasta ciddiyse veya karmaşık bir sorusu varsa, AI halihazırda yakalanan tam bağlamla ekibinize hemen devreder. Personeliniz rutin aramalara daha az, konsültasyonları kapatmaya daha fazla zaman ayırır.',
  'Does it work for international patients who don\'t speak Turkish?': 'Türkçe bilmeyen uluslararası hastalar için de çalışır mı?',
  'Yes. On the Business plan, STOAIX includes Turkish, English, and Arabic out of the box. The AI detects the patient\'s language from the first message or spoken word and continues the conversation natively — no configuration required, no extra cost per language. For UK and Gulf patients especially, responding immediately in their language at any hour is the single biggest conversion driver we see across clinics.': 'Evet. Business planında STOAIX, Türkçe, İngilizce ve Arapçayı hazır olarak içerir. AI, hastanın dilini ilk mesajdan veya söylenen kelimeden algılar ve konuşmayı doğal olarak sürdürür — yapılandırma gerekmez, dil başına ekstra maliyet yoktur. Özellikle İngiltere ve Körfez hastaları için, herhangi bir saatte dillerinde hemen yanıt vermek, klinikler genelinde gördüğümüz en büyük dönüşüm faktörüdür.',
  'We already use GHL or another CRM. Does STOAIX integrate?': 'Zaten GHL veya başka bir CRM kullanıyoruz. STOAIX entegre olur mu?',
  'Yes. The Business plan includes Zapier, Make, and direct webhook support, which covers GoHighLevel, HubSpot, Calendly, Google Calendar, and hundreds of other tools. You don\'t need to change your existing workflow — STOAIX triggers events into it. For custom CRM integrations, contact us for a one-time setup.': 'Evet. Business plan, GoHighLevel, HubSpot, Calendly, Google Calendar ve yüzlerce diğer aracı kapsayan Zapier, Make ve doğrudan webhook desteğini içerir. Mevcut iş akışınızı değiştirmenize gerek yoktur — STOAIX olayları içine tetikler. Özel CRM entegrasyonları için tek seferlik kurulum için bize ulaşın.',
  'Is there a minimum commitment or long-term contract?': 'Minimum taahhüt veya uzun vadeli sözleşme var mı?',
  'No. STOAIX is month-to-month — cancel anytime from your dashboard, no questions asked. Annual billing saves up to 30% if you\'d like to lock that in. The 3-day free trial lets you test the full product before you pay anything. No credit card is required to start.': 'Hayır. STOAIX aylık bazlıdır — dashboard\'unuzdan istediğiniz zaman iptal edin, soru sorulmaz. Yıllık faturalama, bunu kilitlemek istiyorsanız %30\'a kadar tasarruf sağlar. 3 günlük ücretsiz deneme, herhangi bir şey ödemeden önce tam ürünü test etmenize olanak tanır. Başlamak için kredi kartı gerekmez.',
  'My clinic group has multiple locations. Which plan do I need?': 'Klinik grubumun birden fazla lokasyonu var. Hangi plana ihtiyacım var?',
  'The Agency plan ($499/mo) supports multi-location management from a single dashboard. Each location gets its own configured AI agent, phone number, and knowledge base, while you manage everything from one place. This plan also includes white-label customisation if you want to remove STOAIX branding.': 'Agency planı (ayda $499), tek bir dashboard\'dan çok lokasyon yönetimini destekler. Her lokasyon, siz her şeyi tek bir yerden yönetirken kendi yapılandırılmış AI ajanını, telefon numarasını ve bilgi tabanını alır. Bu plan ayrıca STOAIX markasını kaldırmak istiyorsanız beyaz etiket özelleştirmesini de içerir.',
  // CTA section
  '3-day free trial · No credit card required': '3 günlük ücretsiz deneme · Kredi kartı gerekmez',
  'Your next lead is filling': 'Bir sonraki leadiniz şu an',
  'a form right now.': 'form dolduruyor.',
  'Will your clinic call them back in 60 seconds — or will your competitor?': 'Kliniğiniz onları 60 saniyede geri arayacak mı — yoksa rakibiniz mi?',
  'Set up STOAIX in minutes and never lose another lead to slow follow-up.': 'STOAIX\'i dakikalar içinde kurun ve yavaş takip yüzünden bir daha lead kaybetmeyin.',
  'Compare all plans': 'Tüm Planları Karşılaştır',
  '3 days free · No credit card · Cancel anytime': '3 gün ücretsiz · Kredi kartı yok · İstediğiniz zaman iptal edin',
  'Start 3-day free trial': '3 günlük ücretsiz denemeye başlayın',
  'See pricing': 'Fiyatları İnceleyin',
  'No credit card required · Cancel anytime · Setup in minutes': 'Kredi kartı gerekmez · İstediğiniz zaman iptal edin · Dakikalar içinde kurulum',
  'Always answers': 'Her zaman yanıtlar',
  'Languages (TR / EN / AR)': 'Diller',
  'Time to set up': 'Kurulum süresi',
  'The real cost': 'Gerçek maliyet',
  'Four ways your clinic leaks revenue every day': 'Kliniğinizin her gün gelir kaybetmesinin dört yolu',
  'Every clinic we talk to — hair transplant, dental, aesthetic — has the same four problems.': 'Konuştuğumuz her klinik — saç ekimi, diş, estetik — aynı dört soruna sahip.',
  'Missed calls = missed revenue': 'Cevapsız aramalar = kaçan gelir',
  'International patients call at midnight your time. After-hours and weekends are your busiest windows — and exactly when your team is offline. Every unanswered ring goes to a competitor.': 'Uluslararası hastalar sizin gece yarınızda arıyor. Mesai saatleri dışı ve hafta sonları en yoğun pencereleriniz — ve tam olarak ekibinizin çevrimdışı olduğu zaman. Her yanıtsız çağrı bir rakibe gidiyor.',
  'Failed follow-ups': 'Başarısız takipler',
  'A consultation ends with "I\'ll think about it." Nobody calls back on day 3. Nobody sends a WhatsApp on day 7. That warm lead cools in silence — and you never knew how close they were.': 'Bir konsültasyon "Düşüneceğim" ile bitiyor. 3. günde kimse geri aramıyor. 7. günde kimse WhatsApp atmıyor. O sıcak lead sessizlikte soğuyor — ve ne kadar yakın olduklarını hiç bilmediniz.',
  'Dead lead lists': 'Ölü lead listeleri',
  'Hundreds of old enquiries buried in Excel, WhatsApp, and your CRM. Each one asked about a procedure, then went quiet. They haven\'t said no — they just haven\'t been re-engaged.': 'Excel\'e, WhatsApp\'a ve CRM\'inize gömülü yüzlerce eski sorgulama. Her biri bir prosedür hakkında sordu, sonra sessizleşti. Hayır demediler — sadece yeniden ilgilenilmediler.',
  'Call center overload': 'Çağrı merkezi aşırı yükü',
  'Your team spends hours answering "how much does a hair transplant cost?" over and over. Repetitive questions eat the time that should go to closing actual consultations.': 'Ekibiniz saatlerini "saç ekimi ne kadar?" sorusunu tekrar tekrar yanıtlayarak geçiriyor. Tekrarlayan sorular, gerçek konsültasyonları kapatmaya ayrılması gereken zamanı yiyor.',
  'How it works': 'Nasıl çalışır',
  'Set up once. Let it run.': 'Bir kez kurun. Çalıştırın.',
  'STOAIX is a self-serve platform. You sign up, configure your AI agent using the guided setup — no code, no meetings — and it\'s live on your clinic\'s number in minutes.': 'STOAIX bir self-servis platformdur. Kaydolun, rehberli kurulum ile AI ajanınızı yapılandırın — kod yok, toplantı yok — ve dakikalar içinde kliniğinizin numarasında yayına alın.',
  'Answers every inbound call instantly, 24/7': 'Her gelen aramayı anında yanıtlar, 7/24',
  'Asks the right qualification questions for your procedure type': 'Prosedür türünüz için doğru nitelendirme sorularını sorar',
  'Collects patient name, condition, photos needed, and preferred dates': 'Hasta adı, durum, gerekli fotoğraflar ve tercih edilen tarihleri toplar',
  'Books consultations directly into your calendar': 'Konsültasyonları doğrudan takviminize ekler',
  'Follows up automatically when a patient goes cold': 'Bir hasta soğuduğunda otomatik olarak takip eder',
  'Transfers to your team the moment a patient is ready to commit': 'Hasta taahhüt etmeye hazır olduğu anda ekibinize devreder',
  'Try it free for 3 days': '3 gün ücretsiz deneyin',
  'Patient qualified — consultation booked for Tuesday 14:00': 'Hasta nitelendi — Salı 14:00\'de konsültasyon rezervasyonu yapıldı',
  'Features': 'Özellikler',
  'Everything a clinic needs. Nothing it doesn\'t.': 'Bir kliniğin ihtiyacı olan her şey. İhtiyacı olmayan hiçbir şey.',
  'Voice, chat, CRM, and follow-up — in one self-serve platform. No separate tools. No integrations to stitch together.': 'Ses, chat, CRM ve takip — tek bir self-servis platformda. Ayrı araç yok. Entegrasyon derdi yok.',
  'Voice AI — Inbound (Professional+)': 'Sesli AI — Gelen (Professional+)',
  'Voice AI — Inbound (Plus+)': 'Sesli AI — Gelen (Professional+)',
  'Every incoming call answered within 2 seconds, 24/7. No voicemail, no hold music. Patients get answers; your team gets qualified leads.': 'Her gelen arama 2 saniye içinde yanıtlanır, 7/24. Sesli mesaj yok, bekleme müziği yok. Hastalar yanıt alır; ekibiniz nitelikli lead\'ler alır.',
  'Voice AI — Outbound (Business)': 'Sesli AI — Giden (Business)',
  'Voice AI — Outbound (Advanced)': 'Sesli AI — Giden (Business)',
  'Automatically calls leads who went cold, confirms upcoming appointments, and re-engages past enquiries. Converts "I\'ll think about it" into booked slots.': 'Soğuyan lead\'leri otomatik olarak arar, yaklaşan randevuları onaylar ve geçmiş sorgulamaları yeniden devreye sokar. "Düşüneceğim"i rezervasyonlu slotlara dönüştürür.',
  'WhatsApp AI Chatbot (Essential+)': 'WhatsApp AI Chatbot (Essential+)',
  'WhatsApp AI Chatbot (Lite+)': 'WhatsApp AI Chatbot (Essential+)',
  'Answers patient questions on WhatsApp 24/7 using your clinic\'s knowledge base. Price enquiries, procedure info, availability — handled automatically.': 'Kliniğinizin bilgi tabanını kullanarak WhatsApp\'ta 7/24 hasta sorularını yanıtlar. Fiyat sorgulamaları, prosedür bilgisi, müsaitlik — otomatik olarak yönetilir.',
  '15+ Languages Built-in (Business)': '15+ Dil Dahili (Business)',
  '3 Languages Built-in (Business)': '15+ Dil Dahili (Business)',
  '3 Languages Built-in (Advanced)': '15+ Dil Dahili (Business)',
  'Zapier, Make & Webhook (Business)': 'Zapier, Make & Webhook (Business)',
  'Zapier, Make & Webhook (Advanced)': 'Zapier, Make & Webhook (Business)',
  'Hair Transplant Clinics': 'Saç Ekimi Klinikleri',
  'Dental Clinics': 'Diş Klinikleri',
  'Aesthetic Surgery': 'Estetik Cerrahi',
  'Medical Aesthetics': 'Medikal Estetik',
  'Turkish': 'Türkçe',
  'Local patients, domestic referrals, staff communication': 'Yerel hastalar, yurt içi yönlendirmeler, personel iletişimi',
  'English': 'İngilizce',
  'UK, EU, US, Australian healthcare tourism patients': 'İngiltere, AB, ABD, Avustralya sağlık turizmi hastaları',
  'Arabic': 'Arapça',
  'Gulf and Middle East patients — a major underserved segment': 'Körfez ve Orta Doğu hastaları — yeterince kapsanmamış büyük bir pazar',
  'More available': 'Daha fazlası mevcut',
  'Russian, German, French, Spanish, Italian, Dutch, and more': 'Rusça, Almanca, Fransızca, İspanyolca, İtalyanca, Hollandaca ve daha fazlası',
  'Sign up': 'Kaydolun',
  'Start your 3-day free trial. No credit card required.': '3 günlük ücretsiz denemenizi başlatın. Kredi kartı gerekmez.',
  'Configure your agent': 'Ajanınızı yapılandırın',
  'Add your procedures, FAQs, and intake questions using the no-code builder.': 'Kod gerektirmeyen oluşturucuyu kullanarak prosedürlerinizi, SSS\'lerinizi ve kabul sorularınızı ekleyin.',
  'Connect your number': 'Numaranızı bağlayın',
  'Forward your clinic\'s phone number or assign a new one to STOAIX.': 'Kliniğinizin telefon numarasını STOAIX\'e yönlendirin veya yeni bir numara atayın.',
  'Your AI receptionist is active. View every call and lead from your dashboard.': 'AI resepsiyonistiniz aktif. Her aramayı ve lead\'i dashboard\'unuzdan görüntüleyin.',
  'WhatsApp AI chatbot — 24/7': 'WhatsApp AI chatbot — 7/24',
  'Voice AI — inbound 24/7': 'Sesli AI — gelen 7/24',
  '300 min/mo included': 'Ayda 300 dk dahil',
  'Call recording & transcript': 'Çağrı kaydı ve transkript',
  'Voice AI — inbound + outbound': 'Sesli AI — gelen + giden',
  '750 min/mo included': 'Ayda 750 dk dahil',
  'Turkish + English + Arabic': 'Türkçe + İngilizce + Arapça',
  'Multi-location management': 'Çok lokasyon yönetimi',
  'Separate agent per location': 'Lokasyon başına ayrı ajan',
  'White-label (logo, color, domain)': 'Beyaz etiket (logo, renk, domain)',
  '© 2026 STOAIX. All rights reserved.': '© 2026 STOAIX. Tüm hakları saklıdır.',
  'AI Receptionist — Voice, Chat & CRM for Any Business': 'AI Resepsiyonist — Her İşletme için Ses, Chat ve CRM',
  'See full FAQ': 'Tüm SSS\'lere bakın',

  // Hero — new static version
  'AI receptionist for health tourism clinics': 'Sağlık turizmi klinikleri için AI resepsiyonist',
  'Leads arrive.': 'Lead geliyor.',
  "Patients don't.": 'Hasta gelmiyor.',
  'Your clinic runs ads. Most leads never hear back fast enough — so they book at a competitor.': 'Kliniğiniz reklam yayınlıyor. Çoğu leade yeterince hızlı geri dönülmüyor — bu yüzden rakibinizde randevu alıyorlar.',
  'STOAIX calls every new lead within': 'STOAIX her yeni leadi',
  ', 24/7, in 15+ languages.': 'içinde geri arıyor, 7/24, 15\'ten fazla dilde.',
  '60 seconds': '60 saniye',
  'First callback': 'İlk geri arama',
  'Always on': 'Her zaman aktif',
  'Languages': 'Diller',

  // Social proof bar
  'Trusted by clinics across Turkey & the UK': 'Türkiye ve İngiltere genelinde kliniklerin tercihi',
  '40+ active clinics': '40+ aktif klinik',

  // Pain section — updated headline
  'Your ads work. Your follow-up doesn\'t.': 'Reklamlarınız çalışıyor. Follow-up\'ınız çalışmıyor.',
  'A patient fills your lead form at 11pm. They\'re ready. Then nobody calls until Monday morning — and they\'ve already booked elsewhere.': 'Hasta gece 23:00\'te lead formunuzu dolduruyor. Hazır. Sonra Pazartesi sabahına kadar kimse aramıyor — ve artık başka yerde randevu almışlar.',
  'No instant callback on form leads': 'Form leadlerine anında geri arama yok',
  '71% of leads that don\'t get a same-day response never convert. A patient fills your lead form at 11pm — intent at its peak. By the time someone calls Monday morning, they\'ve already booked your competitor who called them back in 60 seconds.': 'Aynı gün yanıt verilmeyen leadlerin %71\'i hiç dönüşmüyor. Hasta gece 23:00\'te lead formunuzu dolduruyor — niyet zirvede. Pazartesi sabahı birileri aradığında, 60 saniyede geri arayan rakibinizde çoktan randevu almışlar.',

  // Features — CRM card (new)
  'CRM & Lead Pipeline (Business)': 'CRM ve Lead Pipeline (Business)',
  'Every lead tracked in a clean pipeline with lead scoring, status stages, and activity logs. Your team sees exactly where each patient stands.': 'Her lead, puanlama, durum aşamaları ve aktivite kayıtları ile temiz bir pipeline\'da takip edilir. Ekibiniz her hastanın tam olarak nerede durduğunu görür.',

  // Testimonials section
  'Real results': 'Gerçek Sonuçlar',
  'What clinics say after 30 days': '30 günün ardından klinikler ne diyor',
  'Real quotes from clinics that switched from manual follow-up to STOAIX.': 'Manuel takipten STOAIX\'e geçen kliniklerin gerçek yorumları.',
  'Lead response time': 'Lead yanıt süresi',
  '"We had 18,000 leads sitting in our CRM that nobody had touched in months. STOAIX reactivated them all. Response time dropped from 8 hours to 4 minutes and our consultation bookings doubled within the first week."': '"CRM\'imizde aylardır kimsenin dokunmadığı 18.000 lead vardı. STOAIX hepsini yeniden harekete geçirdi. Yanıt süresi 8 saatten 4 dakikaya indi ve konsültasyon rezervasyonlarımız ilk haftada ikiye katlandı."',
  'Operations Director': 'Operasyon Direktörü',
  'Istanbul Hair Transplant Clinic': 'İstanbul Saç Ekimi Kliniği',
  'Admin time saved': 'İdari zaman tasarrufu',
  '"STOAIX saved us 80% of admin time overnight. We had 9,500 leads that had gone quiet — the AI re-engaged all of them automatically. Our team now focuses on consultations, not chasing enquiries."': '"STOAIX bir gecede idari zamanımızın %80\'ini tasarruf ettirdi. Sessizleşen 9.500 leadimiz vardı — AI hepsini otomatik olarak yeniden devreye soktu. Ekibimiz artık sorgu peşinde koşmak yerine konsültasyonlara odaklanıyor."',
  'Practice Manager': 'Klinik Yöneticisi',
  'South London Dental Practice': 'Güney Londra Diş Kliniği',
  '240 bookings': '240 rezervasyon',
  'In 6 weeks': '6 Haftada',
  '"12,000 leads in our system. Most had never been properly followed up. In 6 weeks with STOAIX, we generated 240 consultation bookings. The ROI was immediate — we made back the annual cost in the first month."': '"Sistemimizde 12.000 lead vardı. Çoğu hiçbir zaman düzgün takip edilmemişti. STOAIX ile 6 haftada 240 konsültasyon rezervasyonu oluşturduk. ROI anlık gerçekleşti — yıllık maliyeti ilk ayda çıkardık."',
  'Clinic Director': 'Klinik Direktörü',
  'Medical Aesthetic Clinic, London': 'Medikal Estetik Kliniği, Londra',

  // Guarantee section
  '3-day free trial. Zero risk.': '3 günlük ücretsiz deneme. Sıfır risk.',
  'Sign up, configure your AI agent in under 5 minutes, and watch it handle real patient enquiries. No credit card required. If it\'s not right for your clinic after 3 days, you\'ve lost nothing — and you\'ll know exactly why your competitors are pulling ahead.': 'Kayıt olun, AI ajanınızı 5 dakikadan kısa sürede yapılandırın ve gerçek hasta sorgularını nasıl yönettiğini izleyin. Kredi kartı gerekmez. 3 günün sonunda kliniğiniz için doğru değilse, hiçbir şey kaybetmemiş olursunuz — ve rakiplerinizin neden öne geçtiğini tam olarak anlarsınız.',

  // Setup — Onboarding Add-on inline note (split text nodes around <strong>)
  'Prefer us to set it up for you? The': 'Kurulumu sizin yerinize yapalım mı?',
  'Onboarding Add-on': 'Onboarding Eklentisi',
  'includes a 60-minute setup session for $297 — available at checkout.': '$297 karşılığında kasada mevcut olan 60 dakikalık kurulum oturumunu içerir.',

  // How it works visual header
  'AI Agent — Live': 'AI Ajan — Canlı',

  // Sticky trial bar note
  'No credit card required · Cancel anytime': 'Kredi kartı gerekmez · İstediğiniz zaman iptal edin',

  // Marquee section label
  'Powered by the best. Connects with everything.': 'En iyi teknolojilerle güçlendirildi. Her şeyle entegre olur.',

  // Social proof bar — short clinic type tags
  'Hair Transplant': 'Saç Ekimi',
  'Dental': 'Diş',
});

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
const TR_ABOUT = Object.assign({}, TR_COMMON, {
  'About Us — STOAIX | The Story Behind the AI': 'Hakkımızda — STOAIX | AI\'ın Arkasındaki Hikaye',
  'Our Story': 'Hikayemiz',
  'We built the AI': 'İstediğimiz AI\'ı',
  'wished existed.': 'biz inşa ettik.',
  'Every clinic, every agency, every business deserves to respond instantly — in any language, at any hour. We built STOAIX to make that the default, not the exception.': 'Her klinik, her ajans, her işletme anında yanıt verebilmeyi hak ediyor — her dilde, her saatte. STOAIX\'i bunu istisna değil, standart haline getirmek için inşa ettik.',
  'The Origin': 'Başlangıç',
  'A missed call is': 'Kaçırılan bir arama,',
  'a missed patient.': 'kaçırılan bir hastadır.',
  'In 2023, Ata and Emir were working closely with healthcare clinics across Turkey and the UK. The same problem kept surfacing: leads were coming in at midnight, on weekends, from patients in Dubai, London, or Istanbul — and nobody was there to respond.': '2023 yılında Ata ve Emir, Türkiye ve İngiltere genelindeki sağlık klinikleriyle yakın çalışıyordu. Hep aynı sorunla karşılaştılar: gece yarısı, hafta sonları, Dubai\'den, Londra\'dan, İstanbul\'dan hastalar ulaşıyor — ama yanıtlayan kimse yoktu.',
  'By the time someone called back the next morning, the patient had already booked elsewhere. Not because the clinic was worse — just slower. A 6-hour delay felt like a rejection.': 'Ertesi sabah biri geri aradığında, hasta çoktan başka bir yere randevu almıştı. Klinik daha kötü olduğu için değil — sadece daha yavaştı. 6 saatlik bir gecikme, ret gibi hissettiriyordu.',
  'The tools that existed were either too complex to set up, too expensive to justify, or simply not built for the real-world chaos of running a clinic. So we built our own. STOAIX was born from a real problem, for real businesses — not from a whiteboard in a conference room.': 'Mevcut araçlar ya kurması çok karmaşıktı, ya haklı çıkaramayacak kadar pahalıydı, ya da bir kliniği yönetmenin gerçek dünya kaosuna göre inşa edilmemişti. Bu yüzden kendimizinkini inşa ettik. STOAIX, bir konferans odasındaki beyaz tahtadan değil, gerçek bir sorundan, gerçek işletmeler için doğdu.',
  'Today, STOAIX serves businesses across 12+ countries. We\'re still a small team, still obsessively close to our customers, and still building the product we wished had existed from day one.': 'Bugün STOAIX, 12\'den fazla ülkedeki işletmelere hizmet veriyor. Hâlâ küçük bir ekibiz, hâlâ müşterilerimize saplantılı derecede yakınız ve hâlâ ilk günden beri var olmasını dilediğimiz ürünü inşa ediyoruz.',
  'Ata Ulufer': 'Ata Ulufer',
  'Co-founder & CEO': 'Kurucu Ortak & CEO',
  'Co-founder & CTO': 'Kurucu Ortak & CTO',
  'What drives us': 'Bizi harekete geçiren ne',
  'Our Mission': 'Misyonumuz',
  'Make every clinic, agency, and business respond instantly — in any language, at any hour. Speed shouldn\'t be a luxury reserved for companies with large support teams. With STOAIX, it\'s the starting point.': 'Her kliniğin, ajansın ve işletmenin anında yanıt vermesini sağlamak — her dilde, her saatte. Hız, büyük destek ekiplerine sahip şirketler için bir lüks olmamalı. STOAIX ile bu, başlangıç noktasıdır.',
  'Our Vision': 'Vizyonumuz',
  'A world where no business loses a customer simply because they couldn\'t respond fast enough. AI shouldn\'t replace human connection — it should protect the moments that matter most.': 'Hiçbir işletmenin yalnızca yeterince hızlı yanıt veremediği için müşteri kaybetmediği bir dünya. AI insan bağlantısının yerini almamalı — en önemli anları korumalı.',
  'How we work': 'Nasıl çalışırız',
  'Speed over perfection': 'Mükemmellik yerine hız',
  'Every hour a business goes without a response is a lead that\'s cooling. We ship fast, iterate faster, and never let the perfect be the enemy of the live.': 'Bir işletmenin yanıtsız geçirdiği her saat, soğuyan bir lead demektir. Hızlı ship eder, daha hızlı iterasyon yapar, mükemmelin canlıya düşman olmasına asla izin vermeyiz.',
  'Radical simplicity': 'Radikal sadelik',
  'If a clinic owner can\'t set it up in 5 minutes, it\'s too complicated. We remove every unnecessary step, every configuration screen, every excuse not to start.': 'Bir klinik sahibi 5 dakikada kuramazsa, çok karmaşıktır. Her gereksiz adımı, her yapılandırma ekranını, başlamamak için her bahaneyi kaldırırız.',
  'Global from day one': 'İlk günden global',
  'Our customers operate in Istanbul, London, Dubai, and Toronto. We build for multilingual, multicultural, multi-timezone — by default.': 'Müşterilerimiz İstanbul\'da, Londra\'da, Dubai\'de ve Toronto\'da faaliyet gösteriyor. Çok dilli, çok kültürlü, çok zaman dilimli için — varsayılan olarak inşa ediyoruz.',
  'Countries served': 'Hizmet verilen ülke',
  'Languages supported': 'Desteklenen dil',
  'Average first response': 'Ortalama ilk yanıt',
  'Always on, never off': 'Her zaman açık, hiç kapalı değil',
  'Ready to stop missing leads?': 'Lead kaçırmayı durdurmaya hazır mısınız?',
  'Set up your AI receptionist in under 5 minutes. No contracts, no credit card, no meetings.': '5 dakikadan kısa sürede AI resepsiyonistinizi kurun. Sözleşme yok, kredi kartı yok, toplantı yok.',
  'Talk to us': 'Bize Ulaşın',
  'About Us': 'Hakkımızda',
});

/* ─── Login page ─────────────────────────────────────────── */
const TR_LOGIN = Object.assign({}, TR_COMMON, {
  'Log In — STOAIX': 'Giriş Yap — STOAIX',
  'Don\'t have an account?': 'Hesabınız yok mu?',
  'Start free trial': 'Ücretsiz deneyin',
  'Welcome back': 'Tekrar hoş geldiniz',
  'Log in to your STOAIX dashboard': 'STOAIX panelinize giriş yapın',
  'Work email': 'İş e-postası',
  'Password': 'Şifre',
  'Remember me': 'Beni hatırla',
  'Forgot password?': 'Şifremi unuttum?',
  'Log in': 'Giriş Yap',
  'or continue with': 'veya şununla devam et',
  'Continue with Google': 'Google ile devam et',
  'New to STOAIX?': 'STOAIX\'e yeni misiniz?',
  'Start your 3-day free trial': '3 günlük ücretsiz denemenizi başlatın',
});

/* ─── Signup page ────────────────────────────────────────── */
const TR_SIGNUP = Object.assign({}, TR_COMMON, {
  'Start Free Trial — STOAIX': 'Ücretsiz Denemeye Başlayın — STOAIX',
  'Already have an account?': 'Zaten hesabınız var mı?',
  '3-day free trial — no credit card required': '3 günlük ücretsiz deneme — kredi kartı gerekmez',
  'Your AI receptionist,': 'AI resepsiyonistiniz,',
  'live in 5 minutes.': '5 dakikada canlı.',
  'Set up your AI voice assistant and chatbot yourself — no meetings, no developers, no waiting.': 'AI sesli asistanınızı ve chatbotunuzu kendiniz kurun — toplantı yok, geliştirici yok, bekleme yok.',
  'Answers calls and messages 24/7 in 15+ languages': '15+ dilde 7/24 arama ve mesajları yanıtlar',
  'WhatsApp, Voice AI, web chat — all from one dashboard': 'WhatsApp, Sesli AI, web chat — hepsi tek panelden',
  'CRM, lead scoring and automatic follow-up included': 'CRM, lead puanlama ve otomatik takip dahil',
  'No contracts — cancel anytime': 'Sözleşme yok — istediğiniz zaman iptal edin',
  '$0 setup fee — live in under 5 minutes': '$0 kurulum ücreti — 5 dakikadan kısa sürede yayında',
  'Create your account': 'Hesabınızı oluşturun',
  'Start your 3-day free trial today': 'Bugün 3 günlük ücretsiz denemenizi başlatın',
  'First name': 'Ad',
  'Last name': 'Soyad',
  'Work email': 'İş e-postası',
  'Company / Business name': 'Şirket / İşletme adı',
  'Password': 'Şifre',
  'Choose your plan': 'Planınızı seçin',
  'Most popular': 'En Popüler',
  'I agree to the': 'Kabul ediyorum:',
  'Terms of Service': 'Kullanım Koşulları',
  'and': 've',
  'Privacy Policy': 'Gizlilik Politikası',
  'Continue to payment': 'Ödemeye geç',
  '3-day free trial.': '3 günlük ücretsiz deneme.',
  'No charge until your trial ends. Cancel anytime.': 'Deneme süreniz dolana kadar ücret alınmaz. İstediğiniz zaman iptal edin.',
  'Already have an account?': 'Zaten hesabınız var mı?',
  'Log in': 'Giriş yap',
});

/* ─── Checkout page ──────────────────────────────────────── */
const TR_CHECKOUT = Object.assign({}, TR_COMMON, {
  /* page title */
  'Start Your Trial — STOAIX': 'Denemenizi Başlatın — STOAIX',
  /* nav */
  'Secure checkout · SSL encrypted': 'Güvenli ödeme · SSL şifreli',
  /* payment form */
  'Payment details': 'Ödeme bilgileri',
  'No payment today': 'Bugün ödeme alınmaz',
  'Your 3-day free trial starts now. We won\'t charge you until your trial ends. Cancel anytime — no questions asked.': '3 günlük ücretsiz denemeniz şimdi başlıyor. Deneme süreniz dolmadan ödeme almıyoruz. İstediğiniz zaman iptal edin — soru sorulmaz.',
  'Card number': 'Kart numarası',
  'Expiry date': 'Son kullanma tarihi',
  'Start my free trial': 'Ücretsiz denemeyi başlat',
  /* order summary */
  'Order summary': 'Sipariş özeti',
  'Most popular': 'En Popüler',
  'Most Popular': 'En Popüler',
  'Most Valuable': 'En Değerlisi',
  'Billed monthly after 3-day trial': '3 günlük deneme sonrası aylık faturalandırılır',
  '3-day trial discount': '3 günlük deneme indirimi',
  'Setup fee': 'Kurulum ücreti',
  'FREE': 'ÜCRETSİZ',
  'Due today': 'Bugün ödenecek',
  'Charged after trial ends': 'Deneme bitiminde tahsil edilir',
  'Cancel before trial ends — no charge': 'Deneme bitmeden iptal et — ücret yok',
  '← Change plan': '← Planı değiştir',
  'Change': 'Değiştir',
  /* reactivation add-on */
  '+$29.99 one-time': '+$29.99 tek seferlik',
  /* upsell cards */
  'Add-on': 'Eklenti',
  'Weekly 1:1 · 4 sessions/month · Priority support': 'Haftalık 1:1 · Ayda 4 seans · Öncelikli destek',
  '5,000 contacts · WhatsApp campaign · One-time': '5.000 kişi · WhatsApp kampanyası · Tek seferlik',
  'Guided 1:1 platform setup · One-time': 'Rehberli 1:1 platform kurulumu · Tek seferlik',
  'Included — FREE': 'Dahil — ÜCRETSİZ',
  /* static feature list (fallback for non-JS render) */
  'Voice AI — inbound + outbound': 'Sesli AI — gelen + giden',
  'WhatsApp & web chat': 'WhatsApp ve web chat',
  '750 minutes / month included': 'Ayda 750 dakika dahil',
  '15+ languages · CRM · Lead scoring': '15+ dil · CRM · Lead puanlama',
  /* promo code */
  'Promo code': 'Promo kodu',
  'Enter promo code': 'Promo kodunu girin',
  'Apply': 'Uygula',
  'Promo discount (10%)': 'Promo indirimi (%10)',
  'Promo code applied!': 'Promo kodu uygulandı!',
  '(optional)': '(isteğe bağlı)',
});

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
  };

  const dict = DICT_MAP[path] || null;

  const urlLocale = (function () {
    const seg = window.location.pathname.split('/').filter(Boolean)[0];
    return (seg === 'en' || seg === 'tr') ? seg : null;
  })();
  const activeLang = urlLocale || localStorage.getItem('stoaix-lang') || 'tr';

  function handleToggle(targetLang) {
    const dest = '/' + targetLang + (path === '/' ? '' : path);
    window.location.href = dest;
  }

  function applyTranslation() {
    if (activeLang !== 'tr') return;
    /* Use page-specific dict if available, fall back to TR_COMMON for shared nav/footer */
    const activeDict = dict || TR_COMMON;
    translateTree(document.body, activeDict);
    /* Also translate <title> */
    const t = norm(document.title);
    if (activeDict[t]) document.title = activeDict[t];
  }

  /* Run as early as possible to avoid flash */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectToggle(activeLang, handleToggle);
      applyTranslation();
    });
  } else {
    injectToggle(activeLang, handleToggle);
    applyTranslation();
  }
})();
