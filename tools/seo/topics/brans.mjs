/* Branş × sistem sayfaları: yalnız otomatik tamamlamada gerçekten aranan çiftler
   (diş kliniği / saç ekimi × CRM / reklam). Diğer branşlar klinik-yapay-zeka sayfasında bölüm olarak durur. */
import { p, ANNUAL } from './price.mjs';

const TR = ['tr'];
const MONEYBACK = 'Kurulumda birlikte yazılan başarı kriteri ilk 30 günde tutmazsa ücret iade edilir.';
const NOT_LEGAL = 'Genel bilgidir, hukuki görüş değildir.';

export const disCrm = {
  id: 'dis-crm', markets: TR,
  slugs: { tr: 'dis-klinigi-crm' },
  price: null,
  rules: ['data', 'software'],
  related: ['crm', 'receptionist', 'reminders', 'dis-reklam'],
  tr: {
    name: 'Diş kliniği CRM',
    card: 'Diş kliniğine gelen her başvuruyu, konuşmayı ve randevuyu tek yerde toplayan CRM; asistanlarla ücretsiz.',
    serviceType: 'Diş klinikleri için CRM ve hasta adayı takibi',
    audience: 'Özel diş klinikleri, ağız ve diş sağlığı poliklinikleri, diş hekimi muayenehaneleri',
    title: 'Diş Kliniği CRM: Hasta Takip ve Randevu | STOAIX',
    desc: 'Diş kliniği CRM: WhatsApp, Instagram ve telefondan gelen implant, ortodonti ve estetik diş başvurularını tek yerde takip edin. STOAIX asistanlarıyla ücretsiz.',
    eyebrow: 'Diş kliniği · CRM',
    h1: 'Diş kliniğinizde hiçbir implant başvurusu Excel’de unutulmasın.',
    lede: 'Diş kliniğinde başvuru çok, karar süresi uzundur: implant ya da ortodonti soran hasta fiyatı alır, “düşüneyim” der ve kaybolur. STOAIX CRM her başvuruyu konuşması, tedavisi ve aşamasıyla kaydeder; asistanlar takip eder, ekibiniz kimin nerede kaldığını görür.',
    aka: ['diş kliniği CRM programı', 'diş kliniği hasta takip programı', 'diş hekimi CRM', 'diş kliniği randevu programı'],
    facts: [
      ['Kayıtta', 'Başvuru, konuşmalar, tedavi ilgisi, aşama, randevu'],
      ['Kanallar', 'WhatsApp, Instagram, web sitesi, telefon'],
      ['Takip', 'Asistanlar kurala göre otomatik'],
      ['Fiyat', 'Her STOAIX asistanıyla ücretsiz'],
      ['Kullanıcı', 'Kullanıcı başı ücret yok'],
    ],
    whatH: 'Diş kliniği CRM’i neyi çözer?',
    what: [
      'Diş kliniği yazılımları hasta dosyası, tedavi planı ve fatura için kurulur; randevu öncesindeki süreci, yani başvurunun hastaya dönüşmesini takip etmez. CRM bu boşluğu doldurur: kim yazdı, hangi tedaviyi sordu, kendisine ne söylendi, ne zaman tekrar aranacak.',
      'STOAIX CRM’i farklı kılan, kaydın asistanlar tarafından tutulmasıdır. Resepsiyonist başvuruya cevap verdiğinde, Takip Uzmanı “düşüneyim” diyen hastayı tekrar aradığında kayıt kendini günceller.',
      'Hasta dosyası diş kliniği yazılımınızda kalır. STOAIX ona bağlanıp randevuyu yazabilir; uyumluluk tanışma görüşmesinde kontrol edilir.',
    ],
    steps: [
      { t: 'Kanallar bağlanır', d: 'WhatsApp, Instagram, web formu ve telefon tek listeye akar.' },
      { t: 'Tedavi aşamaları', d: 'Muayene, tedavi planı, teklif, karar, tedavi; kendi sürecinize göre.' },
      { t: 'Asistanlar yazar ve takip eder', d: 'Konuşmalar kaydedilir, karar vermeyen hasta kurala göre aranır.' },
      { t: 'Rakamlar', d: 'Hangi kanaldan kaç başvuru geldi, kaçı muayeneye, kaçı tedaviye döndü.' },
    ],
    priceH: 'Diş kliniği CRM ne kadar?',
    priceText: [
      'STOAIX CRM her asistanla ücretsiz gelir; lisans, kullanıcı başı ya da kurulum ücreti yoktur.',
      `Diş klinikleri çoğunlukla yazılı ${p('rec', 'text')} ya da sesli ${p('rec', 'voice')} olan Resepsiyonist ile başlar; randevu hatırlatma için Randevu Asistanı aylık ${p('conf', 'text')}’dan. Yıllık anlaşma ${ANNUAL} daha ucuzdur.`,
    ],
    uses: [
      { t: 'İmplant ve ortodonti', d: 'Uzun karar süresinde hasta düzenli takip edilir, teklif unutulmaz.' },
      { t: 'Estetik diş ve gülüş tasarımı', d: 'Instagram’dan gelen başvurular kaydedilir, muayeneye yönlendirilir.' },
      { t: 'Kontrol ve hijyen', d: 'Altı aylık kontrol zamanı gelen hastaya hatırlatma.' },
      { t: 'Çok şubeli diş klinikleri', d: 'Şube bazında başvuru ve randevu tek ekranda.' },
    ],
    faq: [
      ['Diş kliniği CRM programı ne kadar?', `STOAIX’te her asistanla ücretsizdir. En küçük asistan aylık ${p('conf', 'text')}’dır; çoğu klinik ${p('rec', 'text')} olan yazılı Resepsiyonist ile başlar.`],
      ['Diş kliniği yazılımımızın yerine geçer mi?', 'Hayır. Hasta dosyası, tedavi planı ve fatura mevcut yazılımınızda kalır. STOAIX randevu öncesi başvuru ve takip sürecini yönetir.'],
      ['Diş kliniği randevu programı olarak kullanılabilir mi?', 'Randevuyu konuşma sırasında kullandığınız takvime ya da klinik yazılımına yazar ve hatırlatır. Ayrı bir randevu programına geçmeniz gerekmez.'],
      ['KVKK’ya uygun mu?', 'Veri sorumlusu kliniğinizdir; STOAIX veri işleyen olarak yazılı sözleşmeyle çalışır.'],
    ],
  },
};

export const disReklam = {
  id: 'dis-reklam', markets: TR,
  slugs: { tr: 'dis-klinigi-reklam' },
  price: { agent: 'mkt1', options: ['a'], adBudget: true },
  rules: ['ads', 'marketing', 'data'],
  related: ['ads', 'reklam-yasagi', 'dis-crm', 'receptionist'],
  tr: {
    name: 'Diş kliniği reklamı',
    card: 'Diş kliniği için kurallara uygun Meta ve Google reklamı; her başvuruya anında cevap.',
    serviceType: 'Diş klinikleri için reklam yönetimi',
    audience: 'Özel diş klinikleri ve ağız ve diş sağlığı poliklinikleri',
    title: 'Diş Kliniği Reklamı ve Reklam Ajansı: Kurallara Uygun | STOAIX',
    desc: 'Diş kliniği reklamı nasıl yapılır? Reklam yasağına uygun bilgilendirme, yurt dışına implant ve gülüş tasarımı kampanyaları, başvuruya hızlı cevap. Aylık $200’dan.',
    eyebrow: 'Diş kliniği · Reklam',
    h1: 'Diş kliniği reklamı: kurallara uygun, randevuyla biten.',
    lede: 'Diş kliniği reklamında iki sınır var: yurt içinde sağlık tanıtım yönetmeliği, sonrasında cevap hızı. STOAIX reklamı yönetmeliğin sınırlarıyla kurar ve her başvuruyu asistanınıza bağlar; implant soran hasta sabahı beklemez.',
    aka: ['diş kliniği reklam ajansı', 'diş kliniği reklam yönetimi', 'diş hekimi reklam', 'diş kliniği dijital pazarlama', 'diş kliniği Instagram reklamı'],
    facts: [
      ['Yurt içi', 'Bilgilendirme, arama motoru kaydı, kurallı içerik'],
      ['Yurt dışı', 'Yetki belgesiyle sponsorlu tanıtım (md. 8)'],
      ['Cevap', 'Her başvuruya STOAIX asistanı'],
      ['Reklam bütçesi', 'Doğrudan platforma siz ödersiniz'],
      ['Sözleşme', 'Aylık, taahhütsüz · 30 gün para iade'],
    ],
    whatH: 'Diş kliniği reklamı nasıl yapılır?',
    what: [
      'Yurt içinde diş kliniklerinin reklam yapması yasak, bilgilendirmesi serbesttir: hizmetler, hekimler, iletişim ve tedavi süreçleri doğru ve yanıltıcı olmayan biçimde anlatılabilir; fiyat, indirim, kampanya ve sponsorlu görsel paylaşım yapılamaz. Arama motorlarında anahtar kelime kaydı öne çıkarılmamak koşuluyla mümkündür.',
      'Yurt dışından hasta alan, uluslararası sağlık turizmi yetki belgesi olan diş klinikleri ise Türkçe dışındaki dillerde, Türkiye’yi hedeflemeden sponsorlu tanıtım yapabilir; implant ve gülüş tasarımı paketleri burada duyurulabilir.',
      'Her iki durumda da reklamın değeri başvurudan sonra belirlenir. STOAIX başvuruyu CRM’e alır, asistan hastaya saniyeler içinde cevap verir, raporda kaç başvurunun muayeneye döndüğü görünür.',
    ],
    steps: [
      { t: 'Kapsam', d: 'Yurt içi bilgilendirme mi, yetki belgesiyle yurt dışı mı; hangi tedaviler.' },
      { t: 'Uyumlu içerik', d: 'Metin ve görseller yönetmeliğe göre yazılır, yayın öncesi sizin onayınıza sunulur.' },
      { t: 'Yayın ve cevap hattı', d: 'Başvurular CRM’e ve asistana bağlanır.' },
      { t: 'Rapor', d: 'Harcama, başvuru, muayene ve tedavi tek sayfada.' },
    ],
    priceH: 'Diş kliniği reklam yönetimi ne kadar?',
    priceText: [
      `Meta reklam yönetimi aylık ${p('mkt1', 'a')}; Google ve arama görünürlüğü dahil Büyüme Yöneticisi aylık ${p('mkt2', 'a')}. Reklam bütçesi ayrıdır, doğrudan platforma ödenir.`,
      `Başvurulara cevap veren Resepsiyonist yazılı aylık ${p('rec', 'text')}. Kurulum ücreti yoktur, CRM ücretsizdir. ${MONEYBACK}`,
    ],
    sections: [{
      h: 'Diş kliniği reklamında yapılabilecekler ve yapılamayacaklar',
      table: {
        cols: ['Konu', 'Yurt içi', 'Yetki belgesiyle yurt dışı'],
        rows: [
          ['İmplant, zirkonyum fiyatı', 'Duyurulamaz', 'Koşullarla duyurulabilir'],
          ['İndirim, kampanya', 'Yasak', 'Serbest'],
          ['Önce-sonra gülüş fotoğrafı', 'Şartlı: onay, tarih, uyarı, etkileşim kapalı', 'Şartlı'],
          ['Instagram sponsorlu reklam', 'Yasak (açılışın ilk ayı hariç)', 'Türkçe dışı dilde, Türkiye hariç'],
          ['Google anahtar kelime kaydı', 'Öne çıkarılmadan', 'Serbest'],
        ],
      },
      after: [NOT_LEGAL],
      links: [{ t: 'Sağlıkta reklam yasağı: 2025 yönetmeliği', href: 'reklam-yasagi' }],
    }],
    uses: [
      { t: 'Yurt dışından implant hastası alan klinikler', d: 'Avrupa ve Orta Doğu’ya ayrı dilde kampanyalar.' },
      { t: 'Yurt içinde görünür olmak isteyenler', d: 'Google’da arama görünürlüğü ve bilgilendirici içerik.' },
      { t: 'Ajansla çalışıp randevu alamayanlar', d: 'Reklam ile cevap hattı aynı ekipte.' },
      { t: 'Yeni açılan diş klinikleri', d: 'Açılışın ilk ayındaki sponsorlu tanıtım hakkını planlı kullanmak.' },
    ],
    faq: [
      ['Diş kliniği reklam verebilir mi?', 'Yurt içinde reklam yasak, bilgilendirme serbesttir. Yetki belgeli sağlık turizmi kuruluşu olan diş klinikleri yurt dışına, Türkçe dışındaki dillerde sponsorlu tanıtım yapabilir. Yeni açılan klinik ilk ay sponsorlu tanıtım yapabilir.'],
      ['Diş kliniği reklam ajansı ne kadar?', `STOAIX’te Meta reklam yönetimi aylık ${p('mkt1', 'a')}, Google dahil aylık ${p('mkt2', 'a')}. Reklam bütçesi ayrıdır; kurulum ücreti ve taahhüt yoktur.`],
      ['Hasta sayısı garanti ediyor musunuz?', 'Hayır. Garanti edilen, her başvurunun hızla cevaplanması ve aylık iptal hakkıdır.'],
      ['Reklam metinlerini kim onaylar?', 'Siz. Her metin yayından önce onayınıza sunulur; son sorumluluk sağlık kuruluşundadır.'],
    ],
  },
};

export const sacCrm = {
  id: 'sac-crm', markets: TR,
  slugs: { tr: 'sac-ekimi-crm' },
  price: null,
  rules: ['data', 'software'],
  related: ['crm', 'st-crm', 'followup', 'sac-reklam'],
  tr: {
    name: 'Saç ekimi CRM',
    card: 'Saç ekimi kliniğine gelen yurt içi ve yurt dışı başvuruları fotoğraf, dil ve aşamasıyla takip eden CRM.',
    serviceType: 'Saç ekimi klinikleri için CRM ve hasta adayı takibi',
    audience: 'Saç ekimi klinikleri ve saç ekimi yapan sağlık turizmi kuruluşları',
    title: 'Saç Ekimi CRM: Hasta Adayı Takip Sistemi | STOAIX',
    desc: 'Saç ekimi CRM: yurt dışından gelen başvuruları dil, fotoğraf, ön değerlendirme ve operasyon tarihiyle takip edin. Asistanlarla ücretsiz.',
    eyebrow: 'Saç ekimi · CRM',
    h1: 'Saç ekimi başvurularının hepsi, fotoğrafı ve tarihiyle tek listede.',
    lede: 'Saç ekiminde başvuruların çoğu yurt dışından, WhatsApp’tan ve fotoğrafla gelir; ön değerlendirme, teklif, tarih ve transfer arasında haftalar geçer. STOAIX CRM her adayı bu yolculuk boyunca tek kayıtta tutar; asistanlar adayın dilinde cevap verir ve kaydı günceller.',
    aka: ['saç ekimi CRM yazılımı', 'saç ekimi hasta takip sistemi', 'saç ekimi lead takibi'],
    facts: [
      ['Kayıtta', 'Konuşmalar, aşama, randevu, notlar'],
      ['Dil', 'Asistan adayın dilinde konuşur'],
      ['Kanallar', 'WhatsApp, Instagram, web sitesi, telefon'],
      ['Fiyat', 'Her STOAIX asistanıyla ücretsiz'],
      ['Kullanıcı', 'Kullanıcı başı ücret yok'],
    ],
    whatH: 'Saç ekimi kliniğinde CRM neden gerekli?',
    what: [
      'Saç ekimi kliniğinde satış süreci uzundur ve çoğunlukla WhatsApp’ta geçer: aday fotoğraf gönderir, greft sayısı ve fiyat sorar, birkaç klinikten teklif alır, tarih için haftalarca düşünür. Bu süreçte takip unutulursa aday başka kliniğe gider.',
      'STOAIX CRM adayın bütün konuşmalarını ve aşamasını tek kayıtta tutar. Asistanlar ilk cevabı verir, ön değerlendirme bilgilerini toplar, teklif sonrası takip eder; koordinatör kaydı açtığında geçmişin tamamını görür.',
      'Greft sayısı ve tıbbi uygunluk değerlendirmesi hekimde kalır; asistan bu soruları hekime yönlendirir.',
    ],
    steps: [
      { t: 'Kanallar bağlanır', d: 'WhatsApp, Instagram ve web formu tek listeye akar.' },
      { t: 'Aşamalar', d: 'Yeni aday, fotoğraf alındı, ön değerlendirme, teklif, tarih, operasyon, kontrol.' },
      { t: 'Asistanlar takip eder', d: 'Teklif sonrası cevap vermeyen aday kurala göre tekrar yazılır.' },
      { t: 'Rakamlar', d: 'Ülke ve kanal bazında kaç aday teklife, kaçı operasyona döndü.' },
    ],
    priceH: 'Saç ekimi CRM ne kadar?',
    priceText: [
      'STOAIX CRM her asistanla ücretsiz gelir; lisans, kullanıcı başı ya da kurulum ücreti yoktur.',
      `Saç ekimi klinikleri çoğunlukla yazılı ${p('rec', 'text')} olan Resepsiyonist ve ${p('fol', 'text')} olan Takip Uzmanı ile başlar; operasyon öncesi Hazırlık Asistanı aylık ${p('pre', 'text')}’dan.`,
    ],
    uses: [
      { t: 'Yurt dışı odaklı klinikler', d: 'Birçok dilde gelen adaylar tek akışta.' },
      { t: 'Koordinatörü WhatsApp’tan çalışanlar', d: 'Konuşmalar kişisel telefondan ortak kayda geçer.' },
      { t: 'Reklam veren klinikler', d: 'Hangi kampanyanın operasyona döndüğü görünür.' },
      { t: 'Operasyon sonrası takip', d: 'Kontrol zamanları ve bakım mesajları aynı kayıtta.' },
    ],
    faq: [
      ['Saç ekimi CRM yazılımı ne kadar?', `STOAIX’te her asistanla ücretsizdir; kullanıcı başı ücret yoktur. Asistanlar aylık ${p('conf', 'text')}’dan başlar.`],
      ['Hastanın fotoğrafları nerede saklanır?', 'Konuşmayla birlikte CRM’de saklanır. Sağlık verisi özel nitelikli veridir; veri sorumlusu kliniğinizdir, STOAIX veri işleyen olarak yazılı sözleşmeyle çalışır.'],
      ['Asistan greft sayısı söyler mi?', 'Hayır. Greft sayısı ve tıbbi uygunluk hekimin değerlendirmesidir; asistan fotoğrafı ve bilgileri toplayıp hekime yönlendirir.'],
      ['Sağlık turizmi CRM’i ile farkı ne?', 'Aynı CRM’dir; saç ekimi kliniği için aşamalar ve sorular saç ekimi sürecine göre kurulur.'],
    ],
  },
};

export const sacReklam = {
  id: 'sac-reklam', markets: TR,
  slugs: { tr: 'sac-ekimi-reklam' },
  price: { agent: 'mkt1', options: ['a'], adBudget: true },
  rules: ['ads', 'marketing', 'data'],
  related: ['ads', 'reklam-yasagi', 'st-reklam', 'sac-crm'],
  tr: {
    name: 'Saç ekimi reklamı',
    card: 'Saç ekimi kliniği için yurt dışına, kurallara uygun Meta ve Google reklamı; başvuruya adayın dilinde cevap.',
    serviceType: 'Saç ekimi klinikleri için reklam yönetimi',
    audience: 'Saç ekimi klinikleri, özellikle yurt dışından hasta alanlar',
    title: 'Saç Ekimi Reklamı ve Reklam Ajansı: Yurt Dışına | STOAIX',
    desc: 'Saç ekimi reklamı nasıl yapılır? Reklam yasağı, yetki belgesiyle yurt dışı tanıtım, Meta ve Google kampanyaları, her başvuruya adayın dilinde cevap. Aylık $200’dan.',
    eyebrow: 'Saç ekimi · Reklam',
    h1: 'Saç ekimi reklamı: yurt dışına, kurallara uygun, cevabı hazır.',
    lede: 'Saç ekiminde hastaların büyük kısmı yurt dışından gelir ve reklamın sonucu ilk cevabın hızıyla belirlenir. STOAIX kampanyaları yönetmeliğin yurt dışı tanıtım kurallarıyla kurar, her başvuruyu adayın dilinde cevaplayan asistana bağlar.',
    aka: ['saç ekimi reklam ajansı', 'saç ekimi reklam yönetimi', 'saç ekimi dijital pazarlama', 'saç ekimi Instagram reklamı'],
    facts: [
      ['Yurt dışı', 'Yetki belgesiyle sponsorlu tanıtım (md. 8)'],
      ['Yurt içi', 'Bilgilendirme, arama motoru kaydı'],
      ['Cevap', 'Başvuruya adayın dilinde, saniyeler içinde'],
      ['Reklam bütçesi', 'Doğrudan platforma siz ödersiniz'],
      ['Sözleşme', 'Aylık, taahhütsüz · 30 gün para iade'],
    ],
    whatH: 'Saç ekimi reklamı nasıl yapılır?',
    what: [
      'Saç ekimi de sağlık hizmetidir; yurt içinde reklamı yasak, bilgilendirmesi serbesttir. Uluslararası sağlık turizmi yetki belgesi olan klinikler ise Türkçe dışındaki dillerde, Türkiye’yi hedeflemeden, HealthTürkiye logosuyla sponsorlu tanıtım yapabilir; paket ve kampanyalar burada duyurulabilir.',
      'Önce-sonra görselleri saç ekiminde en çok kullanılan içeriktir ve şartlıdır: hastanın açık onayı, karşılaştırılabilir ve tarihli görseller, etkileşime kapalı paylaşım gerekir. İşlem sırasında çekilen görüntüler paylaşılamaz.',
      'Reklamdan gelen aday çoğunlukla WhatsApp’a fotoğrafla yazar. STOAIX asistanı adayın dilinde cevap verir, bilgileri toplar, hekime ön değerlendirme için iletir ve adayı CRM’de takip eder.',
    ],
    steps: [
      { t: 'Pazarlar', d: 'Hangi ülkeler, hangi diller, aylık bütçe.' },
      { t: 'Uyumlu kreatif', d: 'Görsel ve metin yönetmelik ve platform kurallarına göre hazırlanır, onayınıza sunulur.' },
      { t: 'Yayın ve cevap hattı', d: 'Başvurular CRM’e ve adayın dilinde konuşan asistana bağlanır.' },
      { t: 'Rapor', d: 'Harcama, aday, teklif, operasyon tarihi tek sayfada.' },
    ],
    priceH: 'Saç ekimi reklam yönetimi ne kadar?',
    priceText: [
      `Meta reklam yönetimi aylık ${p('mkt1', 'a')}; Google ve arama görünürlüğü dahil Büyüme Yöneticisi aylık ${p('mkt2', 'a')}. Reklam bütçesi ayrıdır.`,
      `Başvurulara cevap veren Resepsiyonist yazılı aylık ${p('rec', 'text')}, teklif sonrası takip için Takip Uzmanı aylık ${p('fol', 'text')}. Kurulum ücreti yoktur, CRM ücretsizdir. ${MONEYBACK}`,
    ],
    sections: [{
      h: 'Saç ekimi reklamında kurallar',
      table: {
        cols: ['Konu', 'Yurt içi', 'Yetki belgesiyle yurt dışı'],
        rows: [
          ['Paket fiyatı, kampanya', 'Yasak', 'Duyurulabilir'],
          ['Önce-sonra fotoğrafı', 'Şartlı: onay, tarih, uyarı, etkileşim kapalı', 'Şartlı'],
          ['Operasyon sırasında video', 'Yasak', 'Yasak'],
          ['Sponsorlu Instagram reklamı', 'Yasak (açılışın ilk ayı hariç)', 'Türkçe dışı dilde, Türkiye hariç'],
        ],
      },
      after: [NOT_LEGAL],
      links: [{ t: 'Sağlıkta reklam yasağı: 2025 yönetmeliği', href: 'reklam-yasagi' }, { t: 'Sağlık turizmi reklam yönetimi', href: 'st-reklam' }],
    }],
    uses: [
      { t: 'Avrupa’ya açılan klinikler', d: 'Her dilde ayrı kampanya ve aynı hızda cevap.' },
      { t: 'Orta Doğu pazarı', d: 'Gece gelen başvurular sabahı beklemez.' },
      { t: 'Ajansla çalışıp operasyon artmayanlar', d: 'Reklam ile cevap ve takip aynı hatta.' },
      { t: 'Aracıya bağımlı olmak istemeyenler', d: 'Kendi kanalından düzenli aday akışı.' },
    ],
    faq: [
      ['Saç ekimi reklamı yasak mı?', 'Yurt içinde reklam yasak, bilgilendirme serbesttir. Yetki belgeli sağlık turizmi kuruluşu olan saç ekimi klinikleri yurt dışına, Türkçe dışındaki dillerde sponsorlu tanıtım yapabilir (yönetmelik md. 8).'],
      ['Saç ekimi reklam ajansı ne kadar?', `STOAIX’te Meta reklam yönetimi aylık ${p('mkt1', 'a')}, Google dahil aylık ${p('mkt2', 'a')}. Reklam bütçesi ayrıdır; taahhüt yoktur.`],
      ['Önce-sonra fotoğrafı kullanabilir miyiz?', 'Şartlı olarak: hastanın açık onayı, karşılaştırılabilir ve tarihli görseller, etkileşime kapalı paylaşım gerekir; yurt içinde uyarı notu eklenir. Platformun kendi kuralları ayrıca geçerlidir.'],
      ['Hasta sayısı garanti ediyor musunuz?', 'Hayır. Garanti edilen, her başvurunun hızla cevaplanması ve aylık iptal hakkıdır.'],
    ],
  },
};

export default [disCrm, disReklam, sacCrm, sacReklam];
