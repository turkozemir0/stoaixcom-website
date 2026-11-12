/* Sağlık turizmi kümesi + sağlıkta reklam yasağı (yalnız TR).
   Mevzuat: Sağlık Hizmetlerinde Tanıtım ve Bilgilendirme Faaliyetleri Hakkında Yönetmelik,
   RG 12.11.2025 / 33075 (29.07.2023 tarihli yönetmeliği yürürlükten kaldırdı). Metin genel bilgidir. */
import { p, INCLUDED, ANNUAL, TRIO } from './price.mjs';

const TR = ['tr'];
const MONEYBACK = 'Kurulumda birlikte yazılan başarı kriteri ilk 30 günde tutmazsa ücret iade edilir.';
const RG = 'https://www.resmigazete.gov.tr/eskiler/2025/11/20251112-2.htm';
const NOT_LEGAL = 'Bu bölüm genel bilgidir, hukuki görüş değildir; kampanya öncesi kendi hukuk danışmanınızla teyit edin.';

export const stYapayZeka = {
  id: 'st-yapay-zeka', markets: TR,
  slugs: { tr: 'saglik-turizmi-yapay-zeka' },
  price: { agent: 'rec', options: ['text', 'voice'], trio: true },
  rules: ['ai', 'data', 'ads'],
  related: ['st-call-center', 'st-crm', 'st-reklam', 'st-hasta-bulma'],
  tr: {
    name: 'Sağlık turizmi için yapay zekâ',
    card: 'Yurt dışından gelen hasta adayını kendi dilinde, gece gündüz karşılayan ve takip eden yapay zekâ ekibi.',
    serviceType: 'Sağlık turizmi için yapay zekâ asistanları',
    audience: 'Yurt dışından hasta kabul eden klinikler, hastaneler ve sağlık turizmi aracı kuruluşları',
    title: 'Sağlık Turizmi İçin Yapay Zekâ: Çok Dilli Asistan | STOAIX',
    desc: 'Sağlık turizmi için yapay zekâ: yurt dışı hasta adayına kendi dilinde 7/24 cevap, takip, CRM ve reklam yönetimi. Asistanlar aylık $200’dan, kurulum ücretsiz.',
    eyebrow: 'Sağlık turizmi · Yapay zekâ',
    h1: 'Sağlık turizminde hasta, cevabı ilk veren kliniğe gider.',
    lede: 'Yurt dışındaki hasta adayı aynı akşam birkaç kliniğe yazar; sizin mesainiz bittiğinde onun günü yeni başlıyor olabilir. STOAIX’in yapay zekâ asistanları adaya kendi dilinde saniyeler içinde cevap verir, fotoğraf ve bilgilerini toplar, takip eder ve ekibinize hazır bir dosya bırakır.',
    aka: ['sağlık turizmi yapay zekâ', 'medikal turizm yapay zekâ', 'sağlık turizmi otomasyonu', 'sağlık turizmi chatbot', 'uluslararası hasta asistanı'],
    facts: [
      ['Dil', 'Adayın yazdığı ya da konuştuğu dilde'],
      ['Saat', '7/24, saat dilimi fark etmez'],
      ['Kanallar', 'WhatsApp, Instagram, telefon, web sitesi'],
      ['Kayıt', 'Her aday CRM’de, ülke ve aşamasıyla'],
      ['Sözleşme', 'Aylık, taahhütsüz · 30 gün para iade'],
    ],
    whatH: 'Sağlık turizminde yapay zekâ ne iş görür?',
    what: [
      'Sağlık turizminde hasta yolculuğu uzun ve çok adımlıdır: ilk soru, fotoğraf ya da rapor, ön değerlendirme, fiyat teklifi, tarih, uçuş ve konaklama, tedavi, dönüş sonrası takip. Her adımda bir mesaj bekler; cevabın gecikmesi adayı başka ülkeye ya da başka kliniğe gönderir.',
      'STOAIX bu adımlara ayrı asistanlar koyar: ilk temasta Resepsiyonist, karar süresince Takip Uzmanı, tedavi öncesinde Hazırlık Asistanı, dönüşten sonra Bakım Asistanı. Hepsi adayın dilinde konuşur ve aynı CRM’e yazar.',
      'Tıbbi değerlendirme ve teklif hekiminizde ve hasta koordinatörünüzde kalır. Asistan, koordinatörün önüne eksiksiz bilgiyle gelmiş bir aday koyar.',
    ],
    steps: [
      { t: 'Ülke ve diller', d: 'Hangi pazarlardan hasta aldığınız, hangi dillerde konuşulacağı ve hangi tedavilerin anlatılacağı yazılır.' },
      { t: 'İlk temas', d: 'WhatsApp, Instagram, telefon ya da web; aday kendi dilinde, kendi saatinde cevap alır.' },
      { t: 'Ön değerlendirme dosyası', d: 'Fotoğraf, şikâyet, tarih aralığı ve bütçe gibi bilgiler toplanıp koordinatöre iletilir.' },
      { t: 'Takip ve hazırlık', d: 'Teklif sonrası takip, tedavi öncesi hazırlık, dönüş sonrası kontrol mesajları.' },
    ],
    priceH: 'Sağlık turizmi için yapay zekâ ne kadar?',
    priceText: [
      `İlk temasta çalışan Resepsiyonist yazılı aylık ${p('rec', 'text')}, sesli aylık ${p('rec', 'voice')}. Karar süresince takip yapan Takip Uzmanı aylık ${p('fol', 'text')}’dan; tedavi öncesi Hazırlık Asistanı ve sonrası Bakım Asistanı aylık ${p('pre', 'text')}’dan başlar.`,
      `Her asistana ayda ${INCLUDED} dahildir; dil başına ek ücret yoktur. Resepsiyonist, Takip Uzmanı ve Randevu Asistanı birlikte alınırsa yazılıda ${TRIO.text}, seslide ${TRIO.voice} indirim uygulanır. ${MONEYBACK}`,
    ],
    sections: [{
      h: 'Sağlık turizmi hattının parçaları',
      p: ['Arayan kişi çoğu zaman bunlardan birini arar: call center, CRM, reklam ya da hasta bulma. Hepsi aynı hattın parçasıdır; ayrı sayfalarda ayrıntısıyla anlatıldı.'],
      items: [
        { t: 'Sağlık turizmi call center', d: 'Yurt dışı aramalar ve mesajlar 7/24, adayın dilinde.' },
        { t: 'Sağlık turizmi CRM', d: 'Yabancı hasta takibi: ülke, dil, aşama, teklif, tarih tek kayıtta.' },
        { t: 'Sağlık turizmi reklam yönetimi', d: 'Yurt dışına, Türkçe dışındaki dillerde Meta ve Google kampanyaları.' },
        { t: 'Hasta bulma', d: 'Reklam, içerik, arama ve eski başvuru listesinden düzenli aday akışı.' },
      ],
      links: [
        { t: 'Sağlık turizmi call center', href: 'st-call-center' },
        { t: 'Sağlık turizmi CRM', href: 'st-crm' },
        { t: 'Sağlık turizmi reklam yönetimi', href: 'st-reklam' },
        { t: 'Sağlık turizmi hasta bulma', href: 'st-hasta-bulma' },
      ],
    }],
    uses: [
      { t: 'Saç ekimi klinikleri', d: 'Fotoğrafla ön değerlendirme, greft sorusu hekime, tarih ve transfer bilgisi asistanda.' },
      { t: 'Diş klinikleri', d: 'Gülüş tasarımı ve implant için gelen yurt dışı adaylar; röntgen ve fotoğraf toplanır.' },
      { t: 'Estetik ve obezite cerrahisi', d: 'Uzun karar süresi boyunca düzenli ve nazik takip; tıbbi soru hekime.' },
      { t: 'Göz ve tüp bebek merkezleri', d: 'Hassas iletişim, doğru belgeler, hızlı ekip aktarımı.' },
      { t: 'Hastanelerin uluslararası hasta birimleri', d: 'Çok branşlı talepleri doğru bölüme yönlendirme.' },
      { t: 'Aracı kuruluşlar', d: 'Birden fazla klinikle çalışan ekipler için tek akış.' },
    ],
    faq: [
      ['Sağlık turizminde yapay zekâ hangi dillerde konuşur?', 'Adayın yazdığı ya da konuştuğu dilde cevap verir. Hangi dillerin açık olacağı ve hangi durumda ekibe aktarılacağı kurulumda birlikte belirlenir.'],
      ['Sağlık turizmi yapay zekâ asistanı ne kadar?', `Resepsiyonist yazılı aylık ${p('rec', 'text')}, sesli aylık ${p('rec', 'voice')}. Dil başına ek ücret, kurulum ücreti yoktur; yıllık anlaşma ${ANNUAL} daha ucuzdur.`],
      ['Fiyat teklifi verir mi?', 'Sizin belirlediğiniz fiyat aralığını ve paket içeriğini anlatabilir. Kesin teklif ön değerlendirmeden sonra hekiminiz ya da koordinatörünüz tarafından verilir.'],
      ['Hasta koordinatörümüzün yerine mi geçer?', 'Hayır. Koordinatörün zamanını alan ilk cevapları, bilgi toplamayı ve takibi yapar; koordinatör karar aşamasındaki adayla konuşur.'],
      ['Yurt dışı hastanın verisi nasıl korunur?', 'Veri sorumlusu kliniğinizdir; STOAIX veri işleyen olarak KVKK’ya uygun yazılı sözleşmeyle çalışır. Avrupa’dan gelen hastalar için GDPR yükümlülükleri ayrıca değerlendirilir.'],
    ],
  },
};

export const stCallCenter = {
  id: 'st-call-center', markets: TR,
  slugs: { tr: 'saglik-turizmi-call-center' },
  price: { agent: 'rec', options: ['voice', 'text'], trio: true },
  rules: ['ai', 'recording', 'data'],
  related: ['cagri-merkezi', 'st-yapay-zeka', 'st-crm', 'receptionist'],
  tr: {
    name: 'Sağlık turizmi call center',
    card: 'Yurt dışından gelen arama ve mesajları 7/24, hastanın dilinde karşılayan yapay zekâ çağrı merkezi.',
    serviceType: 'Sağlık turizmi için çok dilli yapay zekâ çağrı merkezi',
    audience: 'Yurt dışından hasta kabul eden klinikler ve hastaneler',
    title: 'Sağlık Turizmi Call Center: 7/24 Çok Dilli | STOAIX',
    desc: 'Sağlık turizmi çağrı merkezi: yurt dışı hasta aramalarını ve WhatsApp mesajlarını yapay zekâ 7/24, hastanın dilinde karşılar. Sesli asistan aylık $300.',
    eyebrow: 'Sağlık turizmi · Call center',
    h1: 'Yurt dışından gelen arama, gece üçte de kendi dilinde açılır.',
    lede: 'Sağlık turizminde çağrı merkezi kurmak, birçok dil ve saat dilimi için vardiya demektir. STOAIX’in sesli ve yazılı asistanları bu hattı kendi senaryonuzla, gece gündüz aynı kalitede yürütür; karar gereken konuşma özetiyle koordinatörünüze geçer.',
    aka: ['sağlık turizmi çağrı merkezi', 'medikal turizm call center', 'uluslararası hasta çağrı merkezi', 'çok dilli çağrı merkezi'],
    facts: [
      ['Saat', '7/24, her saat diliminde'],
      ['Dil', 'Hastanın konuştuğu dilde'],
      ['Gelen', 'Arama, WhatsApp, Instagram, web'],
      ['Giden', 'Teklif sonrası takip, tarih teyidi'],
      ['Sözleşme', 'Aylık, taahhütsüz · 30 gün para iade'],
    ],
    whatH: 'Sağlık turizmi call center ne yapar?',
    what: [
      'Sağlık turizmi call center’ı, yurt dışından gelen hasta adaylarının ilk temasını ve takibini yürüten ekiptir: aramayı açar, soruyu cevaplar, ön değerlendirme için bilgi toplar, teklif sonrası adayı takip eder ve tarih kesinleştiğinde hazırlığı başlatır.',
      'Klasik modelde bu iş her dil için ayrı temsilci ve gece vardiyası ister. Yapay zekâ çağrı merkezinde aynı asistan adayın diline geçer; saat dilimi fark etmez, aynı anda birden fazla adayla konuşabilir.',
      'Asistanlar tıbbi tavsiye vermez ve teklif kesinleştirmez; bu kararlar hekiminizde ve koordinatörünüzde kalır.',
    ],
    steps: [
      { t: 'Senaryo ve diller', d: 'Tedaviler, paket içerikleri, fiyat aralıkları, hangi dillerde konuşulacağı.' },
      { t: 'Hat ve kanallar bağlanır', d: 'Uluslararası numaranız, WhatsApp ve Instagram hesabınız asistana yönlendirilir.' },
      { t: 'Gelen ve giden konuşmalar', d: 'Gelen talepler karşılanır; cevap vermeyen ve teklif bekleyen adaylar takip edilir.' },
      { t: 'Koordinatör devralır', d: 'Her adayın dosyası, konuşması ve sonraki adımı CRM’de.' },
    ],
    priceH: 'Sağlık turizmi call center ne kadar?',
    priceText: [
      `Gelen aramaları karşılayan sesli Resepsiyonist aylık ${p('rec', 'voice')}; WhatsApp ve Instagram için yazılı Resepsiyonist aylık ${p('rec', 'text')}. Teklif sonrası takip için Takip Uzmanı aylık ${p('fol', 'text')}’dan başlar.`,
      `Dil ve temsilci başı ücret yoktur; her asistana ayda ${INCLUDED} dahildir. ${MONEYBACK}`,
    ],
    compare: {
      h: 'Yapay zekâ call center ve dış kaynak çok dilli çağrı merkezi',
      intro: 'İki model de hattı açık tutar; fark maliyetin neye bağlı olduğunda ve tedavilerinizi ne kadar bildiğindedir.',
      cols: ['STOAIX yapay zekâ call center', 'Dış kaynak çağrı merkezi'],
      rows: [
        ['Dil', 'Adayın dili, ek ücret yok', 'Her dil için ayrı temsilci'],
        ['Gece ve hafta sonu', 'Dahil', 'Vardiya ücreti'],
        ['Tedavilerinizi bilir', 'Senaryonuzdan, her konuşmada aynı', 'Temsilciye göre değişir'],
        ['Kayıt', 'Her konuşma CRM’de, yazıya dökülmüş', 'Rapor sözleşmeye bağlı'],
        ['Maliyet', `Asistan başı aylık ${p('rec', 'voice')}’dan`, 'Temsilci, dakika ya da aday başı'],
      ],
    },
    uses: [
      { t: 'Saç ekimi', d: 'Avrupa ve Orta Doğu’dan akşam saatlerinde gelen aramalar.' },
      { t: 'Diş', d: 'Gülüş tasarımı ve implant paketleri için gelen sorular.' },
      { t: 'Estetik', d: 'Uzun karar süresinde düzenli takip; tıbbi soru hekime.' },
      { t: 'Hastane uluslararası birimleri', d: 'Doğru branşa yönlendirme ve belge toplama.' },
    ],
    faq: [
      ['Sağlık turizmi call center ne kadar?', `Sesli asistan aylık ${p('rec', 'voice')}, yazılı asistan aylık ${p('rec', 'text')}. Dil, temsilci ya da gece vardiyası için ek ücret yoktur; yıllık anlaşma ${ANNUAL} daha ucuzdur.`],
      ['Yurt dışı numarayla çalışır mı?', 'Mevcut numaranız asistana yönlendirilebilir; hangi numara ve ülke yapılandırmasının uygun olduğu kurulumda kontrol edilir.'],
      ['Aday insanla konuşmak isterse?', 'Konuşma özetiyle koordinatörünüze aktarılır. Mesai dışındaysa geri arama zamanı alınır ve CRM’e yazılır.'],
      ['Hastaya fiyat söyler mi?', 'Sizin belirlediğiniz fiyat aralığını anlatır. Yurt dışına yönelik tanıtımda indirim ve kampanya, yönetmeliğin 8. maddesindeki koşullarla mümkündür; kesin teklif koordinatörünüzdedir.'],
    ],
  },
};

export const stCrm = {
  id: 'st-crm', markets: TR,
  slugs: { tr: 'saglik-turizmi-crm' },
  price: null,
  rules: ['data', 'software'],
  related: ['crm', 'st-yapay-zeka', 'st-call-center', 'followup'],
  tr: {
    name: 'Sağlık turizmi CRM',
    card: 'Yurt dışı hasta adaylarını ülke, dil, aşama, teklif ve tarihle takip eden CRM; STOAIX asistanlarıyla ücretsiz.',
    serviceType: 'Sağlık turizmi CRM yazılımı ve yabancı hasta takip sistemi',
    audience: 'Yurt dışından hasta kabul eden klinikler, hastaneler ve aracı kuruluşlar',
    title: 'Sağlık Turizmi CRM: Yabancı Hasta Takip Sistemi | STOAIX',
    desc: 'Sağlık turizmi CRM yazılımı: yabancı hasta adayını ülke, dil, teklif ve tarihle takip edin; WhatsApp, Instagram ve telefon tek yerde. Asistanlarla ücretsiz.',
    eyebrow: 'Sağlık turizmi · CRM',
    h1: 'Yabancı hasta adayının bütün yolculuğu tek kayıtta.',
    lede: 'Sağlık turizminde aday bilgisi WhatsApp’ta, fotoğraf koordinatörün telefonunda, teklif e-postada, tarih bir Excel’de durur. STOAIX CRM bunları adayın kaydında birleştirir; asistanlar konuştukça kayıt kendini günceller.',
    aka: ['sağlık turizmi CRM yazılımı', 'yabancı hasta takip sistemi', 'uluslararası hasta takip sistemi', 'medikal turizm CRM', 'hasta koordinasyon yazılımı'],
    facts: [
      ['Kayıtta', 'Konuşmalar, aşama, randevu, notlar'],
      ['Kanallar', 'WhatsApp, Instagram, web sitesi, telefon'],
      ['Güncelleyen', 'Asistanlarınız ve ekibiniz'],
      ['Fiyat', 'Her STOAIX asistanıyla ücretsiz'],
      ['Kullanıcı', 'Kullanıcı başı ücret yok'],
    ],
    whatH: 'Sağlık turizmi CRM’i ne işe yarar?',
    what: [
      'Sağlık turizmi CRM’i, yurt dışından gelen hasta adayının ilk mesajından tedavi sonrası kontrole kadar her adımını takip eden yazılımdır. Hangi ülkeden geldiği, hangi dilde konuştuğu, hangi tedaviyi sorduğu, teklifin verilip verilmediği ve tarihin kesinleşip kesinleşmediği tek bakışta görünür.',
      'Farkı, kaydın elle doldurulmamasıdır. STOAIX asistanları adayla konuşurken konuşmayı, toplanan bilgiyi ve aşamayı CRM’e yazar; koordinatör adayı devraldığında geçmişin tamamını görür.',
      'Hasta dosyası ve tıbbi kayıtlar kendi hastane ya da klinik yazılımınızda kalır. STOAIX CRM tedavi öncesindeki satış ve koordinasyon sürecini yönetir.',
    ],
    steps: [
      { t: 'Kanallar bağlanır', d: 'WhatsApp, Instagram, web formları ve aramalar tek listeye akar.' },
      { t: 'Aşamalar tanımlanır', d: 'Yeni aday, bilgi toplandı, teklif verildi, tarih kesin, tedavi, kontrol; kendi sürecinize göre.' },
      { t: 'Asistanlar yazar', d: 'Konuşma, bilgi ve aşama değişikliği otomatik kaydedilir.' },
      { t: 'Rakamları görürsünüz', d: 'Kanal ve aşama bazında kaç aday geldi, kaçı teklife, kaçı tarihe döndü.' },
    ],
    priceH: 'Sağlık turizmi CRM ne kadar?',
    priceText: [
      'STOAIX CRM her asistanla ücretsiz gelir; lisans, kullanıcı başı ya da kurulum ücreti yoktur. Tek başına satılmaz.',
      `Asistanlar aylık ${p('conf', 'text')}’dan başlar. Sağlık turizmi yapan klinikler çoğunlukla yazılı ${p('rec', 'text')} olan Resepsiyonist ve ${p('fol', 'text')} olan Takip Uzmanı ile başlar.`,
    ],
    uses: [
      { t: 'Koordinatörü WhatsApp’tan çalışan klinikler', d: 'Konuşmalar kişisel telefondan ortak kayda geçer; koordinatör değişince bilgi kaybolmaz.' },
      { t: 'Birden fazla pazara reklam verenler', d: 'Hangi ülkeden, hangi kampanyadan gelen adayın tarihe döndüğü görünür.' },
      { t: 'Aracı kuruluşlar', d: 'Adayların hangi klinikte, hangi aşamada olduğu tek listede.' },
      { t: 'Excel’den çıkmak isteyenler', d: 'Gün sonunda elle doldurulmayan, kendini güncelleyen liste.' },
    ],
    faq: [
      ['Sağlık turizmi CRM yazılımı ne kadar?', `STOAIX’te her asistanla ücretsizdir; kullanıcı başı ücret yoktur. En küçük asistan aylık ${p('conf', 'text')}’dır.`],
      ['Yabancı hasta takip sistemi ile CRM aynı şey mi?', 'Aramada ikisi de aynı ihtiyacı anlatır: yurt dışı adayın ilk temastan tedaviye kadar takibi. STOAIX CRM bu işi asistanlarla birlikte, kayıt elle doldurulmadan yapar.'],
      ['Hastane yazılımımızın yerine geçer mi?', 'Hayır. Tıbbi kayıt ve fatura kendi sisteminizde kalır. STOAIX CRM tedavi öncesi süreci yönetir; sisteminize bağlanıp bağlanamayacağı tanışma görüşmesinde kontrol edilir.'],
      ['Veriler nerede tutulur, KVKK’ya uygun mu?', 'Veri sorumlusu kliniğinizdir; STOAIX veri işleyen olarak yazılı sözleşmeyle çalışır. Avrupa’dan gelen hastalar için GDPR yükümlülükleri ayrıca değerlendirilir.'],
    ],
  },
};

export const stReklam = {
  id: 'st-reklam', markets: TR,
  slugs: { tr: 'saglik-turizmi-reklam-yonetimi' },
  price: { agent: 'mkt1', options: ['a'], adBudget: true },
  rules: ['ads', 'marketing', 'data'],
  related: ['ads', 'growth', 'reklam-yasagi', 'st-hasta-bulma'],
  tr: {
    name: 'Sağlık turizmi reklam yönetimi',
    card: 'Yurt dışına, Türkçe dışındaki dillerde Meta ve Google reklamları; her başvuruya anında cevap.',
    serviceType: 'Sağlık turizmi için reklam yönetimi',
    audience: 'Yurt dışından hasta almak isteyen, uluslararası sağlık turizmi yetki belgeli klinikler ve hastaneler',
    title: 'Sağlık Turizmi Reklam Yönetimi ve Ajansı | STOAIX',
    desc: 'Sağlık turizmi reklam yönetimi: yurt dışına Meta ve Google kampanyaları, 2025 yönetmeliğine uygun kurulum, her başvuruya yapay zekâ cevabı. Aylık $200’dan.',
    eyebrow: 'Sağlık turizmi · Reklam yönetimi',
    h1: 'Yurt dışına reklam verin; gelen her başvuru aynı dakika cevaplansın.',
    lede: 'Sağlık turizmi reklamında bütçe çoğu zaman tıklamadan sonra kaybolur: başvuru Türkiye’de gece yarısı gelir, sabah cevaplanır, aday çoktan başka kliniğe yazmıştır. STOAIX reklamı ve cevabı aynı hatta kurar; kampanyalar 2025 yönetmeliğinin yurt dışı tanıtım kurallarıyla yazılır.',
    aka: ['sağlık turizmi reklam ajansı', 'sağlık turizmi reklam', 'medikal turizm reklam ajansı', 'sağlık turizmi dijital pazarlama', 'yurt dışı hasta reklamı'],
    facts: [
      ['Platformlar', 'Meta (Instagram, Facebook); Google Büyüme Yöneticisi’nde'],
      ['Hedef', 'Yurt dışı, Türkçe dışındaki dillerde'],
      ['Cevap', 'Başvuruya STOAIX asistanı, adayın dilinde'],
      ['Reklam bütçesi', 'Doğrudan platforma siz ödersiniz'],
      ['Sözleşme', 'Aylık, taahhütsüz · 30 gün para iade'],
    ],
    whatH: 'Sağlık turizmi reklam yönetimi neleri kapsar?',
    what: [
      'Hedef ülkeleri ve tedavileri seçmek, her pazar için o dilde reklam metni ve görseli hazırlamak, kampanyaları kurmak, bütçeyi her gün başvuruya göre ayarlamak ve ayda bir sonucu raporlamak.',
      'Reklam ajansından farkı, başvurunun reklamla bitmemesidir. Reklamdan gelen her aday STOAIX CRM’e düşer ve asistanınız onun dilinde saniyeler içinde cevap verir. Raporda tıklama değil, kaç adayın teklife ve tarihe döndüğü görünür.',
      'Türkiye’de sağlık hizmetlerinde reklam yasaktır; yetki belgeli uluslararası sağlık turizmi kuruluşlarının yurt dışına yönelik tanıtımı ise yönetmeliğin 8. maddesinde ayrıca düzenlenmiştir. Kampanyalar bu sınırlarla kurulur.',
    ],
    steps: [
      { t: 'Pazar ve tedavi', d: 'Hangi ülkeler, hangi diller, hangi tedaviler ve aylık bütçe.' },
      { t: 'Uyum kontrolü', d: 'Yetki belgesi, HealthTürkiye logosu, Türkiye’nin hedeflemeden çıkarılması, görsel kuralları.' },
      { t: 'Yayın ve cevap hattı', d: 'Kampanyalar yayına girer; başvurular CRM’e ve asistana bağlanır.' },
      { t: 'Günlük iyileştirme, aylık rapor', d: 'Bütçe başvuru ve randevuya göre ayarlanır; harcama, aday, teklif, tarih tek sayfada.' },
    ],
    priceH: 'Sağlık turizmi reklam yönetimi ne kadar?',
    priceText: [
      `Meta (Instagram ve Facebook) reklam yönetimi aylık ${p('mkt1', 'a')}; Meta’ya ek olarak Google reklamları ve arama görünürlüğü Büyüme Yöneticisi’nde aylık ${p('mkt2', 'a')}. Reklam bütçesi ayrıdır, doğrudan platforma siz ödersiniz.`,
      `Başvurulara adayın dilinde cevap veren Resepsiyonist yazılı aylık ${p('rec', 'text')}. Kurulum ücreti yoktur, CRM ücretsizdir. ${MONEYBACK}`,
    ],
    sections: [{
      h: 'Sağlık turizmi reklamında 2025 kuralları',
      p: [
        'Sağlık Hizmetlerinde Tanıtım ve Bilgilendirme Faaliyetleri Hakkında Yönetmelik 12 Kasım 2025’te Resmî Gazete’de yayımlandı ve 2023 tarihli yönetmeliği yürürlükten kaldırdı. Yurt dışına yönelik tanıtımda öne çıkan kurallar şunlar:',
      ],
      items: [
        { t: 'Kimler yapabilir', d: 'Uluslararası sağlık turizmi yetki belgesi olan kuruluşlar.' },
        { t: 'Dil ve hedef', d: 'Türkçe dışındaki dillerde, yurt dışına yönelik platformlarda; Türkiye hedeflenmez.' },
        { t: 'Sponsorlu tanıtım', d: 'Yurt dışına yönelik sponsorlu tanıtım yapılabilir; HealthTürkiye logosu kullanılır.' },
        { t: 'İndirim ve kampanya', d: 'Yurt dışına yönelik tanıtımda indirim ve kampanya duyurulabilir; yurt içinde yasaktır.' },
      ],
      after: [NOT_LEGAL],
      links: [{ t: 'Sağlıkta reklam yasağı: 2025 yönetmeliği', href: 'reklam-yasagi' }, { t: 'Resmî Gazete metni', href: RG }],
    }],
    uses: [
      { t: 'Saç ekimi', d: 'Avrupa ve Orta Doğu’ya ayrı kampanyalar, her dilde aynı hızda cevap.' },
      { t: 'Diş', d: 'Gülüş tasarımı ve implant paketleri; röntgen ve fotoğraf asistan tarafından toplanır.' },
      { t: 'Estetik ve obezite', d: 'Uzun karar süresi; reklamdan gelen aday haftalarca takip edilir.' },
      { t: 'Yeni yetki belgesi alan kuruluşlar', d: 'İlk pazar testinden düzenli aday akışına.' },
    ],
    faq: [
      ['Sağlık turizmi reklam yönetimi ne kadar?', `Meta reklam yönetimi aylık ${p('mkt1', 'a')}, Google dahil Büyüme Yöneticisi aylık ${p('mkt2', 'a')}. Reklam bütçesi ayrıdır; kurulum ücreti ve taahhüt yoktur.`],
      ['Sağlık turizmi reklamı serbest mi?', 'Yetki belgeli uluslararası sağlık turizmi kuruluşları, 12 Kasım 2025 tarihli yönetmeliğin 8. maddesine göre yurt dışına, Türkçe dışındaki dillerde sponsorlu tanıtım yapabilir. Türkiye hedeflenemez, HealthTürkiye logosu kullanılır. Bu genel bilgidir, hukuki görüş değildir.'],
      ['Reklam ajansından farkınız ne?', 'Reklam başvuruyla bitmez: her başvuruya STOAIX asistanı adayın dilinde cevap verir, aday CRM’de takip edilir. Raporda tıklama değil, teklif ve tarih görünür.'],
      ['Reklam hesabı kimin?', 'Sizin. Kampanyalar kliniğinizin hesabında çalışır, bütçeyi platforma siz ödersiniz.'],
      ['Hasta sayısı garanti ediyor musunuz?', 'Hayır. Sonuç pazara, tedaviye ve bütçeye bağlıdır. Garanti edilen, her başvurunun hızla cevaplanması ve aylık iptal hakkıdır.'],
    ],
  },
};

export const stHastaBulma = {
  id: 'st-hasta-bulma', markets: TR,
  slugs: { tr: 'saglik-turizmi-hasta-bulma' },
  price: { agent: 'mkt1', options: ['a'], adBudget: true },
  rules: ['ads', 'marketing', 'data'],
  related: ['st-reklam', 'st-yapay-zeka', 'reactivation', 'growth'],
  tr: {
    name: 'Sağlık turizmi hasta bulma',
    card: 'Yurt dışından düzenli hasta adayı akışı: reklam, arama görünürlüğü, eski başvurular ve hızlı cevap.',
    serviceType: 'Sağlık turizmi için hasta adayı kazanımı',
    audience: 'Yurt dışından hasta almak isteyen klinikler ve hastaneler',
    title: 'Sağlık Turizmi Hasta Bulma: Yurt Dışından Hasta | STOAIX',
    desc: 'Sağlık turizminde yurt dışından hasta nasıl bulunur? Reklam, Google görünürlüğü, eski başvuru listesi ve 7/24 cevap; dört kanal tek hatta. Aylık $200’dan.',
    eyebrow: 'Sağlık turizmi · Hasta bulma',
    h1: 'Yurt dışından hasta bulmanın dört yolu, tek hatta.',
    lede: 'Yurt dışından hasta bulmak için çoğu klinik önce reklam bütçesini artırır. Oysa çoğu zaman en ucuz aday zaten gelmiş ama cevapsız kalmış olandır. Bu sayfa dört kanalı ucuzdan pahalıya sıralar ve STOAIX’in her birinde ne yaptığını anlatır.',
    aka: ['yurt dışından hasta bulma', 'sağlık turizmi hasta kazanımı', 'yabancı hasta bulma', 'medikal turizm lead'],
    facts: [
      ['1. kanal', 'Gelen başvuruya hızlı cevap'],
      ['2. kanal', 'Eski başvuru listesini canlandırma'],
      ['3. kanal', 'Google ve yapay zekâ aramalarında görünürlük'],
      ['4. kanal', 'Yurt dışına reklam'],
      ['Sözleşme', 'Aylık, taahhütsüz · 30 gün para iade'],
    ],
    whatH: 'Sağlık turizminde hasta nereden bulunur?',
    what: [
      'Yurt dışı hasta adayı dört yoldan gelir: reklam, arama (Google ve giderek artan biçimde ChatGPT gibi yapay zekâ asistanları), sosyal medya içeriği ve tavsiye. Aracı kuruluşlar da bir kaynaktır ama komisyonla çalışır.',
      'Hangi kanaldan gelirse gelsin aday birkaç kliniğe aynı anda yazar. Bu yüzden hasta bulmanın ilk adımı yeni kanal açmak değil, gelen adaya ilk cevap veren klinik olmaktır.',
      'İkinci ucuz kaynak eski başvuru listesidir: geçmişte yazmış ama dönülmemiş ya da karar vermemiş adaylar. Onaylı kişilere yeniden ulaşmak, yeni reklamdan çoğu zaman daha ucuzdur.',
    ],
    steps: [
      { t: 'Cevap hattını kurun', d: 'Gelen her aday adayın dilinde, saniyeler içinde karşılanır: Resepsiyonist.' },
      { t: 'Eski listeyi çalışın', d: 'Dönülmemiş başvurular, onayı olanlarla yeniden konuşmaya açılır: Canlandırma Uzmanı.' },
      { t: 'Arama görünürlüğü', d: 'Hedef dillerde Google ve yapay zekâ aramalarında görünür olun: Büyüme Yöneticisi.' },
      { t: 'Reklamı ölçekleyin', d: 'Cevap hattı hazırken yurt dışı reklam bütçesi artırılır: Reklam Yöneticisi.' },
    ],
    priceH: 'Sağlık turizminde hasta bulma maliyeti',
    priceText: [
      `Meta reklam yönetimi aylık ${p('mkt1', 'a')}; Google ve arama görünürlüğü dahil Büyüme Yöneticisi aylık ${p('mkt2', 'a')}. Reklam bütçesi ayrıdır, doğrudan platforma ödenir.`,
      `Cevap hattı için Resepsiyonist yazılı aylık ${p('rec', 'text')}, eski liste için Canlandırma Uzmanı aylık ${p('react', 'text')}. Kurulum ücreti yoktur, CRM ücretsizdir. ${MONEYBACK}`,
    ],
    compare: {
      h: 'Hasta bulma kanalları',
      intro: 'Kanalları yan yana koymak bütçenin nereye gideceğini netleştirir. Maliyet ve hız pazara göre değişir; aşağıdakiler genel eğilimdir.',
      cols: ['Kanal', 'Ne zaman sonuç verir', 'Ne gerekir'],
      rows: [
        ['Gelen adaya hızlı cevap', 'Hemen', 'Çok dilli 7/24 cevap hattı'],
        ['Eski başvuru listesi', 'İlk haftalarda', 'Liste ve iletişim onayı'],
        ['Google ve yapay zekâ aramaları', 'Aylar içinde birikerek', 'Hedef dilde içerik ve teknik SEO'],
        ['Yurt dışına reklam', 'Yayından sonra', 'Yetki belgesi, bütçe, uyumlu kreatif'],
        ['Aracı kuruluş', 'Anlaşmaya göre', 'Komisyon'],
      ],
    },
    uses: [
      { t: 'Reklamı artırdığı halde hasta artmayan klinikler', d: 'Sorun çoğu zaman bütçe değil, cevap hızıdır.' },
      { t: 'Aracıya bağımlı olmak istemeyenler', d: 'Kendi kanallarından düzenli aday akışı.' },
      { t: 'Yıllardır başvuru toplayanlar', d: 'Hiç dönülmemiş binlerce kayıt, onaylı olanlarla yeniden açılır.' },
      { t: 'Yeni pazara açılanlar', d: 'Önce küçük bütçeyle test, sonra ölçek.' },
    ],
    faq: [
      ['Sağlık turizminde yurt dışından hasta nasıl bulunur?', 'Dört yoldan: gelen adaya ilk cevap veren olmak, eski başvuru listesini yeniden çalışmak, hedef dillerde Google ve yapay zekâ aramalarında görünmek, yurt dışına reklam vermek. En ucuzundan başlamak bütçeyi korur.'],
      ['Hasta başına mı ücret alıyorsunuz?', 'Hayır. Asistan ve yönetim ücretleri sabit ve aylıktır; hasta ya da başvuru başı komisyon yoktur.'],
      ['Eski adaylara mesaj atmak yasal mı?', 'Kampanya ve tanıtım mesajı ticari elektronik iletidir ve onay ister; Türkiye’deki kişiler için İYS’de kayıtlı onay gerekir. Mevcut talebe cevap ve bilgilendirme ise onay gerektirmez. Canlandırma yalnız onayı olan kişilere kurulur.'],
      ['Hasta sayısı garanti ediyor musunuz?', 'Hayır. Garanti edilen, her başvurunun hızla cevaplanması ve kurulumda yazılan başarı kriteri tutmazsa ilk 30 günde ücret iadesidir.'],
    ],
  },
};

export const reklamYasagi = {
  id: 'reklam-yasagi', markets: TR,
  slugs: { tr: 'saglikta-reklam-yasagi' },
  price: { agent: 'mkt1', options: ['a'], adBudget: true },
  rules: ['ads', 'marketing', 'reviews'],
  related: ['ads', 'st-reklam', 'dis-reklam', 'sac-reklam'],
  tr: {
    name: 'Sağlıkta reklam yasağı',
    card: '12 Kasım 2025 yönetmeliğine göre klinikler neyi tanıtabilir, neyi yapamaz; yurt içi ve yurt dışı ayrımıyla.',
    serviceType: 'Sağlık tanıtım mevzuatına uygun klinik reklam yönetimi',
    audience: 'Türkiye’deki özel klinikler, muayenehaneler, hastaneler ve sağlık turizmi kuruluşları',
    title: 'Sağlıkta Reklam Yasağı 2025: Klinikler Ne Yapabilir? | STOAIX',
    desc: 'Sağlıkta reklam yasağı ve 12 Kasım 2025 tanıtım yönetmeliği: fiyat, kampanya, önce-sonra, sponsorlu paylaşım ve sağlık turizmi istisnası. Diş ve saç ekimi için özet.',
    eyebrow: 'Mevzuat · Sağlıkta tanıtım',
    proof: 'Kaynak: Resmî Gazete, 12.11.2025, sayı 33075',
    h1: 'Sağlıkta reklam yasağı: 2025 yönetmeliğiyle neler değişti?',
    lede: 'Türkiye’de sağlık hizmetlerinde reklam yasaktır, bilgilendirme serbesttir. 12 Kasım 2025’te yayımlanan Sağlık Hizmetlerinde Tanıtım ve Bilgilendirme Faaliyetleri Hakkında Yönetmelik bu sınırı yeniden çizdi ve 2023 yönetmeliğini yürürlükten kaldırdı. Bu sayfa kliniklerin en çok sorduğu soruları yönetmelik metnine göre özetler.',
    aka: ['sağlık reklam yasağı', 'sağlıkta tanıtım yönetmeliği', 'diş kliniği reklam yasağı', 'saç ekimi reklam yasağı', 'sağlık turizmi reklam yönetmeliği', 'doktor reklam yasağı'],
    facts: [
      ['Yönetmelik', 'Sağlık Hizmetlerinde Tanıtım ve Bilgilendirme Faaliyetleri'],
      ['Yayım', 'Resmî Gazete, 12.11.2025, sayı 33075'],
      ['Kaldırılan', '29.07.2023 tarihli yönetmelik'],
      ['Temel kural', 'Reklam yasak, bilgilendirme serbest'],
      ['İstisna', 'Yetki belgeli sağlık turizmi, yurt dışına (md. 8)'],
    ],
    whatH: 'Reklam ile bilgilendirme arasındaki fark',
    what: [
      'Yönetmeliğe göre sağlık kuruluşları ve sağlık meslek mensupları reklam yapamaz; hizmetleri hakkında doğru, kanıta dayalı, yanıltıcı olmayan bilgilendirme yapabilir. Kuruluşun adı, adresi, iletişim bilgileri, branşları, hekimleri, uzmanlık alanları ve sunduğu hizmetler bilgilendirme kapsamındadır.',
      'Talep yaratmaya, hastayı yönlendirmeye ya da haksız rekabete yol açan içerik reklam sayılır: fiyat ve indirim duyurusu, kampanya, hediye ve teşvik, “en iyi” gibi üstünlük iddiaları, hasta teşekkürlerinin tanıtım amacıyla paylaşılması.',
      'Kuralın arkasındaki amaç hastayı ticari yönlendirmeden korumaktır. Bir içeriğin reklam mı bilgilendirme mi olduğu metne, hedefe ve kanala göre değerlendirilir.',
    ],
    steps: [
      { t: 'Kanalınızı belirleyin', d: 'Web sitesi, sosyal medya, arama motoru, mesaj; her biri için kural farklı.' },
      { t: 'Hedefi belirleyin', d: 'Yurt içi mi, yetki belgesiyle yurt dışı mı? Fiyat ve kampanya kuralı buna göre değişir.' },
      { t: 'İçeriği kontrol edin', d: 'Fiyat, indirim, önce-sonra, hasta görseli, üstünlük iddiası, uyarı notu.' },
      { t: 'Kayıt tutun', d: 'Hasta onayları, görsel tarihleri ve yetki belgesi denetimde istenir.' },
    ],
    priceH: 'Kurallara uygun reklam yönetimi ne kadar?',
    priceText: [
      `STOAIX Reklam Yöneticisi aylık ${p('mkt1', 'a')}; kampanyaları bu yönetmeliğin sınırlarıyla kurar ve her metni yayın öncesi sizin onayınıza sunar. Google dahil Büyüme Yöneticisi aylık ${p('mkt2', 'a')}. Reklam bütçesi ayrıdır.`,
      'Son onay ve hukuki sorumluluk sağlık kuruluşundadır; şüpheli durumlarda hukuk danışmanınızın görüşü esas alınır.',
    ],
    sections: [{
      h: 'Yurt içinde neler yapılamaz?',
      p: ['Yönetmeliğin yurt içine yönelik tanıtımda öne çıkan yasakları:'],
      items: [
        { t: 'Fiyat, indirim, kampanya', d: 'Yurt içine yönelik tanıtımda fiyat, indirim ve kampanya duyurulamaz.' },
        { t: 'Hediye ve teşvik', d: 'Hastaya hediye ve benzeri teşvikler sunulamaz.' },
        { t: 'İzinsiz mesaj', d: 'Onayı olmayan kişilere tanıtım amaçlı mesaj ve arama yapılamaz.' },
        { t: 'Hasta teşekkürleri', d: 'Hasta teşekkür ve yorumları tanıtım amacıyla paylaşılamaz.' },
        { t: 'Sponsorlu görsel paylaşım', d: 'Ücretli ya da sponsorlu görsel paylaşım yapılamaz; açılıştan sonraki ilk ay için ayrı bir düzenleme vardır.' },
        { t: 'İşlem sırasında görüntü', d: 'Tıbbi işlem sırasında çekilen görüntüler paylaşılamaz.' },
      ],
    }, {
      h: 'Neler serbest?',
      alt: true,
      p: ['Yönetmelik bilgilendirmeyi serbest bırakır ve bazı kanalları açıkça düzenler:'],
      items: [
        { t: 'Kurumsal bilgi', d: 'Kuruluş adı, adres, iletişim, branşlar, hekimler, hizmetler; doğru ve kanıta dayalı olarak.' },
        { t: 'Arama motoru kaydı', d: 'Arama motorlarında anahtar kelime kaydı, öne çıkarılmamak koşuluyla yapılabilir.' },
        { t: 'Açılış dönemi', d: 'Yeni açılan kuruluş, faaliyete geçtiği ilk ay sponsorlu tanıtım yapabilir.' },
        { t: 'Önce-sonra görseli (şartlı)', d: 'Hastanın açık onayı, karşılaştırılabilir ve tarihli görseller, etkileşime kapalı paylaşım ve yurt içinde “sonuçlar kişiden kişiye değişebilir” uyarısıyla.' },
        { t: 'Hastanın sorusuna cevap', d: 'Hastanın doğrudan sorduğu soruya birebir cevap bilgilendirmedir; fiyatın nasıl paylaşılacağını hukuk danışmanınızla netleştirin.' },
      ],
    }, {
      h: 'Sağlık turizmi istisnası (md. 8)',
      p: [
        'Uluslararası sağlık turizmi yetki belgesi olan kuruluşlar, yurt dışına yönelik platformlarda ve Türkçe dışındaki dillerde sponsorlu tanıtım yapabilir. Bu tanıtımda Türkiye hedeflenemez ve HealthTürkiye logosu kullanılır. Yurt dışına yönelik tanıtımda indirim ve kampanya duyurulabilir.',
      ],
      links: [{ t: 'Sağlık turizmi reklam yönetimi', href: 'st-reklam' }],
    }, {
      h: 'Branşlara göre en sık sorulanlar',
      alt: true,
      table: {
        cols: ['Soru', 'Yurt içi', 'Yetki belgesiyle yurt dışı'],
        rows: [
          ['Diş kliniği implant fiyatı reklamda yazılabilir mi?', 'Hayır', 'Koşullarla evet'],
          ['Saç ekimi önce-sonra fotoğrafı paylaşılabilir mi?', 'Şartlı: onay, tarih, uyarı, etkileşim kapalı', 'Şartlı, md. 7 ve 8 koşullarıyla'],
          ['Instagram’da sponsorlu reklam verilebilir mi?', 'Hayır (açılışın ilk ayı hariç)', 'Evet, Türkçe dışı dilde, Türkiye hariç'],
          ['Google’da anahtar kelime kaydı yapılabilir mi?', 'Evet, öne çıkarılmadan', 'Evet'],
          ['Kampanya ve indirim duyurulabilir mi?', 'Hayır', 'Evet'],
          ['Hasta yorumu tanıtımda kullanılabilir mi?', 'Hayır', 'Yönetmelik ve platform kurallarına göre değerlendirilmeli'],
        ],
      },
      after: [NOT_LEGAL],
      links: [{ t: 'Diş kliniği reklamı', href: 'dis-reklam' }, { t: 'Saç ekimi reklamı', href: 'sac-reklam' }],
    }, {
      h: 'Yaptırımlar',
      p: [
        'Yönetmeliğin 12. maddesi aykırılık hâlinde idari para cezası, içeriğe erişimin 5651 sayılı Kanun çerçevesinde engellenmesi ve diğer idari yaptırımları düzenler. Ceza tutarları yönetmeliğin ekinde ve ilgili kanunlarda belirlenir.',
      ],
      links: [{ t: 'Resmî Gazete: yönetmelik metni', href: RG }],
    }],
    faq: [
      ['Türkiye’de klinikler reklam verebilir mi?', 'Yurt içine yönelik reklam yasaktır, bilgilendirme serbesttir. İstisnalar: yeni açılan kuruluşun ilk ayındaki sponsorlu tanıtım ve yetki belgeli sağlık turizmi kuruluşlarının yurt dışına, Türkçe dışındaki dillerde sponsorlu tanıtımı (md. 8).'],
      ['Diş kliniği reklam yasağı neleri kapsar?', 'Diş klinikleri de aynı yönetmeliğe tabidir: yurt içinde fiyat, indirim, kampanya, hediye ve sponsorlu görsel paylaşım yapılamaz; önce-sonra görseli şartlıdır. Yetki belgesi varsa yurt dışına yönelik tanıtım md. 8’e göre yapılabilir.'],
      ['Saç ekimi reklam yasağı var mı?', 'Evet, saç ekimi de sağlık hizmetidir ve aynı kurallara tabidir. Yurt dışından hasta alan saç ekimi klinikleri yetki belgesiyle md. 8 kapsamında yurt dışına tanıtım yapabilir.'],
      ['Önce-sonra fotoğrafı paylaşmak yasak mı?', 'Tamamen yasak değil, şartlı: hastanın açık onayı, karşılaştırılabilir ve tarihli görseller, etkileşime kapalı paylaşım ve yurt içinde sonuçların kişiden kişiye değişebileceği uyarısı gerekir. İşlem sırasında çekilen görüntüler paylaşılamaz.'],
      ['Google Ads kullanabilir miyiz?', 'Yönetmelik arama motorlarında anahtar kelime kaydına, öne çıkarılmamak koşuluyla izin verir. Kampanya kurulmadan önce metin ve hedefleme hukuk danışmanınızla kontrol edilmelidir.'],
      ['Yapay zekâ asistanı hastaya fiyat söyleyebilir mi?', 'Hastanın kendi sorusuna birebir cevap bilgilendirme niteliğindedir; tanıtım amaçlı toplu fiyat duyurusu ise yurt içinde yasaktır. Asistanın fiyatı nasıl paylaşacağı kurulumda sizinle birlikte yazılır.'],
      ['Bu sayfa hukuki görüş mü?', 'Hayır. Yönetmelik metnine dayanan genel bir özettir. Kampanya öncesi kendi hukuk danışmanınızla teyit edin; esas metin Resmî Gazete’deki yönetmeliktir.'],
    ],
  },
};

export default [stYapayZeka, stCallCenter, stCrm, stReklam, stHastaBulma, reklamYasagi];
