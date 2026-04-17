import { createClient } from '@supabase/supabase-js'
import { sendEvent, getClientIp, getUserAgent } from '../_lib/fb-capi.js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v))
    return res.status(204).end()
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v))

  const { email, code, fbc, fbp } = req.body

  if (!email || !code) {
    return res.status(400).json({ error: 'Missing email or code' })
  }

  try {
    // Find matching code
    const { data, error } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('code', code)
      .single()

    if (error || !data) {
      return res.status(400).json({ error: 'Invalid verification code' })
    }

    // Check expiry
    if (new Date(data.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Code has expired. Please request a new one.' })
    }

    // Check already verified
    if (data.verified) {
      return res.status(200).json({ success: true })
    }

    // Mark as verified
    const { error: updateError } = await supabase
      .from('email_verifications')
      .update({ verified: true })
      .eq('id', data.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return res.status(500).json({ error: 'Failed to verify code' })
    }

    // Mark lead as email verified
    const { data: leadData } = await supabase
      .from('signup_leads')
      .update({ email_verified: true, verified_at: new Date().toISOString() })
      .eq('email', email.toLowerCase())
      .select('first_name, last_name, plan')
      .single()

    // Send FB CAPI Lead event
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
