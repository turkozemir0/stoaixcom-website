/* Asistanlar sayfası (hub) — her pazarın giriş sayfası; ürünleri işe göre gruplar. */
export default {
  id: 'hub',
  slugs: { en: 'ai-assistants', au: 'ai-assistants', de: 'ki-assistenten', tr: 'yapay-zeka-asistanlari' },
  rules: ['data', 'ai', 'marketing'],

  en: {
    name: 'AI assistants',
    title: 'AI Assistants for Clinics: Calls, Leads, Reminders | STOAIX',
    desc: 'Eleven AI assistants for private clinics: AI receptionist, WhatsApp chatbot, lead follow-up, appointment reminders, reactivation, reviews and aftercare. Open prices.',
    eyebrow: 'STOAIX · AI assistants for clinics',
    proof: 'Open pricing · 30-day money-back',
    h1: 'AI assistants for every step between the first enquiry and the follow-up visit.',
    lede: 'STOAIX gives private clinics AI assistants that each do one job: answer calls, reply on WhatsApp, follow up leads, confirm appointments, bring back old enquiries, collect reviews and look after patients before and after treatment. You choose the ones you need and pay a fixed monthly price for each.',
    whatH: 'Which AI assistant does a clinic need first?',
    what: [
      'Most clinics start with the AI receptionist, because unanswered calls and slow replies are where the most patients are lost.',
      'Clinics with a full calendar but empty chairs usually add appointment reminders next. Clinics with a large list of old enquiries add reactivation. Every assistant shares the same CRM and patient history, so adding one later does not mean starting again.',
    ],
    groups: [
      { h: 'Sales: no enquiry left unanswered', ids: ['receptionist', 'chatbot', 'followup', 'reminders', 'reactivation'], alt: true },
      { h: 'Loyalty: before and after treatment', ids: ['reviews', 'preop', 'aftercare'], alt: false },
      { h: 'Marketing and the CRM underneath', ids: ['ads', 'growth', 'crm'], alt: true },
    ],
    faq: [
      ['How much do STOAIX AI assistants cost?', 'Each assistant has a fixed monthly price, from $100 a month for appointment reminders to $500 a month for reactivation or the Growth Manager. Written and voice versions are priced separately, the STOAIX CRM is included free, and the annual plan is 20% cheaper.'],
      ['Can I combine several assistants?', 'Yes. Every assistant works on the same CRM and patient history. Taking the receptionist, follow-up and appointment assistants together saves $50 a month on written or $100 a month on voice.'],
      ['Do I have to change my practice software?', 'No. STOAIX connects to the calendar or clinic software you already use, at no extra charge.'],
      ['Which countries do you work in?', 'STOAIX Ltd is based in London and works with clinics across the UK, Europe, Türkiye, the Gulf and North America. The assistants reply in the patient’s language.'],
      ['Is there a free trial?', 'Instead of a trial there is a 30-day money-back guarantee: success criteria are agreed in writing at setup, and if they are not met you get your money back.'],
    ],
  },

  au: {
    title: 'AI Assistants for Australian Clinics & Practices | STOAIX',
    desc: 'AI receptionist, WhatsApp and SMS follow-up, appointment reminders, recalls, reviews and aftercare for Australian dental, medical and allied health practices.',
    eyebrow: 'STOAIX · Australia',
    h1: 'AI assistants for Australian practices, from the first call to the recall.',
    lede: 'STOAIX gives dental, medical, cosmetic and allied health practices in Australia AI assistants that each do one job: answer calls, reply to messages, follow up enquiries, confirm appointments, run recalls, collect feedback and look after patients before and after treatment. You choose the ones you need and pay a fixed monthly price for each.',
    faq: [
      ['How much do STOAIX AI assistants cost in Australia?', 'Each assistant has a fixed monthly price in US dollars, from US$100 a month for appointment reminders to US$500 a month for reactivation or the Growth Manager. The STOAIX CRM is included free and the annual plan is 20% cheaper.'],
      ['Can I combine several assistants?', 'Yes. Every assistant shares one CRM and patient history. Taking the receptionist, follow-up and appointment assistants together saves US$50 a month on written or US$100 a month on voice.'],
      ['Do I have to change my practice software?', 'No. STOAIX connects to the calendar or practice system you already use, at no extra charge. We check compatibility in the intro call.'],
      ['How do the assistants handle Ahpra advertising rules?', 'Review requests are neutral, sent to every patient the same way and carry no incentive, and STOAIX never republishes patient testimonials in your advertising.'],
      ['Is there a free trial?', 'Instead of a trial there is a 30-day money-back guarantee against success criteria agreed in writing at setup.'],
    ],
  },

  de: {
    name: 'KI-Assistenten',
    title: 'KI-Assistenten für Arzt- & Zahnarztpraxen | STOAIX',
    desc: 'KI-Telefonassistent, WhatsApp-Chatbot, Terminerinnerung, Nachfassen, Reaktivierung, Bewertungen und Nachsorge für Praxen. Feste Monatspreise, DSGVO-AV-Vertrag.',
    eyebrow: 'STOAIX · KI-Assistenten für Praxen',
    proof: 'Offene Preise · 30 Tage Geld zurück',
    h1: 'KI-Assistenten für jeden Schritt von der ersten Anfrage bis zur Nachsorge.',
    lede: 'STOAIX stellt Arzt-, Zahnarzt- und Privatpraxen KI-Assistenten bereit, die jeweils eine Aufgabe übernehmen: Anrufe annehmen, auf WhatsApp antworten, Anfragen nachfassen, Termine bestätigen, alte Kontakte reaktivieren, Bewertungen einholen und Patienten vor und nach der Behandlung begleiten. Sie wählen, was Sie brauchen, und zahlen pro Assistent einen festen Monatspreis.',
    whatH: 'Mit welchem KI-Assistenten sollte eine Praxis anfangen?',
    what: [
      'Die meisten Praxen beginnen mit dem KI-Telefonassistenten, weil unbeantwortete Anrufe und späte Rückrufe die meisten Patientinnen und Patienten kosten.',
      'Praxen mit vollem Kalender, aber vielen Ausfällen ergänzen danach die Terminerinnerung; Praxen mit vielen alten Anfragen die Reaktivierung. Alle Assistenten teilen dasselbe CRM und dieselbe Patientenhistorie.',
    ],
    groups: [
      { h: 'Vertrieb: keine Anfrage bleibt liegen', ids: ['receptionist', 'chatbot', 'followup', 'reminders', 'reactivation'], alt: true },
      { h: 'Bindung: vor und nach der Behandlung', ids: ['reviews', 'preop', 'aftercare'], alt: false },
      { h: 'Marketing und das CRM dahinter', ids: ['ads', 'growth', 'crm'], alt: true },
    ],
    faq: [
      ['Was kosten die KI-Assistenten von STOAIX?', 'Jeder Assistent hat einen festen Monatspreis, von $100 für die Terminerinnerung bis $500 für Reaktivierung oder den Growth Manager. Text- und Telefonvariante werden getrennt berechnet, das STOAIX CRM ist kostenlos enthalten, der Jahresvertrag ist 20 % günstiger.'],
      ['Sind die Assistenten DSGVO-konform einsetzbar?', 'STOAIX arbeitet als Auftragsverarbeiter mit AV-Vertrag nach Art. 28 DSGVO; die Praxis bleibt Verantwortliche und Eigentümerin aller Daten. Die Assistenten geben sich zu Beginn jedes Gesprächs als KI zu erkennen.'],
      ['Muss ich meine Praxissoftware wechseln?', 'Nein. STOAIX wird an den Kalender oder die Praxissoftware angebunden, die Sie nutzen, ohne Aufpreis.'],
      ['Sprechen die Assistenten Deutsch?', 'Ja. Sie antworten in der Sprache der Patientin oder des Patienten, auf Deutsch, Englisch, Türkisch und in weiteren gängigen Sprachen.'],
      ['Gibt es eine Testphase?', 'Statt einer Testphase gibt es eine 30-Tage-Geld-zurück-Garantie auf die beim Start schriftlich vereinbarten Erfolgskriterien.'],
    ],
  },

  tr: {
    name: 'Yapay zekâ asistanları',
    title: 'Klinikler İçin Yapay Zekâ Asistanları | STOAIX',
    desc: 'Klinikler için yapay zekâ resepsiyonist, WhatsApp, hasta adayı takibi, randevu hatırlatma, eski hasta canlandırma, Google yorum ve bakım asistanı. Açık fiyat.',
    eyebrow: 'STOAIX · Klinikler için yapay zekâ asistanları',
    proof: 'Açık fiyat · 30 gün para iade',
    h1: 'İlk mesajdan kontrol randevusuna, her adım için bir yapay zekâ asistanı.',
    lede: 'STOAIX özel kliniklere her biri tek bir işi yapan yapay zekâ asistanları sunar: aramayı açar, WhatsApp’a cevap verir, hasta adayını takip eder, randevuyu teyit eder, eski adayları geri getirir, yorum toplar, hastaya tedavi öncesi ve sonrası eşlik eder. İhtiyacınız olanı seçer, her biri için sabit aylık ücret ödersiniz.',
    whatH: 'Bir klinik hangi yapay zekâ asistanıyla başlamalı?',
    what: [
      'Çoğu klinik yapay zekâ resepsiyonistle başlar; en çok hasta açılmayan aramada ve geç verilen cevapta kaybedilir.',
      'Takvimi dolu ama koltuğu boş kalan klinikler ardından randevu hatırlatmayı, eski aday listesi büyük olanlar canlandırmayı ekler. Tüm asistanlar aynı CRM’i ve aynı hasta geçmişini kullanır; sonradan eklemek sıfırdan başlamak demek değildir.',
    ],
    groups: [
      { h: 'Satış: hiçbir talep cevapsız kalmaz', ids: ['receptionist', 'chatbot', 'followup', 'reminders', 'reactivation'], alt: true },
      { h: 'Sadakat: tedavi öncesi ve sonrası', ids: ['reviews', 'preop', 'aftercare'], alt: false },
      { h: 'Pazarlama ve altındaki CRM', ids: ['ads', 'growth', 'crm'], alt: true },
      { h: 'Ne arıyorsanız: aynı sistemin diğer adları', ids: ['cagri-merkezi', 'randevu-otomasyonu', 'satis-otomasyonu', 'klinik-yapay-zeka', 'whatsapp-otomasyonu', 'instagram-dm', 'sozluk'], alt: false },
      { h: 'Sağlık turizmi, branşlar ve mevzuat', ids: ['st-yapay-zeka', 'st-call-center', 'st-crm', 'st-reklam', 'st-hasta-bulma', 'dis-crm', 'dis-reklam', 'sac-crm', 'sac-reklam', 'reklam-yasagi'], alt: true },
    ],
    faq: [
      ['STOAIX yapay zekâ asistanlarının fiyatı ne kadar?', 'Her asistanın sabit aylık fiyatı vardır: randevu hatırlatma ayda $100’dan, canlandırma ya da Büyüme Yöneticisi ayda $500’a kadar. Yazılı ve sesli seçenekler ayrı fiyatlanır, STOAIX CRM ücretsiz gelir, yıllık anlaşma %20 daha ucuzdur.'],
      ['Birden fazla asistanı birlikte kullanabilir miyim?', 'Evet. Tüm asistanlar aynı CRM ve hasta geçmişiyle çalışır. Resepsiyonist, Takip Uzmanı ve Randevu Asistanı birlikte alındığında yazılıda ayda $50, seslide ayda $100 indirim uygulanır.'],
      ['Klinik yazılımımı değiştirmem gerekir mi?', 'Hayır. STOAIX kullandığınız takvime ya da klinik yazılımına ek ücret olmadan bağlanır.'],
      ['Hangi ülkelerde çalışıyorsunuz?', 'STOAIX Ltd Londra merkezlidir; Türkiye, Birleşik Krallık, Avrupa, Körfez ve Kuzey Amerika’daki kliniklerle çalışır. Asistanlar hastanın dilinde cevap verir.'],
      ['Ücretsiz deneme var mı?', 'Deneme yerine 30 gün para iade garantisi var: başarı kriteri kurulumda yazılı olarak belirlenir, karşılanmazsa ücretiniz iade edilir.'],
    ],
  },
};
