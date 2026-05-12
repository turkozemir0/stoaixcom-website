import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
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
  setCors(res)

  const { action } = req.query

  switch (action) {
    case 'generate': return handleGenerate(req, res)
    case 'validate': return handleValidate(req, res)
    case 'status':   return handleStatus(req, res)
    case 'event':    return handleEvent(req, res)
    default:         return res.status(404).json({ error: 'Not found' })
  }
}

// ── generate ────────────────────────────────────────────────
function generateCode(firstName) {
  const name = (firstName || 'STOAIX')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .substring(0, 8) || 'STOAIX'
  const digits = String(Math.floor(1000 + Math.random() * 9000))
  return name + digits
}

async function handleGenerate(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { firstName, lastName, phone, popupType, visitorId, recaptchaToken } = req.body

  if (!firstName || !lastName || !phone || !popupType || !recaptchaToken) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if (!['timed', 'exit_intent'].includes(popupType)) {
    return res.status(400).json({ error: 'Invalid popup type' })
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
      return res.status(403).json({ error: 'reCAPTCHA verification failed' })
    }
  } catch (err) {
    console.error('reCAPTCHA error:', err)
    return res.status(500).json({ error: 'reCAPTCHA verification error' })
  }

  try {
    // Abuse prevention: return existing code for same visitorId
    if (visitorId) {
      const { data: existing } = await supabase
        .from('promo_codes')
        .select('code, expires_at')
        .eq('visitor_id', visitorId)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (existing) {
        return res.status(200).json({
          success: true,
          code: existing.code,
          expiresAt: existing.expires_at,
        })
      }
    }

    // IP rate limit: max 3 codes per IP per 24h
    const ip = (req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '').split(',')[0].trim()
    if (ip) {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { count } = await supabase
        .from('promo_codes')
        .select('id', { count: 'exact', head: true })
        .eq('ip_address', ip)
        .gte('created_at', since)

      if (count >= 3) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' })
      }
    }

    // Expiry: timed = 60 min, exit_intent = 12 hours
    const expiryMs = popupType === 'timed' ? 60 * 60 * 1000 : 12 * 60 * 60 * 1000
    const expiresAt = new Date(Date.now() + expiryMs).toISOString()

    // Generate unique code with retry (unique constraint protection)
    let code, inserted = false
    for (let attempt = 0; attempt < 5; attempt++) {
      code = generateCode(firstName)
      const { error } = await supabase
        .from('promo_codes')
        .insert({
          code,
          first_name: firstName,
          last_name: lastName,
          phone,
          popup_type: popupType,
          expires_at: expiresAt,
          visitor_id: visitorId || null,
          ip_address: ip || null,
        })
      if (!error) { inserted = true; break }
      if (error.code !== '23505') throw error // 23505 = unique_violation
    }

    if (!inserted) {
      return res.status(500).json({ error: 'Code generation failed. Please try again.' })
    }

    // Create Stripe promotion code (single-use)
    const couponId = process.env.STRIPE_COUPON_10PCT_ID
    if (couponId) {
      try {
        const promoCode = await stripe.promotionCodes.create({
          coupon: couponId,
          code,
          max_redemptions: 1,
          expires_at: Math.floor((Date.now() + expiryMs) / 1000),
        })

        // Save Stripe promo ID back
        await supabase
          .from('promo_codes')
          .update({ stripe_promo_id: promoCode.id })
          .eq('code', code)
      } catch (stripeErr) {
        console.error('Stripe promo creation error:', stripeErr)
        // Non-fatal: code exists in DB, Stripe promo just failed
      }
    }

    // Notify CEO — fire-and-forget
    const now = new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })
    resend.emails.send({
      from: 'STOAIX <noreply@stoaix.com>',
      to: 'ataulufer1@gmail.com',
      subject: `Yeni Promo Lead: ${firstName} ${lastName}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;">
          <div style="text-align:center;margin-bottom:24px;">
            <img src="https://stoaix.com/assets/logo-iconwithname.svg" alt="STOAIX" height="28" />
          </div>
          <h2 style="font-size:18px;font-weight:700;color:#1e293b;margin:0 0 20px;text-align:center;">
            Yeni Promo Kod Talebi
          </h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;color:#334155;">
            <tr><td style="padding:8px 0;color:#64748b;width:120px;">Ad Soyad</td><td style="padding:8px 0;font-weight:600;">${firstName} ${lastName}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Telefon</td><td style="padding:8px 0;font-weight:600;">${phone}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Kod</td><td style="padding:8px 0;font-weight:700;color:#2563eb;font-size:16px;">${code}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Tür</td><td style="padding:8px 0;">${popupType === 'timed' ? '⏱ Zamanlı (30sn)' : '🚪 Exit Intent'}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Geçerlilik</td><td style="padding:8px 0;">${popupType === 'timed' ? '60 dakika' : '12 saat'}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Tarih</td><td style="padding:8px 0;">${now}</td></tr>
          </table>
          <div style="margin-top:24px;padding:12px 16px;background:#f0fdf4;border-radius:8px;font-size:13px;color:#166534;">
            💡 Bu kişiyi hemen arayarak dönüşüm şansını artırabilirsiniz.
          </div>
        </div>
      `,
    }).catch(err => console.error('Promo notification email error:', err))

    return res.status(200).json({
      success: true,
      code,
      expiresAt,
    })
  } catch (err) {
    console.error('Promo generate error:', err)
    return res.status(500).json({ error: err.message || 'Failed to generate promo code' })
  }
}

// ── validate ────────────────────────────────────────────────
async function handleValidate(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { code } = req.body
  if (!code) return res.status(400).json({ error: 'Missing code' })

  try {
    const { data: promo } = await supabase
      .from('promo_codes')
      .select('code, percent_off, expires_at, used, stripe_promo_id')
      .eq('code', code.toUpperCase())
      .single()

    if (!promo) {
      return res.status(200).json({ valid: false, reason: 'not_found' })
    }
    if (promo.used) {
      return res.status(200).json({ valid: false, reason: 'already_used' })
    }
    if (new Date(promo.expires_at) <= new Date()) {
      return res.status(200).json({ valid: false, reason: 'expired' })
    }
    if (!promo.stripe_promo_id) {
      return res.status(200).json({ valid: false, reason: 'not_ready' })
    }

    return res.status(200).json({
      valid: true,
      code: promo.code,
      percentOff: promo.percent_off,
      expiresAt: promo.expires_at,
    })
  } catch (err) {
    console.error('Promo validate error:', err)
    return res.status(500).json({ valid: false, reason: 'server_error' })
  }
}

// ── status (kill switch) ────────────────────────────────────
async function handleStatus(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { data } = await supabase
      .from('site_config')
      .select('value')
      .eq('key', 'promo_popup_enabled')
      .single()

    return res.status(200).json({ enabled: data?.value === true })
  } catch (err) {
    console.error('Promo status error:', err)
    return res.status(200).json({ enabled: false })
  }
}

// ── event (analytics) ───────────────────────────────────────
const VALID_EVENTS = ['popup_shown', 'popup_dismissed', 'form_submitted', 'code_copied']
const VALID_TYPES = ['timed', 'exit_intent']

async function handleEvent(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { event, popupType, visitorId, code } = req.body

  if (!event || !VALID_EVENTS.includes(event)) {
    return res.status(400).json({ error: 'Invalid event' })
  }

  if (popupType && !VALID_TYPES.includes(popupType)) {
    return res.status(400).json({ error: 'Invalid popup type' })
  }

  try {
    await supabase.from('promo_events').insert({
      event,
      popup_type: popupType || null,
      visitor_id: visitorId || null,
      code: code || null,
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Promo event error:', err)
    return res.status(200).json({ ok: true })
  }
}
