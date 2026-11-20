/* ═══════════════════════════════════════════════════════════════════
   Yayın ilkeleri — rehber yazılarının kim tarafından, hangi kurallarla
   yazıldığını anlatan sayfa (TR / EN / DE). Rehberlerin yazar kutusu ve
   BlogPosting verisi buraya bağlanır.
   ═══════════════════════════════════════════════════════════════════ */

import { renderPost, ORIGIN } from '../blog/render-post.mjs';
import { toHtml } from '../guides/markdown.mjs';
import { esc } from '../v2-chrome.mjs';

const UPDATED = '2026-11-20';

export const EDITORIAL_PATHS = { tr: '/yayin-ilkeleri', en: '/en/editorial-policy', de: '/de/redaktionsrichtlinien' };
const HTML_LANG = { tr: 'tr', en: 'en', de: 'de' };

const COPY = {
  tr: {
    title: 'Yayın İlkeleri: Rehberlerimizi Nasıl Yazıyoruz | STOAIX',
    desc: 'STOAIX rehberlerinin kaynak, anonimlik, sağlık tanıtım kuralları, güncelleme ve düzeltme ilkeleri.',
    h1: 'Yayın ilkeleri',
    lede: 'Kliniklere yazdığımız rehberler satış ve hasta iletişimi üzerinedir. Bu sayfa, o rehberleri hangi kurallarla yazdığımızı anlatır.',
    body: `## Kim yazıyor

Rehberleri STOAIX ekibi yazar. Ekip, kliniklerin hasta adayı takibi, randevu ve satış süreçlerini kuran ve her gün bu süreçlerin verisine bakan kişilerden oluşur. Yazılarda imza tek bir kişinin değil STOAIX'in imzasıdır; içerikten ekip olarak sorumluyuz.

## Kaynak kuralı

- Kaynağı olmayan sayı yazmayız. Bir oran ya da istatistik kullandığımızda kaynağı aynı cümlede bağlantı olarak verilir.
- Sektörde dolaşan ama kaynağı bulunamayan oranları kullanmayız.
- Kendi deneyimimizden gelen bir gözlemi sayı gibi sunmayız; "bizim gördüğümüz" diye açıkça yazarız.
- Okuyucuya kendi rakamını ölçmesi için bir yöntem veririz; başkasının ortalamasını hedef gibi göstermeyiz.

## Anonimlik

Yazılardaki örnek hastalar, klinikler ve konuşmalar kurgudur. Gerçek hasta verisi, müşteri adı ya da tanınabilir bir vaka kullanmayız. Şablon mesajlar kendi sözlerimizle yazılır.

## Sağlık tanıtım kuralları

- Tedavi sonucu vaat eden, "en iyi" gibi üstünlük iddiası taşıyan ya da sahte aciliyet yaratan ifadeler kullanmayız ve önermeyiz.
- Tıbbi karar her zaman hekime aittir. Rehberler satış ve iletişim sürecini anlatır, tıbbi tavsiye vermez.
- Türkiye için Sağlık Hizmetlerinde Tanıtım ve Bilgilendirme Faaliyetleri Hakkında Yönetmelik, KVKK ve ticari ileti kurallarını; Birleşik Krallık için UK GDPR, PECR ve ASA CAP Code'u; Almanya için HWG, UWG ve DSGVO'yu dikkate alırız. Bu notlar hukuki görüş değildir; uygulamadan önce kendi hukuk danışmanınıza teyit ettirin.

## Yapay zekâ kullanımı

Araştırma ve taslak aşamasında yapay zekâ araçlarından yararlanırız. Yayınlanan her metni ekip okur, kaynakları tek tek açıp kontrol eder ve yukarıdaki kurallara göre düzeltir.

## Ürün bağlantıları

STOAIX kliniklere yazılım ve hizmet satar. Bir rehberde ürünümüzü andığımızda bunu açıkça yaparız; yöntemler ürünümüzü kullanmadan da uygulanabilecek şekilde yazılır.

## Güncelleme ve düzeltme

Her yazının başında yayın ve son güncelleme tarihi bulunur. Kural ya da kaynak değiştiğinde yazıyı güncelleriz. Bir hata görürseniz [iletişim sayfasından](/contact) bize yazın; doğrulanan düzeltmeleri yayınlar ve güncelleme tarihini değiştiririz.`,
  },
  en: {
    title: 'Editorial Policy: How We Write Our Guides | STOAIX',
    desc: 'How STOAIX writes its clinic guides: sourcing, anonymity, healthcare advertising rules, updates and corrections.',
    h1: 'Editorial policy',
    lede: 'Our guides for clinics cover patient enquiries, follow-up and front-desk sales. This page explains the rules we write them by.',
    body: `## Who writes the guides

The STOAIX team writes every guide. The team builds enquiry handling, booking and follow-up processes for clinics and works with the data from those processes every day. Guides carry the STOAIX byline rather than one person's name; we are responsible for the content as a team.

## Sourcing

- We do not publish a number without a source. When we use a rate or statistic, the source is linked in the same sentence.
- We do not repeat industry figures that circulate without a traceable origin.
- We never present our own observations as statistics; we label them as what we have seen.
- Where it matters, we show you how to measure your own figure instead of treating someone else's average as your target.

## Anonymity

Patients, clinics and conversations used as examples are fictional. We do not use real patient data, client names or recognisable cases. Template messages are written in our own words.

## Healthcare advertising rules

- We do not use or recommend wording that promises treatment outcomes, claims superiority such as "the best", or creates false urgency.
- Clinical decisions always belong to the clinician. Our guides describe communication and sales processes; they are not medical advice.
- For the UK we take account of UK GDPR, PECR and the ASA CAP Code; for Germany the HWG, UWG and GDPR; for Türkiye the national health promotion regulation and data protection law. These notes are not legal advice; check them with your own adviser before you act.

## Use of AI

We use AI tools for research and drafting. A member of the team reads every published text, opens and checks each source, and edits it against the rules above.

## Product mentions

STOAIX sells software and services to clinics. When a guide mentions our product we say so plainly, and the methods are written so that you can apply them without it.

## Updates and corrections

Every guide shows its publication and last-updated date at the top. We update a guide when a rule or source changes. If you spot a mistake, write to us via the [contact page](/en/contact); verified corrections are published and the updated date changes.`,
  },
  de: {
    title: 'Redaktionsrichtlinien: So schreiben wir unsere Leitfäden | STOAIX',
    desc: 'Wie STOAIX seine Leitfäden für Praxen schreibt: Quellen, Anonymität, Heilmittelwerberecht, Aktualisierung und Korrekturen.',
    h1: 'Redaktionsrichtlinien',
    lede: 'Unsere Leitfäden für Praxen behandeln Patientenanfragen, Nachfassen und Kommunikation am Empfang. Diese Seite erklärt, nach welchen Regeln wir sie schreiben.',
    body: `## Wer schreibt

Alle Leitfäden schreibt das STOAIX-Team. Das Team baut für Praxen und Kliniken die Abläufe für Anfragen, Terminvergabe und Nachfassen auf und arbeitet täglich mit den Daten dieser Abläufe. Die Beiträge erscheinen unter dem Namen STOAIX; für den Inhalt stehen wir als Team ein.

## Quellen

- Wir veröffentlichen keine Zahl ohne Quelle. Verwenden wir eine Quote oder Statistik, ist die Quelle im selben Satz verlinkt.
- Branchenzahlen ohne nachvollziehbaren Ursprung übernehmen wir nicht.
- Eigene Beobachtungen geben wir nicht als Statistik aus, sondern kennzeichnen sie als Erfahrung.
- Wo es darauf ankommt, zeigen wir, wie Sie Ihre eigene Kennzahl messen, statt fremde Durchschnittswerte als Ziel zu setzen.

## Anonymität

Beispielpatienten, Praxen und Gespräche sind frei erfunden. Wir verwenden keine echten Patientendaten, keine Kundennamen und keine erkennbaren Fälle. Vorlagen formulieren wir selbst.

## Heilmittelwerberecht und Datenschutz

- Wir verwenden und empfehlen keine Formulierungen, die Behandlungserfolge versprechen, Überlegenheit behaupten („die beste Praxis“) oder künstlichen Zeitdruck erzeugen.
- Die medizinische Entscheidung liegt immer bei der Ärztin oder dem Arzt. Unsere Leitfäden beschreiben Kommunikation und Abläufe, sie sind keine medizinische Beratung.
- Für Deutschland berücksichtigen wir insbesondere HWG, UWG und DSGVO, für das Vereinigte Königreich UK GDPR, PECR und den ASA CAP Code. Diese Hinweise sind keine Rechtsberatung; lassen Sie sie vor der Umsetzung von Ihrer Beratung prüfen.

## Einsatz von KI

Für Recherche und Entwürfe nutzen wir KI-Werkzeuge. Jeder veröffentlichte Text wird vom Team gelesen, jede Quelle geöffnet und geprüft und der Text nach den obigen Regeln überarbeitet.

## Hinweise auf unser Produkt

STOAIX verkauft Software und Dienstleistungen an Praxen. Wenn ein Leitfaden unser Produkt erwähnt, sagen wir das offen; die Methoden lassen sich auch ohne unser Produkt umsetzen.

## Aktualisierung und Korrekturen

Jeder Beitrag zeigt oben das Veröffentlichungs- und das Aktualisierungsdatum. Ändert sich eine Regel oder Quelle, aktualisieren wir den Beitrag. Wenn Sie einen Fehler finden, schreiben Sie uns über die [Kontaktseite](/en/contact); geprüfte Korrekturen veröffentlichen wir mit neuem Datum.`,
  },
};

const alternates = () => [
  ...Object.entries(EDITORIAL_PATHS).map(([lang, p]) => ({ hreflang: HTML_LANG[lang], href: ORIGIN + p })),
  { hreflang: 'x-default', href: ORIGIN + EDITORIAL_PATHS.en },
];

function ld(lang, c) {
  const url = ORIGIN + EDITORIAL_PATHS[lang];
  return [{
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: c.h1,
    description: c.desc,
    url,
    inLanguage: HTML_LANG[lang],
    dateModified: UPDATED,
    publisher: { '@type': 'Organization', name: 'STOAIX', url: ORIGIN, publishingPrinciples: url },
  }];
}

export function editorialPage(lang) {
  const c = COPY[lang];
  return renderPost({
    lang,
    htmlLang: HTML_LANG[lang],
    title: c.title,
    desc: c.desc,
    canonical: ORIGIN + EDITORIAL_PATHS[lang],
    alternates: alternates(),
    ld: ld(lang, c),
    section: null,
    modified: UPDATED,
    lede: c.lede,
    hero: { h1: esc(c.h1) },
    plainH1: c.h1,
    content: toHtml(c.body),
    css: '',
  });
}

export const EDITORIAL_FILES = {
  'yayin-ilkeleri.html': () => editorialPage('tr'),
  'en/editorial-policy.html': () => editorialPage('en'),
  'de/redaktionsrichtlinien.html': () => editorialPage('de'),
};
