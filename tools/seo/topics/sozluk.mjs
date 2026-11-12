/* Yapay zekâ sözlüğü: aynı şeyin farklı adlarını tek yerde tanımlar (GEO: DefinedTermSet).
   Her terim bir STOAIX sayfasına bağlanır. */
import { p } from './price.mjs';

export const sozluk = {
  id: 'sozluk', markets: ['tr'],
  slugs: { tr: 'yapay-zeka-sozlugu' },
  price: { agent: 'rec', options: ['text', 'voice'] },
  rules: ['ai', 'data'],
  related: ['hub', 'klinik-yapay-zeka', 'cagri-merkezi', 'randevu-otomasyonu'],
  tr: {
    name: 'Klinikler için yapay zekâ sözlüğü',
    card: 'Sesli asistan, çağrı asistanı, call center, chatbot, CRM: aynı şeyin farklı adları ve ne anlama geldikleri.',
    serviceType: 'Klinikler için yapay zekâ asistanları',
    audience: 'Yapay zekâ asistanı, chatbot ya da otomasyon araştıran klinik sahipleri ve yöneticileri',
    title: 'Yapay Zekâ Sözlüğü: Sesli Asistan, Chatbot, CRM | STOAIX',
    desc: 'Sesli asistan, çağrı asistanı, call center, chatbot, randevu otomasyonu, satış otomasyonu, klinik CRM: kliniklerin aradığı yapay zekâ terimleri ve farkları.',
    eyebrow: 'Sözlük · Terimler',
    proof: 'Her terim, ilgili STOAIX sayfasına bağlı',
    h1: 'Aynı şeyin on adı var: klinikler için yapay zekâ sözlüğü.',
    lede: 'Klinik sahipleri aynı ihtiyacı farklı adlarla arar: biri “sesli asistan”, biri “çağrı asistanı”, biri “call center” yazar. Bu sözlük her terimin ne anlama geldiğini, hangisinin aynı şey olduğunu ve STOAIX’te hangi asistana karşılık geldiğini tek sayfada toplar.',
    facts: [
      ['Terim', '17 terim ve eş anlamlıları'],
      ['Gruplar', 'Telefon, mesaj, randevu, satış, CRM, reklam'],
      ['Bağlantı', 'Her grup ilgili sayfaya gider'],
      ['Güncelleme', 'Yeni terimler eklendikçe'],
      ['Kapsam', 'Klinikler ve sağlık turizmi'],
    ],
    whatH: 'Bu sözlük neden var?',
    what: [
      'Yapay zekâ ürünleri yeni bir kategori olduğu için adları henüz oturmadı. Aynı ürüne bir firma “sesli asistan”, diğeri “AI resepsiyonist”, bir başkası “çağrı merkezi” diyor. Klinik sahibi için bu, neyi karşılaştırdığını bilmemek demek.',
      'Aşağıdaki terimler gruplar hâlinde tanımlandı. Her grubun sonunda o işi yapan STOAIX asistanı ve sayfası var.',
    ],
    steps: [
      { t: 'İhtiyacınızı bulun', d: 'Telefon mu, mesaj mı, randevu mu, takip mi, reklam mı?' },
      { t: 'Terimi okuyun', d: 'Hangi adların aynı şeyi anlattığını görün.' },
      { t: 'Sayfaya geçin', d: 'İlgili asistanın ne yaptığını ve fiyatını okuyun.' },
      { t: 'Hesaplayın', d: 'Gelir kaybı hesaplayıcısı hangisinden başlamanız gerektiğini gösterir.' },
    ],
    priceH: 'Bu asistanlar ne kadar?',
    priceText: [
      `Telefonu açan sesli Resepsiyonist aylık ${p('rec', 'voice')}, WhatsApp ve Instagram’a cevap veren yazılı Resepsiyonist aylık ${p('rec', 'text')}. Diğer asistanlar aylık ${p('conf', 'text')}’dan başlar.`,
      'Kurulum ücreti yoktur, CRM ücretsizdir, sözleşme aylık ve taahhütsüzdür.',
    ],
    terms: [
      { t: 'Yapay zekâ sesli asistan', aka: ['sesli asistan', 'AI sesli asistan', 'telefon asistanı'], d: 'Telefonu doğal konuşmayla açan, soruları cevaplayan ve randevu yazan yapay zekâ. STOAIX’te sesli Yapay Zekâ Resepsiyonist.' },
      { t: 'Çağrı asistanı', aka: ['yapay zekâ çağrı asistanı', 'AI çağrı asistanı'], d: 'Gelen aramaları karşılayan, gerektiğinde ekibe aktaran yapay zekâ. Sesli asistanla aynı ihtiyacı anlatır.' },
      { t: 'Yapay zekâ çağrı merkezi', aka: ['call center', 'AI call center', 'yapay zekâ destekli çağrı merkezi'], d: 'Gelen ve giden aramaların birlikte yapay zekâ ile yönetilmesi. STOAIX’te Resepsiyonist, Takip Uzmanı ve Randevu Asistanı birlikte.' },
      { t: 'Yapay zekâ resepsiyonist', aka: ['AI resepsiyonist', 'sanal resepsiyonist', 'dijital sekreter'], d: 'Kliniğin ön masasının telefon ve mesaj işini yapan yapay zekâ; sesli ya da yazılı.' },
      { t: 'Chatbot', aka: ['sohbet robotu', 'yapay zekâ chatbot', 'WhatsApp chatbot'], d: 'Yazılı mesajlara cevap veren yazılım. Kural tabanlı olanlar hazır cevap seçer; yapay zekâ olanlar soruyu anlar. STOAIX’te yazılı Resepsiyonist.' },
      { t: 'WhatsApp otomasyonu', aka: ['WhatsApp Business otomasyonu', 'WhatsApp AI'], d: 'WhatsApp mesajlarının yazılımla karşılanması, takip edilmesi ve hatırlatma gönderilmesi; resmî WhatsApp Business API üzerinden.' },
      { t: 'Instagram DM otomasyonu', aka: ['Instagram chatbot'], d: 'Instagram’a gelen doğrudan mesajlara yazılımın cevap vermesi.' },
      { t: 'Randevu otomasyonu', aka: ['yapay zekâ randevu sistemi', 'randevu programı', 'online randevu'], d: 'Randevunun hastayla konuşma sırasında takvime yazılması, hatırlatılması ve teyit alınması.' },
      { t: 'Randevu hatırlatma', aka: ['randevu teyidi', 'no-show azaltma'], d: 'Randevudan önce hastaya hatırlatma ve teyit; iptal olursa saatin yeniden doldurulması. STOAIX’te Randevu Asistanı.' },
      { t: 'Satış otomasyonu', aka: ['yapay zekâ satış otomasyonu', 'lead takip otomasyonu'], d: 'Adayın ilk temastan satın almaya kadar geçtiği adımların yazılımla yürütülmesi. Klinikte “satış” muayene ya da konsültasyon randevusudur.' },
      { t: 'Hasta adayı takibi', aka: ['lead takibi', 'lead nurturing'], d: 'Cevap vermeyen ya da karar vermemiş adayın belirli aralıklarla tekrar aranması veya yazılması. STOAIX’te Takip Uzmanı.' },
      { t: 'Eski hasta canlandırma', aka: ['lead reaktivasyonu', 'eski aday canlandırma'], d: 'Geçmişte başvurmuş ama dönülmemiş kişilerle, onayı olanlarla yeniden konuşma başlatılması. STOAIX’te Canlandırma Uzmanı.' },
      { t: 'Klinik CRM', aka: ['hasta takip sistemi', 'hasta takip programı', 'yapay zekâ CRM'], d: 'Başvuruları, konuşmaları ve randevuları tek yerde tutan yazılım. STOAIX CRM asistanlarla ücretsiz gelir.' },
      { t: 'Yabancı hasta takip sistemi', aka: ['sağlık turizmi CRM', 'uluslararası hasta takip'], d: 'Yurt dışı hasta adayının ilk temastan tedaviye kadar ülke, dil ve aşamasıyla takibi.' },
      { t: 'Klinik reklam yönetimi', aka: ['klinik reklam ajansı', 'sağlık reklam ajansı'], d: 'Kliniğin Meta ve Google kampanyalarının kurulması, günlük iyileştirilmesi ve raporlanması; Türkiye’de 2025 tanıtım yönetmeliğinin sınırlarıyla.' },
      { t: 'Yapay zekâ otomasyon', aka: ['AI otomasyon', 'yapay zekâ otomasyon ajansı'], d: 'Tekrar eden işlerin doğal dilde konuşabilen yazılıma devredilmesi. Klinikte çoğunlukla hasta iletişimi.' },
      { t: 'GEO', aka: ['üretken motor optimizasyonu', 'yapay zekâ arama optimizasyonu'], d: 'Bir sitenin ChatGPT, Gemini, Perplexity gibi yapay zekâ asistanlarının cevaplarında kaynak olarak görünmesi için yapılan çalışma.' },
    ],
    sections: [{
      h: 'Hangi terim hangi sayfa?',
      alt: true,
      table: {
        cols: ['Aradığınız', 'Aynı şeyin diğer adları', 'Sayfa'],
        rows: [
          ['Sesli asistan', 'çağrı asistanı, telefon asistanı, sanal resepsiyonist', 'Yapay zekâ resepsiyonist'],
          ['Call center', 'çağrı merkezi, AI call center', 'Yapay zekâ çağrı merkezi'],
          ['Chatbot', 'WhatsApp chatbot, sohbet robotu', 'WhatsApp yapay zekâ asistanı'],
          ['Randevu sistemi', 'randevu programı, randevu otomasyonu', 'Randevu otomasyonu'],
          ['Satış otomasyonu', 'lead takibi, takip otomasyonu', 'Yapay zekâ satış otomasyonu'],
          ['CRM', 'hasta takip sistemi, yabancı hasta takip', 'Klinik CRM'],
          ['Reklam ajansı', 'reklam yönetimi, dijital pazarlama', 'Klinik Meta reklam yönetimi'],
        ],
      },
      links: [
        { t: 'Yapay zekâ resepsiyonist', href: 'receptionist' },
        { t: 'Yapay zekâ çağrı merkezi', href: 'cagri-merkezi' },
        { t: 'WhatsApp yapay zekâ asistanı', href: 'chatbot' },
        { t: 'Randevu otomasyonu', href: 'randevu-otomasyonu' },
        { t: 'Satış otomasyonu', href: 'satis-otomasyonu' },
        { t: 'Klinik CRM', href: 'crm' },
        { t: 'Klinik Meta reklam yönetimi', href: 'ads' },
      ],
    }],
    faq: [
      ['Sesli asistan ile çağrı asistanı aynı şey mi?', 'Pratikte evet: ikisi de telefonu yapay zekâ ile karşılamayı anlatır. STOAIX’te karşılığı sesli Yapay Zekâ Resepsiyonist’tir.'],
      ['Chatbot ile yapay zekâ asistanı arasındaki fark ne?', 'Klasik chatbot hazır cevaplar arasından seçer. Yapay zekâ asistanı soruyu anlar, kliniğin bilgisiyle cevap verir ve konuşmayı randevuya taşır.'],
      ['Çağrı merkezi ile resepsiyonist farkı ne?', 'Resepsiyonist gelen aramayı karşılar. Çağrı merkezi gelen aramaya ek olarak giden aramaları (takip, teyit, canlandırma) da kapsar.'],
      ['CRM ile hasta takip sistemi aynı mı?', 'Aramada çoğunlukla aynı ihtiyacı anlatır: başvuruların ve hastaya dönüşme sürecinin takibi. Tıbbi kayıt tutan hastane bilgi sistemi (HBYS) ise ayrı bir yazılımdır.'],
    ],
  },
};

export default [sozluk];
