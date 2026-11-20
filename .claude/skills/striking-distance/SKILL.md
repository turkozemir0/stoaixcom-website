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

## CTR anomalisi (raporda ayrı tablo)
Sorgu ilk 5'te ama CTR'si %2'nin altındaysa sorun sıra değil, vitrin. Sayfa gövdesine dokunma; yalnız `title` ve `desc`'i değiştir:
- Başlık sorgunun niyetini karşılıyor mu? Fiyat soruluyorsa fiyat, "nedir" soruluyorsa tanım.
- Açıklama tıklamak için bir sebep veriyor mu? Somut süreç ya da rakam olmalı ve rakam `js/pricing.mjs`'den gelmeli.
Başlık 30–60 karakter, açıklama 155 karakter olsun. Ancak sonucu kontrol et: SERP'te AI Overview varsa düşük CTR normal olabilir. Bu durumu PR'a not et.

## Yamyamlaşma
Aynı sorguda 2 ya da daha fazla sayfa görünüyorsa iki sayfayı da değiştirme. Kararı `topical-authority` skill'indeki SERP örtüşme testiyle ver ve PR'da Ata'ya sor.

## Düşen sayfalar
Tıklaması %30'dan fazla düşen sayfada önce dışarıya bak. Aynı sorgu için SERP değişmiş mi? Yeni bir AI Overview mı çıkmış? Rakip daha taze bir sayfa mı yayınlamış? Sonra içerik yenile. Yenileme gerçek bir eklemeyle olur; yalnız tarihi değiştirmek yenileme değildir.

GSC bağlı değilse bu skill atlanır.
