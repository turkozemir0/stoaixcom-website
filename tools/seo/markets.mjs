/* ═══════════════════════════════════════════════════════════════════
   STOAIX SEO — pazarlar (TR, EN/UK, AU, DE)
   Her ürün sayfası dört pazarda yayınlanır. Pazar başına değişen her şey
   burada: URL öneki, dil kodları, ortak çerçeve metinleri, yerel mevzuat
   ve klinik yazılımları. Ürün içerikleri tools/seo/products/ altında.

   🔴 Mevzuat metinleri genel bilgidir, hukuki görüş değildir. Sayfalarda
   bu not görünür. Yeni bir kural eklerken resmi kaynağını yorumda belirtin.
   ═══════════════════════════════════════════════════════════════════ */

import { CONTENT } from '../v2-content.mjs';

export const ORIGIN = 'https://stoaix.com';
export const UPDATED = '2026-11-12';

/* Sıra: dil anahtarında görünen sıra. */
export const MARKET_ORDER = ['en', 'au', 'de', 'tr'];

const DE_CHROME = {
  htmlLang: 'de',
  ogLocale: 'de_DE',
  nav: ['Plattform', 'Spezifikation', 'Einführung', 'Governance', 'Einsatzorte'],
  pricing: { nav: 'Preise', href: '/en/pricing' },
  brief: 'Erstgespräch buchen', sales: 'Mit dem Vertrieb sprechen',
  wa: 'Per WhatsApp schreiben',
  ctaHead: 'Bringen Sie Ihre Zahlen mit. Wir sagen Ihnen, wo sie stehen sollten.',
  leaders: [{ n: 'Ata Ulufer', r: 'Mitgründer & CEO' }, { n: 'Emir Türköz', r: 'Mitgründer & CTO' }],
  footerCols: [
    { h: 'Plattform', items: ['KI-Assistenten', 'Wachstum', 'Integrationen', 'Sicherheit'] },
    { h: 'Lösungen', items: [] },
    { h: 'Unternehmen', items: ['Über uns', 'Kontakt'] },
  ],
  copyright: '© 2026 STOAIX Ltd. — London, Vereinigtes Königreich',
  skip: 'Zum Inhalt springen', menu: 'Menü', close: 'Schließen',
  themeLabel: 'Darstellung', langLabel: 'Sprache', dark: 'Dunkel', light: 'Hell',
};

export const MARKETS = {
  en: {
    key: 'en', lang: 'en', prefix: '/en', hreflang: 'en', ogLocale: 'en_GB',
    home: '/en', anchorBase: '/en', pricing: '/en/pricing', contact: '/en/contact',
    country: 'United Kingdom', areaServed: ['GB', 'IE'], label: 'EN',
    chrome: CONTENT.en,
  },
  au: {
    key: 'au', lang: 'en', prefix: '/en-au', hreflang: 'en-AU', ogLocale: 'en_AU',
    home: '/en-au/ai-assistants', anchorBase: '/en', pricing: '/en/pricing', contact: '/en/contact',
    country: 'Australia', areaServed: ['AU', 'NZ'], label: 'AU',
    chrome: { ...CONTENT.en, ogLocale: 'en_AU', htmlLang: 'en-AU' },
  },
  de: {
    key: 'de', lang: 'de', prefix: '/de', hreflang: 'de', ogLocale: 'de_DE',
    home: '/de/ki-assistenten', anchorBase: '/en', pricing: '/en/pricing', contact: '/en/contact',
    country: 'Deutschland', areaServed: ['DE', 'AT', 'CH'], label: 'DE',
    chrome: DE_CHROME,
  },
  tr: {
    key: 'tr', lang: 'tr', prefix: '', hreflang: 'tr', ogLocale: 'tr_TR',
    home: '/', anchorBase: '/', pricing: '/pricing', contact: '/contact',
    country: 'Türkiye', areaServed: ['TR'], label: 'TR',
    chrome: CONTENT.tr,
  },
};

/* Sayfa iskeletindeki sabit metinler — dil başına (AU, EN'i kullanır). */
export const UI = {
  en: {
    home: 'Home', hub: 'AI assistants', all: 'All assistants', updated: 'Last updated', facts: 'At a glance',
    price: 'Price', fromPrice: (v) => `from ${v}`, perMonth: '/mo', monthly: 'Monthly', annual: 'Annual plan',
    option: 'Option', included: 'Included each month', overage: 'Above the included amount',
    written: 'Written', voice: 'Voice', mix: 'Multichannel', messages: 'messages', minutes: 'minutes',
    perMessage: '/ message', perMinute: '/ min',
    trio: (t, v) => `Take the AI receptionist, follow-up and appointment assistants together and save $${t}/mo on written or $${v}/mo on voice.`,
    priceNote: 'Prices in US dollars, excluding VAT/GST. Monthly plans have no commitment; the annual plan is 20% cheaper. 30-day money-back guarantee against success criteria agreed at setup.',
    adBudget: 'Ad spend is not included; you pay Meta and Google directly.',
    howH: 'How it works', useH: 'Where clinics use it', faqH: 'Frequently asked questions',
    relatedH: 'Other STOAIX assistants', localH: 'Rules and systems', legal: 'General information, not legal advice. Check your own obligations with your adviser or regulator.',
    pricingLink: 'Full pricing →', brief: 'Book an intro call', allPrices: 'See all prices',
    crumbs: 'Breadcrumb', freeCrm: 'Included free with every assistant',
  },
  de: {
    home: 'Start', hub: 'KI-Assistenten', all: 'Alle Assistenten', updated: 'Zuletzt aktualisiert', facts: 'Auf einen Blick',
    price: 'Preis', fromPrice: (v) => `ab ${v}`, perMonth: '/Monat', monthly: 'Monatlich', annual: 'Jahresvertrag',
    option: 'Variante', included: 'Monatlich inklusive', overage: 'Über dem Inklusivvolumen',
    written: 'Text', voice: 'Telefon', mix: 'Mehrkanal', messages: 'Nachrichten', minutes: 'Minuten',
    perMessage: '/ Nachricht', perMinute: '/ Min.',
    trio: (t, v) => `KI-Rezeption, Nachfass- und Termin-Assistent zusammen: $${t}/Monat günstiger in Text, $${v}/Monat am Telefon.`,
    priceNote: 'Preise in US-Dollar, zzgl. USt. Monatlich ohne Mindestlaufzeit, Jahresvertrag 20 % günstiger. 30 Tage Geld-zurück-Garantie auf die beim Start vereinbarten Erfolgskriterien.',
    adBudget: 'Das Werbebudget ist nicht enthalten; Sie zahlen Meta und Google direkt.',
    howH: 'So funktioniert es', useH: 'Wo Praxen es einsetzen', faqH: 'Häufige Fragen',
    relatedH: 'Weitere STOAIX-Assistenten', localH: 'Regeln und Systeme in Deutschland', legal: 'Allgemeine Information, keine Rechtsberatung. Prüfen Sie Ihre Pflichten mit Ihrer Kammer, Ihrem Datenschutzbeauftragten oder Ihrer Kanzlei.',
    pricingLink: 'Alle Preise →', brief: 'Erstgespräch buchen', allPrices: 'Alle Preise ansehen',
    crumbs: 'Brotkrumen', freeCrm: 'Bei jedem Assistenten kostenlos enthalten',
  },
  tr: {
    home: 'Ana sayfa', hub: 'Yapay zekâ asistanları', all: 'Tüm asistanlar', updated: 'Son güncelleme', facts: 'Kısaca',
    price: 'Fiyat', fromPrice: (v) => `${v}’dan başlayan`, perMonth: '/ay', monthly: 'Aylık', annual: 'Yıllık anlaşma',
    option: 'Seçenek', included: 'Her ay dahil', overage: 'Dahil kullanımın üstü',
    written: 'Yazılı', voice: 'Sesli', mix: 'Çok kanallı', messages: 'mesaj', minutes: 'dakika',
    perMessage: '/ mesaj', perMinute: '/ dk',
    trio: (t, v) => `Resepsiyonist, Takip Uzmanı ve Randevu Asistanı birlikte alınırsa yazılıda ayda $${t}, seslide ayda $${v} indirim.`,
    priceNote: 'Fiyatlar ABD doları, KDV hariç. Aylık ödemede taahhüt yok; yıllık anlaşma %20 daha ucuz. Kurulumda birlikte yazılan başarı kriterine karşı 30 gün para iade garantisi.',
    adBudget: 'Reklam bütçesi dahil değildir; Meta ve Google’a doğrudan siz ödersiniz.',
    howH: 'Nasıl çalışır', useH: 'Klinikler nerede kullanıyor', faqH: 'Sık sorulan sorular',
    relatedH: 'Diğer STOAIX asistanları', localH: 'Türkiye’de kurallar ve sistemler', legal: 'Genel bilgidir, hukuki görüş değildir. Kendi yükümlülüklerinizi hukuk danışmanınızla kontrol edin.',
    pricingLink: 'Tüm fiyatlar →', brief: 'Tanışma görüşmesi', allPrices: 'Tüm fiyatları görün',
    crumbs: 'Sayfa yolu', freeCrm: 'Her asistanla ücretsiz gelir',
  },
};
export const uiFor = (m) => UI[MARKETS[m].lang];

/* ─── Yerel kurallar ────────────────────────────────────────────────
   Ürün dosyası `rules: ['data', 'ai', …]` ile hangilerini göstereceğini
   seçer. Konu anahtarları:
     data       sağlık verisi ve veri işleme sözleşmesi
     ai         yapay zekâ ile konuştuğunu söyleme
     recording  arama kaydı
     marketing  pazarlama mesajı / arama izni
     reviews    hasta yorumu ve tavsiye yasağı
     ads        sağlık reklamı kuralları
     software   yerel klinik yazılımları                              */
export const RULES = {
  en: {
    data: { t: 'UK GDPR and patient data', d: 'Health data is special category data under UK GDPR and the Data Protection Act 2018. STOAIX works as your processor under a written data processing agreement; your clinic stays the controller and owns every conversation and record.' },
    ai: { t: 'Telling patients they are talking to AI', d: 'The assistant introduces itself as your clinic’s AI assistant at the start of every call and chat, and hands over to a person whenever the patient asks. Being upfront keeps you on the right side of the ICO’s transparency expectations and keeps trust high.' },
    recording: { t: 'Call recording', d: 'If calls are recorded or transcribed, callers are told at the start of the call and your privacy notice explains why. You decide whether recordings are kept and for how long.' },
    marketing: { t: 'PECR and marketing messages', d: 'Service messages about an existing appointment are not marketing. Re-engaging old enquiries by SMS, WhatsApp or email usually is, so it needs consent or a valid soft opt-in, a clear sender and an easy way to opt out. We set up each campaign with those rules built in.' },
    reviews: { t: 'GDC, CQC and the ASA on reviews', d: 'Ask every patient for feedback in the same neutral way, never offer an incentive and never filter who gets the link. Reviews must stay genuine; the CMA treats fake or incentivised reviews as unlawful, and the GDC expects dental professionals’ advertising to be honest and verifiable.' },
    ads: { t: 'Advertising healthcare in the UK', d: 'Clinic ads follow the CAP Code: no misleading claims, no pressure on cosmetic decisions and no ads for prescription-only medicines such as botulinum toxin. Cosmetic interventions cannot be targeted at under-18s.' },
    software: { t: 'Your practice software', d: 'UK clinics commonly run Dentally, Software of Excellence, Pabau, Aesthetic Nurse Software, Semble, Cliniko or a shared Google or Outlook calendar. We connect STOAIX to the calendar or system you already use, and check yours in the intro call before anything goes live.' },
  },
  au: {
    data: { t: 'Privacy Act and health information', d: 'Health information is sensitive information under the Privacy Act 1988 and the Australian Privacy Principles. STOAIX processes it on your behalf under a written agreement; your practice keeps ownership and control of every record.' },
    ai: { t: 'Telling patients they are talking to AI', d: 'The assistant introduces itself as your practice’s AI assistant at the start of every call and chat, and hands over to your team whenever the patient asks. Transparency is expected under APP 1 and APP 5 and keeps patient trust high.' },
    recording: { t: 'Call recording', d: 'Recording rules differ by state and territory, so callers are told at the start of the call when it is recorded or transcribed. You choose whether recordings are kept and for how long.' },
    marketing: { t: 'Spam Act and Do Not Call Register', d: 'Appointment reminders are service messages. Re-engagement campaigns are commercial electronic messages under the Spam Act 2003, so they need consent, a clear sender and a working unsubscribe. Outbound marketing calls also have to respect the Do Not Call Register.' },
    reviews: { t: 'Ahpra and testimonials', d: 'Section 133 of the National Law limits testimonials in advertising for regulated health services. The assistant asks every patient for feedback the same way, offers no incentive and never cherry-picks. Reviews stay on Google; do not republish clinical comments in your own advertising.' },
    ads: { t: 'Advertising regulated health services', d: 'Ads must follow Ahpra’s advertising guidelines and the National Law: no misleading claims, no testimonials about clinical aspects, no offers that encourage unnecessary treatment. Cosmetic surgery advertising has additional guidelines since 2023.' },
    software: { t: 'Your practice software', d: 'Australian practices commonly run Dentally, Dental4Windows, Exact, Core Practice, Cliniko, Halaxy, Zanda, Nookal or a shared calendar. We connect STOAIX to the calendar or system you already use, and check yours in the intro call before anything goes live.' },
  },
  de: {
    data: { t: 'DSGVO und Schweigepflicht', d: 'Gesundheitsdaten sind besondere Kategorien personenbezogener Daten nach Art. 9 DSGVO. STOAIX arbeitet als Auftragsverarbeiter nach Art. 28 DSGVO mit schriftlichem AV-Vertrag; die Praxis bleibt Verantwortliche. Die Verpflichtung auf die Schweigepflicht nach § 203 StGB ist Teil des Vertrags.' },
    ai: { t: 'KI-Kennzeichnung nach EU AI Act', d: 'Seit dem 2. August 2026 verlangt Art. 50 der KI-Verordnung, dass Menschen erfahren, wenn sie mit einer KI sprechen. Der Assistent stellt sich zu Beginn jedes Anrufs und Chats als KI-Assistent Ihrer Praxis vor und übergibt auf Wunsch sofort an Ihr Team.' },
    recording: { t: 'Gesprächsaufzeichnung', d: 'Ohne Einwilligung dürfen Telefonate nicht aufgezeichnet werden (§ 201 StGB). Der Assistent weist zu Beginn darauf hin und fragt nach; Sie entscheiden, ob und wie lange Mitschnitte gespeichert werden.' },
    marketing: { t: 'UWG und Einwilligung', d: 'Terminerinnerungen sind Servicenachrichten. Werbliche Nachrichten per E-Mail, SMS oder WhatsApp brauchen nach § 7 UWG in der Regel eine vorherige ausdrückliche Einwilligung; Werbeanrufe ebenso. Reaktivierungs-Kampagnen richten wir nur an Kontakte mit dokumentierter Einwilligung.' },
    reviews: { t: 'Bewertungen und Heilmittelwerbegesetz', d: 'Bitten Sie alle Patientinnen und Patienten gleich und neutral um eine Bewertung, ohne Gegenleistung und ohne Vorauswahl. Gekaufte oder gefilterte Bewertungen sind nach UWG unzulässig; Patientenstimmen in der eigenen Werbung unterliegen § 11 HWG.' },
    ads: { t: 'Praxiswerbung', d: 'Werbung für Praxen folgt der Berufsordnung, dem HWG und dem UWG: sachlich, nicht irreführend, keine Vorher-Nachher-Bilder bei operativen plastisch-chirurgischen Eingriffen ohne medizinische Notwendigkeit (§ 11 Abs. 1 S. 3 HWG).' },
    software: { t: 'Ihre Praxissoftware', d: 'Deutsche Praxen nutzen häufig Dampsoft, CGM Z1.PRO, charly, evident, medatixx, Doctolib oder einen gemeinsamen Kalender. Wir binden STOAIX an den Kalender oder das System an, das Sie bereits nutzen, und prüfen Ihre Lösung im Erstgespräch, bevor etwas live geht.' },
  },
  tr: {
    data: { t: 'KVKK ve sağlık verisi', d: 'Sağlık verisi KVKK’da özel nitelikli kişisel veridir. STOAIX veri işleyen olarak yazılı veri işleme sözleşmesiyle çalışır; veri sorumlusu kliniğinizdir, her konuşma ve kayıt size aittir.' },
    ai: { t: 'Hastaya yapay zekâ olduğunu söylemek', d: 'Asistan her aramanın ve sohbetin başında kendini kliniğinizin yapay zekâ asistanı olarak tanıtır; hasta istediği anda ekibinize aktarır. Avrupa’dan gelen hastalar için AB Yapay Zekâ Yasası’nın şeffaflık kuralıyla da uyumludur.' },
    recording: { t: 'Arama kaydı', d: 'Arama kaydediliyor ya da yazıya dökülüyorsa hasta aramanın başında bilgilendirilir; aydınlatma metniniz bunu açıklar. Kayıtların saklanıp saklanmayacağına ve süresine siz karar verirsiniz.' },
    marketing: { t: 'İYS ve ticari ileti izni', d: 'Mevcut randevuyla ilgili hatırlatma bilgilendirme mesajıdır. Eski adaylara kampanya ya da tanıtım içerikli mesaj ticari elektronik iletidir; İleti Yönetim Sistemi’nde (İYS) kayıtlı onay gerekir. Kampanyaları yalnızca onayı olan kişilere kurarız.' },
    reviews: { t: 'Sağlıkta tanıtım kuralları ve yorumlar', d: 'Sağlık Hizmetlerinde Tanıtım ve Bilgilendirme Faaliyetleri Hakkında Yönetmelik hasta teşekkürü ve tavsiyesini tanıtımda kullanmayı yasaklar. Asistan herkese aynı nötr soruyu sorar, karşılığında bir şey vaat etmez; yorumlar Google’da kalır, kendi tanıtımınızda kullanılmaz.' },
    ads: { t: 'Sağlıkta reklam yasağı', d: 'Türkiye’de sağlık kuruluşları reklam yapamaz, yalnızca bilgilendirme yapabilir. Fiyat, kampanya, önce-sonra görseli ve talep yaratan ifadeler yaptırım riskidir. Reklam metinlerini bu sınırla, bilgilendirici dille kurarız; yurt dışı hasta kampanyaları hedef ülkenin kurallarına göre ayrıca kurulur.' },
    software: { t: 'Kullandığınız klinik yazılımı', d: 'Türkiye’de klinikler çoğunlukla bir HBYS, diş kliniği yazılımı ya da Google Takvim gibi ortak bir takvim kullanır. STOAIX’i mevcut takviminize ya da sisteminize bağlarız; uyumluluğu yayına almadan önce tanışma görüşmesinde kontrol ederiz.' },
  },
};
