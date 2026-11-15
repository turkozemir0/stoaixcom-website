# SEO-GEO asistanı — çalışma kitabı

STOAIX'in kendi sitesi (stoaix.com) için düzenli çalışan SEO-GEO asistanı. Claude Code bulut rutini olarak **her pazartesi** çalışır; bu dosya rutinin talimatıdır. Elle çalıştırmak için de aynı adımlar geçerli.

## Neyi neden yapıyoruz

Çerçeveler ve bizdeki karşılıkları aşağıda. İlk beşi Lawrence Hitches / Hawk Academy SEO kartlarından geliyor (15 Kas 2026). Diğerleri 7 açık kaynak repodan: claude-seo, geo-seo-claude, open-seo-mcp-skills, marketing-skills, notfair, GEOFlow, aaron-marketing-skills. Bu repolardaki üçüncü taraf istatistikler (ör. "%527 artış") doğrulanmadı; site metnine girmez.

| Çerçeve | Kural | Bizde |
|---|---|---|
| Information Gain | Google'ın zaten bildiğini tekrar eden sayfa sıfır kazanç. Kazanç 5 kaynaktan gelir: ilk elden deneyim, özgün veri, savunulabilir karşı görüş, süreç detayı, yeni sentez. Daha çok kelime/başlık/anahtar kelime kazanç değildir. | `infoGain` skoru (0–10); en düşük para sayfaları her hafta elden geçer. Skill: `information-gain-finder` |
| Topical Authority | Tek konu haritası; her sayfanın rolü var (hub, destek, tanım, soru). Hub her destek sayfasına, destek hub'a ve kardeşlerine link verir; her sayfa hub'a ≤ 3 tık. Ölç: kapsama oranı, link derinliği, sıralama genişliği, AI alıntı sıklığı. | `tools/seo/topical-map.mjs` + `articles.mjs` (hub ↔ yazı ↔ kardeş). Skill: `topical-authority` |
| Query Fan-Out | AI sorgunun arkasındaki alt soruları araştırır, en çoğunu cevaplayanı alıntılar. Alt soruları çıkar, cevabı başa koy, gerçek SSS ekle, kümeyi bağla. Google: AI Overviews için ek bir şart yok; llms.txt/özel işaretleme gerekmiyor. | `fanout.json` + kapsama raporu. Skill: `query-fanout` |
| Claude SEO skill zinciri | Denetle → planla → yaz → ölç; her skill tek iş. | `.claude/skills/*` ve bu kitap |
| Pasaj alıntılanabilirliği (GEO) | AI motoru sayfayı değil pasajı alıntılar. İyi pasaj kendi başına anlamlıdır: ilk cümlesi tanım, 134–167 kelime, zamir yok, rakamı ve kaynağı var. Alıntıların çoğu sayfanın ilk %30'undan gelir. | `citability` (0–100, A ≥80 · B ≥65 · C ≥50). Skill: `information-gain-finder` |
| Teknik temel ve AI tarayıcıları | Google'ın kendi cümlesi: üretken AI araması için optimizasyon hâlâ SEO'dur. Sayfa indekslenmeli ve snippet verebilmeli. Arama tarayıcıları (OAI-SearchBot, Claude-SearchBot, PerplexityBot) açık olmalı. Eğitim tarayıcıları ayrı bir politika kararıdır. Google-Extended, Google Arama'yı etkilemez. | `robots` kontrolü, `hreflang` doğrulayıcı, `drift` (haftalık sayfa fotoğrafı: başlık, canonical, noindex, H1, schema) |
| Kalite kapısı (GEOFlow, notfair) | Yayın öncesi her rakam, iddia ve vaat kontrol edilir. Kaynağı olmayan rakam insan onayına gider. Yasaklı kelime ya da kritik teknik bozulma yayını durdurur. | `npm run seo:gate` → passed / needs_review / blocked |
| E-E-A-T (sağlık işletmesi içeriği) | Kim yazdı, nasıl yazdı, neden yazdı? Görünür bir yazar adı, yazar sayfası ve görünür tarih olmalı. Sahte "güncellendi" tarihi konmaz. | Rapordaki E-E-A-T satırı |
| AI görünürlük ölçümü | Sabit kimlikli alıcı soruları kullanılır. Her motorda iki ayrı oturumda sorulur. Markalı ve markasız sorular ayrı tutulur. Sonuç evet / hayır / bilinmiyor diye kaydedilir. Bizim web aramamız başka bir motorun cevabı yerine geçmez. | `ai-panel.json`, `AI-VISIBILITY.md` |
| Backlink + Dijital PR (RAIDS) | Tek test: "Bu link arama motoru olmasa da var olur muydu?" Satın alma, PBN, profil çiftliği yok. Çeyrekte bir veri tabanlı PR kampanyası. | Skill: `link-earning` (aylık kontrol, çeyreklik kampanya taslağı) |

## Kesin kurallar

1. **`main`'e asla push yok.** Her çalışma `seo/weekly-<YYYY-MM-DD>` branch'i açar, push eder, PR açar. Yayına almak Emir'in işi.
2. **Uydurma rakam, müşteri adı, yorum ya da vaka yok.** Rakam ya bizim ürün verimizden (`js/pricing.mjs`, `tools/seo/products/*`) gelir ya da kaynaklı kamu verisidir (link verilir). İlk elden deneyim cümlesi ancak Ata'nın yazılı notu varsa yazılır.
3. Türkçe metinde "ajan / agent" yazılmaz; "asistan, ekip üyesi, yapay zekâ satış takımı" kullanılır.
4. Fiyatlar yalnız `js/pricing.mjs`'den okunur; elle yazılmaz.
5. HTML elle düzenlenmez: içerik `tools/seo/**` ve `blog/*.html` kaynaklarında değişir, sonra `npm run site`.
6. Haftada en fazla **5 sayfa** içerik değişikliği. PR küçük kalsın, Emir'in incelemesi kolay olsun.
7. `npm run site` (kırık link 0) ve `npm run test:seo` geçmeden push yok.
8. Sağlık reklam yönetmeliği: tedavi vaadi, önce/sonra, hasta yorumu yok (bkz. `/saglikta-reklam-yasagi`).
9. **`npm run seo:gate` "blocked" derse push yok.** Sebep rapora yazılır, iş bir sonraki haftaya kalır. "needs_review" çıkarsa push yapılır; bulgular PR açıklamasında **"Onay gerekenler"** başlığı altında listelenir.
10. robots.txt'te arama tarayıcıları kapatılmaz. Eğitim tarayıcıları için politika Ata'nın kararıdır.
11. Tarih dürüst olur: `dateModified` yalnız içerik gerçekten değiştiğinde güncellenir.

## Haftalık akış (her pazartesi)

1. `git checkout main && git pull` → `git checkout -b seo/weekly-<tarih>`
2. `npm ci` (gerekirse) → `npm run site` → `npm run seo:audit`. Bu ilk denetim, drift tabanını (`reports/seo/snapshot.json`) geçen haftayla karşılaştırır ve bu haftanın başlangıç fotoğrafını kaydeder.
3. Raporu oku (`reports/seo/<tarih>.md`). Öncelik sırası:
   0. **Teknik alarm**: Drift KRİTİK satırı varsa önce onu çöz. Bunlar noindex, canonical değişikliği, sitemap'ten düşen sayfa ve kaybolan H1/schema. Ayrıca engelli bir arama tarayıcısı ve hreflang hatası (dönüş linki, geçersiz kod) varsa onları da çöz. İçerik işi bekler.
   1. **Yapı**: ulaşılamayan / 3 tıktan derin sayfa varsa düzelt. Hub'a düşen yazılar için `topical-map.mjs`'e kural ekle (`topical-authority`).
   2. **Search Console** (GSC bağlıysa, `striking-distance`). Üç iş var:
      - **Vurmaya yakın sorgular**: En çok gösterim alan 2 sorguya tek dokunuş yap: başlık, ilk paragraf ya da bir SSS.
      - **CTR anomalisi**: İlk 5'te çıkıp CTR'si %2'nin altında kalan sorguda yalnız başlığı ve açıklamayı düzelt.
      - **Yamyamlaşma**: Aynı sorguda 2'den fazla sayfa varsa sayfaya dokunma, PR'da Ata'ya sor (`topical-authority` → SERP örtüşme testi).
   3. **Fan-out boşlukları**: her boşluğa answer-first bir SSS ya da paragraf (`query-fanout`).
   4. **Information Gain + alıntılanabilirlik**: En düşük skorlu para sayfalarından en fazla 2'sine kazanç ekle. Sayfanın en iyi pasajı C'nin altındaysa ya da ilk %30'da değilse, başa tek başına anlaşılır bir cevap bloğu koy (`information-gain-finder`).
4. `npm run site` → **`npm run seo:gate`** (blocked ise dur, kural 9) → `npm run seo:audit` (rapor ve fotoğraf güncellensin) → `npm run test:seo`
5. Commit (`feat(seo): haftalık SEO-GEO — <tarih>`), push, PR. PR açıklamasına şunlar girer:
   - raporun Özet tablosu
   - değişen sayfalar
   - kapının "Onay gerekenler" listesi
   - varsa "Ata'ya sorular"

## Aylık (ayın ilk pazartesisi, haftalık akışa ek)

- **Fan-out yenile**: `fanout.json`'daki her ana sorgu için web araması yap, "If someone asks [query], what sub-questions would you research before answering?" mantığıyla eksik alt soruları ekle.
- **AI görünürlük ölçümü** (`docs/seo-agent/AI-VISIBILITY.md`): `reports/seo/ai-citations.md` dosyasına bu ayın boş tablosunu panelden (`ai-panel.json`) hazırla. Ölçümü bir insan yapar. Geçen ayın tablosu doluysa iki ayı karşılaştır. Rakiplerin ve dizinlerin hangi sayfalardan alıntılandığını bul (kaynak açığı) ve bunları `link-earning` listesine ekle.
- **Alt konu kapsaması ve SERP örtüşmesi** (`topical-authority`): Yeni sayfa önerisi yapılmadan önce örtüşme testi yapılır.
- **Link kazanımı kontrol listesi** (`link-earning`): işletme profilleri, NAP tutarlılığı, gazeteci istekleri.

## Çeyreklik (ocak, nisan, temmuz, ekim ilk pazartesi)

- RAIDS dijital PR kampanya taslağı: `docs/seo-agent/pr/<YYYY-QN>.md` (fikir, veri kaynağı, başlık, medya listesi şablonu, pitch e-postası). Gönderim Ata'nın onayıyla yapılır; rutin e-posta göndermez.

## Ölçüm

- Search Console: `GSC_SERVICE_ACCOUNT` (servis hesabı JSON'u, base64 olabilir) ve isteğe bağlı `GSC_SITE` (varsayılan `sc-domain:stoaix.com`) rutin ortamında tanımlı olmalı. Servis hesabının e-postası Search Console'da mülke **Kısıtlı** kullanıcı olarak eklenir.
- Her rapor JSON'u bir öncekiyle karşılaştırılır. Özet tablosundaki parantezler haftalık farkı gösterir. Sayfa fotoğrafı `reports/seo/snapshot.json`'da sayfa başına tek satır tutulur; git geçmişi eski fotoğrafları saklar.
- GSC verisi yaklaşık 3 gün gecikmeli gelir. Denetim son 3 günü saymaz.

## Platform kurulumu (bir kez, Emir)

Kod bunları yapamaz. Hepsi hesap ayarıdır:

- [ ] Search Console: servis hesabını Kısıtlı kullanıcı olarak ekle. Ayarlarda "Search generative AI" kontrolü **açık** kalsın.
- [ ] Bing Webmaster Tools: Siteyi ekle ve sitemap'i gönder. GSC'den içe aktarma tek tıkla yapılır. Bing, ChatGPT aramasının kaynaklarından biridir.
- [ ] IndexNow: İsteğe bağlı. Bing ve Yandex'e anında bildirim gönderir. Kurulursa anahtar dosyası köke konur.
- [ ] Yazar sayfası: 215 yazıda yazar "Ata Ulufer" ya da "Emir Türköz" olarak görünüyor, ama yazarların kendi sayfası yok ve hakkımızda sayfası ikisini tanıtmıyor. Kurucu bilgisi ve LinkedIn linki Ata ile Emir'den gelir; uydurulmaz. Sayfalar açılınca yazı JSON-LD'sindeki `author.url` bu sayfalara bağlanır.
