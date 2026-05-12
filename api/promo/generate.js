import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function generateCode(firstName) {
  const name = (firstName || 'STOAIX')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .substring(0, 8) || 'STOAIX'
  const digits = String(Math.floor(1000 + Math.random() * 9000))
  return name + digits
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).setHeaders(CORS).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v))

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
