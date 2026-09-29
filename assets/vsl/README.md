# VSL videosu — dosyaları buraya bırakın

`stoaix.com/reklam` (ve `/en/reklam`) sayfasındaki video alanı bu klasörü
okuyor. Üretici (`node tools/build-vsl.mjs`) dosyaların varlığını **build
anında** kontrol ediyor: dosya buradaysa oynatıcı otomatik bağlanıyor, yoksa
poster + oynat düğmesi yer tutucusu çiziliyor.

## Beklenen dosya adları

| Dosya | Zorunlu | Ne işe yarıyor |
|---|---|---|
| `stoaix-ads-vsl.mp4` | ✅ | Ana kaynak. H.264 + AAC, `faststart` ile. |
| `stoaix-ads-vsl.webm` | — | VP9/AV1 alternatifi. Varsa tarayıcı önce bunu dener. |
| `poster.webp` | ✅ (önerilir) | İlk kare. Video inmeden önce görünen şey. |
| `tr.vtt` / `en.vtt` | — | Altyazı. Sesi kapalı izleyen için dönüşümü ciddi etkiliyor. |

Dosyaları bıraktıktan sonra:

```bash
npm run vsl
```

Çıktıda `✓ video bağlandı: /assets/vsl/stoaix-ads-vsl.mp4` satırını görmelisiniz.

## Kodlama — hızlı açılsın diye

🔑 **`+faststart` ŞART.** Bu bayrak olmadan MP4'ün indeksi (`moov` atomu)
dosyanın SONUNDA duruyor ve tarayıcı oynatmaya başlamak için dosyanın
tamamını indirmek zorunda kalıyor. Reklam trafiğinde bu, videonun hiç
izlenmemesi demek.

```bash
# 1080p, ~3 dakika, hedef 8–15 MB
ffmpeg -i kaynak.mov \
  -c:v libx264 -profile:v high -crf 24 -preset slow -pix_fmt yuv420p \
  -vf "scale=-2:1080" -r 30 \
  -c:a aac -b:a 128k -ac 2 \
  -movflags +faststart \
  stoaix-ads-vsl.mp4

# Poster (videonun 3. saniyesinden)
ffmpeg -i stoaix-ads-vsl.mp4 -ss 3 -vframes 1 -vf "scale=-2:720" -q:v 80 poster.webp
```

⚠️ **Ses seviyesini normalize edin.** Sayfa videoyu SESSİZ başlatıyor;
ziyaretçi "Sesi aç" düğmesine bastığında ani bir yükseklikle karşılaşmamalı.

```bash
ffmpeg -i stoaix-ads-vsl.mp4 -af loudnorm=I=-16:TP=-1.5:LRA=11 -c:v copy cikti.mp4
```

## Dosya 25 MB'ı geçerse

Depoya koymayın. Vercel dağıtımı şişer ve her dağıtımda yeniden yüklenir.
Bunun yerine harici bir kaynağa (Vercel Blob, Bunny Stream, Cloudflare
Stream) yükleyip `tools/build-vsl.mjs` içindeki `VIDEO_URL` sabitine tam
adresi yazın — üretici o zaman bu klasöre hiç bakmaz.

## Nasıl ölçülüyor

Sayfa izlenmeyi kendi ölçüyor; ayrı bir kurulum gerekmiyor:

- **GA4:** `video_start`, `video_progress` (%25/50/75/95/100),
  `video_complete`, `video_unmute` ve sayfa kapanırken `video_watch_time`
  (`watch_seconds` = gerçekten izlenen saniye, `max_percent` = ulaşılan en
  uzak nokta — geri sarmak sayıyı şişirmiyor).
- **Clarity:** aynı olaylar + `vsl_progress`, `vsl_watch_seconds`,
  `vsl_max_percent` etiketleri. Oturumları bu etiketlerle filtreleyip
  "yarısını izleyip kaydolmayanlar" gibi kesitleri izleyebilirsiniz.
- **Meta:** `VSLStart` / `VSLProgress` / `VSLComplete` özel olayları, ayrıca
  %50'de sunucu tarafından (CAPI) `ViewContent`.
