/* ═══════════════════════════════════════════════════════════
   STOAIX — docs-data.js
   Static documentation content (40 articles).
   No API calls — all content embedded client-side.
   ═══════════════════════════════════════════════════════════ */

'use strict';

window.DOCS_CATEGORIES = [
  { key: 'general',        label: 'Başlangıç',                    icon: '📘' },
  { key: 'crm',            label: 'CRM ve Lead Yönetimi',         icon: '👥' },
  { key: 'inbox',          label: 'Gelen Kutusu',                 icon: '📨' },
  { key: 'voice_agent',    label: 'Sesli AI Asistan',             icon: '🎙️' },
  { key: 'knowledge_base', label: 'Bilgi Bankası',                icon: '📚' },
  { key: 'workflows',      label: 'İş Akışları',                  icon: '⚡' },
  { key: 'integrations',   label: 'Entegrasyonlar',               icon: '🔗' },
  { key: 'calendar',       label: 'Takvim ve Randevu',            icon: '📅' },
  { key: 'templates',      label: 'WhatsApp Şablonları',          icon: '📝' },
  { key: 'settings',       label: 'Ayarlar',                      icon: '⚙️' },
  { key: 'billing',        label: 'Abonelik ve Faturalandırma',   icon: '💳' }
];

window.DOCS_DATA = [

  // ── general ──────────────────────────────────────────────

  {
    id: 'platform-nedir',
    category: 'general',
    title: 'stoaix Platform Nedir?',
    content: '# stoaix Platform Nedir?\n\nstoaix, işletmelere özel AI satış asistanı platformudur. WhatsApp, Instagram, sesli arama ve web kanalları üzerinden gelen müşteri mesajlarını yapay zeka ile yanıtlar.\n\n## Ne İşe Yarar?\n- **Otomatik müşteri yanıtlama:** 7/24 AI asistanınız müşteri sorularını cevaplayarak lead toplar\n- **Çok kanallı destek:** WhatsApp, Instagram DM, sesli arama (Voice Agent) ve web kanallarından gelen mesajlar tek panelde\n- **Lead yönetimi:** Müşteri adaylarını skorlar, sınıflandırır ve satış ekibine devreder\n- **Bilgi bankası:** İşletmenize özel bilgilerle AI\'yi eğitin\n\n## Kimler Kullanabilir?\nKlinikler, eğitim danışmanlıkları, gayrimenkul firmaları ve daha birçok sektör. Platform multi-sektör altyapıya sahiptir.\n\n## Nasıl Başlarım?\nstoaix ekibinden davet linki alın → Kayıt olun → Onboarding adımlarını tamamlayın → Dashboard\'a erişin.',
    tags: ['platform', 'genel', 'giriş']
  },
  {
    id: 'ilk-adimlar-hizli-baslangic',
    category: 'general',
    title: 'İlk Adımlar — Hızlı Başlangıç',
    content: '# İlk Adımlar\n\nPlatforma kaydolduktan sonra şu adımları izleyin:\n\n## 1. Onboarding\'i Tamamlayın\n- **İşletme bilgileri:** Telefon, e-posta, şehir ve ülke bilgilerinizi girin\n- **Hizmetler:** Sunduğunuz hizmetleri ekleyin (AI bunları öğrenir)\n- **SSS:** Sık sorulan sorularınızı ve cevaplarını girin\n- **Ek bilgiler:** Fiyatlandırma ve politikalarınızı ekleyin\n\n## 2. Bilgi Bankasını Zenginleştirin\nDashboard → Bilgi Bankası sayfasından içerik ekleyin. Ne kadar çok bilgi eklerseniz, AI o kadar doğru cevap verir.\n\n## 3. Kanalları Bağlayın\nAyarlar sayfasından WhatsApp ve/veya Instagram hesabınızı bağlayın.\n\n## 4. Test Edin\nAI Asistan sayfasından test konuşması yaparak AI\'nin doğru cevap verdiğini kontrol edin.\n\n## 5. Canlıya Alın\nHer şey hazır olduğunda kanallarınızı aktif edin ve müşteri mesajlarını AI\'ye yönlendirin.',
    tags: ['başlangıç', 'onboarding', 'kurulum']
  },
  {
    id: 'desteklenen-sektorler-ve-kullanim-alanlari',
    category: 'general',
    title: 'Desteklenen Sektörler ve Kullanım Alanları',
    content: '# Desteklenen Sektörler\n\nstoaix şu sektörlerde kullanılabilir:\n\n## Sağlık & Klinik\n- Estetik klinikler, diş klinikleri, saç ekimi merkezleri\n- Randevu alma, tedavi bilgisi, fiyat soruları\n\n## Eğitim\n- Yurtdışı eğitim danışmanlıkları\n- Program bilgisi, başvuru süreci, fiyatlandırma\n\n## Gayrimenkul\n- Emlak danışmanlıkları\n- Mülk bilgisi, fiyat, lokasyon soruları\n\n## Turizm & Otelcilik\n- Tur operatörleri, oteller\n- Rezervasyon, tur bilgisi, fiyat\n\n## Teknoloji & SaaS\n- Yazılım şirketleri\n- Ürün bilgisi, demo talebi, teknik sorular\n\nHer sektör için AI asistanı, sektöre özel veri toplama şeması ve konuşma senaryoları ile yapılandırılır.',
    tags: ['sektör', 'klinik', 'eğitim', 'gayrimenkul']
  },
  {
    id: 'dashboard-ana-sayfa',
    category: 'general',
    title: 'Dashboard Ana Sayfa — Metrikler ve Grafikler',
    content: '# Dashboard Ana Sayfa\n\nGiriş yaptığınızda karşınıza çıkan ana sayfa, işletmenizin AI performansının özetini sunar.\n\n## İstatistik Kartları\n- **Toplam Lead:** Tüm zamanların lead sayısı\n- **Hot Lead:** Yüksek skorlu, satışa hazır leadler\n- **Warm Lead:** Orta seviye ilgi gösteren leadler\n- **Handoff:** İnsana devredilen konuşma sayısı\n- **Ort. Skor:** Tüm leadlerin ortalama skoru\n- **Bugün Yeni:** Bugün gelen yeni lead sayısı\n\nHer kartta önceki haftaya göre değişim yüzdesi gösterilir (yeşil: artış, kırmızı: düşüş).\n\n## Grafikler\n- **14 Günlük Trend:** Son iki haftalık lead akışı çizgi grafiği\n- **Lead Dağılımı:** Aşamalara göre lead dağılımı bar grafiği\n- **Handoff Oranı:** AI\'dan insana devir yüzdesi\n\n## Son Aktiviteler\n- **Son Leadler:** En son gelen 5 lead\n- **Son Çağrılar:** En son 5 sesli arama\n\n## Kurulum Merkezi\nİlk girişte 5 adımlı kurulum kontrol listesi görünür:\n1. İşletme bilgilerini tamamla\n2. Bilgi bankasına içerik ekle\n3. WhatsApp veya Instagram bağla\n4. AI asistanı test et\n5. İlk lead\'i al',
    tags: ['dashboard', 'ana sayfa', 'metrik', 'grafik']
  },
  {
    id: 'kvkk-onay-sureci',
    category: 'general',
    title: 'KVKK Onay Süreci',
    content: '# KVKK Onay Süreci\n\nPlatforma ilk girişinizde KVKK (Kişisel Verilerin Korunması Kanunu) onay ekranı görüntülenir.\n\n## Onay İçeriği\n- Gizlilik Politikası\n- Veri işleme sözleşmesi\n- KVKK Madde 11 kapsamındaki haklarınız\n\n## Süreç\n1. Dashboard\'a ilk girişte onay modalı otomatik açılır\n2. Metinleri okuyun\n3. \"Kabul Ediyorum\" butonuna tıklayın\n4. Onay kaydedilir ve dashboard\'a erişiminiz açılır\n\n## Önemli Notlar\n- Onay vermeden dashboard kullanılamaz\n- Onay her kullanıcı için bir kez istenir\n- KVKK ile ilgili sorularınız için: privacy@stoaix.com\n- Kişisel verilerinizle ilgili haklarınızı (erişim, düzeltme, silme) her zaman kullanabilirsiniz',
    tags: ['kvkk', 'onay', 'gizlilik']
  },

  // ── crm ──────────────────────────────────────────────────

  {
    id: 'lead-yonetimi-ve-kanban-board',
    category: 'crm',
    title: 'Lead Yönetimi ve Kanban Board',
    content: '# Lead Yönetimi\n\nDashboard → Leadler sayfasında tüm müşteri adaylarınızı yönetebilirsiniz.\n\n## Görünüm Seçenekleri\n- **Tablo görünümü:** Klasik liste formatında leadleri görüntüleyin\n- **Kanban görünümü:** Sürükle-bırak ile leadleri aşamalar arası taşıyın\n\n## Lead Aşamaları\n| Aşama | Açıklama |\n|---|---|\n| Yeni Lead | Henüz AI ile konuşmamış |\n| AI Qualifying | AI aktif olarak bilgi topluyor |\n| Hot Lead | Yüksek skorlu, satış ekibine devre hazır |\n| Randevu | Randevu oluşturulmuş |\n| Kazanıldı | Satış tamamlandı |\n| Kayıp | İlgilenmiyor veya ulaşılamadı |\n\n## Lead Detayları\nBir lead\'e tıklayarak detay sayfasını açabilirsiniz:\n- İletişim bilgileri ve toplanan veriler\n- Konuşma geçmişi\n- Lead skoru (0-100)\n- Handoff geçmişi',
    tags: ['lead', 'kanban', 'crm']
  },
  {
    id: 'handoff-aiden-insana-devir',
    category: 'crm',
    title: 'Handoff — AI\'den İnsana Devir',
    content: '# Handoff — AI\'den İnsana Devir\n\nBelirli durumlarda AI asistan, konuşmayı insan satış temsilcisine devredebilir.\n\n## Ne Zaman Handoff Olur?\n- Müşteri açıkça insan ile konuşmak istediğinde\n- Lead skoru belirli bir eşiği aştığında (ör: 80+)\n- AI\'nin cevaplayamadığı karmaşık sorularda\n- Randevu onayı gibi kritik adımlarda\n\n## Handoff Süreci\n1. AI konuşmayı \"Hot Lead\" aşamasına taşır\n2. Bildirim gönderilir (dashboard\'da bildirim çanı)\n3. Satış temsilcisi Gelen Kutusu\'ndan konuşmayı devralır\n4. \"Devral\" butonuna tıklayarak manuel moda geçer\n5. İşlem bitince \"Bırak\" ile AI\'ye geri devredebilir\n\n## Bildirimler\nHandoff olduğunda dashboard\'da bildirim çanı ile uyarı alırsınız. Bildirime tıklayarak ilgili konuşmaya gidebilirsiniz.',
    tags: ['handoff', 'devir', 'bildirim']
  },
  {
    id: 'csv-ile-toplu-lead-ice-aktarma',
    category: 'crm',
    title: 'CSV ile Toplu Lead İçe Aktarma',
    content: '# CSV ile Lead İçe Aktarma\n\nDashboard → Leadler → İçe Aktar butonuyla mevcut lead listenizi toplu olarak yükleyebilirsiniz.\n\n## CSV Format Gereksinimleri\n- İlk satır başlık satırı olmalı\n- Zorunlu sütun: **phone** (telefon numarası)\n- Opsiyonel sütunlar: full_name, email, city, notes\n- Telefon formatı: Ülke kodu ile (ör: +905551234567)\n\n## İçe Aktarma Adımları\n1. \"İçe Aktar\" butonuna tıklayın\n2. CSV dosyanızı sürükleyip bırakın veya seçin\n3. Sütun eşleştirmesini kontrol edin\n4. \"Başlat\" butonuyla içe aktarmayı başlatın\n5. Sonuç özetini inceleyin (başarılı/hatalı satırlar)\n\n## Limitler\n- Tek seferde maksimum 500 satır\n- Duplike telefon numaraları otomatik atlanır\n- Plan bazlı içe aktarma limiti olabilir',
    tags: ['csv', 'import', 'lead']
  },
  {
    id: 'lead-skorlama-nasil-calisir',
    category: 'crm',
    title: 'Lead Skorlama Nasıl Çalışır?',
    content: '# Lead Skorlama\n\nAI asistan, her lead ile konuşma sürecinde otomatik olarak bir skor (0-100) atar.\n\n## Skorlama Kriterleri\n- **İletişim bilgisi paylaşımı:** İsim, telefon, e-posta verdiyse skor artar\n- **Hizmet ilgisi:** Belirli bir hizmet/ürüne ilgi gösterdiyse skor artar\n- **Bütçe bilgisi:** Bütçe aralığı belirttiyse skor artar\n- **Zaman çerçevesi:** Acil ihtiyaç belirttiyse skor yüksek olur\n- **Etkileşim kalitesi:** Uzun ve detaylı cevaplar skor artırır\n\n## Skor Aralıkları\n| Aralık | Sınıflandırma |\n|---|---|\n| 0-30 | Soğuk lead |\n| 31-60 | Ilık lead |\n| 61-80 | Sıcak lead |\n| 81-100 | Çok sıcak (Hot Lead) |\n\n80+ skor alan leadler otomatik olarak \"Hot Lead\" aşamasına taşınır ve handoff bildirimi gönderilir.',
    tags: ['skor', 'lead', 'qualifying']
  },
  {
    id: 'teklifler-ve-odemeler-modulu',
    category: 'crm',
    title: 'Teklifler ve Ödemeler Modülü',
    content: '# Teklifler ve Ödemeler\n\nDashboard → CRM → \"Teklifler & Ödemeler\" sekmesinden müşterilere teklif oluşturabilir ve ödeme durumlarını takip edebilirsiniz.\n\n## Teklif Oluşturma\n1. \"Yeni Teklif\" butonuna tıklayın\n2. İlgili lead\'i seçin\n3. Teklif başlığı ve tutarı girin\n4. Notlar ekleyin (opsiyonel)\n5. Kaydedin\n\n## Teklif Durumları\n- **Taslak:** Henüz müşteriye gönderilmemiş\n- **Gönderildi:** Müşteriye iletildi\n- **Kabul Edildi:** Müşteri onayladı\n- **Reddedildi:** Müşteri reddetti\n\n## Ödeme Takibi\nKabul edilen teklifler için ödeme kaydı oluşturabilirsiniz:\n- Ödeme tutarı ve tarihi\n- Ödeme yöntemi\n- Kısmi veya tam ödeme\n\n## Raporlama\nTeklifler ve ödemeler sekmesinde toplam teklif, kabul oranı ve tahsilat özeti görüntülenir.',
    tags: ['teklif', 'ödeme', 'crm']
  },
  {
    id: 'takip-gorevleri',
    category: 'crm',
    title: 'Takip Görevleri (Follow-up Tasks)',
    content: '# Takip Görevleri\n\nDashboard → CRM → \"Takip\" sekmesinden tüm takip görevlerini yönetebilirsiniz.\n\n## Otomatik Takip Görevleri\nAI asistan belirli durumlarda otomatik takip görevi oluşturur:\n- Randevu sonrası hatırlatma\n- Cevap vermeyen lead\'lere tekrar ulaşma\n- Memnuniyet anketi gönderimi\n\n## Manuel Takip Görevi\n1. \"Yeni Görev\" butonuna tıklayın\n2. İlgili lead\'i seçin\n3. Görev açıklamasını yazın\n4. Tarih ve saat belirleyin\n5. Kaydedin\n\n## Görev Durumları\n- **Bekliyor:** Henüz zamanı gelmemiş\n- **Gecikmiş:** Zamanı geçmiş ama tamamlanmamış\n- **Tamamlandı:** İşlem yapılmış\n\n## İstatistikler\nTakip sekmesinde özet istatistikler gösterilir:\n- Bugün yapılacak görevler\n- Gecikmiş görevler\n- Bu hafta tamamlanan görevler',
    tags: ['takip', 'follow-up', 'görev']
  },
  {
    id: 'lead-form-sablonlari',
    category: 'crm',
    title: 'Lead Form Şablonları',
    content: '# Lead Form Şablonları\n\nDashboard → CRM → \"Lead Formlar\" sekmesinden web sitenize ekleyebileceğiniz lead toplama formları oluşturabilirsiniz.\n\n## Form Oluşturma\n1. \"Lead Formlar\" sekmesine gidin\n2. Mevcut şablonları inceleyin veya yeni oluşturun\n3. Toplamak istediğiniz alanları belirleyin (isim, telefon, e-posta, vb.)\n4. Formu kaydedin\n5. Embed kodunu alıp web sitenize ekleyin\n\n## Özellikler\n- Özelleştirilebilir alanlar\n- Lead otomatik olarak CRM\'e eklenir\n- Webhook ile dış form araçlarından da veri alabilirsiniz\n\n## Form Alternatifleri\nHarici form araçları (Tally, Typeform, JotForm) kullanıyorsanız, webhook entegrasyonu ile aynı sonucu elde edebilirsiniz. Detaylar için \"Form ve Webhook Entegrasyonu\" makalesine bakın.',
    tags: ['form', 'lead', 'şablon']
  },
  {
    id: 'ekip-rolleri-ve-yetkiler',
    category: 'crm',
    title: 'Ekip Rolleri ve Yetkiler',
    content: '# Ekip Rolleri ve Yetkiler\n\nPlatformda dört farklı kullanıcı rolü bulunur:\n\n## Patron\n- Tüm sayfalara ve özelliklere erişim\n- Kullanıcı davet etme ve rol atama\n- Faturalama ve plan yönetimi\n- Tüm ayarları değiştirme\n\n## Yönetici\n- Leadler, konuşmalar, bilgi bankası yönetimi\n- İş akışları ve entegrasyon ayarları\n- Raporları görüntüleme\n- Faturalama hariç tüm işlemler\n\n## Satışçı\n- Leadler ve konuşmalar\n- Teklif oluşturma ve takip\n- Bilgi bankasını görüntüleme\n- Ayarlara ve yönetim sayfalarına erişim yok\n\n## Muhasebe\n- Teklifler ve ödemeleri görüntüleme (salt okunur)\n- AI ve ayar sayfalarına erişim yok\n- Konuşmalara müdahale edemez\n\n## Kullanıcı Davet Etme\n1. Ayarlar → Kullanıcı Yönetimi bölümüne gidin\n2. \"Davet Et\" butonuna tıklayın\n3. Rol seçin\n4. 7 günlük davet linki oluşturulur\n5. Linki ilgili kişiyle paylaşın',
    tags: ['rol', 'yetki', 'ekip', 'kullanıcı']
  },

  // ── inbox ────────────────────────────────────────────────

  {
    id: 'gelen-kutusu-unified-inbox-kullanimi',
    category: 'inbox',
    title: 'Gelen Kutusu (Unified Inbox) Kullanımı',
    content: '# Gelen Kutusu\n\nDashboard → Gelen Kutusu sayfasında tüm kanallardan gelen mesajları tek yerden yönetebilirsiniz.\n\n## Özellikler\n- **Kanal filtresi:** WhatsApp, Instagram, Sesli Arama kanallarına göre filtreleme\n- **Lead durumu filtresi:** Yeni, Devam Ediyor, Hot Lead vb. göre filtreleme\n- **Mesaj thread:** Her konuşmanın tam geçmişini görüntüleme\n- **Cevap yazma:** WhatsApp ve Instagram kanallarından doğrudan cevap gönderme\n- **Gerçek zamanlı:** Yeni mesajlar anında görünür (sayfa yenilemeye gerek yok)\n\n## Konuşma Detayı\nBir konuşmaya tıkladığınızda sağ panelde:\n- Tüm mesaj geçmişi (AI + müşteri + insan)\n- Lead bilgileri ve skoru\n- Cevap yazma alanı\n\n## Manuel Mod\nBir konuşmayı devralarak AI\'yi durdurup kendiniz cevap yazabilirsiniz. \"Devral\" butonuna tıklayın, işiniz bitince \"Bırak\" ile AI\'ye geri devredin.',
    tags: ['inbox', 'mesaj', 'konuşma']
  },
  {
    id: 'kanal-bazli-mesajlasma-farklari',
    category: 'inbox',
    title: 'Kanal Bazlı Mesajlaşma Farkları',
    content: '# Kanal Bazlı Mesajlaşma\n\nFarklı kanallar farklı özellikler sunar:\n\n## WhatsApp\n- En yaygın kullanılan kanal\n- Metin, görsel ve belge gönderimi\n- 24 saatlik mesajlaşma penceresi kuralı (Meta politikası)\n- Template mesajlar ile pencere dışında da mesaj gönderebilirsiniz\n\n## Instagram DM\n- Instagram hesabınız üzerinden gelen DM\'ler\n- Metin mesaj gönderimi\n- Story mention ve yanıtları\n\n## Sesli Arama (Voice)\n- AI sesli asistan ile telefon görüşmesi\n- Arama kaydı ve transkripti otomatik kaydedilir\n- Gelen ve giden arama desteği (plana göre)\n\n## Web Widget\n- Web sitenize eklenebilen chat widget (yakında)',
    tags: ['kanal', 'whatsapp', 'instagram', 'voice']
  },

  // ── voice_agent ──────────────────────────────────────────

  {
    id: 'sesli-ai-asistan-nasil-calisir',
    category: 'voice_agent',
    title: 'Sesli AI Asistan (Voice Agent) Nasıl Çalışır?',
    content: '# Sesli AI Asistan\n\nSesli AI asistan, telefon üzerinden müşterilerinizle doğal bir konuşma yapabilen yapay zeka sistemidir.\n\n## Özellikler\n- **Doğal konuşma:** Gerçek zamanlı sesli diyalog\n- **Çok dilli destek:** Türkçe, İngilizce ve diğer diller (plana göre)\n- **Bilgi bankası entegrasyonu:** Eklediğiniz bilgilere dayanarak cevap verir\n- **Lead toplama:** Konuşma sırasında müşteri bilgilerini toplar\n- **Otomatik transkript:** Her arama kaydedilir ve metne çevrilir\n\n## Gelen Arama (Inbound)\nMüşteriler size tahsis edilen telefon numarasını arayarak AI asistan ile konuşabilir.\n\n## Giden Arama (Outbound)\nAI asistan, belirlenen senaryolara göre otomatik giden aramalar yapabilir:\n- İlk temas araması\n- Takip araması\n- Randevu hatırlatma\n- Memnuniyet anketi\n\n## Plan Gereksinimleri\n- **Essential plan:** Sesli arama dahil değil\n- **Professional plan:** Gelen arama (150 dk/ay)\n- **Business plan:** Gelen + Giden arama (300 dk/ay shared)',
    tags: ['voice', 'sesli', 'arama']
  },
  {
    id: 'arama-kayitlari-ve-transkriptler',
    category: 'voice_agent',
    title: 'Arama Kayıtları ve Transkriptler',
    content: '# Arama Kayıtları\n\nDashboard → Çağrı Logları sayfasında tüm sesli aramaların kaydını görebilirsiniz.\n\n## Kayıt Bilgileri\n- **Tarih ve saat:** Aramanın yapıldığı zaman\n- **Yön:** Gelen (Inbound) veya Giden (Outbound)\n- **Süre:** Arama süresi\n- **Telefon numarası:** Arayan/aranan numara\n- **Lead bağlantısı:** İlişkili lead kaydı\n\n## Transkript\nHer aramanın tam metin dökümü otomatik oluşturulur. Transkripte tıklayarak konuşmanın tamamını okuyabilirsiniz.\n\n## AI Özeti\nHer arama sonunda AI otomatik bir özet oluşturur:\n- Konuşmanın ana konusu\n- Toplanan bilgiler\n- Sonraki adımlar',
    tags: ['arama', 'transkript', 'log']
  },
  {
    id: 'ai-sesli-arama-senaryolari',
    category: 'voice_agent',
    title: 'AI Sesli Arama Senaryoları',
    content: '# AI Sesli Arama Senaryoları\n\nSesli AI asistanı farklı senaryolarda otomatik arama yapabilir:\n\n## Gelen Arama (Inbound)\nMüşteri sizi aradığında AI karşılar, bilgi verir ve lead toplar.\n\n## Giden Arama Senaryoları (Outbound)\nBusiness plan ile kullanılabilir:\n\n### 1. İlk Temas Araması\nYeni gelen lead\'i otomatik arayarak ilk teması sağlar.\n\n### 2. Takip Araması\nCevap vermeyen veya yarım kalan konuşmaları takip eder.\n\n### 3. Randevu Onayı\nRandevu öncesi müşteriyi arayarak onay alır.\n\n### 4. Randevuya Gelmeme Takibi\nRandevuya gelmeyen müşteriyi arayarak yeni randevu teklif eder.\n\n### 5. Memnuniyet Anketi\nHizmet sonrası müşteri memnuniyetini ölçer.\n\n### 6. Tedavi/Hizmet Hatırlatma\nPeriyodik tedavi veya kontrol hatırlatması yapar.\n\n### 7. Reaktivasyon\nUzun süredir iletişime geçmemiş müşterilere ulaşır.\n\n### 8. Ödeme Takibi\nÖdeme bekleyen müşterilere hatırlatma araması yapar.\n\nHer senaryo iş akışları sayfasından aktifleştirilir.',
    tags: ['voice', 'senaryo', 'outbound', 'arama']
  },
  {
    id: 'sesli-arama-altyapisi-yapilandirmasi',
    category: 'voice_agent',
    title: 'Sesli Arama Altyapısı Yapılandırması',
    content: '# Sesli Arama Altyapısı\n\nSesli AI asistanı kullanmak için ses altyapısının yapılandırılması gerekir. Bu işlem stoaix ekibi tarafından yapılır.\n\n## Altyapı Bileşenleri\n- **Telefon numarası:** Organizasyonunuza özel gelen arama numarası atanır\n- **Ses motoru:** Doğal sesli diyalog için konuşma tanıma ve sentez\n- **AI motoru:** Bilgi bankasına dayalı cevap üretimi\n\n## Gelen Arama Kurulumu\nstoaix ekibi tarafından:\n1. Telefon numarası atanır\n2. AI sesli asistan yapılandırılır\n3. Test araması yapılır\n4. Canlıya alınır\n\n## Giden Arama Kurulumu\nBusiness plan ile:\n1. Giden arama altyapısı aktifleştirilir\n2. İş akışları ile otomatik arama senaryoları bağlanır\n\n## Ses Dili Seçimi\nBusiness plan ile birden fazla dilde ses desteği kullanılabilir. Ayarlar sayfasından AI ses dilini değiştirebilirsiniz.',
    tags: ['voice', 'sip', 'altyapı', 'yapılandırma']
  },

  // ── knowledge_base ───────────────────────────────────────

  {
    id: 'bilgi-bankasi-yonetimi',
    category: 'knowledge_base',
    title: 'Bilgi Bankası Yönetimi',
    content: '# Bilgi Bankası\n\nBilgi bankası, AI asistanınızın müşteri sorularını doğru cevaplaması için temel bilgi kaynağıdır.\n\n## İçerik Türleri\n- **Hizmetler:** Sunduğunuz hizmet/ürünlerin açıklamaları\n- **SSS:** Sık sorulan sorular ve cevapları\n- **Fiyatlandırma:** Fiyat bilgileri ve paketler\n- **Politikalar:** İptal, iade, garanti politikaları\n- **Genel bilgi:** İşletme hakkında genel bilgiler\n\n## Bilgi Bankasına Nasıl Erişilir?\nDashboard → Bilgi Bankası sayfasından tüm kayıtlarınızı görebilirsiniz.\n\n## İçerik Ekleme\n1. \"Yeni Ekle\" butonuna tıklayın\n2. İçerik türünü seçin\n3. Başlık ve açıklama girin\n4. \"Kaydet\" butonuna tıklayın\n5. AI otomatik olarak yeni bilgiyi öğrenir\n\n## Önemli Notlar\n- İçerik ne kadar detaylı olursa AI o kadar doğru cevap verir\n- AI\'nin kullanacağı dilde yazın (genellikle Türkçe)\n- Fiyat değişikliklerinde bilgi bankasını güncellemeyi unutmayın',
    tags: ['bilgi bankası', 'kb', 'içerik']
  },
  {
    id: 'bilgi-bankasi-icerik-ipuclari',
    category: 'knowledge_base',
    title: 'Bilgi Bankası İçerik İpuçları',
    content: '# Bilgi Bankası İçerik İpuçları\n\nAI asistanınızın en iyi performansı göstermesi için bilgi bankası içeriklerinizi şu şekilde hazırlayın:\n\n## İyi İçerik Özellikleri\n- **Net ve anlaşılır:** Karmaşık tıbbi/teknik terimlerden kaçının\n- **Güncel:** Fiyatlar, çalışma saatleri gibi bilgiler güncel olmalı\n- **Eksiksiz:** Her hizmet için müşterilerin sorabileceği tüm soruları düşünün\n- **Yapılandırılmış:** Başlıklar ve maddeler kullanarak düzenleyin\n\n## SSS Hazırlama\nHer SSS kaydı için:\n- Soruyu müşterinin soracağı şekilde yazın\n- Cevabı kısa ve net tutun\n- Gerekirse fiyat, süre, adres gibi somut bilgiler ekleyin\n\n## Fiyat Bilgileri\n- Fiyat aralıkları belirtin (ör: \"5.000 - 15.000\")\n- \"Fiyat kişiye özel belirlenir\" gibi politikalar varsa bunu ekleyin\n- Kampanya/indirim bilgilerini güncel tutun\n\n## Politikalar\n- İptal ve iade koşulları\n- Randevu değişiklik kuralları\n- Garanti ve destek politikaları',
    tags: ['bilgi bankası', 'ipucu', 'içerik']
  },
  {
    id: 'web-scraper-ile-otomatik-icerik-ekleme',
    category: 'knowledge_base',
    title: 'Web Scraper ile Otomatik İçerik Ekleme',
    content: '# Web Scraper ile İçerik Ekleme\n\nBilgi bankasına tek tek içerik eklemek yerine, web sitenizden otomatik içerik çekebilirsiniz.\n\n## Nasıl Kullanılır?\n1. Bilgi Bankası sayfasına gidin\n2. \"Web\'den İçe Aktar\" butonuna tıklayın\n3. Web sitenizin URL\'sini girin\n4. Platform sayfayı tarar ve içerik önerisi sunar\n5. Uygun önerileri seçin\n6. \"İçe Aktar\" ile bilgi bankasına ekleyin\n\n## İpuçları\n- Hizmetler sayfanızın URL\'sini girerek tüm hizmetleri otomatik çekebilirsiniz\n- SSS sayfanız varsa, soru-cevapları otomatik ayrıştırır\n- İçe aktarılan içerikleri düzenleme imkanı sunulur\n- İçerikler otomatik olarak AI\'ye öğretilir (embedding oluşturulur)',
    tags: ['scraper', 'web', 'otomatik', 'içerik']
  },

  // ── workflows ────────────────────────────────────────────

  {
    id: 'is-akislari-nasil-calisir',
    category: 'workflows',
    title: 'İş Akışları (Workflows) Nasıl Çalışır?',
    content: '# İş Akışları\n\nİş akışları, belirli olaylar gerçekleştiğinde otomatik aksiyonlar tetikleyen otomasyon kurallarıdır.\n\n## İş Akışı Türleri\n\n### Chatbot İş Akışları\n- **İlk Temas (Chat):** Yeni lead geldiğinde WhatsApp/Instagram üzerinden otomatik mesaj\n- **Takip Mesajı:** Belirli süre cevap vermeyen leadlere hatırlatma\n- **Randevu Hatırlatma:** Randevu öncesi otomatik hatırlatma mesajı\n- **Memnuniyet Anketi:** Hizmet sonrası otomatik anket\n- **Ödeme Takibi:** Ödeme bekleyen müşterilere hatırlatma\n- **Reaktivasyon:** Uzun süredir iletişime geçmemiş müşterilere ulaşma\n\n### Sesli Arama İş Akışları\n- **İlk Temas (Arama):** Yeni lead\'i otomatik arama\n- **Randevu Onayı:** Randevu öncesi onay araması\n- **No-Show Takibi:** Randevuya gelmeyen müşterileri arama\n\n## İş Akışı Yönetimi\nDashboard → İş Akışları sayfasından:\n- Mevcut şablonları aktifleştirin\n- Çalışma geçmişini görüntüleyin\n- İş akışlarını durdurun/başlatın',
    tags: ['workflow', 'otomasyon', 'akış']
  },
  {
    id: 'is-akisi-sablonlari-ve-aktivasyon',
    category: 'workflows',
    title: 'İş Akışı Şablonları ve Aktivasyon',
    content: '# İş Akışı Şablonları\n\nPlatform hazır iş akışı şablonları sunar. Tek yapmanız gereken ihtiyacınıza uygun şablonu aktifleştirmek.\n\n## Aktivasyon Adımları\n1. Dashboard → İş Akışları sayfasına gidin\n2. İlgili şablonu bulun\n3. \"Aktifleştir\" butonuna tıklayın\n4. Gerekli ayarları yapın (bekleme süresi, mesaj içeriği vb.)\n5. \"Onayla\" ile aktifleştirin\n\n## Çalışma Geçmişi\nHer iş akışının çalışma geçmişini görebilirsiniz:\n- Tetiklenme zamanı\n- Hedef lead/contact\n- Sonuç (başarılı/başarısız)\n- Hata detayları (varsa)\n\n## Önemli Notlar\n- İş akışları plan bazlı kısıtlamalara tabi olabilir\n- WhatsApp iş akışları için WhatsApp bağlantısı gereklidir\n- Sesli arama iş akışları için Voice Agent planı gereklidir',
    tags: ['workflow', 'şablon', 'aktivasyon']
  },
  {
    id: 'is-akisi-tetikleyicileri-ve-kosullar',
    category: 'workflows',
    title: 'İş Akışı Tetikleyicileri ve Koşullar',
    content: '# İş Akışı Tetikleyicileri\n\nİş akışları belirli olaylara otomatik tepki verir.\n\n## Tetikleyici Türleri\n\n### Lead Bazlı Tetikleyiciler\n- **Yeni lead:** CRM\'e yeni lead eklendiğinde\n- **Skor değişikliği:** Lead skoru belirli eşiği aştığında\n- **Durum değişikliği:** Lead aşaması değiştiğinde\n\n### Randevu Bazlı Tetikleyiciler\n- **Randevu oluşturma:** Yeni randevu kaydedildiğinde\n- **Randevu yaklaşma:** Randevu saatine X saat kala\n- **Randevu durumu:** Onay, iptal veya no-show durumlarında\n\n## Çalışma Geçmişi\nHer iş akışının sağ tarafındaki \"Geçmiş\" butonuna tıklayarak:\n- Ne zaman tetiklendiğini\n- Hangi lead/contact için çalıştığını\n- Başarılı mı başarısız mı olduğunu\n- Hata mesajını (varsa)\n\ngörebilirsiniz.\n\n## Önemli Notlar\n- Bir iş akışı aynı contact için kısa sürede tekrar tetiklenmez (debounce)\n- Başarısız çalışmalar otomatik tekrar denenmez, geçmişten incelenmelidir',
    tags: ['tetikleyici', 'koşul', 'trigger']
  },

  // ── integrations ─────────────────────────────────────────

  {
    id: 'whatsapp-entegrasyonu',
    category: 'integrations',
    title: 'WhatsApp Entegrasyonu',
    content: '# WhatsApp Entegrasyonu\n\nWhatsApp Business API üzerinden müşterilerinizle mesajlaşın.\n\n## Bağlantı Yöntemleri\n\n### 1. Embedded Signup (Önerilen)\n1. Dashboard → Ayarlar sayfasına gidin\n2. \"WhatsApp\'ı Bağla\" butonuna tıklayın\n3. Facebook hesabınızla giriş yapın\n4. WhatsApp Business hesabınızı seçin\n5. Telefon numaranızı doğrulayın\n6. Bağlantı otomatik tamamlanır\n\n### 2. Manuel Bağlantı\nMevcut bir WhatsApp Business API sağlayıcınız varsa:\n1. Ayarlar → WhatsApp bölümüne gidin\n2. \"Manuel Bağlantı\" seçeneğini tıklayın\n3. Phone Number ID, Business Account ID ve Access Token bilgilerini girin\n4. Kaydedin\n\n## Mesajlaşma Kuralları\n- **24 saat penceresi:** Müşteri size yazdıktan sonra 24 saat içinde serbest mesaj gönderebilirsiniz\n- **Template mesajlar:** 24 saat dışında sadece onaylanmış şablonlarla mesaj gönderebilirsiniz\n- **Ücretlendirme:** Meta\'nın conversation-based pricing kuralları geçerlidir',
    tags: ['whatsapp', 'entegrasyon', 'bağlantı']
  },
  {
    id: 'instagram-dm-entegrasyonu',
    category: 'integrations',
    title: 'Instagram DM Entegrasyonu',
    content: '# Instagram DM Entegrasyonu\n\nInstagram Direct Message üzerinden gelen mesajları AI asistanınıza yönlendirin.\n\n## Bağlantı Adımları\n1. Dashboard → Ayarlar sayfasına gidin\n2. \"Instagram\'ı Bağla\" butonuna tıklayın\n3. Facebook hesabınızla giriş yapın (Instagram hesabınızın bağlı olduğu FB hesabı)\n4. İzinleri onaylayın\n5. Instagram Professional hesabınızı seçin\n\n## Gereksinimler\n- Instagram hesabınız **Professional** (İşletme veya İçerik Üretici) olmalı\n- Bir Facebook sayfasına bağlı olmalı\n- \"Mesajlara erişime izin ver\" ayarı açık olmalı\n\n## Özellikler\n- Gelen DM\'leri AI otomatik cevaplar\n- Gelen Kutusu\'ndan elle cevap yazabilirsiniz\n- Story mention bildirimleri\n\n## Sorun Giderme\n- Instagram bağlantısı kopmuşsa Ayarlar → \"Instagram\'ı Yeniden Bağla\" butonuna tıklayın\n- Facebook sayfa yetkilerinizi kontrol edin',
    tags: ['instagram', 'entegrasyon', 'dm']
  },
  {
    id: 'form-ve-webhook-entegrasyonu',
    category: 'integrations',
    title: 'Form ve Webhook Entegrasyonu',
    content: '# Form ve Webhook Entegrasyonu\n\nWeb sitenizden veya landing page\'inizden gelen formları stoaix\'e otomatik aktarabilirsiniz.\n\n## Webhook URL\nAyarlar sayfasında organizasyonunuza özel webhook URL\'si bulunur. Bu URL\'ye POST isteği göndererek yeni lead oluşturabilirsiniz.\n\n## İstek Formatı\n```json\n{\n  \"name\": \"Müşteri Adı\",\n  \"phone\": \"+905551234567\",\n  \"email\": \"musteri@example.com\",\n  \"source\": \"website_form\",\n  \"notes\": \"Ek bilgiler\"\n}\n```\n\n## Desteklenen Entegrasyonlar\n- **Tally, Typeform, JotForm:** Webhook entegrasyonunu kullanarak doğrudan bağlayabilirsiniz\n- **WordPress:** Contact Form 7, Elementor Forms ile webhook entegrasyonu\n- **Zapier / Make:** Herhangi bir form aracından webhook ile aktarım\n\n## Önemli Notlar\n- Telefon numarası zorunlu alandır\n- Duplike telefon numaraları mevcut lead\'e eklenir, yeni lead oluşturmaz',
    tags: ['webhook', 'form', 'entegrasyon']
  },
  {
    id: 'haric-tutulan-telefon-numaralari',
    category: 'integrations',
    title: 'Hariç Tutulan Telefon Numaraları',
    content: '# Hariç Tutulan Telefon Numaraları\n\nBelirli telefon numaralarını AI asistandan hariç tutarak, bu numaralardan gelen mesajlara AI\'nin cevap vermesini engelleyebilirsiniz.\n\n## Ne İçin Kullanılır?\n- Kendi telefon numaranız (kişisel mesajlarınıza AI cevap vermesin)\n- İş ortaklarınızın numaraları\n- Test numaraları\n- AI\'nin cevap vermemesi gereken VIP müşteriler\n\n## Nasıl Eklenir?\n1. Dashboard → Ayarlar sayfasına gidin\n2. \"Hariç Tutulan Numaralar\" bölümünü bulun\n3. Telefon numarasını ülke koduyla birlikte girin (ör: +905551234567)\n4. \"Ekle\" butonuna tıklayın\n\n## Nasıl Çalışır?\nHariç tutulan numaralardan gelen mesajlar:\n- CRM\'e kaydedilir (lead takibi devam eder)\n- Ancak AI otomatik cevap göndermez\n- Gelen Kutusu\'ndan manuel cevap yazabilirsiniz',
    tags: ['hariç', 'telefon', 'numara', 'engelle']
  },

  // ── calendar ─────────────────────────────────────────────

  {
    id: 'takvim-ve-randevu-yonetimi',
    category: 'calendar',
    title: 'Takvim ve Randevu Yönetimi',
    content: '# Takvim ve Randevu Yönetimi\n\nDashboard → Takvim sayfasından randevularınızı yönetebilirsiniz.\n\n## Özellikler\n- **Randevu görüntüleme:** Gün, hafta ve ay bazında randevuları görüntüleyin\n- **Yeni randevu:** Manuel olarak randevu oluşturun\n- **Lead bağlantısı:** Randevuyu bir lead ile ilişkilendirin\n- **Durum takibi:** Bekliyor, onaylandı, tamamlandı, iptal\n\n## AI ile Otomatik Randevu\nAI asistan, müşterilerle konuşma sırasında randevu oluşturabilir. Bu özelliği kullanmak için:\n1. Takvim entegrasyonunuzun aktif olduğundan emin olun\n2. AI persona ayarlarında randevu alma yetkisi verin\n3. Çalışma saatlerinizi belirleyin\n\n## Takvim Entegrasyonları\n- **Google Calendar:** Google hesabınızı bağlayarak senkronize edin\n- **Manuel:** Platform içi takvim kullanın\n\n## Randevu Hatırlatma\nİş akışları ile randevu öncesi otomatik hatırlatma mesajları gönderilebilir (WhatsApp veya sesli arama).',
    tags: ['takvim', 'randevu', 'calendar']
  },

  // ── templates ────────────────────────────────────────────

  {
    id: 'whatsapp-mesaj-sablonlari',
    category: 'templates',
    title: 'WhatsApp Mesaj Şablonları',
    content: '# WhatsApp Mesaj Şablonları\n\nWhatsApp Business API\'da 24 saatlik mesajlaşma penceresi dışında mesaj göndermek için onaylanmış şablonlar kullanmanız gerekir.\n\n## Şablon Oluşturma\nDashboard → Şablonlar sayfasından:\n1. \"Yeni Şablon\" butonuna tıklayın\n2. Şablon adını girin (İngilizce, alt çizgi ile)\n3. Kategori seçin (Marketing, Utility, Authentication)\n4. Dil seçin\n5. Mesaj içeriğini yazın\n6. Değişken kullanabilirsiniz: {{1}}, {{2}} vb.\n7. \"Meta\'ya Gönder\" ile onaya gönderin\n\n## Onay Süreci\n- Meta genellikle 24 saat içinde onaylar\n- Reddedilen şablonlar düzenlenip tekrar gönderilebilir\n- Spam içerikli veya agresif satış dilindeki şablonlar reddedilir\n\n## Şablon Kategorileri\n- **Utility:** İşlem bildirimleri (randevu hatırlatma, sipariş durumu)\n- **Marketing:** Promosyon ve kampanyalar\n- **Authentication:** Doğrulama kodları\n\n## İpuçları\n- Kısa ve net mesajlar daha yüksek onay oranına sahiptir\n- Kişiselleştirme için değişkenler kullanın\n- İlk şablonunuz için \"Utility\" kategorisi önerilir',
    tags: ['şablon', 'template', 'whatsapp']
  },

  // ── settings ─────────────────────────────────────────────

  {
    id: 'hesap-ve-organizasyon-ayarlari',
    category: 'settings',
    title: 'Hesap ve Organizasyon Ayarları',
    content: '# Hesap Ayarları\n\nDashboard → Ayarlar sayfasından organizasyonunuzun ayarlarını yönetebilirsiniz.\n\n## İşletme Bilgileri\n- İşletme adı, telefon, e-posta\n- Şehir ve ülke\n- Sektör bilgisi\n\n## Kullanıcı Yönetimi\nOrganizasyonunuza yeni kullanıcılar ekleyebilirsiniz:\n- **Patron:** Tüm yetkilere sahip\n- **Yönetici:** Satış ve operasyon yönetimi\n- **Satışçı:** Lead ve konuşma yönetimi\n- **Muhasebe:** Finansal bilgi erişimi\n\n## Dil Ayarı\nPlatform dili Türkçe veya İngilizce olarak değiştirilebilir. Sağ üst köşedeki dil seçicisini kullanın.\n\n## Hariç Tutulan Numaralar\nBelirli telefon numaralarını AI asistandan hariç tutabilirsiniz. Bu numaralardan gelen mesajlara AI cevap vermez (ör: kendi numaranız, ortaklarınız).',
    tags: ['ayarlar', 'hesap', 'kullanıcı']
  },
  {
    id: 'ai-persona-ve-sistem-ayarlari',
    category: 'settings',
    title: 'AI Persona ve Sistem Ayarları',
    content: '# AI Persona Ayarları\n\nAI asistanınızın kişiliğini ve davranışını özelleştirebilirsiniz.\n\n## AI Asistan Sayfası\nDashboard → AI Asistan sayfasından:\n- AI\'nin adını belirleyin (ör: \"Ayşe\", \"Mehmet\")\n- Konuşma tonunu ayarlayın (resmi/samimi)\n- System prompt\'u özelleştirin\n- Test konuşması yapın\n\n## Prompt Optimizasyonu\nAI Asistan sayfasındaki \"KB/Prompt Optimizer\" panelinden:\n- Bilgi bankası kalite özeti görebilirsiniz\n- Eksik içerik önerileri alabilirsiniz\n- Prompt iyileştirme tavsiyeleri\n\n## Veri Toplama Şeması\nAI\'nin müşterilerden toplamaya çalışacağı bilgileri belirleyebilirsiniz:\n- İsim, telefon, e-posta (varsayılan)\n- Sektöre özel alanlar (ör: tedavi türü, bütçe aralığı)\n\n## Kanal Ayarları\nHer kanal (WhatsApp, Instagram, Voice) için ayrı AI davranışı tanımlanabilir.',
    tags: ['persona', 'ai', 'prompt']
  },
  {
    id: 'dil-ve-saat-dilimi-ayarlari',
    category: 'settings',
    title: 'Dil ve Saat Dilimi Ayarları',
    content: '# Dil ve Saat Dilimi Ayarları\n\nDashboard → Ayarlar → \"Genel\" sekmesinden dil ve saat dilimi tercihlerinizi belirleyebilirsiniz.\n\n## Platform Dili\nSağ üst köşedeki dil seçicisi ile dashboard dilini değiştirebilirsiniz:\n- **Türkçe (TR):** Varsayılan\n- **English (EN):** İngilizce arayüz\n\n## AI Varsayılan Dili\nAyarlar → Genel bölümünden AI asistanınızın varsayılan konuşma dilini seçebilirsiniz. AI, müşterinin diliyle cevap vermeye çalışır, ancak varsayılan dil belirsiz durumlarda kullanılır.\n\n## Saat Dilimi\nSeçilen saat dilimi şunları etkiler:\n- İş akışı tetikleme zamanları\n- Randevu saatleri\n- Raporlardaki tarih/saat gösterimi\n- Arama kayıtlarındaki zaman damgaları\n\nDoğru saat dilimi seçimi, özellikle randevu hatırlatma iş akışları için kritik öneme sahiptir.',
    tags: ['dil', 'saat dilimi', 'ayar']
  },
  {
    id: 'modul-yonetimi',
    category: 'settings',
    title: 'Modül Yönetimi — Özellikleri Açma ve Kapatma',
    content: '# Modül Yönetimi\n\nDashboard → Ayarlar → \"Modüller\" sekmesinden platform özelliklerini açıp kapatabilirsiniz.\n\n## Modüller Listesi\nPlanınıza göre kullanılabilir modüller:\n- **WhatsApp:** WhatsApp mesajlaşma\n- **Instagram:** Instagram DM\n- **Gelen Kutusu:** Unified Inbox\n- **Sesli AI:** Voice Agent (gelen/giden arama)\n- **Bilgi Bankası:** KB yönetimi\n- **CRM / Leadler:** Lead yönetimi\n- **Teklifler:** Teklif ve ödeme modülü\n- **Takvim:** Randevu yönetimi\n- **Takip Görevleri:** Follow-up tasks\n- **Analitik:** Gelişmiş raporlar\n- **API / Webhook:** Dış entegrasyonlar\n- **Ekip Yönetimi:** Multi-user\n- **Şablonlar:** WhatsApp template\n\n## Nasıl Çalışır?\n- **Kilit ikonu:** Bu özellik planınızda mevcut değil (yükseltme gerekir)\n- **Toggle açık:** Özellik aktif\n- **Toggle kapalı:** Özellik devre dışı (veriler silinmez, sadece erişim kapatılır)\n\nKullanmadığınız modülleri kapatarak dashboard\'ı sadeleştirebilirsiniz.',
    tags: ['modül', 'özellik', 'toggle']
  },
  {
    id: 'crm-pipeline-yonetimi',
    category: 'settings',
    title: 'CRM Pipeline Yönetimi',
    content: '# CRM Pipeline Yönetimi\n\nDashboard → Ayarlar → \"Pipelinelar\" sekmesinden satış süreçlerinizi (pipeline) yönetebilirsiniz.\n\n## Pipeline Nedir?\nPipeline, lead\'lerin geçtiği aşamaların sıralı bir görünümüdür. Farklı hizmetler veya satış süreçleri için farklı pipeline\'lar oluşturabilirsiniz.\n\n## Varsayılan Aşamalar\nHer pipeline şu aşamalarla başlar:\n1. Yeni Lead\n2. AI Qualifying\n3. Hot Lead / Handoff\n4. Nurturing\n5. Randevu\n6. Kazanıldı\n7. Kayıp\n\n## Multi-Pipeline\n- **Essential plan:** 1 pipeline\n- **Professional plan:** 3 pipeline\'a kadar\n- **Business plan:** Sınırsız pipeline\n\n## Pipeline İşlemleri\n- Yeni pipeline oluşturma\n- Aşama ekleme, silme veya yeniden sıralama\n- Varsayılan pipeline belirleme\n- Pipeline\'a özel lead filtreleme (Kanban görünümünde)',
    tags: ['pipeline', 'crm', 'aşama']
  },

  // ── billing ──────────────────────────────────────────────

  {
    id: 'planlar-ve-fiyatlandirma',
    category: 'billing',
    title: 'Planlar ve Fiyatlandırma',
    content: '# Planlar ve Fiyatlandırma\n\nstoaix dört farklı plan sunar:\n\n## Essential — $79/ay ($63/ay yıllık)\n- Tam CRM sistemi\n- Sınırsız WhatsApp, Instagram ve web chat\n- Sınırsız bilgi bankası\n- 5 kullanıcıya kadar\n- Sesli arama dahil **değil**\n\n## Professional — $149/ay ($119/ay yıllık)\n- Essential\'daki her şey\n- Sesli AI asistan (Gelen arama, 150 dk/ay)\n- Gelişmiş analitik\n- 10 kullanıcıya kadar\n- 3 pipeline\'a kadar\n\n## Business — $299/ay ($239/ay yıllık)\n- Professional\'daki her şey\n- Gelen + Giden sesli arama (300 dk/ay shared pool)\n- Tüm iş akışı şablonları\n- Çok dilli ses desteği\n- 20 kullanıcıya kadar\n\n## Custom — Görüşmeli\n- Sınırsız her şey\n- Özel entegrasyonlar\n- Öncelikli destek\n- SLA garantisi\n\n## Plan Değişikliği\nDashboard → Ayarlar → Abonelik sayfasından planınızı yükseltebilir veya düşürebilirsiniz.',
    tags: ['plan', 'fiyat', 'abonelik']
  },
  {
    id: 'odeme-ve-fatura-islemleri',
    category: 'billing',
    title: 'Ödeme ve Fatura İşlemleri',
    content: '# Ödeme ve Fatura\n\n## Ödeme Yöntemleri\n- Kredi kartı (Visa, Mastercard, Amex)\n- Stripe üzerinden güvenli ödeme\n\n## Fatura Dönemi\n- Aylık planlar: Her ay aynı tarihte\n- Yıllık planlar: Yılda bir kez\n\n## Fatura Erişimi\nDashboard → Ayarlar → Abonelik sayfasından:\n- Mevcut planınızı görüntüleyin\n- Kullanım istatistiklerini kontrol edin\n- Ödeme geçmişinizi inceleyin\n\n## Deneme Süresi\nYeni müşteriler 14 günlük ücretsiz deneme süresiyle başlar. Deneme süresi bitiminde otomatik ödeme başlar.\n\n## İptal\nAboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal sonrası mevcut dönem sonuna kadar erişiminiz devam eder.',
    tags: ['ödeme', 'fatura', 'stripe']
  },
  {
    id: 'plan-degisikligi-ve-yukseltme',
    category: 'billing',
    title: 'Plan Değişikliği ve Yükseltme',
    content: '# Plan Değişikliği\n\n## Plan Yükseltme\nDaha üst plana geçtiğinizde:\n- Yeni özellikler anında aktif olur\n- Mevcut dönemden kalan tutar oranlanarak yeni plana uygulanır\n- Ek farkı hemen ödenir\n\n## Plan Düşürme\nDaha alt plana geçtiğinizde:\n- Mevcut dönem sonuna kadar üst plan özellikleri aktif kalır\n- Sonraki dönemde alt plan uygulanır\n- Üst plana özel verileriniz silinmez, sadece erişim kısıtlanır\n\n## Plan Değişikliği Yapmak İçin\n1. Dashboard → Ayarlar → Abonelik sayfasına gidin\n2. \"Plan Değiştir\" butonuna tıklayın\n3. Yeni planı ve ödeme dönemini seçin (aylık/yıllık)\n4. Ödeme bilgilerinizi onaylayın\n\n## Yıllık Plandan Aylığa Geçiş\nYıllık plan süresi dolmadan aylık plana geçiş yapılamaz. Dönem sonunda plan türünü değiştirebilirsiniz.',
    tags: ['plan', 'yükseltme', 'düşürme']
  },
  {
    id: 'aylik-kullanim-takibi',
    category: 'billing',
    title: 'Aylık Kullanım Takibi',
    content: '# Aylık Kullanım Takibi\n\nDashboard → Ayarlar → Abonelik → \"Kullanım Detayları\" ile aylık kullanımınızı takip edebilirsiniz.\n\n## Takip Edilen Metrikler\n\n| Metrik | Açıklama |\n|---|---|\n| WhatsApp Mesajları | Gönderilen giden WhatsApp mesaj sayısı |\n| Sesli Arama Dakikaları | Kullanılan toplam sesli arama süresi |\n| Bilgi Bankası Kayıtları | KB\'deki toplam kayıt sayısı |\n| CSV İçe Aktarma | İçe aktarılan satır sayısı |\n| Ekip Üyeleri | Aktif kullanıcı sayısı |\n| WhatsApp Şablonları | Oluşturulan şablon sayısı |\n\n## Görsel Göstergeler\n- **Yeşil:** %80\'in altında — güvenli bölge\n- **Turuncu:** %80-95 — limite yaklaşılıyor\n- **Kırmızı:** %95 üzeri — limit aşılmak üzere\n\n## Limit Aşıldığında Ne Olur?\nLimitinize ulaştığınızda ilgili özellik geçici olarak kısıtlanır. Plan yükseltme ile limitlerinizi artırabilirsiniz.\n\n## Dönem\nKullanım sayaçları her fatura döneminin başında sıfırlanır (aylık veya yıllık planınıza göre).',
    tags: ['kullanım', 'limit', 'metrik']
  }

];
