import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { parsePhoneNumberFromString } from 'libphonenumber-js/max'
import { promises as dns } from 'dns'
import { sendEvent, getClientIp, getUserAgent } from '../_lib/fb-capi.js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const resend = new Resend(process.env.RESEND_API_KEY)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function setCors(res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v))
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    setCors(res)
    return res.status(204).end()
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  setCors(res)

  const { action } = req.query

  switch (action) {
    case 'send-otp':        return handleSendOtp(req, res)
    case 'verify-otp':      return handleVerifyOtp(req, res)
    case 'login':           return handleLogin(req, res)
    case 'forgot-password': return handleForgotPassword(req, res)
    case 'capi':            return handleCapi(req, res)
    case 'demo-lead':       return handleDemoLead(req, res)
    default:               return res.status(404).json({ error: 'Not found' })
  }
}

// ── send-otp ──────────────────────────────────────────────
async function handleSendOtp(req, res) {
  const { email, recaptchaToken, firstName, lastName, company, plan, billing, phone } = req.body

  if (!email || !recaptchaToken) {
    return res.status(400).json({ error: 'Missing email or reCAPTCHA token' })
  }

  // Verify reCAPTCHA v3
  try {
    const recaptchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    })
    const recaptchaData = await recaptchaRes.json()

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return res.status(403).json({ error: 'reCAPTCHA verification failed. Please try again.' })
    }
  } catch (err) {
    console.error('reCAPTCHA error:', err)
    return res.status(500).json({ error: 'reCAPTCHA verification error' })
  }

  const code = String(Math.floor(100000 + Math.random() * 900000))
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

  try {
    await supabase
      .from('email_verifications')
      .delete()
      .eq('email', email.toLowerCase())

    const { error: insertError } = await supabase
      .from('email_verifications')
      .insert({
        email: email.toLowerCase(),
        code,
        expires_at: expiresAt,
        verified: false,
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      return res.status(500).json({ error: 'Failed to save verification code' })
    }

    await supabase
      .from('signup_leads')
      .upsert({
        email: email.toLowerCase(),
        first_name: firstName || null,
        last_name: lastName || null,
        company: company || null,
        phone: phone || null,
        plan: plan || null,
        billing: billing || null,
      }, { onConflict: 'email' })

    const { error: emailError } = await resend.emails.send({
      from: 'STOAIX <noreply@stoaix.com>',
      to: email,
      subject: 'Your STOAIX verification code',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="https://stoaix.com/assets/logo-iconwithname.svg" alt="STOAIX" height="32" />
          </div>
          <h1 style="font-size: 22px; font-weight: 700; color: #1e293b; text-align: center; margin-bottom: 8px;">
            Verify your email
          </h1>
          <p style="font-size: 15px; color: #64748b; text-align: center; margin-bottom: 32px; line-height: 1.5;">
            Enter this code to continue creating your STOAIX account.
          </p>
          <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
            <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1e293b;">${code}</span>
          </div>
          <p style="font-size: 13px; color: #94a3b8; text-align: center; line-height: 1.5;">
            This code expires in 5 minutes.<br />
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      return res.status(500).json({ error: 'Failed to send verification email' })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('send-otp error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// ── verify-otp ────────────────────────────────────────────
async function handleVerifyOtp(req, res) {
  const { email, code, password, fbc, fbp } = req.body

  if (!email || !code) {
    return res.status(400).json({ error: 'Missing email or code' })
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' })
  }

  try {
    const { data, error } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('code', code)
      .single()

    if (error || !data) {
      return res.status(400).json({ error: 'Invalid verification code' })
    }

    if (new Date(data.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Code has expired. Please request a new one.' })
    }

    if (data.verified) {
      return res.status(200).json({ success: true })
    }

    const { error: updateError } = await supabase
      .from('email_verifications')
      .update({ verified: true })
      .eq('id', data.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return res.status(500).json({ error: 'Failed to verify code' })
    }

    const { data: leadData } = await supabase
      .from('signup_leads')
      .update({ email_verified: true, verified_at: new Date().toISOString() })
      .eq('email', email.toLowerCase())
      .select('first_name, last_name, plan, company, phone')
      .single()

    // Auth user is NOT created here — it's created in /api/stripe/subscribe
    // alongside Stripe + org + org_user to keep them atomic.

    sendEvent({
      eventName: 'Lead',
      email: email.toLowerCase(),
      firstName: leadData?.first_name,
      lastName: leadData?.last_name,
      value: 10,
      sourceUrl: 'https://stoaix.com/signup',
      clientIp: getClientIp(req),
      clientUserAgent: getUserAgent(req),
      fbc,
      fbp,
      contentName: leadData?.plan ? `${leadData.plan} Plan` : undefined,
      contentCategory: 'subscription',
    }).catch(() => {})

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('verify-otp error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// ── login ─────────────────────────────────────────────────
async function handleLogin(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    })

    if (authError) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const { data: lead } = await supabase
      .from('signup_leads')
      .select('converted, first_name, last_name, company, plan, billing')
      .eq('email', email.toLowerCase())
      .single()

    if (lead?.converted) {
      const { data: linkData } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: email.toLowerCase(),
        options: {
          redirectTo: 'https://platform.stoaix.com/auth/callback?next=/dashboard',
        },
      })

      return res.status(200).json({
        success: true,
        converted: true,
        redirect_url: linkData?.properties?.action_link || 'https://platform.stoaix.com/login',
      })
    }

    return res.status(200).json({
      success: true,
      converted: false,
      signup_data: {
        firstName: lead?.first_name || '',
        lastName: lead?.last_name || '',
        company: lead?.company || '',
        plan: lead?.plan || 'business',
        billing: lead?.billing || 'monthly',
        email: email.toLowerCase(),
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// ── forgot-password ───────────────────────────────────────
async function handleForgotPassword(req, res) {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  try {
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email.toLowerCase(),
      options: {
        redirectTo: 'https://stoaix.com/reset-password',
      },
    })

    if (!linkError && linkData?.properties?.action_link) {
      await resend.emails.send({
        from: 'STOAIX <no-reply@stoaix.com>',
        to: email.toLowerCase(),
        subject: 'Reset your STOAIX password',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <img src="https://stoaix.com/assets/logo-iconwithname.svg" alt="STOAIX" style="height: 28px; margin-bottom: 32px;" />
            <h2 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 12px;">Reset your password</h2>
            <p style="font-size: 0.9rem; color: #64748b; line-height: 1.6; margin-bottom: 24px;">
              We received a request to reset your password. Click the button below to set a new one. This link expires in 1 hour.
            </p>
            <a href="${linkData.properties.action_link}" style="display: inline-block; padding: 12px 28px; background: #2563eb; color: #fff; font-size: 0.9rem; font-weight: 600; text-decoration: none; border-radius: 8px;">
              Reset password
            </a>
            <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 32px; line-height: 1.5;">
              If you didn't request this, you can safely ignore this email. Your password won't be changed.
            </p>
          </div>
        `,
      })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Forgot password error:', err)
    return res.status(200).json({ success: true })
  }
}

// ── capi (VSL funnel → Meta Conversions API) ────────────────
//
// 🔑 NEDEN BU DOSYADA: Vercel'de fonksiyon sayısı sınırına dayanıldı
//   (12/12). Ayrı bir `api/ads/track.js` açmak dağıtımı kırardı, bu
//   yüzden mevcut yönlendiriciye yeni bir eylem olarak eklendi.
//
// 🔑 NEDEN SUNUCUDAN DA GÖNDERİYORUZ: tarayıcıdaki Meta pikselinin
//   önemli bir kısmı reklam engelleyici, iOS izleme koruması ve
//   Instagram içi tarayıcının kısıtları yüzünden Meta'ya hiç ulaşmıyor.
//   Sunucu tarafı olay o boşluğu kapatıyor. Piksel ile AYNI `eventId`
//   gönderiliyor; Meta iki kaydı tekilleştiriyor, dönüşüm çift sayılmaz.
const CAPI_EVENTS = new Set(['Lead', 'ViewContent', 'CompleteRegistration', 'InitiateCheckout'])
const CAPI_ORIGINS = new Set(['https://stoaix.com', 'https://www.stoaix.com'])

async function handleCapi(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Olay adı beyaz listeden. Uç herkese açık; rastgele olay adıyla
  // piksel verisini kirletebilmek istemiyoruz.
  const b = req.body || {}
  const eventName = String(b.eventName || '')
  if (!CAPI_EVENTS.has(eventName)) {
    return res.status(400).json({ error: 'Unsupported event' })
  }

  // Origin kontrolü zayıf bir kapı (sunucudan taklit edilebilir) ama
  // tarayıcıdan gelen kötüye kullanımı elemeye yetiyor. Yerel geliştirme
  // ve Origin göndermeyen sendBeacon çağrıları için yokluğu serbest.
  const origin = req.headers.origin
  if (origin && !CAPI_ORIGINS.has(origin)) {
    return res.status(403).json({ error: 'Forbidden origin' })
  }

  try {
    await sendEvent({
      eventName,
      eventId: b.eventId ? String(b.eventId).slice(0, 80) : undefined,
      email: b.email ? String(b.email).slice(0, 200) : undefined,
      value: Number.isFinite(Number(b.value)) ? Number(b.value) : 0,
      currency: b.currency === 'GBP' || b.currency === 'USD' || b.currency === 'EUR'
        ? b.currency
        : 'GBP',
      sourceUrl: b.sourceUrl ? String(b.sourceUrl).slice(0, 500) : 'https://stoaix.com/reklam',
      contentName: b.contentName ? String(b.contentName).slice(0, 120) : undefined,
      contentCategory: b.contentCategory ? String(b.contentCategory).slice(0, 60) : undefined,
      fbc: b.fbc ? String(b.fbc).slice(0, 200) : undefined,
      fbp: b.fbp ? String(b.fbp).slice(0, 200) : undefined,
      // Tarayıcıdaki kalıcı anonim kimlik (`window.__stxEid`). Piksel aynı
      // ham değeri Advanced Matching ile gönderiyor; eşleşmenin tutması
      // için burada DEĞİŞTİRİLMEDEN geçiyor, hash'i `fb-capi.js` atıyor.
      externalId: b.externalId ? String(b.externalId).slice(0, 100) : undefined,
      clientIp: getClientIp(req),
      clientUserAgent: getUserAgent(req),
    })
  } catch (err) {
    // Ölçüm hatası ziyaretçiyi ilgilendirmiyor: sessizce logla, 200 dön.
    console.error('CAPI relay error:', err)
  }

  // sendBeacon yanıtı okumuyor; gövdesiz 204 en ucuzu.
  return res.status(204).end()
}

// ── demo-lead (site geneli "sitenize özel demo" popup'ı) ─────
//
// 🔑 NEDEN BU DOSYADA: fonksiyon sınırı 12/12 (bkz. capi). Popup
//   `js/demo-popup.js` içinde; iki adımda web sitesi + cep numarası alır.
//
// 🔑 VERİTABANI YOK (sahip kararı): lead yalnızca düz metin e-posta
//   olarak ekibe gider. Gönderim başarısız olursa lead kaybolmasın diye
//   tüm alanlar önce Vercel loguna yazılıyor.
//
// Numara kontrolü libphonenumber'ın "max" metaverisiyle yapılır: ülkenin
// numaralandırma planına uymayan, cep hattı olmayan ya da 5555555555 gibi
// uydurma desenler reddedilir. Hattın operatörde AKTİF olduğunu
// söyleyemez — bu bilinçli bir sınır (HLR/OTP sürtünme ve maliyet getirir).
const DEMO_LEAD_TO = ['emir@stoaix.co.uk', 'ata@stoaix.co.uk']
const DEMO_COUNTRIES = new Set(['TR', 'GB', 'DE', 'AU', 'IE', 'US', 'CA', 'NL', 'FR', 'AE', 'SA', 'AZ', 'CY', 'AT', 'CH'])
const DEMO_MOBILE_TYPES = new Set(['MOBILE', 'FIXED_LINE_OR_MOBILE'])
// Canlı alan adları + önizleme dağıtımları + yerel test.
const DEMO_ORIGIN_RE = /^(https:\/\/(www\.)?stoaix\.com|https:\/\/[a-z0-9-]+\.vercel\.app|http:\/\/(localhost|127\.0\.0\.1)(:\d+)?)$/

// Sıcak örnek boyunca yaşayan basit sınırlar (Fluid Compute örneği yeniden
// kullanıyor). Kesin değil ama aynı tarayıcıdan art arda tıklamayı ve
// aynı numaranın ekibe iki kez düşmesini eler.
const demoHits = new Map()   // ip → [zaman damgaları]
const demoSeen = new Map()   // e164 → zaman damgası

function demoRateLimited(ip) {
  const now = Date.now()
  const list = (demoHits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000)
  list.push(now)
  demoHits.set(ip, list)
  if (demoHits.size > 5000) demoHits.clear()
  return list.length > 8
}

export function normalizeWebsite(raw) {
  let s = String(raw || '').trim().toLowerCase().replace(/\s+/g, '')
  if (!s || s.length > 200) return null
  if (!/^https?:\/\//.test(s)) s = 'https://' + s
  try {
    const u = new URL(s)
    const host = u.hostname.replace(/^www\./, '')
    // En az bir nokta ve harfli bir uzantı (klinik.com, x.com.tr, ...).
    if (!/^([a-z0-9-]+\.)+[a-z¡-￿]{2,}$/i.test(host)) return null
    return { host, url: u.origin + (u.pathname === '/' ? '' : u.pathname) }
  } catch {
    return null
  }
}

// Formata uyan ama elle uydurulmuş numaralar: tek/iki rakamın tekrarı
// (5555555555, 5050505050) veya abone kısmının düz sırası (…1234567).
function looksFake(nationalNumber) {
  const d = String(nationalNumber)
  if (new Set(d).size <= 2) return true
  if (/(\d)\1{6,}/.test(d)) return true
  const tail = d.slice(-7)
  return '0123456789'.includes(tail) || '9876543210'.includes(tail)
}

export function checkDemoPhone(raw, country) {
  let s = String(raw || '').trim()
  if (s.startsWith('00')) s = '+' + s.slice(2)
  const digits = s.replace(/\D/g, '')
  if (digits.length < 6 || digits.length > 16) return { error: 'phone_invalid' }
  const cc = DEMO_COUNTRIES.has(country) ? country : 'GB'
  const p = parsePhoneNumberFromString(s, s.startsWith('+') ? undefined : cc)
  if (!p || !p.isValid() || looksFake(p.nationalNumber)) return { error: 'phone_invalid' }
  if (!DEMO_MOBILE_TYPES.has(p.getType())) return { error: 'phone_not_mobile' }
  return { e164: p.number, intl: p.formatInternational(), country: p.country }
}

async function handleDemoLead(req, res) {
  const origin = req.headers.origin
  if (origin && !DEMO_ORIGIN_RE.test(origin)) {
    return res.status(403).json({ error: 'forbidden' })
  }

  const b = req.body || {}
  // Bal küpü alanı (görünmez) doluysa ya da form 2 saniyeden kısa sürede
  // gönderildiyse bottur: başarı dönüp sessizce at, ipucu verme.
  if (b.company_url || Number(b.elapsed) < 2000) {
    return res.status(200).json({ ok: true })
  }

  const ip = getClientIp(req) || 'unknown'
  if (demoRateLimited(ip)) return res.status(429).json({ error: 'rate_limited' })

  const site = normalizeWebsite(b.website)
  if (!site) return res.status(400).json({ error: 'website_invalid' })

  const phone = checkDemoPhone(b.phone, String(b.country || '').toUpperCase())
  if (phone.error) return res.status(400).json({ error: phone.error })

  const lang = ['tr', 'en', 'de'].includes(b.lang) ? b.lang : 'en'
  const page = b.page ? String(b.page).slice(0, 300) : '-'
  const referrer = b.referrer ? String(b.referrer).slice(0, 300) : '-'

  // Alan adı DNS'te yoksa lead yine geçer (yazım hatası olabilir, numara
  // elimizde) ama ekip bunu e-postada görür.
  let dnsOk = true
  try {
    await Promise.race([
      dns.lookup(site.host),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 1500)),
    ])
  } catch {
    dnsOk = false
  }

  const lead = {
    website: site.url,
    host: site.host,
    phone: phone.e164,
    phoneCountry: phone.country,
    lang,
    page,
    referrer,
    dnsOk,
    ip,
    at: new Date().toISOString(),
  }
  console.log('[demo-lead]', JSON.stringify(lead))

  const prev = demoSeen.get(phone.e164)
  const duplicate = prev && Date.now() - prev < 30 * 60 * 1000
  demoSeen.set(phone.e164, Date.now())
  if (demoSeen.size > 5000) demoSeen.clear()

  if (!duplicate) {
    const when = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })
    const text = [
      'Yeni demo talebi',
      '',
      `Web sitesi: ${site.url}${dnsOk ? '' : '  (UYARI: alan adı DNS\'te bulunamadı, yazım hatası olabilir)'}`,
      `Telefon:    ${phone.intl} (${phone.country})`,
      `WhatsApp:   https://wa.me/${phone.e164.slice(1)}`,
      '',
      `Dil:        ${lang}`,
      `Sayfa:      ${page}`,
      `Önceki:     ${referrer}`,
      `Zaman:      ${when} (TR)`,
    ].join('\n')

    try {
      const { error } = await resend.emails.send({
        from: 'STOAIX <noreply@stoaix.com>',
        to: DEMO_LEAD_TO,
        subject: `Demo talebi: ${site.host}`,
        text,
      })
      if (error) console.error('[demo-lead] resend error:', error)
    } catch (err) {
      console.error('[demo-lead] resend throw:', err)
    }
  }

  try {
    await sendEvent({
      eventName: 'Lead',
      eventId: b.eventId ? String(b.eventId).slice(0, 80) : undefined,
      phone: phone.e164,
      sourceUrl: page !== '-' ? page : 'https://stoaix.com/',
      contentName: 'demo-popup',
      currency: lang === 'tr' ? 'USD' : 'GBP',
      fbc: b.fbc ? String(b.fbc).slice(0, 200) : undefined,
      fbp: b.fbp ? String(b.fbp).slice(0, 200) : undefined,
      clientIp: getClientIp(req),
      clientUserAgent: getUserAgent(req),
    })
  } catch (err) {
    console.error('[demo-lead] capi error:', err)
  }

  return res.status(200).json({ ok: true, phone: phone.intl })
}
