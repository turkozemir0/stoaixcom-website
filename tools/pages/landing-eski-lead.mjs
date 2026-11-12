/* Eski lead canlandırma reklam sayfaları — metinler eski sayfalardan aynen. */

import { qa, table } from './sections.mjs';
import { list } from './landing.mjs';

const ACTIONS = ['Ücretsiz Demo Al', 'Konuşalım'];
const PROOF = '500+ klinik analizi üzerinden geliştirildi';
const CLOSE_LIST = 'Listeniz hazır, sadece aramak kaldı.';
const DAILY = { t: 'Günlük Rapor' };
const howSteps = (second, thirdTitle = 'Sıcak adayları randevuya alın') => [
  second,
  { t: thirdTitle, d: 'İlgilenen adaylar otomatik randevuya yönlendirilir ya da ekibinize anında iletilir. Günlük raporda tüm sonuçları görürsünüz.' },
];

/* Estetik sayfasına özel iki bölüm: maliyet karşılaştırması ve uyuyan liste hesabı. */
const ESTETIK_COST = qa('Yeni reklam mı, eski liste mi? Rakamlar konuşsun.', [
  '500 estetik klinik verisinden çıkan ortalama maliyetler. Aynı randevuyu iki farklı yoldan almanın bedeli.',
], {
  extra: table(['', 'Yeni Reklam Leadi', 'STOAIX ile Eski Liste'], [
    ['Kaynak', 'Meta / Google Ads yoluyla', 'Mevcut CRM\'inizi çalıştırarak'],
    ['Ortalama lead maliyeti', '₺800 – ₺2.400', '~₺0 (zaten var)'],
    ['Randevuya dönüşüm oranı', '%3 – 8', '%25 – 40'],
    ['Randevu başına maliyet', '₺10K – ₺30K', '₺800 – ₺2.500'],
    ['İnsan emeği (takip)', 'Yüksek', 'Sıfır'],
  ]) + '\n      <p class="fine">500 kişilik eski liste × %30 dönüşüm × ₺60K ortalama estetik paket = ₺9.000.000 potansiyel gelir</p>',
});

const ESTETIK_FUNNEL = qa('CRM\'inizde ne kadar fırsat uyuyor?', [
  'Estetik prosedür adaylarının büyük çoğunluğu ilk temasa hazır değildir — ama 6-18 ay sonra kararını verir. O an sizi aramayan, rakibinizi arar.',
], {
  alt: true,
  extra: list([
    'Rhinoplasty (burun estetiği): ortalama 11 ay karar süreci',
    'Liposuction: ortalama 8 ay araştırma süreci',
    'Botoks / dolgu: tekrar randevu için 4-6 ay',
    'Göz kapağı (blefaroplasti): 12-18 ay karar penceresi',
  ]) + table(['Tipik 500 kişilik eski liste', 'Kişi'], [
    ['Toplam aday', '500 kişi'],
    ['Ulaşılabilir (telefon aktif)', '~380 kişi'],
    ['Hâlâ prosedür ilgisi var', '~190 kişi'],
    ['Randevuya hazır (sıcak)', '~75 kişi'],
    ['75 randevu × ₺80K ort. paket', '₺6.000.000 uyuyan liste potansiyeli'],
    ['STOAIX olmadan', '₺0 — klinik bu listeyi aramıyor'],
  ]),
});

function build(d) {
  return {
    agent: 'react', actions: ACTIONS, proof: PROOF, close: d.close || CLOSE_LIST,
    ...d,
    how: { h: d.howH, steps: [{ t: 'Listenizi yükleyin', d: d.upload }, ...d.howSteps] },
    features: { h: d.featuresH, lede: d.featuresLede, items: [...d.features, { ...DAILY, d: d.daily }] },
  };
}

export const ESKI_LEAD = [
  build({
    slug: 'dis-klinigi-eski-lead-canlandirma',
    title: 'Diş Kliniğinde Eski Lead Canlandırma | STOAIX',
    desc: 'CRM\'inizde bekleyen diş tedavisi adaylarını STOAIX otomatik arar, ilgi düzeyini ölçer ve randevuya hazır olanı anında yönlendirir. Ek reklam bütçesi olmadan.',
    crumb: 'Diş kliniği · Eski lead canlandırma', eyebrow: 'Diş Klinikleri için',
    h1: 'Randevu almayan hasta adayları gitmiyor. Sizi bekliyor.',
    lede: 'CRM\'deki eski diş tedavisi adaylarını STOAIX otomatik arar, ilgi düzeyini ölçer ve randevuya hazır olanı anında yönlendirir. Ek reklam bütçesi olmadan.',
    stats: [['%20–30', 'Eski listede randevuya dönüşüm'], ['3–12 ay', 'Ortalama diş tedavisi karar süresi'], ['5–10×', 'Yeni leadden daha düşük maliyet'], ['₺80K+', 'Ortalama implant tedavi değeri']],
    pain: {
      h: 'Listeniz dolup taşıyor. Ama hiç aranmıyor.',
      lede: 'İmplant, ortodonti veya zirkonyum fiyatı alıp randevu almayan adaylar yok olmaz — karar vermeye devam ederler. Onları arayan klinik kazanır.',
      items: [
        { n: '%85+', t: 'Hiç aranmayan eski leadler', d: 'Diş kliniklerinde eski CRM listelerinin büyük çoğunluğu ikinci kez aranmıyor. "Soğudu" diye arşivleniyor, oysa hasta hâlâ tedavi araştırıyor.' },
        { n: '3–4', t: 'Karar için gereken ortalama temas', d: 'Diş tedavileri tek aramada karar verilmiyor. Adaylar farklı zamanlarda 3-4 temas sonrası randevuya dönüşüyor — ama klinikler genellikle 1\'de bırakıyor.' },
        { n: '₺1M+', t: 'Uyuyan liste değeri', d: '400 kişilik eski listede %25 dönüşüm × ₺12K ortalama tedavi = 1,2 milyon liralık fırsat. Sadece sistematik takip yeterli.' },
      ],
    },
    featuresH: 'STOAIX eski diş kliniği listenizi nasıl çalıştırır?',
    featuresLede: 'Eski lead listenizi yükleyin. STOAIX doğal Türkçe ile her adayı arar, tedavi ilgisini ölçer ve randevuya hazır olanı anında ekibinize yönlendirir. Teknik bilgi gerekmez — 1 haftada devreye girer.',
    features: [
      { t: 'Liste Yükleme', d: 'CSV veya Excel listenizi yükleyin. Klinik adınız, tedavi menünüz ve fiyat aralığınızla kişiselleştirin.' },
      { t: 'Otomatik Arama', d: 'Her adayı kliniğiniz adına özelleştirilmiş senaryo ile arar. Hangi tedaviye ilgi duyduğunu tespit eder.' },
      { t: 'Tedavi İlgi Tespiti', d: 'İmplant mı, ortodonti mi, zirkonyum mu? Her aday tedaviye göre etiketlenir ve uzmanına yönlendirilir.' },
      { t: 'Anında Randevu', d: '"Evet, görüşmek isterim" diyen aday aynı görüşmede randevuya alınır ya da ekibinize anında iletilir.' },
      { t: 'Çok Adımlı Takip', d: 'Ulaşılamayan adaylar farklı saatlerde 2-3 kez daha denenir. Karar süreci uzun tedavilerde kritik fark yaratır.' },
    ],
    daily: 'Kaç kişi arandı, hangi tedaviye ilgi gösterildi — canlı dashboard ve günlük özet e-postasıyla takip edin.',
    howH: '3 adımda eski liste gelire dönüşür.',
    upload: 'CSV veya Excel formatında eski hasta adayı listenizi paylaşın. Kliniğinizin tedavi menüsü ve fiyat aralığını bildirin.',
    howSteps: howSteps({ t: 'STOAIX aramaya başlar', d: 'Yapay zeka her adayı kliniğiniz adına doğal Türkçe ile arar, tedavi ilgisini ölçer ve sıcak adayları işaretler.' }),
    sister: { t: 'Anlık Yanıt', href: '/dis-klinigi-hizli-yanit' },
  }),
  build({
    slug: 'estetik-klinik-eski-lead-canlandirma',
    title: 'Estetik Kliniğinde Eski Lead Canlandırma | STOAIX',
    desc: 'Estetik klinik CRM\'inizde uyuyan yüzlerce aday var. STOAIX onları otomatik arar, güven inşa eder ve randevuya hazır olanı anında yönlendirir.',
    crumb: 'Estetik klinik · Eski lead canlandırma', eyebrow: 'Estetik Klinikler için',
    h1: 'En ucuz hasta kaynağı zaten elinizde.',
    lede: 'Estetik prosedür kararları 6-18 ay sürer. Eski listenizde fiyat alıp karar veremeyen adaylar hâlâ pazarda — ve doğru anda aranmayı bekliyorlar.',
    stats: [['%30–40', 'Eski listede randevuya dönüşüm'], ['6–18 ay', 'Estetik prosedür karar süresi'], ['8–15×', 'Yeni leadden daha düşük maliyet'], ['₺150K+', 'Premium estetik paket değeri']],
    extra: [ESTETIK_COST, ESTETIK_FUNNEL],
    featuresH: 'STOAIX estetik kliniği listesini nasıl çalıştırır?',
    featuresLede: 'Eski lead listenizi yükleyin. STOAIX her adayı doğal, samimi Türkçe ile arar; güven düzeyini, prosedür ilgisini ve bütçe hazırlığını ölçer. Randevuya hazır olanı anında ekibinize yönlendirir.',
    features: [
      { t: 'Liste Yükleme', d: 'CSV veya Excel listenizi yükleyin. Prosedür kategorisi ve fiyat aralığını bildirin.' },
      { t: 'Samimi Arama', d: 'Estetik kararlar güvene dayanır. STOAIX baskı yapmadan, doğal Türkçe ile adayı dinler ve bilgilendirir.' },
      { t: 'Prosedür İlgi Tespiti', d: 'Rhinoplasty mı, liposuction mu, dolgu mu? Her aday prosedüre göre etiketlenir ve uzmanına yönlendirilir.' },
      { t: 'Anında Randevu', d: '"Görüşmek isterim" diyen aday aynı görüşmede randevuya alınır ya da ekibinize iletilir.' },
      { t: 'Çok Adımlı Takip', d: 'Ulaşılamayanlar farklı saatlerde 2-3 kez daha denenir. Uzun karar süreçlerinde kritik fark yaratır.' },
    ],
    daily: 'Kaç kişi arandı, hangi prosedüre ilgi gösterildi — canlı dashboard ve günlük özet e-postası.',
    howH: '3 adımda eski liste randevuya dönüşür.',
    upload: 'CSV veya Excel formatında eski hasta adayı listenizi paylaşın. Kliniğinizin prosedür menüsü ve fiyat aralığını bildirin.',
    howSteps: howSteps({ t: 'STOAIX güven inşa eder', d: 'Her adayı doğal Türkçe ile arar, baskı yapmadan dinler ve bilgilendirir. Güven olgunlaşınca randevuya yönlendirir.' }, 'Hazır adayı alın'),
    close: 'Liste hazır. Sadece aramak kaldı.',
    sister: { t: 'Anlık Yanıt', href: '/estetik-klinik-hizli-yanit' },
  }),
  build({
    slug: 'sac-ekimi-eski-lead-canlandirma',
    title: 'Saç Ekimi Kliniğinde Eski Lead Canlandırma | STOAIX',
    desc: 'CRM\'inizde uyuyan yüzlerce saç ekimi adayı var. STOAIX onları otomatik arar, ilgi düzeyini ölçer ve randevuya hazır olanı anında yönlendirir.',
    crumb: 'Saç ekimi · Eski lead canlandırma', eyebrow: 'Saç Ekimi Klinikleri için',
    h1: 'CRM\'inizde uyuyan yüzlerce aday var.',
    lede: 'Eski lead listenizi STOAIX otomatik olarak arar, ilgi düzeyini ölçer ve randevuya hazır olanı anında yönlendirir. Ek reklam bütçesi olmadan.',
    stats: [['%15–25', 'Eski listede randevuya dönüşüm'], ['6–18 ay', 'Ortalama saç ekimi karar süresi'], ['3–7×', 'Yeni leadden daha düşük maliyet'], ['₺50K+', 'Ortalama operasyon değeri']],
    pain: {
      h: 'Eski listeler değersiz değil. Takipsiz kaldığı için ölü görünüyor.',
      lede: 'Saç ekimi kararı aylar sürer. Bilgi alıp karar veremeyen adayların büyük çoğunluğu hâlâ pazarda — ama klinikler bir daha aramıyor.',
      items: [
        { n: '%80+', t: 'Takipsiz kalan leadler', d: 'CRM\'deki eski adayların büyük çoğunluğu ilk temastan sonra hiç aranmıyor. "Soğudu" diye siliniyor, aslında hâlâ karar sürecinde.' },
        { n: '3–7×', t: 'Yeni leadden daha ucuz', d: 'Eski listedeki bir adayı randevuya dönüştürmek, yeni reklam lead\'i kazanmaktan ortalama 3-7 kat düşük maliyetlidir. En verimli büyüme zaten elinizde.' },
        { n: '₺2M+', t: 'Uyuyan liste değeri', d: '500 kişilik eski listede %20 dönüşüm × ₺50K ortalama operasyon = 2 milyon liralık fırsat. Sadece doğru zamanda aramak yeterli.' },
      ],
    },
    featuresH: 'STOAIX listenizi nasıl canlandırır?',
    featuresLede: 'Eski lead listenizi yükleyin. STOAIX doğal Türkçe ile her adayı arar, ısındırır ve randevuya hazır olanı anında ekibinize yönlendirir. Teknik bilgi gerekmez — 1 haftada devreye girer.',
    features: [
      { t: 'Liste Yükleme', d: 'CSV veya Excel listenizi yükleyin, CRM entegrasyonu da desteklenir ama zorunlu değil.' },
      { t: 'Otomatik Arama', d: 'Her adayı kliniğiniz adına özelleştirilmiş senaryo ile arar. Günlük hacmi siz belirlersiniz.' },
      { t: 'İlgi Seviyesi Tespiti', d: 'Her aday sıcak / ılık / soğuk olarak etiketlenir. Satış ekibi yalnızca hazır adaylara odaklanır.' },
      { t: 'Anında Randevu', d: '"Evet, görüşmek isterim" diyen aday aynı görüşmede randevuya alınır ya da ekibinize iletilir.' },
      { t: 'Çok Adımlı Takip', d: 'Ulaşılamayan adaylar farklı saatlerde 2-3 kez daha denenir. Erişim oranı %40\'a çıkar.' },
    ],
    daily: 'Kaç kişi arandı, kaçı sıcak çıktı — canlı dashboard ve günlük özet e-postasıyla takip edin.',
    howH: '3 adımda listeye hayat.',
    upload: 'CSV veya Excel formatında eski lead listenizi paylaşın. Kliniğinizin adı, teknikler ve fiyat aralığını bildirin.',
    howSteps: howSteps({ t: 'STOAIX aramaya başlar', d: 'Yapay zeka her adayı kliniğiniz adına doğal Türkçe ile arar, ilgi düzeyini ölçer ve sıcak adayları işaretler.' }),
    sister: { t: 'Anlık Yanıt', href: '/sac-ekimi-hizli-yanit' },
  }),
];
