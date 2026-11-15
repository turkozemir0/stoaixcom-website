/* ═══════════════════════════════════════════════════════════════════
   Konu haritası (topical map): her blog yazısı tek bir kümeye bağlıdır.
   Küme = bir ürün ya da niyet sayfası (hub). Kurallar sırayla denenir,
   ilk eşleşen kazanır; hiçbiri tutmazsa yazı genel hub'a (asistanlar) düşer.

   Bağlantı kuralı (Topical Authority):
     • hub → kümedeki yazılar   (build-seo: "Bu konuda yazılar")
     • yazı → hub + 3 kardeş     (migrate-blog-v2: küme kutusu)
   Yeni yazı eklenince ek iş yok; slug'ı bir kurala uyuyorsa kümesine girer.
   SEO asistanı (tools/seo-agent) "hub'a düşen" yazıları raporlar.
   ═══════════════════════════════════════════════════════════════════ */

/* [küme id'si, slug deseni] — sıra önemli: özel olan önce */
export const CLUSTER_RULES = [
  ['st-yapay-zeka', /saglik-turizmi|health-tourism|dental-tourism|dis-turizmi|international-patients|uluslararasi-hasta/],
  ['reviews', /yorum|itibar|sosyal-kanit|geri-bildirim|anket|google-my-business/],
  ['reminders', /no-show|hatirlatma|reminders|iptal|bekleme-listesi/],
  ['reactivation', /kayip-hasta|eski-|reactivation|sadakat|referral|referal/],
  ['followup', /lead-takip|follow|donusum|hunisi|nitelendirme|lead-yakalama|lead-bilgi|karmasik-lead|lead-gen|hasta-kazanimi|patient-acquisition/],
  ['chatbot', /chatbot|whatsapp|web-ziyaretci|chat-/],
  ['crm', /crm|yonetim-yazilimi|randevu-sistemi|hasta-portali|kpi|metrik|performans|zinciri/],
  ['growth', /seo|google-reklam|kisisel-markasi|icerik-pazarlama|buyume|gelir-artirma/],
  ['ads', /reklam|sosyal-medya|email-pazarlama|sms-pazarlama|whatsapp-pazarlama/],
  ['aftercare', /sonrasi-bakim|aftercare|hasta-takib|takip-sistemi|rehabilitasyon/],
  ['receptionist', /resepsiyonist|receptionist|arama|calls|aksan|sesli|voice|answering|telefon|randevu|scheduling|dis-klinigi/],
];

export const FALLBACK_CLUSTER = 'hub';

/* Kök dizindeki tanım / karşılaştırma / soru sayfaları (Definitional + Question rolü).
   Blog yazısı gibi kümelerine bağlanır. Reklam açılış sayfaları (…-hizli-yanit,
   …-eski-lead-canlandirma) bilinçli olarak dışarıda: reklam trafiğine özel. */
export const ROOT_PAGES = [
  'ai-resepsiyonist-nedir', 'ai-resepsiyonist-vs-insan-sekreter', 'ai-resepsiyonist-vs-cagri-merkezi',
  'what-is-ai-receptionist-clinic', 'ai-receptionist-vs-human-receptionist-uk', 'ai-receptionist-vs-answering-service-uk',
  'ai-receptionist-private-gp-uk', 'missed-calls-private-clinic-uk', 'reduce-no-shows-private-clinic-uk',
  'sik-sorulan-sorular',
];

export function clusterOf(slug) {
  const hit = CLUSTER_RULES.find(([, re]) => re.test(slug));
  return hit ? hit[0] : FALLBACK_CLUSTER;
}

/* Yazının dili → sayfasının yayımlandığı pazar (EN yazılar UK sayfasına bağlanır) */
export const marketForLang = (lang) => (lang === 'tr' ? 'tr' : 'en');

/* Aynı kümede, aynı dilde, yazının kendisi hariç ilk n kardeş (alfabetik, sabit) */
export function siblingsOf(articles, article, n = 3) {
  const cluster = clusterOf(article.slug);
  return articles
    .filter((a) => a.slug !== article.slug && a.lang === article.lang && clusterOf(a.slug) === cluster)
    .slice(0, n);
}
