import { createClient } from '@supabase/supabase-js'

// NOTE: This endpoint now only serves `validate`, which is used by the
// checkout page ("Have a promo code?" field) to redeem existing promo
// codes. The old discount-popup actions (generate / status / event)
// were removed when that popup was retired. Do not break `validate` —
// it is part of the live payment/checkout flow.

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
    case 'validate': return handleValidate(req, res)
    default:         return res.status(404).json({ error: 'Not found' })
  }
}

// ── validate (checkout promo-code redemption) ───────────────
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
