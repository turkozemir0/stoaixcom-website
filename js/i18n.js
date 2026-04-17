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
  return window.location.pathname
    .replace(/\.html$/, '').replace(/\/+$/, '') || '/';
}

/* ─── Language toggle button ─────────────────────────────── */
function injectToggle(activeLang, onToggle) {
  const nav = document.querySelector('.nav-actions');
  if (!nav || document.querySelector('.lang-toggle')) return;

  const w = document.createElement('div');
  w.className = 'lang-toggle';
  w.innerHTML =
    '<button class="lang-btn' + (activeLang === 'en' ? ' lang-active' : '') + '" data-lang="en">EN</button>' +
    '<span class="lang-sep">|</span>' +
    '<button class="lang-btn' + (activeLang === 'tr' ? ' lang-active' : '') + '" data-lang="tr">TR</button>';

  nav.insertBefore(w, nav.firstChild);

  w.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.lang !== activeLang) onToggle(btn.dataset.lang);
    });
  });
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
  'Start free trial': 'Ücretsiz deneyin',
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
  'Annual': 'Yıllık',
  'Save 20%': '%20 Tasarruf Et',
  'Most popular': 'En Popüler',
  'Company': 'Şirket',
  'Legal': 'Yasal',
};

/* ─── Index page ─────────────────────────────────────────── */
const TR_INDEX = Object.assign({}, TR_COMMON, {
  'STOAIX — AI Voice & Chat Platform for Any Business': 'STOAIX — Her İşletme İçin AI Ses ve Chat Platformu',
  '7-day free trial · No credit card required': '7 günlük ücretsiz deneme · Kredi kartı gerekmez',
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
  'Try STOAIX live — ask it anything, book an appointment, hear the voice. No signup required.': 'STOAIX\'i canlı deneyin — her şeyi sorun, randevu alın, sesi dinleyin. Kayıt gerekmez.',
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
  'WhatsApp & web chat to get started': 'Başlamak için WhatsApp ve web chat',
  'Add Voice AI to your channels': 'Kanallarınıza Sesli AI ekleyin',
  'Full system. Outbound included.': 'Eksiksiz sistem. Outbound dahil.',
  'Manage multiple clients from one dashboard': 'Tüm müşterilerinizi tek panelden yönetin',
  /* --- New pricing feature items --- */
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
  'Advanced analytics': 'Gelişmiş analitik',
  'Outbound webhook': 'Outbound webhook',
  'Team members — 1': 'Ekip üyesi — 1',
  'Team members — 3': 'Ekip üyesi — 3',
  'Team members — 10': 'Ekip üyesi — 10',
  'Team members — Unlimited': 'Ekip üyesi — Sınırsız',
  /* --- Legacy pricing strings (kept for compatibility) --- */
  'Voice AI usage: $0.15/min after plan limit · ': 'Sesli AI kullanımı: Plan limitinden sonra $0,15/dk · ',
  'All plans: 7-day free trial, no credit card · ': 'Tüm planlarda: 7 günlük ücretsiz deneme, kredi kartı gerekmez · ',
  'Annual billing saves 20%': 'Yıllık ödemede %20 tasarruf',
  'Partners & White Label': 'Partnerler ve Beyaz Etiket',
  'Build your own': 'Kendi',
  'AI business.': 'AI işletmenizi kurun.',
  'Sell STOAIX under your own brand. White-label our platform, set your own prices, keep the margin. Perfect for agencies, consultants, and resellers worldwide.': 'STOAIX\'i kendi markanız altında satın. Platformumuzu beyaz etiketleyin, kendi fiyatlarınızı belirleyin, kârı cebinize koyun. Ajanslar, danışmanlar ve dünya genelindeki bayiler için biçilmiş kaftan.',
  'Your brand, zero dev cost': 'Markanız, sıfır geliştirme maliyeti',
  'Custom domain, logo, agent name — STOAIX invisible': 'Özel domain, logo, ajan adı — STOAIX arka planda kalır',
  '~40% margin per client': 'Müşteri başına ~%40 kâr marjı',
  '10 Advanced clients = ~$1,200/mo recurring profit': '10 Advanced müşteri = aylık ~1.200$ tekrarlayan kâr',
  'Sell globally': 'Globale satın',
  'No geography limits. Any sector. Any language.': 'Coğrafi sınır yok. Her sektör. Her dil.',
  'Become a partner': 'Partner Olun',
  'Example: 10 Advanced clients': 'Örnek: 10 Advanced müşteri',
  'STOAIX wholesale (10 × $149)': 'STOAIX toptan fiyatı (10 × $149)',
  'Your platform fee': 'Platform ücretiniz',
  'Your revenue (10 × $299)': 'Geliriniz (10 × $299)',
  'Net profit': 'Net kâr',
  '+ Activation fee: $1,497 one-time': '+ Aktivasyon ücreti: tek seferlik $1.497',
  'Your AI receptionist is': 'AI resepsiyonistiniz',
  'one signup away.': 'bir kayıt kadar uzağınızda.',
  '7-day free trial. No credit card. Set up in minutes.': '7 günlük ücretsiz deneme. Kredi kartı gerekmez. Dakikalar içinde kurulum.',
  'Start your free trial': 'Ücretsiz Denemeyi Başlatın',
  'Talk to sales': 'Satış Ekibiyle Konuşun',
  'No contracts · Cancel anytime · 10-day free trial': 'Sözleşme yok · İstediğiniz zaman iptal edin · 10 günlük ücretsiz deneme',
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
  /* --- Enterprise plan --- */
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
  'Turkish, English, and Arabic are included in the Advanced plan. Additional languages are available as add-ons: Russian, German, French, Spanish, and more.': 'Türkçe, İngilizce ve Arapça Advanced planına dahildir. Ek diller eklenti olarak mevcuttur: Rusça, Almanca, Fransızca, İspanyolca ve daha fazlası.',
  'Start with all three languages': 'Üç dille hemen başlayın',
  'Your patients speak many languages. STOAIX speaks them all.': 'Hastalarınız birçok dil konuşuyor. STOAIX hepsini konuşuyor.',
  // Getting Started section
  'Getting started': 'Başlarken',
  'Live in under 5 minutes': '5 dakikadan kısa sürede yayında',
  'Fully self-serve. No meetings with our team. The guided setup walks you through every step.': 'Tamamen self-servis. Ekibimizle toplantı yok. Rehberli kurulum her adımda size yol gösterir.',
  'Go live': 'Yayına alın',
  'Setup fee': 'Kurulum ücreti',
  // Feature card body texts
  'Turkish, English, and Arabic included. The AI detects the patient\'s language and continues natively — no configuration, no translator required.': 'Türkçe, İngilizce ve Arapça dahildir. AI, hastanın dilini otomatik olarak algılar ve doğal şekilde konuşmayı sürdürür — yapılandırma gerekmez, tercüman gerekmez.',
  'Connect to your existing calendar, booking system, or CRM. Triggers on new lead, booking confirmed, or handoff ready — no developer needed.': 'Mevcut takviminize, rezervasyon sisteminize veya CRM\'inize bağlanın. Yeni lead, rezervasyon onayı veya devir hazır tetikleyicileri — geliştirici gerekmez.',
  // FAQ section
  'Common questions': 'Sık Sorulan Sorular',
  'How long does setup actually take?': 'Kurulum gerçekte ne kadar sürer?',
  'Under 5 minutes for a basic configuration. The guided setup wizard walks you through adding your procedures, FAQs, intake questions, and connecting your phone number. You don\'t need to talk to us, read documentation, or wait for anything to be approved. If you want us to handle the setup for you, the Onboarding Add-on ($297 one-time) includes a 60-minute session where we build it together.': 'Temel yapılandırma için 5 dakikanın altında. Rehberli kurulum sihirbazı, prosedürlerinizi, SSS\'lerinizi, kabul sorularınızı ekleme ve telefon numaranızı bağlama konusunda size adım adım yol gösterir. Bizimle konuşmanıza, belge okumanıza veya herhangi bir onay beklemenize gerek yoktur. Kurulumu sizin yerinize yapmamızı istiyorsanız, Onboarding Add-on ($297 tek seferlik) birlikte inşa ettiğimiz 60 dakikalık bir oturumu kapsar.',
  'Does STOAIX replace my reception team?': 'STOAIX resepsiyon ekibimin yerini alır mı?',
  'No — STOAIX handles the repetitive, high-volume layer: answering FAQs, qualifying patients, collecting intake information, and booking consultations. When a patient is serious or has a complex question, the AI immediately transfers to your team with full context already captured. Your staff spends less time on routine calls and more time on closing consultations.': 'Hayır — STOAIX tekrarlayan, yüksek hacimli katmanı yönetir: SSS\'leri yanıtlama, hastaları nitelendirme, kabul bilgilerini toplama ve konsültasyon rezervasyonu yapma. Bir hasta ciddiyse veya karmaşık bir sorusu varsa, AI halihazırda yakalanan tam bağlamla ekibinize hemen devreder. Personeliniz rutin aramalara daha az, konsültasyonları kapatmaya daha fazla zaman ayırır.',
  'Does it work for international patients who don\'t speak Turkish?': 'Türkçe bilmeyen uluslararası hastalar için de çalışır mı?',
  'Yes. On the Advanced plan, STOAIX includes Turkish, English, and Arabic out of the box. The AI detects the patient\'s language from the first message or spoken word and continues the conversation natively — no configuration required, no extra cost per language. For UK and Gulf patients especially, responding immediately in their language at any hour is the single biggest conversion driver we see across clinics.': 'Evet. Advanced planında STOAIX, Türkçe, İngilizce ve Arapçayı hazır olarak içerir. AI, hastanın dilini ilk mesajdan veya söylenen kelimeden algılar ve konuşmayı doğal olarak sürdürür — yapılandırma gerekmez, dil başına ekstra maliyet yoktur. Özellikle İngiltere ve Körfez hastaları için, herhangi bir saatte dillerinde hemen yanıt vermek, klinikler genelinde gördüğümüz en büyük dönüşüm faktörüdür.',
  'We already use GHL or another CRM. Does STOAIX integrate?': 'Zaten GHL veya başka bir CRM kullanıyoruz. STOAIX entegre olur mu?',
  'Yes. The Advanced plan includes Zapier, Make, and direct webhook support, which covers GoHighLevel, HubSpot, Calendly, Google Calendar, and hundreds of other tools. You don\'t need to change your existing workflow — STOAIX triggers events into it. For custom CRM integrations, contact us for a one-time setup.': 'Evet. Advanced plan, GoHighLevel, HubSpot, Calendly, Google Calendar ve yüzlerce diğer aracı kapsayan Zapier, Make ve doğrudan webhook desteğini içerir. Mevcut iş akışınızı değiştirmenize gerek yoktur — STOAIX olayları içine tetikler. Özel CRM entegrasyonları için tek seferlik kurulum için bize ulaşın.',
  'Is there a minimum commitment or long-term contract?': 'Minimum taahhüt veya uzun vadeli sözleşme var mı?',
  'No. STOAIX is month-to-month — cancel anytime from your dashboard, no questions asked. Annual billing saves 20% if you\'d like to lock that in. The 10-day free trial lets you test the full product before you pay anything. No credit card is required to start.': 'Hayır. STOAIX aylık bazlıdır — dashboard\'unuzdan istediğiniz zaman iptal edin, soru sorulmaz. Yıllık faturalama, bunu kilitlemek istiyorsanız %20 tasarruf sağlar. 10 günlük ücretsiz deneme, herhangi bir şey ödemeden önce tam ürünü test etmenize olanak tanır. Başlamak için kredi kartı gerekmez.',
  'My clinic group has multiple locations. Which plan do I need?': 'Klinik grubumun birden fazla lokasyonu var. Hangi plana ihtiyacım var?',
  'The Agency plan ($499/mo) supports multi-location management from a single dashboard. Each location gets its own configured AI agent, phone number, and knowledge base, while you manage everything from one place. This plan also includes white-label customisation if you want to remove STOAIX branding.': 'Agency planı (ayda $499), tek bir dashboard\'dan çok lokasyon yönetimini destekler. Her lokasyon, siz her şeyi tek bir yerden yönetirken kendi yapılandırılmış AI ajanını, telefon numarasını ve bilgi tabanını alır. Bu plan ayrıca STOAIX markasını kaldırmak istiyorsanız beyaz etiket özelleştirmesini de içerir.',
  // CTA section
  '10-day free trial · No credit card required': '10 günlük ücretsiz deneme · Kredi kartı gerekmez',
  'Stop losing patients': 'Cevapsız aramalara',
  'to missed calls.': 'hasta kaybetmeyi bırakın.',
  'Set up your AI receptionist in minutes. See it answer calls, qualify patients, and book consultations — before you pay a single dollar.': 'AI resepsiyonistinizi dakikalar içinde kurun. Tek bir dolar ödemeden önce aramaları yanıtlarken, hastaları nitelerken ve konsültasyonları rezerve ederken izleyin.',
  'Compare all plans': 'Tüm Planları Karşılaştır',
  '10 days free · No credit card · Cancel anytime': '10 gün ücretsiz · Kredi kartı yok · İstediğiniz zaman iptal edin',
  'Start 10-day free trial': '10 günlük ücretsiz denemeye başlayın',
  'See pricing': 'Fiyatları İnceleyin',
  'No credit card required · Cancel anytime · Setup in minutes': 'Kredi kartı gerekmez · İstediğiniz zaman iptal edin · Dakikalar içinde kurulum',
  'Always answers': 'Her zaman yanıtlar',
  'Languages (TR / EN / AR)': 'Diller (TR / EN / AR)',
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
  'Try it free for 10 days': '10 gün ücretsiz deneyin',
  'Patient qualified — consultation booked for Tuesday 14:00': 'Hasta nitelendi — Salı 14:00\'de konsültasyon rezervasyonu yapıldı',
  'Features': 'Özellikler',
  'Everything a clinic needs. Nothing it doesn\'t.': 'Bir kliniğin ihtiyacı olan her şey. İhtiyacı olmayan hiçbir şey.',
  'Voice, chat, CRM, and follow-up — in one self-serve platform. No separate tools. No integrations to stitch together.': 'Ses, chat, CRM ve takip — tek bir self-servis platformda. Ayrı araç yok. Entegrasyon derdi yok.',
  'Voice AI — Inbound (Plus+)': 'Sesli AI — Gelen (Plus+)',
  'Every incoming call answered within 2 seconds, 24/7. No voicemail, no hold music. Patients get answers; your team gets qualified leads.': 'Her gelen arama 2 saniye içinde yanıtlanır, 7/24. Sesli mesaj yok, bekleme müziği yok. Hastalar yanıt alır; ekibiniz nitelikli lead\'ler alır.',
  'Voice AI — Outbound (Advanced)': 'Sesli AI — Giden (Advanced)',
  'Automatically calls leads who went cold, confirms upcoming appointments, and re-engages past enquiries. Converts "I\'ll think about it" into booked slots.': 'Soğuyan lead\'leri otomatik olarak arar, yaklaşan randevuları onaylar ve geçmiş sorgulamaları yeniden devreye sokar. "Düşüneceğim"i rezervasyonlu slotlara dönüştürür.',
  'WhatsApp AI Chatbot (Lite+)': 'WhatsApp AI Chatbot (Lite+)',
  'Answers patient questions on WhatsApp 24/7 using your clinic\'s knowledge base. Price enquiries, procedure info, availability — handled automatically.': 'Kliniğinizin bilgi tabanını kullanarak WhatsApp\'ta 7/24 hasta sorularını yanıtlar. Fiyat sorgulamaları, prosedür bilgisi, müsaitlik — otomatik olarak yönetilir.',
  '3 Languages Built-in (Advanced)': '3 Dil Dahili (Advanced)',
  'Zapier, Make & Webhook (Advanced)': 'Zapier, Make & Webhook (Advanced)',
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
  'Start your 10-day free trial. No credit card required.': '10 günlük ücretsiz denemenizi başlatın. Kredi kartı gerekmez.',
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
  'Start your 10-day free trial': '10 günlük ücretsiz denemenizi başlatın',
});

/* ─── Signup page ────────────────────────────────────────── */
const TR_SIGNUP = Object.assign({}, TR_COMMON, {
  'Start Free Trial — STOAIX': 'Ücretsiz Denemeye Başlayın — STOAIX',
  'Already have an account?': 'Zaten hesabınız var mı?',
  '10-day free trial — no credit card required': '10 günlük ücretsiz deneme — kredi kartı gerekmez',
  'Your AI receptionist,': 'AI resepsiyonistiniz,',
  'live in 5 minutes.': '5 dakikada canlı.',
  'Set up your AI voice assistant and chatbot yourself — no meetings, no developers, no waiting.': 'AI sesli asistanınızı ve chatbotunuzu kendiniz kurun — toplantı yok, geliştirici yok, bekleme yok.',
  'Answers calls and messages 24/7 in 15+ languages': '15+ dilde 7/24 arama ve mesajları yanıtlar',
  'WhatsApp, Voice AI, web chat — all from one dashboard': 'WhatsApp, Sesli AI, web chat — hepsi tek panelden',
  'CRM, lead scoring and automatic follow-up included': 'CRM, lead puanlama ve otomatik takip dahil',
  'No contracts — cancel anytime': 'Sözleşme yok — istediğiniz zaman iptal edin',
  '$0 setup fee — live in under 5 minutes': '$0 kurulum ücreti — 5 dakikadan kısa sürede yayında',
  'Create your account': 'Hesabınızı oluşturun',
  'Start your 10-day free trial today': 'Bugün 10 günlük ücretsiz denemenizi başlatın',
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
  '10-day free trial.': '10 günlük ücretsiz deneme.',
  'No charge until your trial ends. Cancel anytime.': 'Deneme süreniz dolana kadar ücret alınmaz. İstediğiniz zaman iptal edin.',
  'Already have an account?': 'Zaten hesabınız var mı?',
  'Log in': 'Giriş yap',
});

/* ─── Checkout page ──────────────────────────────────────── */
const TR_CHECKOUT = Object.assign({}, TR_COMMON, {
  'Start Your Trial — STOAIX': 'Denemenizi Başlatın — STOAIX',
  'Secure checkout · SSL encrypted': 'Güvenli ödeme · SSL şifreli',
  'Payment details': 'Ödeme bilgileri',
  'You won\'t be charged today': 'Bugün ücret alınmayacak',
  'Your 10-day free trial starts now. We\'ll only charge you after your trial ends. Cancel any time before then — no questions asked.': '10 günlük ücretsiz denemeniz şimdi başlıyor. Yalnızca deneme süreniz bittikten sonra ücret alacağız. O zamana kadar istediğiniz zaman iptal edin — soru sorulmaz.',
  'Name on card': 'Kart üzerindeki isim',
  'Card number': 'Kart numarası',
  'Expiry date': 'Son kullanma tarihi',
  'Billing address': 'Fatura adresi',
  'Country': 'Ülke',
  'Select country': 'Ülke seçin',
  'Postal / ZIP code': 'Posta kodu',
  'Start my free trial': 'Ücretsiz denemememi başlat',
  'By starting your trial you agree to our': 'Denemenizi başlatarak kabul etmiş olursunuz:',
  'Subscription auto-renews after trial. Cancel anytime.': 'Abonelik deneme sonrası otomatik yenilenir. İstediğiniz zaman iptal edin.',
  'Order summary': 'Sipariş özeti',
  'Most popular': 'En Popüler',
  'Billed monthly after 10-day trial': '10 günlük deneme sonrası aylık faturalandırılır',
  'Trial discount (10 days)': 'Deneme indirimi (10 gün)',
  'Setup fee': 'Kurulum ücreti',
  'FREE': 'ÜCRETSİZ',
  'Due today': 'Bugün ödenecek',
  'Charged after trial ends': 'Deneme bitiminde tahsil edilir',
  'Cancel before trial ends — no charge': 'Deneme bitmeden iptal et — ücret yok',
  'Change plan': 'Planı değiştir',
  'Voice AI — inbound + outbound': 'Sesli AI — gelen + giden',
  'WhatsApp & web chat': 'WhatsApp ve web chat',
  '750 minutes / month included': 'Ayda 750 dakika dahil',
  '15+ languages · CRM · Lead scoring': '15+ dil · CRM · Lead puanlama',
  'Zapier / Make / Webhook': 'Zapier / Make / Webhook',
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
  };

  const dict = DICT_MAP[path] || null;
  const storedLang = localStorage.getItem('stoaix-lang') || 'en';

  function handleToggle(targetLang) {
    localStorage.setItem('stoaix-lang', targetLang);
    window.location.reload();
  }

  function applyTranslation() {
    if (storedLang !== 'tr') return;
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
      injectToggle(storedLang, handleToggle);
      applyTranslation();
    });
  } else {
    injectToggle(storedLang, handleToggle);
    applyTranslation();
  }
})();
