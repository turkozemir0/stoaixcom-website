/* ═══════════════════════════════════════════════════════════════════
   STOAIX — fiyatlandırma sayfası (/pricing): veri + çizim + davranış
   Kaynak: Ata'nın fiyatlandırma artifact'i; metin ve fiyatlar birebir.

   Fiyatların tek kaynağı burası. tools/build-pricing.mjs bu modülü Node'da
   içe aktarıp pricing.html'i aylık başlangıç durumuyla statik basar, ana
   sayfadaki üç kart da buradan üretilir (tools/build-v2.mjs). Tarayıcıda
   JS yalnızca etkileşimde yeniden çizer. Değiştirince HTML'lerdeki ?v=
   numarasını artır: /js/* bir yıl immutable sunuluyor.
   ═══════════════════════════════════════════════════════════════════ */

const USD_TRY = 50;            // örnek kur — yayında güncellenecek
const ANNUAL_DISCOUNT = 0.2;
const TRIO = ['rec', 'fol', 'conf'];
const TRIO_DISCOUNT = { text: 50, voice: 100 };
const INCLUDED_MESSAGES = 1000;
const INCLUDED_MINUTES = 1000;

const BLOCKS = [
  { id: 'mkt', title: 'Pazarlama', tag: 'Doğru hastayı kliniğinize getirir; reklam bütçeniz boşa gitmez.', color: 'var(--c-mkt)' },
  { id: 'sales', title: 'Satış', tag: 'Gelen hiçbir hasta adayı cevapsız ya da takipsiz kalmaz.', color: 'var(--c-sales)', open: true },
  { id: 'loyal', title: 'Sadakat', tag: 'Tedavi biter, ilişki sürer: hazırlık, bakım ve yorum.', color: 'var(--c-loyal)' }
];

// proof: kart altındaki sonuç satırı. sample: true olanlar gerçek veriyle değiştirilecek örnek rakamlar.
const AGENTS = [
  { id: 'mkt1', block: 'mkt', name: 'Reklam Yöneticisi', icon: 'mega', tilt: -3, pain: 'Reklama para gidiyor, hasta gelmiyor mu?',
    proof: { v: '−%32', t: 'hasta adayı başına maliyet', sample: true },
    opts: [{ k: 'a', label: 'Meta', price: 200, ln: 'Instagram ve Facebook reklamlarınızı kurar, her gün iyileştirir, ayda bir sade bir raporla sonucu gösterir.' }] },
  { id: 'mkt2', block: 'mkt', name: 'Büyüme Yöneticisi', icon: 'chart', tilt: 3, pain: 'Hasta sizi Google’da ve ChatGPT’de bulsun.',
    proof: { v: '3×', t: 'Google’dan gelen hasta adayı', sample: true },
    opts: [{ k: 'a', label: 'Meta + Google', price: 500, ln: 'Meta ve Google reklamlarını yönetir; web sitenizi Google aramasında ve yapay zekâ cevaplarında öne çıkarır.' }] },

  { id: 'rec', block: 'sales', name: 'Resepsiyonist', icon: 'chat', tilt: -2, pain: 'Gece gelen mesaj sabaha soğumasın.',
    proof: { v: '15.000+', t: 'hastaya gece gündüz cevap verdi', sample: true },
    opts: [{ k: 'text', label: 'Yazılı', price: 200, ln: 'WhatsApp, Instagram ve web sitenizden gelen her mesaja saniyeler içinde, kliniğinizin diliyle cevap verir.' },
           { k: 'voice', label: 'Sesli', price: 300, ln: 'Kliniğinize gelen her aramayı 7/24 açar, soruları yanıtlar, randevuyu takvime yazar.' }] },
  { id: 'fol', block: 'sales', name: 'Takip Uzmanı', icon: 'loop', tilt: 2, pain: 'Cevap vermeyen aday kaybolmasın.',
    proof: { v: '+%27', t: 'satışa dönüşüm, Ekim ayında', sample: true },
    opts: [{ k: 'text', label: 'Yazılı', price: 200, ln: 'Fiyat sorup kaybolan adaya doğru zamanda yeniden yazar, kararsızlığı sorularla çözer.' },
           { k: 'voice', label: 'Sesli', price: 300, ln: 'Dönüş yapmayan adayı arar, sorularını yanıtlar, randevuya bağlar.' }] },
  { id: 'conf', block: 'sales', name: 'Randevu Asistanı', icon: 'cal', tilt: -1, pain: 'Koltuk boş kalmasın.',
    proof: { v: '%90 → %1', t: 'cevapsız kalan hasta oranı', sample: true },
    opts: [{ k: 'text', label: 'Yazılı', price: 100, ln: 'Randevuyu teyit eder, bir gün önce hatırlatır, iptal edeni yeni saate taşır.' },
           { k: 'voice', label: 'Sesli', price: 150, ln: 'Hastayı arayarak randevuyu teyit eder, değişiklikleri takvime işler.' }] },
  { id: 'react', block: 'sales', name: 'Canlandırma Uzmanı', icon: 'bolt', tilt: 3, pain: 'Eski listeniz hâlâ hasta demek.',
    proof: { v: '%18', t: 'eski adaydan yeniden görüşme', sample: true },
    opts: [{ k: 'text', label: 'Yazılı', price: 500, ln: 'Geçmişte ilgilenmiş ama gelmemiş adaylarınıza yeniden yazar, ilgilenenleri randevuya taşır.' },
           { k: 'voice', label: 'Sesli', price: 500, ln: 'Geçmişte ilgilenmiş ama gelmemiş adaylarınızı arar, ilgilenenleri randevuya taşır.' },
           { k: 'mix', label: 'Çok kanallı', price: 1000, ln: 'Telefon, WhatsApp ve e-postayla birlikte ulaşır; ilgilenenleri randevuya taşır.' }] },

  { id: 'rev', block: 'loyal', name: 'Yorum Asistanı', icon: 'star', tilt: -2, pain: 'Memnun hasta sessiz kalmasın.',
    proof: { v: '4×', t: 'aylık Google yorumu', sample: true },
    opts: [{ k: 'text', label: 'Yazılı', price: 100, ln: 'Tedavi sonrası memnuniyeti sorar; memnun hastayı Google yorumuna, şikâyeti size yönlendirir.' },
           { k: 'voice', label: 'Sesli', price: 150, ln: 'Hastayı arayıp memnuniyeti sorar, memnun olanı yoruma davet eder.' }] },
  { id: 'pre', block: 'loyal', name: 'Hazırlık Asistanı', icon: 'clip', tilt: 2, pain: 'Hasta tedaviye hazır ve sakin gelsin.',
    proof: { v: '−%40', t: 'son dakika iptali', sample: true },
    opts: [{ k: 'text', label: 'Yazılı', price: 150, ln: 'Tedavi öncesi talimatları adım adım iletir, hastanın sorularını yanıtlar, kaygısını azaltır.' },
           { k: 'voice', label: 'Sesli', price: 250, ln: 'Tedavi öncesi hastayı arar, hazırlığı birlikte kontrol eder.' }] },
  { id: 'post', block: 'loyal', name: 'Bakım Asistanı', icon: 'heart', tilt: -3, pain: 'Tedaviden sonra da hastanın yanında olun.',
    proof: { v: '%96', t: 'kontrole gelen hasta', sample: true },
    opts: [{ k: 'text', label: 'Yazılı', price: 150, ln: 'İyileşme sürecini gün gün takip eder, bakımı ve kontrol randevusunu hatırlatır.' },
           { k: 'voice', label: 'Sesli', price: 250, ln: 'Tedavi sonrası hastayı arar, iyileşmeyi sorar, sorun varsa ekibinize iletir.' }] }
];
const byId = Object.fromEntries(AGENTS.map(a => [a.id, a]));

const fmt = n => n.toLocaleString('tr-TR');
// Tablonun "dahil olanlar" bölümü. t/v: yazılı ve sesli sütunları (true = dahil, false = yok, metin = değer); both: iki sütunu kaplar; hl: vurgulu satır.
const INCLUDED = [
  { group: 'Her asistana dahil', rows: [
    { n: 'Aylık kullanım', d: 'Her asistan için ayrı ayrı', t: `${fmt(INCLUDED_MESSAGES)} mesaj`, v: `${fmt(INCLUDED_MINUTES)} dakika`, hl: true },
    { n: 'WhatsApp, Instagram, Facebook Messenger, web sohbet', d: 'Tüm mesaj kanalları tek asistanda', t: true, v: false },
    { n: 'Telefon hattı', d: 'Gelen ve giden aramalar', t: false, v: true },
    { n: 'STOAIX CRM', d: 'Tüm hasta adayları ve konuşmalar tek ekranda', t: true, v: true },
    { n: 'Mevcut CRM ve klinik yazılımınızla bağlantı', d: 'Kullandığınız sistemi değiştirmeniz gerekmez', t: true, v: true },
    { n: 'Takvim entegrasyonu', d: 'Randevu doğrudan takviminize yazılır', t: true, v: true },
    { n: 'Ekibinize devir', d: 'Gereken konuşmayı anında bir insana aktarır', t: true, v: true },
    { n: 'Raporlama paneli', d: 'Kaç hasta yazdı, kaçı randevu aldı', t: true, v: true },
    { n: 'Türkçe, İngilizce ve diğer diller', d: 'Hasta hangi dilde yazarsa o dilde cevap', t: true, v: true }
  ] },
  { group: 'Hizmet ve güvence', rows: [
    { n: 'Kurulum ve kliniğinize özel konuşma senaryosu', d: 'Fiyatlarınız, tedavileriniz, üslubunuz', t: true, v: true },
    { n: 'Standart destek', d: 'E-posta ve panel üzerinden', t: true, v: true },
    { n: 'KVKK ve GDPR uyumlu veri işleme sözleşmesi', d: 'Hasta verisi sizindir', t: true, v: true },
    { n: '30 gün para iade garantisi', d: 'Başarı kriteri kurulumda birlikte belirlenir', t: true, v: true }
  ] },
  { group: 'Ek ücretli ve dahil olmayanlar', rows: [
    { n: 'VIP canlı destek', d: 'WhatsApp ve telefonla doğrudan ulaşım', both: '$300 / ay' },
    { n: 'Dahil kullanımın aşılması', d: 'Yalnızca aşan kısım ücretlendirilir', t: '$0,04 / mesaj', v: '$0,15 / dk' },
    { n: 'Reklam bütçesi', d: 'Meta ve Google’a doğrudan siz ödersiniz', both: 'Dahil değil', dim: true }
  ] }
];

const FAQ = [
  ['Yapay zekâ asistanlarının fiyatı neye göre değişir?', 'Her asistanın sabit bir aylık fiyatı vardır. Fiyatı belirleyen iki şey var: asistanın yaptığı iş ve yazılı mı sesli mi çalıştığı. Kliniğinize gerekmeyen hiçbir asistan için ödeme yapmazsınız.'],
  ['Yazılı ve sesli asistan arasındaki fark nedir?', 'Yazılı asistan WhatsApp, Instagram, Facebook Messenger ve web sitenizden gelen mesajlara cevap verir. Sesli asistan telefonla arar ya da gelen aramayı açar. İkisi de aynı CRM’i ve aynı hasta geçmişini kullanır.'],
  ['Aylık kullanıma ne dahil?', `Her yazılı asistana ayda ${fmt(INCLUDED_MESSAGES)} mesaj, her sesli asistana ayda ${fmt(INCLUDED_MINUTES)} dakika dahildir. Aşan kısım mesaj başına $0,04, dakika başına $0,15 olarak ücretlendirilir.`],
  ['Takım indirimi nasıl uygulanır?', 'Resepsiyonist, Takip Uzmanı ve Randevu Asistanı birlikte seçildiğinde yazılıda ayda $50, seslide ayda $100 indirim kendiliğinden uygulanır. Yıllık anlaşmada tüm aylık ücretlerden ayrıca %20 daha az ödersiniz.'],
  ['Taahhüt var mı?', 'Aylık ödemede taahhüt yoktur, istediğiniz ay bırakabilirsiniz. Yıllık anlaşma %20 indirimlidir.'],
  ['Mevcut CRM’imi ve klinik yazılımımı kullanmaya devam edebilir miyim?', 'Evet. STOAIX CRM her asistanla birlikte gelir, ancak kullandığınız CRM, takvim ya da klinik yazılımıyla da bağlantı kurarız. Entegrasyon için ek ücret alınmaz.'],
  ['Para iade garantisi nasıl işliyor?', 'Başarı kriterini kurulumda birlikte yazılı olarak belirleriz. İlk 30 gün içinde bu kriter karşılanmazsa ödediğiniz ücreti iade ederiz.'],
  ['Hasta verileri güvende mi?', 'Hasta verisi kliniğinize aittir. KVKK ve GDPR kapsamında veri işleme sözleşmesi imzalarız; veriler yalnızca hizmet için kullanılır.'],
  ['Fiyatlara reklam bütçesi dahil mi?', 'Hayır. Pazarlama asistanlarının fiyatı reklam yönetimi içindir. Reklam bütçesini Meta ve Google’a doğrudan siz ödersiniz.']
];

const ICONS = {
  chat: 'M5 6h14v9H10l-5 4z', loop: 'M19 12a7 7 0 1 1-2-4.9M19 5v4h-4', cal: 'M5 7h14v12H5zM5 11h14M9 15l2 2 4-4',
  star: 'M12 4l2.4 5 5.4.7-4 3.8 1 5.4L12 16.3 7.2 18.9l1-5.4-4-3.8 5.4-.7z', clip: 'M9 4h6v3H9zM7 6h10v14H7zM10 12h4M10 16h3',
  heart: 'M12 19s-6.5-4-6.5-9a3.6 3.6 0 0 1 6.5-2.2A3.6 3.6 0 0 1 18.5 10c0 5-6.5 9-6.5 9z',
  mega: 'M5 10v4h3l7 4V6l-7 4zM18 9.5a3.5 3.5 0 0 1 0 5', chart: 'M5 19V12M10 19V6M15 19v-5M20 19V9', bolt: 'M13 3L5 14h6l-1 7 8-11h-6z'
};

const HEAD = 'M100 30 C129 30 139 54 139 82 C139 110 124 132 100 134 C76 132 61 110 61 82 C61 54 71 30 100 30Z';

// Kategori rengindeki ışık gradyanları (gradyan içinde currentColor çalışmadığı için her blok için ayrı tanım).
export function categoryDefs() {
  const stop = (c, off, op) => `<stop offset="${off}" style="stop-color:${c}" stop-opacity="${op}"/>`;
  return BLOCKS.map(b => `
    <radialGradient id="rim-${b.id}" cx="1" cy=".42" r=".95">${stop(b.color, 0, .85)}${stop(b.color, .5, .14)}${stop(b.color, 1, 0)}</radialGradient>
    <linearGradient id="band-${b.id}" x1="0" y1="0" x2="1" y2="0">${stop(b.color, 0, 0)}${stop(b.color, .5, 1)}${stop(b.color, 1, 0)}</linearGradient>`).join('');
}

// Yüzsüz büst: koyu cam baş, kategori renginde kenar ışığı, yüzde parlayan bant, arkada dönen yörünge.
// Sesli seçenekte kulaklık, yazılıda mesaj balonu, çok kanallıda ikisi birden belirir.
function avatar(a, mode) {
  const id = a.block;
  const voice = mode === 'voice' || mode === 'mix';
  const text = mode === 'text' || mode === 'mix';
  const set = voice ? `
    <path d="M59 84 C59 32 141 32 141 84" fill="none" style="stroke:var(--set)" stroke-width="4" stroke-linecap="round"/>
    <rect x="51" y="73" width="14" height="27" rx="7" style="fill:var(--set)"/>
    <rect x="135" y="73" width="14" height="27" rx="7" style="fill:var(--set)"/>
    <rect x="49" y="80" width="3" height="13" rx="1.5" fill="currentColor" class="glow"/>
    <path d="M57 99 Q61 121 87 120" fill="none" style="stroke:var(--set)" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="89" cy="120" r="4" fill="currentColor" class="glow"/>` : '';
  const bubble = text ? `
    <g class="glow"><rect x="142" y="22" width="44" height="28" rx="10" fill="currentColor" opacity=".92"/><path d="M150 48 L146 58 L160 49z" fill="currentColor" opacity=".92"/>
    <circle cx="154" cy="36" r="2.8" fill="#fff"/><circle cx="164" cy="36" r="2.8" fill="#fff"/><circle cx="174" cy="36" r="2.8" fill="#fff"/></g>` : '';
  return `<svg viewBox="0 0 200 200" aria-hidden="true">
    <g class="orbit">
      <circle cx="100" cy="88" r="66" fill="none" stroke="currentColor" stroke-opacity=".22"/>
      <circle cx="100" cy="88" r="86" fill="none" stroke="currentColor" stroke-opacity=".16" stroke-dasharray="1 6" stroke-linecap="round"/>
      <circle cx="166" cy="88" r="3" fill="currentColor"/><circle cx="39" cy="53" r="2" fill="currentColor" opacity=".6"/>
    </g>
    <path d="M18 200 C22 170 54 152 86 147 L114 147 C146 152 178 170 182 200Z" fill="url(#bodyFill)"/>
    <path d="M24 196 C30 172 58 155 88 149 M112 149 C142 155 170 172 176 196" fill="none" stroke="currentColor" stroke-opacity=".55" stroke-width="1.2"/>
    <g class="head"><g transform="rotate(${a.tilt} 100 140)">
      <path d="M88 118 L88 150 Q100 156 112 150 L112 118Z" fill="url(#headFill)"/>
      <path d="${HEAD}" fill="url(#headFill)"/>
      <path d="${HEAD}" fill="url(#rim-${id})"/>
      <g clip-path="url(#headClip)" fill="none" stroke="currentColor" stroke-width="1">
        <path d="M56 56 Q100 46 144 56" stroke-opacity=".22"/><path d="M56 68 Q100 60 144 68" stroke-opacity=".12"/>
        <path d="M56 108 Q100 116 144 108" stroke-opacity=".14"/><path d="M56 121 Q100 131 144 121" stroke-opacity=".22"/>
      </g>
      <path d="${HEAD}" fill="none" stroke="currentColor" stroke-opacity=".4" stroke-width="1"/>
      <ellipse cx="85" cy="56" rx="11" ry="17" fill="#fff" opacity=".13"/>
      <rect x="66" y="79" width="68" height="10" rx="5" fill="url(#band-${id})" filter="url(#soft)" class="glow"/>
      <rect x="70" y="82.5" width="60" height="3" rx="1.5" fill="url(#band-${id})"/>
      ${set}
    </g></g>
    ${bubble}
    <g transform="translate(160 176) scale(.72)"><circle r="14" style="fill:var(--panel-2)" stroke="currentColor" stroke-width="1.4"/>
      <path d="${ICONS[a.icon]}" transform="translate(-12 -12)" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/></g>
  </svg>`;
}

// Durum her değişimde yeni nesne olarak kurulur; mevcut nesneler değiştirilmez.
const initialModes = Object.fromEntries(AGENTS.map(a => [a.id, a.opts[0].k]));
let state = Object.freeze({ billing: 'monthly', modes: Object.freeze(initialModes), picks: Object.freeze([]), open: Object.freeze(BLOCKS.filter(b => b.open).map(b => b.id)) });
const setState = patch => { state = Object.freeze({ ...state, ...patch }); render(); };

const usd = n => '$' + fmt(Math.round(n));
const tl = n => '≈ ₺' + fmt(Math.round(n * USD_TRY));
const optOf = (a, k) => a.opts.find(o => o.k === k);
const picked = id => state.picks.find(p => p.id === id);
const isYearly = () => state.billing === 'yearly';
const shown = n => isYearly() ? n * (1 - ANNUAL_DISCOUNT) : n;
const firstClause = s => s.split(/[.;]/)[0];
const colorOf = a => BLOCKS.find(b => b.id === a.block).color;

function cardHtml(a) {
  const mode = state.modes[a.id];
  const o = optOf(a, mode);
  const p = picked(a.id);
  const on = Boolean(p && p.k === mode);
  const strike = isYearly() ? `<s class="num">${usd(o.price)}</s>` : '';
  const opts = a.opts.length > 1 ? `<div class="opts" role="group" aria-label="${a.name} seçeneği">${a.opts.map(x =>
    `<button type="button" id="opt-${a.id}-${x.k}" data-opt="${a.id}" data-k="${x.k}" aria-pressed="${x.k === mode}">${x.label}<small class="num">${usd(shown(x.price))}</small></button>`).join('')}</div>` : '';
  return `<article class="agent${on ? ' sel' : ''}" style="--cat:${colorOf(a)}">
    <div class="portrait">${avatar(a, mode)}</div>
    <div class="info">
      <span class="chip">${o.label}</span>
      <h4>${a.name}</h4>
      <p class="pain">${a.pain}</p>
      <div class="proof"><b class="num">${a.proof.v}</b><span>${a.proof.t}</span>${a.proof.sample ? '<span class="ex">örnek veri</span>' : ''}</div>
      ${opts}
      <div class="pr"><span class="v num">${usd(shown(o.price))}</span><span class="per">/ay</span>${strike}<span class="tl num">${tl(shown(o.price))}</span></div>
      <button type="button" class="add" id="add-${a.id}" data-add="${a.id}" aria-pressed="${on}">${on ? '✓ Takımda' : '+ Takıma ekle'}</button>
    </div>
  </article>`;
}

export function blocksHtml() {
  return BLOCKS.map(b => {
    const all = AGENTS.filter(a => a.block === b.id);
    const from = Math.min(...all.flatMap(a => a.opts.map(o => shown(o.price))));
    const faces = all.map(a => `<span class="face">${avatar(a, null)}</span>`).join('');
    return `<details class="blk" id="blk-${b.id}" data-block="${b.id}" style="--cat:${b.color}"${state.open.includes(b.id) ? ' open' : ''}>
      <summary>
        <span class="faces" style="color:${b.color}">${faces}</span>
        <h3 class="bt">${b.title}</h3>
        <span class="tag">${b.tag}</span>
        <span class="meta">${all.length} asistan · <b class="num">${usd(from)}</b>/ay’dan başlayan</span>
        <span class="chev" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 6l5 5 5-5"/></svg></span>
      </summary>
      <div class="body"><div class="team">${all.map(cardHtml).join('')}</div></div>
    </details>`;
  }).join('');
}

// Yeniden çizimde mobildeki yatay kaydırma konumu korunur; yoksa karta dokununca liste başa döner.
function renderBlocks() {
  const host = document.getElementById('blocks');
  const scrolled = [...host.querySelectorAll('[data-block]')].map(b => [b.dataset.block, b.querySelector('.team').scrollLeft]);
  host.innerHTML = blocksHtml();
  scrolled.forEach(([id, left]) => { host.querySelector(`[data-block="${id}"] .team`).scrollLeft = left; });
}

// Tablo hücreleri: mobilde her hücrenin üstünde sütun etiketi görünür.
const ICON_TEXT = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z"/></svg>';
const ICON_VOICE = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M4 2.5l2 .5.8 3-1.5 1a7 7 0 0 0 3.7 3.7l1-1.5 3 .8.5 2c-.3 1-1.3 1.5-2.5 1.5A10 10 0 0 1 2.5 5c0-1.2.5-2.2 1.5-2.5z"/></svg>';
const KIND_ICON = { 'Yazılı': ICON_TEXT, 'Sesli': ICON_VOICE };
const kindLabel = label => KIND_ICON[label] ? `<span class="kd">${KIND_ICON[label]}${label}</span>` : label;
const cell = (label, html, cls = '') => `<div class="c num ${cls}" role="cell"><span class="lbl">${kindLabel(label)}</span>${html}</div>`;
const priceCell = (o, label) => cell(label, `${usd(shown(o.price))}<span class="per-s">/ay</span>${isYearly() ? `<span class="was">${usd(o.price)}</span>` : ''}`, label === 'Fiyat' ? 'pc span' : 'pc');
const markCell = (label, v) => v === true ? cell(label, '<span class="yes" aria-label="Dahil">✓</span>')
  : v === false ? cell(label, '<span aria-label="Yok">—</span>', 'no') : cell(label, v);
const nameCell = (n, d) => `<div class="nm" role="rowheader">${n}<small>${d}</small></div>`;
const group = (title, color, first) => `<div class="pt-g${first ? ' first' : ''}" role="row"><span class="dot" style="background:${color}"></span><span role="cell">${title}</span></div>`;
const row = (inner, cls = '') => `<div class="pt-row ${cls}" role="row">${inner}</div>`;
// Mobilde iki sütunda da dahil olan satır tek "✓ Yazılı ve sesli" hücresine iner.
const bothYes = r => r.t === true && r.v === true;
const mobCell = '<div class="c mob" role="cell"><span class="yes" style="font-size:15px">✓ Yazılı ve sesli</span></div>';

function agentRows(a) {
  const t = optOf(a, 'text'), v = optOf(a, 'voice');
  const pair = t && v ? row(nameCell(a.name, firstClause(t.ln)) + priceCell(t, 'Yazılı') + priceCell(v, 'Sesli')) : '';
  const rest = a.opts.filter(o => !(t && v) || (o !== t && o !== v));
  return pair + rest.map(o => row(nameCell(`${a.name} · ${o.label}`, firstClause(o.ln)) + priceCell(o, 'Fiyat'))).join('');
}

function includedRow(r) {
  const cells = r.both ? cell('Fiyat', r.dim ? `<span class="muted">${r.both}</span>` : r.both, 'span')
    : markCell('Yazılı', r.t) + markCell('Sesli', r.v) + (bothYes(r) ? mobCell : '');
  return row(nameCell(r.n, r.d) + cells, [bothYes(r) ? 'both' : '', r.hl ? 'hl' : ''].join(' '));
}

export function tableHtml() {
  const head = `<div class="pt-row pt-head" role="row"><div role="columnheader">Asistan</div><div class="c" role="columnheader">${kindLabel('Yazılı')}</div><div class="c" role="columnheader">${kindLabel('Sesli')}</div></div>`;
  const priced = BLOCKS.map((b, i) => group(b.title, b.color, i === 0) + AGENTS.filter(a => a.block === b.id).map(agentRows).join('')).join('');
  const off = n => `<span class="yes" style="font-size:16px">−${usd(shown(n))}</span>`;
  const trio = row(nameCell('Takım indirimi', 'Resepsiyonist, Takip Uzmanı ve Randevu Asistanı birlikte') + cell('Yazılı', off(TRIO_DISCOUNT.text)) + cell('Sesli', off(TRIO_DISCOUNT.voice)));
  const incl = INCLUDED.map(g => group(g.group, 'var(--dim)', false) + g.rows.map(includedRow).join('')).join('');
  return head + priced + trio + incl;
}

export function noteText() {
  return isYearly()
    ? `Yıllık anlaşma fiyatları gösteriliyor (%20 indirimli). Örnek kur: 1 $ = ${USD_TRY} ₺.`
    : `Aylık fiyatlar. Yıllık anlaşmada %20 indirim. Örnek kur: 1 $ = ${USD_TRY} ₺.`;
}

function renderTable() {
  document.getElementById('priceTable').innerHTML = tableHtml();
  document.getElementById('ptNote').textContent = noteText();
}

function renderBar() {
  const bar = document.getElementById('tbar');
  const has = state.picks.length > 0;
  bar.hidden = !has;
  document.body.classList.toggle('has-team', has);
  if (!has) return;
  const items = state.picks.map(p => ({ a: byId[p.id], o: optOf(byId[p.id], p.k) }));
  const trios = ['text', 'voice'].filter(ch => TRIO.every(id => state.picks.some(p => p.id === id && p.k === ch)));
  const trioOff = trios.reduce((s, ch) => s + TRIO_DISCOUNT[ch], 0);
  const total = shown(items.reduce((s, x) => s + x.o.price, 0) - trioOff);

  document.getElementById('tbarFaces').innerHTML = items.map(x =>
    `<span class="face" style="--cat:${colorOf(x.a)};color:var(--cat)">${avatar(x.a, x.o.k)}</span>`).join('');
  document.getElementById('tbarNames').textContent = items.map(x => x.a.opts.length > 1 ? `${x.a.name} (${x.o.label.toLowerCase()})` : x.a.name).join(', ');
  const near = ['text', 'voice'].find(ch => !trios.includes(ch) && TRIO.filter(id => state.picks.some(p => p.id === id && p.k === ch)).length === 2);
  document.getElementById('tbarNote').innerHTML = trios.length
    ? `<b>Takım indirimi uygulandı: −${usd(trioOff)}/ay</b>`
    : near ? `${byId[TRIO.find(id => !state.picks.some(p => p.id === id && p.k === near))].name} eklenirse −${usd(TRIO_DISCOUNT[near])}/ay indirim` : `${items.length} asistan`;
  document.getElementById('tbarTotal').textContent = usd(total) + '/ay';
  document.getElementById('tbarSub').textContent = isYearly() ? 'yıllık anlaşma' : tl(total);
}

export function faqHtml() {
  return FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('');
}

// Arama motorları ve yapay zekâ cevapları için yapılandırılmış veri (SSS + hizmet kataloğu).
export function structuredData() {
  const offers = AGENTS.flatMap(a => a.opts.map(o => ({
    '@type': 'Offer', name: a.opts.length > 1 ? `${a.name} (${o.label})` : a.name, description: o.ln,
    price: o.price, priceCurrency: 'USD',
    priceSpecification: { '@type': 'UnitPriceSpecification', price: o.price, priceCurrency: 'USD', unitCode: 'MON' }
  })));
  return [
    { '@context': 'https://schema.org', '@type': 'Service', name: 'STOAIX yapay zekâ asistanları',
      provider: { '@type': 'Organization', name: 'STOAIX', url: 'https://www.stoaix.com' },
      serviceType: 'Klinikler için yapay zekâ hasta iletişimi ve pazarlama asistanları', areaServed: ['TR', 'GB'],
      hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Asistan fiyatları', itemListElement: offers } },
    { '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
  ];
}

// Girişte gösterilen en temel üç başlangıç fiyatı
const STARTERS = Object.freeze([
  { id: 'mkt1', k: 'a', name: 'Meta Reklam Yöneticisi', kind: null },
  { id: 'rec', k: 'text', name: 'Resepsiyonist', kind: 'Yazılı' },
  { id: 'rec', k: 'voice', name: 'Resepsiyonist', kind: 'Sesli' },
]);

export function startsHtml({ href = '#h-prices', bothPrices = false } = {}) {
  return STARTERS.map(x => {
    const a = AGENTS.find(g => g.id === x.id);
    const b = BLOCKS.find(g => g.id === a.block);
    const kind = x.kind ? `<span class="kd">${KIND_ICON[x.kind]}${x.kind}</span>` : '';
    const price = optOf(a, x.k).price;
    const both = bothPrices ? ` data-monthly="${usd(price)}" data-yearly="${usd(price * (1 - ANNUAL_DISCOUNT))}"` : '';
    return `<a class="st" href="${href}" style="--cat:${b.color}"${bothPrices ? ' data-pricing-link' : ''}>
      <span class="cat"><i></i>${b.title}</span>
      <span class="nm">${kind}${x.name}</span>
      <span class="from">başlangıç fiyatı</span>
      <span class="v num"${both}>${usd(shown(price))}<small>/ay</small></span>
    </a>`;
  }).join('');
}

// Bir butona basınca kart yeniden çizilir; klavye odağı aynı butonda kalsın.
function render() {
  const focused = document.activeElement && document.activeElement.id;
  document.querySelectorAll('[data-billing]').forEach(b => b.setAttribute('aria-pressed', b.dataset.billing === state.billing));
  document.getElementById('starts').innerHTML = startsHtml();
  renderTable();
  renderBlocks();
  renderBar();
  const back = focused && document.getElementById(focused);
  if (back && back !== document.activeElement) back.focus({ preventScroll: true });
}

function togglePick(id) {
  const k = state.modes[id];
  const cur = picked(id);
  const rest = state.picks.filter(p => p.id !== id);
  setState({ picks: Object.freeze(cur && cur.k === k ? rest : [...rest, { id, k }]) });
}

function chooseOpt(id, k) {
  const cur = picked(id);
  // Takımdaki asistanın seçeneği değişirse takımdaki kaydı da yeni seçeneğe taşınır.
  const picks = cur ? state.picks.map(p => p.id === id ? { id, k } : p) : state.picks;
  setState({ modes: Object.freeze({ ...state.modes, [id]: k }), picks: Object.freeze(picks) });
}

// Tema anahtarı ana sayfayla ortak: bir yerde seçilen tema öbüründe de geçerli.
function paintTheme() {
  const theme = document.documentElement.className.includes('bone') ? 'bone' : 'ink';
  document.querySelectorAll('[data-set-theme]').forEach(b => b.setAttribute('aria-pressed', b.dataset.setTheme === theme));
}

function init() {
  document.addEventListener('click', e => {
    const t = e.target;
    const add = t.closest('[data-add]'); if (add) return togglePick(add.dataset.add);
    const opt = t.closest('[data-opt]'); if (opt) return chooseOpt(opt.dataset.opt, opt.dataset.k);
    const bl = t.closest('[data-billing]'); if (bl) return setState({ billing: bl.dataset.billing });
    const th = t.closest('[data-set-theme]');
    if (th) {
      document.documentElement.className = 'pal-' + th.dataset.setTheme;
      try { localStorage.setItem('stoaix.theme', th.dataset.setTheme); } catch (err) { /* yok say */ }
      paintTheme();
    }
    const lang = t.closest('[hreflang]');
    if (lang) {
      try {
        localStorage.setItem('stoaix-lang', lang.getAttribute('hreflang'));
        sessionStorage.setItem('stoaix-home-redirected', '1');
      } catch (err) { /* yok say */ }
    }
  });
  // Açık/kapalı blokları hatırla ki yeniden çizimde kapanmasın.
  document.addEventListener('toggle', e => {
    const blk = e.target.closest && e.target.closest('[data-block]');
    if (!blk) return;
    const id = blk.dataset.block;
    const open = blk.open ? [...new Set([...state.open, id])] : state.open.filter(x => x !== id);
    state = Object.freeze({ ...state, open: Object.freeze(open) });
  }, true);

  paintTheme();
  // Ana sayfada yıllık seçildiyse aynı seçimle gelinir.
  if (new URLSearchParams(location.search).get('billing') === 'yearly') setState({ billing: 'yearly' });
}

if (typeof document !== 'undefined') init();
