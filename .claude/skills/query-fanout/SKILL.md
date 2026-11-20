---
name: query-fanout
description: Bir ana sorgunun arkasındaki alt soruları (fan) çıkarır, sitenin o kümede kaçını cevapladığını ölçer ve boşluklara answer-first SSS/paragraf yazar. SEO raporundaki fan-out boşlukları ya da "AI'da bizi neden alıntılamıyor" sorusu için kullan.
---

# Query Fan-Out

AI arama senin sorgunu çalıştırmaz. Sorgunun arkasındaki soruları çalıştırır ve en çoğunu cevaplayanı alıntılar. 6 alt sorudan 2'sini cevaplarsan dipnot olursun, 6'sını cevaplarsan alıntılanan sayfa olursun.

## Fan'i çıkar (aylık)
1. `tools/seo-agent/fanout.json`'daki her `query` için web araması yap. "People also ask" ve ilgili sorulara bak.
2. Kendine şunu sor: "Biri [query] diye sorsa, cevaplamadan önce hangi alt soruları araştırırdın?" Alıcının sorduğu ama listede olmayan soruları ekle. Her `fan` maddesine gevşek ama anlamlı `match` desenleri yaz (küçük harf, regex).
3. Yeni ana sorgu ekleyeceksen `pages` alanı, o kümenin hub + destek sayfalarıdır.

## Kapsamayı ölç (haftalık)
- `npm run seo:audit` kaba bir taban verir (regex). Raporda "cevaplanmış" görünen maddeleri de **anlam olarak** kontrol et. Kelime geçiyor ama soru gerçekten cevaplanmıyorsa boşluk say.

## Boşluğu kapat
- Önce kümede doğru sayfayı seç. Hub geneli cevaplar, destek sayfası derin cevaplar.
- Ürün/niyet sayfasında `faq` dizisine ekle: `[soru, cevap]`. Cevabın ilk cümlesi tek başına alıntılanabilir olsun, ≤ 60 kelime.
- Cevap tek sayfaya sığmıyorsa yeni sayfa açma kararını PR'da öner, kendin açma (topical-authority).
- Kümeyi bağla: cevap başka bir sayfaya derinleşiyorsa ona açıklayıcı anchor ile link ver.

## Niyet tipi (SXO)
Fan çıkarırken her alt sorunun hangi sayfa türünü istediğini not et. "Fiyatı ne kadar" sorusu fiyat bloğu ya da tablo ister. "Nasıl" sorusu adım listesi, "X mi Y mi" sorusu karşılaştırma tablosu ister. Cevabı doğru biçimde vermek, cevabı vermek kadar önemlidir.

Alıcı sorularının AI motorlarında nasıl göründüğünü ölçmek ayrı bir iştir. Bkz. `docs/seo-agent/AI-VISIBILITY.md`.

llms.txt ya da "AI işaretlemesi" peşine düşme. Google'ın kendi cümlesi: AI Overviews için ek gereksinim yok. İyi SEO yeter, ama sorunun tamamına yönelik olmalı.
