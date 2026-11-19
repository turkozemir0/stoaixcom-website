---
slug: klinik-hasta-hunisi-metrikleri
cluster: crm
title: Klinik Hasta Hunisi Metrikleri: Hasta Nerede Kaybediliyor?
desc: Başvurudan tedaviye hangi aşamada hasta kaybettiğinizi gösteren metrikler, formüller ve haftalık skor kartı. Uydurma ortalama değil, kendi taban çizginiz.
h1: Klinik hasta hunisi metrikleri: hasta nerede kaybediliyor?
category: Klinik CRM
lede: "Bu ay reklamlar işe yaramadı" cümlesi çoğu zaman yanlıştır. Sorun genellikle reklamda değil, başvuru ile tedavi arasındaki aşamalardan birindedir. Bunu görmek için his değil oran gerekir.
published: 2026-11-20
---

> **Kısa cevap:** Huniyi yazılı aşamalara bölün (başvuru, ilk cevap, görüşme, ön değerlendirme, teklif, depozito, tedavi) ve her aşama için bir oran hesaplayın: bir sonraki aşamaya geçen sayısı bölü önceki aşamadaki sayı. Süreler için ortanca, dönüşüm için kohort kullanın. Uydurma sektör ortalamalarıyla değil, kendi son 90 günlük taban çizginizle kıyaslayın. Kontrolünüzdeki ve en büyük kaybın yaşandığı aşama ilk darboğazınızdır: tek darboğaz, tek odak.

## Neden huni metrikleri?

Klinik sahiplerinin çoğu iki rakamı bilir: reklama ne harcandı, kaç hasta tedavi oldu. Aradaki her şey bir kara kutudur. Bu yüzden ay kötü geçtiğinde ilk şüpheli reklam olur. Oysa sorun genellikle cevaplanmayan başvurularda, gönderilmeyen tekliflerde ya da takip edilmeyen hastalardadır.

## Aşamalar ve formüller

Her aşamanın tanımı yazılı olmalıdır. "Teklif gönderildi" ile "teklif görüşüldü" aynı şey değildir.

| Metrik | Formül | Ne gösterir |
|---|---|---|
| İlk cevap süresi | Başvurudan ilk insan ya da asistan cevabına kadar geçen süre (ortanca) | Hız |
| Cevaplanma oranı | Cevaplanan başvuru / toplam başvuru | Kaçak |
| Görüşmeye dönüşüm | Gerçek bir görüşme yapılan / cevaplanan | İlk mesajın kalitesi |
| Ön değerlendirme oranı | Fotoğraf ya da belge gönderen / görüşülen | Güven |
| Teklif oranı | Teklif alan / ön değerlendirmesi yapılan | Operasyon hızı |
| Teklif kabul oranı | Depozito ödeyen / teklif alan | Teklif ve takip kalitesi |
| Gelme oranı | Tedaviye gelen / depozito ödeyen | Rezervasyon sonrası iletişim |

## Ortanca ve kohort

**Süre metriklerinde ortalama değil ortanca kullanın.** Bir başvuruya iki gün sonra cevap verilmesi, ortalamayı bozarak geri kalan hızlı cevapları gizler.

**Dönüşümde kohort mantığı kullanın.** Bu ayın başvurularını bu ayın tedavileriyle kıyaslamak yanıltıcıdır; çünkü bu ay tedavi olanların çoğu geçen ayın başvurularıdır. Her ayın başvurularını kendi kohortu olarak izleyin ve henüz olgunlaşmamış kohortları ayrı tutun.

## Kendi taban çizginiz

İnternette dolaşan "sektör ortalaması" rakamlarının çoğu kaynaksızdır ya da sizin pazarınıza uymaz. Kendi son 90 günlük verinizden bir taban çizgi çıkarın ve kendinizle kıyaslayın. Tek bir dış kaynak dikkat çekicidir: 2011'de Harvard Business Review'da yayımlanan ve 2.241 ABD şirketini inceleyen araştırmada, başvurulara bir saat içinde dönen şirketlerin, bir saat sonra dönenlere göre o kişiyi nitelendirme olasılığının yaklaşık yedi kat yüksek olduğu bulundu. Hızın neden ilk metrik olduğunu [ilk 5 dakika](/blog/hasta-adayina-donus-suresi-ilk-5-dakika) yazımızda anlattık.

## Darboğazı bulun

Tüm metrikleri aynı anda iyileştirmeye çalışmak hiçbirini iyileştirmez. Şu iki soruyu sorun:

1. Hangi aşamada en büyük kayıp var?
2. Bu aşama benim kontrolümde mi?

İkisinin kesiştiği aşama ilk darboğazınızdır. Örneğin cevaplanma oranı düşükse, teklif şablonunu iyileştirmek boşa emektir.

## Haftalık skor kartı

Aylık sonuçlar geç gelir. Haftalık bir skor kartı sorunu sonuca yansımadan yakalar. Üç katman izleyin:

- **Öncü aktiviteler:** cevaplanan başvuru, yapılan görüşme, gönderilen teklif, yapılan takip.
- **Sonuçlar:** depozito, tedavi.
- **Kalite:** net bir sonraki adımla biten görüşme oranı.

Her cuma 15 dakika ayırın: Ne işe yaradı, ne yaramadı, gelecek hafta tek odak ne? Odağı en az iki üç hafta sabit tutun; sürekli değişen strateji ölçülebilir etki yaratmaz.

## STOAIX bunu nasıl yapar?

STOAIX'in klinik CRM'i her başvurunun aşamasını otomatik olarak kaydeder: ilk cevap süresi, görüşme, teklif, depozito ve tedavi. Huni raporu aşama bazında oranları ve kohortları gösterir; böylece darboğazınızı reklam harcamasına değil, gerçek veriye bakarak bulursunuz. Ayrıntılar: [klinik CRM](/klinik-crm).

## Sık sorulan sorular

### Hangi metrikle başlamalıyım?

İlk cevap süresi ve cevaplanma oranıyla. Bu iki metrik en kolay ölçülen ve çoğu klinikte en büyük kaybın yaşandığı aşamalardır.

### Excel yeterli mi?

Başlangıç için evet, ama aşama değişikliklerinin manuel girilmesi gerekir ve bu genellikle aksar. Aşamaları otomatik kaydeden bir CRM, ölçümün sürdürülebilir olmasını sağlar.

### Kaybedilen hastaların nedenini nasıl kaydetmeliyim?

Kısa ve sabit bir liste kullanın: fiyat, zamanlama, güven, başka klinik, tıbbi uygunsuzluk, cevapsız. Serbest metin analiz edilemez.
