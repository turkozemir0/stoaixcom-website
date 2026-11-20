---
name: topical-authority
description: STOAIX konu haritasını (hub/destek/tanım/soru rolleri, iç link kümesi) korur ve büyütür. Hub'a düşen yazı, ulaşılamayan sayfa, 3 tıktan derin sayfa ya da "hangi sayfayı yazalım" sorusunda kullan.
---

# Topical Authority

Otorite yayın hacmiyle değil yapıyla kazanılır. Tek bir konu haritası olur ve her sayfa işini bilerek gelir.

## Roller
- **Hub**: ana terimi sahiplenir, her destek sayfasına link verir. Bizde ürün ve niyet sayfaları: `tools/seo/products/*`, `tools/seo/topics/*`, genel hub `tools/seo/hub.mjs`.
- **Destek**: tek bir alt konuda derinleşir, otoriteyi hub'a yönlendirir. Bizde `blog/*.html`.
- **Tanım**: sözlük ve "nedir" sayfaları. Bizde `/yapay-zeka-sozlugu`, `ROOT_PAGES` içindeki "nedir" ve "vs" sayfaları.
- **Soru**: AI'ın fan-out'ta ürettiği uzun kuyruk. Bizde SSS'ler ve soru başlıklı yazılar.

## Bağlantı kuralı (kodda)
`tools/seo/topical-map.mjs`, her yazıyı bir kümeye atar (`CLUSTER_RULES`, ilk eşleşen kazanır). `tools/seo/articles.mjs` iki yönlü bağı kurar. Hub "Bu konuda yazılar" listesiyle yazılarına bağlanır; yazı da altındaki küme kutusuyla hub'ına ve 3 kardeşine bağlanır. `npm run site` her derlemede yeniler.

## Haftalık
1. Rapordaki **Hub'a düşen** yazılar: yazıyı oku, hangi ürüne ait olduğunu belirle, `CLUSTER_RULES`'a dar bir desen ekle. Gerçekten hiçbir ürüne ait değilse (ör. genel klinik işletme yazısı) genel hub'da kalabilir; bunu rapora yaz.
2. **Ulaşılamayan / derin** sayfa: önce bir hub'dan ya da footer'dan link ver (`tools/v2-content.mjs` LINKS.footer). Reklam açılış sayfaları bilinçli olarak dışarıda (`checks.mjs` AD_LANDING).
3. Desen ekledikten sonra `npm run test:seo` içindeki `clusterOf` testine örnek ekle.

## SERP örtüşme testi (yeni sayfa ya da birleştirme kararından önce)
İki anahtar kelimeyi web'de ara ve ilk 10 sonuçtaki ortak URL'leri say:
- **7–10 ortak URL**: aynı niyet, aynı sayfa. İkinci sayfa açma; eş anlamlıyı `aka` alanına ekle.
- **4–6 ortak URL**: aynı küme. Ayrı sayfa olabilir ama ikisi birbirine link vermeli.
- **2–3 ortak URL**: ayrı sayfa, aralarına bir iç link koy.
- **0–1 ortak URL**: tamamen ayrı konu.

Bir de **sayfa türü** kontrolü yap. İlk 10 sonucun %60'ından fazlası aynı türdeyse (liste, rehber, ürün sayfası, karşılaştırma), bizim sayfamız da o türde olmalı. Tür uyuşmuyorsa içerik iyi olsa bile sıralama gelmez.

## Hub ↔ destek kuralı
- Her destek sayfası, hub'ına ve 2–3 kardeşine link verir.
- Hub, destek sayfalarının hepsine link verir.
- Şehir adı değiştirilerek kopyalanan sayfa (doorway) açılmaz.

## Aylık: kapsama oranı
Konu haritasındaki alt konuları canlı sayfalarla karşılaştır (30 alt konu, 8 canlı = %27). Eksik alt konuları PR açıklamasında "yazılacaklar" diye sırala. Yeni sayfa açmak Ata'nın kararı. Kural: **farklı niyet = farklı sayfa, eş anlamlı = aynı sayfa** (`aka`). Kombinasyon sayfası üretme (scaled content abuse).
