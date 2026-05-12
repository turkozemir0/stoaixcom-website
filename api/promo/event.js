import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const VALID_EVENTS = ['popup_shown', 'popup_dismissed', 'form_submitted', 'code_copied']
const VALID_TYPES = ['timed', 'exit_intent']

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).setHeaders(CORS).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v))

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
    return res.status(200).json({ ok: true }) // fire-and-forget, don't fail client
  }
}
