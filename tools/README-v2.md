# v2 one-pager — uygulama notları

Claude Design handoff'unun (`design_handoff_stoaix_site/stoaix-onepager.html`,
varyasyon **6a / 6b**) sitedeki karşılığı.

## Adresler

| URL | Dosya | Dil |
|---|---|---|
| `/v2` | `v2.html` | EN |
| `/tr/v2` | `v2-tr.html` | TR |

`/tr/v2 → /v2-tr` yönlendirmesi `vercel.json`'da, genel `/tr/:path*` kuralından
**önce** tanımlıdır; sıra değişirse TR sayfası İngilizce açılır.

## Derleme

```bash
node tools/build-v2.mjs
```

İçerik **tek kaynaktan** gelir: `tools/v2-content.mjs`. Metin değişikliği orada
yapılır, ardından build çalıştırılır — `v2.html` / `v2-tr.html` elle düzenlenmez.

`tools/build-v2.mjs` başında iki anahtar vardır:

- `ANALYTICS` — önizlemede `false`. GA/Clarity/Meta Pixel, `/v2` trafiğiyle
  metrikleri ve reklam sinyallerini kirletmesin diye kapalı. Yayına alırken `true`.
- `NOINDEX` — önizlemede `true` (`robots: noindex, nofollow`). Yayına alırken `false`.

## Neden build-time statik HTML

Sayfa içeriğinin tamamı HTML'de hazır gelir; JS yalnızca davranışı yönetir. Bunun
sonucu: arama motoru tam içeriği görür, JS kapalıyken sayfa okunur kalır ve dil
geçişinde içerik titremesi olmaz. Handoff prototipi içeriği tarayıcıda JS ile
üretiyordu — üretimde bu üçünü birden kaybettirirdi.

## Kaynak dosyalar

| Dosya | İçerik |
|---|---|
| `tools/v2-content.mjs` | EN/TR metinler + link hedefleri (`LINKS`) + harita şehirleri |
| `tools/build-v2.mjs` | HTML üreteci |
| `css/v2.css` | Tasarım tokenları, bileşenler, responsive |
| `js/v2.js` | Tema, sekmeler, daktilo, akış rotasyonu, harita, mobil menü |
| `js/vendor/` | d3-array, d3-geo, topojson-client (CDN yerine yerelde) |
| `assets/v2/countries-110m.json` | Natural Earth 110m topolojisi |
| `assets/fonts/inter-*.woff2` | Inter değişken font (latin + latin-ext) |

## Handoff'tan bilinçli sapmalar

**1. Tipografi.** Handoff `-apple-system` / SF yığınını marka gereksinimi sayıyor.
SF web'de lisanslanamadığı için Windows ve Android'de Segoe UI / Roboto'ya düşer ve
96px başlıkta sıkı tracking kaybolur. Yığına Inter eklendi: Apple cihazda hâlâ SF,
diğer her yerde Inter. Font yerelde barındırılır.

**2. Başlık kutusu sabitlendi.** Handoff `min-height:185px` (iki satır) veriyor;
ölçüldüğünde daktilo satırlarının bir kısmı masaüstünde bile üç satıra taşıyor ve
sayfa her döngüde ~90px zıplıyordu. Tüm satırlar aynı grid hücresinde görünmez
"hayalet yığın" olarak durur, kutu daima en uzun satır kadar yüksek kalır. Her
genişlik ve dilde ölçüldü: kutu yüksekliği sabit.

**3. Ters zeminler CSS'e taşındı.** Handoff her tema değişiminde sayfayı JS ile
yeniden üretip `.alt` sınıfını hesaplıyordu. Burada `.pal-ink .alt` / `.pal-bone .alt`
kuralları var; tema değişimi tek sınıf değişimi, içerik yeniden üretilmiyor.

**4. Harita bağımlılıkları yerelde ve tembel.** Handoff d3 (tamamı), topojson ve
topolojiyi CDN'den çekiyordu. Burada yalnız `d3-array` + `d3-geo` (tam d3 değil),
`topojson-client` ve topoloji yerelde; üçü de ancak Kapsama bölümü görüş alanına
yaklaşınca indirilir. Harita çizilemezse bölüm ülke listesiyle anlamlı kalır.

**5. Mobil.** Handoff mobili "henüz tasarlanmadı" diye işaretliyordu. Eklenenler:
tam ekran mobil menü (tema ve dil geçişleri dahil), dar ekranda yatay kayan
tablolar, tek sütuna inen şartname satırları, iki sütuna inen metrikler.

**6. Bağlantılar.** Handoff'ta tüm `href` değerleri `#` idi. Gerçek hedefler
`tools/v2-content.mjs → LINKS` altında tek yerde toplandı. Self-serve kayıt akışı
korundu: hayalet buton (*Konsolu keşfedin*) `/signup`'a gider.

**7. Erişilebilirlik.** Daktilo satırı dekoratif (`aria-hidden`); gerçek `<h1>`
konumlandırma cümlesidir. Konsol, ne gösterdiğini belirten ekran okuyucu
açıklaması taşır. Sekmeler ok tuşlarıyla gezilir. `prefers-reduced-motion`
açıkken daktilo en uzun satırda durur, marquee ve akış rotasyonu donar.

## Metin denetimi sonrası eklenenler (19 Eyl 2026)

Rakip metin analizi ve SEO/GEO denetiminin çıktıları:

- **SSS bölümü** (`faq`) — CTA'dan önce, altı soru, her iki dilde. Cevaplar
  sayfanın kendi bölümlerinden türetildi; yeni iddia içermez. `FAQPage` şemasıyla
  birlikte yayınlanır — yapay zeka aramalarının alıntılayabilmesi için en doğrudan
  kaldıraç bu. İlk soru ("Bu bir AI resepsiyonist mi?") aynı zamanda sitenin
  taşıyıcı anahtar kelimesini v2'ye geri getirir ve tek-klinik konumlandırmasıyla
  grup konumlandırması arasındaki farkı açıkça kurar.
- **Hero kanıt satırı** (`proof`) — "500+ klinik denetimi", sitede zaten birden
  fazla sayfada kullanılan doğrulanabilir bir iddia. Bölüm başlıklarıyla aynı
  kalıpta: solda etiket, sağda meta.
- **TR terminoloji** — "ajan" yerine "AI asistan" (Türkçede "ajan" casus
  çağrışımı taşıyor). Ayrıca: Sicil → Sahada, Teknik şartname → AI Asistanlar,
  Brifing talep et → Tanışma görüşmesi, Satışla görüşün → Satış ekibiyle görüşün,
  Ortalama geri dönüş → Yatırımın geri dönüş süresi, Kapsama → Sahada.
  Ajan/asistan **adları** (Reception, Speed-to-Lead…) iki dilde de İngilizce kalır.
- **Ülke sayısı** — handoff "17 ülke" diyordu, çip listesinde 15 ülke var.
  Doğrulanabilir olan çip listesi; metin 15'e hizalandı.
- **Footer** — `/blog` eklendi, "Büyüme / Growth" linki sayfa içi çapa yerine
  `/modules`'a gidiyor. Footer uzun kuyruk sayfalarını listelemez; dört hub'a
  bağlanır ve dağıtımı onlara bırakır.

Konsol metrikleri (3.1x, −%42, 2.400+, 18 gün) **kasıtlı olarak olduğu gibi
bırakıldı** — görünür "örnek veri" etiketi istenmedi. Ekran okuyucu açıklaması
yerinde duruyor.

## Açık kalan işler

- **CTA arka planı** hâlâ düz `#14141A` yer tutucu. Handoff gerçek video/fotoğraf
  bekliyor (`muted`, `loop`, poster kare, `object-fit:cover`).
- **Konumlandırma kararı** — v2 "klinik grupları" diyor, `llms.txt` ve 222 alt
  sayfa "1–5 klinisyenli pratikler için AI resepsiyonist" diyor. v2 ana sayfa
  olacaksa `llms.txt` ve `tr-llms.txt` ikisini birden tarif edecek şekilde
  yeniden yazılmalı, yoksa AI aramaları çelişkili kaynak görür.
- **Eski çapa bağlantıları** — `#features`, `#channels`, `#pricing`, `#demo`,
  `#calculator`, `#trial` v2'de karşılıksız. Ana sayfaya taşınırsa reklam ve
  e-posta linkleri için yönlendirme gerekir.
- Yayına alınırken: `ANALYTICS = true`, `NOINDEX = false`, `sitemap.xml` kaydı.
