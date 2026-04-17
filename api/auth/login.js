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

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v))
    return res.status(204).end()
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v))

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    // Sign in with password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    })

    if (authError) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Check conversion status in signup_leads
    const { data: lead } = await supabase
      .from('signup_leads')
      .select('converted, first_name, last_name, company, plan, billing')
      .eq('email', email.toLowerCase())
      .single()

    if (lead?.converted) {
      // Already converted — generate magic link to platform dashboard
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: email.toLowerCase(),
        options: {
          redirectTo: 'https://platform.stoaix.com/dashboard',
        },
      })

      return res.status(200).json({
        success: true,
        converted: true,
        redirect_url: linkData?.properties?.action_link || 'https://platform.stoaix.com/login',
      })
    }

    // Not converted — return signup data so frontend can redirect to checkout
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
