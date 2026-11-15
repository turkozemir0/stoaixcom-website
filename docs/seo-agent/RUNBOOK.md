# SEO-GEO asistanı — çalışma kitabı

STOAIX'in kendi sitesi (stoaix.com) için düzenli çalışan SEO-GEO asistanı. Claude Code bulut rutini olarak **her pazartesi** çalışır; bu dosya rutinin talimatıdır. Elle çalıştırmak için de aynı adımlar geçerli.

## Neyi neden yapıyoruz

Beş çerçeve (Lawrence Hitches / Hawk Academy SEO kartları, 15 Kas 2026) ve bizdeki karşılığı:

| Çerçeve | Kural | Bizde |
|---|---|---|
| Information Gain | Google'ın zaten bildiğini tekrar eden sayfa sıfır kazanç. Kazanç 5 kaynaktan gelir: ilk elden deneyim, özgün veri, savunulabilir karşı görüş, süreç detayı, yeni sentez. Daha çok kelime/başlık/anahtar kelime kazanç değildir. | `infoGain` skoru (0–10); en düşük para sayfaları her hafta elden geçer. Skill: `information-gain-finder` |
| Topical Authority | Tek konu haritası; her sayfanın rolü var (hub, destek, tanım, soru). Hub her destek sayfasına, destek hub'a ve kardeşlerine link verir; her sayfa hub'a ≤ 3 tık. Ölç: kapsama oranı, link derinliği, sıralama genişliği, AI alıntı sıklığı. | `tools/seo/topical-map.mjs` + `articles.mjs` (hub ↔ yazı ↔ kardeş). Skill: `topical-authority` |
| Query Fan-Out | AI sorgunun arkasındaki alt soruları araştırır, en çoğunu cevaplayanı alıntılar. Alt soruları çıkar, cevabı başa koy, gerçek SSS ekle, kümeyi bağla. Google: AI Overviews için ek bir şart yok; llms.txt/özel işaretleme gerekmiyor. | `fanout.json` + kapsama raporu. Skill: `query-fanout` |
| Claude SEO skill zinciri | Denetle → planla → yaz → ölç; her skill tek iş. | `.claude/skills/*` ve bu kitap |
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

## Haftalık akış (her pazartesi)

1. `git checkout main && git pull` → `git checkout -b seo/weekly-<tarih>`
2. `npm ci` (gerekirse) → `npm run site` → `npm run seo:audit`
3. Raporu oku (`reports/seo/<tarih>.md`). Öncelik sırası:
   1. **Yapı**: ulaşılamayan / 3 tıktan derin sayfa varsa düzelt. Hub'a düşen yazılar için `topical-map.mjs`'e kural ekle (`topical-authority`).
   2. **Vurmaya yakın sorgular** (GSC bağlıysa): en çok gösterim alan 2 sorguya tek dokunuş: başlık, ilk paragraf ya da bir SSS (`striking-distance`).
   3. **Fan-out boşlukları**: her boşluğa answer-first bir SSS ya da paragraf (`query-fanout`).
   4. **Information Gain**: en düşük skorlu para sayfalarından en fazla 2'sine kazanç ekle (`information-gain-finder`).
4. `npm run site` → `npm run seo:audit` (rapor güncellensin) → `npm run test:seo`
5. Commit (`feat(seo): haftalık SEO-GEO — <tarih>`), push, PR. PR açıklaması: raporun Özet tablosu + değişen sayfalar + "Ata'ya sorular" (varsa).

## Aylık (ayın ilk pazartesisi, haftalık akışa ek)

- **Fan-out yenile**: `fanout.json`'daki her ana sorgu için web araması yap, "If someone asks [query], what sub-questions would you research before answering?" mantığıyla eksik alt soruları ekle.
- **AI alıntı kontrolü**: ana sorguları web'de ara; STOAIX alıntılanıyor mu, kim alıntılanıyor? `reports/seo/ai-citations.md`'ye tarihli satır ekle (sorgu, alıntılanan alanlar, biz var mıyız).
- **Link kazanımı kontrol listesi** (`link-earning`): işletme profilleri, NAP tutarlılığı, gazeteci istekleri.

## Çeyreklik (ocak, nisan, temmuz, ekim ilk pazartesi)

- RAIDS dijital PR kampanya taslağı: `docs/seo-agent/pr/<YYYY-QN>.md` (fikir, veri kaynağı, başlık, medya listesi şablonu, pitch e-postası). Gönderim Ata'nın onayıyla yapılır; rutin e-posta göndermez.

## Ölçüm

- Search Console: `GSC_SERVICE_ACCOUNT` (servis hesabı JSON'u, base64 olabilir) ve isteğe bağlı `GSC_SITE` (varsayılan `sc-domain:stoaix.com`) rutin ortamında tanımlı olmalı. Servis hesabının e-postası Search Console'da mülke **Kısıtlı** kullanıcı olarak eklenir.
- Her rapor JSON'u bir öncekiyle karşılaştırılır; Özet tablosundaki parantezler haftalık farktır.
