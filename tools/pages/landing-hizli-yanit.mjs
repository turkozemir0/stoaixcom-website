/* Hızlı yanıt reklam sayfaları — metinler eski sayfalardan aynen. */

const ACTIONS = ['Ücretsiz Demo Başlat'];
const howSteps = (first, rest) => [
  { t: 'Mesaj Algılanır', d: first },
  ...rest,
];

export const HIZLI_YANIT = [
  {
    slug: 'dis-klinigi-hizli-yanit', agent: 'rec',
    title: 'Diş Kliniğinde Anlık Lead Yanıtı | STOAIX',
    desc: 'Diş ağrısı olan hasta sizi arar, cevap vermezseniz rakibinizi arar. STOAIX her soruya 8 saniyede yanıt verir — implant\'tan acil vakaya kadar.',
    crumb: 'Diş kliniği · Anlık yanıt', eyebrow: 'Diş Klinikleri için 7/24 Anlık Yanıt', proof: '24 saatte kurulum · Sözleşme yok · WhatsApp + Web',
    h1: 'Hasta mesaj attı. 8 saniyede yanıt aldı.',
    lede: 'Diş ağrısı veya implant sorusu olan hasta ilk yanıt veren kliniği seçer. Cevabı geciken klinik hasta değil, sadece reklam bütçesi harcıyor.',
    actions: ACTIONS,
    chat: { stamp: 'Pazar 22:15', q: 'Merhaba, implant fiyatı ne kadar? 3 dişim eksik, ne kadar sürer?', a: 'Merhaba! 3 implant için ₺24.000–₺39.000 aralığı öngörüyoruz. Ücretsiz muayene randevusu ayarlayayım mı? Yarın sabah 09:00 veya 10:30 uygun mu?' },
    stats: [['8 sn', 'Ortalama ilk yanıt süresi'], ['+%40', 'Konsültasyon artışı'], ['7/24', 'Hafta sonu dahil'], ['%80', 'Admin zaman tasarrufu']],
    rule: {
      h: 'Diş Kliniğinde Yanıt Hızı = Randevu Dönüşümü',
      lede: 'İmplant veya estetik diş tedavisi araştıran hasta, birden fazla kliniği karşılaştırır. Hız ve bilgi kalitesi ilk izlenimi belirler.',
      rows: [['Anlık yanıt (STOAIX)', '%88'], ['İlk 5 dakika', '%74'], ['30 dakika – 1 saat', '%28'], ['Ertesi gün (çoğu klinik)', '%6']],
      after: ['Diş hastalarının %41\'i mesai dışı saatlerde klinik araştırır. Pazar akşamı gelen implant sorusu pazartesi sabahına kadar cevaplanmazsa, hasta hafta içi gidebileceği kliniği bulmuş olur.', 'STOAIX haftanın her günü, her saati fiyat, süre ve randevu bilgisi verir.'],
    },
    pain: {
      h: 'Diş Klinikleri Neden Hasta Kaybeder?', lede: 'Sorun kötü reklam değil — yanıt penceresi. Hasta hazır, klinik hazır değil.',
      items: [
        { n: '%41', t: 'Mesai dışı soru sorulur', d: 'Diş implantı araştırması çoğunlukla akşam ve hafta sonlarında yapılır. Bu saatler yanıtsız kalır.' },
        { n: '4–6', t: 'Karşılaştırılan klinik sayısı', d: 'İmplant kararı vermeden önce hasta ortalama 4–6 klinik araştırır. Hızlı ve doğru yanıt veren öne geçer.' },
        { n: '₺25K+', t: 'Yanıtsız kalan her implant değeri', d: 'Cevapsız bir implant soruşturması, kliniğe ortalama ₺25.000–₺45.000 gelir kaybı demektir.' },
      ],
    },
    how: {
      h: 'Diş Sorusu Geldi. 4 Adımda Randevuya Döndü.',
      steps: howSteps('WhatsApp veya web chat\'ten gelen mesaj milisaniyeler içinde STOAIX\'e ulaşır.', [
        { t: 'Tedavi Tespiti', d: 'İmplant, zirkonyum, ortodonti veya acil vaka — STOAIX tedavi türünü saptar ve uygun yanıt verir.' },
        { t: 'Fiyat & Süre Bilgisi', d: 'Kliniğin güncel fiyat aralığı ve tedavi süresi doğal konuşma akışında aktarılır.' },
        { t: 'Randevu Ayarlanır', d: 'Hazır hasta direkt randevuya bağlanır. Ekip yalnızca nitelikli adaylarla vakit geçirir.' },
      ]),
    },
    vs: {
      h: 'STOAIX Olmadan vs STOAIX İle', lede: 'Aynı reklam bütçesi — çok farklı gelir.',
      no: { k: 'Klasik Diş Kliniği', t: 'Pazar akşamı gelen soru pazartesiye kalır', items: ['Hafta sonu soruları pazartesi sabahına yığılır', 'Resepsiyon aynı soruları tekrar tekrar yanıtlar', 'İmplant randevusu kaçan = ₺25K–₺45K kayıp', 'Acil ağrı vakası rakibe gider'] },
      yes: { k: 'STOAIX ile', t: 'Her soru, her saatte, anında yanıtlanır', items: ['Pazar 22:00\'de gelen implant sorusu 8 saniyede cevaplanır', 'Resepsiyon sadece randevu onaylarıyla ilgilenir', 'Acil vakalar öncelik sırasıyla ekibe yönlendirilir', 'Her lead tedavi türüne göre nitelendirilir'] },
    },
    close: 'Bir sonraki implant sorusu cevapsız kalmasın.',
    sister: { t: 'Eski Lead Canlandırma', href: '/dis-klinigi-eski-lead-canlandirma' },
  },
  {
    slug: 'estetik-klinik-hizli-yanit', agent: 'rec',
    title: 'Estetik Kliniğinde Anlık Lead Yanıtı | STOAIX',
    desc: 'Estetik klinik leadi Instagram\'dan gelir, impulse anında karar verir. 1 saat gecikme = lead kaybı. STOAIX her soruyu 8 saniyede yanıtlar, 7/24.',
    crumb: 'Estetik klinik · Anlık yanıt', eyebrow: 'Estetik Klinikler için 7/24 Anlık Yanıt', proof: '24 saatte kurulum · Instagram + WhatsApp · Sözleşme yok',
    h1: 'Impulse anı. 8 saniyede yakalandı.',
    lede: 'Estetik lead\'lerin %72\'si Instagram veya TikTok\'tan gelir — impulse anında, karar vermeye hazır. O anı kaçırmak, leadi tamamen kaybetmek demektir.',
    actions: ACTIONS,
    chat: { stamp: 'Cumartesi 21:33 · Instagram DM', q: 'Merhaba, botoks ve dolgu yaptırmak istiyorum. Fiyat ve en yakın randevu nedir?', a: 'Merhaba! Botoks ₺3.500\'den, dolgu ₺4.200\'den başlıyor. Bu hafta çarşamba veya perşembe sabahı uygun gün var — hangi gün sizi arayalım?' },
    stats: [['8 sn', 'Ortalama ilk yanıt süresi'], ['%72', 'Lead sosyal medyadan gelir'], ['240', 'Randevu — 6 haftada'], ['7/24', 'Kesintisiz kapsama']],
    rule: {
      h: 'Estetik Lead\'in Karar Penceresi 20 Dakika',
      lede: 'Instagram\'dan gelen estetik sorusu, reklam videosunu izlerken veya hemen sonrasında oluşur. Bu impulse penceresi kapanırsa lead soğur.',
      rows: [['Anlık yanıt (STOAIX)', '%93'], ['5–20 dakika içinde', '%65'], ['20 dakika – 1 saat', '%22'], ['Ertesi gün (çoğu klinik)', '%5']],
      after: ['Estetik lead\'in impulse penceresi yalnızca 20 dakika. Instagram reels\'ı izlerken botoks sorusu soran hasta, 20 dakika içinde yanıt alamazsa kararından vazgeçer ya da başka kliniği bulur.', 'STOAIX bu pencereyi 8 saniyede kapatır — hafta sonu gece 22:00\'de bile.'],
    },
    pain: {
      h: 'Estetik Klinikler Neden Lead Kaybeder?', lede: 'Yüksek reklam bütçesi, düşük dönüşüm. Sorun hedeflemede değil, yanıt süresinde.',
      items: [
        { n: '%72', t: 'Lead sosyal medyadan, akşam gelir', d: 'Estetik sorularının büyük çoğunluğu akşam 19:00–23:00 arasında Instagram veya TikTok üzerinden gelir. Klinik kapıyı çoktan kapatmıştır.' },
        { n: '3–5', t: 'Aynı anda sorulan klinik sayısı', d: 'Botoks veya dolgu araştıran hasta aynı anda birden fazla kliniğe mesaj atar. İlk cevap veren, güven kuran klinik öne geçer.' },
        { n: '₺150K+', t: 'Yanıtsız kalan aylık estetik geliri', d: 'Aktif bir estetik kliniğin aylık yanıtsız lead kaybı, ortalama ₺150.000 üzeri işlem değerine karşılık gelir.' },
      ],
    },
    how: {
      h: 'Instagram\'dan Geldi. 4 Adımda Randevuya Döndü.',
      steps: howSteps('Instagram DM, WhatsApp veya web formundan gelen mesaj milisaniyeler içinde STOAIX\'e ulaşır.', [
        { t: 'Tedavi Tespiti', d: 'Botoks, dolgu, yüz estetiği, liposuction — STOAIX tedavi türünü saptar ve kişiselleştirilmiş yanıt gönderir.' },
        { t: 'Fiyat & Süre Bilgisi', d: 'Güncel fiyat aralığı, işlem süresi ve sonuç beklentisi doğal akışta paylaşılır.' },
        { t: 'Randevu Ayarlanır', d: 'Hazır hasta direkt randevuya bağlanır. Tüm lead verisi CRM\'e aktarılır.' },
      ]),
    },
    vs: {
      h: 'STOAIX Olmadan vs STOAIX İle', lede: 'Reklam bütçesi aynı. Dönüşüm tamamen farklı.',
      no: { k: 'Klasik Estetik Klinik', t: 'Impulse anı kaçırıldı, lead soğudu', items: ['Instagram DM\'leri sabah toplu açılır, lead çoktan soğumuştur', 'Akşam gelen soru ertesi gün cevaplanır, hasta vazgeçer', 'Resepsiyon botoks, dolgu, liposuction fiyatlarını her seferinde tekrar açıklar', 'Reklam bütçesi büyüyor ama lead dönüşümü düşük kalıyor'] },
      yes: { k: 'STOAIX ile', t: 'Her impulse anında 8 saniyede yanıt', items: ['Cumartesi 22:00\'de Instagram\'dan gelen botoks sorusu 8 saniyede cevaplanır', 'Tedaviye göre kişiselleştirilmiş fiyat ve bilgi anında verilir', 'Hazır hasta randevuya, sıcak lead danışmana yönlendirilir', 'Aynı reklam bütçesiyle çok daha yüksek dönüşüm'] },
    },
    close: 'Bir sonraki impulse anı yanıtsız kalmasın.',
    sister: { t: 'Eski Lead Canlandırma', href: '/estetik-klinik-eski-lead-canlandirma' },
  },
  {
    slug: 'sac-ekimi-hizli-yanit', agent: 'rec',
    title: 'Saç Ekimi Kliniğinde Anlık Lead Yanıtı | STOAIX',
    desc: 'Saç ekimi kliniklerinde gece gelen leadler sabaha kaybolur. STOAIX her soruya 8 saniyede yanıt verir, 7/24. Uluslararası hasta kaçırmayın.',
    crumb: 'Saç ekimi · Anlık yanıt', eyebrow: '7/24 Anlık Lead Yanıt Sistemi', proof: 'Kurulum 24 saat · Sözleşme yok · TR / EN / AR / DE',
    h1: 'Lead geldi. 8 saniyede yanıt gitti.',
    lede: 'Saç ekimi araştıran hastalar aynı anda 3–5 kliniğe mesaj atar. İlk yanıt veren klinik randevuyu alır. Sabahı bekleyenler sadece rakibe fırsat verir.',
    actions: ACTIONS,
    chat: { stamp: '23:47 · Salı', q: 'Merhaba, saç ekimi yaptırmak istiyorum. Fiyat bilgisi alabilir miyim?', a: 'Merhaba! Greft sayısına göre paketlerimiz ₺18.000–₺32.000 arasında. Ücretsiz saç analizi için uygun bir gün var mı? Randevuyu hemen ayarlayabilirim.' },
    stats: [['8 sn', 'Ortalama ilk yanıt süresi'], ['73%', 'Lead kaybı azalması'], ['7/24', 'Kesintisiz kapsama'], ['4 dil', 'TR · EN · AR · DE']],
    rule: {
      h: '5 Dakika Kuralı — Saç Ekimi Sektöründe',
      lede: 'Lead yönetimi araştırmaları net konuşuyor: ilk temasın zamanlaması, dönüşüm oranını belirler.',
      rows: [['Anlık yanıt (STOAIX)', '%91'], ['İlk 5 dakika', '%78'], ['5–30 dakika', '%34'], ['1 saat sonra', '%12'], ['Ertesi gün (çoğu klinik)', '%4']],
      after: ['Saç ekimi leadlerinin %87\'si ilk 10 dakika içinde yanıt almadığında başka bir kliniğe geçiyor. Gece 2\'de Almanya\'dan soru soran hasta, sabaha kadar rakibinizde randevusunu almış olur.', 'STOAIX bu pencereyi kapatır. Her lead, her saatte, her dilde anında karşılanır.'],
    },
    pain: {
      h: 'Saç Ekimi Klinikleri Neden Lead Kaybeder?', lede: 'Kötü reklam değil. Kötü yanıt süresi. Hastalar hazır, klinik hazır değil.',
      items: [
        { n: '%68', t: 'Mesai dışı sorular yanıtsız kalıyor', d: 'Saç ekimi araştıranların büyük çoğunluğu gece 19:00–01:00 arası soru sorar. Klinik kapalı, asistan evde.' },
        { n: '4.2 sa', t: 'Türkiye\'deki ortalama ilk yanıt süresi', d: 'Araştırmalar, saç ekimi kliniklerinin leadlere ortalama 4 saat 12 dakika sonra geri döndüğünü gösteriyor.' },
        { n: '5 klinik', t: 'Aynı anda sorulan klinik sayısı', d: 'Uluslararası hasta, aynı anda birden fazla kliniğe ulaşır. Sektörde ilk yanıt veren klinik %80 oranında seçilir.' },
      ],
    },
    how: {
      h: 'Lead Geldi. 4 Adımda Randevuya Dönüşüyor.',
      steps: [
        { t: 'Lead Algılanır', d: 'WhatsApp, Instagram DM veya web formundan mesaj gelir. STOAIX milisaniyeler içinde aktif hale geçer.' },
        { t: 'Dil Tespiti & Yanıt', d: 'Türkçe, İngilizce, Arapça veya Almanca — STOAIX hastanın dilinde anında kişiselleştirilmiş yanıt gönderir.' },
        { t: 'Nitelendirme', d: 'Greft sayısı, bütçe, tahmini tarih gibi bilgiler doğal konuşma akışında toplanır.' },
        { t: 'Randevu / Yönlendirme', d: 'Hazır hasta direkt randevuya bağlanır. Sıcak lead ekibinize bildirim olarak iletilir.' },
      ],
    },
    vs: {
      h: 'STOAIX Olmadan vs STOAIX İle', lede: 'Fark bir teknoloji seçeneği değil, gelir farkı.',
      no: { k: 'Klasik Klinik', t: 'Gece gelen lead sabaha kaybolur', items: ['Mesai dışı sorular okunmadan kalır, hasta vazgeçer', 'Yabancı dilde mesaj gelir, yanıt verilemez', 'Sabah CRM\'i açmak için saat 9\'u beklemek gerekir', 'Aynı anda 5 klinikle yarışılıyor, sonuncu yanıt veriliyor'] },
      yes: { k: 'STOAIX ile', t: 'Her lead 8 saniyede karşılanır', items: ['Gece 02:00\'de Almanya\'dan gelen soru anında yanıtlanır', 'TR · EN · AR · DE dört dilde kişiselleştirilmiş yanıt', 'Hazır hasta direkt randevuya, sıcak lead ekibe yönlenir', 'Rakiplerden önce temas kuran klinik randevuyu alır'] },
    },
    close: 'Bir sonraki gece gelen lead rakibe gitmesin.',
    sister: { t: 'Eski Lead Canlandırma', href: '/sac-ekimi-eski-lead-canlandirma' },
  },
];
