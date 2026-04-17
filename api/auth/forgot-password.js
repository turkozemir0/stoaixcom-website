import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

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

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v))
    return res.status(204).end()
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v))

  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  try {
    // Generate recovery link (always returns success to not leak user existence)
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email.toLowerCase(),
      options: {
        redirectTo: 'https://stoaix.com/reset-password',
      },
    })

    if (!linkError && linkData?.properties?.action_link) {
      // Send branded email via Resend
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

    // Always return success (don't reveal if email exists)
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Forgot password error:', err)
    // Still return success to not leak info
    return res.status(200).json({ success: true })
  }
}
