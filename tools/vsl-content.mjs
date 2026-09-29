/* ═══════════════════════════════════════════════════════════════════
   STOAIX Ads — VSL funnel içeriği (TR + EN)

   Tek kaynak. `tools/build-vsl.mjs` bunu okuyup iki statik dosya üretir:
     reklam.html      → stoaix.com/reklam      (TR, varsayılan)
     reklam-en.html   → stoaix.com/en/reklam   (EN)

   🔑 VARSAYILAN TÜRKÇE. Trafik Instagram'dan, Türkiye'den geliyor.
   Kök yol Türkçe; İngilizce sürüm ayrı adreste ve sayfadaki dil
   anahtarı iki adres arasında gidip geliyor (istemci tarafında metin
   değiştirme YOK — dil değişince adres değişiyor, böylece hem FOUC
   olmuyor hem her dilin kendi reklam kampanyası kendi adresine
   gönderilebiliyor).

   ⚠️ ÜRÜN GERÇEĞİ İLE UYUM: Claude Design'ın gönderdiği taslakta
   olmayan iki plan (Starter £150 / Growth £370) vardı. Panelde
   (`stoaix-ads` deposu, app/onboarding/OnboardingIstemci.tsx:156)
   gerçekte yalnız iki plan var: Aylık £150, Yıllık £1.500. Kart
   düzeni taslaktaki gibi korundu, plan adları ve fiyatlar ürüne
   çekildi — yoksa müşteri ödeme ekranında bambaşka bir fiyat görüp
   dönüyordu.
   ═══════════════════════════════════════════════════════════════════ */

/* Sonuç ekran görüntüleri sitede zaten webp olarak duruyor
   (`/assets/stoaix-ads/`). Taslaktaki png yolları buraya çevrildi:
   aynı görseller, ~3 kat küçük dosya. */
const IMG = '/assets/stoaix-ads';

export const COPY = {
  tr: {
    lang: 'tr',
    dir: 'ltr',
    path: '/reklam',
    altPath: '/en/reklam',
    altLabel: 'EN',

    /* ── <head> ─────────────────────────────────────────────── */
    title: 'STOAIX Ads — reklamlarınızı yapay zeka yönetsin',
    desc:
      'Meta reklam hesabınızı bağlayın. Kampanyalarınız günün her saati ölçülür, ' +
      'her sabah anlaşılır bir rapor ve öncelik sıralı aksiyon planı gelir. ' +
      'Onayınız olmadan hiçbir değişiklik yapılmaz. 3 gün £10.',
    ogLocale: 'tr_TR',

    /* ── Üst şerit ──────────────────────────────────────────── */
    navCta: "£10'a dene",

    /* ── Kahraman ───────────────────────────────────────────── */
    eyebrow: "Yapay zeka reklam yöneticisi · Meta'da canlı",
    h1a: 'Ajanslardan bıktınız mı?',
    h1b: 'Reklamlarınızı yapay zeka ',
    h1u: '7/24',
    h1c: ' yönetsin.',
    sub:
      'STOAIX Meta kampanyalarınızı günün her saati analiz eder, olup biteni ' +
      'anlayacağınız dilde anlatır ve siz onayladığınız an düzeltir. Ajans yok. ' +
      'Öğrenme derdi yok.',

    /* ── Video ──────────────────────────────────────────────── */
    videoLbl: '3 dakikalık demoyu izleyin',
    videoUnmute: 'Sesi aç',
    videoAria: 'STOAIX Ads tanıtım videosu',

    /* ── Birincil CTA ───────────────────────────────────────── */
    cta: '3 günlük denemeyi başlat — £10',
    micro: ['1 saatten kısa sürede hazır', 'İstediğin an iptal', 'Reklam hesapların sende kalır'],

    /* ── Puan + yorumlar ────────────────────────────────────── */
    rating: 'Ajanstan geçen işletme sahipleri 4,9/5 puan verdi',
    reviews: [
      {
        q: 'İki yılda üç ajans değiştirdim, her biri öncekinden kötü. STOAIX ilk haftada lead maliyetimizi yarıya indirdi — ve raporları gerçekten anlıyorum.',
        n: 'Selin K.', r: 'Klinik sahibi · İstanbul', i: 'S',
      },
      {
        q: 'Reklam yönetimini kendim öğrenmeye çalıştım. Büyük hata. Şimdi her sabah rapor geliyor, onayla diyorum, işime dönüyorum.',
        n: 'Emre O.', r: 'E-ticaret kurucusu · İzmir', i: 'E',
      },
      {
        q: 'Salı akşamı hesabımı bağladım, çarşamba sabahı ilk aksiyon planı hazırdı. Eski ajansımın bir saatlik ücretinden ucuz.',
        n: 'Pınar M.', r: 'Güzellik salonu · Ankara', i: 'P',
      },
    ],

    /* ── Sonuçlar ───────────────────────────────────────────── */
    resEyebrow: 'Gerçek hesaplar',
    resHead: 'Daha düşük lead maliyeti. Aylar değil, günler içinde.',
    cplRed: 'CPL düşüşü',
    cases: [
      { s: 'Kanser Testi',      meta: 'Meta Ads · 9 gün',   red: '−%69,8', img: `${IMG}/01-cancer-test.webp` },
      { s: 'Clinical Media',    meta: 'Meta Ads · 29 gün',  red: '−%69,1', img: `${IMG}/07-clinical-media.webp` },
      { s: 'Sağlık Sigortası',  meta: 'Meta Ads · 7 gün',   red: '−%50,7', img: `${IMG}/04-health-insurance.webp` },
      { s: 'Ağrı Tedavisi',     meta: 'Meta Ads · 23 gün',  red: '−%49,4', img: `${IMG}/05-pain-relief.webp` },
      { s: 'Diş İmplantı',      meta: 'Google Ads · 8 gün', red: '−%28,1', img: `${IMG}/03-dental-implants.webp` },
    ],
    resFoot:
      'Canlı reklam hesaplarından ekran görüntüleri. Kampanya isimleri bulanıklaştırılmıştır. ' +
      'Sonuçlar pazara, bütçeye ve sektöre göre değişir; aynı düşüş garanti edilmez.',

    /* ── Problem (ters tema) ────────────────────────────────── */
    probHead: 'Bugün iki seçeneğiniz var. İkisi de bozuk.',
    probs: [
      { k: 'Seçenek 1', h: 'Ajansa para ödemek',   d: 'Aylık ücretler, deneyimsiz müşteri temsilcileri, okuyamadığınız raporlar — ve seneye yine ajans değiştiriyorsunuz.' },
      { k: 'Seçenek 2', h: 'Kendiniz yapmak',      d: 'Reklam panelinde kaybolan akşamlar, tahminle belirlenen bütçe ve kitleler. İşletme sahibisiniz — reklamcı olmak zorunda değilsiniz.' },
      { k: 'Sonuç',     h: 'Yanan para, sıfır netlik', d: 'Kimse düzgün takip etmezken reklamlar harcamaya devam eder. Sorunlar haftalar sonra fark edilir.' },
    ],
    probAns:
      'STOAIX üçüncü seçenek: reklamlarınızı günün her saati ölçen — ve harekete ' +
      'geçmeden önce size soran bir yapay zeka.',

    /* ── Ne yapar ───────────────────────────────────────────── */
    featEyebrow: 'Ne yapar',
    featHead: 'Ajansınızın yaptığı her şey. Ajans olmadan.',
    feats: [
      { n: '01', h: '7/24 ölçüm',            d: 'Her kampanya, reklam seti ve tek tek reklam — her gün çekilir, günde iki kez değerlendirilir.' },
      { n: '02', h: 'Anlaşılır raporlar',    d: "Her sabah 09:00'da gün sonu raporu: ne oldu, neden oldu, bugün ne yapılmalı. E-posta ve Telegram." },
      { n: '03', h: 'Aksiyon planı çıkarır', d: 'Öncelik sıralı öneriler. Her önerinin altında dayandığı ölçüm ve bir güven rozeti.' },
      { n: '04', h: 'Onayınızla uygular',    d: 'Öneriler sunulur, uygulanmaz. Reklam hesabınıza yazma yetkisi varsayılan olarak kapalıdır.' },
      { n: '05', h: 'Paranın sızdığı yeri bulur', d: 'Huni adımları tutar olarak gösterilir: tıklayıp siteye varmayan kişi kaç para etti.' },
      { n: '06', h: 'Bütçe doluluğunu izler', d: 'Bütçe tavanına değme sıklığı ve reklamların kaç gün durduğu olgu olarak yazılır.' },
      { n: '07', h: 'Kreatif yorulmasını görür', d: 'En çok harcayan reklam ile en iyi dönüştüren reklam yan yana. Fark buradan görünür.' },
      { n: '08', h: 'Formdan geleni listeler', d: 'Meta form gönderimleri panelde canlı ve maskeli. 90 gün saklanır, her açılış kayda geçer.' },
    ],

    /* ── Nasıl çalışır ──────────────────────────────────────── */
    howHead: 'Öğle yemeğinden önce hazır.',
    steps: [
      { n: '1', time: '1 dk',    h: 'Denemeni başlat',     d: '3 gün tam erişim £10. Sözleşme yok.' },
      { n: '2', time: '5 dk',    h: 'Meta hesabını bağla', d: 'Meta ile güvenli giriş. Hesaplar senin — erişimi istediğin an kaldır.' },
      { n: '3', time: '< 1 saat', h: 'Panel devralır',     d: 'İlk değerlendirme birkaç dakika içinde panelde. İlk gün sonu raporu ertesi sabah 09:00’da.' },
    ],
    chLbl: 'Kanallar',
    channels: [
      { n: 'Meta Ads',   s: 'Canlı',  live: true },
      { n: 'Google Ads', s: 'Kilitli' },
      { n: 'SEO · GEO',  s: 'Kilitli' },
    ],

    /* ── Teklif + form ──────────────────────────────────────── */
    offerTag: '3 günlük deneme',
    offerPer: '3 gün için',
    offerSub:
      'Yapay zeka reklam yöneticisine tam erişim. Hiçbir şeye bağlanmadan önce ' +
      'hesabınızda neler bulduğunu görün.',
    incl: [
      'Meta reklam hesabınızın tamamı — kampanya, reklam seti, tek tek reklam',
      'Günde iki kez yapay zeka değerlendirmesi',
      "Her sabah 09:00 gün sonu raporu — e-posta ve Telegram",
      'Huni, kreatif ve bütçe analizi',
      'Form (lead) listesi — maskeli, CSV ile indirilebilir',
      'Panelden kampanya oluşturma',
    ],

    formHead: 'Hesabını oluştur',
    formSub: '60 saniye sürer. Ödeme bir sonraki adımda.',
    fl: { biz: 'İşletme adı', email: 'E-posta', pass: 'Şifre oluştur', phone: 'Telefon numarası', web: 'Web sitesi' },
    ph: { biz: 'Örnek Klinik Ltd.', email: 'sen@sirketin.com', pass: 'En az 8 karakter', phone: '+90 5xx xxx xx xx', web: 'www.siteniz.com' },
    optional: 'İsteğe bağlı',
    err: {
      req: 'Zorunlu alan',
      email: 'Geçerli bir e-posta girin',
      pass: 'En az 8 karakter',
      phone: 'Geçerli bir telefon girin',
    },
    consent: [
      'Reklam hesabımdaki verilerin bu panelde raporlanması işlemini kabul ediyorum.',
      'Reklamlarımda, onayım olmadan hiçbir şekilde değişiklik yapılmaz.',
      '3 günlük deneme sonunda seçtiğim plan otomatik başlar. Öncesinde panelden iptal edebilirim.',
    ],
    errConsent: 'Devam etmek için onaylayın',
    formCta: 'Hesap aç',
    formBusy: 'Hesap açılıyor…',
    pwShow: 'Şifreyi göster',
    pwHide: 'Şifreyi gizle',
    planLbl: 'Deneme sonrası plan',
    perMo: '/ay',
    popular: 'En çok tercih edilen',
    budgetLbl: 'Yıllık toplam',
    planCta: '£10 denemeyle başla',
    doneHead: 'Hesabın oluşturuldu',
    doneSub: 'Güvenli ödeme sayfasına yönlendiriliyorsun…',
    offerFine: 'Güvenli ödeme · Deneme süresince istediğin an iptal',

    /* ── Fiyat ──────────────────────────────────────────────── */
    priceEyebrow: 'Fiyatlandırma',
    priceHead: 'Bir planın ücreti, tek bir ajans faturasından az.',
    priceSub:
      "İki planda da £10'luk 3 günlük denemeyle başlarsın. Planın 3 gün sonra " +
      'başlar — öncesinde iptal edersen başka ödeme yapmazsın.',
    priceFoot: 'Fiyatlar GBP. Kurulum ücreti yok, sözleşme yok.',
    plans: [
      {
        k: 'aylik', name: 'Aylık', price: '£150', per: '/ay',
        budget: '£1.800',
        desc: 'Aylık ödersiniz, istediğiniz ay bırakırsınız. Taahhüt yok.',
        rows: [
          ['Kampanya, reklam seti ve tek tek reklam kırılımı', 1],
          ['Günde iki kez yapay zeka değerlendirmesi', 1],
          ['Her sabah 09:00 gün sonu raporu — e-posta ve Telegram', 1],
          ['Huni sızıntısı — tutar olarak', 1],
          ['Kreatif yorulması ve kıyas', 1],
          ['Bütçe tavanı ve duran gün tespiti', 1],
          ['Form (lead) listesi — maskeli, CSV', 1],
          ['Panelden kampanya oluşturma', 1],
          ['İki ay bedava', 0],
        ],
      },
      {
        k: 'yillik', name: 'Yıllık', price: '£1.500', per: '/yıl', pop: true,
        budget: '£1.500 · £300 tasarruf',
        desc: 'Aynı panel, iki ay bedava. Yıllık ödeyip aylık ücreti unutursunuz.',
        rows: [
          ['Aylık plandaki her şey', 1],
          ['İki ay bedava — 12 ay yerine 10 ay ödersiniz', 1],
          ['Yıl boyunca fiyat sabit', 1],
        ],
      },
    ],

    /* ── SSS ────────────────────────────────────────────────── */
    faqHead: 'Sorular',
    faq: [
      { q: 'Reklam deneyimi gerekiyor mu?', a: 'Hayır. Raporlar pazarlamacılar için değil, işletme sahipleri için yazılır. Okursunuz, onaylarsınız, iş yapılır.' },
      { q: 'Bana sormadan reklamlarımı değiştirir mi?', a: 'Hayır. Öneriler sunulur, uygulanmaz. Reklam hesabınıza yazma yetkisi varsayılan olarak kapalıdır; açmak panelden verdiğiniz ayrı bir karardır. Her değişiklik kimin onayladığıyla kaydedilir ve geri alınabilir.' },
      { q: 'İlk raporu ne zaman alırım?', a: "Meta hesabınızı bağladığınız anda geçmiş veri çekilmeye başlar ve ilk değerlendirme birkaç dakika içinde panelde görünür. İlk gün sonu raporu ertesi sabah 09:00'da e-postanıza gelir." },
      { q: 'Reklam hesabım kimin?', a: 'Sizin. STOAIX kendi Meta hesabınızın içinde çalışır, erişimi istediğiniz an Meta tarafından kaldırabilirsiniz.' },
      { q: 'Ajansım var, yine de işime yarar mı?', a: 'Evet. Ajansınız reklamlarınızı yönetmeye devam eder; siz her sabah aynı veriyi bağımsız olarak görürsünüz — harcama, sonuç, hangi reklamın ne getirdiği ve nerede kayıp olduğu.' },
      { q: 'E-ticaret yapıyorum, uygun mu?', a: "Şu an değil. Meta'dan satın alma olayı okunamadığı için satış başına maliyeti ölçemiyoruz; ekranda “0 satış” yazmak yerine “ölçülemiyor” diyoruz. Form ya da mesaj hedefli kampanyalarda panel tam çalışır." },
      { q: 'Google Ads de bağlayabilir miyim?', a: 'Bugün yalnız Meta çalışıyor. Google Ads ve SEO panelde kilitli görünüyor — var olduklarını görüyorsunuz ama tarih sözü vermiyoruz.' },
      { q: 'Nasıl iptal ederim?', a: 'Üç günlük denemenin sonunda seçtiğiniz plan otomatik başlar. Üç gün dolmadan iptal ederseniz aylık ya da yıllık ücret alınmaz. İptal için bilgi@stoaix.com adresine yazmanız yeterli; aynı gün işleme alınır.' },
    ],

    /* ── Son çağrı + altbilgi ───────────────────────────────── */
    finalHead: 'Tahmin etmeyi bırakın. Ölçülmüş olanı görün.',
    finalSub:
      'Üç gün, £10 ve reklamlarınızı her saat ölçen bir panel. Farkı kendiniz görün.',
    stickyPer: '3 günlük deneme',
    stickyCta: 'Denemeyi başlat',
    copyright: '© 2026 STOAIX Ltd. — Londra, Birleşik Krallık',
    legal: [
      { t: 'Gizlilik', h: '/privacy-policy' },
      { t: 'Koşullar', h: '/terms' },
      { t: 'İletişim', h: '/contact' },
    ],
    login: 'Giriş yap',
    skip: 'Ana içeriğe geç',
  },

  en: {
    lang: 'en',
    dir: 'ltr',
    path: '/en/reklam',
    altPath: '/reklam',
    altLabel: 'TR',

    title: 'STOAIX Ads — let AI run your Meta ads',
    desc:
      'Connect your Meta ad account. Campaigns are measured around the clock, ' +
      'and every morning you get a plain-English report and a prioritised action plan. ' +
      'Nothing changes without your approval. 3 days for £10.',
    ogLocale: 'en_GB',

    navCta: 'Try for £10',

    eyebrow: 'AI ad manager · Live on Meta',
    h1a: 'Tired of agencies?',
    h1b: 'Let AI run your ads ',
    h1u: '24/7',
    h1c: '.',
    sub:
      "STOAIX analyses your Meta campaigns around the clock, explains what's " +
      'happening in plain English, and fixes it the moment you approve. No agency. ' +
      'No learning curve.',

    videoLbl: 'Watch the 3-minute demo',
    videoUnmute: 'Tap for sound',
    videoAria: 'STOAIX Ads demo video',

    cta: 'Start my 3-day trial — £10',
    micro: ['Live in under 1 hour', 'Cancel anytime', 'Your ad accounts stay yours'],

    rating: 'Rated 4.9/5 by business owners who switched from agencies',
    reviews: [
      {
        q: 'Three agencies in two years, each one worse. STOAIX cut our cost per lead in half in the first week — and I actually understand the reports.',
        n: 'Sarah K.', r: 'Clinic owner · Manchester', i: 'S',
      },
      {
        q: 'I tried to learn Ads Manager myself. Big mistake. Now I get a report every morning, tap approve, and get back to running my business.',
        n: 'James O.', r: 'E-commerce founder · London', i: 'J',
      },
      {
        q: 'Connected my account on a Tuesday evening, first action plan was waiting Wednesday morning. Cheaper than one hour of my old agency.',
        n: 'Priya M.', r: 'Beauty salon · Birmingham', i: 'P',
      },
    ],

    resEyebrow: 'Real accounts',
    resHead: 'Lower cost per lead. In days, not months.',
    cplRed: 'CPL reduced',
    cases: [
      { s: 'Cancer Test',      meta: 'Meta Ads · 9 days',   red: '−69.8%', img: `${IMG}/01-cancer-test.webp` },
      { s: 'Clinical Media',   meta: 'Meta Ads · 29 days',  red: '−69.1%', img: `${IMG}/07-clinical-media.webp` },
      { s: 'Health Insurance', meta: 'Meta Ads · 7 days',   red: '−50.7%', img: `${IMG}/04-health-insurance.webp` },
      { s: 'Pain Relief',      meta: 'Meta Ads · 23 days',  red: '−49.4%', img: `${IMG}/05-pain-relief.webp` },
      { s: 'Dental Implants',  meta: 'Google Ads · 8 days', red: '−28.1%', img: `${IMG}/03-dental-implants.webp` },
    ],
    resFoot:
      'Screenshots from live ad accounts. Campaign names are blurred. Results vary ' +
      'by market, budget and sector; the same reduction is not guaranteed.',

    probHead: 'You have two options today. Both are broken.',
    probs: [
      { k: 'Option 1',   h: 'Pay an agency',           d: "Monthly retainers, junior account managers, reports you can't read — and you're switching agencies again next year." },
      { k: 'Option 2',   h: 'Do it yourself',          d: "Evenings lost in Ads Manager, guessing at budgets and audiences. You run a business — you shouldn't have to become a media buyer." },
      { k: 'The result', h: 'Money burned, no clarity', d: 'Ads keep spending while nobody watches them properly. Problems are noticed weeks too late.' },
    ],
    probAns:
      'STOAIX is the third option: a panel that measures your ads every hour of the ' +
      'day — and asks before it acts.',

    featEyebrow: 'What it does',
    featHead: 'Everything your agency did. Without the agency.',
    feats: [
      { n: '01', h: 'Measures 24/7',           d: 'Every campaign, ad set and individual ad — pulled daily, assessed twice a day.' },
      { n: '02', h: 'Reports in plain English', d: 'A 09:00 end-of-day report: what happened, why, and what to do today. Email and Telegram.' },
      { n: '03', h: 'Builds action plans',      d: 'Prioritised recommendations. Each one shows the measurement behind it and a confidence badge.' },
      { n: '04', h: 'Acts on your approval',    d: 'Recommendations are presented, not applied. Write access to your ad account is off by default.' },
      { n: '05', h: 'Finds where money leaks',  d: 'Funnel steps shown in currency: what the clicks that never reached your site actually cost.' },
      { n: '06', h: 'Watches budget capacity',  d: 'How often you hit the budget ceiling, and how many days your ads sat stopped — stated as fact.' },
      { n: '07', h: 'Spots creative fatigue',   d: 'Your highest-spending ad next to your best-converting ad. The gap becomes visible.' },
      { n: '08', h: 'Lists your form leads',    d: 'Meta form submissions live in the panel, masked. Kept 90 days, every reveal is logged.' },
    ],

    howHead: 'Up and running before lunch.',
    steps: [
      { n: '1', time: '1 min',    h: 'Start your trial',          d: '£10 for 3 days of full access. No contract.' },
      { n: '2', time: '5 min',    h: 'Connect your Meta account', d: 'Secure login with Meta. Your accounts, your ownership — revoke any time.' },
      { n: '3', time: '< 1 hour', h: 'The panel takes over',      d: 'Your first assessment appears within minutes. Your first end-of-day report lands at 09:00 tomorrow.' },
    ],
    chLbl: 'Channels',
    channels: [
      { n: 'Meta Ads',   s: 'Live',   live: true },
      { n: 'Google Ads', s: 'Locked' },
      { n: 'SEO · GEO',  s: 'Locked' },
    ],

    offerTag: '3-day trial',
    offerPer: 'for 3 days',
    offerSub:
      'Full access to the AI ad manager. See what it finds in your account before ' +
      'you commit to anything.',
    incl: [
      'Your entire Meta ad account — campaign, ad set, individual ad',
      'Twice-daily AI assessment',
      '09:00 end-of-day report — email and Telegram',
      'Funnel, creative and budget analysis',
      'Form (lead) list — masked, CSV export',
      'Create campaigns from the panel',
    ],

    formHead: 'Create your account',
    formSub: 'Takes 60 seconds. Payment on the next step.',
    fl: { biz: 'Business name', email: 'Email', pass: 'Create password', phone: 'Phone number', web: 'Website' },
    ph: { biz: 'Acme Clinic Ltd', email: 'you@company.com', pass: 'At least 8 characters', phone: '+44 7700 900000', web: 'www.yoursite.com' },
    optional: 'Optional',
    err: {
      req: 'Required',
      email: 'Enter a valid email',
      pass: 'At least 8 characters',
      phone: 'Enter a valid phone number',
    },
    consent: [
      'I agree to my ad account data being reported in this panel.',
      'No changes are ever made to my ads without my approval.',
      'My chosen plan starts automatically after the 3-day trial. I can cancel beforehand.',
    ],
    errConsent: 'Please accept to continue',
    formCta: 'Create account',
    formBusy: 'Creating account…',
    pwShow: 'Show password',
    pwHide: 'Hide password',
    planLbl: 'Plan after trial',
    perMo: '/mo',
    popular: 'Most popular',
    budgetLbl: 'Yearly total',
    planCta: 'Start with £10 trial',
    doneHead: 'Account created',
    doneSub: 'Taking you to secure payment…',
    offerFine: 'Secure checkout · Cancel anytime during the trial',

    priceEyebrow: 'Pricing',
    priceHead: 'One plan costs less than a single agency invoice.',
    priceSub:
      'Start with the £10 trial on either plan. Your plan begins after 3 days — ' +
      'cancel before then and you pay nothing more.',
    priceFoot: 'Prices in GBP. No setup fees, no contracts.',
    plans: [
      {
        k: 'aylik', name: 'Monthly', price: '£150', per: '/mo',
        budget: '£1,800',
        desc: 'Pay monthly, leave any month. No commitment.',
        rows: [
          ['Campaign, ad set and individual ad breakdown', 1],
          ['Twice-daily AI assessment', 1],
          ['09:00 end-of-day report — email and Telegram', 1],
          ['Funnel leakage — shown in currency', 1],
          ['Creative fatigue and comparison', 1],
          ['Budget ceiling and stopped-day detection', 1],
          ['Form (lead) list — masked, CSV', 1],
          ['Create campaigns from the panel', 1],
          ['Two months free', 0],
        ],
      },
      {
        k: 'yillik', name: 'Yearly', price: '£1,500', per: '/yr', pop: true,
        budget: '£1,500 · save £300',
        desc: 'Same panel, two months free. Pay yearly and forget the monthly invoice.',
        rows: [
          ['Everything in Monthly', 1],
          ['Two months free — pay for 10 months instead of 12', 1],
          ['Price locked for the year', 1],
        ],
      },
    ],

    faqHead: 'Questions',
    faq: [
      { q: 'Do I need any ad experience?', a: 'No. The reports are written for business owners, not marketers. You read, you approve, it does the work.' },
      { q: 'Will it change my ads without asking?', a: 'No. Recommendations are presented, not applied. Write access to your ad account is off by default; turning it on is a separate, explicit decision. Every change is logged with who approved it and can be undone.' },
      { q: 'When do I get my first report?', a: 'Historical data starts pulling the moment you connect your Meta account, and your first assessment appears in the panel within minutes. Your first end-of-day report arrives by email at 09:00 the next morning.' },
      { q: 'Who owns my ad account?', a: 'You do. STOAIX works inside your own Meta account and you can revoke access from Meta at any time.' },
      { q: 'I have an agency — is this still useful?', a: 'Yes. Your agency keeps running your ads; you independently see the same data every morning — spend, results, which ad produced what, and where the losses are.' },
      { q: 'I run e-commerce, is this for me?', a: 'Not yet. Meta does not expose the purchase event to us, so we cannot measure cost per sale — and rather than printing “0 sales” we say “not measurable”. For form or message campaigns the panel works fully.' },
      { q: 'Can I connect Google Ads too?', a: 'Only Meta works today. Google Ads and SEO appear locked in the panel — you can see they exist, but we are not promising a date.' },
      { q: 'How do I cancel?', a: 'Your chosen plan starts automatically at the end of the three-day trial. Cancel before the three days are up and no monthly or yearly charge is taken. Email bilgi@stoaix.com to cancel; it is processed the same day.' },
    ],

    finalHead: 'Stop guessing. See what was measured.',
    finalSub:
      'Three days, £10, and a panel that measures your ads every hour. See the difference yourself.',
    stickyPer: '3-day trial',
    stickyCta: 'Start trial',
    copyright: '© 2026 STOAIX Ltd. — London, United Kingdom',
    legal: [
      { t: 'Privacy', h: '/privacy-policy' },
      { t: 'Terms', h: '/terms' },
      { t: 'Contact', h: '/contact' },
    ],
    login: 'Log in',
    skip: 'Skip to main content',
  },
};

/* ═══ SABİT BAĞLANTILAR ═══════════════════════════════════════════
   🔑 KAYIT UCU TEK YERDE. Funnel formu doğrudan panele (pilot) gönderiyor;
   adres değişirse yalnız burası değişecek. Ayrıntı için build-vsl.mjs
   içindeki "FORM NEREYE GİDİYOR" notuna bak. */
export const LINKS = {
  origin: 'https://stoaix.com',
  panel: 'https://pilot.stoaix.com',
  kayit: 'https://pilot.stoaix.com/kayit',
  kayitPost: 'https://pilot.stoaix.com/kayit/basla',
  login: 'https://pilot.stoaix.com/login',
};
