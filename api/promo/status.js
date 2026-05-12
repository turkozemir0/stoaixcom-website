import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).setHeaders(CORS).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v))

  try {
    const { data } = await supabase
      .from('site_config')
      .select('value')
      .eq('key', 'promo_popup_enabled')
      .single()

    return res.status(200).json({ enabled: data?.value === true })
  } catch (err) {
    console.error('Promo status error:', err)
    // Default to disabled on error
    return res.status(200).json({ enabled: false })
  }
}
