---
name: striking-distance
description: Search Console'da 4–15. sırada duran sorgular için sayfa başına tek, en ucuz dokunuşu seçer ve yapar (başlık, ilk paragraf ya da SSS). Raporun "Vurmaya yakın" tablosu doluysa kullan.
---

# Striking Distance Finder

Önce en ucuz hamle: yeniden yapılandır, sonra göm, sonra üret. 4–15. sıradaki sorgu, yeni sayfa değil küçük bir ayar ister.

## Adımlar
1. `reports/seo/<tarih>.md` → "Vurmaya yakın" tablosundan en çok gösterim alan **2 sorguyu** seç.
2. Her biri için sayfayı aç ve dokunuşlardan **yalnız birini** seç:
   - Sorgu başlıkta yoksa → `title` başı sorguyla başlasın (≤ 65 karakter, marka sonda).
   - Başlık uygun ama tık az → `desc` sorguya cevap versin (≤ 160 karakter).
   - Sayfa sorguyu derinden cevaplamıyor → answer-first bir SSS ya da paragraf.
3. Değişikliği PR açıklamasına yaz: sorgu, eski sıra, ne değişti. Bir sonraki aylık raporda sonucu kontrol et. 2 hafta içinde düşüş varsa geri al.

GSC bağlı değilse bu skill atlanır.
