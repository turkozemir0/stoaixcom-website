# AI görünürlük ölçümü (aylık)

Soru: ChatGPT, Perplexity, Google AI ve Claude, alıcı sorularında STOAIX'i anıyor mu, öneriyor mu, sitemizi kaynak gösteriyor mu?
Panel: `tools/seo-agent/ai-panel.json`. Kayıt: `reports/seo/ai-citations.md` (her ay yeni bölüm, eskiler silinmez).

## Kim ölçer

Bulut rutini bu motorlara giriş yapamaz. Rutinin kendi web araması da başka bir motorun cevabı yerine geçmez. Bu yüzden ölçümü **bir insan** yapar: Ata, Emir ya da ekipten biri. Ayda bir kez, yaklaşık 30 dakika sürer. Rutin, ayın ilk pazartesisi boş tabloyu hazırlar.

## Protokol

1. Her motorda **yeni ve oturumu kapalı** bir pencere aç. Geçmiş ve kişiselleştirme sonucu bozar.
2. Panelin her sorusunu **iki kez**, iki ayrı oturumda sor. AI cevapları her seferinde değişir. Tek ölçüm kanıt sayılmaz.
3. Her cevap için şu sütunları doldur. Değerler `evet`, `hayır` ya da `bilinmiyor`:
   - **anıldı**: STOAIX adı cevapta geçiyor mu?
   - **önerildi**: Cevap STOAIX'i bir seçenek olarak öneriyor mu?
   - **kaynak**: stoaix.com'dan bir sayfa alıntılanmış mı? Alıntılandıysa hangi sayfa?
   - **alıntılanan diğer siteler**: Cevapta kaynak gösterilen ilk 3 URL.
4. Markalı sorularda (`branded: true`) **marka doğruluğunu** da kontrol et. Cevaptaki fiyat, hizmet ve ülke bilgisini `js/pricing.mjs` ve ürün sayfalarıyla karşılaştır. Fark varsa "yanlış bilgi" satırına yaz.
5. Markasız ve markalı soruların sonuçlarını ayrı topla. Markalı sorudaki görünürlük, markasız sorudaki görünürlük yerine geçmez.

## Kayıt şablonu (`reports/seo/ai-citations.md`)

```
## 2026-12 — ölçen: <ad>, tarih: <YYYY-MM-DD>

| id | motor | tur | anıldı | önerildi | kaynak (stoaix sayfası) | diğer kaynaklar |
|---|---|---|---|---|---|---|
| tr-u01 | ChatGPT | 1 | hayır | hayır | — | example.com/..., ... |

Yanlış bilgi: —
Özet: markasız <x>/<n> anıldı · markalı <y>/<m> doğru
```

## Ölçünün kullanımı

- **Kaynak açığı**: Rakipler ya da dizin siteleri tekrar tekrar alıntılanıyorsa, o sayfa türü bizim için hedeftir. Bunlar karşılaştırma tablosu, liste yazısı ya da dizin kaydı olabilir. Bu hedefleri `link-earning` skill'inin aylık listesine ekle.
- **Search Console**: Google'ın "Search generative AI" kontrolü **açık** olmalı. Kontrol kapalıysa AI Overviews'da görünemeyiz. Kontrolü Emir yapar.
- **Bing Webmaster Tools**: Site eklenmeli. Bing, ChatGPT aramasının kaynaklarından biridir. Bing'in AI Performance raporu da buradan okunur. IndexNow anahtarı ayrı bir iştir.
- Farklı birimler toplanmaz. GSC tıklaması, Bing AI gösterimi ve panel sayımı ayrı satırlarda tutulur.

## Ne yapmıyoruz (Google'ın kendi rehberi)

- llms.txt dosyası duruyor. Google'a göre AI Overviews'a etkisi yok. Bu dosyaya emek harcanmaz.
- "AI için parçalama" (chunking) yapılmaz. AI için ayrı metin yazılmaz, sahte "güncellendi" tarihi konmaz.
- Forum veya yorumlarda sahte bahis çiftliği kurulmaz. Ölçülen her şey gerçek kullanıcıya yazılmış içerikten gelmeli.
