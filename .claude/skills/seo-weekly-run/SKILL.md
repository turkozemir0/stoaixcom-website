---
name: seo-weekly-run
description: STOAIX sitesinin haftalık SEO-GEO çalışması. Bulut rutini her pazartesi bunu çağırır; "haftalık SEO", "SEO-GEO çalışması", "seo raporu" denince de kullan.
---

# Haftalık SEO-GEO çalışması

Tam talimat `docs/seo-agent/RUNBOOK.md`'de. Önce onu oku ve **Kesin kurallar** bölümüne harfiyen uy.

Kısa akış:

1. `main`'den `seo/weekly-<YYYY-MM-DD>` branch'i aç.
2. `npm ci` → `npm run site` → `npm run seo:audit`
3. `reports/seo/<tarih>.md` raporuna göre öncelik sırasıyla iş yap: teknik alarm (drift KRİTİK, engelli tarayıcı, hreflang) → yapı → vurmaya yakın sorgular → fan-out boşlukları → Information Gain. Her biri için ilgili skill: `topical-authority`, `striking-distance`, `query-fanout`, `information-gain-finder`. Toplam en fazla 5 sayfa.
4. Ayın ilk pazartesisiyse aylık işleri de yap. Ocak, nisan, temmuz ya da ekimin ilk pazartesisiyse çeyreklik işleri de yap. Bu işler RUNBOOK'ta, ayrıca `link-earning` skill'inde.
5. `npm run site` (KIRIK: yok olmalı) → `npm run seo:gate` → `npm run seo:audit` → `npm run test:seo`
   - Kapı **blocked** derse push yapma. Sebebi rapora yaz ve dur.
   - Kapı **needs_review** derse bulguları PR açıklamasına "Onay gerekenler" başlığıyla kopyala.
6. Commit, push, PR (`gh` varsa `gh pr create`, yoksa push çıktısındaki linki rapora yaz). `main`'e asla push etme.

Bitirirken tek paragraf özet yaz. Neyi değiştirdin, hangi metrik nereye gitti, Ata'ya hangi soru kaldı?
