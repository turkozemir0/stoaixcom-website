---
name: information-gain-finder
description: Bir sayfanın hedef sorgusuna göre "konsensüs mü, özgün mü" ayrımını yapar, hiçbir şey katmayan cümleleri işaretler ve somut eklemeler önerir/yazar. SEO raporunda düşük Information Gain skorlu sayfa için ya da "bu sayfa ne katıyor" sorusunda kullan.
---

# Information Gain Finder

Google bir sorgu için zaten milyonlarca sayfa biliyor. Kazanç, sayfamızın bunlara eklediği şeydir. Konsensüsü tekrar edersen kazanç sıfır olur. Daha çok kelime, başlık ya da anahtar kelime kazanç değildir.

## Girdi
Sayfa yolu + hedef sorgu. İçerik kaynağı: ürün sayfası ise `tools/seo/products/<id>.mjs`, niyet sayfası ise `tools/seo/topics/*.mjs`, yazı ise `blog/<slug>.html` (`<article>` içi).

## Adımlar
1. Sorguyu web'de ara, ilk 5 sonucun ortak söylediklerini 5–8 maddede çıkar. Bu, **konsensüs**.
2. Sayfayı paragraf paragraf oku. Her cümleyi etiketle: `konsensüs`, `özgün` ya da `dolgu`. Dolgu ve konsensüs cümleleri silinmez, kısaltılır.
3. Beş kaynaktan eklenebilecekleri çıkar. Yalnız **doğrulanabilir** olanları yaz:
   - **Süreç detayı** (en güvenlisi): kurulumun gerçek adımları, ayarlar, devretme kuralları, mesaj zamanlaması. Kaynak: `tools/seo/products/*` ve `js/pricing.mjs`.
   - **Özgün veri**: yalnız kaynaklı kamu verisi (resmî istatistik, yönetmelik, sektör raporu), kaynak linkiyle. Bizim müşteri rakamımız Ata'nın yazılı onayı olmadan YOK.
   - **Savunulabilir karşı görüş**: sektörün standart tavsiyesinin nerede yanlış olduğu. Açık söylenir, gerekçelendirilir.
   - **Yeni sentez**: bu sorgu için kimsenin birleştirmediği iki fikir.
   - **İlk elden deneyim**: yalnız Ata'nın notu varsa. Yoksa PR açıklamasında "Ata'ya soru" olarak bırak.
4. Eklemeleri yaz. Her soru başlığında ilk paragraf ≤ 60 kelime, doğrudan cevap (answer-first).
5. Önce/sonra skorunu raporla: `npm run seo:audit -- --stdout`. Skor bir pusula, hedef değil. Skoru yükseltmek için sayı doldurma.

## Alıntılanabilir pasaj (GEO)
Raporda "en düşük alıntılanabilirlik" tablosu var. Bir pasajı AI motorunun alıntılayabileceği hâle getirmek için:
- **İlk cümle tanım olsun.** Örnek: "X, Y için Z yapan bir yazılımdır."
- **Uzunluk** 134–167 kelime arası olsun.
- **Zamirle başlama.** Pasaj "Bu", "O" ya da "Bunlar" ile açılmamalı. Pasaj tek başına okunduğunda anlaşılır olmalı.
- **Somut bilgi ver.** En az bir rakam ya da süreç adımı olsun. Kaynak varsa adını ver.
- **Yer:** En iyi pasaj sayfanın ilk %30'unda olmalı. Alıntıların çoğu oradan gelir.
- **Karşılaştırma tabloyla yapılır.** Tablo, AI'ın en kolay çıkardığı biçimdir.

## Yasak kalıplar (kapı yakalar)
- Dolgu cümleler: "Günümüzde…", "dijital çağda…".
- Kanıtsız üstünlük iddiaları: "en iyi", "lider", "1 numara".
- Kaynaksız genellemeler: "uzmanlara göre", "araştırmalar gösteriyor".

`npm run seo:gate` bu kalıpları bulur.

## Puan (PR açıklamasına)
Unique / Specific / Authentic: her biri 1–5 + tek cümle gerekçe.

## Kesin
Uydurma istatistik, müşteri adı, hasta yorumu, "kliniklerin %X'i" gibi kaynaksız genelleme yok. Türkçe metinde "ajan" yok.
